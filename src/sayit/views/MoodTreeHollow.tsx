import React, { useState, useRef, useEffect } from 'react';
import { MemorySnippet } from '../types';
import { GeminiService } from '../services/geminiService';

interface VentSnippet extends MemorySnippet {
  mood?: string;
}

interface MoodTreeHollowProps {
  onBack: () => void;
}

const MOODS = [
  { icon: 'sunny', label: '开心', color: '#FCD34D', glow: 'shadow-[0_0_20px_rgba(252,211,77,0.3)]' },
  { icon: 'cloud', label: '平静', color: '#60A5FA', glow: 'shadow-[0_0_20px_rgba(96,165,250,0.3)]' },
  { icon: 'water_drop', label: '忧郁', color: '#818CF8', glow: 'shadow-[0_0_20px_rgba(129,140,248,0.3)]' },
  { icon: 'bedtime', label: '倦怠', color: '#A78BFA', glow: 'shadow-[0_0_20px_rgba(167,139,250,0.3)]' },
  { icon: 'bolt', label: '生气', color: '#EF4444', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]' },
  { icon: 'grain', label: '焦灼', color: '#F87171', glow: 'shadow-[0_0_20px_rgba(248,113,113,0.3)]' },
];

/**
 * MoodTreeHollow Component - Dark Edition
 * A sophisticated emotional sanctuary for younger users.
 * Features a high-tech yet organic aesthetic.
 */
const MoodTreeHollow: React.FC<MoodTreeHollowProps> = ({ onBack }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTextMode, setIsTextMode] = useState(false);
  const [inputText, setInputText] = useState('');
  const [selectedMood, setSelectedMood] = useState(MOODS[1]);
  const [isChatActive, setIsChatActive] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('在这个静谧的树洞里，说出你的秘密吧...');
  const [isThinking, setIsThinking] = useState(false);
  const [vents, setVents] = useState<VentSnippet[]>([
    {
      id: 'v1',
      timestamp: '深夜',
      category: 'Soul',
      text: '“看了一场很长的电影，突然觉得世界很大，我很渺小。”',
      mood: '平静'
    }
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [vents]);

  const toggleRecording = () => {
    if (isThinking) return;
    setIsRecording(!isRecording);
    if (isRecording) {
      // Simulation of captured speech
      handleNewVent("我刚才一直在想，人的一生到底在追寻什么。");
    }
  };

  const handleSendText = () => {
    if (!inputText.trim() || isThinking) return;
    handleNewVent(inputText);
    setInputText('');
    setIsTextMode(false);
  };

  const handleNewVent = async (text: string) => {
    const newVent: VentSnippet = {
      id: Date.now().toString(),
      timestamp: 'Just now',
      category: 'Venting',
      text: `“${text}”`,
      mood: selectedMood.label
    };
    setVents(prev => [...prev, newVent]);

    if (isChatActive) {
      setIsThinking(true);
      try {
        const nextResponse = await GeminiService.generateEmpathicResponse(text);
        setCurrentPrompt(nextResponse);
      } catch (err) {
        console.error("Gemini failed", err);
        setCurrentPrompt("抱歉，我似乎离线了，但我依然在听。");
      } finally {
        setIsThinking(false);
      }
    } else {
      setCurrentPrompt('我已经将你的心情密封。只有树洞知道你的秘密。');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-slate-200 selection:bg-amber-500/30 font-sans overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-indigo-900/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-900/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Modern Header */}
      <header className="relative z-20 px-6 py-6 flex items-center justify-between border-b border-white/5 backdrop-blur-md bg-black/20">
        <button onClick={onBack} className="size-11 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-90">
          <span className="material-symbols-outlined text-slate-400 text-2xl">menu</span>
        </button>
        <div className="text-center">
          <h1 className="text-lg font-black tracking-widest uppercase italic bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">Mood Hollow</h1>
          <p className="text-[9px] font-bold text-slate-500 tracking-[0.3em] uppercase">Private Sanctuary</p>
        </div>
        <div className="size-11 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 to-emerald-500 shadow-lg shadow-amber-500/10">
          <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-amber-500/80">person</span>
          </div>
        </div>
      </header>

      {/* Main Experience Area */}
      <main className="relative z-10 flex-1 flex flex-col overflow-hidden">
        {/* Interaction Stage */}
        <div className="flex flex-col items-center pt-8 pb-4 shrink-0">
          {/* Glowing Orb/Tree Image */}
          <div className="relative group">
            <div className={`size-44 rounded-full border border-white/10 flex items-center justify-center transition-all duration-1000 bg-slate-900/20 backdrop-blur-xl relative z-10 ${isThinking ? 'animate-pulse' : ''}`}>
               <img 
                src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=400&auto=format&fit=crop" 
                alt="Sacred Tree" 
                className={`w-full h-full object-cover rounded-full opacity-40 mix-blend-screen transition-transform duration-1000 ${isRecording ? 'scale-110 rotate-6' : 'group-hover:scale-105'}`}
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black via-transparent to-transparent"></div>
              
              {/* Central Status Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`material-symbols-outlined !text-5xl transition-all duration-500 ${isRecording ? 'text-red-500 animate-ping' : isThinking ? 'text-amber-500 rotate-180' : 'text-emerald-500 opacity-60'}`}>
                  {isRecording ? 'graphic_eq' : isThinking ? 'cached' : 'spa'}
                </span>
              </div>
            </div>
            {/* Outer Glows */}
            <div className="absolute inset-0 rounded-full bg-amber-500/5 blur-[40px] animate-pulse"></div>
            <div className={`absolute -inset-4 rounded-full border border-amber-500/10 animate-[spin_20s_linear_infinite] pointer-events-none`}></div>
          </div>

          <div className="text-center mt-10 px-8 h-20 flex items-center justify-center">
            <h2 className={`text-xl font-medium leading-relaxed tracking-tight transition-all duration-700 ${isThinking ? 'opacity-30 scale-95 blur-sm' : 'opacity-100'}`}>
              {currentPrompt}
            </h2>
          </div>
        </div>

        {/* Scrollable Vent History */}
        <div 
          ref={scrollRef}
          className="flex-1 px-6 space-y-4 overflow-y-auto no-scrollbar mask-gradient-b pb-8"
        >
          {vents.map((vent, idx) => (
            <div 
              key={vent.id} 
              className="bg-white/[0.03] backdrop-blur-md border border-white/5 p-5 rounded-3xl animate-fade-in shadow-xl hover:bg-white/[0.05] transition-colors"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400/70 flex items-center gap-2">
                  <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  {vent.mood} · {vent.timestamp}
                </span>
                <span className="material-symbols-outlined !text-sm text-white/10">push_pin</span>
              </div>
              <p className="text-[15px] leading-relaxed text-slate-300 font-display italic">“{vent.text}”</p>
            </div>
          ))}
        </div>
      </main>

      {/* Control Surface */}
      <div className="relative z-30 p-6 pb-10 bg-gradient-to-t from-black via-black/95 to-transparent border-t border-white/5">
        <div className="flex flex-col gap-6 max-w-md mx-auto">
          
          {/* Mood Selection Pills */}
          {!isRecording && !isTextMode && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {MOODS.map((mood) => (
                <button 
                  key={mood.label}
                  onClick={() => setSelectedMood(mood)}
                  className={`flex-none px-5 py-3 rounded-2xl border transition-all flex items-center gap-2 ${
                    selectedMood.label === mood.label 
                    ? 'bg-white/10 border-white/20 text-white ' + mood.glow
                    : 'bg-white/[0.02] border-white/5 text-slate-500'
                  }`}
                >
                  <span className="material-symbols-outlined !text-lg" style={{ color: selectedMood.label === mood.label ? mood.color : 'inherit' }}>
                    {mood.icon}
                  </span>
                  <span className="text-xs font-black uppercase tracking-tighter">{mood.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* AI Companion Toggle (The "Link" Button) */}
          <div className="flex justify-center">
            <button 
              onClick={() => setIsChatActive(!isChatActive)}
              className={`relative px-6 py-2.5 rounded-full border transition-all flex items-center gap-3 overflow-hidden group ${
                isChatActive 
                ? 'bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)]' 
                : 'bg-slate-900/50 border-white/5 text-slate-500'
              }`}
            >
              <div className={`absolute inset-0 bg-amber-500/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ${isChatActive ? 'translate-x-0' : ''}`}></div>
              <span className={`material-symbols-outlined !text-xl relative z-10 ${isChatActive ? 'animate-pulse' : ''}`}>
                {isChatActive ? 'auto_awesome' : 'link_off'}
              </span>
              <span className="text-[11px] font-black uppercase tracking-[0.1em] relative z-10">
                {isChatActive ? 'AI 伴侣已接入' : '连接 AI 灵魂伴侣'}
              </span>
            </button>
          </div>

          {/* Input Area */}
          {isTextMode ? (
            <div className="bg-[#111] border border-white/10 rounded-3xl p-5 shadow-2xl animate-fade-in ring-1 ring-amber-500/10">
              <textarea 
                autoFocus
                className="w-full bg-transparent border-none focus:ring-0 text-lg text-slate-200 placeholder:text-slate-700 resize-none h-28"
                placeholder="此刻的心情，无法宣之于口..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div className="flex justify-between items-center border-t border-white/5 pt-4">
                <button onClick={() => setIsTextMode(false)} className="text-slate-500 font-black uppercase tracking-tighter text-[10px] flex items-center gap-1">
                  <span className="material-symbols-outlined !text-base">mic_none</span>
                  语音
                </button>
                <button 
                  onClick={handleSendText} 
                  disabled={!inputText.trim() || isThinking}
                  className="bg-amber-500 text-black px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-xs active:scale-95 disabled:opacity-20 transition-all shadow-lg shadow-amber-500/20"
                >
                  封存
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsTextMode(true)}
                className="size-16 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center justify-center text-slate-400 active:scale-90 transition-all hover:bg-white/[0.06]"
              >
                <span className="material-symbols-outlined text-2xl">edit_square</span>
              </button>
              <button 
                onMouseDown={toggleRecording}
                onMouseUp={toggleRecording}
                onTouchStart={toggleRecording}
                onTouchEnd={toggleRecording}
                disabled={isThinking}
                className={`flex-1 h-16 rounded-2xl flex items-center justify-center gap-4 transition-all shadow-2xl ${
                  isRecording 
                  ? 'bg-red-500/20 text-red-500 border border-red-500/50 shadow-red-500/10' 
                  : 'bg-white text-black font-black uppercase tracking-widest'
                } ${isThinking ? 'opacity-50 cursor-wait' : ''}`}
              >
                <div className={`size-10 rounded-xl flex items-center justify-center transition-all ${isRecording ? 'bg-red-500/20' : 'bg-black/10'}`}>
                  <span className="material-symbols-outlined text-2xl font-bold">{isRecording ? 'mic' : 'mic_none'}</span>
                </div>
                <span className="text-sm">
                  {isRecording ? '正在记录...' : '按住倾诉'}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Global Navigation - Minimal Dark Style */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/5 py-3 px-12 flex justify-between items-center max-w-md mx-auto z-40 rounded-t-[32px] shadow-2xl">
        <button onClick={onBack} className="flex flex-col items-center gap-1 opacity-30 hover:opacity-100 transition-opacity">
           <span className="material-symbols-outlined text-2xl">home</span>
           <span className="text-[8px] font-black uppercase tracking-tighter">首页</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-amber-500">
           <span className="material-symbols-outlined text-3xl font-variation-fill">park</span>
           <span className="text-[8px] font-black uppercase tracking-tighter">树洞</span>
        </button>
        <button className="flex flex-col items-center gap-1 opacity-30">
           <span className="material-symbols-outlined text-2xl">auto_stories</span>
           <span className="text-[8px] font-black uppercase tracking-tighter">往昔</span>
        </button>
      </nav>
    </div>
  );
};

export default MoodTreeHollow;
