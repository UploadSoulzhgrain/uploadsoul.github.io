import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-purple-400 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-300 mb-6">页面未找到</h2>
        <p className="text-gray-400 mb-8">
          抱歉，您访问的页面不存在或已被移除。
        </p>
        <Link 
          to="/" 
          className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage; 