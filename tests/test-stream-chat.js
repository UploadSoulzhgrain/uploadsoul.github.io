
import axios from 'axios';

async function testStreaming() {
    console.log('--- Testing Streaming Chat Endpoint ---');
    try {
        const response = await axios.post('http://localhost:3000/api/virtual-lover/chat?stream=true', {
            message: '你好啊，我想听听你的声音。',
            characterId: '汐月',
            userId: 'test-user',
            voice: 'FunAudioLLM/CosyVoice2-0.5B:anna'
        }, {
            responseType: 'stream',
            headers: {
                'Accept': 'text/event-stream'
            }
        });

        response.data.on('data', chunk => {
            console.log('Chunk:', chunk.toString());
        });

        response.data.on('end', () => {
            console.log('Stream finished.');
        });

    } catch (error) {
        if (error.response) {
            console.error('Test Failed (Status):', error.response.status);
            // Read stream error if possible
        } else {
            console.error('Test Failed:', error.message);
        }
    }
}

testStreaming();
