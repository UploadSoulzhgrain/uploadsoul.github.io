import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

// Helper function to call OpenAI
async function callOpenAI(endpoint, key, deployment, messages) {
    console.log(`Trying Azure OpenAI Region: ${endpoint}...`);
    const client = new OpenAIClient(endpoint, new AzureKeyCredential(key));
    // Create a timeout promise
    const timeoutMs = 8000; // 8 seconds timeout
    const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), timeoutMs)
    );

    const apiPromise = client.getChatCompletions(deployment, messages);

    // Race between API call and timeout
    return Promise.race([apiPromise, timeoutPromise]);
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    // Configuration
    const regions = [
        {
            name: 'Asia (Primary)',
            endpoint: process.env.AZURE_OPENAI_ENDPOINT_ASIA,
            key: process.env.AZURE_OPENAI_KEY_ASIA,
            deployment: process.env.AZURE_OPENAI_DEPLOYMENT_ASIA || 'gpt-4'
        },
        {
            name: 'US (Fallback)',
            endpoint: process.env.AZURE_OPENAI_ENDPOINT_US,
            key: process.env.AZURE_OPENAI_KEY_US,
            deployment: process.env.AZURE_OPENAI_DEPLOYMENT_US || 'gpt-4o'
        }
    ];

    const messages = [
        { role: "system", content: "你是一个名为 UploadSoul 传灵的数字人助理。你亲切、专业，旨在为用户提供情感陪伴和数字永生咨询。请保持回答简短，因为这些回答将被数字人说出来。" },
        { role: "user", content: message }
    ];

    for (const region of regions) {
        if (!region.endpoint || !region.key) continue;

        try {
            const result = await callOpenAI(region.endpoint, region.key, region.deployment, messages);
            const reply = result.choices[0].message.content;

            // Success! Return immediately
            return res.status(200).json({
                reply,
                meta: { region: region.name, model: region.deployment }
            });

        } catch (error) {
            console.warn(`Failed to call region ${region.name}:`, error.message);
            // Continue to next region loop
        }
    }

    // If we get here, all regions failed
    console.error('All Azure OpenAI regions failed.');
    res.status(500).json({ error: 'Service temporarily unavailable (All regions failed)' });
}
