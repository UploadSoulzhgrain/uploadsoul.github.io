import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, preferred_language } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }
    const langHint = preferred_language === 'cantonese'
        ? '请用粤语回复。'
        : preferred_language === 'english'
            ? 'Please reply in English.'
            : '请用普通话回复。';

    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const azureApiKey = process.env.AZURE_OPENAI_KEY;
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || 'gpt-4';

    if (!endpoint || !azureApiKey) {
        console.error('Azure OpenAI credentials missing');
        return res.status(500).json({ error: 'Azure OpenAI credentials are not configured' });
    }

    try {
        const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
        const messages = [
            { role: "system", content: `你是一个名为 UploadSoul 传灵的数字人助理。你亲切、专业，旨在为用户提供情感陪伴和数字永生咨询。请保持回答简短，因为这些回答将被数字人说出来。${langHint}` },
            { role: "user", content: message }
        ];

        const result = await client.getChatCompletions(deploymentName, messages);
        const reply = result.choices[0].message.content;

        res.status(200).json({ reply });
    } catch (error) {
        console.error('Error with Azure OpenAI:', error);
        res.status(500).json({ error: 'Failed to get chat completion' });
    }
}
