// LipSyncService.js
/**
 * Service for handling lip sync generation and animation for digital humans
 * This service interfaces with external lip sync APIs and provides fallback methods
 * when APIs are not available. It also handles the synchronization of audio playback
 * with lip movements on 3D models or 2D avatars.
 */

// External API endpoints for lip sync data generation
const API_BASE_URL = '/api';
const ENDPOINTS = {
  GENERATE_LIP_SYNC: '/lip-sync/generate',
  VALIDATE_MODEL: '/lip-sync/validate-model'
};

// Phoneme to viseme mapping (visemes are visual representations of phonemes)
const PHONEME_TO_VISEME = {
  'AA': 0, 'AE': 0, 'AH': 0,  // Open mouth sounds
  'AO': 1, 'AW': 1, 'AY': 1,  // Open rounded sounds
  'B': 2, 'M': 2, 'P': 2,     // Bilabial consonants
  'CH': 3, 'JH': 3, 'SH': 3,  // Palatal fricatives
  'D': 4, 'L': 4, 'N': 4, 'T': 4, // Alveolar consonants
  'EH': 5, 'ER': 5, 'EY': 5, 'IH': 5, 'IY': 5, // Front vowels
  'F': 6, 'V': 6,             // Labiodental consonants
  'G': 7, 'HH': 7, 'K': 7, 'NG': 7, // Velar consonants
  'OW': 8, 'OY': 8, 'UH': 8, 'UW': 8, // Back vowels
  'R': 9, 'Y': 9,             // Approximants
  'S': 10, 'Z': 10,           // Sibilants
  'TH': 11, 'DH': 11,         // Dental fricatives
  'W': 12                     // Round consonant
};

// Standard viseme definitions for different model systems
const VISEME_DEFINITIONS = {
  standard: [
    { name: 'rest', blendshapes: { jawOpen: 0.0, mouthClose: 0.0 } },
    { name: 'ah', blendshapes: { jawOpen: 0.7, mouthClose: 0.0 } },
    { name: 'ao', blendshapes: { jawOpen: 0.4, mouthPucker: 0.5 } },
    { name: 'bp', blendshapes: { jawOpen: 0.0, mouthClose: 1.0 } },
    { name: 'ch', blendshapes: { jawOpen: 0.4, mouthSmile: 0.7 } },
    { name: 'dt', blendshapes: { jawOpen: 0.3, mouthClose: 0.3 } },
    { name: 'er', blendshapes: { jawOpen: 0.5, mouthSmile: 0.3 } },
    { name: 'fv', blendshapes: { jawOpen: 0.2, lowerLipIn: 0.7 } },
    { name: 'kg', blendshapes: { jawOpen: 0.5, tongueOut: 0.5 } },
    { name: 'ou', blendshapes: { jawOpen: 0.4, mouthPucker: 0.8 } },
    { name: 'ry', blendshapes: { jawOpen: 0.4, mouthSmile: 0.2 } },
    { name: 'sz', blendshapes: { jawOpen: 0.3, mouthClose: 0.2 } },
    { name: 'th', blendshapes: { jawOpen: 0.4, tongueOut: 0.6 } },
    { name: 'w', blendshapes: { jawOpen: 0.2, mouthPucker: 1.0 } }
  ]
};

// Animation helper for interpolating between visemes
class LipAnimator {
  constructor(modelRenderer) {
    this.modelRenderer = modelRenderer; // Reference to ThreeJS or other renderer
    this.currentAnimation = null;
    this.visemes = [];
    this.audioElement = null;
    this.startTime = 0;
    this.isPlaying = false;
  }

  setVisemes(visemes) {
    this.visemes = visemes;
  }

  setAudioElement(audioElement) {
    this.audioElement = audioElement;
    
    // Set up event listeners for audio
    if (this.audioElement) {
      this.audioElement.addEventListener('play', () => this.startAnimation());
      this.audioElement.addEventListener('pause', () => this.stopAnimation());
      this.audioElement.addEventListener('ended', () => this.stopAnimation());
    }
  }

  startAnimation() {
    if (!this.visemes.length) return;
    
    this.isPlaying = true;
    this.startTime = Date.now();
    this.currentAnimation = requestAnimationFrame(this.animate.bind(this));
  }

  stopAnimation() {
    if (this.currentAnimation) {
      cancelAnimationFrame(this.currentAnimation);
      this.currentAnimation = null;
    }
    this.isPlaying = false;
    
    // Reset to neutral face
    if (this.modelRenderer) {
      this.modelRenderer.setViseme(VISEME_DEFINITIONS.standard[0]);
    }
  }

  animate() {
    if (!this.isPlaying || !this.audioElement) {
      this.stopAnimation();
      return;
    }
    
    // Get current audio playback time
    const currentTime = this.audioElement.currentTime * 1000; // Convert to ms
    
    // Find the appropriate viseme for the current time
    let currentViseme = this.visemes[0];
    for (let i = 0; i < this.visemes.length; i++) {
      if (this.visemes[i].time <= currentTime) {
        currentViseme = this.visemes[i];
      } else {
        break;
      }
    }
    
    // Apply the viseme to the model
    if (this.modelRenderer && currentViseme) {
      this.modelRenderer.setViseme(
        VISEME_DEFINITIONS.standard[currentViseme.value] || VISEME_DEFINITIONS.standard[0]
      );
    }
    
    // Continue animation loop
    this.currentAnimation = requestAnimationFrame(this.animate.bind(this));
  }
}

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

// Generate viseme sequence from text using a rule-based algorithm
// This is a fallback when the API is not available
const generateFallbackVisemes = (text, duration) => {
  // Basic algorithm: assign visemes based on rough phonetic patterns
  // This is a very simplistic approach but works as a fallback
  const words = text.toLowerCase().split(/\s+/);
  const visemes = [];
  
  let currentTime = 0;
  const avgWordDuration = duration / words.length;
  
  words.forEach((word) => {
    const wordDuration = Math.max(300, word.length * 80); // Rough estimate of word duration
    const chars = word.split('');
    
    chars.forEach((char, index) => {
      let visemeValue = 0; // Default to rest/neutral
      
      // Very basic character to viseme mapping
      if ('aeiou'.includes(char)) {
        // Vowels get more open mouth shapes
        visemeValue = 'aeiou'.indexOf(char) % 5 + 1;
      } else if ('bmp'.includes(char)) {
        visemeValue = 2; // Bilabial consonants
      } else if ('fv'.includes(char)) {
        visemeValue = 6; // Labiodental consonants
      } else if ('sz'.includes(char)) {
        visemeValue = 10; // Sibilants
      } else if ('kg'.includes(char)) {
        visemeValue = 7; // Velar consonants
      }
      
      const charTime = currentTime + (index * (wordDuration / chars.length));
      
      visemes.push({
        time: charTime,
        value: visemeValue,
        duration: wordDuration / chars.length
      });
    });
    
    currentTime += avgWordDuration;
  });
  
  return visemes;
};

// Main LipSyncService
const LipSyncService = {
  // Store references to active animators
  activeAnimators: {},
  
  // Initialize the service with custom configuration
  initialize: (config = {}) => {
    console.log('LipSync Service initialized with config', config);
    return true;
  },
  
  /**
   * Generate lip sync data from text and audio
   * @param {string} text - The text being spoken
   * @param {number} duration - Duration of audio in milliseconds
   * @param {Object} options - Additional options for lip sync generation
   * @returns {Promise<Array>} Array of viseme objects with timing information
   */
  generateLipSync: async (text, duration, options = {}) => {
    try {
      // Try to get lip sync data from API first
      const response = await apiRequest(
        ENDPOINTS.GENERATE_LIP_SYNC, 
        { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, duration, options })
        }, 
        () => ({ visemes: generateFallbackVisemes(text, duration) })
      );
      
      return response.visemes || [];
    } catch (error) {
      console.error('Error generating lip sync data:', error);
      // Return fallback visemes on error
      return generateFallbackVisemes(text, duration);
    }
  },
  
  /**
   * Generate lip sync data from audio file
   * @param {Blob} audioBlob - Audio file as blob
   * @param {string} text - Optional transcript text for more accurate lip sync
   * @returns {Promise<Array>} Array of viseme objects with timing information
   */
  generateLipSyncFromAudio: async (audioBlob, text = null) => {
    try {
      // Create form data to send audio
      const formData = new FormData();
      formData.append('audio', audioBlob);
      
      if (text) {
        formData.append('text', text);
      }
      
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GENERATE_LIP_SYNC}`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Lip sync generation failed with status ${response.status}`);
      }
      
      const data = await response.json();
      return data.visemes || [];
    } catch (error) {
      console.error('Error generating lip sync from audio:', error);
      
      // Get audio duration to generate fallback visemes
      let duration = 1000; // Default 1 second
      try {
        const url = URL.createObjectURL(audioBlob);
        const audio = new Audio(url);
        await new Promise(resolve => {
          audio.onloadedmetadata = () => {
            duration = audio.duration * 1000; // Convert to ms
            URL.revokeObjectURL(url);
            resolve();
          };
          audio.onerror = resolve; // Skip on error
        });
      } catch (e) {
        console.warn('Could not determine audio duration:', e);
      }
      
      // Generate fallback if text is available, otherwise empty visemes
      return text ? generateFallbackVisemes(text, duration) : [];
    }
  },
  
  /**
   * Attach lip sync animation to a 3D model or 2D avatar
   * @param {string} elementId - The ID of the DOM element containing the model
   * @param {Array} visemes - Array of viseme data with timing information
   * @param {HTMLAudioElement} audioElement - Audio element for synchronization
   * @param {Object} options - Additional animation options
   * @returns {Object} Controller for the animation
   */
  attachLipSyncToModel: (elementId, visemes, audioElement, options = {}) => {
    // Create a simple model renderer (this would be more complex in a real implementation)
    const modelRenderer = {
      setViseme: (viseme) => {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        // Apply viseme to DOM element (in a real implementation this would modify a 3D model)
        // For this example, we'll just update data attributes that CSS can use for styling
        Object.entries(viseme.blendshapes).forEach(([key, value]) => {
          element.dataset[key] = value;
        });
        element.dataset.currentViseme = viseme.name;
      }
    };
    
    // Create and set up animator
    const animator = new LipAnimator(modelRenderer);
    animator.setVisemes(visemes);
    animator.setAudioElement(audioElement);
    
    // Store reference to active animator
    LipSyncService.activeAnimators[elementId] = animator;
    
    return {
      start: () => animator.startAnimation(),
      stop: () => animator.stopAnimation(),
      update: (newVisemes) => animator.setVisemes(newVisemes),
      dispose: () => {
        animator.stopAnimation();
        delete LipSyncService.activeAnimators[elementId];
      }
    };
  },
  
  /**
   * Preload model data and check compatibility
   * @param {string} modelUrl - URL of the 3D model to validate
   * @returns {Promise<Object>} Validation results
   */
  validateModel: async (modelUrl) => {
    return await apiRequest(
      `${ENDPOINTS.VALIDATE_MODEL}?url=${encodeURIComponent(modelUrl)}`,
      { method: 'GET' },
      () => ({ 
        valid: true, 
        supportedFeatures: {
          lipSync: true,
          expressions: true,
          blinking: true
        },
        message: 'Model validation skipped in demo mode' 
      })
    );
  },
  
  /**
   * Clean up all active lip sync animations
   */
  cleanup: () => {
    Object.values(LipSyncService.activeAnimators).forEach(animator => {
      if (animator && animator.stopAnimation) {
        animator.stopAnimation();
      }
    });
    LipSyncService.activeAnimators = {};
  }
};

export default LipSyncService;