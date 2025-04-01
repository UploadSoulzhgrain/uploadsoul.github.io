import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = ({ onLanguageChange }) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  // Available languages
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh-CN', name: '简体中文' },
    { code: 'zh-TW', name: '繁體中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'es', name: 'Español' }
  ];

  // Get current language
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[1]; // Default to zh-CN if not found

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const changeLanguage = async (langCode) => {
    try {
      await i18n.changeLanguage(langCode);
      // Save language preference to localStorage
      localStorage.setItem('i18nextLng', langCode);
      // Force i18n to use the saved language
      i18n.language = langCode;
      setIsOpen(false);
      if (onLanguageChange) {
        onLanguageChange(langCode);
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  // Initialize language from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById('language-dropdown');
      if (dropdown && !dropdown.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Add both mouse and touch events
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" id="language-dropdown">
      <button
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-purple-600 focus:outline-none"
        onClick={toggleDropdown}
        onTouchEnd={toggleDropdown}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578l-.29 1.892A5.989 5.989 0 0110 8c.954 0 1.856.223 2.657.619l.667-2.619H12a1 1 0 110-2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1.93l-1.407 5.507A6.003 6.003 0 0116 13a6 6 0 01-12 0 5.989 5.989 0 012.907-5.132L5 6.239A1.5 1.5 0 014.5 6a1.5 1.5 0 110-3H7zm1.5 3.253a1.5 1.5 0 000 2.993h1a1.5 1.5 0 000-2.993h-1zM8.5 15a4.5 4.5 0 100-9 4.5 4.5 0 000 9z" clipRule="evenodd" />
        </svg>
        {currentLanguage.name}
        <svg className={`ml-1 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[100]">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="language-menu">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                onTouchEnd={() => changeLanguage(language.code)}
                className={`block w-full text-left px-4 py-2 text-sm ${currentLanguage.code === language.code ? 'bg-purple-50 text-purple-600' : 'text-gray-700 hover:bg-gray-100'}`}
                role="menuitem"
              >
                {t(`languages.${language.code}`)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;