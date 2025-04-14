import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n/i18n';

const AllInOnePage = () => {
  const { t } = useTranslation();
  const [selectedModel, setSelectedModel] = useState('standard');
  const [selectedAppearance, setSelectedAppearance] = useState('dolls');
  
  // Function to change language
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Language Switcher */}
      <div className="absolute top-24 right-8 flex gap-2">
        <button 
          onClick={() => changeLanguage('en')}
          className={`px-3 py-1 rounded ${i18n.language === 'en' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
        >
          English
        </button>
        <button 
          onClick={() => changeLanguage('zh-CN')}
          className={`px-3 py-1 rounded ${i18n.language === 'zh-CN' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
        >
          简体中文
        </button>
        <button 
          onClick={() => changeLanguage('zh-TW')}
          className={`px-3 py-1 rounded ${i18n.language === 'zh-TW' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
        >
          繁體中文
        </button>
      </div>
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-purple-900 mb-4">
            {t('allInOne.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('allInOne.description')}
          </p>
          <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
            {t('allInOne.overview')}
          </p>
        </div>
        
        {/* Product Image */}
        <div className="w-full max-w-4xl mx-auto mb-16 relative overflow-hidden rounded-xl shadow-2xl bg-gradient-to-r from-purple-100 to-indigo-100 p-10">
          <div className="aspect-w-16 aspect-h-9 bg-purple-800 rounded-lg flex items-center justify-center text-white text-lg">
            {/* This would be replaced with an actual product image */}
            <p className="text-center p-20">AI One-in-All Device Preview Image</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/60 to-transparent p-6 text-white">
            <button className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-purple-700 transition">
              {t('allInOne.cta.preorder')}
            </button>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-purple-900 mb-12">
            {t('allInOne.features.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Appearance Customization */}
            <div className="p-6 rounded-xl bg-purple-50 shadow-md">
              <h3 className="text-2xl font-bold text-purple-800 mb-4">
                {t('allInOne.features.appearance.title')}
              </h3>
              <p className="text-gray-700 mb-4">
                {t('allInOne.features.appearance.description')}
              </p>
              
              <h4 className="text-lg font-semibold text-purple-700 mb-2">
                {t('allInOne.features.appearance.types.title')}
              </h4>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                {['dolls', 'figurines', 'realistic', 'pets', 'custom'].map((type) => (
                  <button
                    key={type}
                    className={`p-3 rounded-lg text-left ${selectedAppearance === type ? 'bg-purple-200 border-2 border-purple-500' : 'bg-white border border-gray-200'}`}
                    onClick={() => setSelectedAppearance(type)}
                  >
                    <span className="block font-medium">
                      {t(`allInOne.features.appearance.types.${type}`)}
                    </span>
                  </button>
                ))}
              </div>
              
              <p className="text-sm text-gray-600 italic">
                {t('allInOne.features.appearance.customization')}
              </p>
            </div>
            
            {/* Interactive Capabilities */}
            <div className="p-6 rounded-xl bg-indigo-50 shadow-md">
              <h3 className="text-2xl font-bold text-indigo-800 mb-4">
                {t('allInOne.features.interaction.title')}
              </h3>
              <p className="text-gray-700 mb-4">
                {t('allInOne.features.interaction.description')}
              </p>
              
              <ul className="space-y-3">
                {['voice', 'movement', 'response', 'touch'].map((feature) => (
                  <li key={feature} className="flex items-start">
                    <span className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 mr-2 bg-indigo-500 rounded-full text-white text-xs">✓</span>
                    <span>{t(`allInOne.features.interaction.${feature}`)}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 p-3 bg-white rounded-lg border border-indigo-200">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
                  <p className="text-sm font-medium">Voice Demo</p>
                </div>
                <p className="text-xs text-gray-500 italic">
                  "Hello! I'm your AI companion. How can I help you today?"
                </p>
              </div>
            </div>
            
            {/* Memory Integration */}
            <div className="p-6 rounded-xl bg-pink-50 shadow-md">
              <h3 className="text-2xl font-bold text-pink-800 mb-4">
                {t('allInOne.features.memory.title')}
              </h3>
              <p className="text-gray-700 mb-4">
                {t('allInOne.features.memory.description')}
              </p>
              
              <div className="space-y-4">
                {['upload', 'sync', 'share', 'backup'].map((memory) => (
                  <div key={memory} className="flex items-center p-3 bg-white rounded-lg border border-pink-200">
                    <div className="mr-3 bg-pink-100 p-2 rounded-lg">
                      <div className="w-8 h-8 flex items-center justify-center text-pink-600">
                        {memory === 'upload' && '⬆️'}
                        {memory === 'sync' && '🔄'}
                        {memory === 'share' && '🔄'}
                        {memory === 'backup' && '💾'}
                      </div>
                    </div>
                    <span>{t(`allInOne.features.memory.${memory}`)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Technical Specs */}
            <div className="p-6 rounded-xl bg-blue-50 shadow-md">
              <h3 className="text-2xl font-bold text-blue-800 mb-4">
                {t('allInOne.features.technical.title')}
              </h3>
              
              <div className="space-y-3">
                {['processor', 'display', 'audio', 'battery', 'connectivity'].map((spec) => (
                  <div key={spec} className="flex justify-between items-center border-b border-blue-100 pb-2">
                    <span className="font-medium">{spec.charAt(0).toUpperCase() + spec.slice(1)}</span>
                    <span className="text-blue-700">{t(`allInOne.features.technical.${spec}`)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Models Section */}
      <div className="bg-gradient-to-b from-white to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-purple-900 mb-12">
            {t('allInOne.models.title')}
          </h2>
          
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {['standard', 'premium', 'limited'].map((model) => (
              <div 
                key={model}
                className={`w-full max-w-xs p-6 rounded-xl cursor-pointer transition-all ${
                  selectedModel === model 
                    ? 'bg-purple-600 text-white shadow-xl scale-105' 
                    : 'bg-white shadow-md hover:shadow-lg'
                }`}
                onClick={() => setSelectedModel(model)}
              >
                <h3 className={`text-xl font-bold mb-2 ${selectedModel === model ? 'text-white' : 'text-purple-900'}`}>
                  {t(`allInOne.models.${model}.title`)}
                </h3>
                <p className={selectedModel === model ? 'text-purple-100' : 'text-gray-600'}>
                  {t(`allInOne.models.${model}.description`)}
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <div className={`h-4 w-4 rounded-full ${selectedModel === model ? 'bg-white' : 'bg-purple-600'}`}></div>
                  <button 
                    className={`px-4 py-2 rounded-lg ${
                      selectedModel === model 
                        ? 'bg-white text-purple-600' 
                        : 'bg-purple-100 text-purple-600'
                    }`}
                  >
                    {t('allInOne.cta.explore')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-purple-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            {t('allInOne.cta.design')}
          </h2>
          <p className="text-purple-200 max-w-2xl mx-auto mb-8">
            {t('allInOne.overview')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-purple-900 px-6 py-3 rounded-lg font-bold hover:bg-purple-100 transition">
              {t('allInOne.cta.customize')}
            </button>
            <button className="bg-purple-700 border border-purple-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-800 transition">
              {t('allInOne.cta.preorder')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllInOnePage; 