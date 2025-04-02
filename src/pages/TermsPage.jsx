import React from 'react';
import { useTranslation } from 'react-i18next';

const TermsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12 text-purple-400">
            服务条款
          </h1>

          <div className="bg-gray-800 rounded-lg p-8 shadow-xl space-y-8">
            {/* 服务说明 */}
            <section>
              <h2 className="text-2xl font-bold text-purple-400 mb-4">服务说明</h2>
              <p className="text-gray-300 leading-relaxed">
                UploadSoul传灵提供数字情感陪伴和数字永生服务。使用我们的服务即表示您同意遵守本服务条款。
              </p>
            </section>

            {/* 用户责任 */}
            <section>
              <h2 className="text-2xl font-bold text-purple-400 mb-4">用户责任</h2>
              <p className="text-gray-300 leading-relaxed">
                用户在使用我们的服务时应：
              </p>
              <ul className="list-disc list-inside text-gray-300 mt-2 space-y-2">
                <li>遵守相关法律法规</li>
                <li>保护账号安全</li>
                <li>尊重他人隐私</li>
                <li>不得从事任何违法或不当行为</li>
              </ul>
            </section>

            {/* 知识产权 */}
            <section>
              <h2 className="text-2xl font-bold text-purple-400 mb-4">知识产权</h2>
              <p className="text-gray-300 leading-relaxed">
                所有服务内容的知识产权归UploadSoul传灵所有。未经授权，不得使用、复制或传播。
              </p>
            </section>

            {/* 免责声明 */}
            <section>
              <h2 className="text-2xl font-bold text-purple-400 mb-4">免责声明</h2>
              <p className="text-gray-300 leading-relaxed">
                我们不对因不可抗力或用户自身原因造成的损失承担责任。服务可能因维护或升级而暂时中断。
              </p>
            </section>

            {/* 条款修改 */}
            <section>
              <h2 className="text-2xl font-bold text-purple-400 mb-4">条款修改</h2>
              <p className="text-gray-300 leading-relaxed">
                我们保留随时修改本服务条款的权利。修改后的条款将在网站上公布。
              </p>
            </section>

            {/* 联系方式 */}
            <section>
              <h2 className="text-2xl font-bold text-purple-400 mb-4">联系方式</h2>
              <p className="text-gray-300 leading-relaxed">
                如果您对本服务条款有任何疑问，请联系我们：
              </p>
              <div className="mt-2">
                <p className="text-gray-300">邮箱：terms@uploadsoul.com</p>
                <p className="text-gray-300">地址：加拿大温哥华</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage; 