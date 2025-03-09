// uploadsoul/src/services/digitalAvatarAdapter.js
/**
 * Digital Avatar Adapter
 * 
 * This adapter integrates the advanced digital avatar platform capabilities
 * with the existing audioService interface to ensure seamless integration
 * without modifying existing interfaces or overwriting data.
 */

import { apiManager } from '../../../src/api/APIManager';
import { speechRecognitionService } from '../../../src/services/SpeechRecognitionService';
import { dialogueService } from '../../../src/services/DialogueService';
import { speechSynthesisService } from '../../../src/services/SpeechSynthesisService';
import { ConversationContext, EmotionParams } from '../../../src/models/interfaces';

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
        // Convert to File for passing to SpeechRecognitionService
        const audioFile = new File([audioBlob], 'user_recording.webm', { 
          type: 'audio/webm' 
        });
        
        // Use FormData to simulate what our service expects
        const formData = new FormData();
        formData.append('file', audioFile);
        formData.append('model', 'whisper-1');
        
        if (language && language !== 'auto') {
          formData.append('language', language);
        }
        
        // Call OpenAI Whisper API directly for demo purposes
        // In production, this should go through speechRecognitionService properly
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error(`Whisper API error: ${response.status}`);
        }

        const data = await response.json();
        transcription = data.text || '';
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
        const voices = speechSynthesisService.getVoices();
        
        // Use the first available voice or fallback to browser TTS
        const voiceId = voices.length > 0 ? voices[0].id : null;
        
        // Set appropriate emotion based on content
        const emotions = detectEmotionsFromText(dialogueResponse);
        
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
            setTimeout(() => mediaRecorder.stop(), (dialogueResponse.length * 100)); // Estimate duration
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