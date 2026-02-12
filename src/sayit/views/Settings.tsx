
import React, { useState } from 'react';

interface SettingsProps {
  onBack: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const [selectedStyle, setSelectedStyle] = useState('literary');
  const [selectedLayout, setSelectedLayout] = useState('classic');
  const [userName, setUserName] = useState('张明田');
  const [userBio, setUserBio] = useState('退休教师，热爱生活，希望用文字记录下这一生的平凡与不平凡。');
  const [avatarUrl, setAvatarUrl] = useState('https://picsum.photos/seed/gentleman/300');

  const writingStyles = [
    { id: 'warm', title: '温馨记录', desc: '以感性的笔触，还原生活最本真的色彩。', img: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=400&auto=format&fit=crop' },
    { id: 'literary', title: '文学传记', desc: '如诗歌般优雅，赋予人生经历深刻的艺术底蕴。', img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=400&auto=format&fit=crop' },
    { id: 'simple', title: '纪实叙事', desc: '客观严谨，如同一部缓缓铺开的生命纪录片。', img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=400&auto=format&fit=crop' },
  ];

  const layoutStyles = [
    { id: 'classic', title: '典雅宣纸', desc: '古朴的纹理与留白，致敬传统文化的厚重感。', icon: 'auto_stories' },
    { id: 'modern', title: '现代简约', desc: '清爽的构图，让照片与文字在呼吸间交融。', icon: 'grid_view' },
    { id: 'artistic', title: '艺术画册', desc: '大胆的配色与排版，展现生命独特的张力。', icon: 'palette' },
  ];

  // 模拟头像上传/更换
  const handleAvatarChange = () => {
    const randomId = Math.floor(Math.random() * 1000);
    setAvatarUrl(`https://picsum.photos/seed/${randomId}/300`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-cream/90 backdrop-blur-md border-b border-amber-gold/10">
        <button onClick={onBack} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 transition-colors">
          <span className="material-symbols-outlined text-2xl text-dark-brown/70">arrow_back_ios_new</span>
        </button>
        <h1 className="text-xl font-bold tracking-tight">账户与传记设定</h1>
        <div className="w-10"></div>
      </nav>

      <main className="px-6 py-8 space-y-12 pb-40 overflow-y-auto">
        
        {/* User Profile Section */}
        <section className="space-y-8 bg-soft-paper/50 p-6 rounded-3xl border border-amber-gold/10 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-dark-brown">个人资料</h2>
            <span className="material-symbols-outlined text-amber-gold opacity-50">badge</span>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="relative group cursor-pointer" onClick={handleAvatarChange}>
              <div className="size-28 rounded-full border-4 border-white shadow-xl overflow-hidden photo-shadow transition-transform group-hover:scale-105">
                <img src={avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
              </div>
              <div className="absolute -bottom-1 -right-1 bg-amber-gold text-white p-1.5 rounded-full shadow-lg border-2 border-white">
                <span className="material-symbols-outlined !text-sm block font-bold">edit</span>
              </div>
            </div>

            <div className="w-full space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-amber-gold font-bold text-[10px] uppercase tracking-widest ml-1">昵称 / 姓名</label>
                <div className="relative">
                  <input 
                    className="w-full h-12 px-4 rounded-xl bg-white border border-amber-gold/20 focus:border-amber-gold focus:ring-4 focus:ring-amber-gold/5 text-base transition-all font-sans text-dark-brown" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="请输入您的姓名"
                    type="text" 
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-amber-gold/30 text-lg">person</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-amber-gold font-bold text-[10px] uppercase tracking-widest ml-1">个人简介</label>
                <div className="relative">
                  <textarea 
                    className="w-full px-4 py-3 rounded-xl bg-white border border-amber-gold/20 focus:border-amber-gold focus:ring-4 focus:ring-amber-gold/5 text-sm transition-all font-sans resize-none h-24 text-dark-brown" 
                    value={userBio}
                    onChange={(e) => setUserBio(e.target.value)}
                    placeholder="简单介绍一下您自己..."
                  />
                  <span className="material-symbols-outlined absolute right-4 bottom-4 text-amber-gold/30 text-lg">description</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Work Information Section */}
        <section className="space-y-6">
           <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">作品信息</h2>
            <div className="h-px flex-1 bg-amber-gold/10 mx-4"></div>
            <span className="material-symbols-outlined text-amber-gold opacity-50">book_2</span>
          </div>
          
          <div className="flex flex-col gap-3">
            <label className="text-amber-gold font-bold text-[10px] uppercase tracking-widest ml-1">传记题名</label>
            <div className="relative">
              <input 
                className="w-full h-14 px-5 rounded-2xl bg-white border border-amber-gold/20 focus:border-amber-gold focus:ring-4 focus:ring-amber-gold/5 text-lg transition-all font-display italic text-dark-brown" 
                placeholder="例如：我的人生足迹" 
                type="text" 
              />
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-amber-gold/30">edit_note</span>
            </div>
          </div>
        </section>

        {/* Writing Style Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">文字笔触</h2>
            <div className="h-px flex-1 bg-amber-gold/10 mx-4"></div>
            <span className="material-symbols-outlined text-amber-gold opacity-50">ink_pen</span>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {writingStyles.map((style) => (
              <div 
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`relative rounded-3xl overflow-hidden bg-white border-2 transition-all cursor-pointer group ${
                  selectedStyle === style.id ? 'border-amber-gold ring-8 ring-amber-gold/5 shadow-2xl scale-[1.02]' : 'border-transparent hover:border-amber-gold/20 shadow-sm'
                }`}
              >
                <div 
                  className={`h-28 w-full bg-cover bg-center transition-all duration-700 ${selectedStyle === style.id ? 'scale-110' : 'opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60'}`}
                  style={{ backgroundImage: `url(${style.img})` }}
                />
                <div className="p-5 flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">{style.title}</h3>
                    <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedStyle === style.id ? 'bg-amber-gold border-amber-gold' : 'border-dark-brown/10'}`}>
                      {selectedStyle === style.id && <span className="material-symbols-outlined !text-[14px] text-white font-bold">check</span>}
                    </div>
                  </div>
                  <p className="text-dark-brown/60 text-sm leading-relaxed">{style.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Layout Style Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">排版意境</h2>
            <div className="h-px flex-1 bg-amber-gold/10 mx-4"></div>
            <span className="material-symbols-outlined text-amber-gold opacity-50">auto_awesome_motion</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {layoutStyles.map((layout) => (
              <div 
                key={layout.id}
                onClick={() => setSelectedLayout(layout.id)}
                className={`p-5 rounded-3xl bg-white border-2 transition-all cursor-pointer flex items-center gap-5 ${
                  selectedLayout === layout.id ? 'border-amber-gold bg-amber-gold/5 shadow-lg' : 'border-transparent hover:bg-white/60 shadow-sm'
                }`}
              >
                <div className={`size-14 rounded-2xl flex items-center justify-center transition-colors ${selectedLayout === layout.id ? 'bg-amber-gold text-white shadow-lg shadow-amber-gold/20' : 'bg-soft-sepia text-amber-gold/50'}`}>
                  <span className="material-symbols-outlined !text-3xl">{layout.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{layout.title}</h3>
                  <p className="text-dark-brown/50 text-xs">{layout.desc}</p>
                </div>
                {selectedLayout === layout.id && (
                  <span className="material-symbols-outlined text-amber-gold">verified</span>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 left-0 w-full px-8 py-8 bg-gradient-to-t from-cream via-cream to-transparent z-40 max-w-md mx-auto">
        <button className="w-full h-16 bg-dark-brown text-white font-bold text-xl rounded-2xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 hover:bg-black group">
          <span className="tracking-widest">保存并同步资料</span>
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">cloud_sync</span>
        </button>
        <p className="text-center text-dark-brown/30 text-[10px] mt-4 font-bold uppercase tracking-widest">您的更改将同步至个人云端博物馆</p>
      </div>
    </div>
  );
};

export default Settings;
