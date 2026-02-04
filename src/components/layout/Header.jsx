import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useLocalizedNavigate } from '../../hooks/useLocalizedNavigate';
import LanguageSelector from '../common/LanguageSelector';
import Logo from '../common/Logo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { navigate, l } = useLocalizedNavigate();

  const handleLanguageChange = () => {
    setIsMenuOpen(false);
  };

  const handleNav = (path) => {
    const localizedPath = l(path);
    if (user || path === '/') {
      navigate(path);
    } else {
      // 保存来源路径，以便登录后跳转回来
      navigate('/login', { state: { from: { pathname: localizedPath } } });
    }
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      // 无论后端是否成功，前端必须清除状态并跳转
      navigate(l('/'));
      setIsUserMenuOpen(false);
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="bg-[#0A0A0F] bg-opacity-80 backdrop-blur-lg border-b border-white/5 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between relative">
          <div className="flex items-center">
            <Link to={l('/')} className="flex items-center hover:opacity-80 transition-opacity">
              <Logo size="md" variant="default" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {[
              { to: '/', label: t('header.home') },
              { to: '/companion', label: t('header.companions') },

              { to: '/pet', label: t('home.features.virtualPet.title') },
              { to: '/virtual-love', label: t('header.virtualLove') },
              { to: '/digital-immortality', label: t('digitalImmortality.title') },
              { to: '/digital-rebirth', label: t('digitalRebirth.title') }
            ].map((link) => (
              <button
                key={link.to}
                onClick={() => handleNav(link.to)}
                className="text-gray-400 hover:text-white text-sm font-medium transition-colors focus:outline-none"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* User Section */}
          <div className="hidden lg:flex items-center space-x-6">
            <LanguageSelector onLanguageChange={handleLanguageChange} />

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {(user.user_metadata?.nickname || user.email)?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-300 text-sm max-w-[100px] truncate">
                    {user.user_metadata?.nickname || user.email}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#1A1A24] rounded-xl shadow-xl border border-white/10 py-1 z-50">
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-xs text-gray-500">已登录账号</p>
                      <Link to={l('/dashboard')} className="text-sm text-amber-500 hover:text-amber-400 truncate block mt-1 hover:underline">
                        我的仪表盘 &gt;
                      </Link>
                    </div>
                    {/* 暂时没有个人中心页面，留空或指向首页 */}
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors"
                    >
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={l('/login')}
                className="px-6 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                {t('auth.login')} / {t('auth.signup')}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-400 p-2 hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="mt-4 lg:hidden bg-[#12121A] border border-white/5 rounded-2xl shadow-2xl p-6 animate-fadeIn">
            <div className="flex flex-col space-y-6">
              {[
                { to: '/', label: t('header.home') },
                { to: '/companion', label: t('header.companions') },

                { to: '/pet', label: t('home.features.virtualPet.title') },
                { to: '/virtual-love', label: t('header.virtualLove') },
                { to: '/digital-immortality', label: t('digitalImmortality.title') },
                { to: '/digital-rebirth', label: t('digitalRebirth.title') }
              ].map((link) => (
                <button
                  key={link.to}
                  onClick={() => handleNav(link.to)}
                  className="text-gray-400 hover:text-white text-lg font-medium transition-colors text-left"
                >
                  {link.label}
                </button>
              ))}
              <div className="h-px bg-white/5"></div>
              <div className="flex flex-col space-y-4">
                <LanguageSelector onLanguageChange={handleLanguageChange} />

                {user ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-md font-bold">
                        {(user.user_metadata?.nickname || user.email)?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white font-medium">
                          {user.user_metadata?.nickname || user.email}
                        </span>
                        <Link
                          to={l('/dashboard')}
                          className="text-amber-500 text-xs hover:underline"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          进入我的仪表盘 &gt;
                        </Link>
                      </div>
                    </div>

                    <Link
                      to={l('/dashboard')}
                      className="w-full py-4 bg-amber-500/10 text-amber-500 border border-amber-500/30 text-center rounded-xl font-bold"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      我的仪表盘
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="w-full py-3 bg-red-500/10 text-red-400 border border-red-500/30 text-center rounded-xl"
                    >
                      退出登录
                    </button>
                  </div>
                ) : (
                  <Link
                    to={l('/login')}
                    className="w-full py-4 bg-white text-black text-center text-lg font-bold rounded-2xl hover:bg-gray-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('auth.login')} / {t('auth.signup')}
                  </Link>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
