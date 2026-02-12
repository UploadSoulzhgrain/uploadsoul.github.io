import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const LanguageSelector = ({ onLanguageChange }) => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
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

  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[1];

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const changeLanguage = async (langCode) => {
    try {
      // 1. 更新 i18n 内部状态
      await i18n.changeLanguage(langCode);
      localStorage.setItem('i18nextLng', langCode);
      setCurrentLang(langCode);
      document.documentElement.lang = langCode;

      // 2. 计算新路径并跳转
      const currentPath = location.pathname;
      const supportedLangs = ['en', 'zh-TW', 'ja', 'ko', 'es'];
      const langRegex = new RegExp(`^/(${supportedLangs.join('|')})(/|$)`);

      let newPath = currentPath;

      // 如果当前已经在某个语言前缀下，先剥离它
      if (langRegex.test(currentPath)) {
        newPath = currentPath.replace(langRegex, '/');
      }

      // 如果切换的是非默认语言，加上对应前缀
      if (langCode !== 'zh-CN') {
        newPath = `/${langCode}${newPath === '/' ? '' : newPath}`;
      }

      // 规范化路径结尾
      if (newPath.length > 1 && newPath.endsWith('/')) {
        newPath = newPath.slice(0, -1);
      }

      console.log('Switching URL to:', newPath);
      navigate(newPath);
      setIsOpen(false);

      if (onLanguageChange) onLanguageChange(langCode);
    } catch (error) {
      console.error('Language Switch Error:', error);
    }
  };

  // 保持状态同步
  useEffect(() => {
    const handleLanguageChanged = (lang) => setCurrentLang(lang);
    i18n.on('languageChanged', handleLanguageChanged);
    return () => i18n.off('languageChanged', handleLanguageChanged);
  }, [i18n]);

  // 关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdown = document.getElementById('language-dropdown');
      if (dropdown && !dropdown.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" id="language-dropdown">
      <button
        className="flex items-center gap-1.5 px-2 py-2 text-sm font-medium text-gray-400 hover:text-amber-500 focus:outline-none transition-colors border border-white/5 rounded-lg bg-white/5"
        onClick={toggleDropdown}
      >
        <span className="text-xs font-bold">{currentLanguage.short}</span>
        <svg className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''} text-gray-600`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl bg-[#12121A] border border-white/5 ring-1 ring-black ring-opacity-5 z-[100] overflow-hidden animate-fadeIn">
          <div className="py-1">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                className={`block w-full text-left px-4 py-3 text-sm transition-colors ${currentLang === language.code ? 'bg-amber-500/10 text-amber-500 font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'} flex justify-between items-center`}
              >
                <span>{language.name}</span>
                <span className="text-white/30 text-xs">{language.short}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;