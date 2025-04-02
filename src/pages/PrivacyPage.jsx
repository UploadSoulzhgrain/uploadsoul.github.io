import React from 'react';
import { useTranslation } from 'react-i18next';

const PrivacyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12 text-purple-400">
            隐私政策
          </h1>

          <div className="bg-gray-800 rounded-lg p-8 shadow-xl space-y-8">
            {/* 信息收集 */}
            <section>
              <h2 className="text-2xl font-bold text-purple-400 mb-4">信息收集</h2>
              <p className="text-gray-300 leading-relaxed">
                我们收集的信息包括但不限于：
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-2 space-y-2">
                <li>个人基本信息（姓名、邮箱、联系方式等）</li>
                <li>使用数据（访问记录、交互数据等）</li>
                <li>上传的内容（照片、视频、文字等）</li>
                <li>设备信息（设备型号、操作系统等）</li>
              </ul>
            </section>

            {/* 信息使用 */}
            <section>
              <h2 className="text-2xl font-bold text-purple-400 mb-4">信息使用</h2>
              <p className="text-gray-300 leading-relaxed">
                我们使用收集的信息用于：
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-2 space-y-2">
                <li>提供和改进我们的服务</li>
                <li>个性化用户体验</li>
                <li>发送服务通知和更新</li>
                <li>防止欺诈和确保安全</li>
              </ul>
            </section>

            {/* 信息保护 */}
            <section>
              <h2 className="text-2xl font-bold text-purple-400 mb-4">信息保护</h2>
              <p className="text-gray-300 leading-relaxed">
                我们采取多种安全措施保护您的信息：
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-2 space-y-2">
                <li>数据加密存储和传输</li>
                <li>访问控制和权限管理</li>
                <li>定期安全审计</li>
                <li>员工保密培训</li>
              </ul>
            </section>

            {/* 信息共享 */}
            <section>
              <h2 className="text-2xl font-bold text-purple-400 mb-4">信息共享</h2>
              <p className="text-gray-300 leading-relaxed">
                我们不会将您的信息出售或出租给第三方。仅在以下情况下可能共享信息：
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-2 space-y-2">
                <li>获得您的明确同意</li>
                <li>法律要求</li>
                <li>保护我们的合法权益</li>
                <li>与授权合作伙伴共享必要信息</li>
              </ul>
            </section>

            {/* 用户权利 */}
            <section>
              <h2 className="text-2xl font-bold text-purple-400 mb-4">用户权利</h2>
              <p className="text-gray-300 leading-relaxed">
                您对个人信息拥有以下权利：
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-2 space-y-2">
                <li>访问和查看个人信息</li>
                <li>更正或更新个人信息</li>
                <li>删除个人信息</li>
                <li>撤回同意授权</li>
              </ul>
            </section>

            {/* 政策更新 */}
            <section>
              <h2 className="text-2xl font-bold text-purple-400 mb-4">政策更新</h2>
              <p className="text-gray-300 leading-relaxed">
                我们可能会不时更新本隐私政策。更新后的政策将在网站上公布，并标注更新时间。建议您定期查看本政策。
              </p>
            </section>

            {/* 联系我们 */}
            <section>
              <h2 className="text-2xl font-bold text-purple-400 mb-4">联系我们</h2>
              <p className="text-gray-300 leading-relaxed">
                如果您对本隐私政策有任何疑问或建议，请通过以下方式联系我们：
              </p>
              <div className="mt-2">
                <p className="text-gray-300">邮箱：privacy@uploadsoul.com</p>
                <p className="text-gray-300">地址：加拿大温哥华</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage; 