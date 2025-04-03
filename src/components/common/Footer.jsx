import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">{t('footer.services.title')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/holographic-companion" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.services.holographicCompanion')}
                </Link>
              </li>
              <li>
                <Link to="/digital-immortality" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.services.digitalImmortality')}
                </Link>
              </li>
              <li>
                <Link to="/digital-rebirth" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.services.digitalRebirth')}
                </Link>
              </li>
              <li>
                <Link to="/vr-device" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.services.vrDevice')}
                </Link>
              </li>
              <li>
                <Link to="/ai-all-in-one" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.services.aiAllInOne')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 