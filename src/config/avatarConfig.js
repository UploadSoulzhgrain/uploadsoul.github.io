/**
 * AVATAR_CONFIG
 * Central configuration for digital humans (avatars).
 * Maps gender/character to UI themes and TTS voice IDs.
 */
export const AVATAR_CONFIG = {
    female: {
        gender: 'female',
        themeColor: 'text-primary',
        themeBg: 'bg-primary',
        themeBorder: 'border-primary',
        themeGlow: 'glow-primary',
        // SiliconFlow Voice IDs
        voiceId: 'FunAudioLLM/CosyVoice2-0.5B:anna', // Representative female voice
    },
    male: {
        gender: 'male',
        themeColor: 'text-accent-blue',
        themeBg: 'bg-accent-blue',
        themeBorder: 'border-accent-blue',
        themeGlow: 'glow-blue',
        // SiliconFlow Voice IDs
        voiceId: 'FunAudioLLM/CosyVoice2-0.5B:alex', // Representative male voice
    }
};

/**
 * Helper to get config by gender or fallback to female
 */
export const getAvatarConfig = (gender) => {
    return AVATAR_CONFIG[gender] || AVATAR_CONFIG.female;
};

export default AVATAR_CONFIG;
