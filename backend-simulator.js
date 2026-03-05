import express from 'express';
import dotenv from 'dotenv';
import { AzureOpenAI } from "openai";
import axios from 'axios';
import formidable from 'formidable';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// HeyGen Token API
app.get('/api/heygen-token', async (req, res) => {
    const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;

    try {
        const response = await axios.post('https://api.heygen.com/v1/streaming.create_token', null, {
            headers: {
                'x-api-key': HEYGEN_API_KEY
            }
        });
        res.json({ token: response.data.data.token });
    } catch (err) {
        console.error('HeyGen Token Error:', err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to fetch HeyGen token' });
    }
});

// Speech Token API
app.get('/api/speech-token', async (req, res) => {
    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION;

    if (!speechKey || !speechRegion) {
        return res.status(500).json({ error: 'Azure Speech credentials missing' });
    }

    try {
        const fetchTokenEndpoint = `https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`;
        const response = await axios.post(fetchTokenEndpoint, null, {
            headers: {
                'Ocp-Apim-Subscription-Key': speechKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        res.json({ token: response.data, region: speechRegion });
    } catch (err) {
        console.error('Speech Token Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch speech token: ' + err.message });
    }
});

// ICE Servers API (For WebRTC Relay)
app.get('/api/ice-servers', async (req, res) => {
    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION;

    if (!speechKey || !speechRegion) {
        return res.status(500).json({ error: 'Azure Speech credentials missing' });
    }

    try {
        const relayEndpoint = `https://${speechRegion}.tts.speech.microsoft.com/cognitiveservices/avatar/relay/token/v1`;
        const response = await axios.get(relayEndpoint, {
            headers: {
                'Ocp-Apim-Subscription-Key': speechKey
            }
        });

        // Azure returns { Urls: [...], Username: "...", Password: "..." }
        // Normalize to lowercase for consistent frontend handling
        const data = response.data;
        res.json({
            urls: data.Urls || data.urls,
            username: data.Username || data.username,
            credential: data.Password || data.password || data.credential
        });
    } catch (err) {
        console.error('ICE Servers Error:', err.message);
        // Fallback to empty if fails, though WebRTC might fail
        res.status(500).json({ error: 'Failed to fetch ICE servers: ' + err.message });
    }
});

// Chat API (preferred_language: mandarin | english | cantonese，数字人回复语言)
app.post('/api/chat', async (req, res) => {
    const { message, preferred_language } = req.body;
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const azureApiKey = process.env.AZURE_OPENAI_KEY;
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4';
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview';

    if (!endpoint || !azureApiKey) {
        return res.status(500).json({ error: 'Azure OpenAI credentials missing' });
    }

    try {
        const client = new AzureOpenAI({
            endpoint,
            apiKey: azureApiKey,
            apiVersion,
            deployment: deploymentName,
        });

        console.log(`--- Chat Request ---`);
        console.log(`Endpoint: ${endpoint}`);
        console.log(`Deployment: ${deploymentName}`);
        console.log(`API Version: ${apiVersion}`);

        const langHint = preferred_language === 'cantonese'
            ? '请用粤语回复。'
            : preferred_language === 'english'
                ? 'Please reply in English.'
                : '请用普通话回复。';
        const result = await client.chat.completions.create({
            messages: [
                { role: "system", content: `你是一个名为 UploadSoul 传灵的数字人助理。你亲切、专业，旨在为用户提供情感陪伴和数字永生咨询。请保持回答简短。${langHint}` },
                { role: "user", content: message }
            ],
            model: deploymentName,
        });

        res.json({ reply: result.choices[0].message.content });
    } catch (err) {
        console.error('Chat Error Detail:', err);
        const status = err.status || 500;
        const message = err.message || 'Unknown error';
        const body = err.error || {};

        console.error(`Status ${status}: ${message}`);
        res.status(status).json({
            error: `API 响应异常 (${status}): ${message}`,
            detail: body
        });
    }
});

// ══════════════════════════════════════════════════════
//  VOLCENGINE AI CHAIN  (non-MVP — Virtual Lover / Care)
//  ASR → LLM stream → TTS stream  →  SSE to client
//  Original SiliconFlow logic preserved below as backup
// ══════════════════════════════════════════════════════

/**
 * Shared handler for all Volcengine-powered chat endpoints
 * Reads `avatarType` to route to correct Endpoint & voice.
 */
async function handleVolcengineChat(req, res, avatarType) {
    try {
        const { volcengineLLMStream } = await import('./api/_lib/volcengine-llm.js');
        const { streamTTS } = await import('./api/_lib/volcengine-tts.js');
        const { transcribeBuffer } = await import('./api/_lib/volcengine-asr.js');
        const { supabaseService } = await import('./api/_lib/supabase-server.js');

        let fields = {};
        let files = {};
        const contentType = req.headers['content-type'] || '';

        if (contentType.includes('multipart/form-data')) {
            const form = formidable({ multiples: false });
            [fields, files] = await new Promise((resolve, reject) => {
                form.parse(req, (err, f, fi) => err ? reject(err) : resolve([f, fi]));
            });
        } else {
            fields = req.body;
        }

        const get = (key, def = '') =>
            Array.isArray(fields[key]) ? fields[key][0] : (fields[key] ?? def);

        const message = get('message');
        const userId = get('userId', '00000000-0000-4000-8000-000000000000');
        const characterId = get('characterId', '汐月');
        const characterName = get('characterName', characterId);
        const gender = get('gender', 'female');
        const endpointId = get('endpointId', '');   // from DB avatars.endpoint_id
        const voiceId = get('voiceId', '');      // from DB avatars.voice_id
        const audioFile = files.audio?.[0] || files.audio;

        // AbortController for client disconnect
        const ac = new AbortController();
        req.on('close', () => ac.abort());

        // ── Step 1: ASR ──────────────────────────────────
        let userText = message;
        if (audioFile) {
            console.log(`[${avatarType}] Step 1: ASR with Volcengine...`);
            const audioBuffer = fs.readFileSync(audioFile.filepath);
            try {
                userText = await transcribeBuffer(audioBuffer, audioFile.mimetype || 'audio/webm');
            } catch (err) {
                if (err.message === 'ASR_EMPTY_RESULT') {
                    return res.status(400).json({ error: '没听清，请再说一次？', details: 'ASR_EMPTY_RESULT' });
                }
                throw err;
            }
            console.log(`[${avatarType}] ASR result: "${userText}"`);
        }

        if (!userText) {
            return res.status(400).json({ error: 'Message or audio is required' });
        }

        // ── Step 2: Setup SSE ───────────────────────────
        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');

        const sse = (obj) => res.write(`data: ${JSON.stringify(obj)}\n\n`);

        // Send recognized text immediately so UI can display it
        sse({ type: 'userText', text: userText });

        // ── Step 3: LLM stream + TTS streaming pipeline ─
        console.log(`[${avatarType}] Step 2: LLM stream (Volcengine Doubao)...`);
        const messages = [{ role: 'user', content: userText }];

        let fullAiText = '';
        let sentenceBuffer = '';
        const endings = /[。！？!？\n]/;

        // Pipeline: when a sentence is ready → TTS → stream audio chunk to client
        const processSentenceViaTTS = async (sentence) => {
            if (!sentence.trim()) return;
            console.log(`[${avatarType}] TTS sentence: "${sentence}"`);
            sse({ type: 'sentence_start', text: sentence });

            try {
                await streamTTS(
                    sentence,
                    avatarType,
                    voiceId || undefined,
                    (audioChunk) => {
                        // Convert binary chunk to base64 for SSE transport
                        sse({ type: 'audio_chunk', data: audioChunk.toString('base64') });
                    },
                    () => sse({ type: 'sentence_done', text: sentence }),
                    (err) => console.error(`[${avatarType}] TTS error:`, err.message),
                    ac.signal
                );
            } catch (err) {
                if (!ac.signal.aborted) console.error(`[${avatarType}] TTS pipeline error:`, err.message);
            }
        };

        let firstSentenceProcessed = false;

        await volcengineLLMStream({
            messages,
            avatarType,
            characterName,
            gender,
            endpointId: endpointId || undefined,
            signal: ac.signal,
            onToken: (token) => {
                fullAiText += token;
                sentenceBuffer += token;
                sse({ type: 'token', text: token });

                // Detect sentence boundary → kick off TTS
                if (endings.test(sentenceBuffer)) {
                    const match = sentenceBuffer.match(endings);
                    const idx = sentenceBuffer.indexOf(match[0]);
                    const sentence = sentenceBuffer.slice(0, idx + 1);
                    sentenceBuffer = sentenceBuffer.slice(idx + 1);
                    // Fire-and-forget TTS — don't await to unblock LLM stream
                    processSentenceViaTTS(sentence);
                    firstSentenceProcessed = true;
                }
            },
            onFirstSentence: (s) => {
                if (!firstSentenceProcessed) processSentenceViaTTS(s);
            },
            onDone: async (full) => {
                // Flush remaining
                if (sentenceBuffer.trim()) {
                    await processSentenceViaTTS(sentenceBuffer.trim());
                }

                // Persist chat record
                try {
                    await supabaseService.saveChatRecord({
                        userId,
                        characterId,
                        userText,
                        aiText: full,
                        audioUrl: null
                    });
                } catch (e) {
                    console.warn(`[${avatarType}] Supabase save failed:`, e.message);
                }

                sse({ type: 'done', fullText: full });
                res.end();
            }
        });

    } catch (err) {
        console.error(`[${avatarType}] Route error:`, err.message);
        if (!res.headersSent) res.status(500).json({ error: err.message });
        else res.end();
    }
}

// ─── Virtual Lover (character-250228) ──────────────────
app.post('/api/virtual-lover/chat', (req, res) => {
    console.log('>>> [Volcengine] Virtual Lover Chat');
    return handleVolcengineChat(req, res, 'lover');
});

// ─── Daily Companion (character-250228) ────────────────
app.post('/api/companion/chat', (req, res) => {
    console.log('>>> [Volcengine] Companion Chat');
    return handleVolcengineChat(req, res, 'companion');
});

// ─── Senior Care (Doubao-1.5-pro) ──────────────────────
app.post('/api/senior-care/chat', (req, res) => {
    console.log('>>> [Volcengine] Senior Care Chat');
    return handleVolcengineChat(req, res, 'senior');
});

// ─── Mental Wellness (Doubao-1.5-pro) ──────────────────
app.post('/api/mental/chat', (req, res) => {
    console.log('>>> [Volcengine] Mental Wellness Chat');
    return handleVolcengineChat(req, res, 'mental');
});

// ─── Digital Immortality (Doubao-1.5-pro) ──────────────
app.post('/api/immortality/chat', (req, res) => {
    console.log('>>> [Volcengine] Digital Immortality Chat');
    return handleVolcengineChat(req, res, 'immortality');
});

// ─── Digital Rebirth (Doubao-1.5-pro) ──────────────────
app.post('/api/rebirth/chat', (req, res) => {
    console.log('>>> [Volcengine] Digital Rebirth Chat');
    return handleVolcengineChat(req, res, 'rebirth');
});

// ── Virtual Lover Pre-warm (kept for compatibility) ─────
app.get('/api/virtual-lover/prewarm', (req, res) => {
    console.log('Pre-warming Virtual Lover (Volcengine)...');
    res.json({ status: 'ok', message: 'Volcengine chain ready' });
});

// ─── Virtual Pet (Doubao-1.5-pro / character-250228) ──────
app.post('/api/pet/chat', (req, res) => {
    console.log('>>> [Volcengine] Virtual Pet Chat');
    return handleVolcengineChat(req, res, 'pet');
});

// Pet Reconstruction API
app.post('/api/pet/reconstruct', async (req, res) => {
    console.log('>>> Incoming Pet Reconstruction Request');
    try {
        const { supabaseService } = await import('./api/_lib/supabase-server.js');
        const form = formidable({ multiples: false });

        const [fields, files] = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve([fields, files]);
            });
        });

        const userId = Array.isArray(fields.userId) ? fields.userId[0] : (fields.userId || '00000000-0000-4000-8000-000000000000');
        const petName = Array.isArray(fields.petName) ? fields.petName[0] : (fields.petName || '无名之灵');
        const mode = Array.isArray(fields.mode) ? fields.mode[0] : (fields.mode || 'text');
        const memories = Array.isArray(fields.memories) ? fields.memories[0] : (fields.memories || '');
        const anniversaryReminder = (Array.isArray(fields.anniversaryReminder) ? fields.anniversaryReminder[0] : fields.anniversaryReminder) === 'true';

        let photoUrl = null;
        let audioUrl = null;
        let videoUrl = null;

        // Process files
        const photoFile = files.photo?.[0] || files.photo;
        const audioFile = files.audio?.[0] || files.audio;
        const videoFile = files.video?.[0] || files.video;

        if (photoFile) {
            const buffer = fs.readFileSync(photoFile.filepath);
            photoUrl = await supabaseService.uploadMedia(buffer, `pet_hub/photos/${userId}_${Date.now()}_${photoFile.originalFilename}`, 'audio_responses', photoFile.mimetype);
        }
        if (audioFile) {
            const buffer = fs.readFileSync(audioFile.filepath);
            audioUrl = await supabaseService.uploadMedia(buffer, `pet_hub/audio/${userId}_${Date.now()}_${audioFile.originalFilename}`, 'audio_responses', audioFile.mimetype);
        }
        if (videoFile) {
            const buffer = fs.readFileSync(videoFile.filepath);
            videoUrl = await supabaseService.uploadMedia(buffer, `pet_hub/videos/${userId}_${Date.now()}_${videoFile.originalFilename}`, 'audio_responses', videoFile.mimetype);
        }

        await supabaseService.savePetReconstruction({
            userId,
            petName,
            photoUrl,
            audioUrl,
            videoUrl,
            mode,
            memories,
            anniversaryReminder
        });

        res.json({ success: true, message: 'Reconstruction request saved successfully', data: { photoUrl, audioUrl, videoUrl } });

    } catch (error) {
        console.error('Pet Reconstruction Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend simulator running at http://localhost:${PORT}`);
    console.log(`Waiting for requests from http://127.0.0.1:5173/api/...`);
});
