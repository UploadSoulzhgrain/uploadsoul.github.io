// src/App.tsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './components/LanguageSelector';

// Import service instances
import { apiManager } from './api/APIManager';
import { speechRecognitionService } from './services/SpeechRecognitionService';
import { dialogueService } from './services/DialogueService';
import { speechSynthesisService } from './services/SpeechSynthesisService';

const App: React.FC = () => {
  const { t } = useTranslation(['common']);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  
  // Initialize services when app loads
  useEffect(() => {
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
        
        setInitialized(true);
      } catch (error) {
        console.error('Error initializing services:', error);
      }
    };
    
    initializeServices();
  }, []);
  
  // Toggle listening state
  const toggleListening = async () => {
    try {
      if (isListening) {
        setIsLoading(true);
        const text = await speechRecognitionService.stopListening();
        setTranscript(text);
        setIsListening(false);
        
        if (text) {
          // Process the transcript with dialogue service
          const dialogueResponse = await dialogueService.generateResponse(text, {
            history: [], // In a real app, maintain conversation history
            relevantMemories: [],
            userProfile: {
              id: 'demo-user',
              name: 'Demo User',
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
          
          setResponse(dialogueResponse);
        }
        setIsLoading(false);
      } else {
        await speechRecognitionService.startListening();
        setIsListening(true);
        setTranscript('');
        setResponse('');
      }
    } catch (error) {
      console.error('Error toggling listening:', error);
      setIsListening(false);
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {t('appTitle')}
          </h1>
          <LanguageSelector />
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('welcome')}
          </h2>
          <p className="text-lg text-gray-600">
            This is a demo of the Digital Avatar Platform with multilingual support.
          </p>
        </div>
        
        <div className="bg-white shadow sm:rounded-lg p-6 mb-8">
          <div className="mb-6 text-center">
            <button
              onClick={toggleListening}
              disabled={!initialized || isLoading}
              className={`px-6 py-3 rounded-full text-white font-medium text-lg transition-colors ${
                isListening
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              } ${(!initialized || isLoading) && 'opacity-50 cursor-not-allowed'}`}
            >
              {isListening ? t('speech.stopListening') : t('speech.startListening')}
            </button>
          </div>
          
          {isLoading && (
            <div className="text-center text-gray-500 italic">
              {t('speech.transcribing')}
            </div>
          )}
          
          {transcript && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">You said:</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                {transcript}
              </div>
            </div>
          )}
          
          {response && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Avatar response:</h3>
              <div className="bg-blue-50 p-4 rounded-md">
                {response}
              </div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Speech Recognition</h3>
            <p className="text-gray-600 mb-4">
              Using OpenAI Whisper API for accurate speech-to-text conversion with multilingual support.
            </p>
            <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors">
              {t('actions.start')}
            </button>
          </div>
          
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Dialogue Generation</h3>
            <p className="text-gray-600 mb-4">
              Powered by GPT-4 and GPT-3.5 Turbo to provide intelligent and contextual responses in multiple languages.
            </p>
            <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors">
              {t('actions.create')}
            </button>
          </div>
          
          <div className="bg-white shadow sm:rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Voice Synthesis</h3>
            <p className="text-gray-600 mb-4">
              Using ElevenLabs for high-quality text-to-speech and voice cloning capabilities.
            </p>
            <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors">
              {t('actions.upload')}
            </button>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; 2023 Digital Avatar Platform</p>
            </div>
            <div className="flex space-x-4">
              <a href="/privacy" className="hover:text-gray-300 transition-colors">{t('footer.privacy')}</a>
              <a href="/terms" className="hover:text-gray-300 transition-colors">{t('footer.terms')}</a>
              <a href="/help" className="hover:text-gray-300 transition-colors">{t('footer.help')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;