// pages/DigitalHumanPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CreateDigitalHuman from '../components/digitalHuman/CreateDigitalHuman';
import VoiceChat from '../components/digitalHuman/EnhancedVoiceChat';
import digitalHumanService from '../services/digitalHumanService';

const DigitalHumanPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-4">
            {t('digitalImmortality.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('digitalImmortality.description')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Memory Digitization */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('digitalImmortality.features.memoryDigitization')}</h3>
            <p className="text-gray-600">将您的记忆、经历和个性特征数字化，为未来做好准备</p>
          </div>

          {/* AI Training */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('digitalImmortality.features.aiTraining')}</h3>
            <p className="text-gray-600">使用先进的AI技术训练您的数字模型，实现更真实的交互体验</p>
          </div>

          {/* Hardware Integration */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('digitalImmortality.features.hardwareIntegration')}</h3>
            <p className="text-gray-600">支持与未来脑机接口技术的无缝集成，实现真正的数字永生</p>
          </div>

          {/* Continuous Evolution */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('digitalImmortality.features.continuousEvolution')}</h3>
            <p className="text-gray-600">您的数字模型会不断学习和进化，保持与时代同步</p>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <Link
            to="/digital-human/create"
            className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition duration-300"
          >
            {t('digitalImmortality.startButton')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DigitalHumanPage;