// src/services/MemoryAdapter.ts
/**
 * MemoryAdapter - Handles storage and retrieval of conversations and memories
 */
import { Memory, MemoryConfig, StorageService, VectorService } from '../models/interfaces';

class MemoryAdapter {
  private storageService: StorageService | null = null;
  private vectorService: VectorService | null = null;
  private config: MemoryConfig;

  constructor() {
    this.config = {
      vectorDb: 'default',
      embeddingModel: 'text-embedding-ada-002',
      maxMemories: 50,
      relevanceThreshold: 0.7
    };
  }

  /**
   * Initialize the memory adapter with storage services
   */
  public initialize(config: MemoryConfig, storageService?: StorageService, vectorService?: VectorService): void {
    this.config = { ...this.config, ...config };
    
    if (storageService) {
      this.storageService = storageService;
    } else {
      // Initialize with localStorage adapter as fallback
      this.storageService = this.createLocalStorageAdapter();
    }

    if (vectorService) {
      this.vectorService = vectorService;
    } else {
      // Initialize with simple in-memory vector storage as fallback
      this.vectorService = this.createInMemoryVectorAdapter();
    }
    
    console.log('Memory Adapter initialized');
  }

  /**
   * Store a new memory
   */
  public async storeMemory(userId: string, content: string, embedding: number[]): Promise<string> {
    if (!this.storageService || !this.vectorService) {
      throw new Error('Memory adapter not initialized');
    }

    try {
      const memory: Memory = {
        id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        content,
        importance: this.calculateImportance(content),
        embedding,
        createdAt: Date.now(),
        lastAccessed: Date.now(),
        accessCount: 0
      };

      // Store memory data
      await this.storageService.set(`memory:${memory.id}`, memory);
      
      // Store vector embedding for similarity search
      await this.vectorService.addVector(memory.id, embedding, {
        userId,
        createdAt: memory.createdAt,
        importance: memory.importance
      });

      // Keep an index of user memories
      const userMemoriesKey = `user:${userId}:memories`;
      const userMemories = await this.storageService.get(userMemoriesKey) || [];
      userMemories.push(memory.id);
      
      // Limit the number of memories stored
      if (userMemories.length > this.config.maxMemories) {
        const toRemove = userMemories.shift();
        if (toRemove) {
          await this.deleteMemory(toRemove);
        }
      }
      
      await this.storageService.set(userMemoriesKey, userMemories);

      return memory.id;
    } catch (error) {
      console.error('Error storing memory:', error);
      throw new Error(`Failed to store memory: ${error}`);
    }
  }

  /**
   * Retrieve memories relevant to a query
   */
  public async retrieveRelevantMemories(query: string, userId: string, limit: number = 5): Promise<Memory[]> {
    if (!this.storageService || !this.vectorService) {
      throw new Error('Memory adapter not initialized');
    }

    try {
      // Get embedding for the query
      const queryEmbedding = await this.generateEmbedding(query);
      
      // Search for similar vectors
      const results = await this.vectorService.searchVector(queryEmbedding, limit);
      
      // Filter by userId and relevance threshold
      const relevantResults = results.filter(
        r => r.score >= this.config.relevanceThreshold
      );
      
      if (relevantResults.length === 0) {
        return [];
      }
      
      // Get the full memory objects
      const memories: Memory[] = [];
      for (const result of relevantResults) {
        const memory = await this.storageService.get(`memory:${result.id}`);
        if (memory) {
          // Update access stats
          memory.accessCount += 1;
          memory.lastAccessed = Date.now();
          await this.storageService.set(`memory:${memory.id}`, memory);
          
          memories.push(memory);
        }
      }
      
      return memories;
    } catch (error) {
      console.error('Error retrieving memories:', error);
      return [];
    }
  }

  /**
   * Update an existing memory
   */
  public async updateMemory(memoryId: string, newContent: string): Promise<boolean> {
    if (!this.storageService || !this.vectorService) {
      throw new Error('Memory adapter not initialized');
    }

    try {
      // Get existing memory
      const memory = await this.storageService.get(`memory:${memoryId}`);
      if (!memory) {
        return false;
      }
      
      // Update content and metadata
      memory.content = newContent;
      memory.importance = this.calculateImportance(newContent);
      
      // Generate new embedding
      const newEmbedding = await this.generateEmbedding(newContent);
      memory.embedding = newEmbedding;
      
      // Update storage
      await this.storageService.set(`memory:${memoryId}`, memory);
      
      // Update vector
      await this.vectorService.updateVector(memoryId, newEmbedding);
      
      return true;
    } catch (error) {
      console.error('Error updating memory:', error);
      return false;
    }
  }

  /**
   * Delete a memory
   */
  private async deleteMemory(memoryId: string): Promise<boolean> {
    if (!this.storageService || !this.vectorService) {
      return false;
    }

    try {
      await this.storageService.delete(`memory:${memoryId}`);
      await this.vectorService.deleteVector(memoryId);
      return true;
    } catch (error) {
      console.error('Error deleting memory:', error);
      return false;
    }
  }

  /**
   * Generate embedding for a text
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      // This is a placeholder. In production, use OpenAI embedding API
      // For now, we'll generate a simple random embedding
      const dimension = 1536; // Match OpenAI's ada-002 dimension
      const embedding = Array.from({ length: dimension }, () => Math.random() * 2 - 1);
      
      // Normalize the embedding
      const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
      return embedding.map(val => val / magnitude);
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error(`Failed to generate embedding: ${error}`);
    }
  }

  /**
   * Calculate importance score for a memory
   */
  private calculateImportance(content: string): number {
    // A simple heuristic - longer content might be more important
    // In a real implementation, this would use more sophisticated analysis
    const length = content.length;
    const hasQuestion = content.includes('?');
    const hasExclamation = content.includes('!');
    
    let importance = Math.min(length / 500, 1); // 0 to 1 based on length
    
    if (hasQuestion) importance += 0.2;
    if (hasExclamation) importance += 0.1;
    
    return Math.min(importance, 1);
  }

  /**
   * Create a simple localStorage-based storage adapter
   */
  private createLocalStorageAdapter(): StorageService {
    return {
      set: async (key: string, value: any): Promise<void> => {
        localStorage.setItem(key, JSON.stringify(value));
      },
      get: async (key: string): Promise<any> => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      },
      delete: async (key: string): Promise<boolean> => {
        localStorage.removeItem(key);
        return true;
      },
      query: async (filters: Record<string, any>): Promise<any[]> => {
        const results: any[] = [];
        // Simple filtering through all localStorage items
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (!key) continue;
          
          try {
            const value = JSON.parse(localStorage.getItem(key) || '{}');
            let matches = true;
            
            // Check if item matches all filters
            for (const [filterKey, filterValue] of Object.entries(filters)) {
              if (value[filterKey] !== filterValue) {
                matches = false;
                break;
              }
            }
            
            if (matches) {
              results.push({ key, value });
            }
          } catch (e) {
            // Not a valid JSON, skip
          }
        }
        return results;
      }
    };
  }

  /**
   * Create a simple in-memory vector storage adapter
   */
  private createInMemoryVectorAdapter(): VectorService {
    const vectors: Map<string, { vector: number[], metadata?: any }> = new Map();
    
    return {
      addVector: async (id: string, vector: number[], metadata?: any): Promise<void> => {
        vectors.set(id, { vector, metadata });
      },
      searchVector: async (searchVector: number[], limit: number = 5): Promise<{ id: string, score: number }[]> => {
        const scores: { id: string, score: number }[] = [];
        
        // Calculate cosine similarity for each vector
        vectors.forEach((data, id) => {
          const similarity = this.cosineSimilarity(searchVector, data.vector);
          scores.push({ id, score: similarity });
        });
        
        // Sort by similarity (highest first) and take top N
        return scores
          .sort((a, b) => b.score - a.score)
          .slice(0, limit);
      },
      updateVector: async (id: string, vector: number[]): Promise<boolean> => {
        if (!vectors.has(id)) return false;
        const metadata = vectors.get(id)?.metadata;
        vectors.set(id, { vector, metadata });
        return true;
      },
      deleteVector: async (id: string): Promise<boolean> => {
        return vectors.delete(id);
      }
    };
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Vectors must be of the same length');
    }
    
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      magnitudeA += a[i] * a[i];
      magnitudeB += b[i] * b[i];
    }
    
    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);
    
    return dotProduct / (magnitudeA * magnitudeB);
  }
}

// Export singleton instance
export const memoryAdapter = new MemoryAdapter();