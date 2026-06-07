import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, BookOpen, GraduationCap, Landmark, MessageSquare, RefreshCw, ScrollText, ShieldCheck, Sparkles } from 'lucide-react';
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

const scenes = [
  { id: 'museum', title: '展馆讲解', icon: Landmark, note: '以人物第一视角讲述时代背景、代表作品和重要节点。' },
  { id: 'classroom', title: '课堂问答', icon: GraduationCap, note: '面向学生，用可理解的语言解释思想、作品和争议。' },
  { id: 'dialogue', title: '沉浸对话', icon: MessageSquare, note: '在明确史实边界内进行人格化互动。' }
];

const guardrails = [
  '史实、作品、年表和人物关系优先来自知识库',
  '合理演绎必须和史实分开表达',
  '不确定的问题要说明“不详”或“存在争议”',
  '回答必须保留来源线索，方便教育和展陈审校'
];

const starterKnowledge = [
  '生平年表与重要事件',
  '代表作品或核心思想',
  '同时代人物关系',
  '时代背景与地域文化',
  '常见误解与争议问题'
];

const HistoricalPersonaWorkspacePage = () => {
  const { profileId } = useParams();
  const { session } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [fragments, setFragments] = useState([]);
  const [activeScene, setActiveScene] = useState('museum');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!session || !profileId) return;
    setLoading(true);
    try {
      const profileResponse = await authedFetch(session, '/api/profiles');
      const profileData = await profileResponse.json();
      const found = profileData.profiles?.find(item => item.id === profileId);
      if (!found) throw new Error('未找到历史人物档案');
      setProfile(found);

      const fragmentResponse = await authedFetch(session, `/api/memory/fragments?profile_id=${profileId}`);
      const fragmentData = await fragmentResponse.json();
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

  const topics = useMemo(() => {
    const all = fragments.flatMap(item => Array.isArray(item.topics) ? item.topics : []);
    return [...new Set(all)].slice(0, 8);
  }, [fragments]);

  const openCollector = () => navigate(`/mvp-china?persona_type=historical&profile_id=${profileId}`);

  return (
    <div className="min-h-screen bg-black text-[#d4af37]" style={{ fontFamily: "'Noto Serif SC','STSong','Songti SC','SimSun',serif" }}>
      <header className="border-b border-[#d4af37]/20 bg-[radial-gradient(circle_at_50%_0%,rgba(212,175,55,.16),transparent_38%)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <Link to="/digital-rebirth" className="text-sm text-[#8b7355] hover:text-[#f4d03f]">← 返回数字重生</Link>
              <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[#d4af37]/25 bg-[#d4af37]/10 text-xs">
                <ScrollText size={14} />
                历史人格知识库
              </div>
              <h1 className="mt-5 text-4xl md:text-6xl tracking-[0.18em]">{profile?.display_name || '历史人物'}</h1>
              <p className="mt-4 max-w-2xl text-[#8b7355] leading-relaxed">
                这里不是亲人纪念空间，而是面向教育、文旅、展馆和文化 IP 的历史人物交互工作台。核心是知识库、史实边界、场景化对话和来源审校。
              </p>
            </div>
            <button onClick={load} className="w-10 h-10 rounded-md border border-[#d4af37]/25 text-[#d4af37] hover:bg-[#d4af37]/10 flex items-center justify-center">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6">
        <aside className="border border-[#d4af37]/20 bg-[#141414]/80 rounded-lg overflow-hidden h-fit">
          <div className="aspect-square bg-[radial-gradient(circle,rgba(212,175,55,.28),rgba(20,20,20,.8))] flex items-center justify-center">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover opacity-85" />
            ) : (
              <div className="w-32 h-32 rounded-full border border-[#d4af37]/40 bg-[#d4af37]/15 flex items-center justify-center text-6xl">
                {(profile?.display_name || '史').slice(0, 1)}
              </div>
            )}
          </div>
          <div className="p-5">
            <h2 className="text-2xl tracking-[0.12em]">{profile?.display_name || '历史人物'}</h2>
            <p className="mt-2 text-sm text-[#8b7355] leading-relaxed">{profile?.description || '等待补充人物生平、作品、思想和知识库。'}</p>
            <div className="mt-5 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-md border border-[#d4af37]/15 bg-black/30 p-3">
                <div className="text-xl">{fragments.length}</div>
                <div className="text-[11px] text-[#8b7355]">知识片段</div>
              </div>
              <div className="rounded-md border border-[#d4af37]/15 bg-black/30 p-3">
                <div className="text-xl">{topics.length}</div>
                <div className="text-[11px] text-[#8b7355]">主题标签</div>
              </div>
            </div>
            <button onClick={openCollector} className="mt-5 w-full rounded-md bg-[#d4af37] text-black py-3 font-bold">
              补充知识库
            </button>
          </div>
        </aside>

        <section className="space-y-6">
          {loading && <div className="rounded-lg border border-[#d4af37]/20 bg-[#141414]/80 p-6 text-[#8b7355]">正在加载历史人物档案...</div>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {scenes.map(scene => {
              const Icon = scene.icon;
              const active = activeScene === scene.id;
              return (
                <button
                  key={scene.id}
                  onClick={() => setActiveScene(scene.id)}
                  className={`text-left rounded-lg border p-4 transition-all ${active ? 'border-[#d4af37] bg-[#d4af37]/12' : 'border-[#d4af37]/20 bg-[#141414]/80 hover:border-[#d4af37]/45'}`}
                >
                  <Icon size={20} />
                  <div className="mt-3 font-semibold">{scene.title}</div>
                  <div className="mt-2 text-xs text-[#8b7355] leading-relaxed">{scene.note}</div>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-lg border border-[#d4af37]/20 bg-[#141414]/80 p-5">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={18} />
                <h3 className="font-semibold tracking-[0.08em]">知识库结构</h3>
              </div>
              <div className="space-y-2">
                {starterKnowledge.map(item => (
                  <div key={item} className="rounded-md border border-[#d4af37]/15 bg-black/25 px-3 py-2 text-sm text-[#d4af37]/85">{item}</div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-[#d4af37]/20 bg-[#141414]/80 p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={18} />
                <h3 className="font-semibold tracking-[0.08em]">史实边界</h3>
              </div>
              <div className="space-y-2">
                {guardrails.map(item => (
                  <div key={item} className="rounded-md border border-[#d4af37]/15 bg-black/25 px-3 py-2 text-sm text-[#8b7355] leading-relaxed">{item}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[#d4af37]/20 bg-[#141414]/80 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} />
              <h3 className="font-semibold tracking-[0.08em]">当前主题</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {topics.length ? topics.map(topic => (
                <span key={topic} className="px-3 py-1 rounded-md border border-[#d4af37]/20 bg-[#d4af37]/10 text-xs">{topic}</span>
              )) : (
                <span className="text-sm text-[#8b7355]">还没有主题。先上传人物资料、作品、年表或访谈脚本。</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button onClick={openCollector} className="rounded-md bg-[#d4af37] text-black p-4 font-bold flex items-center justify-between">
              进入交互测试 <ArrowRight size={16} />
            </button>
            <Link to={`/memories/${profileId}`} className="rounded-md border border-[#d4af37]/20 bg-[#141414]/80 p-4 font-bold flex items-center justify-between">
              知识时间线 <BookOpen size={16} />
            </Link>
            <button onClick={() => toast('展馆/课堂发布配置将在下一步接入')} className="rounded-md border border-[#d4af37]/20 bg-[#141414]/80 p-4 font-bold flex items-center justify-between">
              发布到展陈 <Landmark size={16} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HistoricalPersonaWorkspacePage;
