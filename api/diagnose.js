export default function handler(req, res) {
    const envCheck = {
        speechKey: !!process.env.AZURE_SPEECH_KEY,
        speechRegion: !!process.env.AZURE_SPEECH_REGION,
        openaiKey: !!process.env.AZURE_OPENAI_KEY,
        env: process.env.NODE_ENV
    };

    res.status(200).json({ status: 'ok', checks: envCheck });
}
