import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const DigitalRebirthPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-8">
            {t('digitalRebirth.title')}
          </h1>
          <p className="text-xl text-gray-600 text-center mb-12">{t('digitalRebirth.description')}</p>

          {/* 新功能导航 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Link to="/digital-rebirth/reunion-space">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('reunionSpace.title')}</h2>
                <p className="text-gray-600 mb-4">{t('reunionSpace.description')}</p>
                <div className="text-purple-600 font-medium">→ {t('reunionSpace.startReunion')}</div>
              </motion.div>
            </Link>

            <Link to="/digital-rebirth/family-tree">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('familyTree.title')}</h2>
                <p className="text-gray-600 mb-4">{t('familyTree.description')}</p>
                <div className="text-purple-600 font-medium">→ {t('familyTree.viewDetails')}</div>
              </motion.div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Memory Digitization */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('digitalRebirth.features.memoryDigitization.title')}</h2>
              <p className="text-gray-600 mb-4">
                {t('digitalRebirth.features.memoryDigitization.description')}
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• {t('digitalRebirth.features.memoryDigitization.points.0')}</li>
                <li>• {t('digitalRebirth.features.memoryDigitization.points.1')}</li>
                <li>• {t('digitalRebirth.features.memoryDigitization.points.2')}</li>
                <li>• {t('digitalRebirth.features.memoryDigitization.points.3')}</li>
              </ul>
            </motion.div>

            {/* AI Training System */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('digitalRebirth.features.aiTraining.title')}</h2>
              <p className="text-gray-600 mb-4">
                {t('digitalRebirth.features.aiTraining.description')}
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• {t('digitalRebirth.features.aiTraining.points.0')}</li>
                <li>• {t('digitalRebirth.features.aiTraining.points.1')}</li>
                <li>• {t('digitalRebirth.features.aiTraining.points.2')}</li>
                <li>• {t('digitalRebirth.features.aiTraining.points.3')}</li>
              </ul>
            </motion.div>

            {/* Hardware Integration */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('digitalRebirth.features.hardwareIntegration.title')}</h2>
              <p className="text-gray-600 mb-4">
                {t('digitalRebirth.features.hardwareIntegration.description')}
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• {t('digitalRebirth.features.hardwareIntegration.points.0')}</li>
                <li>• {t('digitalRebirth.features.hardwareIntegration.points.1')}</li>
                <li>• {t('digitalRebirth.features.hardwareIntegration.points.2')}</li>
                <li>• {t('digitalRebirth.features.hardwareIntegration.points.3')}</li>
              </ul>
            </motion.div>

            {/* Continuous Evolution */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('digitalRebirth.features.continuousEvolution.title')}</h2>
              <p className="text-gray-600 mb-4">
                {t('digitalRebirth.features.continuousEvolution.description')}
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• {t('digitalRebirth.features.continuousEvolution.points.0')}</li>
                <li>• {t('digitalRebirth.features.continuousEvolution.points.1')}</li>
                <li>• {t('digitalRebirth.features.continuousEvolution.points.2')}</li>
                <li>• {t('digitalRebirth.features.continuousEvolution.points.3')}</li>
              </ul>
            </motion.div>
          </div>

          <div className="mt-12 text-center">
            <Link 
              to="/digital-rebirth/create" 
              className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              {t('digitalRebirth.startButton')}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DigitalRebirthPage;