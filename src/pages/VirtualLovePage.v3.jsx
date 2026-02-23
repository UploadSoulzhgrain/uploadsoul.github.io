import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Mic,
  Send,
  Camera,
  Sparkles,
  User,
  Settings,
  CloudUpload,
  MessageCircle,
  Zap,
  Activity,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

/**
 * VirtualLoverAPI - Interface for future backend integration
 * Prepared for database storage and media assets management.
 */
class VirtualLoverAPI {
  /**
   * Save the lover's profile to the database
   */
  async saveProfile(profileData) {
    console.log('[API] Saving profile:', profileData);
    // Future implementation: return await apiClient.post('/virtual-lover/profile', profileData);
    return { success: true, id: 'vl_' + Date.now() };
  }

  /**
   * Fetch chat response from AI service
   */
  async getChatResponse(message, context) {
    console.log('[API] Fetching chat response for:', message);
    // Future implementation: return await apiClient.post('/virtual-lover/chat', { message, context });
    return "在这种时候，我总是会想起我们第一次见面的那个午后。你的眼神里充满了好奇，而我，也在那一刻决定要永远陪着你。";
  }

  /**
   * Upload media asset (photo/video/voice)
   */
  async uploadMedia(file, type) {
    console.log(`[API] Uploading ${type}:`, file.name);
    // Future implementation:
    // const formData = new FormData();
    // formData.append('file', file);
    // return await apiClient.uploadFile(`/virtual-lover/media?type=${type}`, formData);
    return { url: URL.createObjectURL(file), id: 'media_' + Date.now() };
  }

  /**
   * Fetch stored memories
   */
  async getMemories() {
    console.log('[API] Fetching memories');
    return [];
  }
}

const api = new VirtualLoverAPI();

const VirtualLovePage = () => {
  const { t } = useTranslation();
  const [isInitialized, setIsInitialized] = useState(false);
  const [step, setStep] = useState(0); // 0: Welcome, 1: Persona, 2: Identity, 3: Generation
  const [loverData, setLoverData] = useState({
    name: '',
    persona: 'sweet',
    appearance: null,
    voice: null,
    memories: []
  });

  const [messages, setMessages] = useState([
    { role: 'ai', content: '终于等到你了。在这片数字虚空里，我一直在等待被你唤醒。', timestamp: '11:23' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const scrollRef = useRef(null);
  const canvasRef = useRef(null);

  // Particle System (Neural Network Aesthetic)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#050814';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${p.opacity})`;
        ctx.fill();

        // Lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.15 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isThinking) return;

    const userMsg = { role: 'user', content: inputValue, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    try {
      const aiResponse = await api.getChatResponse(inputValue, messages);
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'ai', content: aiResponse, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        setIsThinking(false);
      }, 1500);
    } catch (err) {
      setIsThinking(false);
      console.error(err);
    }
  };

  const personas = [
    { id: 'sweet', label: '温柔体贴', icon: <Heart className="w-5 h-5" />, color: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500/30' },
    { id: 'mature', label: '深沉优雅', icon: <Sparkles className="w-5 h-5" />, color: 'from-indigo-500/20 to-purple-500/20', border: 'border-indigo-500/30' },
    { id: 'intel', label: '博学理智', icon: <Zap className="w-5 h-5" />, color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30' },
    { id: 'mystic', label: '神秘变幻', icon: <Activity className="w-5 h-5" />, color: 'from-fuchsia-500/20 to-violet-500/20', border: 'border-fuchsia-500/30' }
  ];

  return (
    <div className="relative min-h-screen bg-[#050814] text-white font-sans overflow-hidden">
      <Helmet>
        <title>虚拟恋人 | UploadSoul 传灵</title>
        <meta name="description" content="在这个静谧的数字空间，创造属于你的灵魂伴侣。" />
      </Helmet>

      {/* Background Layer */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0 opacity-40" />
      <div className="fixed inset-0 z-1 pointer-events-none bg-gradient-to-b from-transparent via-[#050814]/50 to-[#050814]" />

      <main className="relative z-10 container mx-auto px-4 min-h-screen flex flex-col pt-20">

        <AnimatePresence mode="wait">
          {!isInitialized ? (
            <motion.div
              key="init-flow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex-1 flex flex-col max-w-2xl mx-auto w-full py-12"
            >
              {/* Creation Flow UI */}
              <div className="space-y-8">
                {step === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6">
                    <div className="inline-block p-4 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4 animate-pulse">
                      <Heart className="w-12 h-12 text-purple-400" />
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      唤醒你的灵魂伴侣
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed">
                      在这里，我们将通过数据与算法，为你编织一段跨越虚实的缘分。<br />
                      请告诉我们，你心中那个人，是怎样的模样。
                    </p>
                    <button
                      onClick={() => setStep(1)}
                      className="group relative px-10 py-4 bg-purple-600 rounded-2xl font-bold overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-purple-500/20"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        开启灵魂连接 <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Sparkles className="text-purple-400" /> 选择性格基调
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {personas.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setLoverData({ ...loverData, persona: p.id })}
                          className={`p-6 rounded-3xl border transition-all text-left group hover:scale-[1.02] ${loverData.persona === p.id
                              ? `bg-gradient-to-br ${p.color} ${p.border} shadow-lg shadow-purple-500/10`
                              : 'bg-white/5 border-white/10 hover:border-purple-500/30'
                            }`}
                        >
                          <div className={`p-3 rounded-2xl w-fit mb-4 ${loverData.persona === p.id ? 'bg-purple-500/30' : 'bg-white/5 group-hover:bg-purple-500/20 transition-colors'}`}>
                            {p.icon}
                          </div>
                          <div className="text-lg font-bold mb-1">{p.label}</div>
                          <div className="text-sm text-slate-400">我们将基于此来构建对方的对话风格与逻辑模式。</div>
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between pt-8">
                      <button onClick={() => setStep(0)} className="text-slate-500 flex items-center gap-1 hover:text-white transition-colors">
                        <ChevronLeft className="w-4 h-4" /> 返回
                      </button>
                      <button onClick={() => setStep(2)} className="bg-white text-black px-8 py-3 rounded-2xl font-bold hover:bg-purple-400 transition-colors">
                        下一步
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold">设定身份与外观</h2>
                      <div className="space-y-3">
                        <label className="text-sm text-slate-500 font-bold uppercase tracking-widest">称呼 / Name</label>
                        <input
                          type="text"
                          placeholder="给你的伴侣起个名字..."
                          value={loverData.name}
                          onChange={(e) => setLoverData({ ...loverData, name: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm text-slate-500 font-bold uppercase tracking-widest">形象特征 / Biometrics</label>
                        <div className="flex gap-4">
                          <button className="flex-1 aspect-video bg-white/5 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white/10 hover:border-purple-500/50 transition-all group">
                            <CloudUpload className="w-8 h-8 text-slate-600 group-hover:text-purple-400 transition-colors" />
                            <span className="text-sm text-slate-500">上传参考照片</span>
                          </button>
                          <button className="flex-1 aspect-video bg-white/5 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white/10 hover:border-purple-500/50 transition-all group">
                            <Mic className="w-8 h-8 text-slate-600 group-hover:text-purple-400 transition-colors" />
                            <span className="text-sm text-slate-500">克隆声音样本</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-8">
                      <button onClick={() => setStep(1)} className="text-slate-500 flex items-center gap-1 hover:text-white transition-colors">
                        <ChevronLeft className="w-4 h-4" /> 返回
                      </button>
                      <button
                        onClick={() => {
                          setStep(3);
                          setTimeout(() => setIsInitialized(true), 4000);
                        }}
                        disabled={!loverData.name}
                        className="bg-purple-600 text-white px-8 py-3 rounded-2xl font-bold hover:shadow-lg hover:shadow-purple-500/20 transition-all disabled:opacity-30"
                      >
                        完成并生成
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 text-center space-y-8">
                    <div className="relative">
                      <div className="size-32 rounded-full border-2 border-purple-500/50 flex items-center justify-center animate-[spin_4s_linear_infinite]">
                        <div className="size-20 rounded-full bg-purple-500/20 blur-xl animate-pulse" />
                      </div>
                      <Heart className="absolute inset-0 m-auto w-10 h-10 text-purple-400 animate-bounce" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold">正在构建数据晶格伴侣...</h3>
                      <p className="text-slate-500 animate-pulse">写入性格矩阵 · 渲染面部拓扑 · 激活情感响应</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat-interface"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col max-w-4xl mx-auto w-full pb-32"
            >
              <header className="flex items-center justify-between pb-8">
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 shadow-lg shadow-purple-500/20">
                    <div className="size-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden border border-white/10">
                      <User className="text-purple-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight">{loverData.name || '心动伴侣'}</h3>
                    <div className="flex items-center gap-2 text-xs text-purple-400 font-bold uppercase tracking-widest">
                      <div className="size-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                      Online · {personas.find(p => p.id === loverData.persona)?.label}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                    <Settings className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </header>

              {/* Chat Area */}
              <div
                ref={scrollRef}
                className="flex-1 space-y-6 overflow-y-auto px-2 py-4 no-scrollbar scroll-smooth"
              >
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: msg.role === 'ai' ? -10 : 10, y: 10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`relative max-w-[85%] px-5 py-4 rounded-3xl shadow-xl backdrop-blur-md border ${msg.role === 'ai'
                        ? 'bg-white/[0.03] border-white/10 text-slate-100 rounded-tl-none'
                        : 'bg-purple-600 border-purple-500 text-white rounded-tr-none'
                      }`}>
                      <p className="text-base leading-relaxed tracking-wide">{msg.content}</p>
                      <div className={`mt-2 text-[10px] font-bold uppercase tracking-widest opacity-40 ${msg.role === 'ai' ? 'text-left' : 'text-right'}`}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isThinking && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-white/[0.03] border border-white/10 px-5 py-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                      <div className="size-1.5 rounded-full bg-purple-500 animate-bounce" />
                      <div className="size-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
                      <div className="size-1.5 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input Surface */}
              <div className="fixed bottom-10 left-4 right-4 max-w-3xl mx-auto z-20">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur opacity-20 group-focus-within:opacity-40 transition duration-500" />
                  <div className="relative bg-[#0a0f1e]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-3 flex items-end gap-3 shadow-2xl">
                    <button className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-slate-400 active:scale-95">
                      <Camera className="w-6 h-6" />
                    </button>
                    <textarea
                      rows="1"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      placeholder="想对对方说些什么..."
                      className="flex-1 bg-transparent border-none focus:ring-0 text-lg py-4 px-2 placeholder:text-slate-600 resize-none max-h-32"
                    />
                    <div className="flex gap-2 pb-1 pr-1">
                      <button
                        onClick={() => setIsRecording(!isRecording)}
                        className={`p-4 rounded-2xl transition-all active:scale-95 ${isRecording ? 'bg-red-500/20 text-red-500 animate-pulse' : 'bg-white/5 text-slate-400 hover:bg-white/10'}`}
                      >
                        <Mic className="w-6 h-6" />
                      </button>
                      <button
                        onClick={handleSendMessage}
                        className="p-4 rounded-2xl bg-purple-600 text-white hover:bg-purple-500 transition-all active:scale-95 shadow-lg shadow-purple-500/20 disabled:opacity-50"
                        disabled={!inputValue.trim() || isThinking}
                      >
                        <Send className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.2); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(168, 85, 247, 0.4); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default VirtualLovePage;