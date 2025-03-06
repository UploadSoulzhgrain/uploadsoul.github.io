// audioService.js
/**
 * Service for managing audio recording and playback
 */

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
  }
};

export default audioService;