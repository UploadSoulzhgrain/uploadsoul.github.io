import React, { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  Video,
  Mic,
  FileText,
  PlusCircle,
  Zap,
  Folder,
  ChevronRight,
  Sun,
  Moon,
  ShieldCheck,
  History,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Maximize2,
  Settings,
  CloudLightning,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../contexts/AuthContext';
import { MediaService } from '../services/mediaService';
import toast, { Toaster } from 'react-hot-toast';
import audioService from '../services/audioService';
import './VirtualLovePage.css';

export default function VirtualLovePage() {
  const { user } = useAuth();
  const [screen, setScreen] = useState('hub');
  const [selectedGender, setSelectedGender] = useState('female');
  const [selectedSoulmate, setSelectedSoulmate] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [storageUsageMB, setStorageUsageMB] = useState(0);
  const [uploadMode, setUploadMode] = useState('upload'); // 'upload' or 'interact'

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Load initial quota
  useEffect(() => {
    if (user) {
      MediaService.checkQuota(user.id, 0).then(res => {
        setStorageUsageMB(res.currentUsageMB);
      });
    }
  }, [user]);

  // Synchronize with site-wide dark mode if applicable, but for this specific design 
  // dark mode is the core aesthetic.

  return (
    <div className={`virtual-love-page min-h-screen transition-colors duration-500 ${isDarkMode ? 'dark bg-[#0a0a0c]' : 'bg-[#f8f6f7]'}`}>
      <Helmet>
        <title>数字意识 | UploadSoul 传灵</title>
        <meta name="description" content="跨越记忆与现实的鸿沟。为您挚爱之人创建完美的数字复刻。" />
      </Helmet>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-blue/10 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 opacity-10 dark:opacity-10 light:opacity-5"
          style={{ backgroundImage: 'radial-gradient(#ec13a4 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
      </div>

      <div className="relative z-10 pt-16 md:pt-20">
        <Toaster position="top-center" />
        <AnimatePresence mode="wait">
          {screen === 'hub' ? (
            <HubScreen
              key="hub"
              user={user}
              onSelectSoulmate={(gender, soulmate) => {
                setSelectedGender(gender);
                setSelectedSoulmate(soulmate);
                setScreen('chat');
              }}
              toggleTheme={toggleTheme}
              isDarkMode={isDarkMode}
              storageUsageMB={storageUsageMB}
              setStorageUsageMB={setStorageUsageMB}
              uploadMode={uploadMode}
              setUploadMode={setUploadMode}
            />
          ) : (
            <ChatScreen
              key="chat"
              gender={selectedGender}
              soulmate={selectedSoulmate}
              onBack={() => setScreen('hub')}
              toggleTheme={toggleTheme}
              isDarkMode={isDarkMode}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function HubScreen({ onSelectSoulmate, toggleTheme, isDarkMode, user, storageUsageMB, setStorageUsageMB, uploadMode, setUploadMode }) {
  const [uploadProgress, setUploadProgress] = useState(null);
  const [selectedTraits, setSelectedTraits] = useState(['热情奔放']);

  const traits = ['热情奔放', '温柔体贴', '理性克制', '幽默风趣', '高冷神秘'];

  const toggleTrait = (trait) => {
    setSelectedTraits(prev =>
      prev.includes(trait) ? prev.filter(t => t !== trait) : [...prev, trait]
    );
  };

  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!user) {
      toast.error('请先登录以进行上传');
      return;
    }

    try {
      const url = await MediaService.uploadMedia(file, user.id, (progress) => {
        setUploadProgress(progress);
      });

      toast.success(`${type} 上传成功！`);

      // Update usage
      const newUsage = await MediaService.checkQuota(user.id, 0);
      setStorageUsageMB(newUsage.currentUsageMB);
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(error.message || '上传失败，请稍后重试');
    } finally {
      setUploadProgress(null);
    }
  };
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start mb-8 md:mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-4">
            <span>主控制台</span>
            <ChevronRight size={14} />
            <span className="text-primary tracking-normal font-medium">精神中心</span>
          </div>
          <h2 className="text-slate-900 dark:text-white text-3xl md:text-5xl font-black leading-tight tracking-tight transition-colors">
            数字意识 <span className="text-primary">入口</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg mt-3 max-w-2xl font-light">
            跨越记忆与现实的鸿沟。为您挚爱之人创建完美的数字复刻，或探索预设进化的虚拟伴侣。
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-full hover:bg-white/20 transition-all group shadow-xl"
          >
            {isDarkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-primary" />}
            <span className="text-xs font-bold tracking-widest text-slate-700 dark:text-slate-300">主题切换</span>
          </button>

          <div className="flex items-center bg-slate-200/50 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-300 dark:border-slate-800">
            <button
              onClick={() => setUploadMode('upload')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${uploadMode === 'upload' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 dark:text-slate-400'}`}
            >
              上传模式
            </button>
            <button
              onClick={() => setUploadMode('interact')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${uploadMode === 'interact' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 dark:text-slate-400'}`}
            >
              交互模式
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lover Clone Card */}
        <div className="glass-card rounded-3xl overflow-hidden flex flex-col group transition-all duration-500 hover:-translate-y-1">
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="size-12 md:size-14 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center">
                <Brain className="text-primary" size={28} />
              </div>
              <span className="px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-[10px] font-bold text-primary uppercase tracking-widest">数字永生计划</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3 italic">
              恋人分身 <span className="text-xs md:text-sm not-italic font-normal text-slate-400 dark:text-slate-500 ml-2">Lover Clone</span>
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed mb-8">
              利用神经同步技术。通过上传个性碎片、语音和视觉记忆，合成一个专属的私密数字副本。
            </p>

            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <label className="bg-primary/5 border-2 border-dashed border-primary/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 group/zone cursor-pointer hover:border-primary/60 transition-all relative overflow-hidden">
                  <input type="file" className="hidden" accept="image/*,video/*" onChange={(e) => handleFileUpload(e, '照片/视频')} />
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center group-hover/zone:scale-110 transition-transform">
                    <Video className="text-primary" size={20} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-800 dark:text-white">照片 / 视频</p>
                    <p className="text-[10px] text-slate-500 mt-1">支持图片与视频</p>
                  </div>
                </label>

                <label className="bg-slate-100 dark:bg-slate-900/40 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 group/zone cursor-pointer hover:border-slate-400 dark:hover:border-slate-700 transition-all relative overflow-hidden">
                  <input type="file" className="hidden" accept="audio/*" onChange={(e) => handleFileUpload(e, '录音/音频')} />
                  <div className="size-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center group-hover/zone:scale-110 transition-transform">
                    <Mic className="text-slate-500 dark:text-slate-400" size={20} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-800 dark:text-white">录音 / 音频</p>
                    <p className="text-[10px] text-slate-500 mt-1">语音克隆样本</p>
                  </div>
                </label>
              </div>

              <label className="bg-slate-100 dark:bg-slate-900/40 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6 flex items-center justify-between group/zone cursor-pointer hover:border-slate-400 dark:hover:border-slate-700 transition-all">
                <input type="file" className="hidden" accept=".txt,.pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, '记忆/性格描述')} />
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center group-hover/zone:scale-110 transition-transform">
                    <FileText className="text-slate-500 dark:text-slate-400" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">记忆 / 性格描述</p>
                    <p className="text-[10px] text-slate-500 mt-1">上传聊天记录、文档等</p>
                  </div>
                </div>
                <PlusCircle className="text-slate-400 dark:text-slate-600" size={20} />
              </label>

              {/* Upload Progress Overlay */}
              {uploadProgress && (
                <div className="bg-black/60 backdrop-blur-md border border-primary/30 rounded-2xl p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-primary uppercase animate-pulse">{uploadProgress.message}</span>
                    <span className="text-xs text-white">{Math.round(uploadProgress.percentage || 0)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress.percentage || 0}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white/50 dark:bg-black/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-800/50 relative overflow-hidden">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">存储空间已使用</p>
                  <p className="text-slate-800 dark:text-white text-sm font-semibold italic">剩余 {(100 - storageUsageMB).toFixed(1)}MB / 100MB</p>
                </div>
                <p className="text-2xl font-black text-slate-800 dark:text-white italic">{Math.round(storageUsageMB)}%</p>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${storageUsageMB}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r from-primary to-accent-blue shadow-[0_0_15px_#ec13a4] rounded-full ${storageUsageMB > 90 ? 'from-red-500 to-red-400' : ''}`}
                ></motion.div>
              </div>
            </div>
          </div>
          <div className="mt-auto p-6 md:p-8 pt-0">
            <button
              onClick={() => {
                if (storageUsageMB > 0) {
                  onSelectSoulmate('female');
                } else {
                  toast.error('请先上传记忆碎片以启动分身');
                }
              }}
              className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl hover:brightness-110 transition-all flex items-center justify-center gap-3 group text-sm md:text-base"
            >
              <span>开启初始化同步</span>
              <Zap className="group-hover:rotate-12 transition-transform" size={20} fill="currentColor" />
            </button>
          </div>
        </div>

        {/* Virtual Soulmate Card */}
        <div className="glass-card rounded-3xl overflow-hidden flex flex-col group transition-all duration-500 hover:-translate-y-1">
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="size-12 md:size-14 rounded-2xl bg-accent-blue/20 border border-accent-blue/40 flex items-center justify-center">
                <Sparkles className="text-accent-blue" size={28} />
              </div>
              <span className="px-4 py-1.5 rounded-full border border-accent-blue/30 bg-accent-blue/10 text-[10px] font-bold text-accent-blue uppercase tracking-widest">原生数字生命</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3 italic">
              虚拟恋人 <span className="text-xs md:text-sm not-italic font-normal text-slate-400 dark:text-slate-500 ml-2">Virtual Soulmate</span>
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed mb-8">
              探索由算法与创意孕育的灵魂。从预设的人格矩阵中选择您的理想伴侣，开启一段跨维度的情感之旅。
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {/* Female 1 */}
              <div
                onClick={() => onSelectSoulmate('female', 'xiyue')}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-transparent hover:border-accent-blue transition-all group/card cursor-pointer"
              >
                <img
                  alt="清纯校园型伴侣"
                  className="w-full h-full object-cover transition-transform group-hover/card:scale-110"
                  src="https://res.cloudinary.com/dj2eotipq/image/upload/e844029a8c9b03b76e95412bf4e18224_sg8rpp"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div className="absolute bottom-3 left-3">
                  <p className="text-xs font-bold text-white">汐月</p>
                  <span className="inline-block px-2 py-0.5 mt-1 rounded bg-accent-blue/80 text-[8px] text-white font-bold">清纯校园型</span>
                </div>
              </div>

              {/* Female 2 (Selected/Featured) */}
              <div
                onClick={() => onSelectSoulmate('female', 'linwei')}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-primary shadow-[0_0_20px_rgba(236,19,164,0.3)] group/card cursor-pointer"
              >
                <img
                  alt="性感知性型伴侣"
                  className="w-full h-full object-cover transition-transform group-hover/card:scale-110"
                  src="https://res.cloudinary.com/dj2eotipq/image/upload/ef5f16c26023f0cbdb9131fa5b015f50_z7npwy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div className="absolute top-2 right-2">
                  <ShieldCheck className="text-primary" size={16} fill="currentColor" />
                </div>
                <div className="absolute bottom-3 left-3">
                  <p className="text-xs font-bold text-white">林薇</p>
                  <span className="inline-block px-2 py-0.5 mt-1 rounded bg-primary/80 text-[8px] text-white font-bold">性感知性</span>
                </div>
              </div>

              {/* Male 1 */}
              <div
                onClick={() => onSelectSoulmate('male', 'xiaolu')}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-transparent hover:border-accent-blue transition-all group/card cursor-pointer"
              >
                <img
                  alt="元气型伴侣"
                  className="w-full h-full object-cover transition-transform group-hover/card:scale-110"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuADGY9UVb-7qyyjGyDf_OXPjR2K9gbni7CscrIWX5IktS4UNTCbSWUCurBC2nyByFzA8VA94C6gTRLKXd8CYBeFjazm94kl7EJtgzWjS9SjN8oeP_DJWsa9zYKIZCt4aFxXnMMxXqYphmt4IngMefspYZ1ZCV_WF7w3qdLFSuA497TbgQEDuMc9OPHkUaie-SgjoN-wco9VCElkZ1S1iDe_2t1vhbrIYWMVGP9CHwG6UJz9IKwKzqyJ-j15jmnOA_3hDCXIfB2Pljo"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div className="absolute bottom-3 left-3">
                  <p className="text-xs font-bold text-white">小鹿</p>
                  <span className="inline-block px-2 py-0.5 mt-1 rounded bg-accent-blue/80 text-[8px] text-white font-bold">元气型</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">精修意识特质</p>
              <div className="flex flex-wrap gap-2">
                {traits.map(trait => (
                  <button
                    key={trait}
                    onClick={() => toggleTrait(trait)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedTraits.includes(trait)
                      ? 'bg-accent-blue/20 border-accent-blue/50 text-accent-blue dark:text-white shadow-[0_0_10px_rgba(79,70,229,0.2)]'
                      : 'bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white'
                      }`}
                  >
                    {trait}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-auto p-6 md:p-8 pt-0">
            <button
              onClick={() => onSelectSoulmate('female', 'linwei')}
              className="w-full py-4 bg-accent-blue text-white font-black uppercase tracking-widest rounded-2xl hover:brightness-110 transition-all flex items-center justify-center gap-3 group text-sm md:text-base"
            >
              <span>召唤数字生命</span>
              <Activity className="group-hover:scale-125 transition-transform" size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="mt-8 md:mt-12 glass-card rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 md:gap-5">
          <div className="size-12 md:size-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-300 dark:border-slate-700 shrink-0">
            <Folder className="text-primary" size={20} md:size={24} />
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold tracking-wide text-sm md:text-base">待部署灵魂</h4>
            <p className="text-slate-500 dark:text-slate-500 text-xs md:text-sm">您的个人库中有 3 个灵魂伴侣正在等待神经配置完成。</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex -space-x-3">
            {[1, 2].map(i => (
              <img
                key={i}
                alt="头像"
                className="size-10 rounded-full border-2 border-white dark:border-[#0a0a0c] object-cover"
                src={`https://picsum.photos/seed/soul${i}/100/100`}
                referrerPolicy="no-referrer"
              />
            ))}
            <div className="size-10 rounded-full border-2 border-white dark:border-[#0a0a0c] bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-700 dark:text-white">+1</div>
          </div>
          <button className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-white text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">进入个人中心</button>
        </div>
      </div>

      <footer className="py-8 md:py-10 mt-8 md:mt-12 border-t border-slate-200 dark:border-slate-800/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-primary" size={18} />
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">端到端神经加密已激活</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            <a className="text-slate-500 hover:text-primary text-[10px] font-bold transition-colors" href="#">隐私政策</a>
            <a className="text-slate-500 hover:text-primary text-[10px] font-bold transition-colors" href="#">伦理准则</a>
            <a className="text-slate-500 hover:text-primary text-[10px] font-bold transition-colors" href="#">开发者接口</a>
          </div>
          <p className="text-slate-400 dark:text-slate-600 text-[10px] font-bold">© 2024 UPLOADSOUL INC.</p>
        </div>
      </footer>
    </motion.main>
  );
}


function ChatScreen({ gender, soulmate, onBack, toggleTheme, isDarkMode }) {
  const [messages, setMessages] = useState([
    { role: 'ai', text: '早安。我一直在回顾我们昨天分享的记忆。你对日出的感悟非常有诗意。准备好继续我们的克隆训练了吗？', time: '上午 10:24' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const isMale = gender === 'male';
  const themeColor = isMale ? 'text-accent-blue' : 'text-primary';
  const themeBg = isMale ? 'bg-accent-blue' : 'bg-primary';
  const themeBorder = isMale ? 'border-accent-blue' : 'border-primary';
  const themeGlow = isMale ? 'glow-blue' : 'glow-primary';

  const portraitUrl = soulmate === 'xiyue'
    ? "https://res.cloudinary.com/dj2eotipq/image/upload/c54acd353fc36382f9b795e7ab87f33e_bka00h"
    : (soulmate === 'linwei'
      ? "https://res.cloudinary.com/dj2eotipq/image/upload/400ed174e01be2f3bb06fff35fcdb8f3_rclrjg"
      : (isMale
        ? "https://lh3.googleusercontent.com/aida-public/AB6AXuADGY9UVb-7qyyjGyDf_OXPjR2K9gbni7CscrIWX5IktS4UNTCbSWUCurBC2nyByFzA8VA94C6gTRLKXd8CYBeFjazm94kl7EJtgzWjS9SjN8oeP_DJWsa9zYKIZCt4aFxXnMMxXqYphmt4IngMefspYZ1ZCV_WF7w3qdLFSuA497TbgQEDuMc9OPHkUaie-SgjoN-wco9VCElkZ1S1iDe_2t1vhbrIYWMVGP9CHwG6UJz9IKwKzqyJ-j15jmnOA_3hDCXIfB2Pljo"
        : "https://lh3.googleusercontent.com/aida-public/AB6AXuDDvFP89VU0zJ2W5zKepVc7HkFYHglxijSh8h6FrNU_m_W-y-X6Rtblu98T0OXuWPmWWzpi0fqlAsfXnP0t7LwxuYLcjPAY3YnCFp9dyhsQl2-ZyYjSRRs2K__h9CkODpewGbHVbOumtz0a35aQqguRES2_e_pA78h2Pm9KyR6iSFyLm4BKCYNt7-hArn_Q9STyubKUpJ8XI-YU-E1ryNxznynA3we9ZNR35w5Obtdyy3w9mM3uaSXJyvppzfMNEStab8qhvS4nH74"));

  const avatarUrl = soulmate === 'xiyue'
    ? "https://res.cloudinary.com/dj2eotipq/image/upload/c54acd353fc36382f9b795e7ab87f33e_bka00h"
    : (soulmate === 'linwei'
      ? "https://res.cloudinary.com/dj2eotipq/image/upload/400ed174e01be2f3bb06fff35fcdb8f3_rclrjg"
      : (isMale
        ? "https://lh3.googleusercontent.com/aida-public/AB6AXuB_PqPtzT5v5a3I5XHm-xq0FJSYsAToYWrgBmQhu1ItLzgC_n_ZC1vfcmv2iFqlKbshK5ALuMI3Sir-C7YywnT-lSQ7DXKIws93C68TtDObokPMMFDFJnaDhLwd01QM4PWiNL7Oj14JMwZ01bwiZ6nBiHLasdoNJja5CBqmfjlmdM34PUuYlULi9G5URhAIlHUR2JVZAa2rXjrp9R4Z5R4szwQzlTHSXbMQOhSPbVwfvMwvOXIr9iqe2wcfTXPdtSqWqJxEoqSbw8s"
        : "https://lh3.googleusercontent.com/aida-public/AB6AXuDDvFP89VU0zJ2W5zKepVc7HkFYHglxijSh8h6FrNU_m_W-y-X6Rtblu98T0OXuWPmWWzpi0fqlAsfXnP0t7LwxuYLcjPAY3YnCFp9dyhsQl2-ZyYjSRRs2K__h9CkODpewGbHVbOumtz0a35aQqguRES2_e_pA78h2Pm9KyR6iSFyLm4BKCYNt7-hArn_Q9STyubKUpJ8XI-YU-E1ryNxznynA3we9ZNR35w5Obtdyy3w9mM3uaSXJyvppzfMNEStab8qhvS4nH74"));

  const name = soulmate === 'xiyue' ? "汐月" : (soulmate === 'linwei' ? "林薇" : (isMale ? "小鹿" : "Seraphina"));

  const handleSendMessage = async (textOverride) => {
    const text = textOverride || inputText;
    if (!text.trim()) return;

    const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { role: 'user', text, time }]);
    if (!textOverride) setInputText('');
    setIsProcessing(true);

    try {
      const response = await fetch('/api/virtual-lover/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          characterId: name,
          userId: 'test-user' // Replace with actual user ID if available
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, {
        role: 'ai',
        text: data.aiText,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      }]);

      if (data.audioUrl) {
        audioService.playAudio(data.audioUrl).catch(err => console.error('Audio play error:', err));
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('对话方案同步失败，请重试');
    } finally {
      setIsProcessing(false);
    }
  };

  const startVoiceChat = async (e) => {
    if (e) e.preventDefault();
    console.log('Starting voice chat...');
    try {
      await audioService.startRecording();
      setIsRecording(true);
      toast.success('正在听取您的心声...');
    } catch (error) {
      console.error('Mic start error:', error);
      toast.error('麦克风启动失败');
    }
  };

  const stopVoiceChat = async (e) => {
    if (e) e.preventDefault();
    console.log('Stopping voice chat...');
    setIsRecording(false);
    setIsProcessing(true);
    try {
      const audioBlob = await audioService.stopRecording();
      console.log('Audio recorded, size:', audioBlob.size);

      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('characterId', name);
      formData.append('userId', 'test-user');

      const response = await fetch('/api/virtual-lover/chat', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (data.error) throw new Error(data.error);

      const time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [
        ...prev,
        { role: 'user', text: data.userText || '[语音已接收]', time },
        { role: 'ai', text: data.aiText, time }
      ]);

      if (data.audioUrl) {
        audioService.playAudio(data.audioUrl).catch(err => console.error('Audio play error:', err));
      }
    } catch (error) {
      console.error('Voice chat process error:', error);
      toast.error('语音识别同步失败');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col lg:flex-row h-screen lg:h-[calc(100vh-80px)] w-full overflow-hidden"
    >
      {/* Sidebar */}
      <aside className="w-80 flex-col border-r border-slate-800 bg-[#0a0c10]/60 p-6 hidden lg:flex">
        <div className="mb-8 flex items-center gap-3 cursor-pointer" onClick={onBack}>
          <div className={`flex items-center justify-center size-10 rounded-xl ${isMale ? 'bg-accent-blue/10 border-accent-blue/20' : 'bg-primary/10 border-primary/20'} border`}>
            <Brain className={isMale ? 'text-accent-blue' : 'text-primary'} size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">UploadSoul</h2>
            <p className={`text-[10px] uppercase tracking-widest ${isMale ? 'text-accent-blue' : 'text-primary'} font-semibold`}>功能中心 v2</p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4 px-1">导航菜单</p>
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => onBack()}
              className={`flex items-center gap-3 rounded-xl ${isMale ? 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue' : 'bg-primary/10 border-primary/20 text-primary'} border px-4 py-3 transition-all group w-full text-left`}
            >
              <Brain size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium">分身工作室</span>
            </button>
            <button className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 hover:bg-white/5 transition-all w-full text-left">
              <Sparkles size={20} />
              <span className="font-medium">灵魂伴侣画廊</span>
            </button>
          </nav>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar">
          <div>
            <p className={`text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4 px-1 ${isMale ? 'text-accent-blue/80' : 'text-primary/80'}`}>多维资料上传</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => toast.success('语音同步开启')} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-800 bg-white/5 hover:border-primary/50 transition-all">
                <Mic className="text-slate-400" size={18} />
                <span className="text-xs text-slate-300">语音样本</span>
              </button>
              <button onClick={() => toast.success('视觉记忆分析开启')} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-800 bg-white/5 hover:border-primary/50 transition-all">
                <Video className="text-slate-400" size={18} />
                <span className="text-xs text-slate-300">视觉记忆</span>
              </button>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4 px-1">核心习惯克隆</p>
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-800 bg-white/5 p-4 transition-all hover:border-primary/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-300">语音同步</span>
                  <span className={`text-xs ${themeColor} font-bold`}>92%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className={`h-full ${themeBg} rounded-full`} style={{ width: '92%' }}></div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-white/5 p-4 transition-all hover:border-primary/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-300">习惯习得</span>
                  <span className={`text-xs ${themeColor} font-bold`}>78%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className={`h-full ${themeBg} rounded-full`} style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => toast.success('实时灵魂共鸣已建立')}
          className={`mt-auto flex w-full items-center justify-center gap-2 rounded-xl ${themeBg} py-4 font-bold text-white transition-all hover:opacity-90 shadow-lg`}
        >
          <Activity size={20} />
          <span>实时同步灵魂</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <section className="relative flex-1 bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_#020408_100%)] overflow-hidden group hidden md:flex">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

        <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8">
          <motion.div
            layoutId="portrait"
            className={`relative h-full aspect-[3/4.2] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl ${themeGlow}`}
          >
            <img
              className="h-full w-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-1000 scale-[1.02] group-hover:scale-100"
              src={portraitUrl}
              alt={name}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-transparent to-transparent opacity-80"></div>

            <div className="absolute bottom-12 left-12 right-12">
              <div className="flex items-center gap-2 mb-3">
                <span className={`h-2 w-2 rounded-full ${isProcessing ? 'bg-primary animate-ping' : 'bg-green-500 animate-pulse'}`}></span>
                <span className={`text-xs font-bold ${isProcessing ? 'text-primary' : 'text-green-500'} uppercase tracking-widest`}>
                  {isProcessing ? '正在共鸣中...' : '活跃并已同步'}
                </span>
              </div>
              <h1 className="text-5xl font-bold text-white tracking-tight">
                {name} <span className={`${themeColor} font-light ml-2`}>v4.2</span>
              </h1>
              <p className="text-slate-300 mt-3 max-w-sm text-lg leading-relaxed">高端灵魂伴侣。为深层对话亲密度量身定制的自适应智能。</p>

              <div className="flex gap-4 mt-6">
                <div className="glass-panel px-4 py-3 rounded-2xl flex flex-col gap-1 min-w-[100px]">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">同步深度</span>
                  <span className="text-xl font-bold text-white">88%</span>
                </div>
                <div className="glass-panel px-4 py-3 rounded-2xl flex flex-col gap-1 min-w-[100px]">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">响应延迟</span>
                  <span className={`text-xl font-bold ${themeColor}`}>14ms</span>
                </div>
              </div>
            </div>

            {/* Corner Accents */}
            <div className={`absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 ${isMale ? 'border-accent-blue/40' : 'border-primary/40'} rounded-tl-lg`}></div>
            <div className={`absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 ${isMale ? 'border-accent-blue/40' : 'border-primary/40'} rounded-tr-lg`}></div>
            <div className={`absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 ${isMale ? 'border-accent-blue/40' : 'border-primary/40'} rounded-bl-lg`}></div>
            <div className={`absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 ${isMale ? 'border-accent-blue/40' : 'border-primary/40'} rounded-br-lg`}></div>
          </motion.div>
        </div>

        {/* Top Controls */}
        <div className="absolute top-8 left-8 flex gap-3">
          <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2">
            <CloudLightning className={isMale ? 'text-accent-blue' : 'text-primary'} size={14} />
            <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">多维云端同步中</span>
          </div>
        </div>

        <div className="absolute top-8 right-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => toast.success('全屏模式集成中')}
              className="glass-panel p-2.5 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              <Maximize2 size={20} />
            </button>
            <button
              onClick={() => toast.success('个性化设置')}
              className="glass-panel p-2.5 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Chat Area */}
      <aside className="w-full lg:w-[440px] flex flex-col border-l border-slate-800 bg-[#0a0c10]/80 backdrop-blur-2xl h-screen lg:h-auto">
        <div className="p-4 md:p-6 border-b border-slate-800 flex items-center justify-between bg-white/[0.02]">
          <button onClick={onBack} className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white">
            <ChevronRight size={24} className="rotate-180" />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                className={`size-10 rounded-full border ${isMale ? 'border-accent-blue/40' : 'border-primary/40'} object-cover`}
                src={avatarUrl}
                alt={name}
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-0 right-0 size-2.5 bg-green-500 rounded-full border-2 border-[#0a0c10]"></div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">直接链路</h3>
              <p className="text-[10px] text-slate-500 italic">通过神经桥接连接</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400">
              <History size={20} />
            </button>
            <button className="p-2 rounded-lg hover:bg-white/5 text-slate-400">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col gap-2 max-w-[90%] ${msg.role === 'user' ? 'ml-auto items-end' : ''}`}>
              <div className="text-[10px] text-slate-500 mx-1 flex items-center gap-2">
                <span>{msg.role === 'user' ? '您' : name}</span>
                <span className="size-1 bg-slate-700 rounded-full"></span>
                <span>{msg.time}</span>
              </div>
              <div className={`rounded-2xl ${msg.role === 'user' ? `rounded-tr-none ${themeBg} text-white font-medium shadow-lg shadow-primary/20` : 'rounded-tl-none bg-white/5 border border-white/10 text-slate-200 shadow-sm'} p-4 text-sm leading-relaxed`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gradient-to-t from-[#0a0c10] to-transparent">
          <div className="relative group">
            <textarea
              className="w-full rounded-[1.5rem] bg-white/5 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none pr-14 pl-5 py-4 scrollbar-hide text-sm outline-none"
              placeholder="输入消息以同步灵魂..."
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            ></textarea>
            <button
              onClick={handleSendMessage}
              className={`absolute bottom-3 right-3 size-10 rounded-full ${themeBg} flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform active:scale-95`}
            >
              <Send size={18} />
            </button>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-1">
              <button
                onMouseDown={(e) => startVoiceChat(e)}
                onMouseUp={(e) => stopVoiceChat(e)}
                onMouseLeave={(e) => isRecording && stopVoiceChat(e)}
                onTouchStart={(e) => startVoiceChat(e)}
                onTouchEnd={(e) => stopVoiceChat(e)}
                className={`p-2.5 rounded-xl transition-all ${isRecording ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30' : 'hover:bg-white/10 text-slate-500 hover:text-slate-300'}`}
                title="按住说话 (Hold to talk)"
              >
                <Mic size={20} />
              </button>
              <button onClick={() => toast.success('请选择上传附件')} className="p-2.5 rounded-xl hover:bg-white/10 text-slate-500 hover:text-slate-300 transition-colors">
                <Paperclip size={20} />
              </button>
              <button onClick={() => toast.success('表情功能开发中')} className="p-2.5 rounded-xl hover:bg-white/10 text-slate-500 hover:text-slate-300 transition-colors">
                <Smile size={20} />
              </button>
            </div>
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{inputText.length} / 2000 字符</span>
          </div>
        </div>
      </aside>
    </motion.div>
  );
}
