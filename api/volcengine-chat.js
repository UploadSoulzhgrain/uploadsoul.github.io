import { volcengineLLMStream } from './lib/volcengine-llm.js';
import { streamTTS } from './lib/volcengine-tts.js';
import { createRealtimeASR } from './lib/volcengine-asr.js';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
    api: {
        bodyParser: false,
    },
};

/**
 * Shared handler for Volcengine Chat (ASR -> LLM -> TTS)
 * Supports both JSON (text only) and FormData (audio + text)
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Determine avatar type from path or body
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
        const streamMode = true; // Always stream for these routes

        // 1. Set up SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const sendEvt = (type, data) => {
            res.write(`data: ${JSON.stringify({ type, ...data })}\n\n`);
        };

        const signal = req.signal; // Handle client disconnect

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
                // We don't res.end() here because TTS might still be streaming
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
