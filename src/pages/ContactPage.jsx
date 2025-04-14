import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ContactPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 实现表单提交逻辑
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12 text-purple-400">
            联系我们
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* 联系信息 */}
            <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-purple-400 mb-6">联系方式</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">地址</h3>
                  <p className="text-gray-400">加拿大温哥华</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">邮箱</h3>
                  <p className="text-gray-400">uploadsoul@outlook.com</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">工作时间</h3>
                  <p className="text-gray-400">周一至周五: 9:00 - 18:00</p>
                </div>
              </div>
            </div>

            {/* 联系表单 */}
            <div className="bg-gray-800 rounded-lg p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-purple-400 mb-6">发送消息</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    姓名
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    邮箱
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    主题
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    消息
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  发送消息
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 