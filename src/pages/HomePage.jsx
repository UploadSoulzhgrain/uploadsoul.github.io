import React from 'react';
import { Link } from 'react-router-dom';
import HeroBackground from '../components/common/HeroBackground';
import WaveAnimation from '../components/animations/WaveAnimation';
import AnimationStyles from '../components/animations/AnimationStyles';
import Logo from '../components/common/Logo';
import FeatureIllustrations from '../components/common/FeatureIllustrations';

const HomePage = () => {
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
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 animate-gradient mb-6 animate-fadeInUp">UploadSoul 传灵</h1>
          <h2 className="text-3xl font-semibold text-purple-600 mb-6 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
            虚拟世界，数字永生
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 animate-fadeInUp" style={{animationDelay: '0.6s'}}>
            打造您专属的数字伴侣，超越时间的永恒陪伴
          </p>
          <div className="flex justify-center space-x-4 animate-fadeInUp" style={{animationDelay: '0.9s'}}>
            <Link to="/companion" className="relative overflow-hidden group bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <span className="relative z-10">开始体验</span>
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"></span>
            </Link>
            <Link to="/about" className="border border-purple-600 text-purple-600 px-8 py-3 rounded-lg hover:bg-purple-50 transition shadow hover:shadow-md">
              了解更多
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white relative">
        <WaveAnimation className="h-24" opacity={0.05} />
        <div className="container mx-auto relative z-10">
          <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600 animate-gradient mb-4">平台特色</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12 animate-fadeInUp">全维度数字灵魂体验，让每一次互动充满温度与情感</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Digital Immortality Feature */}
            <Link to="/digital-human" className="block">
              <div className="p-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl transform hover:scale-105 transition duration-300 shadow-lg group animate-fadeInUp" style={{animationDelay: '0.1s'}}>
                <div className="flex justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <FeatureIllustrations type="digitalImmortality" size="lg" />
                </div>
                <h3 className="text-xl font-bold text-center text-white mb-3">数字永生</h3>
                <p className="text-white text-center opacity-90">
                  突破时空限制，将您的思想、记忆和性格数字化，实现永恒的生命延续
                </p>
                <div className="mt-4 flex justify-center">
                  <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-medium">立即体验</span>
                </div>
                <div className="w-full h-1 bg-white/30 rounded-full mt-4 overflow-hidden">
                  <div className="h-full w-1/2 bg-white animate-shimmer"></div>
                </div>
              </div>
            </Link>
            
            {/* Emotional Companion Feature */}
            <div className="p-8 bg-white border border-purple-100 rounded-xl shadow-lg hover:shadow-xl transition duration-300 group animate-fadeInUp" style={{animationDelay: '0.3s'}}>
              <div className="flex justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 animate-bounce">
                <FeatureIllustrations type="emotionalCompanion" size="lg" />
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-3">情感陪伴</h3>
              <p className="text-gray-600 text-center">
                基于先进的情感计算技术，为您提供专属的情感支持和理解
              </p>
              <div className="flex justify-center mt-4">
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">AI 情感分析</span>
              </div>
            </div>
            
            {/* Virtual Partner Feature */}
            <div className="p-8 bg-white border border-purple-100 rounded-xl shadow-lg hover:shadow-xl transition duration-300 group animate-fadeInUp" style={{animationDelay: '0.5s'}}>
              <div className="flex justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
                <div className="relative">
                  <FeatureIllustrations type="virtualPartner" size="lg" />
                  <div className="absolute -top-1 -right-1 bg-indigo-500 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold animate-pulse-slow">+</div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-3">虚拟伙伴</h3>
              <p className="text-gray-600 text-center">
                多样化的AI虚拟伙伴，满足不同场景下的陪伴需求
              </p>
              <div className="flex justify-center space-x-1 mt-4">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              </div>
            </div>
          </div>
          
          {/* Additional Features Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Memory Game Feature */}
            <Link to="/games" className="block">
              <div className="p-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl transform hover:scale-105 transition duration-300 shadow-lg group animate-fadeInUp" style={{animationDelay: '0.5s'}}>
                <div className="flex justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center text-white mb-3">{t('games.memory.title')}</h3>
                <p className="text-white text-center opacity-90">
                  {t('games.memory.shortDescription')}
                </p>
                <div className="mt-4 flex justify-center">
                  <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-medium">{t('games.play')}</span>
                </div>
              </div>
            </Link>
            {/* VR Experience Feature */}
            <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl hover:shadow-md transition duration-300 flex items-center group animate-fadeInUp" style={{animationDelay: '0.7s'}}>
              <div className="flex-shrink-0 mr-4 transition-transform duration-300 group-hover:rotate-6">
                <div className="bg-white p-3 rounded-full shadow-md group-hover:shadow-lg transition-all">
                  <FeatureIllustrations type="virtualReality" size="md" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">VR沉浸体验</h3>
                <p className="text-gray-600 max-w-sm">
                  通过虚拟现实技术，实现更沉浸式的数字陪伴体验
                </p>
                <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">新功能</span>
                </div>
              </div>
            </div>
            
            {/* Digital World Feature */}
            <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl hover:shadow-md transition duration-300 flex items-center group animate-fadeInUp" style={{animationDelay: '0.9s'}}>
              <div className="flex-shrink-0 mr-4 transition-transform duration-300 group-hover:rotate-6">
                <div className="bg-white p-3 rounded-full shadow-md group-hover:shadow-lg transition-all">
                  <FeatureIllustrations type="digitalWorld" size="md" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">数字世界构建</h3>
                <p className="text-gray-600 max-w-sm">
                  创建属于您的专属数字世界，与您的数字伴侣共同探索
                </p>
                <div className="w-full h-1 bg-purple-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-purple-400 to-indigo-400 animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 relative overflow-hidden">
        <HeroBackground animated={false} className="opacity-30" />
        <div className="container mx-auto text-center relative z-10">
          <div className="animate-fadeInUp">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 animate-gradient mb-6">立即开启您的AI陪伴之旅</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              无论何时何地，都有专属于您的数字伙伴
            </p>
          </div>
          <div className="flex justify-center space-x-6 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
            <div className="group inline-block">
              <Link 
                to="/register" 
                className="relative overflow-hidden bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transition shadow-lg hover:shadow-xl transform group-hover:-translate-y-1 text-lg font-medium"
              >
                <span className="relative z-10">免费注册</span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out animate-gradient"></span>
              </Link>
              <div className="mt-2 text-purple-500 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                开启您的数字灵魂之旅
              </div>
            </div>
            
            <div className="group inline-block">
              <Link 
                to="/digital-human" 
                className="relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-4 rounded-lg hover:opacity-90 transition shadow-lg hover:shadow-xl transform group-hover:-translate-y-1 text-lg font-medium"
              >
                <span className="relative z-10">数字人体验</span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500 via-indigo-600 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out animate-gradient"></span>
              </Link>
              <div className="mt-2 text-indigo-500 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                创建您的数字永生体验
              </div>
            </div>
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