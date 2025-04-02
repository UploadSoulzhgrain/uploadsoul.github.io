import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">关于 UploadSoul 传灵</h1>
            <p className="text-xl text-purple-100 mb-8">
              打造全球领先的数字情感陪伴平台
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                to="/contact" 
                className="bg-white text-purple-600 px-6 py-2 rounded-full font-medium hover:bg-purple-50 transition-colors"
              >
                联系我们
              </Link>
              <Link 
                to="/join" 
                className="border-2 border-white text-white px-6 py-2 rounded-full font-medium hover:bg-white/10 transition-colors"
              >
                加入我们
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Company Introduction */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6">
                UploadSoul传灵是一家注册于加拿大温哥华的初创科技责任有限公司，致力于打造全球领先的基于人工智能与全息虚拟技术的数字情感陪伴平台。为用户提供全方位、沉浸式的情感陪伴解决方案。
              </p>
              
              <p className="text-gray-700 leading-relaxed">
                UploadSoul以"数字永生"与"全息情感陪伴"为核心竞争力，通过融合前沿AI、大数据与VR沉浸技术，开创了全新的情感陪伴生态。凭借精准的市场定位、先进的技术体系和国际化战略布局，我们有信心在未来几年内实现高速增长并占据全球情感陪伴市场的重要份额。
              </p>
            </div>
          </div>

          {/* Key Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">技术创新</h3>
              </div>
              <p className="text-gray-600">
                融合前沿AI、大数据与VR沉浸技术，打造独特的数字情感生态
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">全球布局</h3>
              </div>
              <p className="text-gray-600">
                国际化战略布局，致力于服务全球用户
              </p>
            </div>
          </div>

          {/* Investment Section */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white shadow-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">天使轮融资</h3>
            </div>
            <p className="text-lg text-purple-100 mb-6">
              目前正在进行天使轮融资，期待与您携手，共同推动数字情感新时代的到来，并实现共赢发展。
            </p>
            <Link 
              to="/contact" 
              className="inline-block bg-white text-purple-600 px-6 py-2 rounded-full font-medium hover:bg-purple-50 transition-colors"
            >
              了解更多
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 