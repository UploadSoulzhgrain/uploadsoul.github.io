import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all translation files
import enTranslation from './locales/en/translation.json';
import zhCNTranslation from './locales/zh-CN/translation.json';
import zhTWTranslation from './locales/zh-TW/translation.json';
import jaTranslation from './locales/ja/translation.json';
import koTranslation from './locales/ko/translation.json';
import esTranslation from './locales/es/translation.json';

// Also import legacy translations for backward compatibility
import legacyEnTranslations from '../core/i18n/en';
import legacyZhTranslations from '../core/i18n/zh';

// Merge legacy and new translations with precedence to new ones
const mergeTranslations = (newTranslations, legacyTranslations) => {
  return { ...legacyTranslations, ...newTranslations };
};

const resources = {
  en: {
    translation: mergeTranslations(enTranslation, legacyEnTranslations)
  },
  'zh-CN': {
    translation: mergeTranslations(zhCNTranslation, legacyZhTranslations)
  },
  'zh-TW': {
    translation: zhTWTranslation
  },
  ja: {
    translation: jaTranslation
  },
  ko: {
    translation: koTranslation
  },
  es: {
    translation: esTranslation
  },
  // Add legacy mappings for backward compatibility
  zh: {
    translation: mergeTranslations(zhCNTranslation, legacyZhTranslations)
  }
};

// Initialize i18next
i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize configuration
  .init({
    resources,
    lng: 'zh-CN', // 设置默认语言为中文
    fallbackLng: 'en',
    debug: false, // Set to false for production
    interpolation: {
      escapeValue: false // Not needed for React as it escapes by default
    },
    detection: {
      order: ['localStorage', 'querystring', 'cookie', 'navigator'],
      lookupQuerystring: 'lang',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage', 'cookie']
    },
    react: {
      useSuspense: true, // Use React Suspense for lazy loading
      wait: true // Wait for translations to be loaded
    }
  });

/**
 * Change the current language
 * @param {string} language - Language code ('zh-CN', 'en', etc.)
 * @returns {Promise<void>}
 */
export const changeLanguage = async (language) => {
  if (language) {
    // Handle legacy language codes
    const normalizedLang = language === 'zh' ? 'zh-CN' : language;
    await i18n.changeLanguage(normalizedLang);
    localStorage.setItem('i18nextLng', normalizedLang);
    console.log(`Language changed to: ${normalizedLang}`);
  }
};

/**
 * Get the current language
 * @returns {string} Current language code
 */
export const getCurrentLanguage = () => {
  return i18n.language || 'zh-CN';
};

/**
 * Get the list of supported languages
 * @returns {Array} List of supported languages
 */
export const getSupportedLanguages = () => {
  return [
    { code: 'zh-CN', name: '中文 (简体)' },
    { code: 'zh-TW', name: '中文 (繁體)' },
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'es', name: 'Español' }
  ];
};

export default i18n;