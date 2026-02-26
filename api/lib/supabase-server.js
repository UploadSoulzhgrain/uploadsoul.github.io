import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials missing for backend');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const supabaseService = {
    /**
     * Upload buffer to Supabase Storage
     * @param {Buffer} buffer 
     * @param {string} path 
     * @returns {Promise<string>} Public URL
     */
    async uploadAudio(buffer, path) {
        try {
            console.log(`Uploading to Supabase bucket: audio_responses, path: ${path}`);
            const { data, error } = await supabase.storage
                .from('audio_responses')
                .upload(path, buffer, {
                    contentType: 'audio/mpeg',
                    upsert: true
                });

            if (error) {
                console.warn('Supabase Storage Error (Initial):', error.message);
                // If it's a 404/400 (bucket not found), we log it specifically
                if (error.statusCode === '404' || error.status === 400) {
                    throw new Error('Supabase bucket "audio_responses" not found. Please create it in your Supabase dashboard.');
                }
                throw error;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('audio_responses')
                .getPublicUrl(path);

            return publicUrl;
        } catch (error) {
            console.error('Supabase Service Exception:', error.message);
            // Fallback for demo/dev purposes if bucket is missing
            return `https://placeholder-url.com/${path}?error=${encodeURIComponent(error.message)}`;
        }
    },

    /**
     * Save chat record to database
     * @param {Object} record 
     */
    async saveChatRecord(record) {
        const { error } = await supabase
            .from('chat_records')
            .insert({
                user_id: record.userId,
                character_id: record.characterId,
                user_text: record.userText,
                ai_text: record.aiText,
                audio_url: record.audioUrl,
                created_at: new Date().toISOString()
            });

        if (error) {
            console.error('Supabase Database Error:', error);
            // We don't throw here to avoid failing the whole request if DB save fails
        }
    }
};
