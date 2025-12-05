import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = ({ onLanguageChange }) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(i18n.language);
  
  // Available languages
  const languages = [
    { code: 'en', name: 'English', short: 'EN' },
    { code: 'zh-CN', name: '简体中文', short: 'CN' },
    { code: 'zh-TW', name: '繁體中文', short: 'TW' },
    { code: 'ja', name: '日本語', short: 'JP' },
    { code: 'ko', name: '한국어', short: 'KR' },
    { code: 'es', name: 'Español', short: 'ES' }
  ];

  // Get current language
  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[1]; // Default to zh-CN if not found

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const changeLanguage = async (langCode) => {
    try {
      console.log('Changing language to:', langCode);
      // 先设置localStorage
      localStorage.setItem('i18nextLng', langCode);
      
      // 然后改变i18n的语言
      await i18n.changeLanguage(langCode);
      
      // 更新当前语言状态
      setCurrentLang(langCode);
      
      // 强制刷新语言设置
      document.documentElement.lang = langCode;
      
      setIsOpen(false);
      
      if (onLanguageChange) {
        onLanguageChange(langCode);
      }
      
      // 如果是开发环境，可以考虑重新加载页面以确保所有组件使用新语言
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Consider page reload if translations are not updating');
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  // 监听i18n语言变化
  useEffect(() => {
    const handleLanguageChanged = (lang) => {
      console.log('Language changed event:', lang);
      setCurrentLang(lang);
    };
    
    i18n.on('languageChanged', handleLanguageChanged);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  // 初始化时从localStorage加载语言
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    console.log('Saved language in localStorage:', savedLanguage);
    console.log('Current i18n language:', i18n.language);
    
    if (savedLanguage) {
      // 规范化语言代码
      const normalizedLang = savedLanguage === 'zh' ? 'zh-CN' : savedLanguage;
      
      if (normalizedLang !== i18n.language) {
        console.log('Initializing language to:', normalizedLang);
        i18n.changeLanguage(normalizedLang).then(() => {
          setCurrentLang(normalizedLang);
        });
      } else {
        setCurrentLang(i18n.language);
      }
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
        <div className="flex items-center gap-2">
          <span>{currentLanguage.name}</span>
          <span className="text-gray-400 text-xs">({currentLanguage.short})</span>
        </div>
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
                className={`block w-full text-left px-4 py-2 text-sm ${currentLanguage.code === language.code ? 'bg-purple-50 text-purple-600' : 'text-gray-700 hover:bg-gray-100'} flex justify-between items-center`}
                role="menuitem"
              >
                <span>{language.name}</span>
                <span className="text-gray-400 text-xs">{language.short}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;