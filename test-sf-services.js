import dotenv from 'dotenv';
dotenv.config();
import { siliconFlowService } from './api/lib/siliconflow.js';

async function testServices() {
    console.log('Testing LLM...');
    try {
        const reply = await siliconFlowService.chat([{ role: 'user', content: 'Hi' }]);
        console.log('LLM SUCCESS:', reply);
    } catch (e) {
        console.error('LLM FAILED:', e.message);
    }

    console.log('\nTesting TTS...');
    try {
        const buffer = await siliconFlowService.synthesize('Hello');
        console.log('TTS SUCCESS, size:', buffer.length);
    } catch (e) {
        console.error('TTS FAILED:', e.message);
    }
}

testServices();
