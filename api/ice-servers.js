import axios from 'axios';

export default async function handler(req, res) {
    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION;

    if (!speechKey || !speechRegion) {
        console.error('Azure Speech credentials missing in environment');
        return res.status(500).json({ error: 'Azure Speech credentials are not configured' });
    }

    try {
        const relayEndpoint = `https://${speechRegion}.tts.speech.microsoft.com/cognitiveservices/avatar/relay/token/v1`;
        const response = await axios.get(relayEndpoint, {
            headers: {
                'Ocp-Apim-Subscription-Key': speechKey
            }
        });

        // 统一返回小写格式，方便前端处理
        const data = response.data;
        res.status(200).json({
            urls: data.Urls || data.urls,
            username: data.Username || data.username,
            password: data.Password || data.password || data.credential
        });
    } catch (error) {
        console.error('ICE Servers Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch ICE servers' });
    }
}
