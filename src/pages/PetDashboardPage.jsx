import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Send, Eye, Sparkles, Download, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { MediaService } from '../services/mediaService';
import { useAuth } from '../contexts/AuthContext';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import '../styles/pet-style.css';

// Components
import { Sidebar } from '../components/pet-archive/Sidebar';
import { WorkshopForm } from '../components/pet-archive/WorkshopForm';
import { PetPreview } from '../components/pet-archive/PetPreview';
import { TemplateSelector } from '../components/pet-archive/TemplateSelector';

// Layouts
import { ClassicLayout } from '../components/pet-archive/layouts/ClassicLayout';
import { PlayfulLayout } from '../components/pet-archive/layouts/PlayfulLayout';
import { EditorialLayout } from '../components/pet-archive/layouts/EditorialLayout';

const EMPTY_PET_DATA = {
  name: '',
  species: 'Dog',
  birthday: '',
  memorialDay: '',
  bio: '',
  habits: [],
  favoriteFood: '',
  favoriteToy: '',
  avatarUrl: '',
  bannerUrl: '',
  memories: [],
  templateId: 'classic'
};

export default function PetDashboardPage() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('workshop');
  const [petData, setPetData] = useState(EMPTY_PET_DATA);
  const [isPublic, setIsPublic] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pets, setPets] = useState([]);
  const [storageUsageMB, setStorageUsageMB] = useState(0);

  useEffect(() => {
    if (user) {
      loadPets();
      loadQuota();
    }
  }, [user]);

  const loadQuota = async () => {
    const res = await MediaService.checkQuota(user.id, 0);
    setStorageUsageMB(res.currentUsageMB);
  };

  const loadPets = async () => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPets(data || []);

      if (data && data.length > 0) {
        const latestPet = data[0];
        setPetData({
          ...EMPTY_PET_DATA,
          ...latestPet,
          habits: latestPet.habits || [],
          memories: latestPet.memories || []
        });
      }
    } catch (error) {
      console.error('Error loading pets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    if (!petData.name) {
      toast.error('请输入萌宠昵称');
      return;
    }

    try {
      const payload = {
        ...petData,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };

      let res;
      if (petData.id) {
        res = await supabase
          .from('pets')
          .update(payload)
          .eq('id', petData.id);
      } else {
        res = await supabase
          .from('pets')
          .insert([payload]);
      }

      if (res.error) throw res.error;
      toast.success('保存成功！');
      loadPets();
    } catch (error) {
      console.error('Save failed:', error);
      toast.error('保存失败，请重试');
    }
  };

  const handleExportData = async () => {
    try {
      const { data: petsData, error: petsError } = await supabase
        .from('pets')
        .select('*')
        .eq('user_id', user.id);
      if (petsError) throw petsError;

      const exportData = {
        version: '1.1.0',
        timestamp: new Date().toISOString(),
        user_id: user.id,
        pets: petsData
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pet-archive-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('导出失败');
    }
  };

  const renderContent = () => {
    if (isLoading) return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--pet-primary)' }}></div>
      </div>
    );

    switch (activeView) {
      case 'workshop':
        return (
          <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8">
            <div className="col-span-8">
              <WorkshopForm data={petData} onChange={setPetData} userId={user.id} />
            </div>
            <div className="col-span-4">
              <PetPreview data={petData} />
            </div>
          </div>
        );
      case 'templates':
        return (
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                萌宠专属网页模板
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                为您的萌宠选择一个最贴合它个性的视觉风格，一键生成专属主页，记录生活中的美好点滴。
              </p>
            </div>
            <TemplateSelector
              selectedId={petData.templateId}
              onSelect={(id) => setPetData({ ...petData, templateId: id })}
              onPreview={() => setIsPreviewMode(true)}
            />
          </div>
        );
      case 'my-pets':
        return (
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-black text-white mb-2">我的萌宠</h2>
                <p className="text-slate-500">管理您创建的所有档案</p>
              </div>
              <button
                onClick={() => { setPetData(EMPTY_PET_DATA); setActiveView('workshop'); }}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 pd-btn-primary"
              >
                <Plus size={18} />
                <span>新建档案</span>
              </button>
            </div>

            {pets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[40vh] text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-slate-600 mb-6 pd-card">
                  <Sparkles size={40} />
                </div>
                <h2 className="text-2xl font-black text-white">暂无其他萌宠</h2>
                <p className="text-slate-500 mt-2 max-w-sm">您目前还没有创建萌宠档案。</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pets.map(pet => (
                  <div key={pet.id} className="pd-card p-6 group overflow-hidden hover:shadow-lg transition-all" style={{ borderColor: 'transparent' }}>
                    <div className="aspect-square rounded-xl overflow-hidden mb-4 relative">
                      <img src={pet.avatarUrl || "https://picsum.photos/seed/pet/400/400"} alt={pet.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <button
                          onClick={() => { setPetData(pet); setActiveView('workshop'); }}
                          className="w-full py-2 bg-white text-black text-xs font-bold rounded-xl"
                        >
                          编辑档案
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-lg">{pet.name}</h4>
                        <p className="text-xs text-slate-500">{pet.species}</p>
                      </div>
                      <button className="text-slate-600 hover:text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-[60vh]">
            <p className="text-slate-500 font-bold uppercase tracking-widest">即将开放 / Coming Soon</p>
          </div>
        );
    }
  };

  if (isPreviewMode) {
    const Layout = petData.templateId === 'editorial' ? EditorialLayout :
      petData.templateId === 'playful' ? PlayfulLayout : ClassicLayout;
    return <Layout data={petData} onBack={() => setIsPreviewMode(false)} />;
  }

  return (
    <div className="pet-dashboard flex h-screen overflow-hidden">
      <Helmet>
        <title>萌宠档案馆 | UploadSoul</title>
      </Helmet>

      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <main className="flex-1 flex flex-col h-full overflow-hidden" style={{ background: 'var(--pet-bg-dark)' }}>
        {/* Header */}
        <header className="h-20 pd-header flex items-center justify-between px-10 shrink-0 z-10">
          <div>
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
              {activeView === 'workshop' ? '创作工坊' : activeView === 'templates' ? '网页模板' : '宠爱空间'}
              <span className="pd-badge">
                {activeView === 'workshop' ? '编辑中' : '浏览中'}
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Public Toggle */}
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full" style={{ background: 'var(--pet-surface-dark)', border: '1px solid var(--pet-border-dark)' }}>
              <span className="text-xs font-medium text-slate-400">公开展示</span>
              <button
                onClick={() => setIsPublic(!isPublic)}
                className="pd-toggle"
              />
              <span className="material-symbols-outlined text-lg" style={{ color: 'var(--pet-primary)' }}>public</span>
            </div>

            <div className="h-8 w-px" style={{ background: 'var(--pet-border-dark)' }} />

            <div className="flex items-center gap-3">
              <button onClick={handleSave} className="pd-btn-outline px-5 py-2">
                保存草稿
              </button>
              <button onClick={() => setIsPreviewMode(true)} className="pd-btn-primary px-6 py-2">
                发布到广场
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pd-scrollbar p-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
