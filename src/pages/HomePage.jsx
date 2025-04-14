import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeroBackground from '../components/common/HeroBackground';
import WaveAnimation from '../components/animations/WaveAnimation';
import AnimationStyles from '../components/animations/AnimationStyles';
import Logo from '../components/common/Logo';
import FeatureIllustrations from '../components/common/FeatureIllustrations';

const HomePage = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white overflow-hidden">
      <AnimationStyles />
      
      {/* Hero Section with animated background */}
      <section className="py-20 px-4 relative">
        <HeroBackground className="opacity-60" />
        <div className="container mx-auto text-center relative z-10">
          <div className="mb-8 flex justify-center">
            <Logo size="xl" className="animate-pulse-slow" />
          </div>
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 animate-gradient mb-6 animate-fadeInUp">{t('app.title')}</h1>
          {/* 融资公告 */}
          <div className="max-w-2xl mx-auto mb-6 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <div className="p-3 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg text-center border border-purple-200 shadow-sm">
              <p className="text-purple-800 text-lg font-bold mb-1">{t('home.features.funding.title')}</p>
              <p className="text-purple-700">{t('home.features.funding.description')}</p>
            </div>
          </div>
          <h2 className="text-3xl font-semibold text-purple-600 mb-6 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
            {t('home.hero.subtitle')}
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-10 animate-fadeInUp" style={{animationDelay: '0.6s'}}>
            {t('home.hero.description')}
          </p>
          <div className="flex justify-center space-x-4 animate-fadeInUp" style={{animationDelay: '0.9s'}}>
            <Link to="/start-experience" className="relative overflow-hidden group bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <span className="relative z-10">{t('home.hero.cta')}</span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"></span>
            </Link>
            <a href="https://mvp-test.uploadsoul.com" target="_blank" rel="noopener noreferrer" className="relative overflow-hidden group bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <span className="relative z-10">{t('home.hero.mvpTest')}</span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"></span>
            </a>
            <Link to="/about" className="border border-purple-600 text-purple-600 px-8 py-3 rounded-lg hover:bg-purple-50 transition shadow hover:shadow-md">
              {t('header.about')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white relative">
        <WaveAnimation className="h-24" opacity={0.05} />
        <div className="container mx-auto relative z-10">
          <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600 animate-gradient mb-4">{t('home.features.title')}</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12 animate-fadeInUp">{t('home.features.description')}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Digital Immortality Feature */}
            <Link to="/digital-immortality" className="block h-full">
              <div className="p-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl transform hover:scale-105 transition duration-300 shadow-lg group animate-fadeInUp h-full flex flex-col" style={{animationDelay: '0.5s'}}>
                <div className="flex justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m0-15C8.625 4.5 6 7.125 6 10.5c0 1.5.75 3.75 3 5.25 2.25 1.5 3 2.25 3 3.75m0-15c3.375 0 6 2.625 6 6 0 1.5-.75 3.75-3 5.25-2.25 1.5-3 2.25-3 3.75" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center text-white mb-3">{t('home.features.digitalImmortality.title')}</h3>
                <p className="text-white text-center opacity-90 flex-grow">
                  {t('home.features.digitalImmortality.description')}
                </p>
                <div className="mt-4 flex justify-center">
                  <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-medium">{t('common.startExperience')}</span>
                </div>
                <div className="w-full h-1 bg-white/30 rounded-full mt-4 overflow-hidden">
                  <div className="h-full w-1/2 bg-white animate-shimmer"></div>
                </div>
              </div>
            </Link>

            {/* Digital Rebirth Feature */}
            <Link to="/digital-rebirth" className="block h-full">
              <div className="p-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl transform hover:scale-105 transition duration-300 shadow-lg group animate-fadeInUp h-full flex flex-col" style={{animationDelay: '0.5s'}}>
                <div className="flex justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center text-white mb-3">{t('digitalRebirth.title')}</h3>
                <p className="text-white text-center opacity-90 flex-grow">
                  {t('digitalRebirth.description')}
                </p>
                <div className="mt-4 flex justify-center">
                  <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-medium">{t('digitalRebirth.startButton')}</span>
                </div>
                <div className="w-full h-1 bg-white/30 rounded-full mt-4 overflow-hidden">
                  <div className="h-full w-1/2 bg-white animate-shimmer"></div>
                </div>
              </div>
            </Link>

            {/* Virtual Partner Feature */}
            <Link to="/companion" className="block h-full">
              <div className="p-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition duration-300 group animate-fadeInUp h-full flex flex-col" style={{animationDelay: '0.5s'}}>
                <div className="flex justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                  <div className="relative">
                    <FeatureIllustrations type="virtualPartner" size="lg" />
                    <div className="absolute -top-1 -right-1 bg-white rounded-full w-6 h-6 flex items-center justify-center text-indigo-600 text-xs font-bold animate-pulse-slow">+</div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center text-white mb-3">{t('home.features.emotionalCompanion.title')}</h3>
                <p className="text-white text-center opacity-90 flex-grow">
                  {t('home.features.emotionalCompanion.description')}
                </p>
                <div className="mt-4 flex justify-center">
                  <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-medium">{t('common.startExperience')}</span>
                </div>
                <div className="w-full h-1 bg-white/30 rounded-full mt-4 overflow-hidden">
                  <div className="h-full w-1/2 bg-white animate-shimmer"></div>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Additional Features Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* 虚拟宠物 */}
            <Link to="/pet" className="block">
              <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl hover:shadow-md transition duration-300 flex items-center group animate-fadeInUp h-full" style={{animationDelay: '0.7s'}}>
                <div className="flex-shrink-0 mr-4 transition-transform duration-300 group-hover:rotate-6">
                  <div className="bg-white p-3 rounded-full shadow-md group-hover:shadow-lg transition-all">
                    <FeatureIllustrations type="virtualPet" size="md" />
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">{t('home.features.virtualPet.title')}</h3>
                  <p className="text-gray-600 max-w-sm">
                    {t('home.features.virtualPet.description')}
                  </p>
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">新功能</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* VR Experience Feature */}
            <Link to="/vr" className="block">
              <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl hover:shadow-md transition duration-300 flex items-center group animate-fadeInUp h-full" style={{animationDelay: '0.7s'}}>
                <div className="flex-shrink-0 mr-4 transition-transform duration-300 group-hover:rotate-6">
                  <div className="bg-white p-3 rounded-full shadow-md group-hover:shadow-lg transition-all">
                    <FeatureIllustrations type="virtualReality" size="md" />
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">{t('home.features.vrExperience.title')}</h3>
                  <p className="text-gray-600 max-w-sm">
                    {t('home.features.vrExperience.description')}
                  </p>
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">新功能</span>
                  </div>
                </div>
              </div>
            </Link>
            
            {/* Digital World Feature */}
            <Link to="/digital-world" className="block">
              <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl hover:shadow-md transition duration-300 flex items-center group animate-fadeInUp h-full" style={{animationDelay: '0.9s'}}>
                <div className="flex-shrink-0 mr-4 transition-transform duration-300 group-hover:rotate-6">
                  <div className="bg-white p-3 rounded-full shadow-md group-hover:shadow-lg transition-all">
                    <FeatureIllustrations type="digitalWorld" size="md" />
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">{t('home.features.digitalWorld.title')}</h3>
                  <p className="text-gray-600 max-w-sm">
                    {t('home.features.digitalWorld.description')}
                  </p>
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">新功能</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 relative overflow-hidden">
        <HeroBackground animated={false} className="opacity-30" />
        <div className="container mx-auto text-center relative z-10">
          <div className="animate-fadeInUp">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 animate-gradient mb-6">{t('home.cta.title')}</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              {t('home.cta.description')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="w-full sm:w-auto">
              <button className="w-full px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                {t('home.cta.freeRegister')}
              </button>
            </Link>
            <Link to="/digital-human-experience" className="w-full sm:w-auto">
              <button className="w-full px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                {t('home.cta.digitalHumanExperience')}
              </button>
            </Link>
          </div>
          
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-gradient-to-tl from-purple-300/30 to-indigo-300/30 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -left-16 -bottom-8 w-48 h-48 bg-gradient-to-tr from-indigo-300/30 to-purple-300/30 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1.5s'}}></div>
        </div>
        <WaveAnimation className="bottom-0 left-0" color="#7C3AED" opacity={0.1} />
      </section>
    </div>
  );
};

export default HomePage; 