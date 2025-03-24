// src/components/settings/ApiKeySetup.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import apiKeyService from '../../services/apiKeyService';

/**
 * API Key Setup Component
 * 
 * Provides a form for users to enter and save their API keys
 * for OpenAI and ElevenLabs services.
 */
const ApiKeySetup = ({ onKeysUpdated = () => {} }) => {
  const { t } = useTranslation();
  
  const [openaiKey, setOpenaiKey] = useState('');
  const [elevenLabsKey, setElevenLabsKey] = useState('');
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [showElevenLabsKey, setShowElevenLabsKey] = useState(false);
  const [status, setStatus] = useState({ openai: false, elevenlabs: false });
  const [saving, setSaving] = useState(false);
  const [messages, setMessages] = useState({ success: '', error: '' });

  // Load any existing API keys on component mount
  useEffect(() => {
    const keyStatus = apiKeyService.getStatus();
    setStatus(keyStatus);
    
    // Set masked values for existing keys
    if (keyStatus.openai) {
      const key = apiKeyService.getApiKey('openai');
      setOpenaiKey(key ? maskKey(key) : '');
    }
    
    if (keyStatus.elevenlabs) {
      const key = apiKeyService.getApiKey('elevenlabs');
      setElevenLabsKey(key ? maskKey(key) : '');
    }
  }, []);

  // Helper function to mask API keys for display
  const maskKey = (key) => {
    if (!key || key.length < 8) return '•'.repeat(16);
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  // Handle OpenAI key input
  const handleOpenAIChange = (e) => {
    const value = e.target.value;
    // If the value contains bullets, it means it's a masked key and shouldn't be modified
    // unless the user is clearing it completely
    if (value.includes('•') && value !== '') {
      return;
    }
    setOpenaiKey(value);
  };

  // Handle ElevenLabs key input
  const handleElevenLabsChange = (e) => {
    const value = e.target.value;
    if (value.includes('•') && value !== '') {
      return;
    }
    setElevenLabsKey(value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessages({ success: '', error: '' });

    try {
      // Only update OpenAI key if it's changed (not masked)
      if (!openaiKey.includes('•')) {
        const openaiSuccess = apiKeyService.setOpenAIKey(openaiKey);
        if (!openaiSuccess) {
          throw new Error(t('settings.apiKeys.errorSavingOpenAI'));
        }
      }
      
      // Only update ElevenLabs key if it's changed (not masked)
      if (!elevenLabsKey.includes('•')) {
        const elevenLabsSuccess = apiKeyService.setElevenLabsKey(elevenLabsKey);
        if (!elevenLabsSuccess) {
          throw new Error(t('settings.apiKeys.errorSavingElevenLabs'));
        }
      }
      
      // Update status
      const newStatus = apiKeyService.getStatus();
      setStatus(newStatus);
      
      // Show success message
      setMessages({ 
        success: t('settings.apiKeys.saveSuccess'), 
        error: '' 
      });
      
      // Notify parent component
      onKeysUpdated(newStatus);
      
      // Mask keys after saving
      const updatedOpenAIKey = apiKeyService.getApiKey('openai');
      const updatedElevenLabsKey = apiKeyService.getApiKey('elevenlabs');
      
      if (updatedOpenAIKey) setOpenaiKey(maskKey(updatedOpenAIKey));
      if (updatedElevenLabsKey) setElevenLabsKey(maskKey(updatedElevenLabsKey));
      
    } catch (error) {
      setMessages({ 
        success: '', 
        error: error.message || t('settings.apiKeys.errorSaving')
      });
    } finally {
      setSaving(false);
    }
  };

  // Clear all keys
  const handleClearKeys = () => {
    if (window.confirm(t('settings.apiKeys.confirmClear'))) {
      apiKeyService.clearAllKeys();
      setOpenaiKey('');
      setElevenLabsKey('');
      setStatus({ openai: false, elevenlabs: false });
      setMessages({ 
        success: t('settings.apiKeys.clearSuccess'), 
        error: '' 
      });
      onKeysUpdated({ openai: false, elevenlabs: false });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">
        {t('settings.apiKeys.title', 'API Key Configuration')}
      </h2>
      
      <p className="text-gray-600 mb-6">
        {t('settings.apiKeys.description', 'Enter your API keys to enable advanced voice and AI features. Your keys are stored locally on your device and are never sent to our servers.')}
      </p>
      
      {messages.success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {messages.success}
        </div>
      )}
      
      {messages.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {messages.error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* OpenAI API Key */}
        <div className="mb-6">
          <label 
            htmlFor="openai-key" 
            className="block text-gray-700 font-medium mb-2"
          >
            {t('settings.apiKeys.openaiLabel', 'OpenAI API Key')}
            {status.openai && (
              <span className="ml-2 text-sm text-green-600">
                {t('settings.apiKeys.configured', '(Configured)')}
              </span>
            )}
          </label>
          
          <div className="relative">
            <input
              id="openai-key"
              type={showOpenAIKey ? "text" : "password"}
              value={openaiKey}
              onChange={handleOpenAIChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder={t('settings.apiKeys.openaiPlaceholder', 'Enter OpenAI API key')}
            />
            <button
              type="button"
              onClick={() => setShowOpenAIKey(!showOpenAIKey)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              aria-label={showOpenAIKey ? "Hide key" : "Show key"}
            >
              {showOpenAIKey ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-1">
            {t('settings.apiKeys.openaiInstructions', 'Get your API key from the OpenAI dashboard.')}
            <a 
              href="https://platform.openai.com/account/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 ml-1"
            >
              {t('settings.apiKeys.getKey', 'Get key')}
            </a>
          </p>
        </div>
        
        {/* ElevenLabs API Key */}
        <div className="mb-6">
          <label 
            htmlFor="elevenlabs-key" 
            className="block text-gray-700 font-medium mb-2"
          >
            {t('settings.apiKeys.elevenlabsLabel', 'ElevenLabs API Key')}
            {status.elevenlabs && (
              <span className="ml-2 text-sm text-green-600">
                {t('settings.apiKeys.configured', '(Configured)')}
              </span>
            )}
          </label>
          
          <div className="relative">
            <input
              id="elevenlabs-key"
              type={showElevenLabsKey ? "text" : "password"}
              value={elevenLabsKey}
              onChange={handleElevenLabsChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder={t('settings.apiKeys.elevenlabsPlaceholder', 'Enter ElevenLabs API key')}
            />
            <button
              type="button"
              onClick={() => setShowElevenLabsKey(!showElevenLabsKey)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              aria-label={showElevenLabsKey ? "Hide key" : "Show key"}
            >
              {showElevenLabsKey ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-1">
            {t('settings.apiKeys.elevenlabsInstructions', 'Get your API key from the ElevenLabs dashboard.')}
            <a 
              href="https://elevenlabs.io/app/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 ml-1"
            >
              {t('settings.apiKeys.getKey', 'Get key')}
            </a>
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors mb-4 sm:mb-0"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('common.saving', 'Saving...')}
              </>
            ) : (
              t('common.saveChanges', 'Save Changes')
            )}
          </button>
          
          <button
            type="button"
            onClick={handleClearKeys}
            className="w-full sm:w-auto text-red-600 border border-red-600 py-2 px-6 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
          >
            {t('settings.apiKeys.clearKeys', 'Clear All Keys')}
          </button>
        </div>
      </form>
      
      {/* API Key Security Information */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">
          {t('settings.apiKeys.securityInfo.title', 'About Your API Keys')}
        </h3>
        <ul className="list-disc pl-5 space-y-1 text-blue-800">
          <li>
            {t('settings.apiKeys.securityInfo.local', 'Keys are stored securely in your browser\'s local storage and never transmitted to our servers.')}
          </li>
          <li>
            {t('settings.apiKeys.securityInfo.personal', 'These are your personal API keys and you are responsible for any usage costs.')}
          </li>
          <li>
            {t('settings.apiKeys.securityInfo.charges', 'OpenAI and ElevenLabs may charge for API usage according to their pricing policies.')}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ApiKeySetup;