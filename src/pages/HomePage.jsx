import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">UploadSoul 传灵</h1>
          <h2 className="text-3xl font-semibold text-purple-600 mb-6">虚拟世界，数字永生</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            打造您专属的数字伴侣，超越时间的永恒陪伴
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/companion" className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition">
              开始体验
            </Link>
            <Link to="/about" className="border border-purple-600 text-purple-600 px-8 py-3 rounded-lg hover:bg-purple-50 transition">
              了解更多
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">平台特色</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-purple-600 rounded-xl transform hover:scale-105 transition duration-300 shadow-lg">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                  <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                  <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-white mb-2">数字永生</h3>
              <p className="text-white text-center">
                突破时空限制，将您的思想、记忆和性格数字化，实现永恒的生命延续
              </p>
            </div>
            <div className="p-6 bg-purple-50 rounded-xl hover:shadow-md transition duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.07 0 1 1 0 000 1.415z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">情感陪伴</h3>
              <p className="text-gray-600 text-center">
                基于先进的情感计算技术，为您提供专属的情感支持和理解
              </p>
            </div>
            <div className="p-6 bg-purple-50 rounded-xl hover:shadow-md transition duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center text-gray-900 mb-2">虚拟伙伴</h3>
              <p className="text-gray-600 text-center">
                多样化的AI虚拟伙伴，满足不同场景下的陪伴需求
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">立即开启您的AI陪伴之旅</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            无论何时何地，都有专属于您的数字伙伴
          </p>
          <Link to="/register" className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition">
            免费注册
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;