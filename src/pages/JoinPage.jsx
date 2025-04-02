import React from 'react';
import { useTranslation } from 'react-i18next';

const JoinPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12 text-purple-400">
            加入我们
          </h1>

          {/* 公司介绍 */}
          <div className="bg-gray-800 rounded-lg p-8 shadow-xl mb-12">
            <h2 className="text-2xl font-bold text-purple-400 mb-6">关于我们</h2>
            <p className="text-gray-300 leading-relaxed">
              UploadSoul传灵是一家注册于加拿大温哥华的初创科技责任有限公司，致力于打造全球领先的基于人工智能与全息虚拟技术的数字情感陪伴平台。我们正在寻找充满激情的人才加入团队，一起打造数字情感新时代。
            </p>
          </div>

          {/* 职位列表 */}
          <div className="space-y-8">
            {/* AI工程师 */}
            <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
              <h3 className="text-xl font-bold text-purple-400 mb-4">AI工程师</h3>
              <div className="space-y-4">
                <p className="text-gray-300">
                  负责开发和优化AI模型，包括自然语言处理、计算机视觉和情感分析等领域。
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">Python</span>
                  <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">PyTorch</span>
                  <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">TensorFlow</span>
                  <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">NLP</span>
                </div>
                <button className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  申请职位
                </button>
              </div>
            </div>

            {/* VR开发工程师 */}
            <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
              <h3 className="text-xl font-bold text-purple-400 mb-4">VR开发工程师</h3>
              <div className="space-y-4">
                <p className="text-gray-300">
                  负责VR应用的开发和优化，包括3D场景构建、交互设计和性能优化。
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">Unity</span>
                  <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">Unreal Engine</span>
                  <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">C#</span>
                  <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">3D建模</span>
                </div>
                <button className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  申请职位
                </button>
              </div>
            </div>

            {/* 产品经理 */}
            <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
              <h3 className="text-xl font-bold text-purple-400 mb-4">产品经理</h3>
              <div className="space-y-4">
                <p className="text-gray-300">
                  负责产品规划和功能设计，确保产品满足用户需求并具有市场竞争力。
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">产品规划</span>
                  <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">用户研究</span>
                  <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">数据分析</span>
                  <span className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">项目管理</span>
                </div>
                <button className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  申请职位
                </button>
              </div>
            </div>
          </div>

          {/* 联系方式 */}
          <div className="mt-12 text-center">
            <p className="text-gray-300 mb-4">
              如果您对我们的职位感兴趣，请将简历发送至：
            </p>
            <a 
              href="mailto:careers@uploadsoul.com" 
              className="text-purple-400 hover:text-purple-300 transition-colors duration-300"
            >
              careers@uploadsoul.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinPage; 