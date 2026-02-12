import imageCompression from 'browser-image-compression';

const CLOUDINARY_CLOUD_NAME = 'dj2eotipq';
const CLOUDINARY_API_KEY = '694293892971346';
const CLOUDINARY_API_SECRET = '3XqSVEnPDesH3HJawIkpwwgVZdk';

/**
 * Compress image to WebP format with max 1200px width
 */
export async function compressImage(file, onProgress) {
  try {
    if (onProgress) {
      onProgress({
        status: 'optimizing',
        percentage: 10,
        message: 'Optimizing Pixels...'
      });
    }

    const options = {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
      fileType: 'image/webp',
      initialQuality: 0.85,
      onProgress: (percentage) => {
        if (onProgress) {
            // Map compression progress (0-100) to overall progress (10-40)
            onProgress({
                status: 'optimizing',
                percentage: 10 + (percentage * 0.3),
                message: 'Optimizing Pixels...'
            });
        }
      }
    };

    if (onProgress) {
      onProgress({
        status: 'compressing',
        percentage: 40,
        message: 'Compressing Time...'
      });
    }

    const compressedFile = await imageCompression(file, options);
    
    return compressedFile;
  } catch (error) {
    console.error('Image compression failed:', error);
    throw new Error('Failed to compress image');
  }
}

/**
 * Validate file size
 */
export function validateFileSize(file, maxSizeMB = 20) {
  const sizeMB = file.size / (1024 * 1024);
  return sizeMB <= maxSizeMB;
}

/**
 * Generate SHA-1 signature for Cloudinary
 */
async function generateSignature(params, apiSecret) {
  const sortedKeys = Object.keys(params).sort();
  const signatureString = sortedKeys.map(key => `${key}=${params[key]}`).join('&') + apiSecret;
  
  const msgBuffer = new TextEncoder().encode(signatureString);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

/**
 * Process and upload image
 */
export async function processAndUploadImage(file, onProgress) {
    try {
        // 1. Compress
        const compressedFile = await compressImage(file, onProgress);

        // 2. Prepare Upload
        const timestamp = Math.round((new Date()).getTime() / 1000);
        const params = {
            timestamp: timestamp,
            // folder: 'pet-memory', // Optional: organize in folder
        };

        const signature = await generateSignature(params, CLOUDINARY_API_SECRET);

        const formData = new FormData();
        formData.append('file', compressedFile);
        formData.append('api_key', CLOUDINARY_API_KEY);
        formData.append('timestamp', timestamp.toString());
        formData.append('signature', signature);
        // formData.append('folder', 'pet-memory');

        if (onProgress) {
            onProgress({
                status: 'uploading',
                percentage: 50,
                message: 'Uploading Soul...'
            });
        }

        // 3. Upload
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

            xhr.open('POST', url, true);

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable && onProgress) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    // Map upload progress (0-100) to overall progress (50-100)
                    onProgress({
                        status: 'uploading',
                        percentage: 50 + (percentComplete * 0.5),
                        message: 'Uploading Soul...'
                    });
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText);
                    if (onProgress) {
                        onProgress({
                            status: 'complete',
                            percentage: 100,
                            message: 'Memory Saved ✨'
                        });
                    }
                    resolve(data.secure_url);
                } else {
                    reject(new Error('Upload failed'));
                }
            };

            xhr.onerror = () => {
                reject(new Error('Upload failed'));
            };

            xhr.send(formData);
        });

    } catch (error) {
        console.error('Process and upload failed:', error);
        throw error;
    }
}
