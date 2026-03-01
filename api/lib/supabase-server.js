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
     * @param {string} bucket
     * @param {string} contentType
     * @returns {Promise<string>} Public URL
     */
    async uploadMedia(buffer, path, bucket = 'audio_responses', contentType = 'audio/mpeg') {
        try {
            console.log(`Uploading to Supabase bucket: ${bucket}, path: ${path}`);
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(path, buffer, {
                    contentType: contentType,
                    upsert: true
                });

            if (error) {
                console.warn('Supabase Storage Error (Initial):', error.message);
                if (error.statusCode === '404' || error.status === 400) {
                    throw new Error(`Supabase bucket "${bucket}" not found. Please create it in your Supabase dashboard.`);
                }
                throw error;
            }

            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(path);

            return publicUrl;
        } catch (error) {
            console.error('Supabase Service Exception:', error.message);
            return `https://placeholder-url.com/${path}?error=${encodeURIComponent(error.message)}`;
        }
    },

    // Legacy method for backward compatibility
    async uploadAudio(buffer, path) {
        return this.uploadMedia(buffer, path, 'audio_responses', 'audio/mpeg');
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
    },

    /**
     * Store pet reconstruction request
     * @param {Object} data 
     */
    async savePetReconstruction(data) {
        const { error } = await supabase
            .from('pet_reconstructions')
            .insert({
                user_id: data.userId,
                pet_name: data.petName,
                photo_url: data.photoUrl,
                audio_url: data.audioUrl,
                video_url: data.videoUrl,
                mode: data.mode,
                memories: data.memories,
                anniversary_reminder: data.anniversaryReminder,
                status: 'pending',
                created_at: new Date().toISOString()
            });

        if (error) {
            console.error('Supabase savePetReconstruction Error:', error);
            throw error;
        }
    }
};
