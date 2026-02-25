// src/services/DialogueService.ts
/**
 * DialogueService - Handles dialogue generation using GPT-4/3.5
 */
import { apiManager } from '../api/APIManager';
import { ConversationContext, ModelConfig } from '../models/interfaces';

class DialogueService {
  private apiManager = apiManager;
  private modelConfig: ModelConfig = {
    primaryModel: 'gpt-4',
    fallbackModel: 'gpt-3.5-turbo',
    systemPrompt: 'You are a helpful digital avatar assistant. Keep responses concise and engaging.',
    temperature: 0.7,
    maxTokens: 1024
  };
  private responseLanguage: string = 'en';

  /**
   * Initialize the dialogue service
   */
  public initialize(config: ModelConfig): void {
    this.modelConfig = {
      primaryModel: config.primaryModel || 'gpt-4',
      fallbackModel: config.fallbackModel || 'gpt-3.5-turbo',
      systemPrompt: config.systemPrompt || this.getDefaultSystemPrompt(),
      temperature: config.temperature || 0.7,
      maxTokens: config.maxTokens || 1024
    };
    console.log('Dialogue Service initialized');
  }

  /**
   * Generate a response to user input
   */
  public async generateResponse(
    input: string, 
    context: ConversationContext
  ): Promise<string> {
    try {
      // Determine which model to use based on context complexity
      const modelToUse = this.shouldUsePrimaryModel(input, context) ? 
        this.modelConfig.primaryModel : 
        this.modelConfig.fallbackModel;
      
      // Format the message history for the API
      const formattedMessages = this.formatMessagesForAPI(input, context);
      
      // Add language instruction if different from English
      const systemMessage = this.responseLanguage !== 'en' ? 
        `${this.modelConfig.systemPrompt} Respond in ${this.getLanguageName(this.responseLanguage)}.` : 
        this.modelConfig.systemPrompt;
        
      // Prepare the request body
      const requestBody = {
        model: modelToUse,
        messages: [
          { role: 'system', content: systemMessage },
          ...formattedMessages
        ],
        temperature: this.modelConfig.temperature,
        max_tokens: this.modelConfig.maxTokens,
        user: context.userProfile?.id || 'anonymous'
      };
      
      // Call OpenAI API
      const response = await this.apiManager.callAPI('openai', '/chat/completions', {
        body: requestBody
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating dialogue response:', error);
      // Try fallback model if primary model failed
      if (this.modelConfig.primaryModel !== this.modelConfig.fallbackModel &&
          this.shouldUsePrimaryModel(input, context)) {
        console.log('Falling back to secondary model');
        const modifiedContext = { ...context, forceFallbackModel: true };
        return this.generateResponse(input, modifiedContext);
      }
      throw error;
    }
  }

  /**
   * Stream response generation for real-time display
   */
  public async* streamResponse(
    input: string, 
    context: ConversationContext
  ): AsyncIterableIterator<string> {
    try {
      // Determine which model to use based on context complexity
      const modelToUse = this.shouldUsePrimaryModel(input, context) ? 
        this.modelConfig.primaryModel : 
        this.modelConfig.fallbackModel;
      
      // Format the message history for the API
      const formattedMessages = this.formatMessagesForAPI(input, context);
      
      // Add language instruction if different from English
      const systemMessage = this.responseLanguage !== 'en' ? 
        `${this.modelConfig.systemPrompt} Respond in ${this.getLanguageName(this.responseLanguage)}.` : 
        this.modelConfig.systemPrompt;
        
      // Prepare the request body
      const requestBody = {
        model: modelToUse,
        messages: [
          { role: 'system', content: systemMessage },
          ...formattedMessages
        ],
        temperature: this.modelConfig.temperature,
        max_tokens: this.modelConfig.maxTokens,
        stream: true,
        user: context.userProfile?.id || 'anonymous'
      };
      
      // Call OpenAI API with streaming
      const stream = await this.apiManager.streamAPI('openai', '/chat/completions', {
        body: requestBody
      });
      
      // Process the stream
      const reader = stream.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Decode the chunk and append to buffer
        const chunk = decoder.decode(value);
        buffer += chunk;
        
        // Find complete data lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.trim() === '') continue;
          if (line.trim() === 'data: [DONE]') continue;
          
          try {
            // Remove 'data: ' prefix and parse JSON
            const jsonString = line.replace(/^data: /, '').trim();
            if (!jsonString) continue;
            
            const json = JSON.parse(jsonString);
            const content = json.choices[0]?.delta?.content;
            
            if (content) {
              yield content;
            }
          } catch (e) {
            console.warn('Error parsing stream chunk:', e);
          }
        }
      }
    } catch (error) {
      console.error('Error streaming dialogue response:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      yield `Sorry, I encountered an error while processing your request. ${errorMessage}`;
    }
  }

  /**
   * Set the language for responses
   */
  public setResponseLanguage(language: string): void {
    this.responseLanguage = language;
  }

  /**
   * Format conversation messages for the API
   */
  private formatMessagesForAPI(input: string, context: ConversationContext): any[] {
    // Include conversation history
    const messages = context.history.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Add relevant memories as context if available
    if (context.relevantMemories && context.relevantMemories.length > 0) {
      const memoryContent = context.relevantMemories
        .map(memory => memory.content)
        .join('\n\n');
      
      // Use assistant role instead of system for memory context
      messages.unshift({
        role: 'assistant' as const,
        content: `Relevant context from previous conversations: ${memoryContent}`
      });
    }
    
    // Add the current user input
    messages.push({
      role: 'user' as const,
      content: input
    });
    
    return messages;
  }

  /**
   * Determine whether to use the primary model based on input complexity
   */
  private shouldUsePrimaryModel(input: string, context: ConversationContext): boolean {
    // If forceFallbackModel is set, use fallback model
    if (context.forceFallbackModel) {
      return false;
    }
    
    // Use primary model for longer conversations
    if (context.history && context.history.length > 5) {
      return true;
    }
    
    // Use primary model for longer inputs
    if (input.length > 100) {
      return true;
    }
    
    // Use primary model if relevant memories are available
    if (context.relevantMemories && context.relevantMemories.length > 0) {
      return true;
    }
    
    // Default to fallback model for simple interactions
    return false;
  }
  
  /**
   * Get default system prompt for the AI
   */
  private getDefaultSystemPrompt(): string {
    return `You are a helpful digital avatar assistant. Your responses should be conversational, 
    helpful, and engaging. You should maintain a consistent personality throughout the conversation.
    If you are asked a question that you don't have enough information to answer accurately,
    acknowledge that limitation rather than making up information.`;
  }
  
  /**
   * Get the full language name from language code
   */
  private getLanguageName(langCode: string): string {
    const languageMap: Record<string, string> = {
      'en': 'English',
      'zh': 'Chinese',
      'fr': 'French',
      'de': 'German',
      'ja': 'Japanese',
      'ko': 'Korean',
      'es': 'Spanish',
      'it': 'Italian',
      'ru': 'Russian',
      'pt': 'Portuguese',
      'ar': 'Arabic',
      'hi': 'Hindi'
    };
    
    return languageMap[langCode] || langCode;
  }
}

// Export singleton instance
export const dialogueService = new DialogueService();