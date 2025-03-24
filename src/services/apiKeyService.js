// src/services/apiKeyService.js
/**
 * API Key Service
 * 
 * This service manages the storage and retrieval of API keys
 * for integrations like OpenAI and ElevenLabs.
 * Keys are stored in localStorage with encryption for basic security.
 */

// Constants for localStorage keys
const STORAGE_KEYS = {
  OPENAI: 'uploadsoul_openai_key',
  ELEVENLABS: 'uploadsoul_elevenlabs_key',
};

// Simple obfuscation for stored keys (not true encryption, but better than plaintext)
const obfuscate = (text) => {
  if (!text) return '';
  // Simple XOR obfuscation with a fixed key
  const key = 'UPLOADSOUL_SECURE';
  return Array.from(text)
    .map((char, i) => {
      const keyChar = key[i % key.length].charCodeAt(0);
      return String.fromCharCode(char.charCodeAt(0) ^ keyChar);
    })
    .join('');
};

// Deobfuscate the stored key
const deobfuscate = obfuscate; // XOR is symmetric, so same function works for both

/**
 * API Key Service
 */
const apiKeyService = {
  /**
   * Initialize API keys in window object from localStorage
   * Called during application startup
   */
  initialize: () => {
    try {
      // Check for existing OpenAI API key in localStorage
      const openaiKey = localStorage.getItem(STORAGE_KEYS.OPENAI);
      if (openaiKey) {
        window.OPENAI_API_KEY = deobfuscate(openaiKey);
        console.log('OpenAI API key loaded from localStorage');
      }

      // Check for existing ElevenLabs API key in localStorage
      const elevenlabsKey = localStorage.getItem(STORAGE_KEYS.ELEVENLABS);
      if (elevenlabsKey) {
        window.ELEVENLABS_API_KEY = deobfuscate(elevenlabsKey);
        console.log('ElevenLabs API key loaded from localStorage');
      }

      // Return initialization status
      return {
        openai: !!openaiKey,
        elevenlabs: !!elevenlabsKey
      };
    } catch (error) {
      console.error('Error initializing API keys:', error);
      return {
        openai: false,
        elevenlabs: false
      };
    }
  },

  /**
   * Get API keys status
   * @returns {Object} Object with API key availability status
   */
  getStatus: () => {
    return {
      openai: !!window.OPENAI_API_KEY,
      elevenlabs: !!window.ELEVENLABS_API_KEY
    };
  },

  /**
   * Get a specific API key
   * @param {string} service - The service to get the key for ('openai' or 'elevenlabs')
   * @returns {string|null} The API key or null if not set
   */
  getApiKey: (service) => {
    switch (service.toLowerCase()) {
      case 'openai':
        return window.OPENAI_API_KEY || null;
      case 'elevenlabs':
        return window.ELEVENLABS_API_KEY || null;
      default:
        return null;
    }
  },

  /**
   * Set the OpenAI API key
   * @param {string} key - The API key to set
   * @returns {boolean} Success status
   */
  setOpenAIKey: (key) => {
    try {
      if (key) {
        // Store in localStorage (obfuscated)
        localStorage.setItem(STORAGE_KEYS.OPENAI, obfuscate(key));
        // Store in window object for immediate use
        window.OPENAI_API_KEY = key;
        console.log('OpenAI API key saved');
      } else {
        // Remove key if empty string is provided
        localStorage.removeItem(STORAGE_KEYS.OPENAI);
        window.OPENAI_API_KEY = '';
        console.log('OpenAI API key removed');
      }
      return true;
    } catch (error) {
      console.error('Error setting OpenAI API key:', error);
      return false;
    }
  },

  /**
   * Set the ElevenLabs API key
   * @param {string} key - The API key to set
   * @returns {boolean} Success status
   */
  setElevenLabsKey: (key) => {
    try {
      if (key) {
        // Store in localStorage (obfuscated)
        localStorage.setItem(STORAGE_KEYS.ELEVENLABS, obfuscate(key));
        // Store in window object for immediate use
        window.ELEVENLABS_API_KEY = key;
        console.log('ElevenLabs API key saved');
      } else {
        // Remove key if empty string is provided
        localStorage.removeItem(STORAGE_KEYS.ELEVENLABS);
        window.ELEVENLABS_API_KEY = '';
        console.log('ElevenLabs API key removed');
      }
      return true;
    } catch (error) {
      console.error('Error setting ElevenLabs API key:', error);
      return false;
    }
  },

  /**
   * Clear all API keys
   * @returns {boolean} Success status
   */
  clearAllKeys: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.OPENAI);
      localStorage.removeItem(STORAGE_KEYS.ELEVENLABS);
      window.OPENAI_API_KEY = '';
      window.ELEVENLABS_API_KEY = '';
      console.log('All API keys cleared');
      return true;
    } catch (error) {
      console.error('Error clearing API keys:', error);
      return false;
    }
  }
};

export default apiKeyService;