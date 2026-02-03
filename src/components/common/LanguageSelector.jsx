import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const LanguageSelector = ({ onLanguageChange }) => {
  const { t, i18n } = useTranslation();
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

  // Get current language
  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[1]; // Default to zh-CN if not found

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const changeLanguage = async (langCode) => {
    try {
      console.log('Changing language to:', langCode);

      // Update i18n language
      await i18n.changeLanguage(langCode);
      localStorage.setItem('i18nextLng', langCode);
      setCurrentLang(langCode);
      document.documentElement.lang = langCode;

      // Calculate new path based on language
      const currentPath = location.pathname;
      const supportedLangs = ['en', 'zh-TW', 'ja', 'ko', 'es'];
      const langRegex = new RegExp(`^/(${supportedLangs.join('|')})(/|$)`);

      let newPath = currentPath;

      // Remove current lang prefix if exists
      if (langRegex.test(currentPath)) {
        newPath = currentPath.replace(langRegex, '/');
      }

      // Add new lang prefix if not default (zh-CN)
      if (langCode !== 'zh-CN') {
        newPath = `/${langCode}${newPath === '/' ? '' : newPath}`;
      }

      // Ensure newPath doesn't have trailing slash if not root
      if (newPath.length > 1 && newPath.endsWith('/')) {
        newPath = newPath.slice(0, -1);
      }

      console.log('Navigating to:', newPath);
      navigate(newPath);
      setIsOpen(false);

      if (onLanguageChange) {
        onLanguageChange(langCode);
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
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-400 hover:text-amber-500 focus:outline-none transition-colors"
        onClick={toggleDropdown}
        onTouchEnd={toggleDropdown}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 opacity-70" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578l-.29 1.892A5.989 5.989 0 0110 8c.954 0 1.856.223 2.657.619l.667-2.619H12a1 1 0 110-2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1.93l-1.407 5.507A6.003 6.003 0 0116 13a6 6 0 01-12 0 5.989 5.989 0 012.907-5.132L5 6.239A1.5 1.5 0 014.5 6a1.5 1.5 0 110-3H7zm1.5 3.253a1.5 1.5 0 000 2.993h1a1.5 1.5 0 000-2.993h-1zM8.5 15a4.5 4.5 0 100-9 4.5 4.5 0 000 9z" clipRule="evenodd" />
        </svg>
        <div className="flex items-center gap-2">
          <span>{currentLanguage.name}</span>
          <span className="text-white/40 text-xs font-light ml-1">({currentLanguage.short})</span>
        </div>
        <svg className={`ml-1 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''} text-gray-600`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl bg-[#12121A] border border-white/5 ring-1 ring-black ring-opacity-5 z-[100] overflow-hidden animate-fadeIn">
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="language-menu">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                onTouchEnd={() => changeLanguage(language.code)}
                className={`block w-full text-left px-4 py-3 text-sm transition-colors ${currentLanguage.code === language.code ? 'bg-amber-500/10 text-amber-500 font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'} flex justify-between items-center`}
                role="menuitem"
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