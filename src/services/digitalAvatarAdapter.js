// uploadsoul/src/services/digitalAvatarAdapter.js
/**
 * Digital Avatar Adapter
 * 
 * This adapter integrates the advanced digital avatar platform capabilities
 * with the existing audioService interface to ensure seamless integration
 * without modifying existing interfaces or overwriting data.
 */

// Import dependencies needed for API integration

// API Manager handles authentication and API key management
const apiManager = {
  config: {
    keys: {
      openai: '',
      elevenlabs: ''
    },
    endpoints: {
      openai: 'https://api.openai.com/v1',
      elevenlabs: 'https://api.elevenlabs.io/v1'
    },
    timeouts: {
      openai: 60000,
      elevenlabs: 30000
    }
  },
  initialize: (config) => {
    apiManager.config = {
      ...apiManager.config,
      ...config
    };
    console.log('API Manager initialized with config');
    return true;
  },
  getAuthHeaders: (service) => {
    switch(service) {
      case 'openai':
        return {
          'Authorization': `Bearer ${apiManager.config.keys.openai}`,
          'Content-Type': 'application/json'
        };
      case 'elevenlabs':
        return {
          'xi-api-key': apiManager.config.keys.elevenlabs,
          'Content-Type': 'application/json'
        };
      default:
        return {'Content-Type': 'application/json'};
    }
  }
};

// Speech Recognition Service with Whisper API integration
const speechRecognitionService = {
  config: {
    language: 'auto',
    model: 'whisper-1',
    options: {
      vadSensitivity: 0.5,
      filterProfanity: false
    }
  },
  initialize: (config) => {
    speechRecognitionService.config = {
      ...speechRecognitionService.config,
      ...config
    };
    console.log('Speech Recognition Service initialized');
    return true;
  },
  transcribeAudio: async (audioBlob, language = 'auto') => {
    try {
      // If we have a valid OpenAI API key
      if (apiManager.config.keys.openai) {
        // Convert audio blob to file
        const audioFile = new File([audioBlob], 'recording.webm', { 
          type: 'audio/webm' 
        });
        
        // Create form data for the API request
        const formData = new FormData();
        formData.append('file', audioFile);
        formData.append('model', speechRecognitionService.config.model);
        
        if (language && language !== 'auto') {
          formData.append('language', language);
        }
        
        // Make the API request to OpenAI's Whisper API
        const response = await fetch(`${apiManager.config.endpoints.openai}/audio/transcriptions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiManager.config.keys.openai}`
            // Don't set Content-Type as it's set automatically for FormData
          },
          body: formData,
          signal: AbortSignal.timeout(apiManager.config.timeouts.openai)
        });
        
        if (!response.ok) {
          throw new Error(`Whisper API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.text || '';
      } else {
        // Fallback to Web Speech API if available
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
          return new Promise((resolve) => {
            // Simulate a short delay and return a placeholder response
            setTimeout(() => {
              resolve("I couldn't transcribe your speech due to missing API key. Please provide what you said in text form.");
            }, 1000);
          });
        } else {
          return "Your browser doesn't support speech recognition. Please enable API integration.";
        }
      }
    } catch (error) {
      console.error('Error in speech recognition:', error);
      return "I couldn't understand what you said. Could you try again?";
    }
  }
};

// Dialogue Service with OpenAI GPT integration
const dialogueService = {
  config: {
    primaryModel: 'gpt-4',
    fallbackModel: 'gpt-3.5-turbo',
    systemPrompt: 'You are a helpful digital avatar assistant representing a specific person. Keep responses concise, engaging, and in character with your assigned personality. Respond with empathy and personal warmth.',
    temperature: 0.7,
    maxTokens: 512
  },
  initialize: (config) => {
    dialogueService.config = {
      ...dialogueService.config,
      ...config
    };
    console.log('Dialogue Service initialized');
    return true;
  },
  generateResponse: async (text, context) => {
    try {
      // If we have a valid OpenAI API key
      if (apiManager.config.keys.openai) {
        // Format conversation history for context
        const messages = [];
        
        // Add system prompt with personality if available
        let systemPrompt = dialogueService.config.systemPrompt;
        if (context?.avatarPersonality?.background) {
          systemPrompt += ` Your background: ${context.avatarPersonality.background}`;
        }
        messages.push({ role: 'system', content: systemPrompt });
        
        // Add conversation history if available (last 10 messages for context)
        if (context?.history && Array.isArray(context.history)) {
          context.history.slice(-10).forEach(msg => {
            messages.push({
              role: msg.role === 'user' ? 'user' : 'assistant',
              content: msg.content
            });
          });
        } else {
          // If no history, just add the current message
          messages.push({ role: 'user', content: text });
        }
        
        // If not already included in history, add the current message
        if (context?.history && context.history.length > 0 && 
            context.history[context.history.length - 1].role !== 'user') {
          messages.push({ role: 'user', content: text });
        }
        
        // Make the API request to OpenAI's Chat API
        const response = await fetch(`${apiManager.config.endpoints.openai}/chat/completions`, {
          method: 'POST',
          headers: apiManager.getAuthHeaders('openai'),
          body: JSON.stringify({
            model: dialogueService.config.primaryModel,
            messages: messages,
            temperature: dialogueService.config.temperature,
            max_tokens: dialogueService.config.maxTokens
          }),
          signal: AbortSignal.timeout(apiManager.config.timeouts.openai)
        });
        
        if (!response.ok) {
          // Try fallback model if primary fails
          if (dialogueService.config.primaryModel !== dialogueService.config.fallbackModel) {
            console.warn(`Primary model failed, trying fallback model ${dialogueService.config.fallbackModel}`);
            const fallbackResponse = await fetch(`${apiManager.config.endpoints.openai}/chat/completions`, {
              method: 'POST',
              headers: apiManager.getAuthHeaders('openai'),
              body: JSON.stringify({
                model: dialogueService.config.fallbackModel,
                messages: messages,
                temperature: dialogueService.config.temperature,
                max_tokens: dialogueService.config.maxTokens
              }),
              signal: AbortSignal.timeout(apiManager.config.timeouts.openai)
            });
            
            if (fallbackResponse.ok) {
              const data = await fallbackResponse.json();
              return data.choices[0].message.content;
            }
          }
          
          throw new Error(`OpenAI API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
      } else {
        // Fallback to simple rule-based responses if no API key
        console.log('No API key available. Using rule-based fallback.');
        if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
          return 'Hello! It\'s nice to talk with you today.';
        }
        if (text.toLowerCase().includes('how are you')) {
          return 'I\'m doing well, thank you for asking. How are you feeling today?';
        }
        if (text.toLowerCase().includes('name')) {
          return context?.avatarPersonality?.name ? 
            `My name is ${context.avatarPersonality.name}. It's wonderful to chat with you.` : 
            'I\'m your digital companion. I\'m here to chat with you and keep you company.';
        }
        
        // Default response
        return 'That\'s interesting! Tell me more about what\'s on your mind.';
      }
    } catch (error) {
      console.error('Error in dialogue generation:', error);
      return "I'm having trouble thinking clearly at the moment. Could we try again in a moment?";
    }
  }
};

// Speech Synthesis Service with ElevenLabs API integration
const speechSynthesisService = {
  config: {
    defaultVoiceId: 'premade/adam',
    stability: 0.5,
    similarityBoost: 0.75,
    style: 0,
    useSpeakerBoost: true
  },
  cachedVoices: null,
  initialize: async (config) => {
    speechSynthesisService.config = {
      ...speechSynthesisService.config,
      ...config
    };
    console.log('Speech Synthesis Service initialized');
    return true;
  },
  getVoices: async (forceRefresh = false) => {
    try {
      // Return cached voices if available and not forcing refresh
      if (speechSynthesisService.cachedVoices && !forceRefresh) {
        return speechSynthesisService.cachedVoices;
      }
      
      // If we have a valid ElevenLabs API key
      if (apiManager.config.keys.elevenlabs) {
        // Fetch voices from ElevenLabs API
        const response = await fetch(`${apiManager.config.endpoints.elevenlabs}/voices`, {
          method: 'GET',
          headers: apiManager.getAuthHeaders('elevenlabs'),
          signal: AbortSignal.timeout(apiManager.config.timeouts.elevenlabs)
        });
        
        if (!response.ok) {
          throw new Error(`ElevenLabs API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Format and cache the voices
        const voices = data.voices.map(voice => ({
          id: voice.voice_id,
          name: voice.name,
          gender: voice.labels?.gender || 'neutral',
          preview: voice.preview_url
        }));
        
        speechSynthesisService.cachedVoices = voices;
        return voices;
      } else {
        // Return default voices if no API key
        const defaultVoices = [
          { id: 'premade/adam', name: 'Adam', gender: 'male' },
          { id: 'premade/rachel', name: 'Rachel', gender: 'female' },
          { id: 'premade/antoni', name: 'Antoni', gender: 'male' },
          { id: 'premade/elli', name: 'Elli', gender: 'female' }
        ];
        speechSynthesisService.cachedVoices = defaultVoices;
        return defaultVoices;
      }
    } catch (error) {
      console.error('Error getting voices:', error);
      return [
        { id: 'premade/adam', name: 'Adam', gender: 'male' },
        { id: 'premade/rachel', name: 'Rachel', gender: 'female' }
      ];
    }
  },
  synthesizeSpeech: async (text, voiceId, emotions = {}) => {
    try {
      // If we have a valid ElevenLabs API key
      if (apiManager.config.keys.elevenlabs && text) {
        const voice = voiceId || speechSynthesisService.config.defaultVoiceId;
        
        // Apply emotion settings to voice parameters
        let stability = speechSynthesisService.config.stability;
        let similarityBoost = speechSynthesisService.config.similarityBoost;
        
        if (emotions) {
          // Adjust parameters based on emotions
          if (emotions.emphasis > 0.5) stability -= 0.1;
          if (emotions.joy > 0.5) similarityBoost += 0.1;
          if (emotions.sadness > 0.5) stability += 0.1;
          
          // Keep values in valid range
          stability = Math.max(0, Math.min(1, stability));
          similarityBoost = Math.max(0, Math.min(1, similarityBoost));
        }
        
        // Prepare request body
        const requestBody = {
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: stability,
            similarity_boost: similarityBoost,
            style: speechSynthesisService.config.style,
            use_speaker_boost: speechSynthesisService.config.useSpeakerBoost
          }
        };
        
        // Make request to ElevenLabs API
        const response = await fetch(`${apiManager.config.endpoints.elevenlabs}/text-to-speech/${voice}`, {
          method: 'POST',
          headers: apiManager.getAuthHeaders('elevenlabs'),
          body: JSON.stringify(requestBody),
          signal: AbortSignal.timeout(apiManager.config.timeouts.elevenlabs)
        });
        
        if (!response.ok) {
          throw new Error(`ElevenLabs API error: ${response.status}`);
        }
        
        // Get audio data
        const audioArrayBuffer = await response.arrayBuffer();
        
        // Convert to audio buffer for processing
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(audioArrayBuffer);
        
        return audioBuffer;
      } else {
        // Use browser's speech synthesis as fallback
        console.warn('No ElevenLabs API key. Using browser speech synthesis.');
        
        // Return simple empty buffer to trigger browser TTS fallback
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        return audioContext.createBuffer(1, 1, 22050);
      }
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      
      // Return empty buffer to trigger fallback
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      return audioContext.createBuffer(1, 1, 22050);
    }
  }
};

// Simple conversation context interface
class ConversationContext {
  constructor() {
    this.history = [];
    this.userProfile = {};
  }
}

// Emotion parameters interface
class EmotionParams {
  constructor() {
    this.joy = 0;
    this.sadness = 0;
    this.anger = 0;
    this.surprise = 0;
    this.emphasis = 0;
  }
}

// Maintains state for each digital human conversation
const conversationState = new Map();

/**
 * Initialize the required Digital Avatar services
 */
const initializeServices = async () => {
  try {
    // Initialize API Manager
    apiManager.initialize({
      keys: {
        openai: process.env.REACT_APP_OPENAI_API_KEY || '',
        elevenlabs: process.env.REACT_APP_ELEVENLABS_API_KEY || ''
      },
      endpoints: {
        openai: 'https://api.openai.com/v1',
        elevenlabs: 'https://api.elevenlabs.io'
      },
      timeouts: {
        openai: 60000, // 60s timeout for OpenAI
        elevenlabs: 30000 // 30s timeout for ElevenLabs
      }
    });
    
    // Initialize Speech Recognition Service
    speechRecognitionService.initialize({
      language: 'auto',
      model: 'whisper-1',
      options: {
        vadSensitivity: 0.5,
        filterProfanity: false
      }
    });
    
    // Initialize Dialogue Service
    dialogueService.initialize({
      primaryModel: 'gpt-4',
      fallbackModel: 'gpt-3.5-turbo',
      systemPrompt: 'You are a helpful digital avatar assistant. Keep responses concise and engaging.',
      temperature: 0.7,
      maxTokens: 512
    });
    
    // Initialize Speech Synthesis Service
    await speechSynthesisService.initialize({
      defaultVoiceId: '', // Will be set after loading voices
      stability: 0.5,
      similarityBoost: 0.75,
      style: 0,
      useSpeakerBoost: true
    });

    return true;
  } catch (error) {
    console.error('Error initializing Digital Avatar services:', error);
    return false;
  }
};

/**
 * Get or initialize conversation state for a digital human
 */
const getConversationContext = (digitalHumanId) => {
  if (!conversationState.has(digitalHumanId)) {
    conversationState.set(digitalHumanId, {
      history: [],
      relevantMemories: [],
      userProfile: {
        id: `user-${digitalHumanId}`,
        name: 'User',
        preferences: {
          language: 'en',
          theme: 'light',
          notifications: false,
          voiceInteraction: true,
          avatarPreferences: {}
        },
        interactionHistory: []
      },
      avatarPersonality: {
        traits: {},
        background: '',
        interests: [],
        communication: {
          formality: 0.5,
          humor: 0.5,
          empathy: 0.8
        }
      }
    });
  }
  
  return conversationState.get(digitalHumanId);
};

/**
 * Update conversation history with new messages
 */
const updateConversationHistory = (digitalHumanId, role, content) => {
  const context = getConversationContext(digitalHumanId);
  
  context.history.push({
    id: `msg-${Date.now()}`,
    role: role,
    content: content,
    timestamp: Date.now(),
    language: 'en'
  });
  
  // Limit history size to prevent context length issues
  if (context.history.length > 50) {
    context.history = context.history.slice(context.history.length - 50);
  }
};

/**
 * Enhanced audioService adapter that integrates with Digital Avatar platform
 */
const digitalAvatarAdapter = {
  /**
   * Initialize the adapter
   */
  initialize: async () => {
    const success = await initializeServices();
    if (success) {
      console.log('Digital Avatar Adapter initialized successfully');
    } else {
      console.warn('Digital Avatar Adapter initialization failed, falling back to default behavior');
    }
    return success;
  },
  
  /**
   * Enhanced audio processing that integrates with our digital avatar platform
   * This maintains the same interface as the original audioService.processAudio
   */
  processAudio: async (audioBlob, options = {}) => {
    try {
      const { digitalHumanId = 'default', language = 'en' } = options;
      
      // Step 1: Transcribe audio using our advanced speech recognition
      let transcription = '';
      try {
        // Transcribe audio using the enhanced speech recognition service
        transcription = await speechRecognitionService.transcribeAudio(audioBlob, language);
        console.log('Transcription result:', transcription);
      } catch (error) {
        console.error('Error in speech recognition:', error);
        transcription = 'I couldn\'t understand what you said.';
      }
      
      // Step 2: Generate dialogue response using our dialogue service
      let dialogueResponse = '';
      try {
        // Get conversation context
        const context = getConversationContext(digitalHumanId);
        
        // Add user message to history
        updateConversationHistory(digitalHumanId, 'user', transcription);
        
        // Generate response using our dialogue service
        dialogueResponse = await dialogueService.generateResponse(transcription, context);
        console.log('Dialogue response:', dialogueResponse);
        
        // Add AI response to history
        updateConversationHistory(digitalHumanId, 'assistant', dialogueResponse);
      } catch (error) {
        console.error('Error generating dialogue:', error);
        dialogueResponse = 'Sorry, I encountered an issue while processing your request.';
      }
      
      // Step 3: Generate speech from text using our speech synthesis service
      let audioUrl = null;
      try {
        // Get available voices
        const voices = await speechSynthesisService.getVoices();
        
        // Try to find a voice matching the digital human's preferences
        let voiceId = null;
        const context = getConversationContext(digitalHumanId);
        
        if (context?.avatarPersonality?.voiceId) {
          // If the digital human has a preferred voice, use it
          voiceId = context.avatarPersonality.voiceId;
        } else {
          // Otherwise use the first available voice
          voiceId = voices.length > 0 ? voices[0].id : null;
        }
        
        // Set appropriate emotion based on content
        const emotions = digitalAvatarAdapter.detectEmotionsFromText(dialogueResponse);
        
        if (voiceId) {
          // Generate speech using our service
          const audioBuffer = await speechSynthesisService.synthesizeSpeech(
            dialogueResponse,
            voiceId,
            emotions
          );
          
          // Convert AudioBuffer to Blob
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const audioSource = audioContext.createBufferSource();
          audioSource.buffer = audioBuffer;
          
          const destination = audioContext.createMediaStreamDestination();
          audioSource.connect(destination);
          audioSource.start(0);
          
          const mediaRecorder = new MediaRecorder(destination.stream);
          const audioChunks = [];
          
          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              audioChunks.push(event.data);
            }
          };
          
          const audioData = await new Promise((resolve) => {
            mediaRecorder.onstop = () => {
              const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
              resolve(audioBlob);
            };
            
            mediaRecorder.start();
            setTimeout(() => mediaRecorder.stop(), Math.max(1500, dialogueResponse.length * 80)); // Estimate duration
          });
          
          // Create URL for playback
          audioUrl = URL.createObjectURL(audioData);
        }
      } catch (error) {
        console.error('Error in speech synthesis:', error);
        // Fallback to null, the VoiceChat component will use browser's TTS
      }
      
      // Return in the format expected by the original audioService
      return {
        success: true,
        text: dialogueResponse,
        transcription: transcription, // Include transcription for showing what the user said
        audioUrl: audioUrl
      };
    } catch (error) {
      console.error('Error processing audio with Digital Avatar platform:', error);
      
      // Return a fallback response to prevent breaking the UI
      return {
        success: false,
        text: 'I\'m having trouble connecting right now. Please try again in a moment.',
        audioUrl: null
      };
    }
  },
  
  /**
   * Enhanced version of getVoiceModels that integrates with our voice system
   */
  getVoiceModels: async (digitalHumanId = null) => {
    try {
      // Get voices from our speech synthesis service
      const voices = speechSynthesisService.getVoices();
      
      // Format them to match the expected format in audioService
      return voices.map(voice => ({
        id: voice.id,
        name: voice.name,
        gender: voice.gender || 'neutral'
      }));
    } catch (error) {
      console.error('Error getting voice models from Digital Avatar platform:', error);
      
      // Return default voices as fallback
      return [
        { id: 'demo-1', name: 'Default Voice', gender: 'female' },
        { id: 'demo-2', name: 'Male Voice', gender: 'male' }
      ];
    }
  },
  
  /**
   * Utility function to detect emotions from text for speech synthesis
   */
  detectEmotionsFromText: (text) => {
    // This is a simple rule-based emotion detection
    // In a production system, this would use a more sophisticated NLP approach
    const emotions = {
      joy: 0,
      sadness: 0,
      anger: 0,
      surprise: 0,
      emphasis: 0
    };
    
    const lowerText = text.toLowerCase();
    
    // Joy detection
    if (lowerText.includes('happy') || lowerText.includes('glad') || 
        lowerText.includes('great') || lowerText.includes('wonderful') ||
        lowerText.includes('excellent') || lowerText.includes('😊') ||
        lowerText.includes('😄') || lowerText.includes('joy')) {
      emotions.joy = 0.8;
    }
    
    // Sadness detection
    if (lowerText.includes('sad') || lowerText.includes('sorry') || 
        lowerText.includes('unfortunate') || lowerText.includes('regret') ||
        lowerText.includes('unhappy') || lowerText.includes('😢') ||
        lowerText.includes('😔')) {
      emotions.sadness = 0.8;
    }
    
    // Anger detection
    if (lowerText.includes('angry') || lowerText.includes('upset') || 
        lowerText.includes('frustrat') || lowerText.includes('annoy') ||
        lowerText.includes('mad') || lowerText.includes('😠') ||
        lowerText.includes('😡')) {
      emotions.anger = 0.8;
    }
    
    // Surprise detection
    if (lowerText.includes('wow') || lowerText.includes('amazing') || 
        lowerText.includes('surpris') || lowerText.includes('unbelievable') ||
        lowerText.includes('incredible') || lowerText.includes('😮') ||
        lowerText.includes('😲')) {
      emotions.surprise = 0.8;
    }
    
    // Emphasis detection (for important information)
    if (lowerText.includes('important') || lowerText.includes('critical') || 
        lowerText.includes('essential') || lowerText.includes('crucial') ||
        lowerText.includes('key') || lowerText.includes('vital') ||
        lowerText.includes('!')) {
      emotions.emphasis = 0.8;
    }
    
    return emotions;
  }
};

export default digitalAvatarAdapter;