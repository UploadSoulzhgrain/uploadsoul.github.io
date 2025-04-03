import React from 'react';
import { useTranslation } from 'react-i18next';

const PrivacyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">{t('privacy.title')}</h1>
        <div className="max-w-3xl mx-auto space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('privacy.introduction.title')}</h2>
            <p className="text-gray-300">{t('privacy.introduction.content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('privacy.dataCollection.title')}</h2>
            <p className="text-gray-300">{t('privacy.dataCollection.content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('privacy.dataUse.title')}</h2>
            <p className="text-gray-300">{t('privacy.dataUse.content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('privacy.dataProtection.title')}</h2>
            <p className="text-gray-300">{t('privacy.dataProtection.content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('privacy.userRights.title')}</h2>
            <p className="text-gray-300">{t('privacy.userRights.content')}</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">{t('privacy.contact.title')}</h2>
            <p className="text-gray-300">{t('privacy.contact.content')}</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage; 