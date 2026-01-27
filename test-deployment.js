import { AzureOpenAI } from "openai";
import dotenv from 'dotenv';
dotenv.config();

async function testDeployment() {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const azureApiKey = process.env.AZURE_OPENAI_KEY;
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
    const apiVersion = process.env.AZURE_OPENAI_API_VERSION;

    console.log('=== Azure OpenAI 配置测试 ===');
    console.log(`Endpoint: ${endpoint}`);
    console.log(`Deployment: ${deploymentName}`);
    console.log(`API Version: ${apiVersion}`);
    console.log(`Key (前5位): ${azureApiKey ? azureApiKey.substring(0, 5) + '...' : 'MISSING'}`);
    console.log('');

    try {
        console.log('正在测试连接...');
        const client = new AzureOpenAI({
            endpoint,
            apiKey: azureApiKey,
            apiVersion,
            deployment: deploymentName,
        });

        const response = await client.chat.completions.create({
            messages: [
                { role: "user", content: "Say hello in 3 words." }
            ],
            max_tokens: 10
        });

        console.log('✅ 成功！AI 回复:', response.choices[0].message.content);
    } catch (err) {
        console.error('\n❌ 测试失败:');
        console.error('错误类型:', err.constructor.name);
        console.error('错误消息:', err.message);
        if (err.status) {
            console.error('HTTP 状态码:', err.status);
        }
        if (err.code) {
            console.error('错误代码:', err.code);
        }
        console.error('\n完整错误对象:', JSON.stringify(err, null, 2));
    }
}

testDeployment();
