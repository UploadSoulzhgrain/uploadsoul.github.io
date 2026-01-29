import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

const DashboardPage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();

    // 管理员权限检查
    const adminEmails = ['zhgrain@hotmail.com', 'uploadsoul@outlook.com'];
    const isAdmin = user?.email && adminEmails.includes(user.email);

    const [stats, setStats] = useState({
        todayVisits: 0,
        weekVisits: 0,
        totalUsers: 0,
        activeNow: 0
    });

    useEffect(() => {
        if (!isAdmin) return;

        const fetchStats = async () => {
            // 1. 获取注册用户总数 (模拟从 auth.users 获取，通常需要专门的 profiles 表)
            const { count: usersCount } = await supabase
                .from('user_activity') // 假设我们用这个表记录活跃用户
                .select('*', { count: 'exact', head: true });

            // 2. 获取今日访问 (site_analytics)
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const { count: todayCount } = await supabase
                .from('site_analytics')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', today.toISOString());

            // 3. 获取本周访问
            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            const { count: weekCount } = await supabase
                .from('site_analytics')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', lastWeek.toISOString());

            setStats({
                todayVisits: todayCount || 0,
                weekVisits: weekCount || 0,
                totalUsers: usersCount || 0,
                activeNow: Math.floor(Math.random() * 5) + 1 // 临时模拟在线人数
            });
        };

        fetchStats();
        const interval = setInterval(fetchStats, 60000); // 每一分钟刷新一次
        return () => clearInterval(interval);
    }, [isAdmin]);

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
                        <span className="text-gray-400">欢迎回来,</span> <span className="text-amber-500">{user?.user_metadata?.nickname || user?.email?.split('@')[0]}</span>
                    </h1>
                    <p className="text-gray-400">这是您的数字灵魂控制中心。</p>
                </div>

                {/* 管理员专供数据面板 */}
                {isAdmin && (
                    <div className="mb-12 animate-fadeIn">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
                            <h2 className="text-xl font-bold">系统运营概览 (仅管理员可见)</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
                                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">今日访客</p>
                                <h4 className="text-3xl font-serif font-bold text-amber-500">{stats.todayVisits}</h4>
                                <div className="mt-2 text-[10px] text-gray-500 italic">24小时内访问量</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
                                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">本周访客</p>
                                <h4 className="text-3xl font-serif font-bold text-blue-400">{stats.weekVisits}</h4>
                                <div className="mt-2 text-[10px] text-gray-500 italic">过去7天累计</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
                                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">总注册人数</p>
                                <h4 className="text-3xl font-serif font-bold text-purple-400">{stats.totalUsers}</h4>
                                <div className="mt-2 text-[10px] text-gray-500 italic">所有登记的灵魂坐标</div>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
                                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">当前在线</p>
                                <div className="flex items-center gap-2">
                                    <h4 className="text-3xl font-serif font-bold text-green-400">{stats.activeNow}</h4>
                                    <span className="flex h-3 w-3 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                </div>
                                <div className="mt-2 text-[10px] text-gray-500 italic">实时活跃监测</div>
                            </div>
                        </div>
                    </div>
                )}

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
