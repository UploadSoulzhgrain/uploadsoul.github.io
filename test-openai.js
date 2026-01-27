import { AzureOpenAI } from "openai";
import dotenv from 'dotenv';
dotenv.config();

async function testOpenAI() {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const azureApiKey = process.env.AZURE_OPENAI_KEY;
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

    console.log(`Testing Azure OpenAI at: ${endpoint}`);
    console.log(`Deployment: ${deploymentName}`);
    console.log(`API Version: ${apiVersion}`);

    try {
        const client = new AzureOpenAI({
            endpoint,
            apiKey: azureApiKey,
            apiVersion,
            deployment: deploymentName,
        });

        const response = await client.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "Say hello." }
            ],
            max_tokens: 10
        });

        console.log('✅ Success! Reply:', response.choices[0].message.content);
    } catch (err) {
        console.error('❌ Error testing Azure OpenAI:');
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', err.response.data);
        } else {
            console.error(err.message);
        }
    }
}

testOpenAI();
