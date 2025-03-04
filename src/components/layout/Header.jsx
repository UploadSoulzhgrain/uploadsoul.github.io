import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../common/LanguageSelector';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-purple-600">UploadSoul</Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-purple-600 transition">{t('header.home')}</Link>
            <Link to="/companion" className="text-gray-700 hover:text-purple-600 transition">{t('companion.selectCompanion')}</Link>
            <Link to="/pet" className="text-gray-700 hover:text-purple-600 transition">{t('home.features.virtualPet.title')}</Link>
            <Link to="/digital-human" className="text-gray-700 hover:text-purple-600 transition">{t('home.features.digitalImmortality.title')}</Link>
            <Link to="/vr" className="text-gray-700 hover:text-purple-600 transition">VR</Link>
            <Link to="/shop" className="text-gray-700 hover:text-purple-600 transition">{t('home.features.title')}</Link>
          </nav>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            <Link to="/login" className="text-gray-700 hover:text-purple-600 transition">{t('auth.login')}</Link>
            <Link to="/register" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
              {t('auth.signup')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="mt-4 md:hidden">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-purple-600 transition py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.home')}
              </Link>
              <Link 
                to="/companion" 
                className="text-gray-700 hover:text-purple-600 transition py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('companion.selectCompanion')}
              </Link>
              <Link 
                to="/pet" 
                className="text-gray-700 hover:text-purple-600 transition py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('home.features.virtualPet.title')}
              </Link>
              <Link 
                to="/digital-human" 
                className="text-gray-700 hover:text-purple-600 transition py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('home.features.digitalImmortality.title')}
              </Link>
              <Link 
                to="/vr" 
                className="text-gray-700 hover:text-purple-600 transition py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                VR
              </Link>
              <Link 
                to="/shop" 
                className="text-gray-700 hover:text-purple-600 transition py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('home.features.title')}
              </Link>
              <div className="pt-2 border-t border-gray-200 mt-2">
                <LanguageSelector />
                <Link 
                  to="/login" 
                  className="block text-gray-700 hover:text-purple-600 transition py-2 mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('auth.login')}
                </Link>
                <Link 
                  to="/register" 
                  className="block text-gray-700 hover:text-purple-600 transition py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('auth.signup')}
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;