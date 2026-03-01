/**
 * volcengine-tts.js
 * 火山引擎 BigModel 流式语音合成 (TTS)
 * WebSocket 接口 — 边合成边播放，首包延迟 < 1s
 *
 * 官方文档: https://www.volcengine.com/docs/6561/79822
 * ⚠️  仅供非 MVP 板块使用
 */

import WebSocket from 'ws';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const APPID = process.env.VOLC_SPEECH_APPID || '1750280251';
const API_KEY = process.env.VOLC_SPEECH_APIKEY || 'e507562e-9d2b-4d70-be67-f312793b4fad';
const TTS_WSS = 'wss://openspeech.bytedance.com/api/v3/tts/ws';

// ─────────────────────────────────────────────
// 音色映射表
// ─────────────────────────────────────────────
export const VOICE_MAP = {
    // 虚拟恋人·女
    'bv001_streaming': 'zh_female_cancan_moon_bigtts',
    // 虚拟恋人·男
    'bv002_streaming': 'zh_male_aojiaobadahu_moon_bigtts',
    // 温暖老师 (老年关怀 / 心理健康)
    'bv034_streaming': 'zh_female_wanwanxiaohe_moon_bigtts',
    // 默认
    'default': 'zh_female_cancan_moon_bigtts',
};

// avatarType → 默认 voice + speed
const AVATAR_VOICE_CONFIG = {
    lover: { voiceId: 'bv001_streaming', speedRatio: 1.0 },
    companion: { voiceId: 'bv001_streaming', speedRatio: 1.0 },
    pet: { voiceId: 'bv001_streaming', speedRatio: 1.05 },
    senior: { voiceId: 'bv034_streaming', speedRatio: 0.85 },
    mental: { voiceId: 'bv034_streaming', speedRatio: 0.90 },
    immortality: { voiceId: 'bv001_streaming', speedRatio: 0.95 },
    rebirth: { voiceId: 'bv001_streaming', speedRatio: 0.95 },
};

function resolveVoiceConfig(avatarType, overrideVoiceId) {
    const cfg = AVATAR_VOICE_CONFIG[avatarType] || AVATAR_VOICE_CONFIG.companion;
    return {
        internalVoice: VOICE_MAP[overrideVoiceId || cfg.voiceId] || VOICE_MAP.default,
        speedRatio: cfg.speedRatio,
    };
}

/**
 * 生成连接鉴权 token
 */
function buildAuthHeader() {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const token = `HMAC-SHA256 ${API_KEY}:${timestamp}`;
    return token;
}

/**
 * 流式 TTS — 主入口
 *
 * @param {string} text           - 要合成的文本
 * @param {string} avatarType     - 板块类型，用于自动选音色
 * @param {string} [voiceId]      - 覆盖音色（来自数据库 voice_id 字段）
 * @param {Function} onChunk      - 收到音频 chunk 时回调: (Buffer) => void
 * @param {Function} [onDone]     - 全部完成回调: () => void
 * @param {Function} [onError]    - 错误回调: (Error) => void
 * @param {AbortSignal} [signal]  - 取消控制
 *
 * @returns {Promise<Buffer>} 完整音频 Buffer（流式同时也通过 onChunk 分包配送）
 */
export function streamTTS(text, avatarType = 'companion', voiceId, onChunk, onDone, onError, signal) {
    return new Promise((resolve, reject) => {
        const { internalVoice, speedRatio } = resolveVoiceConfig(avatarType, voiceId);
        const requestId = crypto.randomUUID();
        const audioChunks = [];

        console.log(`[VolcTTS] Synthesizing: voice=${internalVoice}, speed=${speedRatio}, text="${text.slice(0, 30)}..."`);

        const ws = new WebSocket(TTS_WSS, {
            headers: {
                'Authorization': buildAuthHeader(),
                'X-Api-App-Key': APPID,
                'X-Api-Resource-Id': 'volcano.tts.bigmodel',
                'X-Api-Request-Id': requestId,
            }
        });

        // Track abort
        const abortHandler = () => {
            ws.close();
            reject(new Error('TTS aborted'));
        };
        signal?.addEventListener('abort', abortHandler);

        ws.on('open', () => {
            const payload = {
                app: { appid: APPID, token: API_KEY, cluster: 'volcano_tts' },
                user: { uid: 'uploadsoul-user' },
                audio: {
                    voice_type: internalVoice,
                    encoding: 'mp3',
                    sample_rate: 24000,
                    speed_ratio: speedRatio,
                    volume_ratio: 1.0,
                    pitch_ratio: 1.0,
                },
                request: {
                    reqid: requestId,
                    text: text,
                    text_type: 'plain',
                    operation: 'submit',
                    with_frontend: 1,
                    frontend_type: 'unitTson',
                },
            };
            ws.send(JSON.stringify(payload));
        });

        ws.on('message', (data) => {
            try {
                // BigModel TTS returns binary with header
                // Parse per Volcengine binary protocol
                if (typeof data === 'string') {
                    const msg = JSON.parse(data);
                    if (msg.error_code && msg.error_code !== 0) {
                        const err = new Error(`TTS error ${msg.error_code}: ${msg.error_msg || 'unknown'}`);
                        onError?.(err);
                        reject(err);
                        ws.close();
                    }
                    return;
                }

                // Binary audio chunk
                const buffer = Buffer.from(data);
                // Volcengine BigModel: first 4 bytes are header length
                const headerSize = buffer.readUInt32BE(0);
                const audioData = buffer.slice(4 + headerSize);

                if (audioData.length > 0) {
                    audioChunks.push(audioData);
                    onChunk?.(audioData);
                }

                // Check finish flag in header JSON
                try {
                    const headerJson = JSON.parse(buffer.slice(4, 4 + headerSize).toString());
                    if (headerJson.is_last_package === 1) {
                        const fullAudio = Buffer.concat(audioChunks);
                        signal?.removeEventListener('abort', abortHandler);
                        onDone?.();
                        ws.close();
                        resolve(fullAudio);
                    }
                } catch { /* header not JSON */ }

            } catch (err) {
                console.error('[VolcTTS] Message parse error:', err.message);
            }
        });

        ws.on('error', (err) => {
            console.error('[VolcTTS] WebSocket error:', err.message);
            signal?.removeEventListener('abort', abortHandler);
            onError?.(err);
            reject(err);
        });

        ws.on('close', (code, reason) => {
            signal?.removeEventListener('abort', abortHandler);
            if (audioChunks.length > 0) {
                const fullAudio = Buffer.concat(audioChunks);
                resolve(fullAudio);
            }
            // If no chunks received and not already resolved, reject
        });

        // Safety timeout: 30s
        setTimeout(() => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
                reject(new Error('TTS timeout after 30s'));
            }
        }, 30000);
    });
}

/**
 * 简单 TTS — 返回完整 Buffer（非流式，用于短文本一次性合成）
 */
export async function synthesize(text, avatarType = 'companion', voiceId) {
    const allChunks = [];
    await streamTTS(
        text, avatarType, voiceId,
        (chunk) => allChunks.push(chunk),
        null, null, null
    );
    return Buffer.concat(allChunks);
}

export { resolveVoiceConfig };
