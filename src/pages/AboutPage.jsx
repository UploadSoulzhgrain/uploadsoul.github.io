import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-indigo-900/30"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              {t('about.title')}
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              {t('about.subtitle')}
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                to="/contact" 
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition-colors duration-300"
              >
                {t('about.contactUs')}
              </Link>
              <Link 
                to="/join" 
                className="px-8 py-3 bg-transparent border-2 border-purple-600 hover:bg-purple-600/10 text-white rounded-full font-medium transition-colors duration-300"
              >
                {t('about.joinUs')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Company Introduction */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/50 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-gray-300">
                {t('about.intro')}
              </p>
              <p className="text-lg leading-relaxed text-gray-300">
                {t('about.vision')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-gray-800/50 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">{t('about.techInnovation')}</h3>
            </div>
            <p className="text-gray-300">{t('about.techInnovationDesc')}</p>
          </div>
          <div className="bg-gray-800/50 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">{t('about.globalLayout')}</h3>
            </div>
            <p className="text-gray-300">{t('about.globalLayoutDesc')}</p>
          </div>
        </div>
      </div>

      {/* Investment Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6 text-white">{t('about.investment')}</h2>
              <p className="text-xl text-gray-300 mb-8">{t('about.investmentDesc')}</p>
              <Link 
                to="/contact" 
                className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium transition-colors duration-300"
              >
                {t('about.contactInvest')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 