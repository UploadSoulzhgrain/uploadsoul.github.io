
import React, { useState } from 'react';

interface LetterToFutureProps {
  onBack: () => void;
}

const LetterToFuture: React.FC<LetterToFutureProps> = ({ onBack }) => {
  const [text, setText] = useState('');
  const [selectedYear, setSelectedYear] = useState(2024);

  const years = [
    { year: 2024, date: '10月24日' },
    { year: 2026, date: '10月24日' },
    { year: 2028, date: '10月24日' },
    { year: 2030, date: '10月24日' }
  ];

  return (
    <div className="flex-1 flex flex-col bg-cream min-h-screen font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-cream/95 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center justify-center size-10 rounded-full hover:bg-black/5 transition-colors">
          <span className="material-symbols-outlined text-dark-brown text-3xl">chevron_left</span>
        </button>
        <h1 className="text-xl font-bold tracking-tight text-dark-brown">给未来的信</h1>
        <span className="material-symbols-outlined text-dark-brown/60 text-3xl">help</span>
      </nav>

      <main className="flex-1 flex flex-col px-6 pb-12 overflow-y-auto">
        {/* Envelope Background Graphic */}
        <div className="relative mt-2 mb-6">
          <div className="w-full h-36 bg-[#EADCC8] rounded-t-[40px] relative overflow-hidden flex items-end justify-center">
            <div className="absolute top-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent"></div>
            <div className="size-16 bg-[#A67C52] rounded-full border-4 border-white flex items-center justify-center shadow-lg transform translate-y-6 z-10">
              <span className="material-symbols-outlined text-white text-3xl">mail</span>
            </div>
          </div>
        </div>

        {/* Title and Intro */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-dark-brown mb-1">写给未来的思念</h2>
          <p className="text-dark-brown/40 text-sm font-medium">珍藏此时此刻的心情，让时间来见证</p>
        </div>

        {/* Writing Paper Area */}
        <div className="bg-[#FFFDF9] rounded-3xl p-6 shadow-sm border border-amber-gold/10 relative overflow-hidden min-h-[380px] flex flex-col">
          {/* Paper Texture Dotted */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
          
          <div className="flex justify-between items-center mb-6 z-10">
            <span className="text-dark-brown/30 text-xs font-bold">2023年10月24日</span>
            <div className="flex items-center gap-1 text-[#A67C52] text-[10px] font-bold">
              <span className="material-symbols-outlined !text-[14px]">check_circle</span>
              <span>已自动保存</span>
            </div>
          </div>

          <div className="relative flex-1 z-10">
            {/* Horizontal Lines overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{ 
              backgroundImage: 'linear-gradient(transparent 39px, #F0E6D2 39px, #F0E6D2 40px)', 
              backgroundSize: '100% 40px',
              marginTop: '36px'
            }}></div>
            
            <textarea
              className="w-full h-full bg-transparent border-none focus:ring-0 text-dark-brown/80 text-lg leading-[40px] resize-none p-0 font-display italic"
              placeholder="亲爱的自己，见字如面..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          {/* Voice Input Floating Button */}
          <button className="absolute bottom-6 right-6 size-16 bg-[#C69B3D]/90 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform z-20">
            <span className="material-symbols-outlined !text-3xl">mic</span>
          </button>
        </div>

        {/* Save/Seal Button */}
        <button className="mt-8 w-full bg-[#A67C52] text-white py-5 rounded-2xl text-xl font-bold shadow-xl shadow-[#A67C52]/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
          <span className="material-symbols-outlined !text-2xl font-bold">lock_open</span>
          <span>密封保存</span>
        </button>

        {/* Year Selector Horizontal List */}
        <div className="mt-8 flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {years.map((item) => (
            <div 
              key={item.year}
              onClick={() => setSelectedYear(item.year)}
              className={`flex-none w-28 bg-white p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 ${
                selectedYear === item.year ? 'border-[#A67C52] bg-[#FDF8F3]' : 'border-transparent shadow-sm'
              }`}
            >
              <h4 className="text-2xl font-bold text-dark-brown">{item.year}</h4>
              <p className="text-[10px] text-dark-brown/40 font-bold">{item.date}</p>
              <div className={`size-5 rounded-full border-2 mt-2 flex items-center justify-center ${selectedYear === item.year ? 'border-[#A67C52] bg-[#A67C52]' : 'border-dark-brown/10'}`}>
                {selectedYear === item.year && <span className="material-symbols-outlined !text-[12px] text-white font-bold">check</span>}
              </div>
            </div>
          ))}
          {/* Add custom year option */}
          <div className="flex-none w-28 bg-white/40 p-5 rounded-2xl border-2 border-dashed border-dark-brown/10 flex flex-col items-center justify-center gap-2 opacity-50">
             <span className="material-symbols-outlined text-dark-brown/20 text-3xl">add</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LetterToFuture;
