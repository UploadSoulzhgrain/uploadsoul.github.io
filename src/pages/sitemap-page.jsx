import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const SitemapPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">网站地图</h1>
        <div className="max-w-3xl mx-auto space-y-8">
          <section className="bg-gray-800 rounded-lg p-8 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4">主要页面</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-purple-400 hover:text-purple-300">
                  首页
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-purple-400 hover:text-purple-300">
                  关于我们
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-purple-400 hover:text-purple-300">
                  团队
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-purple-400 hover:text-purple-300">
                  联系我们
                </Link>
              </li>
            </ul>
          </section>

          <section className="bg-gray-800 rounded-lg p-8 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4">产品服务</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/companion" className="text-purple-400 hover:text-purple-300">
                  数字人陪伴
                </Link>
              </li>
              <li>
                <Link to="/pet" className="text-purple-400 hover:text-purple-300">
                  数字宠物
                </Link>
              </li>
              <li>
                <Link to="/virtual-love" className="text-purple-400 hover:text-purple-300">
                  虚拟恋爱
                </Link>
              </li>
              <li>
                <Link to="/digital-immortality" className="text-purple-400 hover:text-purple-300">
                  数字永生
                </Link>
              </li>
              <li>
                <Link to="/vr" className="text-purple-400 hover:text-purple-300">
                  VR体验
                </Link>
              </li>
              <li>
                <Link to="/all-in-one" className="text-purple-400 hover:text-purple-300">
                  传灵一体机
                </Link>
              </li>
              <li>
                <Link to="/digital-rebirth" className="text-purple-400 hover:text-purple-300">
                  数字重生
                </Link>
              </li>
              <li>
                <Link to="/digital-rebirth/reunion-space" className="text-purple-400 hover:text-purple-300">
                  团聚空间
                </Link>
              </li>
              <li>
                <Link to="/digital-rebirth/family-tree" className="text-purple-400 hover:text-purple-300">
                  家族族谱
                </Link>
              </li>
            </ul>
          </section>

          <section className="bg-gray-800 rounded-lg p-8 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4">法律信息</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-purple-400 hover:text-purple-300">
                  隐私政策
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-purple-400 hover:text-purple-300">
                  服务条款
                </Link>
              </li>
            </ul>
          </section>

          <section className="bg-gray-800 rounded-lg p-8 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4">其他</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/join" className="text-purple-400 hover:text-purple-300">
                  加入我们
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-purple-400 hover:text-purple-300">
                  商城
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SitemapPage; 