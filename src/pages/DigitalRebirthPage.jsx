import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import HeroBackground from '../components/common/HeroBackground';
import WaveAnimation from '../components/animations/WaveAnimation';

const DigitalRebirthPage = () => {
  const { t } = useTranslation();
  const [activeFeature, setActiveFeature] = useState('dataAnalysis');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    document.title = `${t('digitalRebirth.title')} - UploadSoul`;
  }, [t]);

  const features = [
    {
      id: 'dataAnalysis',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'digitalRebirth.features.dataAnalysis',
      description: 'Our advanced AI analyzes vast amounts of personal data to understand patterns, preferences, and unique characteristics that define an individual's digital identity.',
      imageUrl: '/assets/images/data-analysis.jpg'
    },
    {
      id: 'personalityReconstruction',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
        </svg>
      ),
      title: 'digitalRebirth.features.personalityReconstruction',
      description: 'Using neural mapping and behavioral analysis, we reconstruct personality traits, communication styles, and emotional responses to create an authentic digital representation.',
      imageUrl: '/assets/images/personality.jpg'
    },
    {
      id: 'memorySynthesis',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'digitalRebirth.features.memorySynthesis',
      description: 'We synthesize memories from personal stories, photographs, videos, and other shared experiences to form a cohesive narrative memory bank for your digital counterpart.',
      imageUrl: '/assets/images/memory.jpg'
    },
    {
      id: 'learningAlgorithm',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'digitalRebirth.features.learningAlgorithm',
      description: 'Our proprietary continuous learning algorithm allows your digital self to evolve, adapt, and grow based on new interactions and information, just as a human would.',
      imageUrl: '/assets/images/learning.jpg'
    }
  ];

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <HeroBackground className="opacity-50" />
        <div className="container mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-6"
          >
            {t('digitalRebirth.title')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl text-gray-700 max-w-3xl mx-auto mb-10"
          >
            {t('digitalRebirth.description')}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="inline-flex"
          >
            <button 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition transform hover:-translate-y-1"
            >
              {t('digitalRebirth.startButton')}
            </button>
          </motion.div>
        </div>
        <WaveAnimation className="absolute bottom-0 left-0 w-full" opacity={0.1} />
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600 mb-4">
              {t('digitalRebirth.title')} {t('home.features.process')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('digitalRebirth.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                variants={featureVariants}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveFeature(feature.id)}
                className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                  activeFeature === feature.id 
                    ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg' 
                    : 'bg-white border border-gray-200 hover:border-purple-300 hover:shadow'
                }`}
              >
                <div className={`flex justify-center mb-4 ${activeFeature === feature.id ? 'text-white' : 'text-purple-600'}`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-semibold text-center mb-2 ${activeFeature === feature.id ? 'text-white' : 'text-gray-800'}`}>
                  {t(feature.title)}
                </h3>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 shadow"
          >
            {features.map((feature) => (
              feature.id === activeFeature && (
                <div key={feature.id} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-purple-800 mb-4">
                      {t(feature.title)}
                    </h3>
                    <p className="text-gray-700 mb-6">
                      {feature.description}
                    </p>
                    <div className="flex space-x-2">
                      <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">AI-Powered</div>
                      <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">Advanced</div>
                    </div>
                  </div>
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <div className="bg-gray-200 h-64 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 opacity-70"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600 mb-4">
              {t('home.howItWorks')}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('digitalRebirth.description')}
            </p>
          </div>

          <motion.div
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            <motion.div variants={featureVariants} className="bg-white rounded-xl p-8 shadow-lg relative">
              <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 mt-2">
                {t('digitalHuman.creation.step1Title')}
              </h3>
              <p className="text-gray-600">
                Start by providing basic information and background details to lay the foundation for your digital rebirth process.
              </p>
            </motion.div>

            <motion.div variants={featureVariants} className="bg-white rounded-xl p-8 shadow-lg relative">
              <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 mt-2">
                {t('digitalHuman.creation.step2Title')}
              </h3>
              <p className="text-gray-600">
                Upload photos, video content, and visual data to help create a realistic visual representation of your digital self.
              </p>
            </motion.div>

            <motion.div variants={featureVariants} className="bg-white rounded-xl p-8 shadow-lg relative">
              <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 mt-2">
                {t('digitalHuman.creation.step3Title')}
              </h3>
              <p className="text-gray-600">
                Upload voice samples and audio recordings to create an accurate voice model that sounds just like you.
              </p>
            </motion.div>
          </motion.div>
          
          <div className="mt-12 text-center">
            <motion.button 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition transform hover:-translate-y-1"
            >
              {t('digitalRebirth.startButton')}
            </motion.button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-6">
              {t('digitalRebirth.title')}
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Begin your journey to digital immortality today. Experience the future of digital existence.
            </p>
            <div className="inline-flex">
              <button 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-4 rounded-lg hover:shadow-xl transition transform hover:-translate-y-1 text-lg font-medium"
              >
                {t('digitalRebirth.startButton')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DigitalRebirthPage;