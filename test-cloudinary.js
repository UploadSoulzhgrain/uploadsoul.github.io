import { cloudinaryService } from './api/lib/cloudinary-server.js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Quick test for Cloudinary Avatar Upload.
 * Usage: node test-cloudinary.js
 */
async function test() {
    console.log('--- Cloudinary Avatar Upload Test ---');
    console.log('Environment CLOUDINARY_URL presence:', process.env.CLOUDINARY_URL ? 'PRESENT' : 'MISSING');

    if (!process.env.CLOUDINARY_URL) {
        console.warn('⚠️  Warning: CLOUDINARY_URL is not set. The following test will likely fail.');
    }

    // Attempting to upload a simple placeholder image for testing
    const placeholderUrl = 'https://via.placeholder.com/500/FF0000/FFFFFF?text=Avatar+Test';
    try {
        console.log('Uploading sample image to "avatars" folder...');
        const secureUrl = await cloudinaryService.uploadAvatar(placeholderUrl, 'test_placeholder_avatar');
        console.log('✅ SUCCESS! Secure URL:', secureUrl);
    } catch (e) {
        console.error('❌ FAILED Trace:', e.message);
    }
}

test();
