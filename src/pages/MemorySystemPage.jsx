import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Upload, Send, Image, Mic, FileText, Search, MessageCircle, Database, ChevronRight, Sparkles, Square } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

const emotionColors = {
  joy: '#f5c542',
  sadness: '#4f8cff',
  anger: '#ef4444',
  fear: '#8b5cf6',
  surprise: '#22c55e',
  neutral: '#8a8f98'
};

const contentTypeLabels = {
  text: '文本',
  diary: '日记',
  social: '社媒',
  voice: '语音',
  image: '照片'
};

const defaultEmotionState = {
  emotion_label: 'neutral',
  intensity: 2,
  tone: 'calm',
  speaking_style: '平静、温柔、自然',
  reason: '等待对话'
};

function dots(score = 0.5) {
  const count = Math.max(1, Math.min(5, Math.round(Number(score) * 5)));
  return Array.from({ length: 5 }, (_, index) => index < count);
}

function formatDate(value) {
  if (!value) return '未标注时间';
  return new Date(value).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' });
}

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

const MemorySystemPage = () => {
  const { profileId } = useParams();
  const { user, session } = useAuth();
  const [profile, setProfile] = useState(null);
  const [fragments, setFragments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [uploadText, setUploadText] = useState('');
  const [contentType, setContentType] = useState('diary');
  const [memoryDate, setMemoryDate] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [sources, setSources] = useState([]);
  const [currentEmotion, setCurrentEmotion] = useState(defaultEmotionState);
  const [streaming, setStreaming] = useState(false);
  const [interviewMessages, setInterviewMessages] = useState([]);
  const [interviewAnswer, setInterviewAnswer] = useState('');
  const [interviewLoading, setInterviewLoading] = useState(false);
  const fileRef = useRef(null);
  const chatEndRef = useRef(null);
  const chatAbortRef = useRef(null);

  const activeProfileId = profileId || profile?.id;

  const ensureProfile = useCallback(async () => {
    if (!session) return null;
    const response = await authedFetch(session, '/api/profiles');
    const data = await response.json();
    const existing = profileId
      ? data.profiles?.find(item => item.id === profileId)
      : data.profiles?.[0];
    if (existing) {
      setProfile(existing);
      return existing;
    }
    const created = await authedFetch(session, '/api/profiles', {
      method: 'POST',
      body: JSON.stringify({
        display_name: user?.user_metadata?.nickname || user?.email?.split('@')[0] || '我的数字人',
        description: '从文本、语音、照片和日记中逐步整理出来的数字记忆档案。'
      })
    });
    const createdData = await created.json();
    setProfile(createdData.profile);
    return createdData.profile;
  }, [profileId, session, user]);

  const loadFragments = useCallback(async (id = activeProfileId) => {
    if (!session || !id) return;
    const response = await authedFetch(session, `/api/memory/fragments?profile_id=${id}`);
    const data = await response.json();
    setFragments(data.fragments || []);
  }, [activeProfileId, session]);

  useEffect(() => {
    let mounted = true;
    async function boot() {
      try {
        setLoading(true);
        const selected = await ensureProfile();
        if (mounted && selected?.id) await loadFragments(selected.id);
      } catch (error) {
        toast.error(error.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    boot();
    return () => { mounted = false; };
  }, [ensureProfile, loadFragments]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const stats = useMemo(() => {
    const people = new Set();
    const topics = new Set();
    fragments.forEach(fragment => {
      fragment.people?.forEach(item => people.add(item));
      fragment.topics?.forEach(item => topics.add(item));
    });
    return { count: fragments.length, people: people.size, topics: topics.size };
  }, [fragments]);

  const uploadMemory = async () => {
    if (!activeProfileId) return;
    const file = fileRef.current?.files?.[0];
    if (!uploadText.trim() && !file) {
      toast.error('先输入一段文字，或选择一张图片/一段语音');
      return;
    }

    try {
      setUploading(true);
      const form = new FormData();
      if (file) form.append('file', file);
      if (uploadText.trim()) form.append('text', uploadText.trim());
      form.append('content_type', file ? (file.type.startsWith('audio') ? 'voice' : 'image') : contentType);
      form.append('profile_id', activeProfileId);
      if (memoryDate) form.append('memory_date', new Date(memoryDate).toISOString());

      const response = await authedFetch(session, '/api/memory/upload', { method: 'POST', body: form });
      await response.json();
      toast.success('记忆片段已进入采集层');
      setUploadText('');
      setMemoryDate('');
      if (fileRef.current) fileRef.current.value = '';
      await loadFragments(activeProfileId);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const sendMessage = async () => {
    if (!chatInput.trim() || streaming || !activeProfileId) return;
    const userText = chatInput.trim();
    setChatInput('');
    setSources([]);
    setChatMessages(prev => [...prev, { role: 'user', content: userText }, { role: 'assistant', content: '' }]);
    setStreaming(true);
    const controller = new AbortController();
    chatAbortRef.current = controller;

    try {
      const response = await authedFetch(session, '/api/memory-chat', {
        method: 'POST',
        body: JSON.stringify({ message: userText, profile_id: activeProfileId }),
        signal: controller.signal
      });
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';
        events.forEach(event => {
          const line = event.split('\n').find(row => row.startsWith('data: '));
          if (!line) return;
          const payload = JSON.parse(line.slice(6));
          if (payload.type === 'emotion') setCurrentEmotion(payload.emotion || defaultEmotionState);
          if (payload.type === 'sources') setSources(payload.memories || []);
          if (payload.type === 'token') {
            setChatMessages(prev => {
              const next = [...prev];
              const last = next[next.length - 1];
              next[next.length - 1] = { ...last, content: `${last.content}${payload.text}` };
              return next;
            });
          }
          if (payload.type === 'error') toast.error(payload.error);
        });
      }
    } catch (error) {
      if (error.name !== 'AbortError') toast.error(error.message);
    } finally {
      chatAbortRef.current = null;
      setStreaming(false);
    }
  };

  const interruptChat = () => {
    chatAbortRef.current?.abort();
    chatAbortRef.current = null;
    setStreaming(false);
  };

  const askInterviewQuestion = async (history = interviewMessages) => {
    if (!activeProfileId || interviewLoading) return;
    setInterviewLoading(true);
    try {
      const response = await authedFetch(session, '/api/memory/interview/next', {
        method: 'POST',
        body: JSON.stringify({ profile_id: activeProfileId, history })
      });
      const data = await response.json();
      setInterviewMessages(prev => [...prev, {
        role: 'assistant',
        content: data.question,
        theme: data.theme,
        why: data.why
      }]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setInterviewLoading(false);
    }
  };

  const submitInterviewAnswer = async () => {
    if (!interviewAnswer.trim() || !activeProfileId || interviewLoading) return;
    const answer = interviewAnswer.trim();
    setInterviewAnswer('');
    const nextHistory = [...interviewMessages, { role: 'user', content: answer }];
    setInterviewMessages(nextHistory);
    setInterviewLoading(true);

    try {
      const lastQuestion = [...interviewMessages].reverse().find(item => item.role === 'assistant')?.content || 'AI访谈';
      const form = new FormData();
      form.append('profile_id', activeProfileId);
      form.append('content_type', 'diary');
      form.append('text', `AI访谈问题：${lastQuestion}\n回答：${answer}`);
      await authedFetch(session, '/api/memory/upload', { method: 'POST', body: form });
      toast.success('访谈回答已保存为记忆片段');
      await loadFragments(activeProfileId);
      await askInterviewQuestion(nextHistory);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setInterviewLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080b10] text-white pt-24 flex items-center justify-center">
        <div className="text-sm text-white/60">正在载入记忆系统...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080b10] text-white pt-20">
      <style>{`
        .memory-shell { background: radial-gradient(circle at 20% 0%, rgba(16, 185, 129, 0.14), transparent 28%), radial-gradient(circle at 80% 10%, rgba(245, 197, 66, 0.11), transparent 26%), #080b10; }
        .memory-panel { background: rgba(255,255,255,0.045); border: 1px solid rgba(255,255,255,0.09); border-radius: 8px; }
        .memory-input { background: rgba(255,255,255,0.055); border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; color: white; outline: none; }
        .memory-input:focus { border-color: rgba(245,197,66,0.6); box-shadow: 0 0 0 3px rgba(245,197,66,0.1); }
        .memory-chip { border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.055); border-radius: 999px; }
      `}</style>
      <div className="memory-shell min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-amber-300/70 mb-3">UploadSoul MVP</div>
              <h1 className="text-3xl md:text-4xl font-bold">记忆采集层</h1>
              <p className="text-white/55 mt-3 max-w-2xl">登录后先进入档案，再围绕这个档案上传碎片、整理时间线、检索记忆并与数字人对话。</p>
            </div>
            <div className="flex gap-3">
              <Link to="/digital-immortality" className="px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:text-white">数字永生</Link>
              <Link to="/digital-rebirth" className="px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:text-white">数字重生</Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
            <aside className="space-y-6">
              <section className="memory-panel p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-amber-300/15 border border-amber-200/20 flex items-center justify-center">
                    <Database size={22} className="text-amber-200" />
                  </div>
                  <div>
                    <div className="font-semibold">{profile?.display_name}</div>
                    <div className="text-xs text-white/45">{profile?.description}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="memory-panel p-3"><div className="text-xl font-bold">{stats.count}</div><div className="text-xs text-white/45">片段</div></div>
                  <div className="memory-panel p-3"><div className="text-xl font-bold">{stats.people}</div><div className="text-xs text-white/45">人物</div></div>
                  <div className="memory-panel p-3"><div className="text-xl font-bold">{stats.topics}</div><div className="text-xs text-white/45">主题</div></div>
                </div>
              </section>

              <section className="memory-panel p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Upload size={18} className="text-amber-200" />
                  <h2 className="font-semibold">上传记忆</h2>
                </div>
                <textarea
                  className="memory-input w-full min-h-[120px] p-3 text-sm resize-none"
                  value={uploadText}
                  onChange={event => setUploadText(event.target.value)}
                  placeholder="写下一段微信聊天、日记、采访内容，或给照片/语音补充上下文..."
                />
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <select className="memory-input px-3 py-2 text-sm" value={contentType} onChange={event => setContentType(event.target.value)}>
                    <option value="diary">日记</option>
                    <option value="text">文本</option>
                    <option value="social">社媒</option>
                  </select>
                  <input className="memory-input px-3 py-2 text-sm" type="date" value={memoryDate} onChange={event => setMemoryDate(event.target.value)} />
                </div>
                <label className="memory-panel mt-3 p-3 flex items-center justify-between cursor-pointer hover:border-white/20">
                  <span className="text-sm text-white/65 flex items-center gap-2"><Image size={16} /> 图片或语音</span>
                  <ChevronRight size={16} className="text-white/35" />
                  <input ref={fileRef} className="hidden" type="file" accept="image/*,audio/*" />
                </label>
                <button
                  onClick={uploadMemory}
                  disabled={uploading}
                  className="w-full mt-4 px-4 py-3 rounded-lg bg-amber-300 text-black font-semibold disabled:opacity-60"
                >
                  {uploading ? '解析中...' : '采集并结构化'}
                </button>
              </section>

              <section className="memory-panel p-5">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-emerald-300" />
                    <h2 className="font-semibold">AI 访谈采集</h2>
                  </div>
                  <span className="text-[10px] text-emerald-200/70 border border-emerald-200/20 rounded-full px-2 py-1">自动入库</span>
                </div>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {interviewMessages.length === 0 && (
                    <div className="text-sm text-white/52 leading-relaxed">
                      不知道从哪里开始时，让 AI 先问。每次回答都会被结构化保存成记忆片段，再继续追问细节。
                    </div>
                  )}
                  {interviewMessages.map((message, index) => (
                    <div key={index} className={`text-sm rounded-lg p-3 ${message.role === 'assistant' ? 'bg-emerald-300/10 border border-emerald-200/15 text-white/82' : 'bg-white/7 border border-white/10 text-white/66'}`}>
                      <div>{message.content}</div>
                      {message.why && <div className="text-[10px] text-white/35 mt-2">{message.theme} · {message.why}</div>}
                    </div>
                  ))}
                </div>
                {interviewMessages.length === 0 ? (
                  <button
                    onClick={() => askInterviewQuestion([])}
                    disabled={interviewLoading}
                    className="w-full mt-4 px-4 py-3 rounded-lg bg-emerald-300 text-black font-semibold disabled:opacity-60"
                  >
                    {interviewLoading ? '生成问题中...' : '开始 AI 访谈'}
                  </button>
                ) : (
                  <div className="mt-4 space-y-3">
                    <textarea
                      className="memory-input w-full min-h-[92px] p-3 text-sm resize-none"
                      value={interviewAnswer}
                      onChange={event => setInterviewAnswer(event.target.value)}
                      placeholder="顺着这个问题说一点就好，可以很短..."
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={submitInterviewAnswer}
                        disabled={!interviewAnswer.trim() || interviewLoading}
                        className="px-4 py-3 rounded-lg bg-emerald-300 text-black font-semibold disabled:opacity-60"
                      >
                        {interviewLoading ? '保存中...' : '保存并追问'}
                      </button>
                      <button
                        onClick={() => askInterviewQuestion(interviewMessages)}
                        disabled={interviewLoading}
                        className="px-4 py-3 rounded-lg border border-white/10 text-white/70 hover:text-white disabled:opacity-60"
                      >
                        换个问题
                      </button>
                    </div>
                  </div>
                )}
              </section>
            </aside>

            <main className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
              <section className="memory-panel p-5 min-h-[680px]">
                <div className="flex items-center gap-2 mb-5">
                  <FileText size={18} className="text-amber-200" />
                  <h2 className="font-semibold">记忆时间线</h2>
                </div>
                <div className="space-y-4">
                  {fragments.length === 0 && (
                    <div className="border border-dashed border-white/15 rounded-lg p-10 text-center text-white/45">还没有记忆片段。先从一段文字、一张照片或一段语音开始。</div>
                  )}
                  {fragments.map(fragment => (
                    <article key={fragment.id} className="memory-panel overflow-hidden">
                      <div className="grid grid-cols-[110px_1fr]">
                        <div className="p-4 border-r border-white/10" style={{ borderLeft: `5px solid ${emotionColors[fragment.emotion_label] || emotionColors.neutral}` }}>
                          <div className="text-xs text-white/45">{formatDate(fragment.memory_date)}</div>
                          <div className="mt-2 text-sm">{fragment.emotion_label}</div>
                          <div className="text-xs text-white/40">{contentTypeLabels[fragment.content_type]}</div>
                        </div>
                        <div className="p-4">
                          <div className="flex gap-4">
                            {fragment.original_url && <img src={fragment.original_url} alt="" className="w-20 h-20 rounded-lg object-cover border border-white/10" />}
                            <div className="min-w-0">
                              <h3 className="font-semibold">{fragment.summary || fragment.content_text.slice(0, 32)}</h3>
                              <p className="text-sm text-white/55 mt-2 line-clamp-2">{fragment.content_text}</p>
                              <div className="flex flex-wrap gap-2 mt-3">
                                {fragment.topics?.map(topic => <span key={topic} className="memory-chip px-2 py-1 text-xs text-white/65">{topic}</span>)}
                                {fragment.parse_status === 'pending' && <span className="memory-chip px-2 py-1 text-xs text-amber-200">待解析</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1 mt-4">
                            {dots(fragment.importance_score).map((active, index) => (
                              <span key={index} className={`w-2 h-2 rounded-full ${active ? 'bg-amber-300' : 'bg-white/15'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="memory-panel p-5 min-h-[680px] flex flex-col">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <MessageCircle size={18} className="text-amber-200" />
                    <h2 className="font-semibold">基于记忆对话</h2>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-white/40"><Search size={14} /> RAG 来源可见</div>
                </div>
                <div className="mb-4 p-3 rounded-lg border border-white/10 bg-white/5 text-xs">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/45">情绪感知</span>
                    <span className="font-semibold" style={{ color: emotionColors[currentEmotion.emotion_label] || emotionColors.neutral }}>
                      {currentEmotion.emotion_label} · {currentEmotion.intensity}/5 · {currentEmotion.tone}
                    </span>
                  </div>
                  <div className="mt-2 text-white/50">{currentEmotion.speaking_style} · {currentEmotion.reason}</div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {chatMessages.length === 0 && (
                    <div className="memory-panel p-4 text-sm text-white/50">问一个具体问题，例如：“你还记得那次家庭聚会吗？” 系统会先检索相关记忆，再用第一人称回答。</div>
                  )}
                  {chatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[82%] px-4 py-3 rounded-lg text-sm ${message.role === 'user' ? 'bg-amber-300 text-black' : 'bg-white/8 text-white/82 border border-white/10'}`}>
                        {message.content || (streaming ? ' ' : '')}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                {sources.length > 0 && (
                  <div className="my-4 border-t border-white/10 pt-4">
                    <div className="text-xs text-white/45 mb-2">本轮检索到的记忆来源</div>
                    <div className="space-y-2 max-h-36 overflow-y-auto">
                      {sources.map(source => (
                        <div key={source.id} className="memory-panel p-3 text-xs text-white/62">
                          <div className="flex justify-between gap-3 mb-1">
                            <span>{source.summary || source.emotion_label}</span>
                            <span>{Number(source.similarity || 0).toFixed(2)}</span>
                          </div>
                          <div className="line-clamp-2">{source.content_text}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <button className="w-10 h-10 rounded-lg border border-white/10 text-white/45 flex items-center justify-center" title="语音输入占位">
                    <Mic size={17} />
                  </button>
                  <input
                    className="memory-input flex-1 px-3 text-sm"
                    value={chatInput}
                    onChange={event => setChatInput(event.target.value)}
                    onKeyDown={event => {
                      if (event.key === 'Enter') sendMessage();
                    }}
                    placeholder="输入你想问这位数字人的问题..."
                  />
                  <button onClick={streaming ? interruptChat : sendMessage} className={`w-10 h-10 rounded-lg flex items-center justify-center ${streaming ? 'border border-white/10 text-white/75' : 'bg-amber-300 text-black'}`} title={streaming ? '打断' : '发送'}>
                    {streaming ? <Square size={15} /> : <Send size={17} />}
                  </button>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemorySystemPage;
