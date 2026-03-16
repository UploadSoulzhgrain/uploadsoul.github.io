/**
 * volcengine-asr.js
 * 火山引擎实时语音识别 (ASR) + VAD 静音检测
 *
 * 官方文档: https://www.volcengine.com/docs/6561/80818
 * ⚠️  仅供非 MVP 板块使用
 */

import WebSocket from 'ws';
import crypto from 'crypto';


const APPID = process.env.VOLC_SPEECH_APPID;
const ACCESS_TOKEN = process.env.VOLC_SPEECH_ACCESS_TOKEN;
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
                'X-Api-App-Key': APPID,
                'X-Api-Access-Key': ACCESS_TOKEN,
                'X-Api-Resource-Id': 'volc.bigasr.sauc.duration',
                'X-Api-Request-Id': requestId,
            }
        });

        // 构建二进制帧
        function buildFrame(payload, msgTypeByte) {
            const isAudio = msgTypeByte === 0x20 || msgTypeByte === 0x22;
            const payloadBuf = Buffer.isBuffer(payload)
                ? payload
                : Buffer.from(typeof payload === 'string' ? payload : JSON.stringify(payload), 'utf8');

            // config包: [0x11, 0x11, 0x10, 0x00] (version=1, header_size=1, type=1, flags=0, serial=JSON=1, compress=0, reserved=0)
            // 音频包: [0x11, 0x20, 0x00, 0x00] (type=2, flags=0, serial=none=0, compress=0)
            // 最后一包: [0x11, 0x22, 0x00, 0x00] (type=2, flags=last=2, serial=none=0, compress=0)
            const serializeByte = isAudio ? 0x00 : 0x10;
            const header = Buffer.from([0x11, msgTypeByte, serializeByte, 0x00]);
            const sizeBuf = Buffer.alloc(4);
            sizeBuf.writeUInt32BE(payloadBuf.length, 0);
            return Buffer.concat([header, sizeBuf, payloadBuf]);
        }

        // 解析服务端返回的二进制帧
        function parseServerFrame(buf) {
            // 服务端帧：4字节header + 4字节sequence + 4字节payload_size + payload
            if (buf.length < 12) return null;
            const msgType = (buf[1] >> 4) & 0x0F;
            const isError = msgType === 0x0F;

            if (isError) {
                // 错误帧：4字节header + 4字节error_code + 4字节error_size + error_msg
                const errorCode = buf.readUInt32BE(4);
                const errorSize = buf.readUInt32BE(8);
                const errorMsg = buf.slice(12, 12 + errorSize).toString('utf8');
                return { error: true, code: errorCode, message: errorMsg };
            }

            // 正常帧：4字节header + 4字节sequence + 4字节payload_size + payload
            const payloadSize = buf.readUInt32BE(8);
            const payload = buf.slice(12, 12 + payloadSize);
            try {
                return JSON.parse(payload.toString('utf8'));
            } catch {
                return null;
            }
        }

        ws.on('open', () => {
            const audioFormat = mimeType.includes('wav') ? 'wav'
                : mimeType.includes('mp4') ? 'mp3' : 'ogg';

            // 火山引擎支持：pcm/wav/ogg/mp3，不支持 webm。Chrome 的 webm/opus 用 ogg/opus 兼容。
            const codec = audioFormat === 'ogg' ? 'opus' : 'raw';

            console.log(`[VolcASR] Conn opened. format: ${audioFormat}, codec: ${codec}`);

            const config = {
                user: { uid: 'uploadsoul-user' },
                audio: {
                    format: audioFormat,
                    codec: codec,
                    rate: 16000,
                    bits: 16,
                    channel: 1,
                },
                request: {
                    model_name: 'bigmodel',
                    enable_punc: true,
                    enable_itn: true,
                },
            };

            // full client request: msgTypeByte = 0x11
            ws.send(buildFrame(config, 0x11));

            // 分块发送音频 audio only request: msgTypeByte = 0x20
            const CHUNK_SIZE = 8192;
            let offset = 0;

            const sendChunk = () => {
                if (offset >= audioBuffer.length) {
                    // 最后一包：msgTypeByte = 0x22
                    ws.send(buildFrame(Buffer.alloc(0), 0x22));
                    return;
                }
                const chunk = audioBuffer.slice(offset, Math.min(offset + CHUNK_SIZE, audioBuffer.length));
                offset += CHUNK_SIZE;
                ws.send(buildFrame(chunk, 0x20));
                setTimeout(sendChunk, 50);
            };
            sendChunk();
        });

        ws.on('message', (data) => {
            try {
                const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
                const msg = parseServerFrame(buf);

                if (!msg) {
                    console.log('[VolcASR] Cannot parse, hex:', buf.toString('hex').slice(0, 80));
                    return;
                }

                console.log('[VolcASR] Message:', JSON.stringify(msg).slice(0, 300));

                if (msg.error) {
                    reject(new Error(`ASR error ${msg.code}: ${msg.message}`));
                    ws.close();
                    return;
                }

                const result = msg.result;
                if (result && result.text) {
                    finalText = result.text;
                }

                // 检查是否是最后一包（flags bit）
                const flags = buf[1] & 0x0F;
                if (flags === 0x03 || flags === 0x02) {
                    if (!resolved) {
                        resolved = true;
                        ws.close();
                        if (!finalText.trim()) {
                            reject(new Error('ASR_EMPTY_RESULT'));
                        } else {
                            console.log(`[VolcASR] Final: "${finalText}"`);
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

        setTimeout(() => {
            if (!resolved) {
                resolved = true;
                ws.close();
                finalText.trim() ? resolve(finalText.trim()) : reject(new Error('ASR timeout'));
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
            'X-Api-App-Key': APPID,
            'X-Api-Access-Key': ACCESS_TOKEN,
            'X-Api-Resource-Id': 'volc.bigasr.sauc.duration',
            'X-Api-Request-Id': requestId,
        }
    });

    console.log('[VolcASR] Connecting with APPID:', APPID, 'TOKEN_PREFIX:', ACCESS_TOKEN?.slice(0, 10));
    console.log('[VolcASR] WSS:', ASR_WSS, 'Resource:', 'volc.bigasr.sauc.duration');
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
            let msg;
            const buf = Buffer.isBuffer(data) ? data : Buffer.from(data);
            console.log('[VolcASR] Raw message type:', typeof data, 'isBuffer:', Buffer.isBuffer(data), 'length:', buf.length, 'first16bytes:', buf.slice(0, 16).toString('hex'));

            // 尝试直接 JSON 解析
            try {
                msg = JSON.parse(buf.toString('utf8'));
                console.log('[VolcASR] JSON parsed:', JSON.stringify(msg).slice(0, 200));
            } catch {
                // 不是 JSON，打印 hex 看结构
                console.log('[VolcASR] Not JSON, hex dump:', buf.toString('hex').slice(0, 100));
                return; // 退出当前处理，等待分析结构
            }

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
