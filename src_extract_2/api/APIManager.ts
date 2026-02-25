// src/api/APIManager.ts
/**
 * APIManager - Core class for handling API calls to various services
 */

import { APIConfig } from '../models/interfaces';

class APIManager {
  private apiKeys: Record<string, string> = {};
  private endpoints: Record<string, string> = {};
  private timeouts: Record<string, number> = {
    openai: 60000,     // 60 seconds
    elevenlabs: 30000, // 30 seconds
    synclabs: 90000    // 90 seconds
  };

  /**
   * Initialize the API Manager with configuration
   */
  public initialize(config: APIConfig): void {
    this.apiKeys = { ...this.apiKeys, ...config.keys };
    this.endpoints = { ...this.endpoints, ...config.endpoints };
    this.timeouts = { ...this.timeouts, ...config.timeouts };
    console.log('API Manager initialized');
  }

  /**
   * Make an API call to a specified service
   */
  public async callAPI(
    service: string,
    path: string,
    options: {
      method?: string;
      headers?: Record<string, string>;
      body?: any;
      queryParams?: Record<string, string>;
    } = {}
  ): Promise<any> {
    // Check if service is configured
    if (!this.endpoints[service]) {
      throw new Error(`Service ${service} is not configured`);
    }

    // Get base URL for the service
    const baseUrl = this.endpoints[service];
    
    // Build full URL with query parameters
    let url = `${baseUrl}${path}`;
    if (options.queryParams) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(options.queryParams)) {
        params.append(key, value);
      }
      url += `?${params.toString()}`;
    }

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers || {}
    };

    // Add API key header based on service
    if (this.apiKeys[service]) {
      switch (service) {
        case 'openai':
          headers['Authorization'] = `Bearer ${this.apiKeys[service]}`;
          break;
        case 'elevenlabs':
          headers['xi-api-key'] = this.apiKeys[service];
          break;
        case 'synclabs':
          headers['x-api-key'] = this.apiKeys[service];
          break;
        default:
          headers['Authorization'] = `Bearer ${this.apiKeys[service]}`;
      }
    }

    // Prepare request body
    const body = options.body ? JSON.stringify(options.body) : undefined;

    // Set up timeout
    const timeout = this.timeouts[service] || 30000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // Make the API call
      const response = await fetch(url, {
        method: options.method || 'POST',
        headers,
        body,
        signal: controller.signal
      });

      // Clear timeout
      clearTimeout(timeoutId);

      // Handle response based on content type
      const contentType = response.headers.get('content-type');
      
      if (!response.ok) {
        let errorData;
        if (contentType?.includes('application/json')) {
          errorData = await response.json();
        } else {
          errorData = await response.text();
        }
        throw new Error(`API Error (${response.status}): ${JSON.stringify(errorData)}`);
      }

      if (contentType?.includes('application/json')) {
        return await response.json();
      } else if (contentType?.includes('audio/')) {
        return await response.arrayBuffer();
      } else {
        return await response.text();
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(`API request to ${service} timed out after ${timeout}ms`);
      }
      throw error;
    }
  }

  /**
   * Make a streaming API call to a specified service
   */
  public async streamAPI(
    service: string,
    path: string,
    options: {
      method?: string;
      headers?: Record<string, string>;
      body?: any;
      queryParams?: Record<string, string>;
    } = {}
  ): Promise<ReadableStream> {
    // Check if service is configured
    if (!this.endpoints[service]) {
      throw new Error(`Service ${service} is not configured`);
    }

    // Get base URL for the service
    const baseUrl = this.endpoints[service];
    
    // Build full URL with query parameters
    let url = `${baseUrl}${path}`;
    if (options.queryParams) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(options.queryParams)) {
        params.append(key, value);
      }
      url += `?${params.toString()}`;
    }

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers || {}
    };

    // Add API key header based on service
    if (this.apiKeys[service]) {
      switch (service) {
        case 'openai':
          headers['Authorization'] = `Bearer ${this.apiKeys[service]}`;
          break;
        case 'elevenlabs':
          headers['xi-api-key'] = this.apiKeys[service];
          break;
        case 'synclabs':
          headers['x-api-key'] = this.apiKeys[service];
          break;
        default:
          headers['Authorization'] = `Bearer ${this.apiKeys[service]}`;
      }
    }

    // Prepare request body
    const body = options.body ? JSON.stringify(options.body) : undefined;

    // Set up timeout
    const timeout = this.timeouts[service] || 30000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // Make the API call
      const response = await fetch(url, {
        method: options.method || 'POST',
        headers,
        body,
        signal: controller.signal
      });

      // Clear timeout
      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = await response.text();
        }
        throw new Error(`API Error (${response.status}): ${JSON.stringify(errorData)}`);
      }

      // Return the stream for the caller to process
      return response.body as ReadableStream;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error(`API request to ${service} timed out after ${timeout}ms`);
      }
      throw error;
    }
  }

  /**
   * Set API key for a service
   */
  public setApiKey(service: string, key: string): void {
    this.apiKeys[service] = key;
  }

  /**
   * Set endpoint for a service
   */
  public setEndpoint(service: string, endpoint: string): void {
    this.endpoints[service] = endpoint;
  }

  /**
   * Set timeout for a service
   */
  public setTimeout(service: string, timeoutMs: number): void {
    this.timeouts[service] = timeoutMs;
  }
}

// Export singleton instance
export const apiManager = new APIManager();