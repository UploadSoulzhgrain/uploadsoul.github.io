import dotenv from 'dotenv';
dotenv.config();
import { supabaseService } from './api/lib/supabase-server.js';

async function testSupabase() {
    console.log('Testing Supabase Upload...');
    try {
        const mockBuffer = Buffer.from('test audio content');
        const url = await supabaseService.uploadAudio(mockBuffer, 'test.txt');
        console.log('UPLOAD SUCCESS:', url);
    } catch (e) {
        console.error('UPLOAD FAILED:', e.message);
    }
}

testSupabase();
