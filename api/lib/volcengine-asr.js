/**
 * volcengine-asr.js
 * 火山引擎实时语音识别 (ASR) + VAD 静音检测
 *
 * 官方文档: https://www.volcengine.com/docs/6561/80818
 * ⚠️  仅供非 MVP 板块使用
 */

import WebSocket from 'ws';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const APPID = process.env.VOLC_SPEECH_APPID || '1750280251';
const API_KEY = process.env.VOLC_SPEECH_APIKEY || 'e507562e-9d2b-4d70-be67-f312793b4fad';
const ASR_WSS = 'wss://openspeech.bytedance.com/api/v3/sauc/bigmodel';

/**
 * 一次性批量转写（接收完整音频 Buffer，适合"录制完再识别"场景）
 *
 * @param {Buffer} audioBuffer   - 音频数据（WebM / WAV / PCM）
 * @param {string} mimeType      - 'audio/webm' | 'audio/wav' | 'audio/pcm'
 * @returns {Promise<string>}    - 识别文本
 */
export async function transcribeBuffer(audioBuffer, mimeType = 'audio/webm') {
    return new Promise((resolve, reject) => {
        const requestId = crypto.randomUUID();
        let finalText = '';
        let resolved = false;

        console.log(`[VolcASR] Transcribing buffer, size: ${audioBuffer.length} bytes, type: ${mimeType}`);

        const ws = new WebSocket(ASR_WSS, {
            headers: {
                'Authorization': `Bearer;${API_KEY}`,
                'X-Api-App-Key': APPID,
                'X-Api-Resource-Id': 'volc.bigasr.sauc.duration',
                'X-Api-Request-Id': requestId,
            }
        });

        const CHUNK_SIZE = 8192; // 8KB per send

        ws.on('open', () => {
            // Send config packet first
            const config = {
                user: { uid: 'uploadsoul-user' },
                audio: {
                    format: mimeType.includes('wav') ? 'wav' : 'webm',
                    sample_rate: 16000,
                    channel: 1,
                    bits: 16,
                },
                request: {
                    reqid: requestId,
                    appid: APPID,
                    timestamp: Math.floor(Date.now() / 1000),
                    nbest: 1,
                    vad: { silence_duration: 500 },   // VAD: 500ms silence = end
                    workflow: 'audio_in,resample,partition,vad,fe,decode,itn,nlu_punctuation',
                },
            };
            ws.send(JSON.stringify(config));

            // Stream the audio in chunks
            let offset = 0;
            const sendChunk = () => {
                if (offset >= audioBuffer.length) {
                    // Send EOS
                    ws.send(Buffer.alloc(0));
                    return;
                }
                const chunk = audioBuffer.slice(offset, Math.min(offset + CHUNK_SIZE, audioBuffer.length));
                offset += CHUNK_SIZE;
                ws.send(chunk);
                // Small delay to simulate real-time streaming
                setTimeout(sendChunk, 50);
            };
            sendChunk();
        });

        ws.on('message', (data) => {
            try {
                const msg = typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString());

                if (msg.error_code && msg.error_code !== 0) {
                    reject(new Error(`ASR error ${msg.error_code}: ${msg.error_msg || 'unknown'}`));
                    ws.close();
                    return;
                }

                // Partial or final result
                const result = msg.result || msg.asr_result || msg.results?.[0];
                if (result) {
                    const text = result.text || result.utterances?.[0]?.text || '';
                    if (text) finalText = text; // Keep latest (final replaces partial)
                }

                // End of stream
                if (msg.is_last_package === true || msg.sequence === -1) {
                    if (!resolved) {
                        resolved = true;
                        ws.close();
                        if (!finalText.trim()) {
                            reject(new Error('ASR_EMPTY_RESULT'));
                        } else {
                            console.log(`[VolcASR] Final text: "${finalText}"`);
                            resolve(finalText.trim());
                        }
                    }
                }
            } catch (err) {
                console.error('[VolcASR] Parse error:', err.message);
            }
        });

        ws.on('error', (err) => {
            console.error('[VolcASR] WebSocket error:', err.message);
            if (!resolved) reject(err);
        });

        ws.on('close', () => {
            if (!resolved) {
                if (finalText.trim()) {
                    resolved = true;
                    resolve(finalText.trim());
                } else {
                    reject(new Error('ASR_EMPTY_RESULT'));
                }
            }
        });

        // Timeout safety
        setTimeout(() => {
            if (!resolved) {
                resolved = true;
                ws.close();
                if (finalText.trim()) {
                    resolve(finalText.trim());
                } else {
                    reject(new Error('ASR timeout'));
                }
            }
        }, 20000);
    });
}

/**
 * 实时 ASR（前端持续推送音频 Buffer 时使用）
 * 返回一个控制对象，调用者可以持续推送音频数据
 *
 * @param {Object} callbacks
 * @param {Function} callbacks.onPartial   - 中间识别结果: (text: string) => void
 * @param {Function} callbacks.onFinal     - 最终识别结果: (text: string) => void
 * @param {Function} callbacks.onVAD       - 检测到用户说话开始: () => void
 * @param {Function} callbacks.onSilence   - 检测到静音（可用于打断): () => void
 * @param {Function} callbacks.onError     - 错误: (err: Error) => void
 *
 * @returns {{ send: (buffer: Buffer) => void, close: () => void }}
 */
export function createRealtimeASR({ onPartial, onFinal, onVAD, onSilence, onError }) {
    const requestId = crypto.randomUUID();
    let isSpeaking = false;

    const ws = new WebSocket(ASR_WSS, {
        headers: {
            'Authorization': `Bearer;${API_KEY}`,
            'X-Api-App-Key': APPID,
            'X-Api-Resource-Id': 'volc.bigasr.sauc.duration',
            'X-Api-Request-Id': requestId,
        }
    });

    ws.on('open', () => {
        const config = {
            user: { uid: 'uploadsoul-user' },
            audio: {
                format: 'pcm',
                sample_rate: 16000,
                channel: 1,
                bits: 16,
            },
            request: {
                reqid: requestId,
                appid: APPID,
                timestamp: Math.floor(Date.now() / 1000),
                nbest: 1,
                vad: { silence_duration: 500, max_speech_duration: 60000 },
                workflow: 'audio_in,resample,partition,vad,fe,decode,itn,nlu_punctuation',
            },
        };
        ws.send(JSON.stringify(config));
        console.log('[VolcASR] Realtime session started:', requestId);
    });

    ws.on('message', (data) => {
        try {
            const msg = typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString());

            // VAD events
            if (msg.vad && msg.vad.speech_start) {
                if (!isSpeaking) {
                    isSpeaking = true;
                    console.log('[VolcASR] VAD: speech started');
                    onVAD?.();
                }
            }
            if (msg.vad && msg.vad.speech_end) {
                isSpeaking = false;
                console.log('[VolcASR] VAD: speech ended (silence)');
                onSilence?.();
            }

            // Text results
            const result = msg.result || msg.asr_result || msg.results?.[0];
            if (result) {
                const text = result.text || result.utterances?.[0]?.text || '';
                if (text) {
                    const isFinal = result.definite !== false && (msg.sequence < 0 || result.is_final);
                    if (isFinal) {
                        onFinal?.(text.trim());
                    } else {
                        onPartial?.(text.trim());
                    }
                }
            }

            if (msg.error_code && msg.error_code !== 0) {
                onError?.(new Error(`ASR error ${msg.error_code}: ${msg.error_msg}`));
            }
        } catch (err) {
            console.error('[VolcASR] Realtime parse error:', err.message);
        }
    });

    ws.on('error', (err) => {
        console.error('[VolcASR] Realtime error:', err.message);
        onError?.(err);
    });

    return {
        /** Push PCM audio chunk */
        send(buffer) {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(buffer);
            }
        },
        /** Close session */
        close() {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(Buffer.alloc(0)); // EOS
                ws.close();
            }
        },
    };
}
