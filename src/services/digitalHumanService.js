// digitalHumanService.js
/**
 * Service for managing digital human data and interactions
 */

// In-memory storage for demo purposes
let digitalHumans = [];
let memories = {};
let nextId = 1;

const digitalHumanService = {
  /**
   * Get all digital humans
   * @returns {Array} Array of digital human objects
   */
  getAll: () => {
    return digitalHumans;
  },

  /**
   * Get a digital human by ID
   * @param {string} id - The ID of the digital human
   * @returns {Object|null} Digital human object or null if not found
   */
  getById: (id) => {
    return digitalHumans.find(human => human.id === id) || null;
  },

  /**
   * Create a new digital human
   * @param {Object} data - Digital human data
   * @returns {Object} Created digital human
   */
  create: (data) => {
    const id = String(nextId++);
    
    const newHuman = {
      id,
      name: data.name,
      relationship: data.relationship,
      avatar: data.avatar,
      description: data.description || '',
      memories: 0,
      createdAt: data.createdAt || new Date().toISOString().split('T')[0],
      voiceModel: data.voiceModel || false,
      mediaFiles: data.mediaFiles || 0
    };

    // Initialize memories array for this human
    memories[id] = [];
    
    // Add the digital human to our storage
    digitalHumans.push(newHuman);
    
    return newHuman;
  },

  /**
   * Update a digital human
   * @param {string} id - The ID of the digital human
   * @param {Object} data - Updated data
   * @returns {Object|null} Updated digital human or null if not found
   */
  update: (id, data) => {
    const index = digitalHumans.findIndex(human => human.id === id);
    
    if (index === -1) return null;
    
    const updatedHuman = {
      ...digitalHumans[index],
      ...data
    };
    
    digitalHumans[index] = updatedHuman;
    return updatedHuman;
  },

  /**
   * Delete a digital human
   * @param {string} id - The ID of the digital human
   * @returns {boolean} True if deleted, false if not found
   */
  delete: (id) => {
    const initialLength = digitalHumans.length;
    digitalHumans = digitalHumans.filter(human => human.id !== id);
    
    // Clean up memories
    if (memories[id]) {
      delete memories[id];
    }
    
    return digitalHumans.length < initialLength;
  },

  /**
   * Add a memory to a digital human
   * @param {string} id - The ID of the digital human
   * @param {Object} memory - Memory data
   * @returns {Object|null} The added memory or null if human not found
   */
  addMemory: (id, memory) => {
    const human = digitalHumanService.getById(id);
    
    if (!human) return null;
    
    // Format the memory
    const newMemory = {
      id: Date.now().toString(),
      content: memory.content,
      type: memory.type || 'text',
      tags: memory.tags || [],
      date: memory.date || new Date().toISOString().split('T')[0]
    };
    
    // Add to memories
    if (!memories[id]) {
      memories[id] = [];
    }
    
    memories[id].push(newMemory);
    
    // Update memory count
    digitalHumanService.update(id, {
      memories: memories[id].length
    });
    
    return newMemory;
  },

  /**
   * Get all memories for a digital human
   * @param {string} id - The ID of the digital human
   * @returns {Array} Array of memory objects or empty array if not found
   */
  getMemories: (id) => {
    return memories[id] || [];
  },

  /**
   * Search for digital humans by name or relationship
   * @param {string} query - Search term
   * @returns {Array} Matched digital humans
   */
  search: (query) => {
    if (!query) return digitalHumans;
    
    const lowerQuery = query.toLowerCase();
    return digitalHumans.filter(human => 
      human.name.toLowerCase().includes(lowerQuery) ||
      human.relationship.toLowerCase().includes(lowerQuery)
    );
  }
};

export default digitalHumanService;