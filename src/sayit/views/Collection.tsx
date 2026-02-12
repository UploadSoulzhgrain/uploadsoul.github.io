
import React from 'react';
import { Chapter } from '../types';

interface CollectionProps {
  onSelectChapter?: () => void;
}

const chapters: Chapter[] = [
  {
    id: 'c1',
    title: '我的童年老屋',
    progress: 100,
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop',
    isCompleted: true
  },
  {
    id: 'c2',
    title: '青葱校园岁月',
    progress: 100,
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=1000&auto=format&fit=crop',
    isCompleted: true
  },
  {
    id: 'c3',
    title: '第一份工作',
    progress: 75,
    imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop',
    isCompleted: false
  }
];

const Collection: React.FC<CollectionProps> = ({ onSelectChapter }) => {
  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between py-4">
        <span className="material-symbols-outlined text-[28px] text-amber-gold">settings</span>
        <h2 className="text-xl font-bold">人生故事集</h2>
        <span className="material-symbols-outlined text-[28px] text-amber-gold">share</span>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="relative">
          <div 
            className="size-32 rounded-full ring-4 ring-amber-gold/20 ring-offset-4 ring-offset-cream bg-cover bg-center overflow-hidden"
            style={{ backgroundImage: `url('https://picsum.photos/seed/gentleman/300')` }}
          />
          <div className="absolute bottom-1 right-1 bg-amber-gold text-white p-1 rounded-full border-2 border-white">
            <span className="material-symbols-outlined text-[16px] block">verified</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">张明田 先生</p>
          <div className="flex items-center gap-2 mt-1 justify-center">
            <span className="material-symbols-outlined text-amber-gold text-sm">auto_stories</span>
            <p className="text-amber-gold text-base font-medium">已记录 128 个生命瞬间</p>
          </div>
          <p className="text-dark-brown/50 text-sm mt-1">SayIt 记录旅程第 365 天</p>
        </div>
      </div>

      {/* Completed Chapters */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">已完成篇章</h2>
          <span className="text-amber-gold text-sm font-medium">查看全部</span>
        </div>
        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
          {chapters.map((chapter) => (
            <div 
              key={chapter.id} 
              onClick={() => chapter.isCompleted && onSelectChapter?.()}
              className={`flex-none w-52 bg-white/40 p-3 rounded-xl border border-amber-gold/10 flex flex-col gap-3 transition-transform active:scale-95 cursor-pointer`}
            >
              <div 
                className="w-full aspect-[4/5] bg-cover bg-center rounded-lg relative overflow-hidden"
                style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.4)), url(${chapter.imageUrl})` }}
              >
                {chapter.isCompleted && (
                  <div className="absolute top-2 right-2 bg-amber-gold text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                    Official
                  </div>
                )}
              </div>
              <div>
                <p className="text-lg font-bold truncate">{chapter.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-1.5 flex-1 bg-dark-brown/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-gold transition-all duration-1000" 
                      style={{ width: `${chapter.progress}%` }}
                    />
                  </div>
                  <p className="text-amber-gold text-xs font-bold">{chapter.progress}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mood Calendar Section */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">心境月历</h2>
        <div className="bg-dark-brown p-5 rounded-2xl border border-amber-gold/10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-white text-lg font-bold">2023年11月</p>
              <p className="text-cream/50 text-xs">本月关键词：怀旧、安宁</p>
            </div>
            <div className="flex gap-2">
              <button className="size-8 rounded-full bg-white/5 flex items-center justify-center text-white"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
              <button className="size-8 rounded-full bg-white/5 flex items-center justify-center text-white"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2 mb-6">
            {[...Array(14)].map((_, i) => (
              <div 
                key={i} 
                className={`aspect-square rounded-md flex items-center justify-center text-[10px] text-white/40 ${
                  i === 5 ? 'bg-amber-gold shadow-lg shadow-amber-gold/20' : 
                  i === 10 ? 'bg-amber-gold/80' : 
                  'bg-white/10'
                }`}
              >
                {i + 1}
              </div>
            ))}
            <div className="aspect-square rounded-md border-2 border-dashed border-white/20 flex items-center justify-center text-[10px] text-white/20">15</div>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-lg">
            <div className="size-12 rounded-full bg-amber-gold/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-amber-gold">auto_awesome</span>
            </div>
            <p className="text-white text-sm font-medium leading-snug">
              “这段时间您记录了许多关于故乡的细节，文字间透着一份豁达与平和。这些记忆正在熠熠生辉。”
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Collection;
