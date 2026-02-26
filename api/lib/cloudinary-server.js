import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Cloudinary Backend Service
 * 
 * Instructions follow:
 * 1. Uses cloudinary npm package v2.
 * 2. Utilizes CLOUDINARY_URL for automatic configuration.
 * 3. Dedicated function for avatar upload to 'avatars' folder.
 * 4. Automatic optimization (format/quality) enabled.
 */
export const cloudinaryService = {
    /**
     * Uploads an avatar image to Cloudinary avatars folder.
     * @param {string|Buffer} fileSource - Path to a local file, base64 data, or a Buffer.
     * @param {string} customId - Optional custom public ID for the avatar.
     * @returns {Promise<string>} The optimized secure (HTTPS) URL.
     */
    async uploadAvatar(fileSource, customId = null) {
        try {
            const options = {
                folder: 'avatars',
                resource_type: 'image',
                overwrite: true,
                // Apply face-detection based cropping and auto formats
                transformation: [
                    { width: 500, height: 500, crop: 'fill', gravity: 'face' },
                    { fetch_format: 'auto', quality: 'auto' }
                ]
            };

            if (customId) {
                options.public_id = customId;
            }

            // v2 SDK automatically picks up process.env.CLOUDINARY_URL if it's set
            const result = await cloudinary.uploader.upload(fileSource, options);

            // Return the secure_url (https link)
            return result.secure_url;
        } catch (error) {
            console.error('Cloudinary Avatar Upload Error:', error);
            throw new Error(`Failed to upload avatar: ${error.message}`);
        }
    },

    /**
     * For testing purposes, verifies connectivity.
     */
    async checkConfig() {
        return !!process.env.CLOUDINARY_URL;
    }
};

export default cloudinaryService;
