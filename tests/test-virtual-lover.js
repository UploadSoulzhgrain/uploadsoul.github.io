import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

async function testChat() {
    console.log('Testing Virtual Lover Chat Endpoint...');

    try {
        // 1. Test Text Chat
        console.log('\n--- Testing Text Chat ---');
        const textRes = await axios.post('http://localhost:3000/api/virtual-lover/chat', {
            message: '你好，你是谁？',
            characterId: '汐月',
            userId: 'test-user'
        });
        console.log('Text Response:', textRes.data);

        // 2. Test Voice Chat (Requires a sample.wav file)
        /*
        console.log('\n--- Testing Voice Chat ---');
        const form = new FormData();
        form.append('audio', fs.createReadStream('./tests/sample.wav'));
        form.append('characterId', '汐月');
        form.append('userId', 'test-user');

        const voiceRes = await axios.post('http://localhost:3000/api/virtual-lover/chat', form, {
            headers: form.getHeaders()
        });
        console.log('Voice Response:', voiceRes.data);
        */
    } catch (error) {
        console.error('Test failed:', error.response?.data || error.message);
    }
}

testChat();
