import express from 'express';
import dotenv from 'dotenv';
import { AzureOpenAI } from "openai";
import axios from 'axios';
import formidable from 'formidable';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// HeyGen Token API
app.get('/api/heygen-token', async (req, res) => {
    const HEYGEN_API_KEY = 'sk_V2_hgu_kUJuwlf4dLH_ljzwKlF1jsoS7UPRqkPLPmSj3fX2wG34';

    try {
        const response = await axios.post('https://api.heygen.com/v1/streaming.create_token', null, {
            headers: {
                'x-api-key': HEYGEN_API_KEY
            }
        });
        res.json({ token: response.data.data.token });
    } catch (err) {
        console.error('HeyGen Token Error:', err.response?.data || err.message);
        res.status(500).json({ error: 'Failed to fetch HeyGen token' });
    }
});

// Speech Token API
app.get('/api/speech-token', async (req, res) => {
    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION;

    if (!speechKey || !speechRegion) {
        return res.status(500).json({ error: 'Azure Speech credentials missing' });
    }

    try {
        const fetchTokenEndpoint = `https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`;
        const response = await axios.post(fetchTokenEndpoint, null, {
            headers: {
                'Ocp-Apim-Subscription-Key': speechKey,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        res.json({ token: response.data, region: speechRegion });
    } catch (err) {
        console.error('Speech Token Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch speech token: ' + err.message });
    }
});

// ICE Servers API (For WebRTC Relay)
app.get('/api/ice-servers', async (req, res) => {
    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION;

    if (!speechKey || !speechRegion) {
        return res.status(500).json({ error: 'Azure Speech credentials missing' });
    }

    try {
        const relayEndpoint = `https://${speechRegion}.tts.speech.microsoft.com/cognitiveservices/avatar/relay/token/v1`;
        const response = await axios.get(relayEndpoint, {
            headers: {
                'Ocp-Apim-Subscription-Key': speechKey
            }
        });

        // Azure returns { Urls: [...], Username: "...", Password: "..." }
        // Normalize to lowercase for consistent frontend handling
        const data = response.data;
        res.json({
            urls: data.Urls || data.urls,
            username: data.Username || data.username,
            credential: data.Password || data.password || data.credential
        });
    } catch (err) {
        console.error('ICE Servers Error:', err.message);
        // Fallback to empty if fails, though WebRTC might fail
        res.status(500).json({ error: 'Failed to fetch ICE servers: ' + err.message });
    }
});

// Chat API (preferred_language: mandarin | english | cantonese，数字人回复语言)
app.post('/api/chat', async (req, res) => {
    const { message, preferred_language } = req.body;
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const azureApiKey = process.env.AZURE_OPENAI_KEY;
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4';
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview';

    if (!endpoint || !azureApiKey) {
        return res.status(500).json({ error: 'Azure OpenAI credentials missing' });
    }

    try {
        const client = new AzureOpenAI({
            endpoint,
            apiKey: azureApiKey,
            apiVersion,
            deployment: deploymentName,
        });

        console.log(`--- Chat Request ---`);
        console.log(`Endpoint: ${endpoint}`);
        console.log(`Deployment: ${deploymentName}`);
        console.log(`API Version: ${apiVersion}`);

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

        res.json({ reply: result.choices[0].message.content });
    } catch (err) {
        console.error('Chat Error Detail:', err);
        const status = err.status || 500;
        const message = err.message || 'Unknown error';
        const body = err.error || {};

        console.error(`Status ${status}: ${message}`);
        res.status(status).json({
            error: `API 响应异常 (${status}): ${message}`,
            detail: body
        });
    }
});

// Virtual Lover API
app.post('/api/virtual-lover/chat', async (req, res) => {
    console.log('>>> Incoming Virtual Lover Chat Request');
    console.log('Content-Type:', req.headers['content-type']);
    try {
        const { siliconFlowService } = await import('./api/lib/siliconflow.js');
        const { supabaseService } = await import('./api/lib/supabase-server.js');

        let fields = {};
        let files = {};
        const contentType = req.headers['content-type'] || '';

        if (contentType.includes('multipart/form-data')) {
            const form = formidable({ multiples: false });
            [fields, files] = await new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    if (err) reject(err);
                    resolve([fields, files]);
                });
            });
        } else {
            fields = req.body;
        }

        const audioFile = files.audio?.[0] || files.audio;
        const message = Array.isArray(fields.message) ? fields.message[0] : (fields.message || '');
        const userId = Array.isArray(fields.userId) ? fields.userId[0] : (fields.userId || 'test-user');
        const characterId = Array.isArray(fields.characterId) ? fields.characterId[0] : (fields.characterId || '汐月');

        let userText = message;

        if (audioFile) {
            console.log('Step 1: ASR processing...', audioFile.filepath);
            const audioBuffer = fs.readFileSync(audioFile.filepath);
            userText = await siliconFlowService.transcribe(audioBuffer);
            console.log('ASR Result:', userText);
        }

        if (!userText && !audioFile) {
            return res.status(400).json({ error: 'Message or audio is required' });
        }

        if (!userText && audioFile) {
            return res.json({ userText: '', aiText: '我没听清，请再说一次？', audioUrl: null });
        }

        // 2. LLM
        console.log('Step 2: LLM processing...');
        const chatMessages = [
            { role: 'system', content: `你是一个名为${characterId}的虚拟恋人。请温柔回复。` },
            { role: 'user', content: userText }
        ];
        const aiText = await siliconFlowService.chat(chatMessages);
        console.log('AI Response:', aiText);

        // 3. TTS
        console.log('Step 3: TTS processing...');
        const aiAudioBuffer = await siliconFlowService.synthesize(aiText);
        console.log('TTS Done.');

        // 4. Supabase
        console.log('Step 4: Supabase upload...');
        const fileName = `${userId}_${Date.now()}.mp3`;
        const audioUrl = await supabaseService.uploadAudio(aiAudioBuffer, fileName);
        console.log('Audio URL:', audioUrl);

        await supabaseService.saveChatRecord({
            userId,
            characterId,
            userText,
            aiText,
            audioUrl
        });

        res.json({ userText, aiText, audioUrl });

    } catch (error) {
        console.error('Virtual Lover Route Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend simulator running at http://localhost:${PORT}`);
    console.log(`Waiting for requests from http://127.0.0.1:5173/api/...`);
});
