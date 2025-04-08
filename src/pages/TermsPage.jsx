import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';

const TermsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16">
      <Helmet>
        <title>{t('terms.title')} | UploadSoul</title>
        <meta name="description" content={t('terms.description')} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://uploadsoul.com/terms" />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-8">
            {t('terms.title')}
          </h1>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                {t('terms.introduction.title')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('terms.introduction.content')}
              </p>

              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                {t('terms.definitions.title')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('terms.definitions.content')}
              </p>

              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                {t('terms.account.title')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('terms.account.content')}
              </p>

              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                {t('terms.services.title')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('terms.services.content')}
              </p>

              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                {t('terms.userContent.title')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('terms.userContent.content')}
              </p>

              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                {t('terms.intellectualProperty.title')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('terms.intellectualProperty.content')}
              </p>

              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                {t('terms.limitations.title')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('terms.limitations.content')}
              </p>

              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                {t('terms.termination.title')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('terms.termination.content')}
              </p>

              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                {t('terms.changes.title')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('terms.changes.content')}
              </p>

              <h2 className="text-2xl font-semibold text-purple-600 mb-4">
                {t('terms.contact.title')}
              </h2>
              <p className="text-gray-600">
                {t('terms.contact.content')}
              </p>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                {t('terms.lastUpdated')}: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage; 