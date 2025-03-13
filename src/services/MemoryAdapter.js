// MemoryAdapter.js
/**
 * Service for handling storage and retrieval of conversations and memories for digital humans.
 * This service provides memory management, conversation context, and semantic memory storage
 * to enable digital humans to maintain context and recall past interactions.
 */

// IndexedDB database name and version
const DB_NAME = 'digitalHumanMemoryDB';
const DB_VERSION = 1;

// Schema for memory categorization
const MEMORY_TYPES = {
  CONVERSATION: 'conversation',
  FACT: 'fact',
  PREFERENCE: 'preference',
  RELATIONSHIP: 'relationship',
  EMOTION: 'emotion',
  EVENT: 'event'
};

// Helper for semantic relevance
const calculateRelevance = (query, text) => {
  if (!query || !text) return 0;
  
  // Simple relevance calculation based on term frequency
  const queryTerms = query.toLowerCase().split(/\s+/);
  const textLower = text.toLowerCase();
  
  // Count matches
  let matchCount = 0;
  queryTerms.forEach(term => {
    if (term.length > 2 && textLower.includes(term)) { // Only consider terms with length > 2
      matchCount++;
    }
  });
  
  return matchCount / queryTerms.length; // Normalize by query length
};

// Main MemoryAdapter service
const MemoryAdapter = {
  db: null,
  
  /**
   * Initialize the memory database
   * @returns {Promise<boolean>} True if initialization succeeds
   */
  initialize: async () => {
    return new Promise((resolve, reject) => {
      try {
        // Check if IndexedDB is supported
        if (!window.indexedDB) {
          console.warn('Your browser doesn\'t support IndexedDB. Using fallback memory storage.');
          MemoryAdapter.setupInMemoryFallback();
          resolve(true);
          return;
        }
        
        // Open/create the database
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);
        
        // Handle database upgrade (first time or version change)
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          
          // Create object stores if they don't exist
          if (!db.objectStoreNames.contains('memories')) {
            const memoryStore = db.createObjectStore('memories', { keyPath: 'id' });
            memoryStore.createIndex('digitalHumanId', 'digitalHumanId', { unique: false });
            memoryStore.createIndex('type', 'type', { unique: false });
            memoryStore.createIndex('timestamp', 'timestamp', { unique: false });
          }
          
          if (!db.objectStoreNames.contains('conversations')) {
            const conversationStore = db.createObjectStore('conversations', { keyPath: 'id' });
            conversationStore.createIndex('digitalHumanId', 'digitalHumanId', { unique: false });
            conversationStore.createIndex('timestamp', 'timestamp', { unique: false });
          }
        };
        
        // Success handler
        request.onsuccess = (event) => {
          MemoryAdapter.db = event.target.result;
          console.log('Memory database initialized successfully');
          resolve(true);
        };
        
        // Error handler
        request.onerror = (event) => {
          console.error('Error initializing memory database:', event.target.error);
          MemoryAdapter.setupInMemoryFallback();
          resolve(false);
        };
      } catch (error) {
        console.error('Error in memory database initialization:', error);
        MemoryAdapter.setupInMemoryFallback();
        resolve(false);
      }
    });
  },
  
  /**
   * Set up in-memory fallback when IndexedDB is not available
   */
  setupInMemoryFallback: () => {
    // In-memory storage
    MemoryAdapter.inMemoryMemories = {};
    MemoryAdapter.inMemoryConversations = {};
    MemoryAdapter.isUsingFallback = true;
    
    console.log('Using in-memory fallback for memory storage');
  },
  
  /**
   * Store a memory
   * @param {Object} memory - Memory object to store
   * @returns {Promise<string>} ID of stored memory
   */
  storeMemory: async (memory) => {
    // Validate memory object
    if (!memory.digitalHumanId || !memory.content) {
      throw new Error('Memory must have digitalHumanId and content properties');
    }
    
    // Format memory with required fields
    const formattedMemory = {
      id: memory.id || `memory-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      digitalHumanId: memory.digitalHumanId,
      content: memory.content,
      type: memory.type || MEMORY_TYPES.FACT,
      importance: memory.importance || 0.5, // 0-1 scale
      timestamp: memory.timestamp || Date.now(),
      metadata: memory.metadata || {},
      tags: memory.tags || []
    };
    
    // Use in-memory fallback if needed
    if (MemoryAdapter.isUsingFallback) {
      if (!MemoryAdapter.inMemoryMemories[formattedMemory.digitalHumanId]) {
        MemoryAdapter.inMemoryMemories[formattedMemory.digitalHumanId] = [];
      }
      MemoryAdapter.inMemoryMemories[formattedMemory.digitalHumanId].push(formattedMemory);
      return formattedMemory.id;
    }
    
    // Store in IndexedDB
    return new Promise((resolve, reject) => {
      try {
        const transaction = MemoryAdapter.db.transaction(['memories'], 'readwrite');
        const memoryStore = transaction.objectStore('memories');
        const request = memoryStore.add(formattedMemory);
        
        request.onsuccess = () => resolve(formattedMemory.id);
        request.onerror = (event) => reject(new Error(`Memory storage failed: ${event.target.error}`));
      } catch (error) {
        console.error('Error in memory storage:', error);
        reject(error);
      }
    });
  },
  
  /**
   * Store a conversation message
   * @param {Object} message - Conversation message to store
   * @returns {Promise<string>} ID of stored message
   */
  storeConversationMessage: async (message) => {
    // Validate message
    if (!message.digitalHumanId || !message.content || !message.role) {
      throw new Error('Message must have digitalHumanId, content, and role properties');
    }
    
    // Format message with required fields
    const formattedMessage = {
      id: message.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      digitalHumanId: message.digitalHumanId,
      content: message.content,
      role: message.role, // 'user' or 'assistant'
      timestamp: message.timestamp || Date.now(),
      metadata: message.metadata || {}
    };
    
    // Use in-memory fallback if needed
    if (MemoryAdapter.isUsingFallback) {
      if (!MemoryAdapter.inMemoryConversations[formattedMessage.digitalHumanId]) {
        MemoryAdapter.inMemoryConversations[formattedMessage.digitalHumanId] = [];
      }
      MemoryAdapter.inMemoryConversations[formattedMessage.digitalHumanId].push(formattedMessage);
      return formattedMessage.id;
    }
    
    // Store in IndexedDB
    return new Promise((resolve, reject) => {
      try {
        const transaction = MemoryAdapter.db.transaction(['conversations'], 'readwrite');
        const conversationStore = transaction.objectStore('conversations');
        const request = conversationStore.add(formattedMessage);
        
        request.onsuccess = () => resolve(formattedMessage.id);
        request.onerror = (event) => reject(new Error(`Message storage failed: ${event.target.error}`));
      } catch (error) {
        console.error('Error in message storage:', error);
        reject(error);
      }
    });
  },
  
  /**
   * Get all memories for a digital human
   * @param {string} digitalHumanId - ID of the digital human
   * @param {Object} options - Query options (type, limit, etc)
   * @returns {Promise<Array>} Array of memories
   */
  getMemories: async (digitalHumanId, options = {}) => {
    // Use in-memory fallback if needed
    if (MemoryAdapter.isUsingFallback) {
      let memories = MemoryAdapter.inMemoryMemories[digitalHumanId] || [];
      
      // Apply filters if specified
      if (options.type) {
        memories = memories.filter(mem => mem.type === options.type);
      }
      
      // Sort by timestamp (newest first)
      memories.sort((a, b) => b.timestamp - a.timestamp);
      
      // Apply limit if specified
      if (options.limit && options.limit > 0) {
        memories = memories.slice(0, options.limit);
      }
      
      return memories;
    }
    
    // Get from IndexedDB
    return new Promise((resolve, reject) => {
      try {
        const transaction = MemoryAdapter.db.transaction(['memories'], 'readonly');
        const memoryStore = transaction.objectStore('memories');
        const index = memoryStore.index('digitalHumanId');
        const request = index.getAll(IDBKeyRange.only(digitalHumanId));
        
        request.onsuccess = (event) => {
          let memories = event.target.result || [];
          
          // Apply filters if specified
          if (options.type) {
            memories = memories.filter(mem => mem.type === options.type);
          }
          
          // Sort by timestamp (newest first)
          memories.sort((a, b) => b.timestamp - a.timestamp);
          
          // Apply limit if specified
          if (options.limit && options.limit > 0) {
            memories = memories.slice(0, options.limit);
          }
          
          resolve(memories);
        };
        
        request.onerror = (event) => reject(new Error(`Memory retrieval failed: ${event.target.error}`));
      } catch (error) {
        console.error('Error retrieving memories:', error);
        reject(error);
      }
    });
  },
  
  /**
   * Get conversation history for a digital human
   * @param {string} digitalHumanId - ID of the digital human
   * @param {Object} options - Query options (limit, before, after)
   * @returns {Promise<Array>} Array of conversation messages
   */
  getConversationHistory: async (digitalHumanId, options = {}) => {
    // Use in-memory fallback if needed
    if (MemoryAdapter.isUsingFallback) {
      let messages = MemoryAdapter.inMemoryConversations[digitalHumanId] || [];
      
      // Apply time filters if specified
      if (options.before) {
        messages = messages.filter(msg => msg.timestamp < options.before);
      }
      if (options.after) {
        messages = messages.filter(msg => msg.timestamp > options.after);
      }
      
      // Sort by timestamp (oldest first for conversations)
      messages.sort((a, b) => a.timestamp - b.timestamp);
      
      // Apply limit if specified
      if (options.limit && options.limit > 0) {
        messages = messages.slice(-options.limit); // Get most recent messages
      }
      
      return messages;
    }
    
    // Get from IndexedDB
    return new Promise((resolve, reject) => {
      try {
        const transaction = MemoryAdapter.db.transaction(['conversations'], 'readonly');
        const conversationStore = transaction.objectStore('conversations');
        const index = conversationStore.index('digitalHumanId');
        const request = index.getAll(IDBKeyRange.only(digitalHumanId));
        
        request.onsuccess = (event) => {
          let messages = event.target.result || [];
          
          // Apply time filters if specified
          if (options.before) {
            messages = messages.filter(msg => msg.timestamp < options.before);
          }
          if (options.after) {
            messages = messages.filter(msg => msg.timestamp > options.after);
          }
          
          // Sort by timestamp (oldest first for conversations)
          messages.sort((a, b) => a.timestamp - b.timestamp);
          
          // Apply limit if specified
          if (options.limit && options.limit > 0) {
            messages = messages.slice(-options.limit); // Get most recent messages
          }
          
          resolve(messages);
        };
        
        request.onerror = (event) => reject(new Error(`Conversation retrieval failed: ${event.target.error}`));
      } catch (error) {
        console.error('Error retrieving conversation:', error);
        reject(error);
      }
    });
  },
  
  /**
   * Search memories based on query text
   * @param {string} digitalHumanId - ID of the digital human
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Promise<Array>} Array of relevant memories
   */
  searchMemories: async (digitalHumanId, query, options = {}) => {
    // Get all memories first
    const memories = await MemoryAdapter.getMemories(digitalHumanId);
    
    // Calculate relevance for each memory
    const scoredMemories = memories.map(memory => {
      const relevance = calculateRelevance(query, memory.content);
      return { ...memory, relevance };
    });
    
    // Filter by minimum relevance
    const minRelevance = options.minRelevance || 0.1;
    let relevantMemories = scoredMemories.filter(memory => memory.relevance >= minRelevance);
    
    // Sort by relevance (highest first)
    relevantMemories.sort((a, b) => b.relevance - a.relevance);
    
    // Apply limit if specified
    if (options.limit && options.limit > 0) {
      relevantMemories = relevantMemories.slice(0, options.limit);
    }
    
    return relevantMemories;
  },
  
  /**
   * Generate a summary of important memories for a digital human
   * @param {string} digitalHumanId - ID of the digital human
   * @returns {Promise<string>} Memory summary
   */
  generateMemorySummary: async (digitalHumanId) => {
    try {
      // Get important memories
      const importantMemories = await MemoryAdapter.getMemories(digitalHumanId, {
        limit: 20 // Get a reasonable number of memories
      });
      
      // If there are no memories, return empty summary
      if (!importantMemories || importantMemories.length === 0) {
        return 'No memories available.';
      }
      
      // Sort by importance
      importantMemories.sort((a, b) => b.importance - a.importance);
      
      // Generate simple summary
      const topMemories = importantMemories.slice(0, 5); // Take top 5 important memories
      
      const summary = topMemories.map(memory => {
        const date = new Date(memory.timestamp).toLocaleDateString();
        return `[${date}] ${memory.content}`;
      }).join('\n');
      
      return `Memory Summary:\n${summary}\n\nTotal memories: ${importantMemories.length}`;
    } catch (error) {
      console.error('Error generating memory summary:', error);
      return 'Unable to generate memory summary at this time.';
    }
  },
  
  /**
   * Clear all memories for a digital human
   * @param {string} digitalHumanId - ID of the digital human
   * @returns {Promise<boolean>} True if clear succeeded
   */
  clearMemories: async (digitalHumanId) => {
    // Use in-memory fallback if needed
    if (MemoryAdapter.isUsingFallback) {
      delete MemoryAdapter.inMemoryMemories[digitalHumanId];
      delete MemoryAdapter.inMemoryConversations[digitalHumanId];
      return true;
    }
    
    // Clear from IndexedDB
    return new Promise((resolve, reject) => {
      try {
        // Clear memories
        const memTransaction = MemoryAdapter.db.transaction(['memories'], 'readwrite');
        const memoryStore = memTransaction.objectStore('memories');
        const memIndex = memoryStore.index('digitalHumanId');
        
        const memRequest = memIndex.openKeyCursor(IDBKeyRange.only(digitalHumanId));
        
        memRequest.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            memoryStore.delete(cursor.primaryKey);
            cursor.continue();
          }
        };
        
        // Clear conversations
        const convTransaction = MemoryAdapter.db.transaction(['conversations'], 'readwrite');
        const convStore = convTransaction.objectStore('conversations');
        const convIndex = convStore.index('digitalHumanId');
        
        const convRequest = convIndex.openKeyCursor(IDBKeyRange.only(digitalHumanId));
        
        convRequest.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            convStore.delete(cursor.primaryKey);
            cursor.continue();
          }
        };
        
        // When all transactions complete
        memTransaction.oncomplete = () => {
          convTransaction.oncomplete = () => {
            resolve(true);
          };
          convTransaction.onerror = (event) => {
            reject(new Error(`Conversation clear failed: ${event.target.error}`));
          };
        };
        
        memTransaction.onerror = (event) => {
          reject(new Error(`Memory clear failed: ${event.target.error}`));
        };
      } catch (error) {
        console.error('Error clearing memories:', error);
        reject(error);
      }
    });
  },
  
  /**
   * Format conversation history for LLM context
   * @param {string} digitalHumanId - ID of the digital human
   * @param {Object} options - Formatting options
   * @returns {Promise<Array>} Formatted conversation messages
   */
  formatConversationForLLM: async (digitalHumanId, options = {}) => {
    try {
      // Get recent conversation
      const history = await MemoryAdapter.getConversationHistory(digitalHumanId, {
        limit: options.limit || 10 // Default to last 10 messages
      });
      
      // Format as expected by most LLM APIs (e.g., OpenAI)
      return history.map(msg => ({
        role: msg.role, // 'user' or 'assistant'
        content: msg.content
      }));
    } catch (error) {
      console.error('Error formatting conversation for LLM:', error);
      return [];
    }
  },
  
  /**
   * Extract key information from a conversation to create memories
   * @param {string} digitalHumanId - ID of the digital human
   * @param {number} messageCount - Number of recent messages to analyze
   * @returns {Promise<Array>} Extracted memory candidates
   */
  extractMemoriesFromConversation: async (digitalHumanId, messageCount = 5) => {
    try {
      // Get recent conversation
      const history = await MemoryAdapter.getConversationHistory(digitalHumanId, {
        limit: messageCount
      });
      
      // Simple memory extraction logic (to be replaced with more sophisticated NLP)
      const memoryPatterns = [
        { regex: /my name is (\w+)/i, type: MEMORY_TYPES.FACT, importance: 0.9 },
        { regex: /I (like|love|enjoy|prefer) (.+)/i, type: MEMORY_TYPES.PREFERENCE, importance: 0.7 },
        { regex: /I (hate|dislike|don't like) (.+)/i, type: MEMORY_TYPES.PREFERENCE, importance: 0.7 },
        { regex: /I (feel|am) (happy|sad|angry|excited|worried|nervous)/i, type: MEMORY_TYPES.EMOTION, importance: 0.6 },
        { regex: /I (work as|am) a (.+)/i, type: MEMORY_TYPES.FACT, importance: 0.8 },
        { regex: /my (birthday|anniversary) is (.+)/i, type: MEMORY_TYPES.FACT, importance: 0.9 }
      ];
      
      const memoryPromises = [];
      
      // Only analyze user messages
      const userMessages = history.filter(msg => msg.role === 'user');
      
      userMessages.forEach(message => {
        const content = message.content;
        
        memoryPatterns.forEach(pattern => {
          const match = content.match(pattern.regex);
          if (match) {
            const extractedContent = match[0];
            
            // Create a memory object
            const memory = {
              digitalHumanId,
              content: extractedContent,
              type: pattern.type,
              importance: pattern.importance,
              timestamp: Date.now(),
              metadata: {
                source: 'conversation',
                messageId: message.id
              }
            };
            
            // Store the memory
            memoryPromises.push(MemoryAdapter.storeMemory(memory));
          }
        });
      });
      
      // Wait for all memories to be stored
      const memoryIds = await Promise.all(memoryPromises);
      
      return memoryIds;
    } catch (error) {
      console.error('Error extracting memories from conversation:', error);
      return [];
    }
  }
};

export default MemoryAdapter;