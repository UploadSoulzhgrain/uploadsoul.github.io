// src/core/i18n/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import zhTranslations from './zh';
import enTranslations from './en';

/**
 * 国际化配置
 * 支持中英文切换，默认使用中文
 */
const i18nConfig = {
  resources: {
    zh: {
      translation: zhTranslations
    },
    en: {
      translation: enTranslations
    }
  },
  lng: 'zh', // 默认语言
  fallbackLng: 'en', // 回退语言
  interpolation: {
    escapeValue: false // 不转义React已经处理的内容
  },
  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage']
  },
  react: {
    useSuspense: true // 使用React Suspense进行懒加载
  }
};

i18n
  .use(initReactI18next) // 将i18n实例传递给react-i18next
  .init(i18nConfig);

/**
 * 更改当前语言
 * @param {string} language - 语言代码('zh'或'en')
 * @returns {Promise<void>}
 */
export const changeLanguage = async (language) => {
  if (language && (language === 'zh' || language === 'en')) {
    await i18n.changeLanguage(language);
    localStorage.setItem('i18nextLng', language);
  }
};

/**
 * 获取当前语言
 * @returns {string} 当前语言代码
 */
export const getCurrentLanguage = () => {
  return i18n.language || 'zh';
};

/**
 * 获取支持的语言列表
 * @returns {Array} 支持的语言列表
 */
export const getSupportedLanguages = () => {
  return [
    { code: 'zh', name: '中文' },
    { code: 'en', name: 'English' }
  ];
};

export default i18n;