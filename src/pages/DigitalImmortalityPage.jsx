import React from 'react';
import { } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import FeatureIllustrations from '../components/FeatureIllustrations';
import { Helmet } from 'react-helmet-async';
import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate';

const DigitalImmortalityPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { navigate, l } = useLocalizedNavigate();

  const handleCreate = () => {
    if (user) {
      navigate('/digital-immortality/create');
    } else {
      navigate('/login', { state: { from: { pathname: l('/digital-immortality/create') } } });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{t('digitalImmortality.title')} - UploadSoul 传灵</title>
        <meta name="description" content={t('digitalImmortality.description')} />
        <meta name="keywords" content="数字永生, 记忆备份, 人格克隆, AI数字人, UploadSoul, Digital Immortality" />
      </Helmet>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          {t('digitalImmortality.title')}
          <span className="ml-4">
            {t('digitalImmortality.slogan')}
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-2">{t('digitalImmortality.description')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">{t('digitalImmortality.features.memory.title')}</h2>
          <p className="text-gray-600 mb-4">{t('digitalImmortality.features.memory.description')}</p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              {t('digitalImmortality.features.memory.points.0')}
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              {t('digitalImmortality.features.memory.points.1')}
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              {t('digitalImmortality.features.memory.points.2')}
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">{t('digitalImmortality.features.personality.title')}</h2>
          <p className="text-gray-600 mb-4">{t('digitalImmortality.features.personality.description')}</p>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              {t('digitalImmortality.features.personality.points.0')}
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              {t('digitalImmortality.features.personality.points.1')}
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              {t('digitalImmortality.features.personality.points.2')}
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleCreate}
          className="inline-block bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          {t('digitalImmortality.startCreation')}
        </button>
      </div>

      <FeatureIllustrations />
    </div>
  );
};

export default DigitalImmortalityPage; 