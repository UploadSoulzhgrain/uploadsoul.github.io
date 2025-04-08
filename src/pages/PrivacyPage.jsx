import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

const PrivacyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16">
      <Helmet>
        <title>{t('privacy.title')} | UploadSoul</title>
        <meta name="description" content={t('privacy.description')} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://uploadsoul.com/privacy" />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-8">
            {t('privacy.title')}
          </h1>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                {t('privacy.introduction.title')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('privacy.introduction.content')}
              </p>

              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                {t('privacy.dataCollection.title')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('privacy.dataCollection.content')}
              </p>

              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                {t('privacy.dataUsage.title')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('privacy.dataUsage.content')}
              </p>

              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                {t('privacy.dataProtection.title')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('privacy.dataProtection.content')}
              </p>

              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                {t('privacy.userRights.title')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('privacy.userRights.content')}
              </p>

              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                {t('privacy.cookies.title')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('privacy.cookies.content')}
              </p>

              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                {t('privacy.changes.title')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('privacy.changes.content')}
              </p>

              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                {t('privacy.contact.title')}
              </h2>
              <p className="text-gray-600">
                {t('privacy.contact.content')}
              </p>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                {t('privacy.lastUpdated')}: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage; 