import imageCompression from 'browser-image-compression';
import { supabase } from '../lib/supabaseClient';

const STORAGE_LIMIT_MB = 100;
const SINGLE_FILE_LIMIT_MB = 20;

/**
 * MediaService - Handles media optimization, upload, and quota management
 */
export const MediaService = {
    /**
     * Check if user has enough storage left
     * @param {string} userId 
     * @param {number} newFileSizeBytes 
     * @returns {Promise<{ allowed: boolean, currentUsageMB: number }>}
     */
    async checkQuota(userId, newFileSizeBytes) {
        if (!userId) throw new Error('User not authenticated');

        try {
            // We'll query a table named 'user_assets'. 
            // Note: User needs to ensure this table exists in Supabase.
            const { data, error } = await supabase
                .from('user_assets')
                .select('file_size')
                .eq('user_id', userId);

            if (error) {
                // If table doesn't exist yet, we'll assume 0 usage but log a warning
                console.warn('user_assets table might not exist. Please create it to track storage quota.');
                return { allowed: true, currentUsageMB: 0 };
            }

            const totalUsageBytes = data.reduce((acc, curr) => acc + (curr.file_size || 0), 0);
            const totalUsageMB = totalUsageBytes / (1024 * 1024);
            const newFileMB = newFileSizeBytes / (1024 * 1024);

            return {
                allowed: (totalUsageMB + newFileMB) <= STORAGE_LIMIT_MB,
                currentUsageMB: totalUsageMB,
                limitMB: STORAGE_LIMIT_MB
            };
        } catch (err) {
            console.error('Error checking quota:', err);
            return { allowed: true, currentUsageMB: 0 }; // Fail safe for now
        }
    },

    /**
     * Compress image before upload
     */
    async compressImage(file) {
        const options = {
            maxSizeMB: 1, // Target 1MB
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: 'image/webp'
        };
        try {
            return await imageCompression(file, options);
        } catch (error) {
            console.error('Compression failed:', error);
            return file; // Fallback to original
        }
    },

    /**
     * Upload file to Cloudinary
     * @param {File} file 
     * @param {string} userId 
     * @param {Function} onProgress 
     */
    async uploadMedia(file, userId, onProgress) {
        const fileType = file.type.split('/')[0]; // image, video, audio

        // 1. Basic Size Check
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > SINGLE_FILE_LIMIT_MB) {
            throw new Error(`File too large. Maximum allowed is ${SINGLE_FILE_LIMIT_MB}MB.`);
        }

        // 2. Quota Check
        const quota = await this.checkQuota(userId, file.size);
        if (!quota.allowed) {
            throw new Error(`Storage limit exceeded. You have used ${quota.currentUsageMB.toFixed(2)}MB of ${quota.limitMB}MB.`);
        }

        let fileToUpload = file;

        // 3. Compression for images
        if (fileType === 'image') {
            if (onProgress) onProgress({ status: 'compressing', message: 'Optimizing image...' });
            fileToUpload = await this.compressImage(file);
        }

        // 4. Cloudinary Signature and Upload
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
            throw new Error('User session expired. Please sign in again.');
        }
        const signatureResponse = await fetch('/api/cloudinary/signature', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ folder: `user_content/${userId}` })
        });
        const signatureData = await signatureResponse.json();
        if (!signatureResponse.ok) {
            throw new Error(signatureData.error || 'Failed to prepare secure upload');
        }

        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('api_key', signatureData.apiKey);
        formData.append('timestamp', signatureData.timestamp.toString());
        formData.append('signature', signatureData.signature);
        formData.append('folder', signatureData.folder);

        const resourceType = fileType === 'image' ? 'image' : (fileType === 'video' ? 'video' : 'raw');
        const url = `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/${resourceType}/upload`;

        if (onProgress) onProgress({ status: 'uploading', message: `Uploading ${fileType}...` });

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable && onProgress) {
                    const percentage = (e.loaded / e.total) * 100;
                    onProgress({ status: 'uploading', percentage, message: `Uploading... ${Math.round(percentage)}%` });
                }
            };

            xhr.onload = async () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);

                    // 5. Save metadata to Supabase
                    try {
                        await supabase.from('user_assets').insert({
                            user_id: userId,
                            file_url: response.secure_url,
                            file_type: fileType,
                            file_size: fileToUpload.size,
                            cloudinary_id: response.public_id,
                            created_at: new Date().toISOString()
                        });
                    } catch (dbError) {
                        console.error('Failed to save metadata to DB:', dbError);
                        // We still have the URL, so we can return it, but usage tracking failed
                    }

                    resolve(response.secure_url);
                } else {
                    const error = JSON.parse(xhr.responseText);
                    reject(new Error(error.message || 'Upload failed'));
                }
            };

            xhr.onerror = () => reject(new Error('Network error during upload'));
            xhr.send(formData);
        });
    }
};
