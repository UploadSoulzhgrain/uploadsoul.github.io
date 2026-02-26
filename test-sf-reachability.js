import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.SILICON_FLOW_API_KEY;

async function test() {
    console.log('Testing SiliconFlow with timeout...');
    try {
        const res = await axios.get('https://api.siliconflow.cn/v1/user/info', {
            headers: { 'Authorization': `Bearer ${API_KEY}` },
            timeout: 5000
        });
        console.log('Success:', res.data);
    } catch (e) {
        console.error('Failed:', e.response?.data || e.message);
    }
}

test();
