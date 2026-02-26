import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

async function testVoiceChat() {
    console.log('--- Testing Voice Chat Endpoint ---');

    // Create a mock audio file (small webm/wav)
    const filePath = './test_audio.webm';
    fs.writeFileSync(filePath, Buffer.alloc(1000)); // 1KB of zero bytes

    const form = new FormData();
    form.append('audio', fs.createReadStream(filePath));
    form.append('characterId', '汐月');
    form.append('userId', 'test-user');
    form.append('voice', 'FunAudioLLM/CosyVoice2-0.5B:anna');

    try {
        const response = await axios.post('http://localhost:3000/api/virtual-lover/chat', form, {
            headers: form.getHeaders()
        });
        console.log('SUCCESS:', response.data);
    } catch (error) {
        console.error('FAILED:', error.response?.data || error.message);
    } finally {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
}

testVoiceChat();
