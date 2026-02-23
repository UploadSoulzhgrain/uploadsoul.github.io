import React from 'react';
import { format } from 'date-fns';

export const PetPreview = ({ data }) => {
    return (
        <div className="sticky top-0 space-y-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4" style={{ color: 'rgba(236,182,19,0.5)' }}>
                实时预览卡片
            </div>

            {/* Main Preview Card */}
            <div className="rounded-2xl overflow-hidden shadow-2xl pd-preview-card transition-all duration-500" style={{
                background: 'linear-gradient(to bottom right, var(--pet-surface-dark), var(--pet-bg-dark))',
                border: '1px solid var(--pet-border-dark)'
            }}>
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                        className="w-full h-full object-cover opacity-80"
                        src={data.avatarUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBMSAB0-RyolVhYLB70CTy9MTYC8S5hxSpqcAyHfCszPEFoQYEpYsNo5i29F03FbxITeDvymPjGfLqr7owEvzaUWASgoB1X8UX_pM34cM9eTTUrk0YfYNttl6hcvhEVtic8py4Ah5RpStPpAHmGPmaDZHUvOGxax4qLf6I9OoU9GMSqaqlPpcJAu3KEIpnhdBjsE8Hq7MDLvuagOOuuEIH2AwPAHZfmx9q8pG1kz-dZB7B49G5CxgbTyOjLnV_1V2_1sAuSxTQnMuw"}
                        alt={data.name || "Pet preview"}
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--pet-bg-dark), transparent, transparent)' }} />
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="inline-block text-[10px] font-black px-2 py-0.5 rounded mb-2" style={{ background: 'var(--pet-primary)', color: 'var(--pet-bg-dark)' }}>
                            萌宠档案
                        </div>
                        <h4 className="text-3xl font-black text-white drop-shadow-lg">{data.name || '糯米'}</h4>
                        <p className="font-bold text-sm tracking-widest mt-1" style={{ color: 'var(--pet-primary)' }}>
                            {data.birthday ? format(new Date(data.birthday), 'yyyy.MM.dd') : '2018.05.12'} - {data.memorialDay ? format(new Date(data.memorialDay), 'yyyy') : '至今'}
                        </p>
                    </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                    <div className="flex gap-2">
                        {(data.habits?.length > 0 ? data.habits.slice(0, 3) : ['贪吃鬼', '粘人精']).map((h, i) => (
                            <span key={i} className="text-[10px] px-2 py-1 rounded text-slate-300" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                # {h}
                            </span>
                        ))}
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 italic">
                        "{data.bio || '记录下TA陪你度过的每一个瞬间，或是那些只有你们知道的秘密...'}"
                    </p>

                    <div className="pt-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--pet-border-dark)' }}>
                        <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full overflow-hidden" style={{ border: '1px solid var(--pet-bg-dark)', background: '#475569' }}>
                                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgxyIJSA0iVtsXzwJxP8Rgft42C5GE327CQnoW_9Yj-WsYNPtvJVfl047dE6uXITsgI0yCWh_iK1zzw69hN1aFFS2EohT4EqQKCeT-yuFEHOjF8vk9ZAtvphHSxbu38v30q6yhla2-QXFpKN-J0JT1ZnlLkGq3K8ItfvHucrnx-Th5Hdhxn950yIZO4fYrrIBfQo9Zam97ozu_wrpPrt3AtDwAzx2hLZdqvgwVLS7-scWlMzw6vhhyq7wYnv5KEipfPMuYLy7b1s0" alt="Collaborator" />
                            </div>
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ border: '1px solid var(--pet-bg-dark)', background: '#475569' }}>+12</div>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold" style={{ color: 'var(--pet-primary)' }}>
                            <span className="material-symbols-outlined text-sm">favorite</span>
                            <span>共建者</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline Preview */}
            <div className="pd-glass p-6" style={{ borderLeft: '4px solid var(--pet-primary)' }}>
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-300 mb-4">时间轴标记</h4>
                <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                        <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 pd-glow-dot" style={{ background: 'var(--pet-primary)' }} />
                        <div>
                            <p className="text-xs font-bold">初次遇见</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                                {data.birthday ? `${format(new Date(data.birthday), 'yyyy年M月d日')} · 雨后清晨` : '2018年5月12日 · 雨后清晨'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start opacity-30">
                        <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: 'var(--pet-border-dark)' }} />
                        <p className="text-xs text-slate-500 font-medium italic">等待添加更多记忆点...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
