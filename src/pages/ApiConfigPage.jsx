import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ApiKeySetup from '../components/settings/ApiKeySetup';

/**
 * API Configuration Page
 * 
 * This page provides a user interface for configuring API keys required
 * for voice recognition and synthesis features in the application.
 */
const ApiConfigPage = () => {
  const { t } = useTranslation();
  
  const handleKeysUpdated = (status) => {
    console.log('API keys updated:', status);
    // Could implement more sophisticated feedback here if needed
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back navigation */}
        <div className="mb-6">
          <Link 
            to="/"
            className="inline-flex items-center text-purple-600 hover:text-purple-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            {t('common.backToHome', 'Back to Home')}
          </Link>
        </div>
        
        {/* Page header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {t('pages.apiConfig.title', 'API Configuration')}
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            {t('pages.apiConfig.subtitle', 'Configure your API keys to enable AI voice features')}
          </p>
        </div>
        
        {/* API Key Setup Component */}
        <ApiKeySetup onKeysUpdated={handleKeysUpdated} />
        
        {/* Additional Information */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t('pages.apiConfig.whyNeeded.title', 'Why are API keys needed?')}
          </h2>
          
          <p className="text-gray-600 mb-4">
            {t('pages.apiConfig.whyNeeded.description', 
              'UploadSoul uses third-party AI services to provide advanced voice recognition and synthesis features. To protect your privacy and give you control over your data, we ask you to provide your own API keys for these services.'
            )}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                {t('pages.apiConfig.openai.title', 'OpenAI Whisper')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('pages.apiConfig.openai.description', 
                  'Used for voice recognition to convert your spoken words into text with high accuracy across multiple languages.'
                )}
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                {t('pages.apiConfig.elevenlabs.title', 'ElevenLabs')}
              </h3>
              <p className="text-sm text-gray-600">
                {t('pages.apiConfig.elevenlabs.description', 
                  'Provides natural-sounding voice synthesis to give your digital companion a realistic voice.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiConfigPage;