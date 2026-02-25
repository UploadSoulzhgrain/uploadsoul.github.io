import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate';


const HomePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { navigate, l } = useLocalizedNavigate();
  const location = useLocation();

  const handleAction = (path) => {
    const localizedPath = l(path);
    if (user) {
      navigate(path);
    } else {
      navigate('/login', { state: { from: { pathname: localizedPath } } });
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
      <Helmet>
        <title>UploadSoul 传灵 - AI数字情感陪伴平台 | 首页</title>
        <meta name="description" content="UploadSoul 传灵 - 全球领先的AI数字情感陪伴平台。提供数字永生、虚拟恋爱、AI伴侣、情感陪伴、心灵慰藉。让爱与记忆超越时间。" />
      </Helmet>
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
          <h1 className="text-4xl md:text-6xl font-bold mb-8 tracking-wider font-serif">
            <span className="text-sacred">UploadSoul 传灵</span>
          </h1>

          {/* 创始人语录 - 极简设计感 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="mb-10 md:mb-14 relative inline-block"
          >
            <span className="absolute -top-6 -left-8 text-7xl text-white/5 font-serif select-none">“</span>
            <p className="text-lg md:text-2xl text-white/90 font-serif italic leading-relaxed tracking-wider px-4">
              {t('home.hero.founderQuote')}
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-amber-500/50" />
              <span className="text-sm tracking-[0.3em] text-amber-500/80 uppercase font-light">
                {t('home.hero.founderLabel')}
              </span>
              <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-amber-500/50" />
            </div>
            <span className="absolute -bottom-10 -right-8 text-7xl text-white/5 font-serif select-none rotate-180">“</span>
          </motion.div>

          {/* Main CTA - Defined as a Primary Button for SEO */}
          <div className="flex flex-col sm:flex-row justify-center gap-4" role="group" aria-label="Quick Actions">
            <div
              onClick={() => handleAction('/mvp-china')}
              className="btn-premium inline-flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10"
              role="button"
              aria-label={t('home.hero.mvpChina')}
            >
              <span className="relative flex h-2 w-2 mr-1" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span>{t('home.hero.mvpChina')}</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>

            <div
              onClick={() => handleAction('/mvp-test')}
              className="px-8 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-medium hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              role="button"
              aria-label={t('home.hero.mvpTest')}
            >
              <span className="text-white/80 group-hover:text-white transition-colors">
                {t('home.hero.mvpTest')}
              </span>
              <svg className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2.945M8 3.935A9 9 0 0116.5 16s-2-1-3-3l-2-1" />
              </svg>
            </div>
          </div>

          <div className="mt-12 md:mt-16 flex flex-wrap justify-center gap-6 md:gap-12 items-center">
            {/* 温情故事 - 斑驳古卷轴样式 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(l('/our-stories'))}
              className="relative w-48 h-16 cursor-pointer group"
            >
              {/* 左卷轴轴头 - 深色紫檀木质感 */}
              <div className="absolute left-0 top-[-6px] bottom-[-6px] w-4 rounded-sm bg-gradient-to-r from-[#211200] to-[#5D4037] border-r border-[#1a1000]/50 shadow-lg z-20"></div>

              {/* 羊皮纸主体 - 斑驳做旧效果 */}
              <div className="absolute inset-x-2 top-0 bottom-0 flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.6)] z-10 overflow-hidden bg-[#D7CCC8]"
                style={{
                  // 复合渐变模拟泛黄、污渍和陈旧纹理
                  backgroundImage: `
                        radial-gradient(circle at 10% 20%, rgba(62, 39, 35, 0.1) 0%, transparent 15%),
                        radial-gradient(circle at 90% 80%, rgba(62, 39, 35, 0.12) 0%, transparent 20%),
                        radial-gradient(circle at 50% 50%, rgba(141, 110, 99, 0.05) 0%, transparent 60%),
                        linear-gradient(to right, #6D4C41 0%, #A1887F 12%, #D7CCC8 40%, #D7CCC8 60%, #A1887F 88%, #6D4C41 100%)
                     `,
                  clipPath: 'polygon(0% 1%, 100% 0%, 100% 99%, 0% 100%)',
                  boxShadow: 'inset 0 0 15px rgba(62, 39, 35, 0.3)'
                }}>
                {/* 纸张噪点纹理层 */}
                <div className="absolute inset-0 opacity-10 bg-repeat" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>

                <span className="text-[#281815] font-serif font-bold tracking-[0.2em] text-sm group-hover:scale-105 transition-transform flex items-center gap-2 relative z-10">
                  {/* 深色墨迹风格的书本图标 */}
                  <svg className="w-4 h-4 text-[#1A0F0D] opacity-90" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                  {t('home.features.warmStories.title')}
                </span>
              </div>

              {/* 右卷轴轴头 */}
              <div className="absolute right-0 top-[-6px] bottom-[-6px] w-4 rounded-sm bg-gradient-to-l from-[#211200] to-[#5D4037] border-l border-[#1a1000]/50 shadow-lg z-20"></div>
            </motion.div>

            {/* 创始人专栏 - 拟真信封样式 (完美对齐版) */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(l('/founder-column'))}
              className="relative w-48 h-16 bg-[#D7CCC8] shadow-[0_4px_12px_rgba(0,0,0,0.4)] cursor-pointer overflow-hidden flex items-center justify-center group"
              style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                background: 'linear-gradient(135deg, #BCAAA4 0%, #D7CCC8 100%)'
              }}
            >
              {/* 信封折痕 - 顶部三角形盖子 */}
              <div className="absolute top-0 left-0 right-0 h-10 bg-[#A1887F] z-10 shadow-sm"
                style={{
                  clipPath: 'polygon(0% 0%, 50% 100%, 100% 0%)',
                  backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.05), transparent)'
                }}>
              </div>

              {/* 火漆印 - 移至右上角装饰 */}
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#B71C1C] border border-[#801313] shadow-md z-20 flex items-center justify-center text-[8px] text-[#FFCDD2] font-serif font-bold group-hover:shadow-[0_0_8px_rgba(183,28,28,0.6)] transition-all transform group-hover:rotate-12">
                US
              </div>

              {/* 信封主体文字 - 绝对居中 */}
              <div className="relative z-10 flex flex-col items-center mt-2">
                <span className="text-[#3E2723] font-serif tracking-[0.1em] text-sm font-bold border-b border-[#8D6E63]/30 leading-tight group-hover:scale-105 transition-transform flex items-center gap-2">
                  <span className="opacity-80 text-xs">✉️</span> {t('home.features.founderColumn.title')}
                </span>
              </div>

              {/* 信封左右折痕阴影 */}
              <div className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,0,0,0.05) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.05) 100%)'
                }}>
              </div>
            </motion.div>
          </div>

          {/* 融资公告 - 简化 */}
          <div className="mt-16 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-white/60">{t('home.features.funding.title')} · {t('home.features.funding.description').slice(0, 25)}...</span>
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      <section className="video-demo-section py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Section Title */}
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            {t('home.videoDemo.title')}
          </h2>
          <p className="text-white/50 max-w-xl mx-auto mb-10">
            {t('home.videoDemo.subtitle')}
          </p>

          {/* Video Container */}
          <div className="video-demo-container relative">
            {/* Ambient Glow */}
            <div className="video-demo-glow" />

            {/* Video Player */}
            <div className="video-demo-player relative rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/10 border border-white/10 bg-black/40 backdrop-blur-sm">
              <video
                autoPlay
                muted
                loop
                playsInline
                controls
                className="w-full aspect-video"
                poster=""
              >
                <source
                  src="https://res.cloudinary.com/dj2eotipq/video/upload/v1771177153/数字重生故事_p0brpq.mov"
                  type="video/quicktime"
                />
                <source
                  src="https://res.cloudinary.com/dj2eotipq/video/upload/v1771177153/数字重生故事_p0brpq.mp4"
                  type="video/mp4"
                />
                {t('home.videoDemo.playHint')}
              </video>
            </div>
          </div>
        </motion.div>
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
            { to: '/shop', label: t('header.shop'), icon: '🛒', protected: true },
            { to: '/vr', label: t('home.features.vrExperience.title'), icon: '🥽', protected: true },
            { to: '/about', label: t('header.about'), icon: '📖', protected: false },
            { to: '/register', label: t('home.cta.freeRegister'), icon: '✨', protected: true }
          ].map((item) => (
            <button
              key={item.to}
              onClick={() => item.protected ? handleAction(item.to) : navigate(l(item.to))}
              className="px-5 py-2.5 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all text-sm flex items-center gap-2 focus:outline-none"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;