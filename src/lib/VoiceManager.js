/**
 * VoiceManager.js
 * 全局语音控制器 — 播放管理 + 打断逻辑 + AbortController
 *
 * 使用方法：
 *   import { voiceManager } from '../lib/VoiceManager';
 *   voiceManager.stopAll();   // 打断所有正在播放的音频
 *   voiceManager.abort();     // 取消正在进行的 API 请求
 */

class VoiceManager {
    constructor() {
        this._audioCtx = null;
        this._activeNodes = [];        // 正在播放的 AudioBufferSourceNode
        this._audioQueue = [];        // 待播放 base64 chunks 队列
        this._isPlaying = false;
        this._abortController = null;
        this._onStateChange = null;      // (state: 'playing'|'listening'|'idle') => void
    }

    // ── Abort / Cancel ──────────────────────────────────

    /** 取消当前所有进行中的 fetch 请求 */
    abort() {
        if (this._abortController) {
            this._abortController.abort();
        }
        this._abortController = new AbortController();
        return this._abortController.signal;
    }

    /** 获取当前 AbortSignal（每次新对话前先调用 abort() 拿到新的） */
    get signal() {
        if (!this._abortController) this._abortController = new AbortController();
        return this._abortController.signal;
    }

    // ── Audio Context ────────────────────────────────────

    _getCtx() {
        if (!this._audioCtx || this._audioCtx.state === 'closed') {
            this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this._audioCtx.state === 'suspended') {
            this._audioCtx.resume();
        }
        return this._audioCtx;
    }

    // ── Stop / Interrupt ────────────────────────────────

    /** 立即停止所有正在播放的音频，清空队列 */
    stopAll() {
        this._isPlaying = false;
        this._audioQueue = [];

        // Stop all active source nodes
        this._activeNodes.forEach(node => {
            try { node.stop(); } catch { /* already stopped */ }
        });
        this._activeNodes = [];

        // Also stop any plain Audio elements that might be in use
        document.querySelectorAll('audio[data-voicemanager]').forEach(el => {
            el.pause();
            el.currentTime = 0;
        });

        this._setState('listening');
        console.log('[VoiceManager] All audio stopped → listening');
    }

    /** 完整打断：停止音频 + 取消 API 请求 */
    interrupt() {
        this.stopAll();
        this.abort();
        console.log('[VoiceManager] Interrupted');
    }

    // ── State ────────────────────────────────────────────

    _setState(state) {
        this._onStateChange?.(state);
    }

    /** 注册状态变化回调 (playing | listening | idle) */
    onStateChange(fn) {
        this._onStateChange = fn;
    }

    // ── Audio Queue Player ───────────────────────────────

    /**
     * 将 base64 编码的 mp3 chunk 加入播放队列
     * 队列空时立即开始播放，否则排队顺序播放
     *
     * @param {string} base64    - base64 编码的 mp3 数据
     */
    async enqueueChunk(base64) {
        this._audioQueue.push(base64);
        if (!this._isPlaying) {
            this._playNext();
        }
    }

    async _playNext() {
        if (this._audioQueue.length === 0) {
            this._isPlaying = false;
            this._setState('idle');
            return;
        }

        this._isPlaying = true;
        this._setState('playing');
        const base64 = this._audioQueue.shift();

        try {
            const ctx = this._getCtx();
            // Decode base64 → ArrayBuffer → AudioBuffer
            const binary = atob(base64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            const audioBuffer = await ctx.decodeAudioData(bytes.buffer);

            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            this._activeNodes.push(source);

            source.onended = () => {
                this._activeNodes = this._activeNodes.filter(n => n !== source);
                this._playNext();
            };

            source.start(0);
        } catch (err) {
            console.warn('[VoiceManager] Chunk decode error:', err.message);
            this._playNext(); // Skip bad chunk
        }
    }

    // ── SSE Consumer ─────────────────────────────────────

    /**
     * 消费 Volcengine SSE 聊天流
     *
     * @param {string} url           - API endpoint URL
     * @param {Object} body          - Request body (JSON or FormData)
     * @param {Object} callbacks
     * @param {Function} callbacks.onUserText     - 用户语音识别结果
     * @param {Function} callbacks.onToken        - LLM token
     * @param {Function} callbacks.onSentenceText - 句子文本
     * @param {Function} callbacks.onDone         - 完成，fullText
     * @param {Function} callbacks.onError        - 错误
     * @param {boolean}  [isFormData=false]       - body 是否为 FormData
     */
    async streamChat(url, body, {
        onUserText,
        onToken,
        onSentenceText,
        onDone,
        onError,
    }, isFormData = false) {
        // 每次新请求前先取消旧请求、停止旧音频
        this.interrupt();
        const signal = this.signal;

        try {
            const isForm = body instanceof FormData || isFormData;
            const headers = isForm ? {} : { 'Content-Type': 'application/json' };

            const resp = await fetch(url, {
                method: 'POST',
                headers,
                body: isForm ? body : JSON.stringify(body),
                signal,
            });

            if (!resp.ok) {
                const errText = await resp.text();
                throw new Error(`API error ${resp.status}: ${errText}`);
            }

            const reader = resp.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                if (signal.aborted) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop();

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    try {
                        const msg = JSON.parse(line.slice(6));
                        switch (msg.type) {
                            case 'userText':
                                onUserText?.(msg.text);
                                break;
                            case 'token':
                                onToken?.(msg.text);
                                break;
                            case 'sentence_start':
                                onSentenceText?.(msg.text);
                                break;
                            case 'audio_chunk':
                                // Queue audio chunk for playback
                                this.enqueueChunk(msg.data);
                                break;
                            case 'done':
                                onDone?.(msg.fullText);
                                break;
                            case 'error':
                                onError?.(new Error(msg.message));
                                break;
                        }
                    } catch { /* skip malformed SSE line */ }
                }
            }
        } catch (err) {
            if (err.name === 'AbortError') {
                console.log('[VoiceManager] Request cancelled');
            } else {
                console.error('[VoiceManager] Stream error:', err.message);
                onError?.(err);
            }
        }
    }
}

// ── Singleton export ─────────────────────────────────────
export const voiceManager = new VoiceManager();
export default voiceManager;
