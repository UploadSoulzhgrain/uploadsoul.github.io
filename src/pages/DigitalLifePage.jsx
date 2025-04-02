import React from 'react';
import { useTranslation } from 'react-i18next';

const DigitalLifePage = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">{t('header.digitalLife')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 这里可以添加数字永生的具体内容 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">{t('home.features.digitalImmortality.title')}</h2>
          <p className="text-gray-600">{t('home.features.digitalImmortality.description')}</p>
        </div>
      </div>
    </div>
  );
};

export default DigitalLifePage; 