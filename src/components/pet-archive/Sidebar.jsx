import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar = ({ activeView, onViewChange }) => {
    const { user } = useAuth();

    const menuGroups = [
        {
            label: '主要功能',
            items: [
                { id: 'my-pets', icon: 'favorite', label: '宠爱空间' },
                { id: 'workshop', icon: 'draw', label: '创作工坊' },
                { id: 'templates', icon: 'auto_awesome', label: '网页模板' },
            ]
        },
        {
            label: '账户资源',
            items: [
                { id: 'gallery', icon: 'photo_library', label: '媒体资产库' },
                { id: 'settings', icon: 'settings', label: '偏好设置' },
            ]
        },
    ];

    return (
        <aside className="w-72 pd-sidebar flex flex-col h-screen shrink-0">
            {/* Logo */}
            <div className="p-8">
                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(236,182,19,0.4)]" style={{ background: 'var(--pet-primary)' }}>
                        <span className="material-symbols-outlined text-lg" style={{ color: 'var(--pet-bg-dark)', fontWeight: 700 }}>storm</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-100">萌宠档案馆</h1>
                        <p className="text-xs font-medium tracking-widest uppercase" style={{ color: 'rgba(236,182,19,0.7)' }}>Pet Archive</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto pd-scrollbar">
                {menuGroups.map((group, gi) => (
                    <div key={gi} className={gi > 0 ? 'pt-8' : ''}>
                        <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'rgba(236,182,19,0.4)' }}>
                            {group.label}
                        </div>
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => onViewChange(item.id)}
                                    className={`w-full pd-nav-item ${activeView === item.id ? 'active' : ''}`}
                                >
                                    <span className="material-symbols-outlined text-xl" style={activeView === item.id ? { fontVariationSettings: "'FILL' 1" } : {}}>
                                        {item.icon}
                                    </span>
                                    <span>{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            {/* User Info */}
            <div className="p-6 mt-auto" style={{ borderTop: '1px solid var(--pet-border-dark)' }}>
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(18,16,10,0.5)', border: '1px solid var(--pet-border-dark)' }}>
                    <div className="w-10 h-10 rounded-full overflow-hidden" style={{ border: '2px solid rgba(236,182,19,0.3)' }}>
                        <img
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAafz8CtNj_TxWeHanlkswaCpeZukaf80LRx86Jrvl0-zqn7ZEzb35UOqEK3PipuS3eHMbaNpp-8n5FbikrwBB_md2YtAoWLCUdqGVCjvImtTj-Ftr5B2B20GHSej9XPI6Gjhs-Fb8QxjaYYJV7BuPIeE3egQEFzBf-vQ6Z7T5hUux89h5hEz4sJsvSdVs3rxg6lQq_WNrl8fumbga4Cwl0iYLtxOSRr5dyQiuhcXta7zIuCWApf3shFMbZse-FbQg3IXRyxzp0orI"
                            alt="User avatar"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{user?.email?.split('@')[0] || '林深见鹿'}</p>
                        <p className="text-[10px] font-medium" style={{ color: 'rgba(236,182,19,0.6)' }}>白银造物主</p>
                    </div>
                    <span className="material-symbols-outlined text-sm text-slate-500 cursor-pointer hover:text-white">logout</span>
                </div>
            </div>
        </aside>
    );
};
