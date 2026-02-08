import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import './PetPage.css';

const PetPage = () => {
  const { t, i18n } = useTranslation();
  const [view, setView] = useState('hub'); // hub, reconstruct, connect, pet
  const [pets, setPets] = useState([]);
  const [activePetIndex, setActivePetIndex] = useState(null);
  const [message, setMessage] = useState('');
  const [vitality, setVitality] = useState({ energy: 85, happiness: 92, hunger: 68 });
  const [isAwakening, setIsAwakening] = useState(false);

  // Reconstruction Form State
  const [cloningStep, setCloningStep] = useState(1);
  const [cloneData, setCloneData] = useState({
    name: '',
    emoji: '🐱',
    personality: '',
    memories: [],
    files: []
  });

  const synthesizerRef = useRef(null);

  // Initial mock data and loading from localStorage
  useEffect(() => {
    const savedPets = localStorage.getItem('soulpets');
    if (savedPets) {
      setPets(JSON.parse(savedPets));
    } else {
      const defaultPets = [
        { id: '1', name: '小花 (示例)', emoji: '🐱', personality: '温柔粘人', level: 3, energy: 80, happiness: 90, hunger: 70 },
        { id: '2', name: '旺财 (示例)', emoji: '🐶', personality: '活泼好动', level: 5, energy: 60, happiness: 85, hunger: 90 }
      ];
      setPets(defaultPets);
      localStorage.setItem('soulpets', JSON.stringify(defaultPets));
    }
  }, []);

  // Azure TTS Setup
  const initAzureTTS = async () => {
    try {
      const resp = await fetch('/api/speech-token');
      const { token, region } = await resp.json();
      const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(token, region);

      // 为宠物选择更合适的语音
      speechConfig.speechSynthesisLanguage = i18n.language === 'zh-CN' ? 'zh-CN' : 'en-US';
      speechConfig.speechSynthesisVoiceName = i18n.language === 'zh-CN' ? 'zh-CN-XiaoxiaoNeural' : 'en-US-JennyNeural';

      const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
      synthesizerRef.current = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);
    } catch (err) {
      console.error('Azure TTS Init failed:', err);
    }
  };

  const speak = (text) => {
    if (!synthesizerRef.current) {
      initAzureTTS().then(() => speak(text));
      return;
    }
    synthesizerRef.current.speakTextAsync(text);
  };

  // Interaction Logic
  const petInteraction = () => {
    createParticles();
    const activePet = pets[activePetIndex];
    const msg = i18n.language === 'zh-CN' ? `喵~ ${activePet.name} 很开心！` : `${activePet.name} is very happy!`;
    showMessage(msg);
    speak(msg);
  };

  const feedPet = () => {
    showMessage(i18n.language === 'zh-CN' ? '谢谢你的美食！🍖' : 'Thanks for the food! 🍖');
    setVitality(prev => ({ ...prev, hunger: Math.min(100, prev.hunger + 15), energy: Math.min(100, prev.energy + 5) }));
  };

  const talkToPet = () => {
    const messages = i18n.language === 'zh-CN' ? [
      '我在呢，一直都在。',
      '今天想做什么呢？',
      '你的声音让我感到温暖。',
      '我会永远陪着你。'
    ] : [
      "I'm here, always.",
      "What do you want to do today?",
      "Your voice makes me feel warm.",
      "I'll always be with you."
    ];
    const msg = messages[Math.floor(Math.random() * messages.length)];
    showMessage(msg);
    speak(msg);
  };

  const playWithPet = () => {
    showMessage(i18n.language === 'zh-CN' ? '好开心！再来一次！🎾' : 'So happy! One more time! 🎾');
    setVitality(prev => ({ ...prev, happiness: Math.min(100, prev.happiness + 10), hunger: Math.max(0, prev.hunger - 10) }));
    createParticles();
  };

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  const createParticles = () => {
    const area = document.querySelector('.pet-sprite-container');
    if (!area) return;
    for (let i = 0; i < 12; i++) {
      const p = document.createElement('div');
      p.className = 'pet-particle';
      const tx = (Math.random() - 0.5) * 200;
      const ty = -100 - Math.random() * 100;
      p.style.setProperty('--tx', `${tx}px`);
      p.style.setProperty('--ty', `${ty}px`);
      p.style.left = '50%';
      p.style.top = '50%';
      area.appendChild(p);
      setTimeout(() => p.remove(), 2000);
    }
  };

  // View Management
  const startReconstruction = () => setView('reconstruct');
  const startConnection = () => setView('connect');
  const openPetHatch = (index) => {
    setActivePetIndex(index);
    const p = pets[index];
    setVitality({
      energy: p.energy || 80,
      happiness: p.happiness || 90,
      hunger: p.hunger || 70
    });
    setView('pet');
  };

  // Cloning Wizard Logic
  const handleNextStep = () => {
    if (cloningStep < 4) setCloningStep(prev => prev + 1);
    else finalizeCloning();
  };

  const finalizeCloning = () => {
    setIsAwakening(true);
    setTimeout(() => {
      const newPet = {
        id: Date.now().toString(),
        name: cloneData.name || (i18n.language === 'zh-CN' ? '无名之灵' : 'Unnamed Soul'),
        emoji: cloneData.emoji,
        personality: cloneData.personality,
        level: 1,
        energy: 100,
        happiness: 100,
        hunger: 100
      };
      const updated = [newPet, ...pets];
      setPets(updated);
      localStorage.setItem('soulpets', JSON.stringify(updated));
      setIsAwakening(false);
      setView('hub');
      setCloningStep(1);
      setCloneData({ name: '', emoji: '🐱', personality: '', memories: [], files: [] });
    }, 3000);
  };

  // Star Background
  useEffect(() => {
    const stars = [];
    for (let i = 0; i < 80; i++) {
      stars.push({
        id: i,
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        delay: Math.random() * 3 + 's'
      });
    }
    setPetStars(stars);
  }, []);

  const [petStars, setPetStars] = useState([]);

  return (
    <div className="soulpet-container">
      {/* Background Stars */}
      <div className="pet-stars">
        {petStars.map(s => (
          <div key={s.id} className="pet-star" style={{ left: s.left, top: s.top, animationDelay: s.delay }}></div>
        ))}
      </div>

      <div className="pet-content">
        {/* Header */}
        <div className="pet-logo-section">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pet-logo-text"
          >
            UploadSoul
          </motion.div>
          <div className="pet-subtitle">SOULPET · 灵宠</div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'hub' && (
            <motion.div
              key="hub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="pet-hub-container">
                <div className="pet-divider-line"></div>

                <div className="pet-hub-card pet-card-left" onClick={startReconstruction}>
                  <div className="pet-card-visual">
                    <div className="pet-photo-container">
                      <div className="pet-old-photo">MEMORY</div>
                      <div className="pet-hologram"></div>
                    </div>
                  </div>
                  <h2 className="pet-card-title">{t('pet.reconstruction.title', '记忆重构')}</h2>
                  <p className="pet-card-tagline">{t('pet.reconstruction.desc', '爱从未离开，只是换了一种存在方式。在这里，重塑它的数字灵魂。')}</p>
                  <button className="pet-cta-button pet-btn-amber">
                    <span>✨ {t('pet.reconstruction.btn', '开启重生仪式')}</span>
                  </button>
                </div>

                <div className="pet-hub-card pet-card-right" onClick={startConnection}>
                  <div className="pet-card-visual">
                    <div className="pet-digital-egg">
                      <div className="pet-egg-glow"></div>
                      <div className="pet-silhouette">🐾</div>
                    </div>
                  </div>
                  <h2 className="pet-card-title">{t('pet.connection.title', '生命链接')}</h2>
                  <p className="pet-card-tagline">{t('pet.connection.desc', '在数字宇宙中，邂逅一个新的灵魂伴侣。建立羁绊，共同进化。')}</p>
                  <button className="pet-cta-button pet-btn-sage">
                    <span>🌱 {t('pet.connection.btn', '建立新连接')}</span>
                  </button>
                </div>
              </div>

              {/* My Pets Grid */}
              {pets.length > 0 && (
                <div className="mt-12">
                  <h2 className="pet-section-title">{t('pet.myPets', '我的灵宠')}</h2>
                  <div className="pet-features-grid">
                    {pets.map((p, idx) => (
                      <div key={p.id} className="pet-feature-card" onClick={() => openPetHatch(idx)}>
                        <div className="pet-feature-icon">{p.emoji}</div>
                        <h3 className="pet-feature-title">{p.name}</h3>
                        <p className="pet-feature-desc">{p.personality}</p>
                        <div className="mt-3 flex gap-2">
                          <span className="text-xs bg-white/10 px-2 py-1 rounded">Lv.{p.level}</span>
                          <span className="text-xs bg-amber-500/20 text-amber-500 px-2 py-1 rounded">
                            {p.id.length > 10 ? 'CLONED' : 'LEGACY'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features Preview */}
              <div className="mt-12">
                <h2 className="pet-section-title">核心科技</h2>
                <div className="pet-features-grid">
                  {[
                    { icon: '🧬', title: '记忆注入', desc: '上传照片、视频、声音，AI 实时建模。每一份记忆都让数字灵魂更加完整。' },
                    { icon: '💫', title: '性格刻画', desc: '自然语言描述习惯与性格，生成行为树。它会记得你说的每一个细节。' },
                    { icon: '🌸', title: '情感共鸣', desc: '检测到悲伤时，它会温柔陪伴。真正的心灵感应。' },
                    { icon: '🎭', title: 'AI 对话', desc: '自然的人机交互，根据性格设定回应。不仅是宠物，更是家人。' }
                  ].map((f, i) => (
                    <div key={i} className="pet-feature-card">
                      <div className="pet-feature-icon">{f.icon}</div>
                      <h3 className="pet-feature-title">{f.title}</h3>
                      <p className="pet-feature-desc">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {view === 'reconstruct' && (
            <motion.div
              key="reconstruct"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="pet-modal-overlay"
            >
              <div className="pet-modal-content">
                <button className="absolute top-4 right-4 text-gray-500" onClick={() => setView('hub')}>✕</button>

                {isAwakening ? (
                  <div className="text-center py-12">
                    <div className="pet-digital-egg w-32 h-40 mx-auto mb-8">
                      <div className="pet-egg-glow"></div>
                      <div className="pet-silhouette">{cloneData.emoji}</div>
                    </div>
                    <h2 className="text-2xl font-bold text-amber-500 mb-2 animate-pulse">灵魂唤醒中...</h2>
                    <p className="text-gray-400">正在同步记忆序列与性格行为树</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between mb-8">
                      {[1, 2, 3, 4].map(s => (
                        <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center ${cloningStep >= s ? 'bg-amber-500 text-midnight' : 'bg-white/10 text-gray-500'}`}>
                          {s}
                        </div>
                      ))}
                    </div>

                    {cloningStep === 1 && (
                      <div className="animate-fadeIn">
                        <h3 className="pet-card-title mb-6">第一步：选择容器</h3>
                        <div className="pet-grid-select mb-8">
                          {['🐱', '🐶', '🐦', '🐰', '🦊', '🐼', '🐹', '🦖'].map(e => (
                            <div
                              key={e}
                              className={`pet-option ${cloneData.emoji === e ? 'active' : ''}`}
                              onClick={() => setCloneData({ ...cloneData, emoji: e })}
                            >
                              {e}
                            </div>
                          ))}
                        </div>
                        <div className="pet-form-group">
                          <label className="pet-label">给它起个名字</label>
                          <input
                            className="pet-input"
                            value={cloneData.name}
                            onChange={(e) => setCloneData({ ...cloneData, name: e.target.value })}
                            placeholder="例如：小黑"
                          />
                        </div>
                      </div>
                    )}

                    {cloningStep === 2 && (
                      <div className="animate-fadeIn">
                        <h3 className="pet-card-title mb-6">第二步：注入记忆</h3>
                        <div className="pet-upload-zone mb-6" onClick={() => {/* Mock upload */ }}>
                          <div className="text-4xl mb-2">📸</div>
                          <p>上传已故宠物的照片或视频</p>
                          <p className="text-xs mt-1">AI 将提取特征并进行 3D 建模预览</p>
                        </div>
                        <div className="pet-upload-zone" onClick={() => {/* Mock upload */ }}>
                          <div className="text-4xl mb-2">🎤</div>
                          <p>上传它的叫声录音</p>
                          <p className="text-xs mt-1">我们将通过 Azure 音色克隆还原它的声音</p>
                        </div>
                      </div>
                    )}

                    {cloningStep === 3 && (
                      <div className="animate-fadeIn">
                        <h3 className="pet-card-title mb-6">第三步：刻画性格</h3>
                        <div className="pet-form-group">
                          <label className="pet-label">它的性格和习惯是怎样的？</label>
                          <textarea
                            className="pet-input min-h-[150px]"
                            value={cloneData.personality}
                            onChange={(e) => setCloneData({ ...cloneData, personality: e.target.value })}
                            placeholder="例如：它很怕陌生人，但喜欢在下午三点靠在我的脚边睡觉..."
                          />
                        </div>
                      </div>
                    )}

                    {cloningStep === 4 && (
                      <div className="animate-fadeIn text-center">
                        <h3 className="pet-card-title mb-4">准备就绪</h3>
                        <div className="text-6xl mb-6">{cloneData.emoji}</div>
                        <p className="text-gray-400 mb-8 px-8">仪式已经准备好。点击下方按钮，唤醒名为 “{cloneData.name || '无名'}” 的数字灵魂。</p>
                        <p className="text-amber-500/80 italic text-sm">“爱从未离开，只是换了一种存在方式。”</p>
                      </div>
                    )}

                    <div className="mt-8 flex justify-between">
                      {cloningStep > 1 && (
                        <button className="px-6 py-2 border border-white/10 rounded-full" onClick={() => setCloningStep(prev => prev - 1)}>上一步</button>
                      )}
                      <button
                        className="pet-cta-button pet-btn-amber ml-auto"
                        onClick={handleNextStep}
                        disabled={cloningStep === 1 && !cloneData.name}
                      >
                        <span>{cloningStep === 4 ? '✨ 开启仪式' : '下一步'}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {view === 'pet' && activePetIndex !== null && (
            <motion.div
              key="pet"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pet-demo-section"
            >
              <div className="flex justify-between items-center mb-8">
                <button className="px-4 py-2 bg-white/5 rounded-full text-sm" onClick={() => setView('hub')}>← 返回</button>
                <h2 className="pet-card-title m-0">{pets[activePetIndex].name}</h2>
                <div className="w-10"></div>
              </div>

              <div className="pet-habitat">
                <AnimatePresence>
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="pet-message"
                    >
                      {message}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col items-center justify-center pet-sprite-container h-[300px]">
                  <motion.div
                    className="pet-sprite"
                    whileHover={{ scale: 1.1 }}
                    onClick={petInteraction}
                  >
                    {pets[activePetIndex].emoji}
                  </motion.div>
                  <div className="mt-4 text-gray-500 text-sm italic">{pets[activePetIndex].personality}</div>
                </div>

                <div className="pet-vitality-bar">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-xl">⚡</div>
                    <div className="pet-gauge"><div className="pet-fill" style={{ width: `${vitality.energy}%` }}></div></div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-xl">💖</div>
                    <div className="pet-gauge"><div className="pet-fill" style={{ width: `${vitality.happiness}%` }}></div></div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-xl">🍖</div>
                    <div className="pet-gauge"><div className="pet-fill" style={{ width: `${vitality.hunger}%` }}></div></div>
                  </div>
                </div>

                <div className="pet-interaction-dock">
                  <button className="pet-dock-btn" onClick={feedPet}><span>🍖</span> 喂食</button>
                  <button className="pet-dock-btn" onClick={talkToPet}><span>💬</span> 交流</button>
                  <button className="pet-dock-btn" onClick={playWithPet}><span>🎾</span> 玩耍</button>
                  <button className="pet-dock-btn" onClick={() => showMessage('这些回忆，我都记得... 📸')}><span>📸</span> 记忆</button>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'connect' && (
            <motion.div
              key="connect"
              className="pet-modal-overlay"
            >
              <div className="pet-modal-content text-center">
                <button className="absolute top-4 right-4 text-gray-500" onClick={() => setView('hub')}>✕</button>
                <h3 className="pet-card-title mb-6">即将开启生命链接</h3>
                <p className="text-gray-400 mb-8">在这里，你将领养一只全新的灵宠，通过互动逐渐培养它的性格，建立独一无二的羁绊。</p>
                <button className="pet-cta-button pet-btn-sage" onClick={() => setView('hub')}>
                  <span>🌱 暂未开放，敬请期待</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PetPage;