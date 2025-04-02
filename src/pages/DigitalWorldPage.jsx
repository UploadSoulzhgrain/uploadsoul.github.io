import React from 'react';

const DigitalWorldPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-purple-600 mb-8">数字世界构建</h1>
          <p className="text-xl text-gray-600 mb-12">
            创建属于您的专属数字世界，与您的数字伴侣共同探索
          </p>
          
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-purple-50 rounded-lg">
                <h3 className="text-xl font-semibold text-purple-600 mb-4">个性化定制</h3>
                <p className="text-gray-600">
                  根据您的喜好，定制专属的数字世界场景和风格。
                </p>
              </div>
              <div className="p-6 bg-indigo-50 rounded-lg">
                <h3 className="text-xl font-semibold text-indigo-600 mb-4">互动体验</h3>
                <p className="text-gray-600">
                  丰富的互动元素，让您的数字世界充满生机和趣味。
                </p>
              </div>
              <div className="p-6 bg-purple-50 rounded-lg">
                <h3 className="text-xl font-semibold text-purple-600 mb-4">社交功能</h3>
                <p className="text-gray-600">
                  邀请好友一起探索，分享您的数字世界。
                </p>
              </div>
              <div className="p-6 bg-indigo-50 rounded-lg">
                <h3 className="text-xl font-semibold text-indigo-600 mb-4">持续更新</h3>
                <p className="text-gray-600">
                  定期更新新的场景和功能，让您的数字世界不断进化。
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              即将推出
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalWorldPage; 