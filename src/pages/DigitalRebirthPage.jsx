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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 记忆数据化 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('digitalRebirth.features.memoryDigitization')}</h2>
              <p className="text-gray-600 mb-4">
                通过多种方式收集和数字化您的记忆：
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• 聊天记录分析</li>
                <li>• 照片和视频资料</li>
                <li>• 文字和笔记内容</li>
                <li>• 语音和视频记录</li>
              </ul>
            </motion.div>

            {/* AI训练系统 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('digitalRebirth.features.aiTraining')}</h2>
              <p className="text-gray-600 mb-4">
                先进的AI训练系统：
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• 深度学习模型训练</li>
                <li>• 自然语言处理优化</li>
                <li>• 情感识别系统</li>
                <li>• 个性化行为模拟</li>
              </ul>
            </motion.div>

            {/* 硬件集成 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('digitalRebirth.features.hardwareIntegration')}</h2>
              <p className="text-gray-600 mb-4">
                为未来硬件集成做准备：
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• 脑机接口预留</li>
                <li>• 硬件设备兼容</li>
                <li>• 数据迁移接口</li>
                <li>• 实时同步机制</li>
              </ul>
            </motion.div>

            {/* 持续进化 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('digitalRebirth.features.continuousEvolution')}</h2>
              <p className="text-gray-600 mb-4">
                持续学习和进化：
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• 自适应学习系统</li>
                <li>• 记忆更新机制</li>
                <li>• 性格特征优化</li>
                <li>• 交互体验提升</li>
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