import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Archive,
  ArrowRight,
  BookOpen,
  Brain,
  Building2,
  HeartHandshake,
  Home,
  Landmark,
  Layers,
  Map,
  Mic,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
  Video
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

async function authedFetch(session, url, options = {}) {
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
    Authorization: `Bearer ${session?.access_token}`
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `请求失败: ${response.status}`);
  }
  return response;
}

const personaLabels = {
  immortality: '数字永生',
  rebirth: '亲人重生',
  historical: '古人/名人重生',
  lover: '虚拟恋人',
  companion: '情感陪伴',
  test: '测试档案'
};

const statusLabels = {
  collecting: '采集中',
  voice_ready: '声音就绪',
  active: '可交互',
  archived: '已归档'
};

const getProfileWorkspace = (profile) => {
  if (!profile?.id) return '/dashboard';
  if (profile.persona_type === 'historical') return `/digital-rebirth/historical/${profile.id}`;
  if (profile.metadata?.mode === 'asset_vault' || profile.relationship === 'legacy') return `/digital-immortality/assets/${profile.id}`;
  return `/mvp-china?persona_type=${encodeURIComponent(profile.persona_type || 'immortality')}&profile_id=${encodeURIComponent(profile.id)}`;
};

const DashboardPage = () => {
  const { user, session } = useAuth();

  const adminEmails = ['zhgrain@hotmail.com', 'uploadsoul@outlook.com'];
  const isAdmin = user?.email && adminEmails.includes(user.email);

  const [stats, setStats] = useState({
    todayVisits: 0,
    weekVisits: 0,
    totalUsers: 0,
    activeNow: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [pathLogs, setPathLogs] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [assetCounts, setAssetCounts] = useState({});
  const [memoryCounts, setMemoryCounts] = useState({});
  const [loadingAssets, setLoadingAssets] = useState(false);

  useEffect(() => {
    if (!isAdmin) return undefined;

    const fetchStats = async () => {
      const { data: userData, count: usersCount } = await supabase
        .from('user_activity')
        .select('*', { count: 'exact' })
        .order('last_seen', { ascending: false })
        .limit(10);

      if (userData) setRecentUsers(userData);

      const { data: pathData } = await supabase
        .from('site_analytics')
        .select('*')
        .not('user_email', 'is', null)
        .order('created_at', { ascending: false })
        .limit(15);

      if (pathData) setPathLogs(pathData);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todayCount } = await supabase
        .from('site_analytics')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

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
        activeNow: Math.min(usersCount || 0, (userData?.filter(u => (new Date() - new Date(u.last_seen)) < 300000).length || 0) + 1)
      });
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  const loadAssets = useCallback(async () => {
    if (!session) return;
    setLoadingAssets(true);
    try {
      const response = await authedFetch(session, '/api/profiles');
      const data = await response.json();
      const nextProfiles = data.profiles || [];
      setProfiles(nextProfiles);

      const entries = await Promise.all(nextProfiles.map(async (profile) => {
        try {
          const [assetResponse, fragmentResponse] = await Promise.all([
            authedFetch(session, `/api/profile-assets?profile_id=${profile.id}`),
            authedFetch(session, `/api/memory/fragments?profile_id=${profile.id}`)
          ]);
          const assetData = await assetResponse.json();
          const fragmentData = await fragmentResponse.json();
          return [profile.id, assetData.assets || [], fragmentData.fragments || []];
        } catch {
          return [profile.id, [], []];
        }
      }));

      setAssetCounts(Object.fromEntries(entries.map(([id, assets]) => [id, assets.length])));
      setMemoryCounts(Object.fromEntries(entries.map(([id, , fragments]) => [id, fragments.length])));
    } catch {
      setProfiles([]);
      setAssetCounts({});
      setMemoryCounts({});
    } finally {
      setLoadingAssets(false);
    }
  }, [session]);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  const assetStats = useMemo(() => {
    const profileTotal = profiles.length;
    const rebirthTotal = profiles.filter(profile => ['rebirth', 'historical'].includes(profile.persona_type)).length;
    const immortalityTotal = profiles.filter(profile => profile.persona_type === 'immortality').length;
    const voiceReady = profiles.filter(profile => profile.elevenlabs_voice_id || profile.voice_sample_url || profile.status === 'voice_ready').length;
    const memoryTotal = Object.values(memoryCounts).reduce((sum, value) => sum + value, 0);
    const visualReady = profiles.filter(profile => profile.avatar_url).length;
    return { profileTotal, rebirthTotal, immortalityTotal, voiceReady, memoryTotal, visualReady };
  }, [memoryCounts, profiles]);

  const quickActions = [
    {
      title: '数字永生管理',
      note: '管理自我数字分身、数字资产传承档案和可授权内容。',
      to: '/digital-immortality',
      icon: Brain,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/20'
    },
    {
      title: '数字重生管理',
      note: '分别管理亲人重生、古人/名人重生和纪念型数字人。',
      to: '/digital-rebirth',
      icon: HeartHandshake,
      color: 'text-amber-500',
      bg: 'bg-amber-500/20'
    },
    {
      title: '记忆采集系统',
      note: '上传文字、语音、照片，继续沉淀可检索记忆层。',
      to: '/memory-system',
      icon: BookOpen,
      color: 'text-blue-400',
      bg: 'bg-blue-500/20'
    },
    {
      title: '测试工作台',
      note: '验证声音、形象、记忆、对话和溯源的完整链路。',
      to: '/mvp-china',
      icon: Sparkles,
      color: 'text-purple-400',
      bg: 'bg-purple-500/20'
    }
  ];

  const reunionLinks = [
    {
      title: '团聚空间',
      note: '亲人重生的沉浸式交互入口，未来接入 VR 场景与多人共处。',
      to: '/digital-rebirth/reunion-space',
      icon: Home
    },
    {
      title: '家族图谱',
      note: '把重生数字人放回家族关系中，形成关系、故事和传承脉络。',
      to: '/digital-rebirth/family-tree',
      icon: Users
    },
    {
      title: '家族星河',
      note: '用更具仪式感的方式浏览家族成员、纪念节点和共同记忆。',
      to: '/digital-rebirth/family-galaxy',
      icon: Map
    },
    {
      title: '历史人物馆',
      note: '面向教育、文旅和 IP 的古人/名人重生演示入口。',
      to: '/digital-rebirth/history-hall',
      icon: Landmark
    }
  ];

  const futureLinks = [
    { title: '背景商城演示', note: '海滩、老房子、客厅、书房等团聚场景资产。', to: '/shop', icon: ShoppingBag },
    { title: '生活道具演示', note: '相册、茶杯、家具、纪念物等未来互动道具。', to: '/shop', icon: Layers },
    { title: 'VR 空间演示', note: '为后续头显、空间音频和多人团聚预留入口。', to: '/vr', icon: Video },
    { title: '资产传承空间', note: '文件、家书、作品、授权规则和可查询资产库。', to: '/digital-immortality', icon: Archive }
  ];

  const statCards = [
    { label: '数字人档案', value: assetStats.profileTotal, icon: ShieldCheck },
    { label: '永生档案', value: assetStats.immortalityTotal, icon: Brain },
    { label: '重生档案', value: assetStats.rebirthTotal, icon: HeartHandshake },
    { label: '记忆片段', value: assetStats.memoryTotal, icon: BookOpen },
    { label: '声音样本', value: assetStats.voiceReady, icon: Mic },
    { label: '形象资产', value: assetStats.visualReady, icon: Building2 }
  ];

  return (
    <div className="min-h-screen bg-tech-mesh text-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-gray-400">欢迎回来,</span> <span className="text-amber-500">{user?.user_metadata?.nickname || user?.email?.split('@')[0]}</span>
            </h1>
            <p className="text-gray-400">这是你的数字资产与记忆系统控制中心。</p>
          </div>
          <button
            onClick={loadAssets}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:border-amber-500/40 hover:text-white transition-colors"
          >
            <RefreshCw size={14} className={loadingAssets ? 'animate-spin' : ''} />
            刷新资产
          </button>
        </div>

        {isAdmin && (
          <div className="mb-12 animate-fadeIn">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-6 bg-amber-500 rounded-full"></div>
              <h2 className="text-xl font-bold">系统运营概览</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                ['今日访客', stats.todayVisits, 'text-amber-500', '24小时内访问量'],
                ['本周访客', stats.weekVisits, 'text-blue-400', '过去7天累计'],
                ['总注册人数', stats.totalUsers, 'text-purple-400', '所有登记成员'],
                ['当前在线', stats.activeNow, 'text-green-400', '实时活跃监测']
              ].map(([label, value, color, note]) => (
                <div key={label} className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                  <h4 className={`text-3xl font-serif font-bold ${color}`}>{value}</h4>
                  <div className="mt-2 text-[10px] text-gray-500 italic">{note}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="bg-[#12121A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
                  <h3 className="font-bold text-gray-200">注册用户访问日志</h3>
                  <span className="text-[10px] px-2 py-1 bg-amber-500/10 text-amber-500 rounded uppercase font-bold tracking-tighter">Live</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <tbody className="divide-y divide-white/5 text-gray-300">
                      {recentUsers.map((item) => (
                        <tr key={item.user_id} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-medium text-amber-500/80">{item.email}</td>
                          <td className="px-6 py-4 text-xs">{new Date(item.last_seen).toLocaleString('zh-CN')}</td>
                          <td className="px-6 py-4 text-xs">{Math.floor((item.online_seconds_increment || 0) / 60)} 分钟</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-[#12121A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
                  <h3 className="font-bold text-gray-200">实时路径分析</h3>
                  <span className="text-[10px] text-blue-400 font-bold uppercase">Journey</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <tbody className="divide-y divide-white/5 text-gray-300">
                      {pathLogs.map((log, idx) => (
                        <tr key={`${log.path}-${idx}`} className="hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 text-gray-400">{log.user_email}</td>
                          <td className="px-6 py-4">
                            <code className="text-[11px] bg-white/5 px-2 py-1 rounded text-blue-300">{log.path === '/' ? '首页' : log.path}</code>
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-500">{new Date(log.created_at).toLocaleTimeString('zh-CN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
          {statCards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-400 uppercase tracking-widest">{label}</p>
                <Icon size={16} className="text-amber-500/70" />
              </div>
              <h4 className="text-3xl font-serif font-bold text-white">{value}</h4>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {quickActions.map(({ title, note, to, icon: Icon, color, bg }) => (
            <Link key={title} to={to} className="card-premium p-6 group hover:border-amber-500/50 transition-colors">
              <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center ${color} mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={22} />
              </div>
              <h3 className="text-lg font-bold mb-1">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{note}</p>
            </Link>
          ))}
        </div>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">我的数字资产</h2>
              <p className="mt-1 text-sm text-gray-500">所有数字人、记忆资产和传承档案都会在这里统一管理。</p>
            </div>
            <Link to="/digital-immortality" className="hidden md:inline-flex text-sm text-amber-500 hover:text-amber-400 items-center gap-1">
              新建档案 <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-[#12121A] border border-white/5 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-4 font-medium">资产名称</th>
                    <th className="px-6 py-4 font-medium">类型</th>
                    <th className="px-6 py-4 font-medium">记忆</th>
                    <th className="px-6 py-4 font-medium">素材</th>
                    <th className="px-6 py-4 font-medium">状态</th>
                    <th className="px-6 py-4 font-medium text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {profiles.map((profile) => (
                    <tr key={profile.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-lg bg-gray-800 flex items-center justify-center overflow-hidden">
                            {profile.avatar_url ? (
                              profile.avatar_url.match(/\.(mp4|webm|mov)(\?|$)/i)
                                ? <video src={profile.avatar_url} className="w-full h-full object-cover" muted playsInline />
                                : <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <ShieldCheck size={20} className="text-amber-500/70" />
                            )}
                          </div>
                          <div>
                            <span className="font-medium">{profile.display_name || '未命名档案'}</span>
                            <p className="text-xs text-gray-500 mt-1">{new Date(profile.created_at).toLocaleDateString('zh-CN')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{personaLabels[profile.persona_type] || '数字档案'}</td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{memoryCounts[profile.id] || 0}</td>
                      <td className="px-6 py-4 text-gray-400 text-sm">{assetCounts[profile.id] || 0}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          {statusLabels[profile.status] || '采集中'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link to={getProfileWorkspace(profile)} className="text-amber-500 hover:text-white text-sm font-medium mr-4">进入</Link>
                        <Link to={`/mvp-china?persona_type=${encodeURIComponent(profile.persona_type || 'immortality')}&profile_id=${encodeURIComponent(profile.id)}`} className="text-gray-500 hover:text-white text-sm">采集</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!loadingAssets && profiles.length === 0 && (
              <div className="py-16 text-center">
                <Archive size={42} className="mx-auto mb-4 text-white/25" />
                <h3 className="text-lg font-medium text-gray-300">暂无数字资产</h3>
                <p className="text-gray-500 mb-6">先创建一个数字永生或数字重生档案，再开始采集声音、形象和记忆。</p>
                <Link to="/digital-immortality" className="btn-premium inline-block text-sm">
                  立即创建
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">团聚空间与家族图谱</h2>
            <p className="mt-1 text-sm text-gray-500">团聚空间保留为数字重生的独立交互场景，未来可接入 VR、商城背景和生活道具。</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {reunionLinks.map(({ title, note, to, icon: Icon }) => (
              <Link key={title} to={to} className="card-premium p-6 group hover:border-amber-500/50 transition-colors">
                <Icon size={24} className="text-amber-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{note}</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold">未来空间与商城演示</h2>
            <p className="mt-1 text-sm text-gray-500">现阶段先提供演示入口，等算力、VR 或商城能力接入后可直接扩展。</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {futureLinks.map(({ title, note, to, icon: Icon }) => (
              <Link key={title} to={to} className="card-premium p-6 group hover:border-amber-500/50 transition-colors">
                <Icon size={24} className="text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{note}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
