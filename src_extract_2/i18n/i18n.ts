// src/i18n/i18n.ts
/**
 * i18n configuration for multilingual support
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Define the supported languages
const supportedLngs = ['en', 'zh', 'ja', 'ko', 'es', 'fr', 'de', 'ru'];

// Define the namespaces for better organization of translations
const ns = ['common', 'avatar', 'conversation', 'settings'];
const defaultNS = 'common';

// Initialize i18next
i18n
  // Load translations from backend (files in /public/locales/{lng}/{ns}.json)
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass i18n down to react-i18next
  .use(initReactI18next)
  .init({
    // Default language if detection fails
    fallbackLng: 'en',

    // List of supported languages
    supportedLngs,

    // Translation namespaces
    ns,
    defaultNS,

    // Language detection options
    detection: {
      // Order of detection methods
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      
      // Parameter names
      lookupQuerystring: 'lng',
      lookupCookie: 'i18n',
      lookupLocalStorage: 'i18nLng',
      
      // Cache user selection
      caches: ['localStorage', 'cookie'],
      
      // Option to exclude specific languages from automatic detection
      excludeCacheFor: ['cimode'],
    },

    // Debug mode for development
    debug: process.env.NODE_ENV === 'development',

    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes values
    },

    // React specific options
    react: {
      useSuspense: false, // Avoid issues with React Suspense
      bindI18n: 'languageChanged loaded', // Events that trigger a re-render
    },

    // Backend configuration
    backend: {
      loadPath: '/assets/locales/{{lng}}/{{ns}}.json',
    },
  });

// Function to change the language
export const changeLanguage = async (lng: string): Promise<void> => {
  await i18n.changeLanguage(lng);
  document.documentElement.lang = lng;
  document.documentElement.dir = ['ar', 'he'].includes(lng) ? 'rtl' : 'ltr';
  
  // Optional: update URL to include language
  if (window.history.pushState) {
    const url = new URL(window.location.href);
    url.searchParams.set('lng', lng);
    window.history.pushState({}, '', url.toString());
  }
};

// Function to get the current language
export const getCurrentLanguage = (): string => {
  return i18n.language;
};

// Function to detect the user's preferred language
export const detectUserLanguage = (): string => {
  const detectedLng = i18n.services.languageDetector?.detect() || 'en';
  return supportedLngs.includes(detectedLng) ? detectedLng : 'en';
};

// Export the i18n instance
export default i18n;