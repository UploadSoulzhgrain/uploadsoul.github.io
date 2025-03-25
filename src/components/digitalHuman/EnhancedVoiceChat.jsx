import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import audioService from '../../services/audioService';
import digitalAvatarAdapter from '../../services/digitalAvatarAdapter';

const EnhancedVoiceChat = ({ digitalHuman, onClose }) => {
  const { t } = useTranslation();
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isAIResponding, setIsAIResponding] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [adapterInitialized, setAdapterInitialized] = useState(false);
  const [adapterFailed, setAdapterFailed] = useState(false);
  
  const audioRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Initialize digital avatar adapter when component mounts
  useEffect(() => {
    const initAdapter = async () => {
      try {
        // Check if browser supports needed APIs
        const webAudioSupported = typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined';
        const mediaRecorderSupported = typeof MediaRecorder !== 'undefined';
        
        if (!webAudioSupported || !mediaRecorderSupported) {
          console.warn('Browser does not support required audio APIs');
          setAdapterFailed(true);
          return;
        }
        
        // Try initializing the adapter with a timeout to prevent hanging
        const initPromise = digitalAvatarAdapter.initialize();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Initialization timeout')), 5000)
        );
        
        const success = await Promise.race([initPromise, timeoutPromise])
          .catch(err => {
            console.error('Adapter initialization error or timeout:', err);
            return false;
          });
          
        setAdapterInitialized(success);
        setAdapterFailed(!success);
        
        if (success) {
          console.log('Digital Avatar adapter initialized successfully');
        } else {
          console.warn('Digital Avatar adapter initialization failed, using standard audioService');
        }
      } catch (error) {
        console.error('Error initializing Digital Avatar adapter:', error);
        setAdapterFailed(true);
      }
    };
    
    initAdapter();
  }, []);

  // Load initial welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      sender: 'ai',
      content: t('digitalHuman.voiceChat.welcome', { name: digitalHuman?.name || t('digitalHuman.voiceChat.defaultName') }),
      audioUrl: null
    };
    setMessages([welcomeMessage]);
  }, [digitalHuman, t]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Start recording
  const startRecording = async () => {
    try {
      // Check if MediaRecorder is available
      if (typeof MediaRecorder === 'undefined') {
        throw new Error('MediaRecorder not supported in this browser');
      }
      
      await audioService.startRecording();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      console.error('Failed to start recording:', err);
      setError(t('digitalHuman.voiceChat.microphoneError'));
      
      // Fallback to text-based interaction when voice recording fails
      // Inform the user about the fallback
      setTimeout(() => {
        setMessages(prevMessages => [
          ...prevMessages,
          {
            id: Date.now(),
            sender: 'ai',
            content: t('digitalHuman.voiceChat.fallbackToText', 
              { defaultValue: 'Voice recording is not available. Please use text chat instead.' }),
            isError: false
          }
        ]);
        setError(null);
      }, 2000);
    }
  };

  // Stop recording and process audio
  const stopRecording = async () => {
    setIsRecording(false);
    
    try {
      const audioBlob = await audioService.stopRecording();
      const userMessageId = Date.now();
      
      // Add user message
      setMessages(prevMessages => [
        ...prevMessages, 
        {
          id: userMessageId,
          sender: 'user',
          content: t('digitalHuman.voiceChat.userAudioMessage'),
          audioUrl: URL.createObjectURL(audioBlob),
          audioBlob: audioBlob
        }
      ]);
      
      // Process AI response
      processAIResponse(audioBlob, userMessageId);
    } catch (err) {
      console.error('Error processing recording:', err);
      setError('Failed to process voice recording');
    }
  };

  // Process AI response - Choose between enhanced adapter or original service
  const processAIResponse = async (audioBlob, userMessageId) => {
    setIsAIResponding(true);
    
    try {
      // Use digital avatar adapter if initialized, otherwise fall back to standard audioService
      const service = adapterInitialized ? digitalAvatarAdapter : audioService;
      
      // Get user's preferred language from the digital human config or i18next
      const currentLang = digitalHuman?.language || t('common:languageCode', { defaultValue: 'en-US' });
      
      // Process the audio with appropriate language setting
      const data = await service.processAudio(audioBlob, {
        digitalHumanId: digitalHuman?.id || 'default',
        language: currentLang
      });
      
      // Retrieve transcription if available (only from adapter)
      // Update the user message with transcription if it's available
      if (data.transcription) {
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === userMessageId 
              ? {...msg, content: data.transcription, transcription: true} 
              : msg
          )
        );
        console.log('Updated with transcription:', data.transcription);
      }
      
      // Get the response text and audio URL
      const responseText = data.text;
      const audioUrl = data.audioUrl;
      
      // Add the AI response to messages
      const aiResponse = {
        id: Date.now(),
        sender: 'ai',
        content: responseText,
        audioUrl: audioUrl
      };
      
      setMessages(prevMessages => [...prevMessages, aiResponse]);
      setIsAIResponding(false);
      
      // Play the audio response if available
      if (audioUrl) {
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play();
          setAudioPlaying(true);
        }
      } else {
        // Fallback to speech synthesis if no audio URL
        const utterance = new SpeechSynthesisUtterance(responseText);
        utterance.lang = digitalHuman?.language || 'en-US';
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error processing AI response:', error);
      setError(t('digitalHuman.voiceChat.processingError'));
      setIsAIResponding(false);
      
      // Add error message
      const errorMessage = {
        id: Date.now(),
        sender: 'ai',
        content: t('digitalHuman.voiceChat.serverError'),
        isError: true
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      
      // Fallback to demo mode if API fails
      setTimeout(() => {
        // Choose a random response
        const responses = [
          t('digitalHuman.voiceChat.responses.howAreYou'),
          t('digitalHuman.voiceChat.responses.goodMemories'),
          t('digitalHuman.voiceChat.responses.missYou'),
          t('digitalHuman.voiceChat.responses.loveTalking'),
          t('digitalHuman.voiceChat.responses.rememberWhen')
        ];
        
        const responseText = responses[Math.floor(Math.random() * responses.length)];
        
        // Add fallback message
        const fallbackResponse = {
          id: Date.now(),
          sender: 'ai',
          content: `${t('digitalHuman.voiceChat.fallbackMessage')} ${responseText}`,
          audioUrl: null
        };
        
        setMessages(prevMessages => [...prevMessages, fallbackResponse]);
        
        // Use speech synthesis for fallback
        const utterance = new SpeechSynthesisUtterance(responseText);
        utterance.lang = digitalHuman?.language || 'en-US';
        speechSynthesis.speak(utterance);
      }, 1000);
    }
  };

  // Play audio message
  const playAudio = (audioUrl) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setAudioPlaying(true);
    }
  };

  // Handle audio playback ended
  const handleAudioEnded = () => {
    setAudioPlaying(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            {digitalHuman?.avatar ? (
              <img 
                src={digitalHuman.avatar} 
                alt={digitalHuman.name} 
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <span className="text-purple-600 font-medium text-lg">
                  {(digitalHuman?.name || t('digitalHuman.voiceChat.defaultName')).charAt(0)}
                </span>
              </div>
            )}
            <div>
              <div className="flex items-center">
                <h3 className="font-medium">
                  {digitalHuman?.name || t('digitalHuman.voiceChat.defaultName')}
                </h3>
                {adapterInitialized && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs px-1 rounded">
                    Enhanced
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">{t('digitalHuman.voiceChat.companion')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Chat Messages */}
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-4"
          ref={chatContainerRef}
        >
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user' 
                    ? 'bg-purple-600 text-white rounded-br-none' 
                    : message.isError 
                      ? 'bg-red-100 text-red-800 rounded-bl-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                {message.transcription ? (
                  <>
                    <p className="text-xs text-purple-300 mb-1">{t('digitalHuman.voiceChat.transcription', {defaultValue: 'Transcription'})}</p>
                    <p className="text-sm">{message.content}</p>
                  </>
                ) : (
                  <p className="text-sm">{message.content}</p>
                )}
                
                {message.audioUrl && (
                  <button
                    onClick={() => playAudio(message.audioUrl)}
                    className={`mt-2 text-xs flex items-center ${
                      message.sender === 'user' 
                        ? 'text-purple-200 hover:text-white' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    {t('digitalHuman.voiceChat.play')}
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {isAIResponding && (
            <div className="flex justify-start">
              <div className="max-w-[80%] bg-gray-100 rounded-lg p-3 rounded-bl-none">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <span className="ml-2 text-sm text-gray-500">{t('digitalHuman.voiceChat.thinking')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Voice Recording Controls */}
        <div className="p-4 border-t">
          {error && (
            <div className="mb-4 bg-red-100 text-red-700 p-2 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div className="flex justify-center">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`rounded-full w-16 h-16 flex items-center justify-center ${
                isRecording 
                  ? 'bg-red-600 text-white animate-pulse'
                  : adapterInitialized 
                    ? 'bg-green-600 text-white'
                    : 'bg-purple-600 text-white'
              }`}
              disabled={isAIResponding || audioPlaying}
            >
              {isRecording ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="6" y="6" width="12" height="12" strokeWidth={2} />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>
          </div>
          
          <p className="text-center text-sm text-gray-500 mt-2">
            {isRecording ? t('digitalHuman.voiceChat.tapToStop') : t('digitalHuman.voiceChat.tapToTalk')}
          </p>
          
          {adapterInitialized && (
            <p className="text-center text-xs text-green-600 mt-1">
              Using enhanced Digital Avatar Platform
            </p>
          )}
        </div>
        
        {/* Hidden Audio Element for Playback */}
        <audio 
          ref={audioRef}
          onEnded={handleAudioEnded}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default EnhancedVoiceChat;