// src/services/gameService.js
import { toast } from 'react-hot-toast';

// Simple in-memory storage for demo purposes
// In a real application, this would be stored in a database
const gameStatsStorage = {};

/**
 * Service for managing game-related functionality
 */
const gameService = {
  /**
   * Get memory card images based on digital human and difficulty
   * @param {number} pairCount - Number of pairs required
   * @param {object} digitalHuman - Digital human object (optional)
   * @returns {Array} Array of image objects
   */
  getMemoryImages(pairCount, digitalHuman) {
    // Default images to use if no digital human is provided or no media files are available
    const defaultImages = [
      // Using placeholders from digital-humans directory which we know exists
      { url: '/assets/digital-humans/grandpa.jpg', name: 'Family Elder' },
      { url: '/assets/digital-humans/grandma.jpg', name: 'Family Matriarch' },
      { url: '/assets/digital-humans/uncle.jpg', name: 'Uncle' },
      { url: '/assets/digital-humans/cousin1.jpg', name: 'Cousin 1' },
      { url: '/assets/digital-humans/cousin2.jpg', name: 'Cousin 2' },
      { url: '/assets/digital-humans/mother.jpg', name: 'Mother' },
      { url: '/assets/digital-humans/me.jpg', name: 'Self' },
      { url: '/assets/digital-humans/memory1.jpg', name: 'Memory 1' },
      { url: '/assets/digital-humans/memory2.jpg', name: 'Memory 2' },
      { url: '/assets/digital-humans/memory3.jpg', name: 'Memory 3' },
      { url: '/assets/digital-humans/memory4.jpg', name: 'Memory 4' },
      { url: '/assets/digital-humans/grandpa.jpg', name: 'Grandfather' }
    ];

    let availableImages = [...defaultImages];

    // If digital human is provided and has media files, use them
    if (digitalHuman && digitalHuman.mediaFiles) {
      const mediaImages = digitalHuman.mediaFiles
        .filter(file => file.type === 'image')
        .map(file => ({
          url: file.url,
          name: file.description || 'Memory'
        }));

      // If we have enough media images, use them
      if (mediaImages.length >= pairCount) {
        availableImages = mediaImages;
      } else {
        // Otherwise combine with default images
        availableImages = [...mediaImages, ...defaultImages];
      }
    }

    // Shuffle the images and take the required number of pairs
    return this.shuffleArray(availableImages).slice(0, pairCount);
  },

  /**
   * Save game statistics
   * @param {object} stats - Game statistics object
   * @returns {boolean} Whether save was successful
   */
  saveGameStats(stats) {
    try {
      const digitalHumanId = stats.digitalHumanId || 'demo';
      
      // Initialize array for this digital human if it doesn't exist
      if (!gameStatsStorage[digitalHumanId]) {
        gameStatsStorage[digitalHumanId] = [];
      }
      
      // Add new stats to the beginning of the array
      gameStatsStorage[digitalHumanId].unshift(stats);
      
      // In a real app, this would be saved to a database
      console.log('Game stats saved:', stats);
      
      return true;
    } catch (error) {
      console.error('Error saving game stats:', error);
      toast.error('Failed to save game progress');
      return false;
    }
  },

  /**
   * Get game statistics for a specific digital human
   * @param {string} digitalHumanId - Digital human ID
   * @returns {Array} Array of game stats
   */
  async getGameStats(digitalHumanId) {
    // In a real app, this would fetch from a database
    const id = digitalHumanId || 'demo';
    return gameStatsStorage[id] || [];
  },

  /**
   * Shuffle an array using the Fisher-Yates algorithm
   * @param {Array} array - Array to shuffle
   * @returns {Array} Shuffled array
   */
  shuffleArray(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
};

export default gameService;