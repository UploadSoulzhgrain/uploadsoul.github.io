import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, BookOpen, Brain, HeartHandshake, Mic, Plus, RefreshCw, ShieldCheck, Sparkles, UserRound } from 'lucide-react';
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

const configs = {
  immortality: {
    personaTypes: ['immortality'],
    label: '数字永生',
    eyebrow: 'Self Continuity',
    title: '管理你的数字分身',
    description: '一个账号可以创建多个自我档案，例如现在的自己、未来给家人的自己、某个阶段的自己。每个档案独立沉淀声音、形象、记忆和对话。',
    createTitle: '新建自我数字人',
    defaultName: '我的数字分身',
    defaultRelationship: 'self',
    defaultDescription: '由本人持续上传声音、形象和记忆形成的自我数字分身。',
    accent: 'from-emerald-300/22 via-cyan-300/10 to-white/5',
    icon: Brain,
    empty: '还没有自我数字人。先创建一个档案，再逐步采集声音、形象和记忆。',
    modes: [
      { id: 'self_legacy', title: '自我数字分身', note: '声音、形象、记忆、对话人格，面向自己和家人长期沉淀。', personaType: 'immortality', relationship: 'self' },
      { id: 'asset_vault', title: '数字资产传承', note: '重要文件、家书、作品、知识、价值观和授权访问，面向长期传承。', personaType: 'immortality', relationship: 'legacy' }
    ],
    assetSections: ['记忆资产', '声音形象', '知识作品', '传承留言', '授权访问']
  },
  rebirth: {
    personaTypes: ['rebirth', 'historical'],
    label: '数字重生',
    eyebrow: 'Memory Reconstruction',
    title: '管理纪念型数字人',
    description: '可以为多位家人或重要的人分别创建档案。每个档案独立采集旧照片、短语音、访谈、日记和家族记忆。',
    createTitle: '新建纪念数字人',
    defaultName: '重要的人',
    defaultRelationship: 'family',
    defaultDescription: '由家人上传旧语音、照片、访谈和记忆形成的纪念型数字人。',
    accent: 'from-amber-300/24 via-rose-300/10 to-white/5',
    icon: HeartHandshake,
    empty: '还没有纪念数字人。可以先为一位家人创建档案。',
    modes: [
      { id: 'family_rebirth', title: '亲人重生', note: '为亲人、伴侣、朋友建立纪念型数字人，重点是照片、旧语音、家属访谈和共同回忆。', personaType: 'rebirth', relationship: 'family' },
      { id: 'historical_rebirth', title: '古人/名人重生', note: '为李白、唐伯虎、苏格拉底等人物建立知识库与性格边界，适合教育、文旅、展馆和 IP。', personaType: 'historical', relationship: 'historical figure' }
    ],
    assetSections: ['亲友回忆', '历史资料', '知识库', '性格边界', '回答溯源']
  },
  lover: {
    personaTypes: ['lover'],
    label: '虚拟恋爱',
    eyebrow: 'Companion Persona',
    title: '管理陪伴型数字人',
    description: '每个陪伴对象都可以有独立的人设、声音、记忆和互动历史。',
    createTitle: '新建陪伴数字人',
    defaultName: '新的陪伴者',
    defaultRelationship: 'companion',
    defaultDescription: '用于陪伴互动的数字人档案。',
    accent: 'from-pink-300/22 via-violet-300/10 to-white/5',
    icon: Sparkles,
    empty: '还没有陪伴数字人。',
    modes: [
      { id: 'real_memory_lover', title: '真实记忆恋人', note: '用真实的人声音、形象、多维记忆生成私密恋人档案，弥补遗憾、抚慰心灵。', personaType: 'lover', relationship: 'lost lover' },
      { id: 'ideal_companion', title: '理想陪伴者', note: '从人设、性格、关系节奏开始创造原生虚拟恋人，保留现有沉浸体验风格。', personaType: 'lover', relationship: 'ideal companion' }
    ],
    assetSections: ['真实记忆', '声音形象', '关系阶段', '陪伴记录', '情绪边界']
  }
};

const statusText = {
  collecting: '采集中',
  voice_ready: '声音已准备',
  active: '可对话',
  archived: '已归档'
};

function profileMatchesMode(profile, mode, fallbackType) {
  const personaType = profile.persona_type || fallbackType;
  const profileMode = profile.metadata?.mode || '';
  if (mode.id === 'asset_vault') return personaType === 'immortality' && profileMode === 'asset_vault';
  if (mode.id === 'self_legacy') return personaType === 'immortality' && profileMode !== 'asset_vault';
  if (mode.id === 'historical_rebirth') return personaType === 'historical';
  if (mode.id === 'family_rebirth') return personaType === 'rebirth';
  if (mode.id === 'real_memory_lover') return personaType === 'lover' && profileMode === 'real_memory_lover';
  if (mode.id === 'ideal_companion') return personaType === 'lover' && profileMode !== 'real_memory_lover';
  return personaType === (mode.personaType || fallbackType);
}

function workspacePath(profile, fallbackType = 'immortality') {
  const personaType = profile.persona_type || fallbackType;
  const mode = profile.metadata?.mode;
  if (personaType === 'historical') return `/digital-rebirth/historical/${profile.id}`;
  if (mode === 'asset_vault') return `/digital-immortality/assets/${profile.id}`;
  return `/mvp-china?persona_type=${personaType}&profile_id=${profile.id}`;
}

function formatDate(value) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' });
}

const DigitalPersonaHubPage = ({ type = 'immortality', defaultMode = '' }) => {
  const config = configs[type] || configs.immortality;
  const Icon = config.icon;
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') || defaultMode || config.modes?.[0]?.id || 'default';
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedModeId, setSelectedModeId] = useState(initialMode);
  const selectedMode = config.modes?.find(mode => mode.id === selectedModeId) || config.modes?.[0] || {};
  const [form, setForm] = useState({
    display_name: '',
    relationship: selectedMode.relationship || config.defaultRelationship,
    description: config.defaultDescription
  });

  const visibleProfiles = useMemo(
    () => profiles.filter(profile => profileMatchesMode(profile, selectedMode, type)),
    [profiles, selectedMode, type]
  );
  const readyCount = useMemo(() => visibleProfiles.filter(item => item.elevenlabs_voice_id).length, [visibleProfiles]);

  const loadProfiles = useCallback(async () => {
    if (!session) {
      setProfiles([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const allowedTypes = config.personaTypes || [type];
      const endpoint = allowedTypes.length === 1 ? `/api/profiles?persona_type=${allowedTypes[0]}` : '/api/profiles';
      const response = await authedFetch(session, endpoint);
      const data = await response.json();
      setProfiles((data.profiles || []).filter(profile => allowedTypes.includes(profile.persona_type || type)));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [config.personaTypes, session, type]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  useEffect(() => {
    setForm({
      display_name: '',
      relationship: selectedMode.relationship || config.defaultRelationship,
      description: config.defaultDescription
    });
  }, [config.defaultDescription, config.defaultRelationship, selectedMode.relationship, type]);

  const createProfile = async event => {
    event.preventDefault();
    if (!session) {
      toast('请先登录，再创建和管理你的数字人档案');
      navigate('/login', { state: { from: location } });
      return;
    }
    if (creating) return;
    setCreating(true);
    try {
      const personaType = selectedMode.personaType || type;
      const response = await authedFetch(session, '/api/profiles', {
        method: 'POST',
        body: JSON.stringify({
          persona_type: personaType,
          display_name: form.display_name.trim() || config.defaultName,
          relationship: form.relationship.trim() || selectedMode.relationship || config.defaultRelationship,
          description: form.description.trim() || config.defaultDescription,
          metadata: { entry: type, mode: selectedMode.id || type, created_from: 'persona_hub' }
        })
      });
      const data = await response.json();
      toast.success('数字人档案已创建');
      navigate(workspacePath(data.profile, personaType));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCreating(false);
    }
  };

  const openWorkspace = profile => {
    if (!session) {
      toast('请先登录，再进入个人工作台');
      navigate('/login', { state: { from: location } });
      return;
    }
    navigate(workspacePath(profile, type));
  };

  return (
    <div className="min-h-screen bg-tech-mesh text-white">
      <div className={`border-b border-white/10 bg-gradient-to-br ${config.accent}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-white/10 bg-white/5 text-xs text-white/62 mb-5">
                <Icon size={14} className="text-emerald-300" />
                {config.eyebrow}
              </div>
              <h1 className="text-3xl md:text-5xl font-semibold tracking-normal">{config.title}</h1>
              <p className="mt-4 text-white/62 leading-relaxed max-w-2xl">{config.description}</p>
              {config.assetSections?.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {config.assetSections.map(section => (
                    <span key={section} className="px-3 py-1 rounded-lg border border-white/10 bg-black/20 text-xs text-white/55">{section}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3 min-w-[280px]">
              <div className="rounded-lg border border-white/10 bg-black/25 p-4">
                <div className="text-2xl font-semibold">{visibleProfiles.length}</div>
                <div className="text-xs text-white/45 mt-1">档案数</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/25 p-4">
                <div className="text-2xl font-semibold">{readyCount}</div>
                <div className="text-xs text-white/45 mt-1">声音可用</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/25 p-4">
                <div className="text-2xl font-semibold">1</div>
                <div className="text-xs text-white/45 mt-1">统一工作台</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6">
        <aside className="rounded-lg border border-white/10 bg-white/[0.04] p-5 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <Plus size={18} className="text-emerald-300" />
            <h2 className="font-semibold">{config.createTitle}</h2>
          </div>
          {config.modes?.length > 0 && (
            <div className="grid grid-cols-1 gap-2 mb-5">
              {config.modes.map(mode => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => {
                    setSelectedModeId(mode.id);
                    setForm(prev => ({
                      ...prev,
                      relationship: mode.relationship || config.defaultRelationship,
                      description: prev.description || config.defaultDescription
                    }));
                  }}
                  className={`text-left rounded-lg border p-3 transition-all ${selectedModeId === mode.id ? 'border-emerald-300/45 bg-emerald-300/10' : 'border-white/10 bg-black/20 hover:border-white/20'}`}
                >
                  <div className="text-sm font-semibold">{mode.title}</div>
                  <div className="text-xs text-white/45 leading-relaxed mt-1">{mode.note}</div>
                </button>
              ))}
            </div>
          )}
          <form onSubmit={createProfile} className="space-y-4">
            <div>
              <label className="block text-xs text-white/45 mb-1">名称</label>
              <input
                value={form.display_name}
                onChange={event => setForm(prev => ({ ...prev, display_name: event.target.value }))}
                placeholder={config.defaultName}
                className="w-full rounded-lg border border-white/10 bg-black/25 px-3 py-3 text-sm outline-none focus:border-emerald-300/55"
              />
            </div>
            <div>
              <label className="block text-xs text-white/45 mb-1">关系 / 场景</label>
              <input
                value={form.relationship}
                onChange={event => setForm(prev => ({ ...prev, relationship: event.target.value }))}
                placeholder={config.defaultRelationship}
                className="w-full rounded-lg border border-white/10 bg-black/25 px-3 py-3 text-sm outline-none focus:border-emerald-300/55"
              />
            </div>
            <div>
              <label className="block text-xs text-white/45 mb-1">档案说明</label>
              <textarea
                value={form.description}
                onChange={event => setForm(prev => ({ ...prev, description: event.target.value }))}
                rows={4}
                className="w-full rounded-lg border border-white/10 bg-black/25 px-3 py-3 text-sm outline-none resize-none focus:border-emerald-300/55"
              />
            </div>
            <button disabled={creating} className="w-full rounded-lg bg-emerald-300 text-black py-3 font-semibold disabled:opacity-55">
              {creating ? '创建中...' : '创建并进入采集'}
            </button>
          </form>
          <div className="mt-5 pt-5 border-t border-white/10 text-xs text-white/45 leading-relaxed space-y-2">
            <p>建议流程：先建档案，再采集声音和形象，随后用文本、访谈、照片、语音持续沉淀记忆。</p>
            <p>每个档案的记忆、声音、形象和对话记录互相隔离，后续可分别训练或迁移。</p>
          </div>
        </aside>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">我的{selectedMode.title || config.label}档案</h2>
              <p className="text-sm text-white/45 mt-1">左侧切换类型后，这里只显示当前类型的数字人档案。</p>
            </div>
            <button onClick={loadProfiles} className="w-10 h-10 rounded-lg border border-white/10 text-white/70 hover:text-white flex items-center justify-center" title="刷新">
              <RefreshCw size={16} />
            </button>
          </div>

          {loading ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 text-white/45">正在加载档案...</div>
          ) : visibleProfiles.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 text-white/50">
              还没有{selectedMode.title || config.label}档案。可以先在左侧创建一个。
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {visibleProfiles.map(profile => (
                <article key={profile.id} className="rounded-lg border border-white/10 bg-white/[0.04] overflow-hidden">
                  <div className="aspect-[16/9] bg-black/40 relative overflow-hidden">
                    {profile.avatar_url ? (
                      profile.avatar_url.match(/\.(mp4|webm|mov)(\?|$)/i) ? (
                        <video src={profile.avatar_url} className="w-full h-full object-cover" muted playsInline />
                      ) : (
                        <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                      )
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${config.accent} flex items-center justify-center`}>
                        <UserRound size={56} className="text-white/45" />
                      </div>
                    )}
                    <div className="absolute left-3 top-3 px-2 py-1 rounded-md bg-black/60 border border-white/10 text-[11px] text-white/70">
                      {statusText[profile.status] || statusText.collecting}
                    </div>
                    <div className="absolute right-3 top-3 px-2 py-1 rounded-md bg-black/60 border border-white/10 text-[11px] text-white/60">
                      {profile.persona_type === 'historical' ? '历史人物' : profile.metadata?.mode === 'real_memory_lover' ? '真实记忆' : profile.metadata?.mode === 'asset_vault' ? '资产传承' : profile.persona_type || type}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">{profile.display_name || config.defaultName}</h3>
                        <p className="text-xs text-white/42 mt-1">{profile.relationship || config.defaultRelationship} · 创建于 {formatDate(profile.created_at)}</p>
                      </div>
                      <button onClick={() => openWorkspace(profile)} className="w-9 h-9 rounded-lg bg-emerald-300 text-black flex items-center justify-center">
                        <ArrowRight size={16} />
                      </button>
                    </div>
                    <p className="mt-3 text-sm text-white/58 leading-relaxed line-clamp-2">{profile.description || config.defaultDescription}</p>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
                      <div className="rounded-lg bg-black/25 border border-white/10 p-2 flex items-center gap-1 text-white/55">
                        <Mic size={13} className={profile.elevenlabs_voice_id ? 'text-emerald-300' : 'text-white/30'} />
                        {profile.elevenlabs_voice_id ? '声音已就绪' : '待采集声音'}
                      </div>
                      <div className="rounded-lg bg-black/25 border border-white/10 p-2 flex items-center gap-1 text-white/55">
                        <BookOpen size={13} className="text-blue-300" />
                        记忆库
                      </div>
                      <div className="rounded-lg bg-black/25 border border-white/10 p-2 flex items-center gap-1 text-white/55">
                        <ShieldCheck size={13} className="text-amber-300" />
                        可溯源
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button onClick={() => openWorkspace(profile)} className="px-3 py-2 rounded-lg bg-white text-black text-sm font-semibold">进入工作台</button>
                      <Link to={`/memories/${profile.id}`} className="px-3 py-2 rounded-lg border border-white/10 text-white/65 hover:text-white text-sm">记忆时间线</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DigitalPersonaHubPage;
