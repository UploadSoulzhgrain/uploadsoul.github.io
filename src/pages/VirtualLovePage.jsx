import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const VirtualLovePage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4">
      <div className="container mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-4">
            {t('header.virtualLove')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            在虚拟世界中寻找真爱，体验超越现实的浪漫
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* AI Matchmaking */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">AI智能匹配</h3>
            <p className="text-gray-600">基于深度学习的智能匹配系统，为您找到最适合的虚拟伴侣</p>
          </div>

          {/* Virtual Dating */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">虚拟约会</h3>
            <p className="text-gray-600">在精心设计的虚拟场景中，体验浪漫的约会时光</p>
          </div>

          {/* Emotional Connection */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">情感连接</h3>
            <p className="text-gray-600">通过先进的情感计算技术，建立真实的情感连接</p>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <Link
            to="/virtual-love/match"
            className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition duration-300"
          >
            开始寻找真爱
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VirtualLovePage; 