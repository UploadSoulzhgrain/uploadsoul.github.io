
import React, { useState, useEffect } from 'react';
import { MemorySnippet } from '../types';
import { GeminiService } from '../services/geminiService';

interface MemoirRoomProps {
  onBack: () => void;
  initialTopic?: string;
  forceGuided?: boolean;
}

const MemoirRoom: React.FC<MemoirRoomProps> = ({ onBack, initialTopic, forceGuided = false }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTextMode, setIsTextMode] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isGuidedMode, setIsGuidedMode] = useState(forceGuided || !!initialTopic);
  const [currentPrompt, setCurrentPrompt] = useState(initialTopic || '记录此刻的心情或一段珍贵的回忆...');
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [snippets, setSnippets] = useState<MemorySnippet[]>([
    {
      id: '1',
      timestamp: '五分钟前',
      category: initialTopic ? '引导访谈' : '自主记录',
      text: initialTopic ? `“访谈主题：${initialTopic}”` : '“您可以随时开始记录，我会静静聆听。”'
    }
  ]);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      // In a real app, we'd get text from speech-to-text
      handleNewSnippet("那天阳光很好，我走在老家的青石板路上。");
    }
  };

  const handleSendText = () => {
    if (!inputText.trim()) return;
    handleNewSnippet(inputText);
    setInputText('');
    setIsTextMode(false);
  };

  const handleNewSnippet = async (text: string) => {
    const newSnippet: MemorySnippet = {
      id: Date.now().toString(),
      timestamp: '刚才',
      category: '您的讲述',
      text: `“${text}”`
    };
    setSnippets(prev => [newSnippet, ...prev]);
    
    const updatedHistory = [...conversationHistory, `用户说：${text}`];
    setConversationHistory(updatedHistory);
    
    setIsThinking(true);
    try {
      if (isGuidedMode) {
        // AI takes an active role in interviewing
        const nextQuestion = await GeminiService.generateInterviewQuestion(updatedHistory, currentPrompt);
        setCurrentPrompt(nextQuestion);
        setConversationHistory(prev => [...prev, `AI提问：${nextQuestion}`]);
      } else {
        // AI simply acknowledges and offers a gentle follow-up if requested, otherwise stays quiet
        const nextPrompt = await GeminiService.generateNextPrompt(text);
        setCurrentPrompt(nextPrompt);
      }
    } catch (err) {
      console.error("AI response failed", err);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-cream/95 backdrop-blur-sm px-6 py-5 flex items-center justify-between border-b border-amber-gold/20">
        <button onClick={onBack} className="flex items-center gap-1 text-dark-brown/70 hover:text-dark-brown transition-colors">
          <span className="material-symbols-outlined text-2xl">chevron_left</span>
          <span className="text-lg font-bold">返回</span>
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-xl font-bold tracking-tight">时光留声机</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-amber-gold font-bold">
            {isGuidedMode ? 'AI Guided Interview' : 'Autonomous Recording'}
          </p>
        </div>
        <button className="text-dark-brown/70">
          <span className="material-symbols-outlined text-2xl">history</span>
        </button>
      </header>

      {/* Mode Switcher */}
      <div className="px-6 pt-4 flex justify-center">
        <div className="bg-amber-gold/5 p-1 rounded-full border border-amber-gold/20 flex gap-1">
          <button 
            onClick={() => setIsGuidedMode(true)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${isGuidedMode ? 'bg-amber-gold text-white shadow-md' : 'text-amber-gold/60'}`}
          >
            AI 引导模式
          </button>
          <button 
            onClick={() => setIsGuidedMode(false)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${!isGuidedMode ? 'bg-amber-gold text-white shadow-md' : 'text-amber-gold/60'}`}
          >
            自主记录模式
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-6 pt-6 pb-64 overflow-y-auto">
        <div className="flex flex-col items-center gap-6 mb-12">
          <div className="relative">
            <div className={`size-20 rounded-full album-border overflow-hidden bg-soft-sepia flex items-center justify-center transition-all ${isRecording || isThinking ? 'scale-110 ring-4 ring-amber-gold/30' : ''}`}>
              <span className={`material-symbols-outlined text-amber-gold text-4xl transition-all ${isRecording ? 'animate-pulse' : isThinking ? 'animate-spin opacity-50' : ''}`}>
                {isRecording ? 'graphic_eq' : isThinking ? 'hourglass_top' : isGuidedMode ? 'auto_awesome' : 'settings_voice'}
              </span>
            </div>
            {isGuidedMode && <div className="absolute -bottom-1 -right-1 bg-amber-gold text-white text-[8px] px-2 py-0.5 rounded-full font-bold">访谈员</div>}
          </div>
          
          <div className="text-center space-y-3">
            <p className="text-amber-gold font-bold text-[10px] tracking-[0.2em] uppercase opacity-70">
              {isThinking ? '正在为您整理...' : isGuidedMode ? '访谈建议' : '随心所记'}
            </p>
            <h2 className="text-2xl font-bold leading-snug max-w-xs mx-auto text-dark-brown font-display italic px-4">
              {currentPrompt}
            </h2>
          </div>
        </div>

        {/* Snippets List */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-amber-gold/20"></span>
            <span className="text-amber-gold font-bold text-[10px] tracking-widest uppercase">
              {isGuidedMode ? '访谈实录' : '碎片记录'}
            </span>
            <span className="h-px flex-1 bg-amber-gold/20"></span>
          </div>

          <div className="space-y-4">
            {snippets.map((snippet) => (
              <div key={snippet.id} className="bg-white/50 border border-amber-gold/5 p-4 rounded-xl flex gap-4 items-start shadow-sm animate-fade-in transition-all">
                <div className="flex-1">
                  <p className="text-dark-brown/40 text-[9px] uppercase tracking-wider mb-1 font-sans font-bold">{snippet.timestamp} · {snippet.category}</p>
                  <p className="text-base leading-relaxed font-display text-dark-brown/90">{snippet.text}</p>
                </div>
                {isGuidedMode && <span className="material-symbols-outlined text-amber-gold/20 text-sm">verified_user</span>}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Interaction Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-8 pt-4 bg-gradient-to-t from-cream via-cream/95 to-transparent flex flex-col items-center gap-4 max-w-md mx-auto z-30">
        {isRecording && (
          <div className="flex items-end justify-center gap-1.5 h-8 mb-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-1 bg-amber-gold rounded-full transition-all duration-300 ${
                ['h-3', 'h-8', 'h-5', 'h-7', 'h-4'][i]
              } animate-bounce`} style={{ animationDelay: `${i * 0.1}s` }}></div>
            ))}
          </div>
        )}
        
        {isTextMode ? (
          <div className="w-full bg-white rounded-2xl p-4 vintage-border flex flex-col gap-3 shadow-2xl animate-fade-in ring-4 ring-amber-gold/5">
            <textarea 
              autoFocus
              className="w-full bg-transparent border-none focus:ring-0 text-lg font-display placeholder:text-dark-brown/20 resize-none h-24"
              placeholder={isGuidedMode ? "回答访谈员..." : "写下您的记忆..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="flex justify-between items-center border-t border-amber-gold/10 pt-3">
              <button 
                onClick={() => setIsTextMode(false)}
                className="text-dark-brown/50 font-bold flex items-center gap-1 text-xs"
              >
                <span className="material-symbols-outlined text-sm">mic</span>
                <span>返回语音</span>
              </button>
              <button 
                onClick={handleSendText}
                disabled={!inputText.trim() || isThinking}
                className="bg-amber-gold text-white px-6 py-2 rounded-full font-bold active:scale-95 disabled:opacity-30 transition-all flex items-center gap-2 shadow-lg"
              >
                <span>投递记忆</span>
                <span className="material-symbols-outlined !text-lg">arrow_forward</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 w-full max-w-sm">
            <div className="flex items-center gap-4 w-full">
               <button 
                onClick={() => setIsTextMode(true)}
                className="size-16 bg-white vintage-border rounded-full flex items-center justify-center text-amber-gold active:scale-95 transition-transform shadow-sm"
              >
                <span className="material-symbols-outlined text-2xl">edit_note</span>
              </button>
              
              <button 
                onMouseDown={toggleRecording}
                onMouseUp={toggleRecording}
                onTouchStart={toggleRecording}
                onTouchEnd={toggleRecording}
                disabled={isThinking}
                className={`flex-1 h-20 text-white rounded-full flex items-center justify-center gap-4 transition-all shadow-xl active:scale-95 ${
                  isRecording ? 'bg-red-500 ring-4 ring-red-50 ring-offset-0' : 'bg-dark-brown hover:bg-black/90'
                } ${isThinking ? 'opacity-50 cursor-wait' : ''}`}
              >
                <span className="material-symbols-outlined text-3xl">{isRecording ? 'check' : 'mic'}</span>
                <span className="text-lg font-bold tracking-wider">
                  {isRecording ? '讲述完毕' : isThinking ? '正在处理...' : '按住开始讲述'}
                </span>
              </button>
            </div>
            
            <p className="text-dark-brown/40 text-[10px] font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-xs">info</span>
              {isGuidedMode ? 'AI正在访谈，帮助您挖掘深度细节' : '自主模式下，您可以随意诉说任何往事'}
            </p>
          </div>
        )}
        <div className="h-4"></div>
      </div>
    </div>
  );
};

export default MemoirRoom;
