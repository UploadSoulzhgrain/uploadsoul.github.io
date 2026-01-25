import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();

    // 模拟资产数据
    const digitalAssets = [
        { id: 1, type: 'digital-human', name: '我的初号机', status: 'ready', date: '2023-10-24' },
        { id: 2, type: 'memory', name: '家庭相册备份', status: 'processing', date: '2023-10-25' },
    ];

    return (
        <div className="min-h-screen bg-tech-mesh text-white pt-20">
            <div className="container mx-auto px-4 py-8">

                {/* 欢迎区 */}
                <div className="mb-12">
                    <h1 className="text-3xl font-bold mb-2">
                        <span className="text-gray-400">欢迎回来,</span> <span className="text-amber-500">{user?.email?.split('@')[0]}</span>
                    </h1>
                    <p className="text-gray-400">这是您的数字灵魂控制中心。</p>
                </div>

                {/* 快捷操作卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Link to="/digital-immortality/create" className="card-premium p-6 group hover:border-amber-500/50 transition-colors">
                        <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500 mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold mb-1">创建数字人</h3>
                        <p className="text-sm text-gray-500">开始构建您的专属 AI 伴侣或数字分身。</p>
                    </Link>

                    <Link to="/companion" className="card-premium p-6 group hover:border-amber-500/50 transition-colors">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold mb-1">继续聊天</h3>
                        <p className="text-sm text-gray-500">与您的数字灵魂伴侣进行深度对话。</p>
                    </Link>

                    <Link to="/digital-rebirth/reunion-space" className="card-premium p-6 group hover:border-amber-500/50 transition-colors">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold mb-1">团聚空间</h3>
                        <p className="text-sm text-gray-500">进入 VR 空间，与数字人全息互动。</p>
                    </Link>
                </div>

                {/* 资产库 (Asset Library) */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">资产库 (Asset Library)</h2>
                        <button className="text-sm text-amber-500 hover:text-amber-400">查看全部</button>
                    </div>

                    <div className="bg-[#12121A] border border-white/5 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-gray-400 text-xs uppercase px-6 py-3">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">资产名称</th>
                                        <th className="px-6 py-4 font-medium">类型</th>
                                        <th className="px-6 py-4 font-medium">创建日期</th>
                                        <th className="px-6 py-4 font-medium">状态</th>
                                        <th className="px-6 py-4 font-medium text-right">操作</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {digitalAssets.map((asset) => (
                                        <tr key={asset.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
                                                        <span className="text-xl">🤖</span>
                                                    </div>
                                                    <span className="font-medium">{asset.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 text-sm">
                                                {asset.type === 'digital-human' ? '数字人模型' : '记忆档案'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-400 text-sm">{asset.date}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${asset.status === 'ready'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {asset.status === 'ready' ? '已就绪' : '处理中'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-amber-500 hover:text-white text-sm font-medium mr-4">编辑</button>
                                                <button className="text-gray-500 hover:text-white text-sm">删除</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* 空状态占位 (如果列表为空) */}
                        {digitalAssets.length === 0 && (
                            <div className="py-16 text-center">
                                <div className="text-4xl mb-4">📂</div>
                                <h3 className="text-lg font-medium text-gray-300">暂无数字资产</h3>
                                <p className="text-gray-500 mb-6">您还没有创建任何数字人或记忆存档</p>
                                <Link to="/digital-immortality/create" className="btn-premium inline-block text-sm">
                                    立即创建
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default DashboardPage;
