import dotenv from 'dotenv';
dotenv.config();
import { siliconFlowService } from './api/lib/siliconflow.js';
import { supabaseService } from './api/lib/supabase-server.js';

async function testServices() {
    console.log('Testing SiliconFlow Chat...');
    try {
        const reply = await siliconFlowService.chat([{ role: 'user', content: 'Hello' }]);
        console.log('LLM Reply:', reply);
    } catch (e) {
        console.error('LLM Failed:', e.message);
    }

    console.log('\nTesting SiliconFlow TTS...');
    try {
        const buffer = await siliconFlowService.synthesize('你好');
        console.log('TTS Buffer size:', buffer.length);
    } catch (e) {
        console.error('TTS Failed:', e.message);
    }
}

testServices();
