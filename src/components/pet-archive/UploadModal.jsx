import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Image as ImageIcon, Video, Music, AlertTriangle, FileWarning, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { processAndUploadImage, validateFileSize } from '../../utils/petMedia';

export default function UploadModal({ pet, onClose, isOpen }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, processing, uploading, success, error
  const [progressMessage, setProgressMessage] = useState('');
  const [error, setError] = useState('');

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file) => {
    setError('');
    setUploadStatus('processing');
    
    // Validate file type
    const fileType = file.type.split('/')[0];
    if (!['image', 'video', 'audio'].includes(fileType)) {
      setError('Only images, videos, and audio are allowed.');
      setUploadStatus('error');
      return;
    }

    // Validate file size
    if (!validateFileSize(file, 20)) {
        if (fileType === 'video') {
            setError("The video is heavy. Let's keep it short (under 20MB) to last forever.");
        } else {
            setError('File is too large. Please keep it under 20MB.');
        }
        setUploadStatus('error');
        return;
    }

    try {
      let mediaUrl;
      
      if (fileType === 'image') {
        setProgressMessage('Optimizing Pixels...');
        
        mediaUrl = await processAndUploadImage(file, (progress) => {
            if (progress.status === 'compressing') {
                setProgressMessage('Compressing Time...');
            } else if (progress.status === 'uploading') {
                setProgressMessage('Uploading Soul...');
            }
        });
      } else {
        setProgressMessage('Uploading Soul...');
        // Placeholder for video/audio
        setError('Video upload implementation pending Cloudinary setup for video.');
        setUploadStatus('error');
        return; 
      }

      // Save to database
      const { error: insertError } = await supabase
        .from('memories')
        .insert({
            pet_id: pet.id,
            type: fileType === 'image' ? 'photo' : fileType,
            media_url: mediaUrl,
            date: new Date().toISOString(),
            caption: 'A precious moment' // Default caption
        });

      if (insertError) throw insertError;

      // Update pet cover image if not set
      if (!pet.cover_image_url && fileType === 'image') {
        await supabase
          .from('pets')
          .update({ cover_image_url: mediaUrl })
          .eq('id', pet.id);
      }

      setUploadStatus('success');
      setTimeout(() => {
        onClose();
        setUploadStatus('idle');
      }, 1500);

    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Upload failed, please try again.');
      setUploadStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative card-premium w-full max-w-2xl overflow-hidden shadow-2xl"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-12">
                {uploadStatus === 'idle' || uploadStatus === 'error' ? (
                    <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`
                            border-2 border-dashed rounded-2xl h-80 flex flex-col items-center justify-center transition-all duration-300
                            ${isDragging 
                                ? 'border-amber-500 bg-amber-500/10 scale-105' 
                                : 'border-white/10 bg-black/20 hover:border-amber-500/50 hover:bg-black/30'
                            }
                        `}
                    >
                        <input
                            type="file"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload"
                            accept="image/*,video/*,audio/*"
                        />
                        
                        <label 
                            htmlFor="file-upload"
                            className="flex flex-col items-center cursor-pointer group"
                        >
                            <div className="bg-white/5 p-6 rounded-full mb-6 group-hover:bg-amber-500/20 transition-colors duration-300">
                                <Upload className="w-12 h-12 text-gray-400 group-hover:text-amber-500 transition-colors" />
                            </div>
                            <h3 className="font-serif text-3xl text-white mb-2 tracking-wide">
                                Drop a piece of memory here
                            </h3>
                            <p className="text-gray-400 font-sans">
                                or click to browse
                            </p>
                        </label>

                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 flex items-center gap-2 text-red-400 bg-red-900/20 border border-red-500/20 px-4 py-2 rounded-full"
                            >
                                <AlertTriangle className="w-4 h-4" />
                                <span className="text-sm font-medium">{error}</span>
                            </motion.div>
                        )}
                    </div>
                ) : (
                    <div className="h-80 flex flex-col items-center justify-center text-center">
                        {uploadStatus === 'success' ? (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-green-500"
                            >
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                                    <Sparkles className="w-10 h-10 text-green-400" />
                                </div>
                                <h3 className="font-serif text-3xl text-white mb-2">
                                    Memory Preserved
                                </h3>
                                <p className="text-gray-400">Forever in the Soul Archive</p>
                            </motion.div>
                        ) : (
                            <div className="space-y-8">
                                <div className="relative w-32 h-32 mx-auto">
                                    <motion.div
                                        className="absolute inset-0 border-4 border-white/10 rounded-full"
                                    />
                                    <motion.div
                                        className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <ImageIcon className="w-8 h-8 text-white/50" />
                                    </div>
                                </div>
                                
                                <motion.p 
                                    key={progressMessage}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="font-serif text-2xl text-amber-400 italic"
                                >
                                    {progressMessage}
                                </motion.p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
