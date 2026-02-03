import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const useLocalizedNavigate = () => {
    const navigate = useNavigate();
    const { i18n } = useTranslation();

    const localizePath = (path) => {
        const supportedLangs = ['en', 'zh-TW', 'ja', 'ko', 'es'];
        const currentLang = i18n.language;

        // 如果不是支持的语言，或者是跳转到外部链接，直接返回
        if (!supportedLangs.includes(currentLang)) return path;

        // 核心修复：检查路径是否已经以任何支持的语言前缀开头
        const hasLangPrefix = supportedLangs.some(l =>
            path === `/${l}` || path.startsWith(`/${l}/`)
        );

        // 如果已经有前缀了，直接返回，不再重复添加
        if (hasLangPrefix) return path;

        // 否则添加当前语言前缀
        return `/${currentLang}${path === '/' ? '' : path}`;
    };

    const localizedNavigate = (path, options) => {
        navigate(localizePath(path), options);
    };

    return { navigate: localizedNavigate, l: localizePath };
};
