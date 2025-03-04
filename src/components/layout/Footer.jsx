import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-800 text-gray-300 py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">UploadSoul</h3>
            <p className="text-sm">
              {t('footer.description')}
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">{t('footer.services')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/companion" className="hover:text-white transition">{t('companion.selectCompanion')}</Link></li>
              <li><Link to="/pet" className="hover:text-white transition">{t('home.features.virtualPet.title')}</Link></li>
              <li><Link to="/digital-human" className="hover:text-white transition">{t('home.features.digitalImmortality.title')}</Link></li>
              <li><Link to="/vr" className="hover:text-white transition">VR</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">{t('footer.aboutUs')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition">{t('footer.aboutCompany')}</Link></li>
              <li><Link to="/team" className="hover:text-white transition">{t('footer.team')}</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">{t('footer.contact')}</Link></li>
              <li><Link to="/join" className="hover:text-white transition">{t('footer.joinUs')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">{t('footer.contactMethods')}</h4>
            <ul className="space-y-2 text-sm">
              <li>{t('footer.email')}: uploadsoul@outlook.com</li>
              <li>{t('footer.phone')}: +1-888-123-4567</li>
              <li>{t('footer.address')}: {t('footer.addressDetails')}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-center">
          <p>© {new Date().getFullYear()} UploadSoul {t('footer.platformName')}. {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;