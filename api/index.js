/**
 * api/index.js — Unified API Router
 * 
 * All API endpoints consolidated into a single Vercel Serverless Function.
 * Dispatches requests based on URL path.
 * 
 * This keeps the project under Vercel Hobby plan's 12-function limit
 * and future-proofs against new API additions.
 */

import { AzureOpenAI } from "openai";
import axios from 'axios';
import formidable from 'formidable';
import fs from 'fs';

// ──────────────────────────────────────────────
// Route: /api/chat (POST) — Azure OpenAI Chat
// ──────────────────────────────────────────────
async function handleChat(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, preferred_language } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const azureApiKey = process.env.AZURE_OPENAI_KEY;
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4';
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-12-01-preview';

    if (!endpoint || !azureApiKey) {
        console.error('Azure OpenAI credentials missing');
        return res.status(500).json({ error: 'Azure OpenAI credentials are not configured' });
    }

    try {
        const client = new AzureOpenAI({
            endpoint,
            apiKey: azureApiKey,
            apiVersion,
            deployment: deploymentName,
        });

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

        const reply = result.choices[0].message.content;
        res.status(200).json({ reply });
    } catch (error) {
        console.error('Error with Azure OpenAI:', error);
        res.status(500).json({ error: `Failed to get chat completion: ${error.message}` });
    }
}

// ──────────────────────────────────────────────
// Route: /api/diagnose (GET) — Environment Check
// ──────────────────────────────────────────────
function handleDiagnose(req, res) {
    const envCheck = {
        speechKey: !!process.env.AZURE_SPEECH_KEY,
        speechRegion: !!process.env.AZURE_SPEECH_REGION,
        openaiKey: !!process.env.AZURE_OPENAI_KEY,
        env: process.env.NODE_ENV
    };
    res.status(200).json({ status: 'ok', checks: envCheck });
}

// ──────────────────────────────────────────────
// Route: /api/heygen-token (GET) — HeyGen Token
// ──────────────────────────────────────────────
async function handleHeygenToken(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY || 'sk_V2_hgu_kUJuwlf4dLH_ljzwKlF1jsoS7UPRqkPLPmSj3fX2wG34';

    try {
        const response = await axios.post('https://api.heygen.com/v1/streaming.create_token', null, {
            headers: {
                'x-api-key': HEYGEN_API_KEY
            }
        });
        res.status(200).json({ token: response.data.data.token });
    } catch (err) {
        console.error('HeyGen Token Error:', err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to fetch HeyGen token' });
    }
}

// ──────────────────────────────────────────────
// Route: /api/ice-servers (GET) — Azure ICE Relay
// ──────────────────────────────────────────────
async function handleIceServers(req, res) {
    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION;

    if (!speechKey || !speechRegion) {
        console.error('Azure Speech credentials missing in environment');
        return res.status(500).json({ error: 'Azure Speech credentials are not configured' });
    }

    try {
        const relayEndpoint = `https://${speechRegion}.tts.speech.microsoft.com/cognitiveservices/avatar/relay/token/v1`;
        const response = await axios.get(relayEndpoint, {
            headers: {
                'Ocp-Apim-Subscription-Key': speechKey
            }
        });

        const data = response.data;
        res.status(200).json({
            urls: data.Urls || data.urls,
            username: data.Username || data.username,
            credential: data.Password || data.password || data.credential
        });
    } catch (error) {
        console.error('ICE Servers Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch ICE servers' });
    }
}

// ──────────────────────────────────────────────
// Route: /api/speech-token (GET/POST) — Azure Speech Token
// ──────────────────────────────────────────────
async function handleSpeechToken(req, res) {
    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION;

    if (!speechKey || !speechRegion) {
        return res.status(500).json({ error: 'Azure Speech credentials are not configured' });
    }

    const fetchOptions = {
        method: 'POST',
        headers: {
            'Ocp-Apim-Subscription-Key': speechKey,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    try {
        const response = await fetch(`https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, fetchOptions);
        if (!response.ok) {
            throw new Error(`Failed to fetch token: ${response.statusText}`);
        }
        const token = await response.text();
        res.status(200).json({ token, region: speechRegion });
    } catch (error) {
        console.error('Error fetching speech token:', error);
        res.status(500).json({ error: 'Failed to fetch speech token' });
    }
}

// ──────────────────────────────────────────────
// Route: /api/virtual-lover/prewarm (GET)
// ──────────────────────────────────────────────
function handlePrewarm(req, res) {
    res.status(200).json({ status: 'ok', message: 'Volcengine chain ready' });
}

// ──────────────────────────────────────────────
// Route: /api/virtual-lover/chat (POST) — SiliconFlow Pipeline
// ──────────────────────────────────────────────
async function handleVirtualLoverChat(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { siliconFlowService } = await import('./_lib/siliconflow.js');
    const { supabaseService } = await import('./_lib/supabase-server.js');

    const form = formidable({ multiples: false });

    try {
        const [fields, files] = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve([fields, files]);
            });
        });

        const audioFile = files.audio?.[0] || files.audio;
        const userId = fields.userId?.[0] || fields.userId;
        const characterId = fields.characterId?.[0] || fields.characterId;

        if (!audioFile) {
            return res.status(400).json({ error: 'Audio file is required' });
        }

        // 1. ASR: Transcribe
        const audioBuffer = fs.readFileSync(audioFile.filepath);
        const userText = await siliconFlowService.transcribe(audioBuffer);

        if (!userText) {
            return res.status(200).json({ reply: '我没听清，请再说一次？', audioUrl: null });
        }

        // 2. LLM: Get Reply
        const messages = [
            { role: 'system', content: `你是一个名为${characterId || '数字人'}的虚拟恋人。你温柔、体贴，旨在为用户提供情感陪伴。请保持回答简短且充满感情。` },
            { role: 'user', content: userText }
        ];
        const aiText = await siliconFlowService.chat(messages);

        // 3. TTS: Synthesize
        const aiAudioBuffer = await siliconFlowService.synthesize(aiText);

        // 4. Persistence: Upload & Save
        const fileName = `${userId || 'anon'}_${Date.now()}.mp3`;
        const audioUrl = await supabaseService.uploadAudio(aiAudioBuffer, fileName);

        await supabaseService.saveChatRecord({
            userId,
            characterId,
            userText,
            aiText,
            audioUrl
        });

        // 5. Response
        res.status(200).json({
            userText,
            aiText,
            audioUrl
        });

    } catch (error) {
        console.error('Orchestration Error:', error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}

// ──────────────────────────────────────────────
// Route: /api/(volcengine-pattern)/chat (POST) — Volcengine SSE Pipeline
// ──────────────────────────────────────────────
async function handleVolcengineChat(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { volcengineLLMStream } = await import('./_lib/volcengine-llm.js');
    const { streamTTS } = await import('./_lib/volcengine-tts.js');
    const { createRealtimeASR } = await import('./_lib/volcengine-asr.js');

    // Determine avatar type from path
    const url = new URL(req.url, 'http://localhost');
    let avatarType = 'general';
    if (url.pathname.includes('senior-care')) avatarType = 'senior';
    else if (url.pathname.includes('virtual-lover')) avatarType = 'lover';
    else if (url.pathname.includes('companion')) avatarType = 'companion';
    else if (url.pathname.includes('mental')) avatarType = 'mental';
    else if (url.pathname.includes('immortality')) avatarType = 'immortality';
    else if (url.pathname.includes('rebirth')) avatarType = 'rebirth';

    const form = formidable({ multiples: false });

    try {
        const [fields, files] = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve([fields, files]);
            });
        });

        const userText = fields.message?.[0] || fields.message;
        const charName = fields.characterName?.[0] || fields.characterName || 'AI助手';
        const audioFile = files.audio?.[0] || files.audio;

        // 1. Set up SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const sendEvt = (type, data) => {
            res.write(`data: ${JSON.stringify({ type, ...data })}\n\n`);
        };

        const signal = req.signal;

        // 2. ASR (if audio provided)
        let processedText = userText;
        if (audioFile) {
            sendEvt('status', { message: '正在识别语音...' });
            const audioBuffer = fs.readFileSync(audioFile.filepath);
            const asr = createRealtimeASR();
            processedText = await asr.transcribeBuffer(audioBuffer);
            sendEvt('userText', { text: processedText });
        }

        if (!processedText) {
            sendEvt('error', { message: '未检测到输入内容' });
            return res.end();
        }

        // 3. LLM + TTS Pipeline
        let fullAiText = '';
        let ttsActive = false;

        await volcengineLLMStream({
            messages: [{ role: 'user', content: processedText }],
            avatarType,
            characterName: charName,
            signal,
            onToken: (token) => {
                fullAiText += token;
                sendEvt('token', { token });
            },
            onFirstSentence: (sentence) => {
                if (signal?.aborted) return;
                ttsActive = true;
                streamTTS(sentence, avatarType, (chunk) => {
                    if (signal?.aborted) return;
                    sendEvt('audio', { audio: chunk.toString('base64') });
                }).catch(err => console.error('[TTS Error]', err));
            },
            onDone: (full) => {
                sendEvt('done', { fullText: full });
                setTimeout(() => { if (!res.writableEnded) res.end(); }, 3000);
            }
        });

    } catch (err) {
        console.error('[Volcengine SSE Error]', err);
        if (!res.writableEnded) {
            res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
            res.end();
        }
    }
}

// ══════════════════════════════════════════════
//  UNIVERSAL ROUTER
// ══════════════════════════════════════════════

// Disable default body parser for multipart routes
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    // Parse the route from the URL
    const url = new URL(req.url, 'http://localhost');
    const pathname = url.pathname;

    console.log(`[API Router] ${req.method} ${pathname}`);

    // ── Exact path matches ──
    if (pathname === '/api/chat') {
        // Body parser needed for this route — parse manually
        if (!req.body && req.method === 'POST') {
            req.body = await parseJsonBody(req);
        }
        return handleChat(req, res);
    }

    if (pathname === '/api/diagnose') {
        return handleDiagnose(req, res);
    }

    if (pathname === '/api/heygen-token') {
        return handleHeygenToken(req, res);
    }

    if (pathname === '/api/ice-servers') {
        return handleIceServers(req, res);
    }

    if (pathname === '/api/speech-token') {
        return handleSpeechToken(req, res);
    }

    if (pathname === '/api/virtual-lover/prewarm') {
        return handlePrewarm(req, res);
    }

    // ── Virtual Lover chat (SiliconFlow) ──
    if (pathname === '/api/virtual-lover/chat') {
        return handleVirtualLoverChat(req, res);
    }

    // ── Volcengine chat routes ──
    const volcenginePattern = /^\/api\/(companion|senior-care|mental|immortality|rebirth)\/chat$/;
    if (volcenginePattern.test(pathname)) {
        return handleVolcengineChat(req, res);
    }

    // ── Fallback: 404 ──
    res.status(404).json({ error: `API route not found: ${pathname}` });
}

// ── Helper: Parse JSON body manually ──
function parseJsonBody(req) {
    return new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => { data += chunk; });
        req.on('end', () => {
            try {
                resolve(data ? JSON.parse(data) : {});
            } catch (e) {
                resolve({});
            }
        });
        req.on('error', reject);
    });
}
