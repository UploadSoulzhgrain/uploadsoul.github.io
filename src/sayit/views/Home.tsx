
import React from 'react';
import { AppView } from '../types';

interface HomeProps {
  onNavigate: (view: AppView) => void;
  onStartInterview?: (topic: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate, onStartInterview }) => {
  const dailyTopic = "那时候的夏天是什么样的？";

  return (
    <div className="p-8 pb-4 flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-full border-4 border-amber-gold/20 overflow-hidden photo-shadow">
            <img 
              src="https://picsum.photos/seed/gentleman/200" 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-sans font-semibold text-amber-gold uppercase tracking-[0.2em] mb-1">SayIt 说吧</p>
            <h2 className="text-3xl font-bold leading-tight">下午好，张先生</h2>
          </div>
        </div>
        <button 
          onClick={() => onNavigate(AppView.SETTINGS)}
          className="size-12 flex items-center justify-center rounded-full bg-soft-paper vintage-border text-amber-gold"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>

      {/* Today's Prompt Card - AI Guided Interview Entry */}
      <div className="bg-soft-paper vintage-border rounded-2xl p-6 relative overflow-hidden group border-b-4 border-amber-gold/30">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <span className="material-symbols-outlined !text-6xl text-amber-gold">auto_awesome</span>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="size-2 bg-amber-gold rounded-full animate-pulse"></div>
          <p className="text-amber-gold font-sans font-bold text-xs uppercase tracking-widest">人生访谈 (Guided Interview)</p>
        </div>
        <h3 className="text-2xl font-bold leading-relaxed mb-4 font-display italic">“{dailyTopic}”</h3>
        <button 
          onClick={() => onStartInterview?.(dailyTopic)}
          className="flex items-center gap-2 bg-dark-brown text-cream px-8 py-4 rounded-full font-sans font-bold active:scale-95 transition-all shadow-lg hover:shadow-dark-brown/20"
        >
          <span className="material-symbols-outlined !text-2xl">mic</span>
          <span>开启深度记录</span>
        </button>
      </div>

      {/* Quick Access List */}
      <div className="space-y-4">
        <h4 className="text-xs font-sans font-bold text-dark-brown/50 uppercase tracking-widest mb-2">记录方式 (Memory Methods)</h4>
        
        <QuickAccessCard 
          icon="settings_voice" 
          title="时光留声机" 
          description="专业引导，勾勒属于您的人生传奇" 
          onClick={() => onNavigate(AppView.MEMOIR_ROOM)}
        />

        <QuickAccessCard 
          icon="park" 
          title="心情树洞" 
          description="倾吐心声，让思绪在静谧中沉淀" 
          onClick={() => onNavigate(AppView.MOOD_TREE_HOLLOW)}
        />

        <h4 className="text-xs font-sans font-bold text-dark-brown/50 uppercase tracking-widest mb-2 mt-6">传记管理 (Management)</h4>
        
        <QuickAccessCard 
          icon="auto_stories" 
          title="往昔掠影" 
          description="浏览并编辑您的生命故事集" 
          onClick={() => onNavigate(AppView.COLLECTION)}
        />
        
        <QuickAccessCard 
          icon="inventory_2" 
          title="时光胶囊" 
          description="留给未来的一份珍贵礼物" 
          onClick={() => onNavigate(AppView.TIME_CAPSULE)}
        />

        {/* Progress Bar */}
        <div className="mt-8 bg-amber-gold/5 rounded-2xl p-6 border border-amber-gold/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold font-sans">传记排版进度</span>
            <span className="text-amber-gold font-bold">68%</span>
          </div>
          <div className="h-2 w-full bg-dark-brown/10 rounded-full overflow-hidden">
            <div className="h-full bg-amber-gold w-[68%] transition-all duration-1000"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface QuickAccessCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}

const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ icon, title, description, onClick }) => (
  <div 
    onClick={onClick}
    className="group relative bg-soft-paper vintage-border rounded-2xl p-5 flex items-center gap-5 cursor-pointer hover:bg-amber-gold/5 active:bg-amber-gold/10 transition-colors"
  >
    <div className={`size-16 rounded-xl flex items-center justify-center ${icon === 'park' ? 'bg-[#1B4332]/10 text-[#1B4332]' : 'bg-amber-gold/10 text-amber-gold'}`}>
      <span className="material-symbols-outlined !text-4xl">{icon}</span>
    </div>
    <div className="flex-1">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-sm font-sans text-dark-brown/60 leading-tight">{description}</p>
    </div>
    <span className="material-symbols-outlined text-dark-brown/20 group-hover:text-amber-gold/40 transition-colors">arrow_forward_ios</span>
  </div>
);

export default Home;
