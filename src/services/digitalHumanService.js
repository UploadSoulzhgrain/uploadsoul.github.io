// digitalHumanService.js
/**
 * Service for managing digital human data and interactions
 */

// API endpoints
const API_BASE_URL = '/api';
const ENDPOINTS = {
  GET_ALL: '/digital-humans',
  GET_ONE: '/digital-humans/:id',
  CREATE: '/digital-humans',
  UPDATE: '/digital-humans/:id',
  DELETE: '/digital-humans/:id',
  ADD_MEMORY: '/digital-humans/:id/memories',
  GET_MEMORIES: '/digital-humans/:id/memories',
  UPLOAD_FILES: '/digital-humans/:id/upload'
};

// Fallback to in-memory storage for demo purposes
let digitalHumans = [];
let memories = {};
let nextId = 1;

// Helper to replace path parameters
const replaceParams = (url, params) => {
  let result = url;
  for (const key in params) {
    result = result.replace(`:${key}`, params[key]);
  }
  return result;
};

// Helper to handle API requests with fallback
const apiRequest = async (endpoint, options = {}, fallbackFn) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`API request failed: ${error.message}. Using fallback.`);
    return fallbackFn();
  }
};

const digitalHumanService = {
  /**
   * Get all digital humans
   * @returns {Promise<Array>} Array of digital human objects
   */
  getAll: async () => {
    return await apiRequest(ENDPOINTS.GET_ALL, { method: 'GET' }, () => digitalHumans);
  },

  /**
   * Get a digital human by ID
   * @param {string} id - The ID of the digital human
   * @returns {Promise<Object|null>} Digital human object or null if not found
   */
  getById: async (id) => {
    const endpoint = replaceParams(ENDPOINTS.GET_ONE, { id });
    return await apiRequest(endpoint, { method: 'GET' }, () => {
      return digitalHumans.find(human => human.id === id) || null;
    });
  },

  /**
   * Create a new digital human
   * @param {Object} data - Digital human data
   * @returns {Promise<Object>} Created digital human
   */
  create: async (data) => {
    return await apiRequest(ENDPOINTS.CREATE, { 
      method: 'POST',
      body: JSON.stringify(data)
    }, () => {
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
    });
  },

  /**
   * Upload files for a digital human
   * @param {string} id - The ID of the digital human
   * @param {FormData} formData - Form data with files
   * @returns {Promise<Object>} Upload result
   */
  uploadFiles: async (id, formData) => {
    const endpoint = replaceParams(ENDPOINTS.UPLOAD_FILES, { id });
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        method: 'POST',
        body: formData
        // No Content-Type header as it will be set by the browser for FormData
      });

      if (!response.ok) {
        throw new Error(`File upload failed with status ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn(`File upload failed: ${error.message}. Using fallback.`);
      // Simple fallback just returns success without actually uploading
      return { success: true, message: 'Files processed in demo mode' };
    }
  },

  /**
   * Update a digital human
   * @param {string} id - The ID of the digital human
   * @param {Object} data - Updated data
   * @returns {Promise<Object|null>} Updated digital human or null if not found
   */
  update: async (id, data) => {
    const endpoint = replaceParams(ENDPOINTS.UPDATE, { id });
    return await apiRequest(endpoint, { 
      method: 'PUT',
      body: JSON.stringify(data)
    }, () => {
      const index = digitalHumans.findIndex(human => human.id === id);
      
      if (index === -1) return null;
      
      const updatedHuman = {
        ...digitalHumans[index],
        ...data
      };
      
      digitalHumans[index] = updatedHuman;
      return updatedHuman;
    });
  },

  /**
   * Delete a digital human
   * @param {string} id - The ID of the digital human
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  delete: async (id) => {
    const endpoint = replaceParams(ENDPOINTS.DELETE, { id });
    return await apiRequest(endpoint, { method: 'DELETE' }, () => {
      const initialLength = digitalHumans.length;
      digitalHumans = digitalHumans.filter(human => human.id !== id);
      
      // Clean up memories
      if (memories[id]) {
        delete memories[id];
      }
      
      return digitalHumans.length < initialLength;
    });
  },

  /**
   * Add a memory to a digital human
   * @param {string} id - The ID of the digital human
   * @param {Object} memory - Memory data
   * @returns {Promise<Object|null>} The added memory or null if human not found
   */
  addMemory: async (id, memory) => {
    const endpoint = replaceParams(ENDPOINTS.ADD_MEMORY, { id });
    return await apiRequest(endpoint, { 
      method: 'POST',
      body: JSON.stringify(memory)
    }, async () => {
      const human = await digitalHumanService.getById(id);
      
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
      await digitalHumanService.update(id, {
        memories: memories[id].length
      });
      
      return newMemory;
    });
  },

  /**
   * Get all memories for a digital human
   * @param {string} id - The ID of the digital human
   * @returns {Promise<Array>} Array of memory objects or empty array if not found
   */
  getMemories: async (id) => {
    const endpoint = replaceParams(ENDPOINTS.GET_MEMORIES, { id });
    return await apiRequest(endpoint, { method: 'GET' }, () => {
      return memories[id] || [];
    });
  },

  /**
   * Search for digital humans by name or relationship
   * @param {string} query - Search term
   * @returns {Promise<Array>} Matched digital humans
   */
  search: async (query) => {
    const allHumans = await digitalHumanService.getAll();
    if (!query) return allHumans;
    
    const lowerQuery = query.toLowerCase();
    return allHumans.filter(human => 
      human.name.toLowerCase().includes(lowerQuery) ||
      human.relationship.toLowerCase().includes(lowerQuery)
    );
  }
};

export default digitalHumanService;