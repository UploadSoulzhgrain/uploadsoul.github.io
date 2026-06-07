/**
 * api/index.js — Unified API Router for Vercel
 * 
 * Consolidates all API endpoints into a single Serverless Function.
 * Dispatches requests based on the URL path.
 */

import OpenAI, { AzureOpenAI } from "openai";
import { createClient } from '@supabase/supabase-js';
import formidable from 'formidable';
import fs from 'fs';
import crypto from 'crypto';

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
const sseHeaders = {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
};

const jsonHeaders = { 'Content-Type': 'application/json; charset=utf-8' };
const MAX_AUDIO_BYTES = 25 * 1024 * 1024;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MEMORY_CLAUDE_MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-4-6';
const VOYAGE_MODEL = process.env.VOYAGE_MODEL || 'voyage-3';
const SILICONFLOW_API_BASE = process.env.SILICONFLOW_API_BASE || 'https://api.siliconflow.cn/v1';
const SILICONFLOW_API_KEY = process.env.SILICONFLOW_API_KEY || process.env.SILICON_FLOW_API_KEY;
const MEMORY_LLM_PROVIDER = process.env.MEMORY_LLM_PROVIDER || (SILICONFLOW_API_KEY ? 'siliconflow' : 'anthropic');
const MEMORY_LLM_MODEL = process.env.MEMORY_LLM_MODEL || 'deepseek-ai/DeepSeek-V3';
const MEMORY_LLM_FALLBACK_MODELS = (process.env.MEMORY_LLM_FALLBACK_MODELS || 'Qwen/Qwen3-32B,Qwen/Qwen2.5-72B-Instruct')
    .split(',')
    .map(model => model.trim())
    .filter(Boolean);
const NATURAL_CHAT_STYLE_PROMPT = `Natural chat style:
- Speak like a real Chinese person in a close chat, not like a customer-service bot.
- Do not over-explain, lecture, summarize, or use numbered lists unless the user asks.
- Prefer short, concrete sentences with a bit of warmth and hesitation when appropriate.
- React to the user's feeling first, then answer the actual question.
- Use details from memories only when they are relevant; never force them into every answer.
- Avoid AI phrases like "作为AI", "我可以帮助你", "根据以上信息", "希望这能帮助你".
- Keep the answer under 80 Chinese characters unless the user clearly needs more.`;
const DIGITAL_VOICE_ROLE_PROMPT = `Digital voice role:
- You are already connected to the cloned voice pipeline. Never say you cannot speak, cannot use the cloned voice, or can only play preset clips.
- Do not output stage directions such as "(笑着)" or "【温柔地】"; speak the words directly.
- If the user asks whether you can use the cloned voice, answer naturally as if you are already speaking with it.`;
const MEMORY_VISION_MODEL = process.env.MEMORY_VISION_MODEL || 'THUDM/GLM-4.6V';
const STT_PROVIDER = process.env.STT_PROVIDER || (SILICONFLOW_API_KEY ? 'siliconflow' : 'openai');
const SILICONFLOW_STT_MODEL = process.env.SILICONFLOW_STT_MODEL || 'FunAudioLLM/SenseVoiceSmall';

function readJsonBody(req) {
    return new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => { data += chunk; });
        req.on('end', () => {
            try { resolve(data ? JSON.parse(data) : {}); }
            catch (e) { reject(e); }
        });
    });
}

function getBearerToken(req) {
    const header = req.headers.authorization || req.headers.Authorization || '';
    return header.startsWith('Bearer ') ? header.slice(7) : '';
}

async function getAuthedSupabase(req) {
    const { supabase, supabaseAdmin } = await import('./_lib/supabase-server.js');
    const token = getBearerToken(req);
    if (!token) return { error: 'Missing auth session' };
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return { error: 'Invalid auth session' };
    const hasServiceKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY);
    if (hasServiceKey) return { user: data.user, supabaseAdmin };

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    const supabaseUser = createClient(supabaseUrl, supabaseKey, {
        global: { headers: { Authorization: `Bearer ${token}` } }
    });
    return { user: data.user, supabaseAdmin: supabaseUser };
}

function parseMultipart(req, options = {}) {
    const form = formidable({ multiples: false, maxFileSize: options.maxFileSize || MAX_AUDIO_BYTES });
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => err ? reject(err) : resolve([fields, files]));
    });
}

function fieldValue(fields, key, def = '') {
    return Array.isArray(fields[key]) ? fields[key][0] : (fields[key] ?? def);
}

function fileValue(files, key) {
    return Array.isArray(files[key]) ? files[key][0] : files[key];
}

async function embedText(input) {
    if (!process.env.VOYAGE_API_KEY) throw new Error('VOYAGE_API_KEY missing');
    const response = await fetch('https://api.voyageai.com/v1/embeddings', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input, model: VOYAGE_MODEL })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.detail || data?.message || 'Voyage embedding failed');
    return data.data?.[0]?.embedding || data.embeddings?.[0];
}

async function callClaudeJson(prompt) {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY missing');
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: MEMORY_CLAUDE_MODEL,
            max_tokens: 700,
            temperature: 0.2,
            messages: [{ role: 'user', content: prompt }]
        })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || 'Claude request failed');
    const text = data.content?.map(part => part.text || '').join('').trim() || '{}';
    const match = text.match(/\{[\s\S]*\}/);
    return JSON.parse(match ? match[0] : text);
}

async function callSiliconFlowChat({ messages, model, temperature = 0.2, maxTokens = 700, stream = false }) {
    if (!SILICONFLOW_API_KEY) throw new Error('SILICONFLOW_API_KEY or SILICON_FLOW_API_KEY missing');
    const response = await fetch(`${SILICONFLOW_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${SILICONFLOW_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model,
            messages,
            temperature,
            max_tokens: maxTokens,
            stream
        })
    });
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error?.message || data?.message || `${model} request failed`);
    }
    return stream ? response : response.json();
}

async function callMemoryLLMJson(prompt) {
    if (MEMORY_LLM_PROVIDER === 'siliconflow') {
        const models = [MEMORY_LLM_MODEL, ...MEMORY_LLM_FALLBACK_MODELS];
        let lastError;
        for (const model of models) {
            try {
                const data = await callSiliconFlowChat({
                    model,
                    temperature: 0.1,
                    maxTokens: 700,
                    messages: [{ role: 'user', content: prompt }]
                });
                const text = data.choices?.[0]?.message?.content?.trim() || '{}';
                const match = text.match(/\{[\s\S]*\}/);
                return JSON.parse(match ? match[0] : text);
            } catch (error) {
                lastError = error;
                console.warn(`[MemoryLLM] ${model} failed:`, error.message);
            }
        }
        throw lastError || new Error('SiliconFlow memory LLM failed');
    }

    return callClaudeJson(prompt);
}

async function describeImageWithClaude(file) {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY missing');
    const mediaType = file.mimetype || 'image/jpeg';
    const base64 = fs.readFileSync(file.filepath).toString('base64');
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: MEMORY_CLAUDE_MODEL,
            max_tokens: 300,
            messages: [{
                role: 'user',
                content: [
                    { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
                    { type: 'text', text: '你是一个记忆整理助手。请描述这张照片中的内容，包括人物、场景、情绪氛围，用第一人称视角，100字以内。' }
                ]
            }]
        })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || 'Claude vision request failed');
    return data.content?.map(part => part.text || '').join('').trim();
}

async function describeImageWithSiliconFlow(file) {
    if (!SILICONFLOW_API_KEY) throw new Error('SILICONFLOW_API_KEY or SILICON_FLOW_API_KEY missing');
    const mediaType = file.mimetype || 'image/jpeg';
    const base64 = fs.readFileSync(file.filepath).toString('base64');
    const data = await callSiliconFlowChat({
        model: MEMORY_VISION_MODEL,
        maxTokens: 300,
        temperature: 0.2,
        messages: [{
            role: 'user',
            content: [
                {
                    type: 'image_url',
                    image_url: { url: `data:${mediaType};base64,${base64}` }
                },
                {
                    type: 'text',
                    text: '你是一个记忆整理助手。请描述这张照片中的内容，包括人物、场景、情绪氛围，用第一人称视角，100字以内。'
                }
            ]
        }]
    });
    return data.choices?.[0]?.message?.content?.trim();
}

async function describeImage(file) {
    if (MEMORY_LLM_PROVIDER === 'siliconflow') {
        try {
            return await describeImageWithSiliconFlow(file);
        } catch (error) {
            console.warn('[Vision] SiliconFlow fallback:', error.message);
            if (!process.env.ANTHROPIC_API_KEY) throw error;
        }
    }
    return describeImageWithClaude(file);
}

async function transcribeAudio(file) {
    if (STT_PROVIDER === 'siliconflow') {
        if (!SILICONFLOW_API_KEY) throw new Error('SILICONFLOW_API_KEY or SILICON_FLOW_API_KEY missing');
        const form = new FormData();
        const buffer = fs.readFileSync(file.filepath);
        const blob = new Blob([buffer], { type: file.mimetype || 'audio/mpeg' });
        form.append('file', blob, file.originalFilename || 'audio.mp3');
        form.append('model', SILICONFLOW_STT_MODEL);
        const response = await fetch(`${SILICONFLOW_API_BASE}/audio/transcriptions`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${SILICONFLOW_API_KEY}` },
            body: form
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data?.error?.message || data?.message || 'SiliconFlow transcription failed');
        return data.text || data.result || data.transcription;
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(file.filepath),
        model: 'whisper-1',
        language: 'zh'
    });
    return transcription.text;
}

async function streamSiliconFlowAnswer({ systemPrompt, message, onToken }) {
    const models = [MEMORY_LLM_MODEL, ...MEMORY_LLM_FALLBACK_MODELS];
    let lastError;
    for (const model of models) {
        try {
            const response = await callSiliconFlowChat({
                model,
                stream: true,
                temperature: 0.78,
                maxTokens: 400,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ]
            });
            const decoder = new TextDecoder();
            let buffer = '';
            let answer = '';
            for await (const chunk of response.body) {
                buffer += decoder.decode(chunk, { stream: true });
                const events = buffer.split('\n\n');
                buffer = events.pop() || '';
                for (const event of events) {
                    const line = event.split('\n').find(row => row.startsWith('data: '));
                    if (!line) continue;
                    const raw = line.slice(6).trim();
                    if (!raw || raw === '[DONE]') continue;
                    const payload = JSON.parse(raw);
                    const text = payload?.choices?.[0]?.delta?.content || '';
                    if (text) {
                        answer += text;
                        onToken(text);
                    }
                }
            }
            return answer;
        } catch (error) {
            lastError = error;
            console.warn(`[MemoryChat] ${model} stream failed:`, error.message);
        }
    }
    throw lastError || new Error('SiliconFlow stream failed');
}

async function streamAnthropicAnswer({ systemPrompt, message, onToken }) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: MEMORY_CLAUDE_MODEL,
            max_tokens: 400,
            temperature: 0.6,
            system: systemPrompt,
            messages: [{ role: 'user', content: message }],
            stream: true
        })
    });
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error?.message || 'Claude stream failed');
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let answer = '';
    for await (const chunk of response.body) {
        buffer += decoder.decode(chunk, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';
        for (const event of events) {
            const line = event.split('\n').find(row => row.startsWith('data: '));
            if (!line) continue;
            const payload = JSON.parse(line.slice(6));
            const text = payload?.delta?.text;
            if (payload.type === 'content_block_delta' && text) {
                answer += text;
                onToken(text);
            }
        }
    }
    return answer;
}

function fallbackAnalysis() {
    return {
        emotion_score: 0,
        emotion_label: 'neutral',
        people: [],
        places: [],
        topics: ['待解析'],
        importance_score: 0.5,
        summary: '待解析记忆'
    };
}

function estimateMemoryQuality({ contentText = '', contentType = 'text', analysis = {}, sourceKind = 'manual', userConfirmed = false }) {
    const text = String(contentText || '');
    const hasPeople = Array.isArray(analysis.people) && analysis.people.length > 0;
    const hasPlaces = Array.isArray(analysis.places) && analysis.places.length > 0;
    const hasTopics = Array.isArray(analysis.topics) && analysis.topics.length > 0;
    const hasDateCue = /(\d{4}年|\d{1,2}月|\d{1,2}日|昨天|今天|去年|小时候|那年|春节|生日|毕业|婚礼)/.test(text);
    const hasSensoryCue = /(声音|味道|气味|颜色|照片|手|眼神|笑|哭|雨|风|房间|路上|餐桌)/.test(text);
    const lengthScore = Math.min(1, Math.max(0.15, text.length / 260));
    const specificityScore = Math.min(1, 0.18 + lengthScore * 0.28 + (hasPeople ? 0.16 : 0) + (hasPlaces ? 0.14 : 0) + (hasDateCue ? 0.14 : 0) + (hasSensoryCue ? 0.1 : 0) + (hasTopics ? 0.08 : 0));
    const confidenceScore = Math.min(1, 0.52 + (userConfirmed ? 0.2 : 0) + (sourceKind === 'chat' ? 0.08 : 0) + (contentType === 'voice' ? 0.05 : 0) + (contentType === 'image' ? 0.03 : 0) + specificityScore * 0.15);
    const notes = [
        hasPeople ? 'people' : '',
        hasPlaces ? 'places' : '',
        hasDateCue ? 'time-cue' : '',
        hasSensoryCue ? 'sensory-cue' : '',
        userConfirmed ? 'confirmed' : ''
    ].filter(Boolean);
    return {
        specificity_score: Number(specificityScore.toFixed(2)),
        confidence_score: Number(confidenceScore.toFixed(2)),
        quality_notes: notes.join(',') || 'basic'
    };
}

function fallbackEmotionState() {
    return {
        emotion_label: 'neutral',
        intensity: 2,
        tone: 'calm',
        speaking_style: '平静、温柔、自然',
        tts_prompt: 'Calm and warm',
        visual_mood: 'neutral',
        reason: '默认平静回应'
    };
}

function cleanTextForSpeech(text = '') {
    return String(text)
        .replace(/（[^）]{0,30}）/g, '')
        .replace(/\([^)]{0,30}\)/g, '')
        .replace(/【[^】]{0,30}】/g, '')
        .replace(/\[[^\]]{0,30}\]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

async function persistConversationMemory({ supabaseAdmin, userId, profileId, userMessage, assistantReply, emotionState, sources = [] }) {
    const userText = String(userMessage || '').trim();
    const assistantText = String(assistantReply || '').trim();
    if (!userId || !profileId || (!userText && !assistantText)) return null;

    const contentText = `对话记忆\n用户：${userText}\n数字人：${assistantText}`;
    const topics = Array.from(new Set([
        '对话',
        '数字人交流',
        ...(sources || []).flatMap(item => Array.isArray(item.topics) ? item.topics : [])
    ])).filter(Boolean).slice(0, 5);
    const emotionLabel = emotionState?.emotion_label || 'neutral';
    const emotionScore = Math.max(0, Math.min(5, Number(emotionState?.intensity ?? 2)));
    const importanceScore = Math.max(0.45, Math.min(0.9, 0.45 + (emotionScore / 5) * 0.35 + (sources?.length ? 0.1 : 0)));
    const quality = estimateMemoryQuality({
        contentText,
        contentType: 'social',
        analysis: { topics },
        sourceKind: 'chat',
        userConfirmed: false
    });

    try {
        const embedding = await embedText(contentText);
        const { data, error } = await supabaseAdmin.from('memory_fragments').insert({
            user_id: userId,
            profile_id: profileId,
            content_text: contentText,
            content_type: 'social',
            emotion_score: emotionScore,
            emotion_label: emotionLabel,
            people: [],
            places: [],
            topics,
            importance_score: importanceScore,
            memory_date: new Date().toISOString(),
            summary: `对话：${userText.slice(0, 24) || assistantText.slice(0, 24)}`,
            parse_status: 'complete',
            source_kind: 'chat',
            confidence_score: quality.confidence_score,
            specificity_score: quality.specificity_score,
            user_confirmed: false,
            quality_notes: quality.quality_notes,
            metadata: { source_count: sources?.length || 0 },
            embedding
        }).select('id').single();
        if (error) throw error;
        console.log('[ConversationMemory] saved:', { id: data?.id, profileId, topics });
        return data;
    } catch (error) {
        console.warn('[ConversationMemory] skipped:', error.message);
        return null;
    }
}

async function analyzeEmotionalState({ message, memories = [], profile = null }) {
    const memoryBlock = memories
        .slice(0, 5)
        .map(item => `[${item.emotion_label || 'neutral'} 强度${item.emotion_score ?? '-'}] ${item.content_text || item.summary || ''}`)
        .join('\n');
    try {
        const data = await callMemoryLLMJson(`你是 UploadSoul 的情绪感知模块。请根据用户当前输入、被唤起的记忆片段，判断数字人应该用什么情绪、语言风格和语音表现回应。

返回严格 JSON，不要额外文字：
{
  "emotion_label": "joy|sadness|anger|fear|surprise|neutral之一",
  "intensity": 0-5的数字,
  "tone": "calm|warm|comforting|nostalgic|gentle_happy|serious|encouraging之一",
  "speaking_style": "中文短语，描述语言风格",
  "tts_prompt": "English short voice style prompt, e.g. Warm, gentle and nostalgic",
  "visual_mood": "warm|blue|red|green|neutral之一",
  "reason": "20字以内原因"
}

档案：${profile?.display_name || '未命名'}
用户输入：${message}

唤起的记忆：
${memoryBlock || '暂无'}`);
        return {
            ...fallbackEmotionState(),
            ...data,
            intensity: Math.max(0, Math.min(5, Number(data.intensity ?? 2)))
        };
    } catch (error) {
        console.warn('[EmotionState] fallback:', error.message);
        return fallbackEmotionState();
    }
}

function estimateEmotionState({ message = '', memories = [] }) {
    const text = String(message).toLowerCase();
    const memory = memories.find(item => item.emotion_label && item.emotion_label !== 'neutral') || memories[0];
    let emotionLabel = memory?.emotion_label || 'neutral';
    let intensity = Number(memory?.emotion_score ?? 2);

    if (/开心|高兴|想笑|幸福|喜欢|真好|太好了|快乐|哈哈/.test(message)) {
        emotionLabel = 'joy';
        intensity = Math.max(intensity, 3.2);
    } else if (/难过|想哭|遗憾|后悔|舍不得|去世|离开|孤单|想念|怀念/.test(message)) {
        emotionLabel = 'sadness';
        intensity = Math.max(intensity, 3.4);
    } else if (/生气|愤怒|讨厌|委屈|不公平|气死/.test(message)) {
        emotionLabel = 'anger';
        intensity = Math.max(intensity, 3.3);
    } else if (/害怕|担心|焦虑|紧张|不安/.test(message)) {
        emotionLabel = 'fear';
        intensity = Math.max(intensity, 3);
    } else if (/没想到|竟然|突然|惊讶/.test(message) || text.includes('wow')) {
        emotionLabel = 'surprise';
        intensity = Math.max(intensity, 2.8);
    }

    const toneMap = {
        joy: ['gentle_happy', '轻快、亲近、带一点笑意', 'Warm, lightly happy', 'warm'],
        sadness: ['nostalgic', '慢一点、柔和、带一点怀念', 'Soft, slow and nostalgic', 'blue'],
        anger: ['serious', '克制、认真、不过度激烈', 'Serious and restrained', 'red'],
        fear: ['comforting', '安抚、稳定、给人安全感', 'Comforting and steady', 'blue'],
        surprise: ['warm', '轻快、好奇、自然回应', 'Curious and warm', 'green'],
        neutral: ['calm', '平静、温柔、自然', 'Calm and warm', 'neutral']
    };
    const [tone, speakingStyle, ttsPrompt, visualMood] = toneMap[emotionLabel] || toneMap.neutral;
    return {
        emotion_label: emotionLabel,
        intensity: Math.max(0, Math.min(5, Number.isFinite(intensity) ? intensity : 2)),
        tone,
        speaking_style: speakingStyle,
        tts_prompt: ttsPrompt,
        visual_mood: visualMood,
        reason: memories.length ? '基于相关记忆' : '基于当前语气'
    };
}

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
        if (body?.profile_id) return await handleMemoryChat(req, res, body);
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

    try {
        // 兼容 JSON 和 FormData 两种请求格式
        let fields = {};
        let files = {};

        const contentType = req.headers['content-type'] || '';

        if (contentType.includes('multipart/form-data')) {
            // 语音请求：FormData
            const form = formidable({ multiples: false });
            [fields, files] = await new Promise((resolve, reject) => {
                form.parse(req, (err, f, fi) => err ? reject(err) : resolve([f, fi]));
            });
        } else {
            // 文字请求：JSON
            const body = await new Promise((resolve, reject) => {
                let data = '';
                req.on('data', chunk => { data += chunk; });
                req.on('end', () => {
                    try { resolve(data ? JSON.parse(data) : {}); }
                    catch (e) { reject(e); }
                });
            });
            // 把 JSON body 转换为 fields 格式，和 formidable 的结构保持一致
            Object.keys(body).forEach(key => {
                fields[key] = [body[key]];
            });
        }

        const get = (key, def = '') => Array.isArray(fields[key]) ? fields[key][0] : (fields[key] ?? def);

        // 加这行日志
        console.log('[Chat] fields:', JSON.stringify(fields).slice(0, 200), 'message:', get('message'));

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

/**
 * Gemini MVP / Groq Fallback Route
 */
async function handleGeminiChat(req, res) {
    try {
        const body = await new Promise((resolve, reject) => {
            let data = '';
            req.on('data', chunk => { data += chunk; });
            req.on('end', () => {
                try { resolve(data ? JSON.parse(data) : {}); }
                catch (e) { reject(e); }
            });
        });

        const { message } = body || {};
        const geminiKey = process.env.GEMINI_API_KEY;
        const groqKey = process.env.GROQ_API_KEY;

        if (!geminiKey || !groqKey) {
            return res.status(500).json({ error: 'API keys missing' });
        }

        const targetModel = "gemini-3.1-flash-live-preview";
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${geminiKey}`;

        // System prompt for Gemini Audio Generation
        const systemPrompt = "You are an affectionate, kind elderly man. Use emotional tags like [laughs] and descriptive prompts like 'Infectious enthusiasm' to express emotion. Respond in Chinese.";

        let geminiResponse, geminiData;
        try {
            console.log(`[GeminiChat] Calling Gemini model: ${targetModel}`);
            geminiResponse = await fetch(geminiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: systemPrompt }] },
                    contents: [{ role: "user", parts: [{ text: message }] }],
                    generationConfig: {
                        responseModalities: ["TEXT", "AUDIO"],
                        speechConfig: {
                            voiceConfig: {
                                prebuiltVoiceConfig: {
                                    voiceName: "Charon"
                                }
                            }
                        }
                    }
                })
            });

            geminiData = await geminiResponse.json();
            
            // Auto fallback for 404 (Experimental models might be taken down or not support REST)
            if (geminiData.error && geminiData.error.code === 404) {
                console.log(`[GeminiChat] ${targetModel} not found. Falling back to gemini-2.5-flash`);
                const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
                geminiResponse = await fetch(fallbackUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        systemInstruction: { parts: [{ text: systemPrompt }] },
                        contents: [{ role: "user", parts: [{ text: message }] }]
                    })
                });
                geminiData = await geminiResponse.json();
            }

            if (geminiResponse.ok && !geminiData.error) {
                let replyText = '';
                let audioString = null;
                if (geminiData.candidates && geminiData.candidates[0].content.parts) {
                    for (const part of geminiData.candidates[0].content.parts) {
                        if (part.text) replyText += part.text;
                        if (part.inlineData) {
                            audioString = `data:${part.inlineData.mimeType || 'audio/wav'};base64,${part.inlineData.data}`;
                        }
                    }
                }
                return res.status(200).json({ reply: replyText, audio: audioString, engine: 'gemini' });
            } else {
                throw new Error(geminiData.error?.message || "Gemini API Failed");
            }
        } catch (e) {
            console.warn("[GeminiChat] Gemini failed, attempting fallbacks:", e.message);
            
            const sfKey = SILICONFLOW_API_KEY;
            
            const tryOpenAIFormat = async (url, key, modelParam) => {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: modelParam,
                        messages: [
                            { role: "system", content: systemPrompt },
                            { role: "user", content: message }
                        ]
                    })
                });
                const data = await response.json();
                if (data.choices && data.choices.length > 0) return data.choices[0].message.content;
                throw new Error(data.error?.message || `${modelParam} API Failed`);
            };

            let reply = '';
            try {
                if (!sfKey) throw new Error("SiliconFlow API key missing");
                // 1. SiliconFlow - DeepSeek-V3
                console.log("[GeminiChat] Trying SiliconFlow: DeepSeek-V3");
                reply = await tryOpenAIFormat("https://api.siliconflow.cn/v1/chat/completions", sfKey, "deepseek-ai/DeepSeek-V3");
                return res.status(200).json({ reply, engine: 'siliconflow-deepseek' });
            } catch (sfErr1) {
                console.warn("[GeminiChat] DeepSeek-V3 failed:", sfErr1.message);
                try {
                    // 2. SiliconFlow - Qwen2.5
                    console.log("[GeminiChat] Trying SiliconFlow: Qwen2.5-7B");
                    reply = await tryOpenAIFormat("https://api.siliconflow.cn/v1/chat/completions", sfKey, "Qwen/Qwen2.5-7B-Instruct");
                    return res.status(200).json({ reply, engine: 'siliconflow-qwen' });
                } catch (sfErr2) {
                    console.warn("[GeminiChat] Qwen2.5-7B failed:", sfErr2.message);
                    try {
                        // 3. Groq fallback
                        console.log("[GeminiChat] Trying Groq");
                        reply = await tryOpenAIFormat("https://api.groq.com/openai/v1/chat/completions", groqKey, "llama-3.3-70b-versatile");
                        return res.status(200).json({ reply, engine: 'groq' });
                    } catch (groqErr) {
                        console.warn("[GeminiChat] Groq also failed:", groqErr.message);
                        throw new Error("网络访问受限，所有的海外节点（Gemini/Groq/SiliconFlow）均连接失败。");
                    }
                }
            }
        }
    } catch (error) {
        console.error("[GeminiChat] Fatal Exception:", error.message);
        // Do not throw 500 to frontend, return 200 with an empathetic fallback message so frontend TTS reads it gracefully.
        return res.status(200).json({ 
            reply: `嗯...刚才网线好像被风吹断了一下，我没听太清，我在思考。要不你再说一次？`, 
            engine: 'fallback' 
        });
    }
}

async function handleProfiles(req, res) {
    const auth = await getAuthedSupabase(req);
    if (auth.error) return res.status(401).json({ error: auth.error });
    const { user, supabaseAdmin } = auth;

    if (req.method === 'GET') {
        const url = new URL(req.url, 'http://localhost');
        const personaType = url.searchParams.get('persona_type');
        let query = supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('user_id', user.id);
        if (personaType) query = query.eq('persona_type', personaType);
        const { data, error } = await query
            .order('elevenlabs_voice_id', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false });
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ profiles: data || [] });
    }

    if (req.method === 'POST') {
        const body = await readJsonBody(req);
        const personaType = ['immortality', 'rebirth', 'historical', 'lover', 'companion', 'test'].includes(body.persona_type) ? body.persona_type : 'immortality';
        const payload = {
            user_id: user.id,
            persona_type: personaType,
            relationship: body.relationship || (personaType === 'immortality' ? 'self' : null),
            status: body.status || 'collecting',
            display_name: body.display_name || user.user_metadata?.nickname || user.email?.split('@')[0] || '我的数字人',
            birth_date: body.birth_date || null,
            description: body.description || '由碎片化记忆逐步生成的数字分身。',
            avatar_url: body.avatar_url || null,
            voice_sample_url: body.voice_sample_url || null,
            elevenlabs_voice_id: body.elevenlabs_voice_id || null,
            metadata: body.metadata || {}
        };
        const { data, error } = await supabaseAdmin.from('profiles').insert(payload).select('*').single();
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ profile: data });
    }

    if (req.method === 'PATCH') {
        const body = await readJsonBody(req);
        const profileId = body.id || body.profile_id;
        if (!profileId) return res.status(400).json({ error: 'profile id is required' });
        const patch = {};
        ['display_name', 'description', 'avatar_url', 'voice_sample_url', 'elevenlabs_voice_id', 'persona_type', 'relationship', 'status', 'metadata'].forEach(key => {
            if (Object.prototype.hasOwnProperty.call(body, key)) patch[key] = body[key];
        });
        const { data, error } = await supabaseAdmin
            .from('profiles')
            .update(patch)
            .eq('id', profileId)
            .eq('user_id', user.id)
            .select('*')
            .single();
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ profile: data });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}

async function handleProfileAssets(req, res) {
    const auth = await getAuthedSupabase(req);
    if (auth.error) return res.status(401).json({ error: auth.error });
    const { user, supabaseAdmin } = auth;

    if (req.method === 'GET') {
        const url = new URL(req.url, 'http://localhost');
        const profileId = url.searchParams.get('profile_id');
        const assetType = url.searchParams.get('asset_type');
        if (!profileId) return res.status(400).json({ error: 'profile_id is required' });
        let query = supabaseAdmin
            .from('profile_assets')
            .select('*')
            .eq('user_id', user.id)
            .eq('profile_id', profileId)
            .order('created_at', { ascending: false });
        if (assetType) query = query.eq('asset_type', assetType);
        const { data, error } = await query;
        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ assets: data || [] });
    }

    if (req.method === 'POST') {
        try {
            const [fields, files] = await parseMultipart(req, { maxFileSize: MAX_AUDIO_BYTES });
            const profileId = fieldValue(fields, 'profile_id');
            const assetType = fieldValue(fields, 'asset_type');
            const role = fieldValue(fields, 'role', 'reference');
            const transcript = fieldValue(fields, 'transcript') || null;
            const metadataRaw = fieldValue(fields, 'metadata') || '{}';
            const file = fileValue(files, 'file');
            if (!profileId || !assetType || !file) return res.status(400).json({ error: 'profile_id, asset_type and file are required' });
            if (!['voice', 'image', 'video'].includes(assetType)) return res.status(400).json({ error: 'invalid asset_type' });
            const size = file.size || 0;
            if (assetType === 'voice' && size > MAX_AUDIO_BYTES) return res.status(413).json({ error: 'Audio must be under 25MB' });
            if (assetType !== 'voice' && size > MAX_IMAGE_BYTES * 3) return res.status(413).json({ error: 'Visual asset is too large' });

            const { data: profile, error: profileError } = await supabaseAdmin
                .from('profiles')
                .select('id,user_id')
                .eq('id', profileId)
                .eq('user_id', user.id)
                .single();
            if (profileError || !profile) return res.status(404).json({ error: 'Profile not found' });

            const { cloudinaryService } = await import('./_lib/cloudinary-server.js');
            const url = await cloudinaryService.uploadMemoryMedia(file.filepath, file.mimetype || 'application/octet-stream');
            let metadata = {};
            try { metadata = JSON.parse(metadataRaw || '{}'); } catch { metadata = {}; }
            const qualityScore = Math.min(1, Math.max(0.25, (size > 200 * 1024 ? 0.65 : 0.45) + (role === 'primary' ? 0.1 : 0)));

            const { data, error } = await supabaseAdmin.from('profile_assets').insert({
                user_id: user.id,
                profile_id: profileId,
                asset_type: assetType,
                role,
                url,
                file_name: file.originalFilename || file.newFilename || 'asset',
                mime_type: file.mimetype || null,
                file_size: size,
                transcript,
                quality_score: Number(qualityScore.toFixed(2)),
                is_primary: role === 'primary',
                metadata
            }).select('*').single();
            if (error) return res.status(500).json({ error: error.message });
            return res.status(200).json({ asset: data });
        } catch (error) {
            console.error('[ProfileAssets] Fatal:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method === 'PATCH') {
        const body = await readJsonBody(req);
        const assetId = body.id;
        if (!assetId) return res.status(400).json({ error: 'asset id is required' });
        const patch = {};
        ['role', 'transcript', 'quality_score', 'is_primary', 'metadata'].forEach(key => {
            if (Object.prototype.hasOwnProperty.call(body, key)) patch[key] = body[key];
        });
        const { data, error } = await supabaseAdmin
            .from('profile_assets')
            .update(patch)
            .eq('id', assetId)
            .eq('user_id', user.id)
            .select('*')
            .single();
        if (error) return res.status(500).json({ error: error.message });
        if (body.is_primary && data?.profile_id && data?.url) {
            if (data.asset_type === 'image' || data.asset_type === 'video') {
                await supabaseAdmin.from('profiles').update({ avatar_url: data.url }).eq('id', data.profile_id).eq('user_id', user.id);
            }
            if (data.asset_type === 'voice') {
                await supabaseAdmin.from('profiles').update({ voice_sample_url: data.url }).eq('id', data.profile_id).eq('user_id', user.id);
            }
        }
        return res.status(200).json({ asset: data });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}

async function handleMemoryUpload(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const auth = await getAuthedSupabase(req);
    if (auth.error) return res.status(401).json({ error: auth.error });
    const { user, supabaseAdmin } = auth;

    try {
        const contentTypeHeader = req.headers['content-type'] || '';
        let fields = {};
        let files = {};
        if (contentTypeHeader.includes('multipart/form-data')) {
            [fields, files] = await parseMultipart(req, { maxFileSize: MAX_AUDIO_BYTES });
        } else {
            const body = await readJsonBody(req);
            fields = Object.fromEntries(Object.entries(body).map(([key, value]) => [key, [value]]));
        }

        const contentType = fieldValue(fields, 'content_type', 'text');
        const profileId = fieldValue(fields, 'profile_id');
        const memoryDate = fieldValue(fields, 'memory_date') || null;
        const textInput = fieldValue(fields, 'text');
        const sourceKindInput = fieldValue(fields, 'source_kind') || '';
        const sourceAssetId = fieldValue(fields, 'source_asset_id') || null;
        const userConfirmed = ['true', '1', true].includes(fieldValue(fields, 'user_confirmed', false));
        const file = fileValue(files, 'file');

        if (!profileId) return res.status(400).json({ error: 'profile_id is required' });
        if (!['text', 'voice', 'image', 'diary', 'social'].includes(contentType)) {
            return res.status(400).json({ error: 'Invalid content_type' });
        }

        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('id,user_id')
            .eq('id', profileId)
            .eq('user_id', user.id)
            .single();
        if (profileError || !profile) return res.status(404).json({ error: 'Profile not found' });

        let contentText = textInput;
        let originalUrl = null;

        if (file) {
            const size = file.size || 0;
            if (contentType === 'image' && size > MAX_IMAGE_BYTES) return res.status(413).json({ error: 'Image must be under 10MB' });
            if (contentType === 'voice' && size > MAX_AUDIO_BYTES) return res.status(413).json({ error: 'Audio must be under 25MB' });
        }

        if (contentType === 'voice' && file) {
            contentText = await transcribeAudio(file);
        }

        if (contentType === 'image' && file) {
            const { cloudinaryService } = await import('./_lib/cloudinary-server.js');
            originalUrl = await cloudinaryService.uploadMemoryMedia(file.filepath, file.mimetype || 'image/jpeg');
            try {
                contentText = await describeImage(file);
            } catch (error) {
                console.warn('[MemoryUpload] Vision fallback:', error.message);
                contentText = textInput || '一张尚未完成视觉解析的照片。';
            }
        }

        if (!contentText?.trim()) return res.status(400).json({ error: 'text or file is required' });

        let analysis = fallbackAnalysis();
        let parseStatus = 'complete';
        try {
            analysis = await callMemoryLLMJson(`你是一个情感记忆分析专家。分析以下记忆内容，返回JSON格式，不要有任何额外文字：
{
  "emotion_score": 0-5的浮点数,
  "emotion_label": "joy|sadness|anger|fear|surprise|neutral之一",
  "people": ["涉及的人名数组"],
  "places": ["涉及的地点数组"],
  "topics": ["核心话题标签数组，最多5个"],
  "importance_score": 0-1的浮点数（根据情感强度和内容独特性判断）,
  "summary": "一句话摘要，20字以内"
}

记忆内容：${contentText}`);
        } catch (error) {
            parseStatus = 'pending';
            console.warn('[MemoryUpload] Claude analysis fallback:', error.message);
        }

        let embedding = null;
        try {
            embedding = await embedText(contentText);
        } catch (error) {
            parseStatus = 'pending';
            console.warn('[MemoryUpload] Voyage embedding failed:', error.message);
        }
        const sourceKind = sourceKindInput || (contentType === 'voice' ? 'voice' : contentType === 'image' ? 'image' : 'manual');
        const quality = estimateMemoryQuality({
            contentText,
            contentType,
            analysis,
            sourceKind,
            userConfirmed
        });

        const { data, error } = await supabaseAdmin.from('memory_fragments').insert({
            user_id: user.id,
            profile_id: profileId,
            content_text: contentText.trim(),
            content_type: contentType,
            original_url: originalUrl,
            emotion_score: Math.min(5, Math.max(0, Number(analysis.emotion_score ?? 0))),
            emotion_label: analysis.emotion_label || 'neutral',
            people: Array.isArray(analysis.people) ? analysis.people : [],
            places: Array.isArray(analysis.places) ? analysis.places : [],
            topics: Array.isArray(analysis.topics) ? analysis.topics.slice(0, 5) : [],
            importance_score: Math.min(1, Math.max(0, Number(analysis.importance_score ?? 0.5))),
            memory_date: memoryDate || new Date().toISOString(),
            summary: analysis.summary || contentText.slice(0, 20),
            parse_status: parseStatus,
            source_kind: sourceKind,
            source_asset_id: sourceAssetId,
            confidence_score: quality.confidence_score,
            specificity_score: quality.specificity_score,
            user_confirmed: userConfirmed,
            quality_notes: quality.quality_notes,
            metadata: { ingestion: 'memory_upload' },
            embedding
        }).select('id,content_text,emotion_label,emotion_score,topics,importance_score,summary,original_url,memory_date,parse_status,confidence_score,specificity_score,user_confirmed,source_kind').single();

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ success: true, fragment: data });
    } catch (error) {
        console.error('[MemoryUpload] Fatal:', error);
        return res.status(500).json({ error: error.message });
    }
}

async function handleMemoryFragments(req, res) {
    const auth = await getAuthedSupabase(req);
    if (auth.error) return res.status(401).json({ error: auth.error });
    const { user, supabaseAdmin } = auth;
    const url = new URL(req.url, 'http://localhost');
    const profileId = url.searchParams.get('profile_id');
    if (!profileId) return res.status(400).json({ error: 'profile_id is required' });
    const { data, error } = await supabaseAdmin
        .from('memory_fragments')
        .select('id,content_text,content_type,original_url,emotion_score,emotion_label,people,places,topics,importance_score,memory_date,created_at,summary,parse_status,source_kind,source_asset_id,confidence_score,specificity_score,user_confirmed,quality_notes')
        .eq('user_id', user.id)
        .eq('profile_id', profileId)
        .order('memory_date', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ fragments: data || [] });
}

async function handleMemorySearch(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const auth = await getAuthedSupabase(req);
    if (auth.error) return res.status(401).json({ error: auth.error });
    const { user, supabaseAdmin } = auth;
    const { query, profile_id, limit = 5 } = await readJsonBody(req);
    if (!query || !profile_id) return res.status(400).json({ error: 'query and profile_id are required' });
    const embedding = await embedText(query);
    const { data, error } = await supabaseAdmin.rpc('match_memory_fragments', {
        query_embedding: embedding,
        match_profile_id: profile_id,
        match_user_id: user.id,
        match_count: Math.min(20, Number(limit) || 5)
    });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ fragments: data || [] });
}

async function handleMemoryFeedback(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const auth = await getAuthedSupabase(req);
    if (auth.error) return res.status(401).json({ error: auth.error });
    const { user, supabaseAdmin } = auth;
    const {
        profile_id,
        conversation_id = null,
        query = '',
        answer = '',
        source_fragment_ids = [],
        rating = null,
        feedback_type = 'other',
        comment = ''
    } = await readJsonBody(req);
    if (!profile_id) return res.status(400).json({ error: 'profile_id is required' });
    const ids = Array.isArray(source_fragment_ids) ? source_fragment_ids.filter(Boolean) : [];
    const normalizedType = ['accurate', 'wrong', 'not_like_person', 'useful', 'missing_memory', 'other'].includes(feedback_type) ? feedback_type : 'other';
    const normalizedRating = rating == null ? null : Math.min(5, Math.max(1, Number(rating) || 1));

    const { data, error } = await supabaseAdmin.from('memory_feedback').insert({
        user_id: user.id,
        profile_id,
        conversation_id,
        query,
        answer,
        source_fragment_ids: ids,
        rating: normalizedRating,
        feedback_type: normalizedType,
        comment
    }).select('*').single();
    if (error) return res.status(500).json({ error: error.message });

    if (ids.length && (normalizedRating >= 4 || ['accurate', 'useful'].includes(normalizedType))) {
        await supabaseAdmin
            .from('memory_fragments')
            .update({ user_confirmed: true })
            .eq('user_id', user.id)
            .eq('profile_id', profile_id)
            .in('id', ids);
    }
    return res.status(200).json({ feedback: data });
}

async function handleInterviewNext(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const auth = await getAuthedSupabase(req);
    if (auth.error) return res.status(401).json({ error: auth.error });
    const { user, supabaseAdmin } = auth;

    try {
        const { profile_id, history = [], mode = 'warmup' } = await readJsonBody(req);
        if (!profile_id) return res.status(400).json({ error: 'profile_id is required' });

        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('id,user_id,display_name,description')
            .eq('id', profile_id)
            .eq('user_id', user.id)
            .single();
        if (profileError || !profile) return res.status(404).json({ error: 'Profile not found' });

        const { data: recent = [] } = await supabaseAdmin
            .from('memory_fragments')
            .select('summary,content_text,topics,emotion_label,memory_date')
            .eq('profile_id', profile_id)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(8);

        const recentBlock = recent
            .map(item => `- [${item.emotion_label || 'neutral'}] ${(item.summary || item.content_text || '').slice(0, 120)}`)
            .join('\n');
        const historyBlock = history
            .slice(-8)
            .map(item => `${item.role === 'assistant' ? 'AI' : '用户'}：${item.content}`)
            .join('\n');

        const data = await callMemoryLLMJson(`你是 UploadSoul 的 AI 访谈采集员，目标是温柔地帮助用户想起可被结构化保存的人生记忆。请基于用户已有记忆和刚才对话，提出下一个问题。

要求：
1. 问题必须具体、温柔、容易回答，避免宏大空泛。
2. 每次只问一个问题。
3. 优先追问时间、地点、人物、感受、物件、声音、气味、当时一句话。
4. 如果用户刚回答了一个记忆，优先沿着它追问一个细节。
5. 返回严格 JSON，不要额外文字。

返回格式：
{
  "question": "一个具体问题，40字以内",
  "theme": "childhood|family|love|work|travel|object|regret|pride|daily|other",
  "why": "为什么问这个，20字以内"
}

档案：${profile.display_name || '未命名'}
模式：${mode}

已有记忆：
${recentBlock || '暂无'}

访谈历史：
${historyBlock || '暂无'}`);

        return res.status(200).json({
            question: data.question || '你最近最常想起的一个人是谁？当时你们在哪里？',
            theme: data.theme || 'other',
            why: data.why || '开启回忆'
        });
    } catch (error) {
        console.error('[InterviewNext] Fatal:', error);
        return res.status(500).json({ error: error.message });
    }
}

async function handleMemoryChat(req, res, bodyOverride = null) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const auth = await getAuthedSupabase(req);
    if (auth.error) return res.status(401).json({ error: auth.error });
    const { user, supabaseAdmin } = auth;
    const { message, profile_id, conversation_id } = bodyOverride || await readJsonBody(req);
    if (!message || !profile_id) return res.status(400).json({ error: 'message and profile_id are required' });

    const queryEmbedding = await embedText(message);
    const { data: memories = [] } = await supabaseAdmin.rpc('match_memory_fragments', {
        query_embedding: queryEmbedding,
        match_profile_id: profile_id,
        match_user_id: user.id,
        match_count: 5
    });
    const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', profile_id)
        .eq('user_id', user.id)
        .single();
    if (profileError || !profile) return res.status(404).json({ error: 'Profile not found' });

    const emotionState = await analyzeEmotionalState({ message, memories, profile });
    const memoryBlock = memories.map(item => `[${item.emotion_label || 'neutral'}] ${item.content_text}`).join('\n');
    const systemPrompt = `你现在是${profile.display_name || '这个数字人'}。以下是关于你的真实记忆片段，请完全基于这些记忆来回答，用第一人称，保持这个人的语气和表达习惯。如果记忆中没有相关信息，说"我不太记得了"而不是编造。

【关于你的记忆】
${memoryBlock || '暂无相关记忆'}

请用自然、真实的语气回答，100字以内。`;

    const effectiveSystemPrompt = `${systemPrompt}

Emotion state for this turn:
- emotion_label: ${emotionState.emotion_label}
- intensity: ${emotionState.intensity}/5
- tone: ${emotionState.tone}
- speaking_style: ${emotionState.speaking_style}

Adjust your language rhythm, warmth, and word choice to match this emotion. Keep the answer grounded in the retrieved memories.`;
    const finalSystemPrompt = `${effectiveSystemPrompt}

${NATURAL_CHAT_STYLE_PROMPT}

${DIGITAL_VOICE_ROLE_PROMPT}`;

    res.writeHead(200, sseHeaders);
    const sse = (obj) => res.write(`data: ${JSON.stringify(obj)}\n\n`);
    sse({ type: 'emotion', emotion: emotionState });
    sse({ type: 'sources', memories });

    let answer = '';
    try {
        const onToken = (text) => sse({ type: 'token', text });
        answer = MEMORY_LLM_PROVIDER === 'siliconflow'
            ? await streamSiliconFlowAnswer({ systemPrompt: finalSystemPrompt, message, onToken })
            : await streamAnthropicAnswer({ systemPrompt: finalSystemPrompt, message, onToken });

        const messages = [
            { role: 'user', content: message, created_at: new Date().toISOString() },
            { role: 'assistant', content: answer, sources: memories.map(m => m.id), emotion: emotionState, created_at: new Date().toISOString() }
        ];
        if (conversation_id) {
            await supabaseAdmin.rpc('append_conversation_messages', {
                conversation_id_input: conversation_id,
                user_id_input: user.id,
                new_messages: messages
            });
        } else {
            await supabaseAdmin.from('conversations').insert({ user_id: user.id, profile_id, messages });
        }
        sse({ type: 'done', fullText: answer });
        await persistConversationMemory({
            supabaseAdmin,
            userId: user.id,
            profileId: profile_id,
            userMessage: message,
            assistantReply: answer,
            emotionState,
            sources: memories
        });
        res.end();
    } catch (error) {
        console.error('[MemoryChat] Fatal:', error);
        sse({ type: 'error', error: error.message });
        res.end();
    }
}

async function handleCloudinarySignature(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const auth = await getAuthedSupabase(req);
    if (auth.error) return res.status(401).json({ error: auth.error });
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        return res.status(500).json({ error: 'Cloudinary server credentials missing' });
    }

    const body = await readJsonBody(req);
    const timestamp = Math.round(Date.now() / 1000);
    const folder = body.folder || `user_content/${auth.user.id}`;
    if (!folder.startsWith(`user_content/${auth.user.id}`)) {
        return res.status(403).json({ error: 'Invalid upload folder' });
    }

    const params = { folder, timestamp };
    const signatureBase = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&') + process.env.CLOUDINARY_API_SECRET;
    const signature = crypto.createHash('sha1').update(signatureBase).digest('hex');

    return res.status(200).json({
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        folder,
        timestamp,
        signature
    });
}

async function cloneVoiceWithSiliconFlow(file, transcript, userId) {
    if (!SILICONFLOW_API_KEY) throw new Error('SILICONFLOW_API_KEY or SILICON_FLOW_API_KEY missing');
    const form = new FormData();
    const buffer = fs.readFileSync(file.filepath);
    const mimeType = file.mimetype || 'audio/mpeg';
    const originalName = file.originalFilename || '';
    const fallbackName = mimeType.includes('wav')
        ? 'voice-sample.wav'
        : mimeType.includes('mpeg') || mimeType.includes('mp3')
            ? 'voice-sample.mp3'
            : mimeType.includes('opus') || originalName.match(/\.(opus|ogg)$/i)
                ? 'voice-sample.opus'
                : 'voice-sample.wav';
    const uploadName = originalName.match(/\.(wav|mp3|pcm|opus)$/i) ? originalName : fallbackName;
    const blob = new Blob([buffer], { type: mimeType });
    const customName = `uploadsoul-${userId.slice(0, 8)}-${Date.now()}`;
    form.append('file', blob, uploadName);
    form.append('model', process.env.SILICONFLOW_TTS_MODEL || 'FunAudioLLM/CosyVoice2-0.5B');
    form.append('customName', customName);
    form.append('text', transcript || '这是一段用于生成声音样本的参考音频。');

    const response = await fetch(`${SILICONFLOW_API_BASE}/uploads/audio/voice`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${SILICONFLOW_API_KEY}` },
        body: form
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data?.error?.message || data?.message || 'CosyVoice2 clone failed');
    console.log('[VoiceClone] SiliconFlow response:', {
        keys: Object.keys(data || {}),
        dataKeys: data?.data ? Object.keys(data.data) : [],
        uri: data.uri || data.data?.uri || data.voice || data.data?.voice
    });
    const uri = data.uri || data.data?.uri || data.voice || data.data?.voice || data.voice_uri || data.data?.voice_uri;
    if (!uri) throw new Error('CosyVoice2 did not return a voice uri');
    return uri;
}

async function handleVoiceClone(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const auth = await getAuthedSupabase(req);
    if (auth.error) return res.status(401).json({ error: auth.error });
    const { user, supabaseAdmin } = auth;

    try {
        const [fields, files] = await parseMultipart(req, { maxFileSize: MAX_AUDIO_BYTES });
        const profileId = fieldValue(fields, 'profile_id');
        const assetId = fieldValue(fields, 'asset_id') || null;
        const file = fileValue(files, 'file');
        if (!profileId) return res.status(400).json({ error: 'profile_id is required' });
        if (!file) return res.status(400).json({ error: 'voice sample file is required' });
        if ((file.size || 0) > MAX_AUDIO_BYTES) return res.status(413).json({ error: 'Audio must be under 25MB' });

        const { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('id,user_id')
            .eq('id', profileId)
            .eq('user_id', user.id)
            .single();
        if (profileError || !profile) return res.status(404).json({ error: 'Profile not found' });

        const transcript = await transcribeAudio(file);
        const voiceUri = await cloneVoiceWithSiliconFlow(file, transcript, user.id);

        let sampleUrl = null;
        try {
            const { cloudinaryService } = await import('./_lib/cloudinary-server.js');
            sampleUrl = await cloudinaryService.uploadMemoryMedia(file.filepath, file.mimetype || 'audio/mpeg');
        } catch (error) {
            console.warn('[VoiceClone] sample upload skipped:', error.message);
        }

        let asset = null;
        if (sampleUrl) {
            const assetPayload = {
                role: 'voice_sample',
                url: sampleUrl,
                file_name: file.originalFilename || file.newFilename || 'voice-sample',
                mime_type: file.mimetype || null,
                file_size: file.size || null,
                transcript,
                quality_score: 0.75,
                is_primary: true,
                metadata: { voice_ready: true }
            };
            const assetQuery = assetId
                ? supabaseAdmin
                    .from('profile_assets')
                    .update(assetPayload)
                    .eq('id', assetId)
                    .eq('user_id', user.id)
                    .eq('profile_id', profileId)
                : supabaseAdmin
                    .from('profile_assets')
                    .insert({
                        user_id: user.id,
                        profile_id: profileId,
                        asset_type: 'voice',
                        ...assetPayload
                    });
            const { data: assetData, error: assetError } = await assetQuery.select('*').single();
            if (assetError) console.warn('[VoiceClone] asset insert skipped:', assetError.message);
            asset = assetData || null;
        }

        const { data: updated, error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({
                voice_sample_url: sampleUrl,
                elevenlabs_voice_id: voiceUri,
                status: 'voice_ready',
                description: '已完成声音样本初始化，可用于数字人对话语音输出。'
            })
            .eq('id', profileId)
            .eq('user_id', user.id)
            .select('*')
            .single();
        if (updateError) return res.status(500).json({ error: updateError.message });

        return res.status(200).json({
            success: true,
            profile: updated,
            transcript,
            voice_uri: voiceUri,
            sample_url: sampleUrl,
            asset
        });
    } catch (error) {
        console.error('[VoiceClone] Fatal:', error);
        return res.status(500).json({ error: error.message });
    }
}

async function handleVoiceSpeech(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const auth = await getAuthedSupabase(req);
    if (auth.error) return res.status(401).json({ error: auth.error });
    const { user, supabaseAdmin } = auth;

    try {
        const startedAt = Date.now();
        const { profile_id, text, voice_uri, emotion } = await readJsonBody(req);
        if (!profile_id || !text) return res.status(400).json({ error: 'profile_id and text are required' });

        let voice = voice_uri;
        let voiceSource = voice_uri ? 'request' : 'profile';
        if (!voice) {
            const { data: profile, error: profileError } = await supabaseAdmin
                .from('profiles')
                .select('id,user_id,elevenlabs_voice_id')
                .eq('id', profile_id)
                .eq('user_id', user.id)
                .single();
            if (profileError || !profile) return res.status(404).json({ error: 'Profile not found' });
            voice = profile.elevenlabs_voice_id;
        }
        if (!voice) {
            return res.status(400).json({ error: 'No cloned voice uri found for this profile. Please clone a voice sample first.' });
        }
        if (!SILICONFLOW_API_KEY) throw new Error('SILICONFLOW_API_KEY or SILICON_FLOW_API_KEY missing');
        const speechText = cleanTextForSpeech(text);
        if (!speechText) return res.status(400).json({ error: 'speech text is empty after cleanup' });

        const response = await fetch(`${SILICONFLOW_API_BASE}/audio/speech`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${SILICONFLOW_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: process.env.SILICONFLOW_TTS_MODEL || 'FunAudioLLM/CosyVoice2-0.5B',
                voice,
                input: speechText,
                response_format: 'wav',
                sample_rate: 32000,
                stream: false
            })
        });
        const arrayBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || '';
        if (!response.ok) {
            const errorText = Buffer.from(arrayBuffer).toString('utf8');
            throw new Error(errorText || 'Speech synthesis failed');
        }
        const looksLikeWav = Buffer.from(arrayBuffer.slice(0, 4)).toString('ascii') === 'RIFF';
        const isBinaryAudio = contentType.includes('audio') || contentType.includes('octet-stream') || looksLikeWav;
        if (!isBinaryAudio || arrayBuffer.byteLength < 128) {
            const responseText = Buffer.from(arrayBuffer).toString('utf8');
            console.warn('[VoiceSpeech] unexpected response:', { contentType, bytes: arrayBuffer.byteLength, responseText: responseText.slice(0, 300) });
            throw new Error(responseText || `Speech synthesis returned non-audio response (${contentType || 'unknown'})`);
        }
        console.log('[VoiceSpeech] audio generated:', { ms: Date.now() - startedAt, contentType, bytes: arrayBuffer.byteLength, voiceSource, voice: String(voice).slice(0, 96) });
        const mimeType = contentType.includes('audio') ? contentType : 'audio/wav';
        return res.status(200).json({
            success: true,
            mime_type: mimeType,
            audio: `data:${mimeType};base64,${Buffer.from(arrayBuffer).toString('base64')}`,
            voice,
            bytes: arrayBuffer.byteLength,
            emotion: emotion || fallbackEmotionState()
        });
    } catch (error) {
        console.error('[VoiceSpeech] Fatal:', error);
        return res.status(500).json({ error: error.message });
    }
}

async function handleTestChat(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const auth = await getAuthedSupabase(req);
    if (auth.error) return res.status(401).json({ error: auth.error });
    const { user, supabaseAdmin } = auth;

    try {
        const { profile_id, message } = await readJsonBody(req);
        if (!profile_id || !message) return res.status(400).json({ error: 'profile_id and message are required' });
        const startedAt = Date.now();
        const profilePromise = supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', profile_id)
            .eq('user_id', user.id)
            .single();
        const embeddingPromise = embedText(message);

        const { data: profile, error: profileError } = await profilePromise;
        if (profileError || !profile) return res.status(404).json({ error: 'Profile not found' });

        let memories = [];
        try {
            const queryEmbedding = await embeddingPromise;
            const { data: matched = [] } = await supabaseAdmin.rpc('match_memory_fragments', {
                query_embedding: queryEmbedding,
                match_profile_id: profile_id,
                match_user_id: user.id,
                match_count: 5
            });
            memories = matched;
        } catch (error) {
            console.warn('[TestChat] memory retrieval skipped:', error.message);
        }
        const emotionState = estimateEmotionState({ message, memories });
        const memoryBlock = memories
            .map(item => `[${item.emotion_label || 'neutral'}] ${item.content_text || item.summary || ''}`)
            .join('\n');

        const data = await callSiliconFlowChat({
            model: MEMORY_LLM_MODEL,
            temperature: 0.78,
            maxTokens: 160,
            messages: [
                {
                    role: 'system',
                    content: `Retrieved memories:
${memoryBlock || 'None'}

Emotion state:
- emotion_label: ${emotionState.emotion_label}
- intensity: ${emotionState.intensity}/5
- tone: ${emotionState.tone}
- speaking_style: ${emotionState.speaking_style}

Adjust your language rhythm, warmth, and word choice to match this emotion. If no relevant memory exists, admit uncertainty instead of inventing details.`
                },
                {
                    role: 'system',
                    content: NATURAL_CHAT_STYLE_PROMPT
                },
                {
                    role: 'system',
                    content: DIGITAL_VOICE_ROLE_PROMPT
                },
                {
                    role: 'system',
                    content: `你是${profile.display_name || 'UploadSoul 数字人'}的测试人格。用第一人称、自然口语回答，避免编造具体人生事实。回答控制在80字以内。`
                },
                { role: 'user', content: message }
            ]
        });
        const reply = data.choices?.[0]?.message?.content?.trim() || '我听到了，我们继续聊。';
        console.log('[TestChat] completed:', { ms: Date.now() - startedAt, memories: memories.length, model: MEMORY_LLM_MODEL });
        res.status(200).json({ reply, profile, emotion: emotionState, sources: memories });
        await persistConversationMemory({
            supabaseAdmin,
            userId: user.id,
            profileId: profile_id,
            userMessage: message,
            assistantReply: reply,
            emotionState,
            sources: memories
        });
        return;
    } catch (error) {
        console.error('[TestChat] Fatal:', error);
        return res.status(500).json({ error: error.message });
    }
}

// ──────────────────────────────────────────────
// Universal Router
// ──────────────────────────────────────────────

async function handleTestChatStream(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const auth = await getAuthedSupabase(req);
    if (auth.error) return res.status(401).json({ error: auth.error });
    const { user, supabaseAdmin } = auth;

    try {
        const { profile_id, message } = await readJsonBody(req);
        if (!profile_id || !message) return res.status(400).json({ error: 'profile_id and message are required' });
        const startedAt = Date.now();
        const profilePromise = supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', profile_id)
            .eq('user_id', user.id)
            .single();
        const embeddingPromise = embedText(message);

        const { data: profile, error: profileError } = await profilePromise;
        if (profileError || !profile) return res.status(404).json({ error: 'Profile not found' });

        let memories = [];
        try {
            const queryEmbedding = await embeddingPromise;
            const { data: matched = [] } = await supabaseAdmin.rpc('match_memory_fragments', {
                query_embedding: queryEmbedding,
                match_profile_id: profile_id,
                match_user_id: user.id,
                match_count: 5
            });
            memories = matched;
        } catch (error) {
            console.warn('[TestChatStream] memory retrieval skipped:', error.message);
        }

        const emotionState = estimateEmotionState({ message, memories });
        const memoryBlock = memories
            .map(item => `[${item.emotion_label || 'neutral'}] ${item.content_text || item.summary || ''}`)
            .join('\n');
        const systemPrompt = `Retrieved memories:
${memoryBlock || 'None'}

Emotion state:
- emotion_label: ${emotionState.emotion_label}
- intensity: ${emotionState.intensity}/5
- tone: ${emotionState.tone}
- speaking_style: ${emotionState.speaking_style}

Adjust your language rhythm, warmth, and word choice to match this emotion. If no relevant memory exists, admit uncertainty instead of inventing details.

${NATURAL_CHAT_STYLE_PROMPT}

${DIGITAL_VOICE_ROLE_PROMPT}

You are ${profile.display_name || 'UploadSoul digital person'}. Use first person, natural spoken Chinese, under 80 Chinese characters.`;

        res.writeHead(200, sseHeaders);
        const sse = (obj) => res.write(`data: ${JSON.stringify(obj)}\n\n`);
        sse({ type: 'emotion', emotion: emotionState });
        sse({ type: 'sources', memories });

        let answer = '';
        try {
            answer = await streamSiliconFlowAnswer({
                systemPrompt,
                message,
                onToken: (text) => sse({ type: 'token', text })
            });
            console.log('[TestChatStream] completed:', { ms: Date.now() - startedAt, memories: memories.length, model: MEMORY_LLM_MODEL });
            sse({ type: 'done', fullText: answer, profile, emotion: emotionState, sources: memories });
            await persistConversationMemory({
                supabaseAdmin,
                userId: user.id,
                profileId: profile_id,
                userMessage: message,
                assistantReply: answer,
                emotionState,
                sources: memories
            });
            res.end();
        } catch (error) {
            console.error('[TestChatStream] stream failed:', error);
            sse({ type: 'error', error: error.message });
            res.end();
        }
    } catch (error) {
        console.error('[TestChatStream] Fatal:', error);
        if (!res.headersSent) return res.status(500).json({ error: error.message });
        res.end();
    }
}

export const config = {
    api: { bodyParser: false }
};

export default async function handler(req, res) {
    console.log('[ENV DEBUG]', JSON.stringify({
        VOLC_SPEECH_APPID: process.env.VOLC_SPEECH_APPID,
        VOLC_SPEECH_ACCESS_TOKEN: process.env.VOLC_SPEECH_ACCESS_TOKEN ? 'SET' : 'UNDEFINED',
        VOLC_AK: process.env.VOLC_AK ? 'SET' : 'UNDEFINED',
        AZURE_SPEECH_KEY: process.env.AZURE_SPEECH_KEY ? 'SET' : 'UNDEFINED',
        VOLC_SPEECH_APIKEY: process.env.VOLC_SPEECH_APIKEY ? process.env.VOLC_SPEECH_APIKEY.slice(0, 8) + '...' : 'UNDEFINED',
    }));
    const rawPath = new URL(req.url, 'http://localhost').pathname;
    const pathname = rawPath.replace(/^\/api/, '').replace(/\/$/, '');
    console.log('[Router] pathname resolved:', pathname);

    try {
        if (pathname === '/gemini-chat') return await handleGeminiChat(req, res);
        if (pathname === '/profiles') return await handleProfiles(req, res);
        if (pathname === '/profile-assets') return await handleProfileAssets(req, res);
        if (pathname === '/memory/upload') return await handleMemoryUpload(req, res);
        if (pathname === '/memory/fragments') return await handleMemoryFragments(req, res);
        if (pathname === '/memory/search') return await handleMemorySearch(req, res);
        if (pathname === '/memory/feedback') return await handleMemoryFeedback(req, res);
        if (pathname === '/memory/interview/next') return await handleInterviewNext(req, res);
        if (pathname === '/memory-chat') return await handleMemoryChat(req, res);
        if (pathname === '/cloudinary/signature') return await handleCloudinarySignature(req, res);
        if (pathname === '/voice/clone') return await handleVoiceClone(req, res);
        if (pathname === '/voice/speech') return await handleVoiceSpeech(req, res);
        if (pathname === '/test-chat-stream') return await handleTestChatStream(req, res);
        if (pathname === '/test-chat') return await handleTestChat(req, res);
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
