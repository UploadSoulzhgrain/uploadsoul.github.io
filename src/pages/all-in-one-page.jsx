import React from 'react';
import { useTranslation } from 'react-i18next';

const AllInOnePage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">{t('home.features.allInOne.title')}</h1>
        <div className="max-w-3xl mx-auto space-y-8">
          <section className="bg-gray-800 rounded-lg p-8 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4">产品介绍</h2>
            <p className="text-gray-300">
              传灵一体机是一款专为数字情感陪伴设计的智能设备，集成了先进的AI技术和全息投影系统，为用户提供沉浸式的数字情感体验。
            </p>
          </section>

          <section className="bg-gray-800 rounded-lg p-8 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4">核心功能</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>全息投影显示</li>
              <li>自然语言交互</li>
              <li>情感识别系统</li>
              <li>多场景适配</li>
              <li>云端数据同步</li>
            </ul>
          </section>

          <section className="bg-gray-800 rounded-lg p-8 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4">技术特点</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>4K全息显示技术</li>
              <li>深度学习AI系统</li>
              <li>实时情感分析</li>
              <li>低延迟交互体验</li>
              <li>安全数据加密</li>
            </ul>
          </section>

          <section className="bg-gray-800 rounded-lg p-8 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4">应用场景</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>家庭情感陪伴</li>
              <li>教育辅导</li>
              <li>医疗康复</li>
              <li>商务会议</li>
              <li>娱乐互动</li>
            </ul>
          </section>

          <section className="bg-gray-800 rounded-lg p-8 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4">联系我们</h2>
            <p className="text-gray-300">
              如果您对我们的产品感兴趣，欢迎通过以下方式联系我们：
            </p>
            <div className="mt-4 text-gray-300">
              <p>邮箱：contact@uploadsoul.com</p>
              <p>电话：+1 (604) XXX-XXXX</p>
              <p>地址：加拿大温哥华</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AllInOnePage; 