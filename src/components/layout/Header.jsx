import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../common/LanguageSelector';
import Logo from '../common/Logo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();

  const handleLanguageChange = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white bg-opacity-95 backdrop-blur-sm shadow-md sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between relative">
          {/* Purple gradient accent line */}
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-indigo-500"></div>
          <div className="flex items-center">
            <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
              <Logo size="md" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="px-2 py-1 rounded-md text-gray-700 hover:text-purple-600 hover:bg-purple-50 relative group transition-all duration-200">
              <span>{t('header.home')}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/companion" className="px-2 py-1 rounded-md text-gray-700 hover:text-purple-600 hover:bg-purple-50 relative group transition-all duration-200">
              <span>{t('header.companions')}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/pet" className="px-2 py-1 rounded-md text-gray-700 hover:text-purple-600 hover:bg-purple-50 relative group transition-all duration-200">
              <span>{t('home.features.virtualPet.title')}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/virtual-love" className="px-2 py-1 rounded-md text-gray-700 hover:text-purple-600 hover:bg-purple-50 relative group transition-all duration-200">
              <span>{t('header.virtualLove')}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/digital-immortality" className="px-2 py-1 rounded-md text-gray-700 hover:text-purple-600 hover:bg-purple-50 relative group transition-all duration-200">
              <span>{t('digitalImmortality.title')}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/digital-rebirth" className="px-2 py-1 rounded-md text-gray-700 hover:text-purple-600 hover:bg-purple-50 relative group transition-all duration-200">
              <span>{t('digitalRebirth.title')}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/shop" className="px-2 py-1 rounded-md text-gray-700 hover:text-purple-600 hover:bg-purple-50 relative group transition-all duration-200">
              <span>{t('header.shop')}</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-indigo-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector onLanguageChange={handleLanguageChange} />
            <Link 
              to="/login" 
              className="text-gray-700 hover:text-purple-600 transition-colors duration-200 px-3 py-1.5 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200"
            >
              {t('auth.login')}
            </Link>
            <Link 
              to="/register" 
              className="relative group overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-1.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span className="relative z-10">{t('auth.signup')}</span>
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"></span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 p-2 rounded-full hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" className="text-purple-600" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="mt-4 md:hidden bg-white rounded-lg shadow-lg py-4 px-2 animate-fadeIn">
            <div className="flex flex-col space-y-1">
              <div className="space-y-4">
                <Link to="/" className="block text-gray-700 hover:text-purple-600 transition">
                  {t('header.home')}
                </Link>
                <Link to="/companion" className="block text-gray-700 hover:text-purple-600 transition">
                  {t('header.companions')}
                </Link>
                <Link to="/pet" className="block text-gray-700 hover:text-purple-600 transition">
                  {t('home.features.virtualPet.title')}
                </Link>
                <Link to="/virtual-love" className="block text-gray-700 hover:text-purple-600 transition">
                  {t('header.virtualLove')}
                </Link>
                <Link to="/digital-immortality" className="block text-gray-700 hover:text-purple-600 transition">
                  {t('digitalImmortality.title')}
                </Link>
                <Link to="/digital-rebirth" className="block text-gray-700 hover:text-purple-600 transition">
                  {t('digitalRebirth.title')}
                </Link>
                <Link to="/shop" className="block text-gray-700 hover:text-purple-600 transition">
                  {t('header.shop')}
                </Link>
              </div>
              <div className="pt-4 border-t border-gray-200 mt-2 space-y-3">
                <div className="px-3">
                  <LanguageSelector onLanguageChange={handleLanguageChange} />
                </div>
                <div className="flex flex-col space-y-2 px-3">
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-purple-600 px-4 py-2 rounded-lg border border-gray-200 hover:border-purple-200 hover:bg-purple-50 transition-all duration-200 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('auth.login')}
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:shadow-md transition-all duration-200 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('auth.signup')}
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;