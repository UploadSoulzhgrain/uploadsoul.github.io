import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate';
import { voiceManager } from '../lib/VoiceManager';

// ── Volcengine Chat Widget (senior care) ─────────────────────────────────────
const SeniorChatWidget = ({ companion, onClose }) => {
    const [messages, setMessages] = useState([
        { role: 'ai', text: `您好！我是${companion.name.split(' ')[0]}，${companion.info}。有什么我可以帮到您的吗？`, id: Date.now() }
    ]);
    const [inputText, setInputText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [streamText, setStreamText] = useState('');
    const [voiceState, setVoiceState] = useState('idle');
    const mediaRecRef = useRef(null);
    const chunksRef = useRef([]);
    const msgEndRef = useRef(null);

    useEffect(() => {
        voiceManager.onStateChange(setVoiceState);
        return () => { voiceManager.interrupt(); voiceManager.onStateChange(null); };
    }, []);

    useEffect(() => {
        msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streamText]);

    const addMsg = (role, text) =>
        setMessages(prev => [...prev, { role, text, id: Date.now() + Math.random() }]);

    const sendMessage = useCallback(async (text, audioBlob = null) => {
        if (!text && !audioBlob) return;
        if (text) addMsg('user', text);

        setIsThinking(true);
        setStreamText('');

        const body = new FormData();
        body.append('avatarType', 'senior');
        body.append('characterName', companion.name.split(' ')[0]);
        body.append('userId', '00000000-0000-4000-8000-000000000000');
        if (text) body.append('message', text);
        if (audioBlob) body.append('audio', audioBlob, 'recording.webm');

        let acc = '';

        await voiceManager.streamChat('/api/senior-care/chat', body, {
            onUserText: (rec) => { if (!text) addMsg('user', rec); },
            onToken: (t) => { acc += t; setStreamText(acc); },
            onDone: (full) => { setIsThinking(false); setStreamText(''); addMsg('ai', full); },
            onError: (err) => { setIsThinking(false); setStreamText(''); addMsg('ai', `抱歉，出了点问题：${err.message}`); },
        }, true);
    }, [companion]);

    const handleSend = () => {
        const t = inputText.trim();
        if (!t || isThinking) return;
        setInputText(''); sendMessage(t);
    };

    const startRecording = async () => {
        try {
            voiceManager.interrupt();
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            chunksRef.current = [];
            const rec = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            rec.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
            rec.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                sendMessage('', blob);
                stream.getTracks().forEach(t => t.stop());
            };
            rec.start();
            mediaRecRef.current = rec;
            setIsRecording(true);
        } catch (e) { alert('无法访问麦克风：' + e.message); }
    };

    const stopRecording = () => {
        mediaRecRef.current?.stop();
        mediaRecRef.current = null;
        setIsRecording(false);
    };

    const STATE_COLOR = { idle: '#ee7c2b', listening: '#22c55e', playing: '#3b82f6' };
    const STATE_LABEL = { idle: '待机', listening: '录音中', playing: '播放中' };

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center p-0 md:p-6 bg-black/50 backdrop-blur-sm"
            onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="bg-white dark:bg-slate-900 w-full md:w-[480px] rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col"
                style={{ maxHeight: '85dvh' }}>
                {/* Header */}
                <div className="flex items-center gap-4 p-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    <div className="size-14 rounded-full overflow-hidden border-2 border-[#ee7c2b]/30">
                        <img src={companion.img} alt={companion.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-black text-lg text-slate-900 dark:text-white truncate">{companion.name}</h3>
                        <div className="flex items-center gap-2">
                            <span className="size-2.5 rounded-full animate-pulse shrink-0"
                                style={{ background: STATE_COLOR[voiceState] }} />
                            <span className="text-sm text-slate-500 truncate">{STATE_LABEL[voiceState]} · 豆包 AI 驱动</span>
                        </div>
                    </div>
                    <button onClick={onClose}
                        className="size-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0">
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
                    {messages.map(m => (
                        <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                            {m.role === 'ai' && (
                                <div className="size-8 rounded-full overflow-hidden border border-[#ee7c2b]/30 shrink-0 mt-1">
                                    <img src={companion.img} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-base leading-relaxed ${m.role === 'user'
                                    ? 'bg-[#ee7c2b] text-white rounded-br-sm'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-sm'
                                }`}>{m.text}</div>
                        </div>
                    ))}

                    {/* Streaming text / thinking dots */}
                    {(isThinking || streamText) && (
                        <div className="flex justify-start gap-2">
                            <div className="size-8 rounded-full overflow-hidden border border-[#ee7c2b]/30 shrink-0 mt-1">
                                <img src={companion.img} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="max-w-[75%] px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-sm text-slate-900 dark:text-slate-100 text-base leading-relaxed">
                                {streamText || (
                                    <span className="flex gap-1.5 items-center h-5">
                                        {[0, 1, 2].map(i => (
                                            <span key={i} className="size-2 rounded-full bg-[#ee7c2b] animate-bounce"
                                                style={{ animationDelay: `${i * 0.15}s` }} />
                                        ))}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                    <div ref={msgEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 shrink-0 space-y-2">
                    <div className="flex items-center gap-2">
                        {voiceState === 'playing' && (
                            <button onClick={() => voiceManager.interrupt()}
                                className="size-11 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 hover:bg-blue-600 transition-colors">
                                <span className="material-symbols-outlined text-lg">stop</span>
                            </button>
                        )}
                        <input type="text" value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            placeholder={isRecording ? "正在录音，松开发送..." : "输入文字..."}
                            disabled={isThinking || isRecording}
                            className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-base focus:outline-none focus:ring-2 focus:ring-[#ee7c2b]/40 disabled:opacity-50" />
                        <button onMouseDown={startRecording} onMouseUp={stopRecording}
                            onTouchStart={e => { e.preventDefault(); startRecording(); }}
                            onTouchEnd={e => { e.preventDefault(); stopRecording(); }}
                            disabled={isThinking}
                            className={`size-11 rounded-full flex items-center justify-center shrink-0 transition-all select-none ${isRecording
                                    ? 'bg-red-500 text-white scale-110 shadow-lg shadow-red-500/30 animate-pulse'
                                    : 'bg-[#ee7c2b]/10 text-[#ee7c2b] hover:bg-[#ee7c2b]/20'
                                }`}>
                            <span className="material-symbols-outlined text-lg">{isRecording ? 'stop' : 'mic'}</span>
                        </button>
                        <button onClick={handleSend} disabled={!inputText.trim() || isThinking}
                            className="size-11 rounded-full bg-[#ee7c2b] text-white flex items-center justify-center shrink-0 hover:bg-[#ee7c2b]/90 transition-colors disabled:opacity-40">
                            <span className="material-symbols-outlined text-lg">send</span>
                        </button>
                    </div>
                    <p className="text-center text-xs text-slate-400">长按麦克风说话 · 蓝色按钮可打断 AI 发言</p>
                </div>
            </div>
        </div>
    );
};
// ─────────────────────────────────────────────────────────────────────────────

const COMPANIONS = [
    {
        name: '大勇 - 运动伙伴', info: '康复运动引导', status: '在线', color: 'green', gender: 'male',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDq1NVPf89AfFfiASe4SAG09VifaQkWhv5Oiy2ddZvUHyk7xebyt3M0kj-StrJbcXx43ap6o6806zzny6VR19f-QGAf5ETtRTdLJZwvpMsigOtORrLk355N_DIducVREvagjPMD5Yi8h8iFyQFdowBkYUcQxWZXC3jXj2pi4CjD-o8z5mNYOSlldLMmrkN1jgc0RFShFxxaytqOZFygt_uPCH5O1tAK5Ttmmti5yvTXCC7oV645qlCJ5d2Yb7PQzSNJ8vZ-j11hdA4'
    },
    {
        name: '小珍 - 生活助理', info: '日常用药提醒', status: '在线', color: 'green', gender: 'female',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6UuVLp9vSOTHQDHekslOMZToloBLb89FgWKIlOcq1tcq7Rvhaed68EVZp8pD5L1ffw56Drd6J1DI-zIlyWtcwM4FZ4l3Bc6gyLexRrldoZVgD6JobPxisWNBKY2br1cw0FQ0B_1Q9bq-eDrAgd_ec_C7AJYSN6THOU8x6Rbi-xpEiUndwnu_qtQ-663xQLb1EvOet7-Pl0tCmoH07-0rE1N6a1iLCXxICQQrOmJcIrbVnCa8NDX0t6DT1bd_pB7-LFq7DG7iVTqk'
    },
    {
        name: '慧阿姨 - 情感倾谈', info: '心理疏导与交流', status: '忙碌', color: 'yellow', gender: 'female',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDM_kPOz3M2zVqNtaa2bJ3ovJkxR-nZupWlBXte1cgpLgvpeDehv-WcPfEHXXKf-IDX65kLDFZ1l6x7Y5Gk1KUM_oadfk8ecEkiscPO7jLgtP_MNHKrxRVe4ssBhDqfvv-GixGSm_cQvX8zuhp7gbbW1b6XfRVSpOEiMjqzD-KuEBiBebHx97bwBLSs3isXY6s2Fl4yaQdpbMqgDgQgnJYjvXjUNj__yedxt0GkEB4CrJXNBRvFw_mLxkGfzca3jbjOd7gAcvaucOw'
    },
];

const SeniorCarePage = () => {
    const { navigate, l } = useLocalizedNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeCompanion, setActiveCompanion] = useState(null);

    return (
        <div className="bg-[#f8f7f6] dark:bg-[#221810] text-slate-900 dark:text-slate-100 font-display min-h-screen">
            {/* Chat Widget Overlay */}
            {activeCompanion && (
                <SeniorChatWidget
                    companion={activeCompanion}
                    onClose={() => setActiveCompanion(null)}
                />
            )}

            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    {/* Navigation Bar */}
                    <header className="flex items-center justify-between border-b border-[#ee7c2b]/20 px-6 md:px-10 py-5 bg-white dark:bg-slate-900 sticky top-0 z-40">
                        <div className="flex items-center gap-10">
                            <button
                                onClick={() => navigate(l('/companion'))}
                                className="flex items-center gap-2 md:gap-4 text-[#ee7c2b] hover:opacity-80 transition-opacity"
                            >
                                <span className="material-symbols-outlined text-3xl md:text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>settings_accessibility</span>
                                <h2 className="text-xl md:text-2xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">银发伙伴</h2>
                            </button>
                            <nav className="hidden lg:flex items-center gap-6">
                                <button onClick={() => navigate(l('/'))} className="text-lg font-bold text-slate-600 dark:text-slate-400 hover:text-[#ee7c2b] transition-colors">首页</button>
                                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                                <button onClick={() => navigate(l('/companion/daily'))} className="text-lg font-bold text-slate-600 dark:text-slate-400 hover:text-[#ee7c2b] transition-colors">日常陪伴</button>
                                <button onClick={() => navigate(l('/companion/senior'))} className="text-lg font-bold text-[#ee7c2b] border-b-4 border-[#ee7c2b] pb-1">长者关怀</button>
                                <button onClick={() => navigate(l('/companion/mental'))} className="text-lg font-bold text-slate-600 dark:text-slate-400 hover:text-[#ee7c2b] transition-colors">心理健康</button>
                                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
                                <button className="text-lg font-bold text-slate-400 hover:text-[#ee7c2b] transition-colors">健康监测</button>
                            </nav>
                        </div>
                        <div className="flex items-center gap-3 md:gap-6">
                            <label className="relative hidden xl:flex items-center">
                                <span className="material-symbols-outlined absolute left-3 text-slate-500">search</span>
                                <input className="w-48 xl:w-64 pl-12 pr-4 py-3 rounded-xl border-2 border-[#ee7c2b]/20 bg-slate-50 dark:bg-slate-800 focus:border-[#ee7c2b] focus:ring-0 text-lg" placeholder="搜索..." />
                            </label>
                            <button className="hidden sm:block bg-[#ee7c2b] hover:bg-[#ee7c2b]/90 text-white px-6 md:px-8 py-3 rounded-xl font-bold text-base md:text-lg shadow-lg shadow-[#ee7c2b]/20 transition-all">
                                管理后台
                            </button>
                            <div className="size-10 md:size-14 rounded-full border-2 border-[#ee7c2b] p-0.5 md:p-1 overflow-hidden">
                                <img className="w-full h-full object-cover rounded-full" alt="Admin" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhYF4zJnycspVu9kBSc7IN_DI0BCenQ74FjAsowMviGjd4q_x7DKWcVNoYxVvJmk9ij13nSwS_zuXBCgLwJOfqecBNunFMp3qKfHMdZBoUN8s1m5XvCXUsF721GcmtOgcuC08h3ow71kdGaik0Dan1xTR7z6_bd7Enl1twp18PLafPitQDRjwYYg7RuvgLAgs8QYjaEAV48dQ6MzlTItrtbY3UHBpAyEIXUf1btAwGbqbwokuvugOl0x5_3FqV9WA12HUf4xPD3Dk" />
                            </div>
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden flex items-center justify-center p-2 text-slate-600 dark:text-slate-400">
                                <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                            </button>
                        </div>

                        {isMobileMenuOpen && (
                            <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-[#ee7c2b]/20 shadow-lg lg:hidden flex flex-col p-6 gap-6 z-50">
                                <button onClick={() => { navigate(l('/')); setIsMobileMenuOpen(false); }} className="text-left py-2 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-300">首页</button>
                                <button onClick={() => { navigate(l('/companion/daily')); setIsMobileMenuOpen(false); }} className="text-left py-2 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-300">日常陪伴</button>
                                <button onClick={() => { navigate(l('/companion/senior')); setIsMobileMenuOpen(false); }} className="text-left py-2 border-b border-slate-100 dark:border-slate-800 font-bold text-[#ee7c2b]">长者关怀</button>
                                <button onClick={() => { navigate(l('/companion/mental')); setIsMobileMenuOpen(false); }} className="text-left py-2 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-600 dark:text-slate-300">心理健康</button>
                                <button className="w-full py-4 bg-[#ee7c2b] text-white text-center rounded-xl font-bold">管理后台</button>
                            </div>
                        )}
                    </header>

                    <main className="max-w-[1400px] mx-auto w-full px-6 md:px-10 py-10 space-y-12">
                        {/* Hero */}
                        <section className="flex flex-col gap-3 md:gap-4 mb-10 text-center md:text-left">
                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight">长者关怀管理中心</h1>
                            <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-400 font-display">智能 AI 辅助：全天候守护健康，丰富老年社交生活</p>
                        </section>

                        <div className="grid grid-cols-12 gap-8">
                            {/* Left Column */}
                            <div className="col-span-12 lg:col-span-8 space-y-8">
                                {/* AI Companions — now CLICKABLE to open chat */}
                                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                                    <div className="flex items-center justify-between mb-8">
                                        <h2 className="text-3xl font-bold flex items-center gap-3">
                                            <span className="material-symbols-outlined text-[#ee7c2b] text-4xl">smart_toy</span>
                                            AI 智能伴侣
                                        </h2>
                                        <span className="text-sm text-[#ee7c2b] font-bold bg-[#ee7c2b]/10 px-3 py-1 rounded-full">豆包 AI · 火山引擎</span>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        {COMPANIONS.map((c, idx) => (
                                            <div key={idx}
                                                onClick={() => setActiveCompanion(c)}
                                                className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl text-center border-2 border-transparent hover:border-[#ee7c2b] hover:shadow-lg hover:shadow-[#ee7c2b]/10 transition-all group cursor-pointer">
                                                <div className="size-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-md group-hover:scale-105 transition-transform">
                                                    <img className="w-full h-full object-cover" alt={c.name} src={c.img} />
                                                </div>
                                                <h3 className="text-xl font-bold mb-1">{c.name}</h3>
                                                <p className="text-slate-500 mb-3 text-lg">{c.info}</p>
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className={`px-4 py-1 ${c.color === 'green' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} rounded-full text-sm font-bold uppercase`}>
                                                        {c.status}
                                                    </span>
                                                </div>
                                                <button className="mt-4 w-full py-2.5 bg-[#ee7c2b] text-white rounded-xl font-bold text-sm hover:bg-[#ee7c2b]/90 transition-colors">
                                                    开始对话 →
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Medical & Diet */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-3xl border-2 border-blue-100 dark:border-blue-800">
                                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-800 dark:text-blue-300">
                                            <span className="material-symbols-outlined text-3xl">medical_services</span>
                                            医疗咨询建议
                                        </h2>
                                        <ul className="space-y-4">
                                            {['春季流感防护指引 — 建议本周内完成疫苗接种', '慢性病管理座谈 — 明日下午 2:00 在 3 楼大厅'].map((item, i) => (
                                                <li key={i} className="bg-white dark:bg-slate-800 p-4 rounded-xl flex items-start gap-4">
                                                    <span className="material-symbols-outlined text-blue-500">info</span>
                                                    <p className="text-slate-700 dark:text-slate-300">{item}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-3xl border-2 border-green-100 dark:border-green-800">
                                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-green-800 dark:text-green-300">
                                            <span className="material-symbols-outlined text-3xl">restaurant</span>
                                            今日营养膳食
                                        </h2>
                                        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl space-y-4">
                                            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                                <span className="text-lg font-bold">午餐推荐</span>
                                                <span className="text-green-600 font-bold">低盐低糖</span>
                                            </div>
                                            <p className="text-xl text-slate-700 dark:text-slate-300">清蒸鲈鱼 + 西兰花 + 紫薯饭</p>
                                            <div className="flex gap-2">
                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-bold">高蛋白</span>
                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-bold">易消化</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="col-span-12 lg:col-span-4 space-y-8">
                                {/* Blood Pressure */}
                                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                        <span className="material-symbols-outlined text-red-500 text-3xl">monitor_heart</span>
                                        血压实时监测
                                    </h2>
                                    <div className="text-center p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 border-[#ee7c2b]/10">
                                        <div className="text-5xl font-black text-[#ee7c2b] mb-2">118 / 76</div>
                                        <div className="text-lg text-slate-500 font-bold uppercase tracking-wider">mmHg - 正常范围</div>
                                        <div className="mt-6 flex justify-around text-sm">
                                            <div className="flex flex-col"><span className="text-slate-400">上次测量</span><span className="font-bold text-lg">122/80</span></div>
                                            <div className="w-px bg-slate-200 dark:bg-slate-700"></div>
                                            <div className="flex flex-col"><span className="text-slate-400">测量时间</span><span className="font-bold text-lg">10:30 AM</span></div>
                                        </div>
                                    </div>
                                    <button className="w-full mt-6 py-4 bg-[#ee7c2b]/10 text-[#ee7c2b] font-bold text-xl rounded-xl hover:bg-[#ee7c2b]/20 transition-all">
                                        立即手动测量
                                    </button>
                                </div>

                                {/* Community Activities */}
                                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                        <span className="material-symbols-outlined text-orange-500 text-3xl">groups</span>
                                        社区精彩活动
                                    </h2>
                                    <div className="space-y-6">
                                        {[
                                            { title: '笔墨人生 - 书法交流班', time: '今日 15:00 - 活动室 A', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADCOZUw5RgqQDLw9xtiN1eqJ49N3d2nrP1OYUMdA9Kc-jCzELFXRqD3GrNwsyAYeiEtWECSQsw6IDXl8CCd2oUVlJFy_9IslOtwMLpu3R7BN_YCgtWW098UNUo03zI_c79iKmuAnQsIEgOlZDkKzAaf2kOYWHxirFPKUfqINWksSTdpbhzUvpd29Do28UGqhlVdVbwRhGYsVTuiXTILHZmxajcrLHSkoNdnYGm-QY25fiGJZxDAlvvpovPJq_gkwWi4vo-pBGefl8' },
                                            { title: '益智棋牌 - 象棋锦标赛', time: '明日 09:30 - 阳光房', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDQIxJ4kMLI7-V8Wte9DFO92SsLzbVuvGnSyZNio3T7a_IRWlTMqwRzb_6KJ_0OVB-Ni36jyONYhysb3FV0hy98iRfox-2h9h1ewzXHFyrZwBPrOWqiCiUnzQE3av5OLRZ2UL-aIXyM9VFtxF-gGiWJ86c7a07m-WWE83on4LM-3g1SIE-z4UH4bKhE3Pzg4caI08ZWLd0YEpTeuzvp0cejVOIadXPDq3QIKzgvDgLdCb38hOZ-ap-9-a1Ae6suepRLqnfGZDoPcY' },
                                        ].map((a, i) => (
                                            <div key={i} className="group cursor-pointer">
                                                <div className="w-full h-32 rounded-xl overflow-hidden mb-3">
                                                    <img className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={a.title} src={a.img} />
                                                </div>
                                                <h3 className="text-lg font-bold">{a.title}</h3>
                                                <p className="text-slate-500">{a.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full mt-8 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">
                                        预约更多活动
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Health Reminder Banner */}
                        <div className="bg-[#ee7c2b] text-white p-6 md:p-10 rounded-3xl md:rounded-[2rem] flex flex-col md:flex-row items-center justify-between shadow-xl shadow-[#ee7c2b]/30 gap-8">
                            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 text-center md:text-left">
                                <div className="bg-white/20 p-4 md:p-6 rounded-2xl backdrop-blur-sm shrink-0">
                                    <span className="material-symbols-outlined text-4xl md:text-6xl">notification_important</span>
                                </div>
                                <div className="space-y-1 md:space-y-2">
                                    <h2 className="text-2xl md:text-4xl font-black">重要健康提醒</h2>
                                    <p className="text-lg md:text-xl opacity-90">张大爷，下午 4:00 记得服用降压药，随后有半小时的午间散步计划。</p>
                                </div>
                            </div>
                            <button className="w-full md:w-auto bg-white text-[#ee7c2b] px-8 md:px-12 py-4 md:py-5 rounded-2xl text-xl md:text-2xl font-black hover:bg-slate-50 transition-colors whitespace-nowrap">
                                我已确认
                            </button>
                        </div>
                    </main>

                    {/* Footer */}
                    <footer className="mt-20 border-t border-[#ee7c2b]/10 py-12 px-6 md:px-10 bg-slate-50 dark:bg-slate-900/50">
                        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="flex items-center gap-3 md:gap-4 text-[#ee7c2b] opacity-60">
                                <span className="material-symbols-outlined text-3xl">settings_accessibility</span>
                                <span className="text-lg md:text-xl font-bold">银发伙伴</span>
                            </div>
                            <div className="flex flex-wrap justify-center md:justify-end gap-6 md:gap-12 text-slate-400 font-bold text-sm md:text-base">
                                <a className="hover:text-[#ee7c2b] transition-colors" href="#privacy">隐私政策</a>
                                <a className="hover:text-[#ee7c2b] transition-colors" href="#emergency">紧急呼叫</a>
                                <a className="hover:text-[#ee7c2b] transition-colors" href="mailto:contact@uploadsoul.com">联系我们</a>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default SeniorCarePage;
