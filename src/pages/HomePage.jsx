import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAction = (path) => {
    if (user) {
      navigate(path);
    } else {
      navigate('/login', { state: { from: { pathname: path } } });
    }
  };

  // 核心功能
  const features = [
    {
      id: 'companion',
      title: t('home.features.emotionalCompanion.title'),
      desc: t('home.features.emotionalCompanion.description'),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      link: '/companion'
    },
    {
      id: 'love',
      title: t('header.virtualLove'),
      desc: t('virtualLove.description'),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      link: '/virtual-love'
    },
    {
      id: 'pet',
      title: t('home.features.virtualPet.title'),
      desc: t('home.features.virtualPet.description'),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      ),
      link: '/pet'
    },
    {
      id: 'rebirth',
      title: t('digitalRebirth.title'),
      desc: t('digitalRebirth.description'),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      link: '/digital-rebirth'
    },
    {
      id: 'immortality',
      title: t('digitalImmortality.title'),
      desc: t('digitalImmortality.description'),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      link: '/digital-immortality'
    }
  ];

  return (
    <div className="min-h-screen bg-tech-mesh text-white">
      {/* Hero Section - 极简 */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-br from-orange-500/5 to-amber-500/5 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="bg-grid absolute inset-0 opacity-20" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* 主标语 */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="text-gradient">UploadSoul 传灵</span>
            <span className="block text-3xl md:text-4xl font-light text-white/90 mt-4 tracking-wider">
              虚拟世界，数字永生
            </span>
          </h1>

          {/* 简短描述 */}
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            {t('home.hero.description')}
          </p>

          {/* CTA - 只保留关键出口 */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <div
              onClick={() => handleAction('/mvp-test')}
              className="btn-premium inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('home.hero.mvpTest')}</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </div>

          {/* 融资公告 - 简化 */}
          <div className="mt-16 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-white/60">{t('home.features.funding.title')} · {t('home.features.funding.description').slice(0, 25)}...</span>
          </div>
        </div>
      </section>

      {/* 功能区 - 极简卡片 */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          {/* 标题 */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4">{t('home.features.title')}</h2>
            <p className="text-white/50 max-w-xl mx-auto">{t('home.features.description')}</p>
          </div>

          {/* 功能网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                onClick={() => handleAction(feature.link)}
                className={`card-premium p-8 group cursor-pointer ${index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}
              >
                {/* 图标 */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-6 text-amber-500 group-hover:text-amber-400 transition-colors">
                  {feature.icon}
                </div>

                {/* 标题 */}
                <h3 className="text-xl font-semibold mb-3 group-hover:text-amber-500 transition-all">
                  {feature.title}
                </h3>

                {/* 描述 */}
                <p className="text-white/50 text-sm leading-relaxed line-clamp-2">
                  {feature.desc}
                </p>

                {/* 箭头 */}
                <div className="mt-6 flex items-center text-white/30 group-hover:text-amber-500 transition-colors">
                  <span className="text-sm">{t('common.startExperience')}</span>
                  <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 数据统计 - 极简 */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: '10,000+', label: '活跃用户' },
              { num: '1M+', label: 'AI对话' },
              { num: '99.9%', label: '满意度' },
              { num: '24/7', label: '在线服务' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">{stat.num}</div>
                <div className="text-sm text-white/40">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 底部快捷入口 */}
      <section className="py-12 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-3">
          {[
            { to: '/shop', label: t('header.shop'), icon: '🛒' },
            { to: '/vr', label: t('home.features.vrExperience.title'), icon: '🥽' },
            { to: '/about', label: t('header.about'), icon: '📖' },
            { to: '/register', label: t('home.cta.freeRegister'), icon: '✨' }
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="px-5 py-2.5 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all text-sm flex items-center gap-2"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;