import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FeatureIllustrations from '../components/FeatureIllustrations';

const DigitalImmortalityPage = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
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
        <Link
          to="/digital-immortality/create"
          className="inline-block bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('digitalImmortality.startCreation')}
        </Link>
      </div>

      <FeatureIllustrations />
    </div>
  );
};

export default DigitalImmortalityPage; 