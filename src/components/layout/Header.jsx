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
    <header className="bg-[#0A0A0F] bg-opacity-80 backdrop-blur-lg border-b border-white/5 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between relative">
          <div className="flex items-center">
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <Logo size="md" variant="default" />
            </Link>
          </div>

          {/* Desktop Navigation - Simplified for width */}
          <nav className="hidden lg:flex space-x-8">
            {[
              { to: '/', label: t('header.home') },
              { to: '/companion', label: t('header.companions') },
              { to: '/pet', label: t('home.features.virtualPet.title') },
              { to: '/virtual-love', label: t('header.virtualLove') },
              { to: '/digital-immortality', label: t('digitalImmortality.title') },
              { to: '/digital-rebirth', label: t('digitalRebirth.title') }
              // Shop moved to bottom of homepage
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Section - Merged Login/Register */}
          <div className="hidden lg:flex items-center space-x-6">
            <LanguageSelector onLanguageChange={handleLanguageChange} />
            <Link
              to="/login"
              className="px-6 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            >
              {t('auth.login')} / {t('auth.signup')}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-400 p-2 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
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

        {/* Mobile Navigation - Simplified */}
        {isMenuOpen && (
          <nav className="mt-4 lg:hidden bg-[#12121A] border border-white/5 rounded-2xl shadow-2xl p-6 animate-fadeIn">
            <div className="flex flex-col space-y-6">
              {[
                { to: '/', label: t('header.home') },
                { to: '/companion', label: t('header.companions') },
                { to: '/pet', label: t('home.features.virtualPet.title') },
                { to: '/virtual-love', label: t('header.virtualLove') },
                { to: '/digital-immortality', label: t('digitalImmortality.title') },
                { to: '/digital-rebirth', label: t('digitalRebirth.title') }
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-gray-400 hover:text-white text-lg font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-white/5"></div>
              <div className="flex flex-col space-y-4">
                <LanguageSelector onLanguageChange={handleLanguageChange} />
                <Link
                  to="/login"
                  className="w-full py-4 bg-white text-black text-center text-lg font-bold rounded-2xl hover:bg-gray-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('auth.login')} / {t('auth.signup')}
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
