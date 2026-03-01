import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Heart,
  ArrowRight,
  ChevronRight,
  Home,
  Dog,
  BookOpen,
  User,
  Sparkles,
  ArrowLeft,
  Share2,
  Camera,
  Mic,
  Video,
  MessageSquare,
  Bell,
  Wand2,
  LayoutGrid,
  Settings,
  Loader2,
  CheckCircle2,
  Menu,
  Mountain,
  Shirt,
  Calendar,
  Activity,
  History,
  Image as LucideImage
} from 'lucide-react';
import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate';
import toast from 'react-hot-toast';
import axios from 'axios';
import './PetPage.css';

// --- Sub-components ---

const HubView = ({ pets, onNavigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto px-6"
    >
      {/* Search & Profile Bar */}
      <div className="flex justify-end gap-4 py-6">
        <button className="w-10 h-10 rounded-full border border-soulpet-primary/20 flex items-center justify-center hover:bg-soulpet-primary/10 transition-colors text-soulpet-primary">
          <Search size={20} />
        </button>
        <div className="w-10 h-10 rounded-full border-2 border-soulpet-primary overflow-hidden cursor-pointer hover:scale-110 transition-transform">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaH9FFkrvGHWVcJA3zRANrJgUDpa73Cn4HTrxz51HqTFMlMEA0lQ4gr0mDAxBGV2HfqWmXY-ZwQk-wdEBaUheaeNuryPhM9NSwBK1x1R4BpZao70MWn3FElJNPUUUJfibnVJJrpl8ekhmS-aNByuaPH9KV94j9RscYYrxMzgu0eLQhwY_Lejzbhy11-vDoibwJpowibuuU9s2y_wq7HLft15dYcuQ_22JNl3XkPXF40WpXihDzYlJ4BTRGAx_slXZSYqL-fpLzN0mC"
            alt="Profile"
          />
        </div>
      </div>

      {/* Hero Section */}
      <section className="text-center mt-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-soulpet-cream">虚拟灵宠中心</h1>
        <p className="text-lg md:text-xl text-soulpet-cream/70 font-light max-w-2xl mx-auto leading-relaxed">
          在数字宇宙，邂逅你的心灵陪伴。<br />
          <span className="text-soulpet-primary/80 font-medium italic">Soulful companionship in the digital universe</span>
        </p>
      </section>

      {/* Primary Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Memory Replicant Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="group relative rounded-3xl overflow-hidden glass-card-pet whisper-depth transition-all duration-300 cursor-pointer"
          onClick={() => onNavigate('reconstruct')}
        >
          <div className="aspect-[4/5] relative">
            <img
              className="w-full h-full object-cover opacity-60 filter grayscale-[0.2] sepia-[0.3]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHhB_81781P7SghMW8fNEHeg-j_sliLDLLDWcdvE7dQKeiGSODkFS8I-afKLLvy_1u9sg-iAh86R2VXmAnIjuqH6tqwOJAZLuEXsyu2C7loiC6DOqW-nJV-tiBdEQvMHlMoPQrjGN3ZesRFfDrIU60McDW2OsCmvmtUF7-GZ2pPTTwdTOoKyoWxB_P7jzRr-BOSiZ3pCdtg01Axf01DNz-4Erx1eJQ5WieLzgBBQ5y9b9ELCo_1dMCYI2So7aA8pKadIwSV0waY5m8"
              alt="Archive"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#221F1D] via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-soulpet-primary text-soulpet-bg-dark text-[10px] font-bold tracking-widest uppercase rounded-full">Archive</span>
              </div>
              <h2 className="text-3xl font-bold mb-3 tracking-tight text-soulpet-cream">宠物分身</h2>
              <p className="text-soulpet-primary text-sm font-semibold mb-4 uppercase tracking-widest">MEMORY REPLICANT</p>
              <p className="text-soulpet-cream/80 text-base leading-relaxed mb-6">
                Revive precious memories in a digital form. Preserve the essence of past bonds through soulful algorithms.
              </p>
              <button className="w-full py-4 bg-soulpet-primary text-soulpet-bg-dark font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-soulpet-primary/90 transition-all active:scale-95 shadow-lg shadow-soulpet-primary/20">
                <span>探索记忆</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Digital Encounter Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="group relative rounded-3xl overflow-hidden glass-card-pet whisper-depth transition-all duration-300 cursor-pointer"
          onClick={() => onNavigate('connect')}
        >
          <div className="aspect-[4/5] relative">
            <img
              className="w-full h-full object-cover opacity-60 filter sepia-[0.1]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYFJ-rmEnH5mDzYJaQZebzDUGD1yrZytV2rfkhLNNEfRuuKDEIb-FY1YHaNUbwArCXViXzwPoGlpUaQiGe9wAQfILwGyjAiv2lszHVfK33BRtf_4ZWtElzoRaMFKxnr_6-8KRZd_4BNmhzDmYIqjxIFB_MTn32osqjpuZScXE3HIYVLn3sM9fCg1NEFfyX3qtXOSDnFllFWSnO_DuN4-a3lY5bFn6lTL1myPzfOTA1QuqXyTAJKbqrLeRN3aXxuz49rlxbvOlisvqW"
              alt="New Life"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#221F1D] via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-soulpet-primary text-soulpet-bg-dark text-[10px] font-bold tracking-widest uppercase rounded-full">New Life</span>
              </div>
              <h2 className="text-3xl font-bold mb-3 tracking-tight text-soulpet-cream">数字邂逅</h2>
              <p className="text-soulpet-primary text-sm font-semibold mb-4 uppercase tracking-widest">DIGITAL ENCOUNTER</p>
              <p className="text-soulpet-cream/80 text-base leading-relaxed mb-6">
                Meet a new companion born from stardust and code. A unique consciousness waiting for your connection.
              </p>
              <button className="w-full py-4 bg-soulpet-primary text-soulpet-bg-dark font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-soulpet-primary/90 transition-all active:scale-95 shadow-lg shadow-soulpet-primary/20">
                <span>领养伙伴</span>
                <Heart size={18} fill="currentColor" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mood Calendar Section */}
      <section className="w-full mt-12 mb-8">
        <div className="glass-card-pet whisper-depth rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-soulpet-primary/10">
          <div>
            <h3 className="text-xl font-bold mb-2 text-soulpet-cream">心情反射历</h3>
            <p className="text-soulpet-cream/60">Your emotional journey tracked through digital resonance.</p>
          </div>
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-lg mood-gradient opacity-40"></div>
            <div className="w-8 h-8 rounded-lg mood-gradient opacity-60"></div>
            <div className="w-8 h-8 rounded-lg mood-gradient opacity-80"></div>
            <div className="w-8 h-8 rounded-lg mood-gradient"></div>
            <div className="w-8 h-8 rounded-lg border border-soulpet-primary/20 flex items-center justify-center cursor-pointer hover:bg-soulpet-primary/10 transition-colors">
              <Plus size={16} className="text-soulpet-primary" />
            </div>
          </div>
          <button className="text-soulpet-primary font-bold flex items-center gap-2 hover:translate-x-1 transition-transform">
            查看完整记录 <ChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* Owned Companions Section */}
      <section className="w-full mb-12 pb-20">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-soulpet-cream">
          <span className="w-1.5 h-6 bg-soulpet-primary rounded-full"></span>
          已拥有的伙伴
        </h3>
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x">
          {pets.map((pet) => (
            <motion.div
              key={pet.id}
              whileHover={{ y: -5 }}
              className="min-w-[180px] glass-card-pet rounded-2xl p-5 flex flex-col items-center gap-4 border-soulpet-primary/5 snap-start shadow-xl"
            >
              <div className="w-24 h-24 rounded-full border-2 border-soulpet-primary/30 overflow-hidden shadow-inner bg-soulpet-bg-dark flex items-center justify-center">
                {pet.image ? (
                  <img className={`w-full h-full object-cover ${pet.status === 'inactive' ? 'opacity-40 grayscale' : ''}`} src={pet.image} alt={pet.name} />
                ) : (
                  <span className="text-4xl">{pet.emoji}</span>
                )}
              </div>
              <div className="text-center">
                <p className="font-bold text-base text-soulpet-cream">{pet.name}</p>
                <p className="text-[11px] text-soulpet-cream/40 font-semibold uppercase tracking-widest">{pet.type || (pet.status === 'inactive' ? '待激活' : '数字灵宠')}</p>
              </div>
              <button
                onClick={() => onNavigate('interaction', pet)}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${pet.status === 'inactive'
                  ? 'bg-soulpet-primary/10 text-soulpet-primary border border-soulpet-primary/20 hover:bg-soulpet-primary/20'
                  : 'bg-soulpet-primary text-soulpet-bg-dark hover:brightness-110 shadow-lg shadow-soulpet-primary/10'
                  }`}>
                {pet.status === 'inactive' ? '去激活' : '去互动'}
              </button>
            </motion.div>
          ))}
          <div
            className="min-w-[180px] glass-card-pet rounded-2xl p-5 flex flex-col items-center justify-center gap-3 border-dashed border-2 border-soulpet-primary/20 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
            onClick={() => onNavigate('connect')}
          >
            <div className="w-16 h-16 rounded-full bg-soulpet-primary/10 flex items-center justify-center text-soulpet-primary">
              <Plus size={32} />
            </div>
            <p className="text-xs font-bold text-soulpet-primary uppercase tracking-widest">领养新伙伴</p>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

const ReconstructView = ({ onBack }) => {
  const [mode, setMode] = useState('text'); // 'bark' or 'text'
  const [anniversary, setAnniversary] = useState(true);
  const [memories, setMemories] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File states
  const [photo, setPhoto] = useState(null);
  const [audio, setAudio] = useState(null);
  const [video, setVideo] = useState(null);

  // Refs for file inputs
  const photoInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleFileClick = (ref) => ref.current?.click();

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'photo') setPhoto(file);
    if (type === 'audio') setAudio(file);
    if (type === 'video') setVideo(file);

    toast.success(`${file.name} 已选中`, {
      style: { borderRadius: '10px', background: '#2D2B2A', color: '#be946f' }
    });
  };

  const handleSubmit = async () => {
    if (!photo && !audio && !video) {
      toast.error('请至少上传一份素材', { icon: '📂' });
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('正在链接数字生命，请稍候...');

    try {
      const formData = new FormData();
      formData.append('userId', '00000000-0000-4000-8000-000000000000'); // Mocked user ID
      formData.append('petName', '我的宝贝');
      formData.append('mode', mode);
      formData.append('memories', memories);
      formData.append('anniversaryReminder', anniversary);

      if (photo) formData.append('photo', photo);
      if (audio) formData.append('audio', audio);
      if (video) formData.append('video', video);

      const response = await axios.post('/api/pet/reconstruct', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        toast.success('复刻请求已提交！我们将尽快完成灵魂注入。', { id: loadingToast, duration: 4000 });
        setTimeout(() => onBack(), 3000);
      } else {
        throw new Error(response.data.error || '提交失败');
      }
    } catch (err) {
      console.error('Submit Error:', err);
      toast.error(`复刻失败: ${err.message}`, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="max-w-md md:max-w-4xl lg:max-w-5xl mx-auto min-h-screen bg-soulpet-bg-dark md:rounded-3xl md:my-10 md:shadow-2xl md:border md:border-soulpet-primary/10 relative pb-32 overflow-hidden"
    >
      {/* Hidden file inputs */}
      <input type="file" ref={photoInputRef} onChange={(e) => handleFileChange(e, 'photo')} accept="image/*" className="hidden" />
      <input type="file" ref={audioInputRef} onChange={(e) => handleFileChange(e, 'audio')} accept="audio/*" className="hidden" />
      <input type="file" ref={videoInputRef} onChange={(e) => handleFileChange(e, 'video')} accept="video/*" className="hidden" />

      {/* Header */}
      <header className="flex items-center justify-between p-6 sticky top-0 bg-soulpet-bg-dark/80 backdrop-blur-md z-40 border-b border-soulpet-primary/5">
        <button
          onClick={onBack}
          className="flex size-10 items-center justify-center rounded-full bg-soulpet-surface shadow-whisper text-slate-100 hover:bg-soulpet-primary/20 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-slate-100 text-lg font-bold tracking-wider">复刻心爱的它</h1>
        <button className="flex size-10 items-center justify-center rounded-full bg-soulpet-surface shadow-whisper text-slate-100">
          <Share2 size={24} />
        </button>
      </header>

      <div className="md:grid md:grid-cols-5 md:gap-10 p-6 md:p-10 space-y-8 md:space-y-0 h-full overflow-y-auto custom-scrollbar content-start">
        {/* Left Column (Desktop: 2/5 columns) */}
        <div className="md:col-span-2 space-y-8">
          {/* Intro Banner */}
          <section>
            <div className="relative h-48 md:h-80 w-full rounded-3xl overflow-hidden shadow-2xl border border-soulpet-primary/10">
              <div className="absolute inset-0 bg-gradient-to-t from-soulpet-bg-dark via-transparent to-transparent z-10"></div>
              <img
                className="w-full h-full object-cover opacity-80 filter sepia-[.2] brightness-75"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUZRQ3JFNtWTyMWVPcyNlq1T9CbMvM2A_hfa4KJpWomJ4RzmbrN4KTg3npHeRkL0Vf1BfGRh_u6xAAvu83BAmn_-kMex5W6XsyRFjMzx3imPHKkKWLn2WhCIqp2G4cizDqaT80TKM3Dlpb355kZJUEzgO5WWqE_RUNArWp6P_oQK2PstAaU94Yd74gpIQKRAUTP5OzaQ_267Aw8iwpfyGc1Vu0u6-y62d18Z5FuUJoTlAxos9H8VgPUyDYkZF3Xrgm1X93eApW0vAh"
                alt="Memory"
              />
              <div className="absolute bottom-6 left-6 z-20">
                <span className="bg-soulpet-primary/20 text-soulpet-primary text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-soulpet-primary/30 backdrop-blur-sm font-bold">AI Replicant</span>
                <p className="text-slate-100 text-base mt-2 font-medium opacity-90 max-w-[200px]">让记忆在数字世界永恒停留</p>
              </div>
            </div>
          </section>

          {/* Desktop Only Guide */}
          <div className="hidden md:block glass-card-pet p-8 rounded-3xl border-soulpet-primary/10 space-y-4">
            <h3 className="text-soulpet-primary font-bold text-lg flex items-center gap-2">
              <Sparkles size={20} /> 复刻指南
            </h3>
            <ul className="space-y-3 text-soulpet-cream/60 text-sm leading-relaxed">
              <li className="flex gap-2">
                <span className="text-soulpet-primary">•</span>
                <span>上传宠物的正面照，有助于 AI 生成更真实的形象。</span>
              </li>
              <li className="flex gap-2">
                <span className="text-soulpet-primary">•</span>
                <span>若有叫声录音，复刻精度将提升 40%。</span>
              </li>
              <li className="flex gap-2">
                <span className="text-soulpet-primary">•</span>
                <span>请尽可能详细地描述您与它之间的独特故事。</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column (Desktop: 3/5 columns) */}
        <div className="md:col-span-3 space-y-10">

          {/* Upload Assets */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-slate-100 text-xl font-bold tracking-tight">上传素材</h2>
              <span className="text-xs text-soulpet-primary/60 font-medium">{(photo ? 1 : 0) + (audio ? 1 : 0) + (video ? 1 : 0)} / 3 上传</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center gap-3">
                <div
                  onClick={() => handleFileClick(photoInputRef)}
                  className={`w-full aspect-square flex flex-col items-center justify-center rounded-2xl bg-soulpet-surface shadow-whisper border border-dashed transition-all cursor-pointer ${photo ? 'border-soulpet-primary bg-soulpet-primary/10 text-soulpet-primary' : 'border-soulpet-primary/30 hover:border-soulpet-primary hover:bg-soulpet-primary/5 text-soulpet-primary/50'}`}
                >
                  {photo ? <CheckCircle2 size={32} /> : <Camera size={32} />}
                </div>
                <div className="text-center">
                  <p className="text-slate-100 text-sm font-medium">照片</p>
                  <p className="text-soulpet-primary/50 text-[10px] font-bold">多角度最佳</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div
                  onClick={() => handleFileClick(audioInputRef)}
                  className={`w-full aspect-square flex flex-col items-center justify-center rounded-2xl bg-soulpet-surface shadow-whisper border border-dashed transition-all cursor-pointer ${audio ? 'border-soulpet-primary bg-soulpet-primary/10 text-soulpet-primary' : 'border-soulpet-primary/30 hover:border-soulpet-primary hover:bg-soulpet-primary/5 text-soulpet-primary/50'}`}
                >
                  {audio ? <CheckCircle2 size={32} /> : <Mic size={32} />}
                </div>
                <div className="text-center">
                  <p className="text-slate-100 text-sm font-medium">音频</p>
                  <p className="text-soulpet-primary/50 text-[10px] font-bold">纯净无杂音</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div
                  onClick={() => handleFileClick(videoInputRef)}
                  className={`w-full aspect-square flex flex-col items-center justify-center rounded-2xl bg-soulpet-surface shadow-whisper border border-dashed transition-all cursor-pointer ${video ? 'border-soulpet-primary bg-soulpet-primary/10 text-soulpet-primary' : 'border-soulpet-primary/30 hover:border-soulpet-primary hover:bg-soulpet-primary/5 text-soulpet-primary/50'}`}
                >
                  {video ? <CheckCircle2 size={32} /> : <Video size={32} />}
                </div>
                <div className="text-center">
                  <p className="text-slate-100 text-sm font-medium">短视频</p>
                  <p className="text-soulpet-primary/50 text-[10px] font-bold">动态姿态</p>
                </div>
              </div>
            </div>
          </section>

          {/* Interaction Settings */}
          <section className="space-y-4">
            <h2 className="text-slate-100 text-xl font-bold tracking-tight">交互模式设置</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div
                onClick={() => setMode('bark')}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer ${mode === 'bark' ? 'bg-soulpet-surface border-soulpet-primary shadow-lg ring-1 ring-soulpet-primary/50' : 'bg-soulpet-surface/50 border-soulpet-primary/10 grayscale'}`}
              >
                <div className="flex items-center gap-3">
                  <Dog className={`text-soulpet-primary ${mode === 'bark' ? 'fill-soulpet-primary/20' : ''}`} />
                  <span className="text-slate-100 text-sm font-bold tracking-wide">仅鸣叫</span>
                </div>
                <div className={`size-5 rounded-full border-2 flex items-center justify-center ${mode === 'bark' ? 'border-soulpet-primary' : 'border-soulpet-primary/20'}`}>
                  {mode === 'bark' && <div className="size-2.5 rounded-full bg-soulpet-primary shadow-[0_0_10px_rgba(190,148,111,0.5)]"></div>}
                </div>
              </div>
              <div
                onClick={() => setMode('text')}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer ${mode === 'text' ? 'bg-soulpet-primary shadow-xl shadow-soulpet-primary/20 border-soulpet-primary' : 'bg-soulpet-surface/50 border-soulpet-primary/10 grayscale opacity-70'}`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className={`${mode === 'text' ? 'text-soulpet-bg-dark fill-soulpet-bg-dark/10' : 'text-soulpet-primary'}`} />
                  <span className={`text-sm font-bold tracking-wide ${mode === 'text' ? 'text-soulpet-bg-dark' : 'text-slate-100'}`}>文字对话</span>
                </div>
                <div className={`size-5 rounded-full border-2 flex items-center justify-center ${mode === 'text' ? 'border-soulpet-bg-dark/40' : 'border-soulpet-primary/20'}`}>
                  {mode === 'text' && <div className="size-2.5 rounded-full bg-soulpet-bg-dark shadow-[0_0_10px_rgba(33,30,28,0.5)]"></div>}
                </div>
              </div>
            </div>
          </section>

          {/* Precious Memory Seeds */}
          <section className="space-y-4">
            <h2 className="text-slate-100 text-xl font-bold tracking-tight">珍贵记忆</h2>
            <div className="space-y-2">
              <label className="text-soulpet-primary/60 text-[10px] font-black tracking-[0.2em] uppercase pl-1">输入初识记忆</label>
              <div className="relative">
                <textarea
                  value={memories}
                  onChange={(e) => setMemories(e.target.value)}
                  className="w-full h-40 p-5 rounded-3xl bg-soulpet-surface border border-soulpet-primary/10 text-slate-100 text-sm font-medium focus:border-soulpet-primary/40 focus:ring-0 placeholder:text-soulpet-primary/20 transition-all resize-none custom-scrollbar"
                  placeholder="讲讲你们最初相遇的故事，这将作为 AI 的记忆种子..."
                ></textarea>
                <div className="absolute bottom-4 right-5 text-[10px] font-bold text-soulpet-primary/30">{memories.length} / 500</div>
              </div>
            </div>
          </section>

          {/* Anniversary Settings */}
          <section className="space-y-4">
            <h2 className="text-slate-100 text-xl font-bold tracking-tight">纪念日设置</h2>
            <div className="flex items-center justify-between p-5 rounded-2xl bg-soulpet-surface border border-soulpet-primary/10">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-soulpet-primary" />
                <span className="text-slate-100 text-sm font-bold tracking-wide">纪念日提醒</span>
              </div>
              <button
                onClick={() => setAnniversary(!anniversary)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none border border-soulpet-primary/20 ${anniversary ? 'bg-soulpet-primary/20' : 'bg-soulpet-bg-dark'}`}
              >
                <div className={`absolute top-0.5 left-0.5 size-4.5 rounded-full bg-soulpet-primary transition-transform duration-300 shadow-lg ${anniversary ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            </div>
          </section>

          {/* Action Button */}
          <div className="pt-6 pb-12">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full h-16 rounded-2xl bg-soulpet-primary text-soulpet-bg-dark font-black text-base shadow-2xl shadow-soulpet-primary/30 flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all neon-glow ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <Wand2 size={24} />}
              <span>{isSubmitting ? '正在注入灵魂...' : '开始复刻生成'}</span>
            </button>
            <p className="text-center text-[10px] text-soulpet-primary/40 mt-6 leading-relaxed px-10 font-medium">
              点击上方按钮即代表您同意《UploadSoul 隐私权政策》与《数字生命克隆协议》
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const InteractionView = ({ pet, onBack }) => {
  const [anniversary, setAnniversary] = useState(true);

  if (!pet) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="max-w-md md:max-w-3xl lg:max-w-4xl mx-auto min-h-screen bg-soulpet-bg-dark md:rounded-3xl md:my-10 md:shadow-2xl md:border md:border-soulpet-primary/10 relative pb-32 overflow-hidden flex flex-col"
    >
      {/* Header */}
      <header className="flex items-center justify-between p-6 sticky top-0 bg-soulpet-bg-dark/80 backdrop-blur-md z-50 border-b border-soulpet-primary/5">
        <button
          onClick={onBack}
          className="flex size-10 items-center justify-center rounded-full bg-soulpet-surface whisper-depth text-soulpet-primary hover:bg-soulpet-primary/10 transition-all"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-soulpet-cream text-lg font-bold tracking-wider flex-1 text-center font-display">
          灵魂上传 - {pet.name}
        </h1>
        <button className="flex size-10 items-center justify-center rounded-full bg-soulpet-surface whisper-depth text-soulpet-primary hover:bg-soulpet-primary/10 transition-all">
          <Settings size={20} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar px-6 space-y-8 pt-4 pb-12">
        <div className="md:grid md:grid-cols-2 md:gap-8 items-start">
          {/* Left Column: Pet Rendering */}
          <div className="space-y-6">
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-b from-soulpet-surface to-transparent flex items-center justify-center whisper-depth border border-soulpet-primary/10 shadow-2xl">
              {/* Holographic Bubble Overlay */}
              <div className="absolute inset-0 bg-radial-gradient from-soulpet-primary/5 to-transparent pointer-events-none"></div>

              {/* The Pet Rendering */}
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4">
                <div className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-soulpet-primary/10 hologram-glow flex items-center justify-center relative border border-soulpet-primary/20 backdrop-blur-sm transition-all duration-700 hover:scale-105">
                  <div className="absolute inset-0 rounded-full border border-soulpet-primary/10 animate-ping opacity-20"></div>
                  {pet.image ? (
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-[85%] h-[85%] object-cover rounded-full grayscale-[0.2] sepia-[0.3]"
                    />
                  ) : (
                    <span className="text-8xl">{pet.emoji}</span>
                  )}
                </div>

                {/* Speech Bubble */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-[12%] right-[5%] max-w-[160px] bg-soulpet-surface/90 border border-soulpet-primary/30 p-4 rounded-2xl rounded-tr-none whisper-depth backdrop-blur-md shadow-2xl"
                >
                  <p className="text-[10px] text-soulpet-primary font-black uppercase tracking-tighter mb-1">{pet.name} · {pet.type || '温暖伴侣'}</p>
                  <p className="text-xs text-soulpet-cream leading-relaxed font-medium">主人，我一直在这里陪伴你</p>
                </motion.div>
              </div>

              {/* Bottom Gradient Fade */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-soulpet-bg-dark to-transparent"></div>
            </div>

            {/* Main Interaction Button (Mobile positions it differently, but for grid we keep it here) */}
            <div className="space-y-6">
              {/* Waveform Sound Indicator */}
              <div className="bg-soulpet-surface whisper-depth rounded-2xl p-6 border border-soulpet-primary/10 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-soulpet-primary" />
                    <span className="text-xs font-black tracking-widest text-soulpet-primary/80 uppercase">情感频率</span>
                  </div>
                  <span className="text-[10px] text-soulpet-primary/40 font-bold">实时音频流 · 80% 同步率</span>
                </div>
                <div className="flex items-end justify-between h-14 gap-1.5 px-2">
                  {[4, 8, 6, 10, 4, 12, 7, 9, 5, 11, 6, 3, 8, 12, 4].map((h, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [`${h * 4}px`, `${h * 6}px`, `${h * 3}px`, `${h * 4}px`] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                      className="waveform-bar w-full rounded-full bg-gradient-to-t from-soulpet-primary to-soulpet-primary/60"
                      style={{ opacity: 0.3 + (h / 12) * 0.7 }}
                    />
                  ))}
                </div>
              </div>

              <button className="w-full h-16 bg-soulpet-primary hover:bg-soulpet-primary/90 text-soulpet-bg-dark font-black rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-soulpet-primary/20 transition-all active:scale-95 group overflow-hidden relative">
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <Mic size={24} />
                <span className="tracking-widest uppercase text-sm">实时交流 (Real-time Interaction)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Memories & Settings */}
          <div className="space-y-10 pt-4 md:pt-0">
            {/* Precious Memories Section */}
            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black tracking-[0.2em] text-soulpet-primary uppercase pl-1">珍贵记忆 (Precious Memories)</h3>
                <button className="text-[10px] text-soulpet-primary/60 hover:text-soulpet-primary font-bold transition-colors underline decoration-soulpet-primary/20 underline-offset-4 tracking-wider">查看全部</button>
              </div>
              <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar snap-x">
                {[
                  { date: '2023.10.15', label: '第一次散步', icon: <LucideImage size={24} /> },
                  { date: '2023.11.02', label: '学会了握手', icon: <LucideImage size={24} /> },
                  { date: '2023.12.25', label: '圣诞合影', icon: <LucideImage size={24} /> },
                  { date: '2024.01.10', label: '安静午后', icon: <LucideImage size={24} /> },
                ].map((memory, i) => (
                  <div key={i} className="flex-shrink-0 w-36 glass-card-pet border border-soulpet-primary/10 rounded-2xl p-3 whisper-depth snap-start hover:border-soulpet-primary/30 transition-all cursor-pointer">
                    <div className="aspect-square rounded-xl bg-soulpet-bg-dark mb-3 overflow-hidden flex items-center justify-center text-soulpet-primary/20 relative group">
                      <div className="absolute inset-0 bg-soulpet-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      {memory.icon}
                    </div>
                    <p className="text-[10px] text-soulpet-primary/80 font-black mb-1">{memory.date}</p>
                    <p className="text-xs text-soulpet-cream/70 font-medium truncate">{memory.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Anniversary Settings Entry */}
            <section className="space-y-5">
              <h3 className="text-sm font-black tracking-[0.2em] text-soulpet-primary uppercase pl-1">设置 (Settings)</h3>
              <div className="bg-soulpet-surface/60 border border-soulpet-primary/20 rounded-2xl p-5 flex items-center justify-between whisper-depth group hover:bg-soulpet-surface transition-all">
                <div className="flex items-center gap-4">
                  <div className="size-11 rounded-2xl bg-soulpet-primary/10 flex items-center justify-center text-soulpet-primary group-hover:scale-110 transition-transform">
                    <Calendar size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-soulpet-cream tracking-wide">纪念日设置 (Anniversary)</p>
                    <p className="text-[10px] text-soulpet-primary/50 font-bold uppercase tracking-widest mt-0.5">重要时刻提醒服务</p>
                  </div>
                </div>
                <button
                  onClick={() => setAnniversary(!anniversary)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none border border-soulpet-primary/20 ${anniversary ? 'bg-soulpet-primary/20' : 'bg-soulpet-bg-dark'}`}
                >
                  <motion.div
                    animate={{ x: anniversary ? 24 : 2 }}
                    className="absolute top-0.5 left-0.5 size-4.5 rounded-full bg-soulpet-primary shadow-lg"
                  />
                </button>
              </div>
            </section>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-5">
              <button className="bg-soulpet-surface/40 border border-soulpet-primary/10 py-6 rounded-2xl flex flex-col items-center gap-3 whisper-depth hover:bg-soulpet-surface hover:border-soulpet-primary/30 transition-all group">
                <div className="size-12 rounded-full border border-soulpet-primary/10 flex items-center justify-center text-soulpet-primary group-hover:scale-110 transition-transform">
                  <Mountain size={24} />
                </div>
                <span className="text-[11px] font-black text-soulpet-cream/80 tracking-[0.1em] uppercase">进入虚拟场景</span>
              </button>
              <button className="bg-soulpet-surface/40 border border-soulpet-primary/10 py-6 rounded-2xl flex flex-col items-center gap-3 whisper-depth hover:bg-soulpet-surface hover:border-soulpet-primary/30 transition-all group">
                <div className="size-12 rounded-full border border-soulpet-primary/10 flex items-center justify-center text-soulpet-primary group-hover:scale-110 transition-transform">
                  <Shirt size={24} />
                </div>
                <span className="text-[11px] font-black text-soulpet-cream/80 tracking-[0.1em] uppercase">更换装扮</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Persistent Bottom Tab Bar (Local mockup for Interaction) */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-soulpet-primary/10 bg-soulpet-bg-dark/95 backdrop-blur-md px-6 pb-8 pt-4 z-50 flex justify-around items-center">
        <button className="flex flex-col items-center gap-1.5 text-soulpet-primary">
          <Dog size={22} fill="currentColor" />
          <p className="text-[9px] font-black uppercase tracking-tighter">互动</p>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-soulpet-cream/30 hover:text-soulpet-primary transition-colors">
          <Sparkles size={22} />
          <p className="text-[9px] font-black uppercase tracking-tighter">进化</p>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-soulpet-cream/30 hover:text-soulpet-primary transition-colors">
          <History size={22} />
          <p className="text-[9px] font-black uppercase tracking-tighter">记忆</p>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-soulpet-cream/30 hover:text-soulpet-primary transition-colors">
          <div className="size-6 rounded-full border border-soulpet-primary/20 overflow-hidden">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaH9FFkrvGHWVcJA3zRANrJgUDpa73Cn4HTrxz51HqTFMlMEA0lQ4gr0mDAxBGV2HfqWmXY-ZwQk-wdEBaUheaeNuryPhM9NSwBK1x1R4BpZao70MWn3FElJNPUUUJfibnVJJrpl8ekhmS-aNByuaPH9KV94j9RscYYrxMzgu0eLQhwY_Lejzbhy11-vDoibwJpowibuuU9s2y_wq7HLft15dYcuQ_22JNl3XkPXF40WpXihDzYlJ4BTRGAx_slXZSYqL-fpLzN0mC" alt="me" />
          </div>
          <p className="text-[9px] font-black uppercase tracking-tighter">我的</p>
        </button>
      </nav>
    </motion.div>
  );
};

const PetPage = () => {
  const { t } = useTranslation();
  const { navigate, l } = useLocalizedNavigate();
  const [pets, setPets] = useState([]);
  const [view, setView] = useState('hub'); // 'hub', 'reconstruct', 'connect', 'interaction'
  const [activePet, setActivePet] = useState(null);

  const handleNavigate = (newView, data = null) => {
    if (newView === 'interaction') {
      setActivePet(data);
    }
    setView(newView);
  };

  // Load pets from localStorage
  useEffect(() => {
    const savedPets = localStorage.getItem('soulpets');
    if (savedPets) {
      setPets(JSON.parse(savedPets));
    } else {
      const defaultPets = [
        {
          id: '1',
          name: '橘子',
          type: '数字猫',
          emoji: '🐱',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYFJ-rmEnH5mDzYJaQZebzDUGD1yrZytV2rfkhLNNEfRuuKDEIb-FY1YHaNUbwArCXViXzwPoGlpUaQiGe9wAQfILwGyjAiv2lszHVfK33BRtf_4ZWtElzoRaMFKxnr_6-8KRZd_4BNmhzDmYIqjxIFB_MTn32osqjpuZScXE3HIYVLn3sM9fCg1NEFfyX3qtXOSDnFllFWSnO_DuN4-a3lY5bFn6lTL1myPzfOTA1QuqXyTAJKbqrLeRN3aXxuz49rlxbvOlisvqW'
        },
        {
          id: '2',
          name: '豆豆',
          type: '复刻犬',
          emoji: '🐶',
          image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300'
        },
        {
          id: '3',
          name: '小白',
          type: '待激活',
          emoji: '🐰',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHhB_81781P7SghMW8fNEHeg-j_sliLDLLDWcdvE7dQKeiGSODkFS8I-afKLLvy_1u9sg-iAh86R2VXmAnIjuqH6tqwOJAZLuEXsyu2C7loiC6DOqW-nJV-tiBdEQvMHlMoPQrjGN3ZesRFfDrIU60McDW2OsCmvmtUF7-GZ2pPTTwdTOoKyoWxB_P7jzRr-BOSiZ3pCdtg01Axf01DNz-4Erx1eJQ5WieLzgBBQ5y9b9ELCo_1dMCYI2So7aA8pKadIwSV0waY5m8',
          status: 'inactive'
        }
      ];
      setPets(defaultPets);
      localStorage.setItem('soulpets', JSON.stringify(defaultPets));
    }
  }, []);

  return (
    <div className="pet-hub-body min-h-screen pt-20 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {view === 'hub' && (
          <HubView
            key="hub"
            pets={pets}
            onNavigate={handleNavigate}
          />
        )}
        {view === 'reconstruct' && (
          <ReconstructView
            key="reconstruct"
            onBack={() => setView('hub')}
          />
        )}
        {view === 'interaction' && (
          <InteractionView
            key="interaction"
            pet={activePet}
            onBack={() => setView('hub')}
          />
        )}
        {view === 'connect' && (
          <motion.div
            key="connect"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-soulpet-bg-dark/95 backdrop-blur-xl"
          >
            <div className="max-w-md w-full glass-card-pet p-8 rounded-3xl border-soulpet-primary/20 text-center">
              <div className="w-20 h-20 rounded-full bg-soulpet-primary/10 flex items-center justify-center text-soulpet-primary mx-auto mb-6">
                <Sparkles size={40} />
              </div>
              <h2 className="text-2xl font-black text-soulpet-cream mb-4">生命链接 · 正在连接</h2>
              <p className="text-soulpet-cream/60 leading-relaxed mb-8">
                数字宇宙正在为您随机匹配最契合的灵魂伴侣。这是一个双向选择的过程，请保持心灵的开放。
              </p>
              <button
                onClick={() => setView('hub')}
                className="w-full py-4 bg-soulpet-primary text-soulpet-bg-dark font-black rounded-xl"
              >
                期待下一次邂逅
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-30">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.1 }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute rounded-full bg-soulpet-primary"
            style={{
              width: Math.random() * 4 + 'px',
              height: Math.random() * 4 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
          />
        ))}
      </div>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-soulpet-bg-dark/80 backdrop-blur-2xl border border-soulpet-primary/20 rounded-full px-8 py-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 flex justify-between items-center transition-all">
        <button
          onClick={view !== 'hub' ? () => setView('hub') : undefined}
          className={`flex flex-col items-center gap-1 group ${view === 'hub' ? 'text-soulpet-primary' : 'text-soulpet-cream/40'}`}
        >
          <Home size={22} className="group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-tighter">首页</span>
        </button>
        <button className="flex flex-col items-center gap-1 group text-soulpet-cream/40 hover:text-soulpet-primary transition-colors">
          <Dog size={22} className="group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-tighter">宠物</span>
        </button>
        <button className="flex flex-col items-center justify-center -mt-12 bg-soulpet-primary w-14 h-14 rounded-full shadow-lg shadow-soulpet-primary/40 hover:scale-110 transition-transform active:scale-95 text-soulpet-bg-dark border-4 border-soulpet-bg-dark">
          <Plus size={30} strokeWidth={3} />
        </button>
        <button className="flex flex-col items-center gap-1 group text-soulpet-cream/40 hover:text-soulpet-primary transition-colors">
          <BookOpen size={22} className="group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-tighter">记录</span>
        </button>
        <button className="flex flex-col items-center gap-1 group text-soulpet-cream/40 hover:text-soulpet-primary transition-colors">
          <User size={22} className="group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-black uppercase tracking-tighter">个人</span>
        </button>
      </nav>
    </div>
  );
};

export default PetPage;