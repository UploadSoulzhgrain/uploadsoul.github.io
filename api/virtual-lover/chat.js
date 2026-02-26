import formidable from 'formidable';
import fs from 'fs';
import { siliconFlowService } from '../lib/siliconflow.js';
import { supabaseService } from '../lib/supabase-server.js';

// Disable default body parser for multipart/form-data
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

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
