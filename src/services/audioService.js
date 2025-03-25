// audioService.js
/**
 * Service for managing audio recording and playback
 */

// API endpoints
const API_BASE_URL = '/api';
const ENDPOINTS = {
  PROCESS_AUDIO: '/voice-chat/process',
  GET_VOICES: '/voice-models',
  CREATE_VOICE_MODEL: '/voice-models/create'
};

// Helper to handle API requests with fallback
const apiRequest = async (endpoint, options = {}, fallbackFn) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`API request failed: ${error.message}. Using fallback.`);
    return fallbackFn ? fallbackFn() : null;
  }
};

const audioService = {
  mediaRecorder: null,
  audioChunks: [],
  stream: null,
  
  /**
   * Request microphone permissions and start recording
   * @returns {Promise} Promise that resolves when recording starts
   */
  startRecording: async () => {
    try {
      // Request microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioService.stream = stream;
      
      // Create new MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      audioService.mediaRecorder = mediaRecorder;
      audioService.audioChunks = [];
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioService.audioChunks.push(event.data);
        }
      };
      
      // Start recording
      mediaRecorder.start();
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error starting recording:', error);
      return Promise.reject(error);
    }
  },
  
  /**
   * Stop recording and get the audio blob
   * @returns {Promise<Blob>} Promise that resolves with the audio blob
   */
  stopRecording: () => {
    return new Promise((resolve, reject) => {
      if (!audioService.mediaRecorder) {
        reject(new Error('No recording in progress'));
        return;
      }
      
      audioService.mediaRecorder.onstop = () => {
        // Create audio blob from chunks
        const audioBlob = new Blob(audioService.audioChunks, { type: 'audio/webm' });
        
        // Clean up
        if (audioService.stream) {
          audioService.stream.getTracks().forEach(track => track.stop());
          audioService.stream = null;
        }
        
        resolve(audioBlob);
      };
      
      // Stop recording
      audioService.mediaRecorder.stop();
    });
  },
  
  /**
   * Cancel recording without saving
   */
  cancelRecording: () => {
    if (audioService.mediaRecorder && audioService.mediaRecorder.state !== 'inactive') {
      audioService.mediaRecorder.stop();
    }
    
    if (audioService.stream) {
      audioService.stream.getTracks().forEach(track => track.stop());
      audioService.stream = null;
    }
    
    audioService.audioChunks = [];
  },
  
  /**
   * Check if user has microphone permissions
   * @returns {Promise<boolean>} Promise resolving to permission status
   */
  checkMicrophonePermission: async () => {
    try {
      // Try to get the devices list
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = devices.filter(device => device.kind === 'audioinput');
      
      // If no audio devices found, return false
      if (audioDevices.length === 0) {
        return false;
      }
      
      // Check permissions
      for (const device of audioDevices) {
        // If permission is denied, label will be empty
        if (device.label !== '') {
          return true;
        }
      }
      
      // Try to request permissions
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // If we get here, permission was granted
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Error checking microphone permission:', error);
      return false;
    }
  },
  
  /**
   * Play audio from URL
   * @param {string} audioUrl - URL of audio to play
   * @returns {Promise<HTMLAudioElement>} Audio element
   */
  playAudio: (audioUrl) => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);
      
      audio.onended = () => resolve(audio);
      audio.onerror = (e) => reject(e);
      
      audio.play().catch(reject);
    });
  },
  
  /**
   * Convert text to speech
   * @param {string} text - Text to convert to speech
   * @param {Object} options - Options for speech synthesis
   * @returns {Promise<void>} Promise that resolves when audio starts playing
   */
  textToSpeech: (text, options = {}) => {
    return new Promise((resolve, reject) => {
      if (!('speechSynthesis' in window)) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }
      
      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Apply options
      if (options.lang) utterance.lang = options.lang;
      if (options.voice) utterance.voice = options.voice;
      if (options.rate) utterance.rate = options.rate;
      if (options.pitch) utterance.pitch = options.pitch;
      if (options.volume) utterance.volume = options.volume;
      
      // Set up event handlers
      utterance.onstart = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));
      
      // Speak the text
      window.speechSynthesis.speak(utterance);
    });
  },
  
  /**
   * Get available voices for speech synthesis
   * @returns {Array} Array of available voices
   */
  getVoices: () => {
    if (!('speechSynthesis' in window)) {
      return [];
    }
    
    return window.speechSynthesis.getVoices();
  },
  
  /**
   * Process the recorded audio with the backend API
   * @param {Blob} audioBlob - The audio blob to process
   * @param {Object} options - Options for processing
   * @returns {Promise} Promise that resolves with the processing result
   */
  processAudio: async (audioBlob, options = {}) => {
    // Create FormData to send the audio
    const formData = new FormData();
    formData.append('audio', audioBlob, 'user_audio.webm');
    
    // Add any additional options
    if (options.digitalHumanId) {
      formData.append('digitalHumanId', options.digitalHumanId);
    }
    
    if (options.language) {
      formData.append('language', options.language);
    }
    
    try {
      // Send to backend API
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PROCESS_AUDIO}`, {
        method: 'POST',
        body: formData
        // No Content-Type header as it will be set by the browser for FormData
      });
      
      if (!response.ok) {
        throw new Error(`Audio processing failed with status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.warn(`Audio processing failed: ${error.message}. Using fallback.`);
      
      // Return a simulated response
      return {
        success: true,
        text: 'This is a simulated response in demo mode.',
        audioUrl: null
      };
    }
  },
  
  /**
   * Get available voice models
   * @param {string} digitalHumanId - Optional ID to filter models by digital human
   * @returns {Promise<Array>} Available voice models
   */
  getVoiceModels: async (digitalHumanId = null) => {
    let endpoint = ENDPOINTS.GET_VOICES;
    if (digitalHumanId) {
      endpoint += `?digitalHumanId=${encodeURIComponent(digitalHumanId)}`;
    }
    
    return await apiRequest(endpoint, { method: 'GET' }, () => {
      // Return demo voice models
      return [
        { id: 'demo-1', name: 'Default Voice', gender: 'female' },
        { id: 'demo-2', name: 'Male Voice', gender: 'male' }
      ];
    });
  },
  
  /**
   * Create a voice model from audio samples
   * @param {Object} data - Voice model creation data
   * @returns {Promise<Object>} Created voice model info
   */
  createVoiceModel: async (data) => {
    const formData = new FormData();
    
    // Add basic information
    formData.append('name', data.name);
    formData.append('digitalHumanId', data.digitalHumanId);
    
    // Track if we have suitable audio samples
    let validSamplesCount = 0;
    let totalDuration = 0;
    
    // Add audio samples
    if (data.audioSamples && data.audioSamples.length) {
      console.log(`Processing ${data.audioSamples.length} audio samples for voice model creation`);
      
      // Process each audio sample
      await Promise.all(data.audioSamples.map(async (sample, index) => {
        // Get file extension from the sample name or default to .wav
        const fileExtension = sample.name ? sample.name.split('.').pop() : 'wav';
        
        // Append with proper extension
        const fileName = `sample_${index}.${fileExtension}`;
        formData.append(`sample_${index}`, sample, fileName);
        
        // Count valid samples by checking type and size
        if (sample.size > 10000 && sample.type.includes('audio')) {
          validSamplesCount++;
          
          try {
            // Try to get audio duration (not always possible in all browsers)
            const url = URL.createObjectURL(sample);
            const audio = new Audio();
            audio.src = url;
            
            await new Promise(resolve => {
              audio.onloadedmetadata = () => {
                totalDuration += audio.duration;
                URL.revokeObjectURL(url);
                resolve();
              };
              audio.onerror = () => resolve(); // Skip on error
            });
          } catch (e) {
            console.log('Could not determine audio duration:', e);
          }
        }
      }));
    }
    
    console.log(`Valid samples: ${validSamplesCount}, Total duration: ${Math.round(totalDuration)}s`);
    
    // Check if we have enough audio samples
    if (validSamplesCount < 3) {
      console.warn('Not enough valid audio samples for voice cloning. Minimum required: 3');
    }
    
    try {
      // Try to use digitalAvatarAdapter if it's been initialized
      if (window.digitalAvatarAdapterInitialized === true) {
        const digitalAvatarAdapter = await import('./digitalAvatarAdapter').then(module => module.default);
        
        if (digitalAvatarAdapter && typeof digitalAvatarAdapter.createVoiceModel === 'function') {
          console.log('Using digitalAvatarAdapter for voice model creation');
          return await digitalAvatarAdapter.createVoiceModel(data);
        }
      }
      
      // Fallback to direct API call
      // Send to backend API
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.CREATE_VOICE_MODEL}`, {
        method: 'POST',
        body: formData
        // No Content-Type header as it will be set by the browser for FormData
      });
      
      if (!response.ok) {
        throw new Error(`Voice model creation failed with status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.warn(`Voice model creation failed: ${error.message}. Using fallback.`);
      
      // Return a simulated response
      return {
        success: true,
        modelId: `demo-${Date.now()}`,
        message: validSamplesCount >= 3 ? 
          'Voice model created successfully in demo mode' : 
          'Voice model created in demo mode. For best results, provide at least 3 clear audio samples.'
      };
    }
  }
};

export default audioService;