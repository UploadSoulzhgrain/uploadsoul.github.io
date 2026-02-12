
import React from 'react';

interface TimeCapsuleProps {
  onStartWriting: () => void;
}

const TimeCapsule: React.FC<TimeCapsuleProps> = ({ onStartWriting }) => {
  return (
    <div className="flex-1 flex flex-col paper-texture">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-cream/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-amber-gold/20">
        <span className="material-symbols-outlined text-ink-brown text-3xl cursor-pointer">arrow_back_ios</span>
        <h1 className="text-2xl font-bold tracking-tight">时光胶囊</h1>
        <span className="material-symbols-outlined text-ink-brown text-3xl cursor-pointer">help_outline</span>
      </nav>

      <main className="px-6 py-8 space-y-8">
        <header className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4 leading-tight">留住此刻，寄往未来</h2>
          <p className="text-lg opacity-80 leading-relaxed max-w-xs mx-auto">在这里，您可以给未来的自己写信，或者让思绪随波漂流。</p>
        </header>

        <section className="group relative bg-white rounded-xl p-8 shadow-xl border border-amber-gold/10">
          <div className="flex items-start justify-between mb-6">
            <div className="bg-amber-gold/10 p-4 rounded-full">
              <span className="material-symbols-outlined text-amber-gold text-5xl">mail_outline</span>
            </div>
            <span className="material-symbols-outlined text-3xl text-amber-gold">auto_awesome</span>
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-ink-brown">寄往未来 (To the Future)</h3>
            <p className="text-lg text-ink-brown/70 leading-relaxed">
              给一年后的自己或家人写一封信，封存此刻的心情。点击开始撰写您的第一封时光信件。
            </p>
          </div>
          <div className="mt-8">
            <button 
              onClick={onStartWriting}
              className="w-full bg-dark-brown text-white py-5 rounded-xl text-xl font-medium flex items-center justify-center gap-3 shadow-lg shadow-dark-brown/20 active:scale-95 transition-transform"
            >
              <span>开始写信</span>
              <span className="material-symbols-outlined">edit_note</span>
            </button>
          </div>
        </section>

        <section className="group relative bg-white rounded-xl p-8 shadow-xl border border-amber-gold/10">
          <div className="flex items-start justify-between mb-6">
            <div className="bg-amber-gold/10 p-4 rounded-full">
              <span className="material-symbols-outlined text-amber-gold text-5xl">set_meal</span>
            </div>
            <span className="material-symbols-outlined text-3xl text-amber-gold">waves</span>
          </div>
          <div className="space-y-3">
            <h4 className="text-2xl font-bold text-ink-brown">漂流瓶 (Drift Bottle)</h4>
            <p className="text-lg text-ink-brown/70 leading-relaxed">
              将心事装进瓶中，投向大海，或捞起一份来自远方的祝愿。每一份相遇都是岁月的馈赠。
            </p>
          </div>
          <div className="mt-8 flex gap-4">
            <button className="flex-1 bg-amber-gold/10 text-ink-brown border-2 border-amber-gold py-4 rounded-xl text-lg font-bold">
              投掷心事
            </button>
            <button className="flex-1 bg-dark-brown text-white py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2">
              捞取缘分
            </button>
          </div>
        </section>
        
        <div className="h-10" />
      </main>
    </div>
  );
};

export default TimeCapsule;
