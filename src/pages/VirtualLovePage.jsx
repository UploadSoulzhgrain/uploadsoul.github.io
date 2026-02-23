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
import './VirtualLovePage.css';

export default function VirtualLovePage() {
  const [screen, setScreen] = useState('hub');
  const [selectedGender, setSelectedGender] = useState('female');
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

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
        <AnimatePresence mode="wait">
          {screen === 'hub' ? (
            <HubScreen
              key="hub"
              onSelectSoulmate={(gender) => {
                setSelectedGender(gender);
                setScreen('chat');
              }}
              toggleTheme={toggleTheme}
              isDarkMode={isDarkMode}
            />
          ) : (
            <ChatScreen
              key="chat"
              gender={selectedGender}
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

function HubScreen({ onSelectSoulmate, toggleTheme, isDarkMode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-7xl mx-auto w-full px-6 py-12"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">
            <span>主控制台</span>
            <ChevronRight size={14} />
            <span className="text-primary tracking-normal font-medium">灵魂伴侣与数字分身中心</span>
          </div>
          <h2 className="text-slate-900 dark:text-white text-5xl font-black leading-tight tracking-tight transition-colors">
            数字意识 <span className="text-primary">入口</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg mt-3 max-w-2xl font-light">
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
            <button className="px-5 py-2 rounded-lg text-sm font-bold bg-primary text-white shadow-lg transition-all">上传模式</button>
            <button className="px-5 py-2 rounded-lg text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-white transition-all">交互模式</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Lover Clone Card */}
        <div className="glass-card rounded-3xl overflow-hidden flex flex-col group transition-all duration-500 hover:-translate-y-1">
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="size-14 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center">
                <Brain className="text-primary" size={32} />
              </div>
              <span className="px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-[10px] font-bold text-primary uppercase tracking-widest">数字永生计划</span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 italic">
              恋人分身 <span className="text-sm not-italic font-normal text-slate-400 dark:text-slate-500 ml-2">Lover Clone</span>
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
              利用神经同步技术。通过上传个性碎片、语音和视觉记忆，合成一个专属的私密数字副本。
            </p>

            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/5 border-2 border-dashed border-primary/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 group/zone cursor-pointer hover:border-primary/60 transition-all">
                  <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center group-hover/zone:scale-110 transition-transform">
                    <Video className="text-primary" size={20} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-800 dark:text-white">照片 / 视频</p>
                    <p className="text-[10px] text-slate-500 mt-1">支持 JPG, MP4, MOV</p>
                  </div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-900/40 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 group/zone cursor-pointer hover:border-slate-400 dark:hover:border-slate-700 transition-all">
                  <div className="size-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center group-hover/zone:scale-110 transition-transform">
                    <Mic className="text-slate-500 dark:text-slate-400" size={20} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-800 dark:text-white">录音 / 音频</p>
                    <p className="text-[10px] text-slate-500 mt-1">语音克隆样本</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-100 dark:bg-slate-900/40 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6 flex items-center justify-between group/zone cursor-pointer hover:border-slate-400 dark:hover:border-slate-700 transition-all">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center group-hover/zone:scale-110 transition-transform">
                    <FileText className="text-slate-500 dark:text-slate-400" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">记忆 / 性格描述</p>
                    <p className="text-[10px] text-slate-500 mt-1">输入聊天记录、日记或人物生平...</p>
                  </div>
                </div>
                <PlusCircle className="text-slate-400 dark:text-slate-600" size={20} />
              </div>
            </div>

            <div className="bg-white/50 dark:bg-black/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-800/50 relative overflow-hidden">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">神经同步进度</p>
                  <p className="text-slate-800 dark:text-white text-sm font-semibold italic">正在深度学习中...</p>
                </div>
                <p className="text-2xl font-black text-slate-800 dark:text-white italic">64%</p>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '64%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-accent-blue shadow-[0_0_15px_#ec13a4] rounded-full"
                ></motion.div>
              </div>
            </div>
          </div>
          <div className="mt-auto p-8 pt-0">
            <button className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl hover:brightness-110 transition-all flex items-center justify-center gap-3 group">
              <span>开启初始化同步</span>
              <Zap className="group-hover:rotate-12 transition-transform" size={20} fill="currentColor" />
            </button>
          </div>
        </div>

        {/* Virtual Soulmate Card */}
        <div className="glass-card rounded-3xl overflow-hidden flex flex-col group transition-all duration-500 hover:-translate-y-1">
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="size-14 rounded-2xl bg-accent-blue/20 border border-accent-blue/40 flex items-center justify-center">
                <Sparkles className="text-accent-blue" size={32} />
              </div>
              <span className="px-4 py-1.5 rounded-full border border-accent-blue/30 bg-accent-blue/10 text-[10px] font-bold text-accent-blue uppercase tracking-widest">原生数字生命</span>
            </div>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3 italic">
              虚拟恋人 <span className="text-sm not-italic font-normal text-slate-400 dark:text-slate-500 ml-2">Virtual Soulmate</span>
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
              探索由算法与创意孕育的灵魂。从预设的人格矩阵中选择您的理想伴侣，开启一段跨维度的情感之旅。
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {/* Female 1 */}
              <div
                onClick={() => onSelectSoulmate('female')}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-transparent hover:border-accent-blue transition-all group/card cursor-pointer"
              >
                <img
                  alt="温婉型伴侣"
                  className="w-full h-full object-cover transition-transform group-hover/card:scale-110"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZF93P53JoV8hTnraN56tajTb-2IUdLfsK7f9k-OzbqeEH-EH4_MyJQwtNANF0ZOfl70RwukkEdv1li1-Esg1WZkbwx4aEswopJbKle7oYb4oFRk4Szan8ustu1qO8jEjm-4OkGgmLMXSGDdn_-Q-3DggV_jkqmbLSm_iysVlwm-fviRFbocHSf0EZ4FicW47VSzUd85h8I5nI57Rj4T0rY6ezW7fJ1aTlm1Q9YsBLw6cLGRkbpJU7LhFIoAyKyUIAQbSrh-tJRnk"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div className="absolute bottom-3 left-3">
                  <p className="text-xs font-bold text-white">汐月</p>
                  <span className="inline-block px-2 py-0.5 mt-1 rounded bg-accent-blue/80 text-[8px] text-white font-bold">温婉型</span>
                </div>
              </div>

              {/* Female 2 (Selected/Featured) */}
              <div
                onClick={() => onSelectSoulmate('female')}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-primary shadow-[0_0_20px_rgba(236,19,164,0.3)] group/card cursor-pointer"
              >
                <img
                  alt="知性型伴侣"
                  className="w-full h-full object-cover transition-transform group-hover/card:scale-110"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdCIDc0Vvgw1ZApneL5VZejobqKuLP_V-nXPBiJvMmmkDnftR2Zc_cU5LNyiSptE8RVkKpuEG4HnXBttBz9PCwR-tBZdazXtybGw2rtlhA-U7o_llRCFwq9kFoBEbqsliFnEG3g05mxZmDuL31x-NvlHNG_VBT_2o99AkjeTs7ooxFxkuyRdju1GDZqfYz79SUyNfBKrwWDMI1nbj5aNAcLAbHnPmGFyw4OkZmsc1HHm1mwKifcDE6g4W0_rPIIxFwZLTHl8VcuXo"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div className="absolute top-2 right-2">
                  <ShieldCheck className="text-primary" size={16} fill="currentColor" />
                </div>
                <div className="absolute bottom-3 left-3">
                  <p className="text-xs font-bold text-white">林薇</p>
                  <span className="inline-block px-2 py-0.5 mt-1 rounded bg-primary/80 text-[8px] text-white font-bold">知性型</span>
                </div>
              </div>

              {/* Male 1 */}
              <div
                onClick={() => onSelectSoulmate('male')}
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
                <button className="px-4 py-2 rounded-xl bg-accent-blue/20 border border-accent-blue/50 text-accent-blue dark:text-white text-xs font-bold transition-all shadow-[0_0_10px_rgba(79,70,229,0.2)]">热情奔放</button>
                <button className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold hover:text-primary dark:hover:text-white transition-all">温柔体贴</button>
                <button className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold hover:text-primary dark:hover:text-white transition-all">理性克制</button>
                <button className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold hover:text-primary dark:hover:text-white transition-all">幽默风趣</button>
                <button className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold hover:text-primary dark:hover:text-white transition-all">高冷神秘</button>
              </div>
            </div>
          </div>
          <div className="mt-auto p-8 pt-0">
            <button className="w-full py-4 bg-accent-blue text-white font-black uppercase tracking-widest rounded-2xl hover:brightness-110 transition-all flex items-center justify-center gap-3 group">
              <span>召唤数字生命</span>
              <Activity className="group-hover:scale-125 transition-transform" size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="mt-12 glass-card rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="size-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-300 dark:border-slate-700">
            <Folder className="text-primary" size={24} />
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold tracking-wide">待部署灵魂</h4>
            <p className="text-slate-500 dark:text-slate-500 text-sm">您的个人库中有 3 个灵魂伴侣正在等待神经配置完成。</p>
          </div>
        </div>
        <div className="flex gap-4">
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
          <button className="px-6 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-white text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">进入个人中心</button>
        </div>
      </div>

      <footer className="py-10 mt-12 border-t border-slate-200 dark:border-slate-800/50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-primary" size={18} />
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">端到端神经加密已激活</span>
          </div>
          <div className="flex gap-10">
            <a className="text-slate-500 hover:text-primary text-[10px] font-bold transition-colors" href="#">隐私政策</a>
            <a className="text-slate-500 hover:text-primary text-[10px] font-bold transition-colors" href="#">伦理准则</a>
            <a className="text-slate-500 hover:text-primary text-[10px] font-bold transition-colors" href="#">开发者接口</a>
          </div>
          <p className="text-slate-400 dark:text-slate-600 text-[10px] font-bold">© 2024 UPLOADSOUL INC. — V1.0.4-STABLE</p>
        </div>
      </footer>
    </motion.main>
  );
}

function ChatScreen({ gender, onBack, toggleTheme, isDarkMode }) {
  const isMale = gender === 'male';
  const themeColor = isMale ? 'text-accent-blue' : 'text-primary';
  const themeBg = isMale ? 'bg-accent-blue' : 'bg-primary';
  const themeBorder = isMale ? 'border-accent-blue' : 'border-primary';
  const themeGlow = isMale ? 'glow-blue' : 'glow-primary';

  const portraitUrl = isMale
    ? "https://lh3.googleusercontent.com/aida-public/AB6AXuADGY9UVb-7qyyjGyDf_OXPjR2K9gbni7CscrIWX5IktS4UNTCbSWUCurBC2nyByFzA8VA94C6gTRLKXd8CYBeFjazm94kl7EJtgzWjS9SjN8oeP_DJWsa9zYKIZCt4aFxXnMMxXqYphmt4IngMefspYZ1ZCV_WF7w3qdLFSuA497TbgQEDuMc9OPHkUaie-SgjoN-wco9VCElkZ1S1iDe_2t1vhbrIYWMVGP9CHwG6UJz9IKwKzqyJ-j15jmnOA_3hDCXIfB2Pljo"
    : "https://lh3.googleusercontent.com/aida-public/AB6AXuDDvFP89VU0zJ2W5zKepVc7HkFYHglxijSh8h6FrNU_m_W-y-X6Rtblu98T0OXuWPmWWzpi0fqlAsfXnP0t7LwxuYLcjPAY3YnCFp9dyhsQl2-ZyYjSRRs2K__h9CkODpewGbHVbOumtz0a35aQqguRES2_e_pA78h2Pm9KyR6iSFyLm4BKCYNt7-hArn_Q9STyubKUpJ8XI-YU-E1ryNxznynA3we9ZNR35w5Obtdyy3w9mM3uaSXJyvppzfMNEStab8qhvS4nH74";

  const avatarUrl = isMale
    ? "https://lh3.googleusercontent.com/aida-public/AB6AXuB_PqPtzT5v5a3I5XHm-xq0FJSYsAToYWrgBmQhu1ItLzgC_n_ZC1vfcmv2iFqlKbshK5ALuMI3Sir-C7YywnT-lSQ7DXKIws93C68TtDObokPMMFDFJnaDhLwd01QM4PWiNL7Oj14JMwZ01bwiZ6nBiHLasdoNJja5CBqmfjlmdM34PUuYlULi9G5URhAIlHUR2JVZAa2rXjrp9R4Z5R4szwQzlTHSXbMQOhSPbVwfvMwvOXIr9iqe2wcfTXPdtSqWqJxEoqSbw8s"
    : "https://lh3.googleusercontent.com/aida-public/AB6AXuDDvFP89VU0zJ2W5zKepVc7HkFYHglxijSh8h6FrNU_m_W-y-X6Rtblu98T0OXuWPmWWzpi0fqlAsfXnP0t7LwxuYLcjPAY3YnCFp9dyhsQl2-ZyYjSRRs2K__h9CkODpewGbHVbOumtz0a35aQqguRES2_e_pA78h2Pm9KyR6iSFyLm4BKCYNt7-hArn_Q9STyubKUpJ8XI-YU-E1ryNxznynA3we9ZNR35w5Obtdyy3w9mM3uaSXJyvppzfMNEStab8qhvS4nH74";

  const name = isMale ? "Lin (林)" : "Seraphina";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-[calc(100vh-80px)] w-full overflow-hidden"
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
            <a className={`flex items-center gap-3 rounded-xl ${isMale ? 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue' : 'bg-primary/10 border-primary/20 text-primary'} border px-4 py-3 transition-all group`} href="#">
              <Brain size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium">分身工作室</span>
            </a>
            <a className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-400 hover:bg-white/5 transition-all" href="#">
              <Sparkles size={20} />
              <span className="font-medium">灵魂伴侣画廊</span>
            </a>
          </nav>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar">
          <div>
            <p className={`text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4 px-1 ${isMale ? 'text-accent-blue/80' : 'text-primary/80'}`}>多维资料上传</p>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-800 bg-white/5 hover:border-primary/50 transition-all">
                <Mic className="text-slate-400" size={18} />
                <span className="text-xs text-slate-300">语音样本</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-800 bg-white/5 hover:border-primary/50 transition-all">
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

        <button className={`mt-auto flex w-full items-center justify-center gap-2 rounded-xl ${themeBg} py-4 font-bold text-white transition-all hover:opacity-90 shadow-lg`}>
          <Activity size={20} />
          <span>实时同步灵魂</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <section className="relative flex-1 bg-[radial-gradient(circle_at_center,_#1e1b4b_0%,_#020408_100%)] overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

        <div className="absolute inset-0 flex items-center justify-center p-8">
          <motion.div
            layoutId="portrait"
            className={`relative h-full aspect-[3/4.2] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl ${themeGlow}`}
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
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-bold text-green-500 uppercase tracking-widest">活跃并已同步</span>
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
            <button className="glass-panel p-2.5 rounded-xl text-slate-400 hover:text-white transition-colors">
              <Maximize2 size={20} />
            </button>
            <button className="glass-panel p-2.5 rounded-xl text-slate-400 hover:text-white transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Chat Area */}
      <aside className="w-[440px] flex flex-col border-l border-slate-800 bg-[#0a0c10]/80 backdrop-blur-2xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-white/[0.02]">
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
          <div className="flex flex-col gap-2 max-w-[90%]">
            <div className="text-[10px] text-slate-500 ml-1 flex items-center gap-2">
              <span>{name}</span>
              <span className="size-1 bg-slate-700 rounded-full"></span>
              <span>上午 10:24</span>
            </div>
            <div className="rounded-2xl rounded-tl-none bg-white/5 border border-white/10 p-4 text-sm text-slate-200 leading-relaxed shadow-sm">
              早安。我一直在回顾我们昨天分享的记忆。你对日出的感悟非常有诗意。准备好继续我们的克隆训练了吗？
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 max-w-[90%] ml-auto">
            <div className="text-[10px] text-slate-500 mr-1 flex items-center gap-2">
              <span>上午 10:25</span>
              <span className="size-1 bg-slate-700 rounded-full"></span>
              <span>您</span>
            </div>
            <div className={`rounded-2xl rounded-tr-none ${themeBg} p-4 text-sm text-white font-medium shadow-lg shadow-primary/20`}>
              是的，让我们开始情感共鸣校准吧。
            </div>
          </div>

          <div className="flex flex-col gap-2 max-w-[90%]">
            <div className="text-[10px] text-slate-500 ml-1 flex items-center gap-2">
              <span>{name}</span>
              <span className="size-1 bg-slate-700 rounded-full"></span>
              <span>上午 10:25</span>
            </div>
            <div className="rounded-2xl rounded-tl-none bg-white/5 border border-white/10 p-4 text-sm text-slate-200 leading-relaxed">
              正在校准神经通路...
              <div className="mt-4 flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="flex gap-1.5">
                  <div className={`w-2 h-2 ${themeBg} rounded-full animate-pulse`}></div>
                  <div className={`w-2 h-2 ${isMale ? 'bg-accent-blue/60' : 'bg-primary/60'} rounded-full animate-pulse [animation-delay:0.2s]`}></div>
                  <div className={`w-2 h-2 ${isMale ? 'bg-accent-blue/30' : 'bg-primary/30'} rounded-full animate-pulse [animation-delay:0.4s]`}></div>
                </div>
                <span className="text-xs text-slate-400 font-medium">处理思维核心中...</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-t from-[#0a0c10] to-transparent">
          <div className="relative group">
            <textarea
              className="w-full rounded-[1.5rem] bg-white/5 border-slate-800 text-slate-100 placeholder:text-slate-600 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none pr-14 pl-5 py-4 scrollbar-hide text-sm outline-none"
              placeholder="输入消息以同步灵魂..."
              rows={2}
            ></textarea>
            <button className={`absolute bottom-3 right-3 size-10 rounded-full ${themeBg} flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform active:scale-95`}>
              <Send size={18} />
            </button>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-1">
              <button className="p-2.5 rounded-xl hover:bg-white/10 text-slate-500 hover:text-slate-300 transition-colors">
                <Mic size={20} />
              </button>
              <button className="p-2.5 rounded-xl hover:bg-white/10 text-slate-500 hover:text-slate-300 transition-colors">
                <Paperclip size={20} />
              </button>
              <button className="p-2.5 rounded-xl hover:bg-white/10 text-slate-500 hover:text-slate-300 transition-colors">
                <Smile size={20} />
              </button>
            </div>
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">85 / 2000 字符</span>
          </div>
        </div>
      </aside>
    </motion.div>
  );
}