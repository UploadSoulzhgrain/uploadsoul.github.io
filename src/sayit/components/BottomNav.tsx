
import React from 'react';
import { AppView } from '../types';

interface BottomNavProps {
  activeView: AppView;
  onNavigate: (view: AppView) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onNavigate }) => {
  const navItems = [
    { view: AppView.HOME, icon: 'home', label: '主页' },
    { view: AppView.COLLECTION, icon: 'auto_stories', label: '记录' },
    { view: AppView.TIME_CAPSULE, icon: 'inventory_2', label: '胶囊' },
    { view: AppView.SETTINGS, icon: 'person', label: '我的' },
  ];

  return (
    <nav className="bg-soft-paper/95 backdrop-blur-md border-t border-border-sepia py-3 px-8 flex justify-between items-center fixed bottom-0 w-full max-w-md z-50">
      {navItems.map((item) => (
        <button
          key={item.view}
          onClick={() => onNavigate(item.view)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeView === item.view ? 'text-amber-gold' : 'text-dark-brown/40'
          }`}
        >
          <span className="material-symbols-outlined text-[28px]">{item.icon}</span>
          <span className="text-[10px] font-sans font-bold uppercase">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;
