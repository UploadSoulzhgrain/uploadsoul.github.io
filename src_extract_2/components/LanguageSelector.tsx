// src/components/LanguageSelector.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage, getCurrentLanguage } from '../i18n/i18n';

// Define the supported languages with their display names and flags
const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' }
];

export const LanguageSelector: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const currentLang = getCurrentLanguage();

  // Handle language change
  const handleLanguageChange = async (lng: string) => {
    await changeLanguage(lng);
    setIsOpen(false);
  };

  // Get the current language display data
  const getCurrentLanguageData = () => {
    return languages.find(l => l.code === currentLang) || languages[0];
  };

  return (
    <div className="language-selector relative">
      <button 
        className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="mr-2 text-lg">{getCurrentLanguageData().flag}</span>
        <span className="mr-1">{t('language')}</span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <ul className="absolute z-10 w-48 mt-1 bg-white shadow-lg rounded-md border border-gray-200 py-1">
          {languages.map((lang) => (
            <li 
              key={lang.code}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 flex items-center ${
                currentLang === lang.code ? 'bg-blue-50 text-blue-700 font-medium' : ''
              }`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="mr-2 text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelector;