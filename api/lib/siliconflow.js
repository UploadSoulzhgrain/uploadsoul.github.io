import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const SILICON_FLOW_API_KEY = process.env.SILICON_FLOW_API_KEY;
const BASE_URL = 'https://api.siliconflow.cn/v1';

if (!SILICON_FLOW_API_KEY) {
    console.error('SILICON_FLOW_API_KEY is missing');
}

export const siliconFlowService = {
    /**
     * ASR: Transcribe audio using Whisper or SenseVoice
     * @param {Blob|Buffer} audioData 
     * @returns {Promise<string>}
     */
    async transcribe(audioData) {
        const formData = new FormData();
        // SiliconFlow ASR expects 'file' parameter
        formData.append('file', audioData, 'input.wav');
        formData.append('model', 'openai/whisper-large-v3'); // Defaulting to whisper

        try {
            const response = await axios.post(`${BASE_URL}/audio/transcriptions`, formData, {
                headers: {
                    'Authorization': `Bearer ${SILICON_FLOW_API_KEY}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data.text;
        } catch (error) {
            console.error('ASR Error:', error.response?.data || error.message);
            throw new Error('Transcription failed');
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
     * TTS: Generate audio from text
     * @param {string} text 
     * @param {string} voiceModel 
     * @returns {Promise<Buffer>}
     */
    async synthesize(text, voiceModel = 'FunAudioLLM/CosyVoice2-0.5B') {
        try {
            const response = await axios.post(`${BASE_URL}/audio/speech`, {
                model: voiceModel,
                input: text,
                voice: 'FunAudioLLM/CosyVoice2-0.5B:alex',
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
