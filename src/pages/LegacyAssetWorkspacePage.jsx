import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Archive, ArrowRight, BookOpen, FileText, KeyRound, Lock, MessageSquare, Mic, RefreshCw, ShieldCheck, UserRound, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

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

const vaultSections = [
  { id: 'memories', title: '记忆资产', icon: BookOpen, note: '人生片段、关系、价值观、重大决策和可传承故事。' },
  { id: 'documents', title: '重要文件', icon: FileText, note: '家书、作品、商业经验、说明文档和未来授权文件。' },
  { id: 'voice', title: '声音与形象', icon: Mic, note: '声音样本、照片、短视频和个人表达风格。' },
  { id: 'messages', title: '定向留言', icon: MessageSquare, note: '写给家人、团队、继承人或未来自己的内容。' },
  { id: 'access', title: '传承权限', icon: KeyRound, note: '谁可以访问、什么时候访问、可以访问哪些内容。' }
];

const accessPlans = [
  { who: '家人', scope: '记忆、家书、影像、个人留言', timing: '本人授权后' },
  { who: '子女', scope: '成长建议、价值观、家族故事', timing: '按年龄或事件开放' },
  { who: '企业/团队', scope: '经营理念、管理方法、公开知识', timing: '指定角色访问' }
];

const LegacyAssetWorkspacePage = () => {
  const { profileId } = useParams();
  const { session } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [assets, setAssets] = useState([]);
  const [fragments, setFragments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!session || !profileId) return;
    setLoading(true);
    try {
      const profileResponse = await authedFetch(session, '/api/profiles');
      const profileData = await profileResponse.json();
      const found = profileData.profiles?.find(item => item.id === profileId);
      if (!found) throw new Error('未找到数字资产档案');
      setProfile(found);

      const [assetResponse, fragmentResponse] = await Promise.all([
        authedFetch(session, `/api/profile-assets?profile_id=${profileId}`),
        authedFetch(session, `/api/memory/fragments?profile_id=${profileId}`)
      ]);
      const assetData = await assetResponse.json();
      const fragmentData = await fragmentResponse.json();
      setAssets(assetData.assets || []);
      setFragments(fragmentData.fragments || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [profileId, session]);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => ({
    memory: fragments.length,
    voice: assets.filter(item => item.asset_type === 'voice').length,
    visual: assets.filter(item => item.asset_type === 'image' || item.asset_type === 'video').length
  }), [assets, fragments]);

  const openCollector = () => navigate(`/mvp-china?persona_type=immortality&profile_id=${profileId}`);

  return (
    <div className="min-h-screen bg-tech-mesh text-white">
      <header className="border-b border-white/10 bg-gradient-to-br from-emerald-300/18 via-cyan-300/8 to-transparent">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <Link to="/digital-immortality" className="text-sm text-white/50 hover:text-white">← 返回数字永生</Link>
              <h1 className="mt-5 text-3xl md:text-5xl font-semibold">数字资产传承空间</h1>
              <p className="mt-4 max-w-2xl text-white/60 leading-relaxed">
                这里不是普通聊天页，而是把一个人的记忆、声音、影像、作品、家书和授权规则组织成可查询、可传承、可对话的数字资产库。
              </p>
            </div>
            <button onClick={load} className="w-10 h-10 rounded-lg border border-white/10 text-white/70 hover:text-white flex items-center justify-center">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6">
        <aside className="rounded-lg border border-white/10 bg-white/[0.04] overflow-hidden h-fit">
          <div className="aspect-[4/3] bg-black/40 flex items-center justify-center">
            {profile?.avatar_url ? (
              profile.avatar_url.match(/\.(mp4|webm|mov)(\?|$)/i)
                ? <video src={profile.avatar_url} className="w-full h-full object-cover" muted playsInline />
                : <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <UserRound size={64} className="text-white/30" />
            )}
          </div>
          <div className="p-5">
            <h2 className="text-xl font-semibold">{profile?.display_name || '数字资产档案'}</h2>
            <p className="mt-2 text-sm text-white/50 leading-relaxed">{profile?.description || '正在整理数字资产。'}</p>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-black/25 border border-white/10 p-3">
                <div className="text-lg font-semibold">{counts.memory}</div>
                <div className="text-[11px] text-white/40">记忆</div>
              </div>
              <div className="rounded-lg bg-black/25 border border-white/10 p-3">
                <div className="text-lg font-semibold">{counts.voice}</div>
                <div className="text-[11px] text-white/40">声音</div>
              </div>
              <div className="rounded-lg bg-black/25 border border-white/10 p-3">
                <div className="text-lg font-semibold">{counts.visual}</div>
                <div className="text-[11px] text-white/40">形象</div>
              </div>
            </div>
            <button onClick={openCollector} className="mt-5 w-full rounded-lg bg-emerald-300 text-black py-3 font-semibold">
              继续采集资产
            </button>
          </div>
        </aside>

        <section className="space-y-6">
          {loading && <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6 text-white/50">正在加载资产空间...</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vaultSections.map(section => {
              const Icon = section.icon;
              return (
                <div key={section.id} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-300/10 border border-emerald-300/20 flex items-center justify-center">
                      <Icon size={18} className="text-emerald-300" />
                    </div>
                    <h3 className="font-semibold">{section.title}</h3>
                  </div>
                  <p className="mt-3 text-sm text-white/52 leading-relaxed">{section.note}</p>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lock size={18} className="text-amber-300" />
              <h3 className="font-semibold">传承访问规则</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {accessPlans.map(plan => (
                <div key={plan.who} className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="font-semibold">{plan.who}</div>
                  <div className="mt-2 text-xs text-white/48 leading-relaxed">{plan.scope}</div>
                  <div className="mt-3 text-[11px] text-emerald-200/70">{plan.timing}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button onClick={openCollector} className="rounded-lg bg-white text-black p-4 font-semibold flex items-center justify-between">
              数字人对话测试 <ArrowRight size={16} />
            </button>
            <Link to={`/memories/${profileId}`} className="rounded-lg border border-white/10 bg-white/[0.04] p-4 font-semibold flex items-center justify-between">
              记忆时间线 <BookOpen size={16} />
            </Link>
            <button onClick={() => toast('资产文件库将在下一步接入上传和权限规则')} className="rounded-lg border border-white/10 bg-white/[0.04] p-4 font-semibold flex items-center justify-between">
              文件资产库 <Archive size={16} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LegacyAssetWorkspacePage;
