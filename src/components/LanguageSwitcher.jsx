import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  getCurrentLanguage, 
  getSupportedLanguages, 
  changeLanguage 
} from '../i18n/i18n';

const LanguageSwitcher = () => {
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());
  const [isOpen, setIsOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    detectedLang: getCurrentLanguage(),
    storedLang: localStorage.getItem('i18nextLng'),
    htmlLang: document.documentElement.lang
  });

  // 监听语言变化，更新组件状态
  useEffect(() => {
    const updateLanguageInfo = () => {
      setCurrentLang(getCurrentLanguage());
      setDebugInfo({
        detectedLang: getCurrentLanguage(),
        storedLang: localStorage.getItem('i18nextLng'),
        htmlLang: document.documentElement.lang
      });
    };

    // 初始化时执行一次
    updateLanguageInfo();

    // 监听自定义语言变更事件
    document.addEventListener('languageChanged', updateLanguageInfo);
    
    return () => {
      document.removeEventListener('languageChanged', updateLanguageInfo);
    };
  }, []);

  // 切换语言的处理函数
  const handleLanguageChange = async (langCode) => {
    await changeLanguage(langCode);
    setIsOpen(false);
    
    // 刷新页面以确保所有组件更新
    window.location.reload();
  };

  // 获取支持的语言列表
  const languages = getSupportedLanguages();

  return (
    <div 
      className="fixed bottom-5 right-5 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      style={{ minWidth: '180px' }}
    >
      {/* 语言切换器 */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <span className="flex items-center">
            <span className="material-icons mr-2" style={{ fontSize: '20px' }}>
              language
            </span>
            {languages.find(lang => lang.code === currentLang)?.name || currentLang}
          </span>
          <span className="material-icons" style={{ fontSize: '20px' }}>
            {isOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {/* 下拉菜单 */}
        {isOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left p-3 text-sm ${
                  currentLang === lang.code
                    ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {lang.name}
              </button>
            ))}
            
            {/* 调试按钮 */}
            <div className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1">
              <button
                onClick={() => {
                  alert(
                    `当前语言: ${debugInfo.detectedLang}\n` +
                    `存储的语言: ${debugInfo.storedLang}\n` +
                    `HTML lang: ${debugInfo.htmlLang}`
                  );
                }}
                className="w-full text-left p-3 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {t('debug', '调试信息')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageSwitcher; 