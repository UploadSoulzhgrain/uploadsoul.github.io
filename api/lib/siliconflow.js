import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const SILICON_FLOW_API_KEY = process.env.SILICON_FLOW_API_KEY;
const BASE_URL = 'https://api.siliconflow.cn/v1';

if (!SILICON_FLOW_API_KEY) {
    console.error('SILICON_FLOW_API_KEY is missing');
}

export const siliconFlowService = {
    apiKey: SILICON_FLOW_API_KEY,
    baseUrl: BASE_URL,
    /**
     * ASR: Transcribe audio using Whisper or SenseVoice
     * @param {Blob|Buffer} audioData 
     * @returns {Promise<string>}
     */
    async transcribe(audioBuffer) {
        console.log('SiliconFlow ASR: Transcribing audio buffer, size:', audioBuffer.length);

        // In Node.js environment, we use Buffer directly for FormData
        const formData = new FormData();

        // Note: For newer Node.js global FormData, we can use File or Blob
        // For axios to properly recognize it as a file, we provide a filename
        const file = new File([audioBuffer], 'recording.webm', { type: 'audio/webm' });

        formData.append('model', 'FunAudioLLM/SenseVoiceSmall');
        formData.append('file', file);

        try {
            const response = await axios.post(`${this.baseUrl}/audio/transcriptions`, formData, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                timeout: 15000 // 15 seconds timeout
            });

            console.log('SiliconFlow ASR Raw Response SUCCESS');
            const text = response.data.text || '';

            if (!text.trim()) {
                console.warn('SiliconFlow ASR: Received empty transcription text.');
                throw new Error('ASR_EMPTY_RESULT');
            }

            return text;
        } catch (error) {
            if (error.response) {
                console.error('SiliconFlow ASR Error Response:', JSON.stringify(error.response.data, null, 2));
            } else {
                console.error('SiliconFlow ASR Error:', error.message);
            }
            if (error.message === 'ASR_EMPTY_RESULT') throw error;
            throw new Error('Failed to transcribe audio: ' + (error.response?.data?.message || error.message));
        }
    },

    /**
     * LLM: Chat completion using Qwen2.5-7B-Instruct
     * @param {Array} messages 
     * @returns {Promise<string>}
     */
    async chat(messages) {
        try {
            const response = await axios.post(`${BASE_URL}/chat/completions`, {
                model: 'Qwen/Qwen2-7B-Instruct',
                messages: messages,
                stream: false
            }, {
                headers: {
                    'Authorization': `Bearer ${SILICON_FLOW_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('LLM Error:', error.response?.data || error.message);
            throw new Error('LLM interaction failed');
        }
    },

    /**
     * LLM Stream: Streaming chat completion
     */
    async chatStream(messages) {
        try {
            const response = await fetch(`${BASE_URL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${SILICON_FLOW_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'Qwen/Qwen2-7B-Instruct',
                    messages: messages,
                    stream: true
                })
            });
            return response.body; // Return standard ReadableStream
        } catch (error) {
            console.error('LLM Stream Error:', error.message);
            throw new Error('LLM interaction failed');
        }
    },

    /**
     * TTS: Generate audio from text
     * @param {string} text 
     * @param {string} voiceModel 
     * @returns {Promise<Buffer>}
     */
    async synthesize(text, requestedVoice = 'FunAudioLLM/CosyVoice2-0.5B:alex') {
        // requestedVoice format: "modelId:voiceName"
        const [modelId, voiceName] = requestedVoice.includes(':')
            ? requestedVoice.split(':')
            : ['FunAudioLLM/CosyVoice2-0.5B', 'alex'];

        console.log('SiliconFlow TTS: Synthesizing with model:', modelId, 'voice:', voiceName);

        try {
            const response = await axios.post(`${BASE_URL}/audio/speech`, {
                model: modelId,
                input: text,
                voice: requestedVoice,
                response_format: 'mp3',
                sample_rate: 32000,
                stream: false
            }, {
                headers: {
                    'Authorization': `Bearer ${SILICON_FLOW_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                responseType: 'arraybuffer'
            });
            return Buffer.from(response.data);
        } catch (error) {
            if (error.response?.data) {
                let errorData = error.response.data;
                if (errorData instanceof ArrayBuffer) {
                    errorData = Buffer.from(errorData).toString();
                }
                console.error('TTS Error Response:', errorData);
            } else {
                console.error('TTS Error:', error.message);
            }
            throw new Error('Speech synthesis failed');
        }
    }
};
