import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const useLocalizedNavigate = () => {
    const navigate = useNavigate();
    const { i18n } = useTranslation();

    const localizePath = (path) => {
        const supportedLangs = ['en', 'zh-TW', 'ja', 'ko', 'es'];
        const currentLang = i18n.language;
        if (supportedLangs.includes(currentLang)) {
            return `/${currentLang}${path === '/' ? '' : path}`;
        }
        return path;
    };

    const localizedNavigate = (path, options) => {
        navigate(localizePath(path), options);
    };

    return { navigate: localizedNavigate, l: localizePath };
};
