/**
 * api/index.js — Unified API Router for Vercel
 * 
 * Consolidates all API endpoints into a single Serverless Function.
 * Dispatches requests based on the URL path.
 */

import { AzureOpenAI } from "openai";
import formidable from 'formidable';
import fs from 'fs';

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
const sseHeaders = {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
};

// ──────────────────────────────────────────────
// Routes
// ──────────────────────────────────────────────

/**
 * Azure OpenAI Chat
 */
async function handleChat(req, res) {
    try {
        const body = await new Promise((resolve, reject) => {
            let data = '';
            req.on('data', chunk => { data += chunk; });
            req.on('end', () => {
                try { resolve(data ? JSON.parse(data) : {}); }
                catch (e) { reject(e); }
            });
        });

        const { message, preferred_language } = body || {};
        const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
        const azureApiKey = process.env.AZURE_OPENAI_KEY;
        const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4';
        const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-12-01-preview';

        if (!endpoint || !azureApiKey) {
            return res.status(500).json({ error: 'Azure OpenAI credentials missing' });
        }

        const client = new AzureOpenAI({
            endpoint,
            apiKey: azureApiKey,
            apiVersion,
            deployment: deploymentName,
        });

        const langHint = preferred_language === 'cantonese' ? '请用粤语回复。' : preferred_language === 'english' ? 'Please reply in English.' : '请用普通话回复。';

        const result = await client.chat.completions.create({
            messages: [
                { role: "system", content: `你是一个名为 UploadSoul 传灵的数字人助理。你亲切、专业，旨在为用户提供情感陪伴和数字永生咨询。请保持回答简短。${langHint}` },
                { role: "user", content: message }
            ],
            model: deploymentName,
        });

        res.status(200).json({ reply: result.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Azure Speech Token
 */
async function handleSpeechToken(req, res) {
    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION;

    if (!speechKey || !speechRegion) {
        return res.status(500).json({ error: 'Azure Speech credentials missing' });
    }

    try {
        const fetchTokenEndpoint = `https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`;
        const response = await fetch(fetchTokenEndpoint, {
            method: 'POST',
            headers: { 'Ocp-Apim-Subscription-Key': speechKey, 'Content-Type': 'application/x-www-form-urlencoded' }
        });
        const token = await response.text();
        res.status(200).json({ token, region: speechRegion });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/**
 * Azure ICE Relay Servers
 */
async function handleIceServers(req, res) {
    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION;

    if (!speechKey || !speechRegion) {
        return res.status(500).json({ error: 'Azure Speech credentials missing' });
    }

    try {
        const relayEndpoint = `https://${speechRegion}.tts.speech.microsoft.com/cognitiveservices/avatar/relay/token/v1`;
        const response = await fetch(relayEndpoint, {
            headers: { 'Ocp-Apim-Subscription-Key': speechKey }
        });
        const data = await response.json();
        res.status(200).json({
            urls: data.Urls || data.urls,
            username: data.Username || data.username,
            credential: data.Password || data.password || data.credential
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/**
 * HeyGen Token
 */
async function handleHeygenToken(req, res) {
    const key = process.env.HEYGEN_API_KEY;
    if (!key) return res.status(500).json({ error: 'HeyGen API key missing' });

    try {
        const response = await fetch('https://api.heygen.com/v1/streaming.create_token', {
            method: 'POST',
            headers: { 'x-api-key': key, 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        res.status(200).json({ token: data.data.token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

/**
 * Volcengine SSE Chain (ASR -> LLM -> TTS)
 */
async function handleVolcengineChat(req, res, avatarTypeOverride = null) {
    const { volcengineLLMStream } = await import('./_lib/volcengine-llm.js');
    const { streamTTS } = await import('./_lib/volcengine-tts.js');
    const { transcribeBuffer } = await import('./_lib/volcengine-asr.js');
    const { supabaseService } = await import('./_lib/supabase-server.js');

    const form = formidable({ multiples: false });
    try {
        const [fields, files] = await new Promise((resolve, reject) => {
            form.parse(req, (err, f, fi) => err ? reject(err) : resolve([f, fi]));
        });

        const get = (key, def = '') => Array.isArray(fields[key]) ? fields[key][0] : (fields[key] ?? def);

        const avatarType = avatarTypeOverride || get('avatarType', 'general');
        const message = get('message');
        const userId = get('userId', '00000000-0000-4000-8000-000000000000');
        const characterId = get('characterId', '汐月');
        const characterName = get('characterName', characterId);
        const gender = get('gender', 'female');
        const endpointId = get('endpointId', '');
        const voiceId = get('voiceId', '');
        const audioFile = files.audio?.[0] || files.audio;

        // 1. ASR
        let userText = message;
        if (audioFile) {
            const buffer = fs.readFileSync(audioFile.filepath);
            // Safely extract base mime type, stripping codec suffix (e.g. 'audio/webm;codecs=opus' → 'audio/webm')
            const rawMime = audioFile.mimetype || audioFile.type || '';
            const baseMime = rawMime.split(';')[0].trim() || 'audio/webm';
            console.log(`[ASR] audioFile size: ${buffer.length}, rawMime: "${rawMime}", baseMime: "${baseMime}"`);
            userText = await transcribeBuffer(buffer, baseMime);
        }

        if (!userText) {
            return res.status(400).json({ error: 'Input empty' });
        }

        // 2. SSE Setup
        res.writeHead(200, sseHeaders);
        const sse = (obj) => res.write(`data: ${JSON.stringify(obj)}\n\n`);
        sse({ type: 'userText', text: userText });

        // 3. Chain
        let fullAiText = '';
        let sentenceBuffer = '';
        const endings = /[。！？!？\n]/;

        const processTTS = async (sentence) => {
            if (!sentence.trim()) return;
            sse({ type: 'sentence_start', text: sentence });
            try {
                await streamTTS(sentence, avatarType, voiceId || undefined, (chunk) => {
                    sse({ type: 'audio_chunk', data: chunk.toString('base64') });
                }, () => sse({ type: 'sentence_done', text: sentence }), null, null);
            } catch (e) { console.error('TTS error', e); }
        };

        let firstDone = false;
        await volcengineLLMStream({
            messages: [{ role: 'user', content: userText }],
            avatarType, characterName, gender, endpointId: endpointId || undefined,
            onToken: (token) => {
                fullAiText += token;
                sentenceBuffer += token;
                sse({ type: 'token', text: token });
                if (endings.test(sentenceBuffer)) {
                    const match = sentenceBuffer.match(endings);
                    const idx = sentenceBuffer.indexOf(match[0]);
                    const sentence = sentenceBuffer.slice(0, idx + 1);
                    sentenceBuffer = sentenceBuffer.slice(idx + 1);
                    processTTS(sentence);
                    firstDone = true;
                }
            },
            onFirstSentence: (s) => { if (!firstDone) processTTS(s); },
            onDone: async (full) => {
                if (sentenceBuffer.trim()) await processTTS(sentenceBuffer.trim());
                try {
                    await supabaseService.saveChatRecord({ userId, characterId, userText, aiText: full, audioUrl: null });
                } catch (e) { }
                sse({ type: 'done', fullText: full });
                res.end();
            }
        });

    } catch (err) {
        console.error('SSE pipeline error:', err);
        if (!res.headersSent) res.status(500).json({ error: err.message });
        else res.end();
    }
}

// ──────────────────────────────────────────────
// Universal Router
// ──────────────────────────────────────────────

export const config = {
    api: { bodyParser: false }
};

export default async function handler(req, res) {
    const rawPath = new URL(req.url, 'http://localhost').pathname;
    const pathname = rawPath.replace(/^\/api/, '').replace(/\/$/, '');
    console.log('[Router] pathname resolved:', pathname);

    try {
        if (pathname === '/chat') return await handleChat(req, res);
        if (pathname === '/speech-token') return await handleSpeechToken(req, res);
        if (pathname === '/ice-servers') return await handleIceServers(req, res);
        if (pathname === '/heygen-token') return await handleHeygenToken(req, res);
        if (pathname === '/diagnose') {
            return res.status(200).json({
                status: 'ok',
                env: {
                    hasSpeechKey: !!process.env.AZURE_SPEECH_KEY,
                    hasOpenAIKey: !!process.env.AZURE_OPENAI_KEY,
                    hasHeygenKey: !!process.env.HEYGEN_API_KEY,
                    hasVolcAK: !!process.env.VOLC_AK
                }
            });
        }
        if (pathname === '/virtual-lover/prewarm') return res.status(200).json({ status: 'ok' });

        // Dynamic Chat Routes
        if (pathname.endsWith('/chat')) {
            const types = {
                '/virtual-lover': 'lover',
                '/companion': 'companion',
                '/senior-care': 'senior',
                '/mental': 'mental',
                '/immortality': 'immortality',
                '/rebirth': 'rebirth',
                '/pet': 'pet'
            };
            for (const [prefix, type] of Object.entries(types)) {
                if (pathname.startsWith(prefix)) return await handleVolcengineChat(req, res, type);
            }
        }

        return res.status(404).json({ error: `Not found: ${pathname}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
