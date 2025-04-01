// src/core/hooks/useI18n.js
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLanguage } from '../store/userSlice';
import { changeLanguage as changeI18nLanguage, getSupportedLanguages } from '../i18n/i18n';

/**
 * 国际化Hook
 * 提供多语言支持相关功能和状态
 * @returns {Object} 国际化相关方法和状态
 */
const useI18n = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  
  // 从Redux获取当前语言设置
  const currentLanguage = useSelector((state) => state.user.preferences.language);
  
  /**
   * 切换语言
   * @param {string} language - 语言代码('zh'或'en')
   * @returns {Promise<void>}
   */
  const handleChangeLanguage = useCallback(async (language) => {
    if (language && (language === 'zh' || language === 'en')) {
      // 更新i18n实例的语言
      await changeI18nLanguage(language);
      
      // 更新Redux中的语言设置
      dispatch(setLanguage(language));
    }
  }, [dispatch]);
  
  /**
   * 获取当前语言代码
   * @returns {string} 当前语言代码
   */
  const getCurrentLanguage = useCallback(() => {
    return currentLanguage || 'zh';
  }, [currentLanguage]);
  
  /**
   * 获取当前语言名称
   * @returns {string} 当前语言名称
   */
  const getCurrentLanguageName = useCallback(() => {
    const languages = getSupportedLanguages();
    const language = languages.find(lang => lang.code === getCurrentLanguage());
    return language ? language.name : '中文';
  }, [getCurrentLanguage]);
  
  /**
   * 获取支持的语言列表
   * @returns {Array<{code: string, name: string}>} 支持的语言列表
   */
  const getSupportedLanguagesList = useCallback(() => {
    return getSupportedLanguages();
  }, []);
  
  /**
   * 条件翻译
   * 根据指定语言获取翻译，不受当前语言影响
   * @param {string} key - 翻译键
   * @param {object} options - 翻译选项
   * @param {string} lang - 指定语言
   * @returns {string} 翻译结果
   */
  const tIn = useCallback((key, options = {}, lang) => {
    return i18n.getFixedT(lang)(key, options);
  }, [i18n]);
  
  return {
    t,            // 翻译函数
    tIn,          // 条件翻译函数
    language: currentLanguage,       // 当前语言代码
    languageName: getCurrentLanguageName(),  // 当前语言名称
    supportedLanguages: getSupportedLanguagesList(), // 支持的语言列表
    changeLanguage: handleChangeLanguage,    // 切换语言方法
    i18n          // 原始i18n实例，用于高级用法
  };
};

export default useI18n;