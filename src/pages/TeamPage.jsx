import React from 'react';
import { useTranslation } from 'react-i18next';

const TeamPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12 text-purple-400">
            我们的团队
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 创始人 */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
              <div className="text-center mb-4">
                <div className="w-32 h-32 mx-auto bg-gray-700 rounded-full mb-4"></div>
                <h3 className="text-xl font-bold text-purple-400">创始人</h3>
                <p className="text-gray-400">CEO & 创始人</p>
              </div>
              <p className="text-gray-300 text-center">
                拥有多年AI和VR技术研发经验，致力于将前沿科技应用于情感陪伴领域。
              </p>
            </div>

            {/* 技术团队 */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
              <div className="text-center mb-4">
                <div className="w-32 h-32 mx-auto bg-gray-700 rounded-full mb-4"></div>
                <h3 className="text-xl font-bold text-purple-400">技术团队</h3>
                <p className="text-gray-400">AI & VR 专家</p>
              </div>
              <p className="text-gray-300 text-center">
                来自全球顶尖科技公司的AI和VR专家，专注于数字情感和全息技术研发。
              </p>
            </div>

            {/* 产品团队 */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
              <div className="text-center mb-4">
                <div className="w-32 h-32 mx-auto bg-gray-700 rounded-full mb-4"></div>
                <h3 className="text-xl font-bold text-purple-400">产品团队</h3>
                <p className="text-gray-400">产品经理 & 设计师</p>
              </div>
              <p className="text-gray-300 text-center">
                专注于用户体验和产品设计，致力于打造最优质的数字情感陪伴产品。
              </p>
            </div>

            {/* 运营团队 */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
              <div className="text-center mb-4">
                <div className="w-32 h-32 mx-auto bg-gray-700 rounded-full mb-4"></div>
                <h3 className="text-xl font-bold text-purple-400">运营团队</h3>
                <p className="text-gray-400">市场 & 运营专家</p>
              </div>
              <p className="text-gray-300 text-center">
                拥有丰富的市场运营经验，致力于为用户提供最优质的服务体验。
              </p>
            </div>
          </div>

          {/* 加入我们 */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-purple-400 mb-4">加入我们</h2>
            <p className="text-gray-300 mb-8">
              我们正在寻找充满激情的人才加入团队，一起打造数字情感新时代。
            </p>
            <a 
              href="/join" 
              className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              查看职位
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPage; 