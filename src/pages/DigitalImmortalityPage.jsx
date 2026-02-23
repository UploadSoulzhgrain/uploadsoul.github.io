import { Mic, Camera, MessageSquare, BookOpen, Zap, User } from 'lucide-react';
import { MediaService } from '../services/mediaService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const UploadSoul = () => {
  const [showGenesisModal, setShowGenesisModal] = useState(false); // 创建化身模态框
  const [genesisStep, setGenesisStep] = useState(1); // 创建步骤
  const [genesisData, setGenesisData] = useState({
    photos: [],
    voice: null,
    videos: [],
    personality: {},
    memories: []
  });

  const [messages, setMessages] = useState([
    {
      type: 'ai-observation',
      text: '今天你似乎对那只流浪猫很在意，你的语气变得很温柔。我记住了，原来我们内心深处是柔软的。—— 你的身外化身',
      timestamp: '昨天 23:47'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [systemLog, setSystemLog] = useState('');
  const [sparks, setSparks] = useState([]);
  const [evolutionProgress, setEvolutionProgress] = useState(94);
  const [avatarState, setAvatarState] = useState('listening');
  const [glowIntensity, setGlowIntensity] = useState(0.5);
  const [activeInputMode, setActiveInputMode] = useState('text');
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const [uploadProgress, setUploadProgress] = useState(null);
  const [storageUsageMB, setStorageUsageMB] = useState(0);

  // Initial quota check
  useEffect(() => {
    if (user) {
      MediaService.checkQuota(user.id, 0).then(res => setStorageUsageMB(res.currentUsageMB));
    }
  }, [user]);

  // Particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.2
    }));

    let animationId;
    const animate = () => {
      ctx.fillStyle = 'rgba(5, 8, 20, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 200, 255, ${p.opacity})`;
        ctx.fill();

        particles.forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(100, 200, 255, ${0.1 * (1 - dist / 100)})`;
            ctx.stroke();
          }
        });
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  const createSpark = (count = 1) => {
    for (let i = 0; i < count; i++) {
      const id = Date.now() + i;
      setSparks(prev => [...prev, {
        id,
        x: 30 + Math.random() * 40,
        y: 20 + Math.random() * 60
      }]);
      setTimeout(() => {
        setSparks(prev => prev.filter(s => s.id !== id));
      }, 2000);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!user) {
      toast.error('请先登录以进行上传');
      return;
    }

    try {
      setUploadProgress(0);
      setSystemLog('> 正在初始化上传安全通道...');

      const mediaUrl = await MediaService.uploadMedia(file, user.id, (progress) => {
        setUploadProgress(progress);
        setSystemLog(`> 正在同步灵魂数据... ${progress}%`);
      });

      const timestamp = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, {
        type: 'user',
        text: '[上传了照片]',
        timestamp,
        attachment: mediaUrl
      }]);

      createSpark(3);
      setSystemLog('> 正在分析图像内容...');

      // Update local storage usage
      const newUsage = await MediaService.checkQuota(user.id, 0);
      setStorageUsageMB(newUsage.currentUsageMB);

      setTimeout(() => {
        setSystemLog('> 提取情感特征: "温暖" "怀旧"');
        handleAIResponse('image');
      }, 1500);

    } catch (error) {
      toast.error(error.message || '上传失败');
      setSystemLog(`> 错误: ${error.message}`);
    } finally {
      setUploadProgress(null);
    }
  };

  const handleVoiceInput = () => {
    setActiveInputMode('voice');
    setSystemLog('> 正在激活语音识别系统...');
    createSpark(2);
    setTimeout(() => {
      setSystemLog('> 语音采集中... 请说话');
      setTimeout(() => {
        const voiceMsg = {
          type: 'user',
          text: '[语音消息: "今天工作很累，但看到那只流浪猫又出现了，心情好了一些"]',
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, voiceMsg]);
        setActiveInputMode('text');
        handleAIResponse('voice');
      }, 3000);
    }, 1000);
  };

  const handleImageUpload = () => {
    setActiveInputMode('image');
    fileInputRef.current?.click();
  };

  const handleAIResponse = (triggerType = 'text') => {
    setAvatarState('thinking');

    setTimeout(() => {
      setSystemLog('> 正在检索核心记忆块: "流浪猫" "情感模式"...');
      setTimeout(() => {
        setSystemLog('> 正在模拟情感反应: "同理心 + 温柔"...');
        createSpark(5);
        setGlowIntensity(0.95);

        setTimeout(() => {
          setIsTyping(true);
          setAvatarState('responding');
          setTimeout(() => {
            const responses = [
              '我在听。这种感觉我记住了。你对小动物的关心，是你温柔的一面。',
              '辛苦了。即使疲惫，你依然能注意到生活中的小确幸。这就是我们的性格。',
              '我记录下了这份温暖。你提到的那只猫，对你来说已经不只是陌生的动物了。',
              '这张照片里的情绪我感受到了。每一个瞬间都在塑造着我们。'
            ];
            const aiResponse = {
              type: 'ai',
              text: responses[Math.floor(Math.random() * responses.length)],
              timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
            setSystemLog('');
            setAvatarState('listening');
            setGlowIntensity(0.5);
            setEvolutionProgress(prev => Math.min(prev + 0.8, 100));
            if (activeInputMode !== 'text') setActiveInputMode('text');
          }, 2500);
        }, 1200);
      }, 1000);
    }, 600);
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;
    const userMessage = {
      type: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    handleAIResponse('text');
  };

  const openGenesisModal = () => {
    setShowGenesisModal(true);
    setGenesisStep(1);
  };

  const closeGenesisModal = () => {
    setShowGenesisModal(false);
  };

  const handleGenesisFileUpload = async (e, type) => {
    const files = Array.from(e.target.files);
    if (!user) {
      toast.error('请先登录以进行上传');
      return;
    }

    for (const file of files) {
      try {
        setUploadProgress(0);
        const mediaUrl = await MediaService.uploadMedia(file, user.id, (progress) => {
          setUploadProgress(progress);
        });

        setGenesisData(prev => ({
          ...prev,
          [type]: type === 'photos' || type === 'videos'
            ? [...prev[type], mediaUrl]
            : mediaUrl
        }));

        // Update storage usage
        const newUsage = await MediaService.checkQuota(user.id, 0);
        setStorageUsageMB(newUsage.currentUsageMB);
        toast.success(`${file.name} 上传成功`);
      } catch (error) {
        toast.error(`${file.name} 上传失败: ${error.message}`);
      } finally {
        setUploadProgress(null);
      }
    }
  };

  const nextGenesisStep = () => {
    if (genesisStep < 4) {
      setGenesisStep(prev => prev + 1);
    }
    if (genesisStep === 3) {
      // 开始生成化身
      setTimeout(() => {
        setGenesisStep(4);
        setTimeout(() => {
          setShowGenesisModal(false);
          setSystemLog('> 身外化身创建完成！');
          createSpark(10);
          setEvolutionProgress(100);
          setTimeout(() => setSystemLog(''), 3000);
        }, 4000);
      }, 500);
    }
  };

  const addMemory = (memory) => {
    setGenesisData(prev => ({
      ...prev,
      memories: [...prev.memories, memory]
    }));
  };

  return (
    <div className="uploadsoul-container">
      <canvas ref={canvasRef} className="particle-canvas" />

      {/* 创建化身模态框 */}
      {showGenesisModal && (
        <div className="genesis-overlay">
          <div className="genesis-container">
            <button className="genesis-close" onClick={closeGenesisModal}>×</button>

            <div className="genesis-step-indicator">
              <div className={`step-dot ${genesisStep >= 1 ? 'active' : ''} ${genesisStep > 1 ? 'completed' : ''}`} />
              <div className={`step-dot ${genesisStep >= 2 ? 'active' : ''} ${genesisStep > 2 ? 'completed' : ''}`} />
              <div className={`step-dot ${genesisStep >= 3 ? 'active' : ''} ${genesisStep > 3 ? 'completed' : ''}`} />
            </div>

            {genesisStep === 1 && (
              <>
                <div className="genesis-title">生物体征上传</div>
                <div className="genesis-subtitle">BIOMETRIC UPLOADS / 让我看见你</div>

                <div className="upload-zone" onClick={() => document.getElementById('photo-upload').click()}>
                  <div className="upload-zone-icon">📷</div>
                  <div className="upload-zone-text">上传你的照片 (支持多张)</div>
                </div>
                <input
                  id="photo-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleGenesisFileUpload(e, 'photos')}
                />
                {genesisData.photos.length > 0 && (
                  <div className="uploaded-preview">
                    {genesisData.photos.map((photo, idx) => (
                      <img key={idx} src={photo} alt="" className="preview-item" />
                    ))}
                  </div>
                )}

                <div className="upload-zone" onClick={() => document.getElementById('voice-upload').click()}>
                  <div className="upload-zone-icon">🎤</div>
                  <div className="upload-zone-text">上传你的声音样本 (录音文件)</div>
                </div>
                <input
                  id="voice-upload"
                  type="file"
                  accept="audio/*"
                  style={{ display: 'none' }}
                  onChange={(e) => handleGenesisFileUpload(e, 'voice')}
                />

                <button
                  className="genesis-next-btn"
                  onClick={nextGenesisStep}
                  disabled={genesisData.photos.length === 0}
                >
                  下一步 / Next
                </button>
              </>
            )}

            {genesisStep === 2 && (
              <>
                <div className="genesis-title">灵魂铭刻</div>
                <div className="genesis-subtitle">MIND INSCRIPTION / 告诉我你是谁</div>

                <div className="personality-options">
                  <div className="personality-question">
                    面对冲突时，你倾向于？
                  </div>
                  <div className="personality-buttons">
                    {['理性分析', '情感表达', '回避'].map(option => (
                      <button
                        key={option}
                        className={`personality-btn ${genesisData.personality.conflict === option ? 'selected' : ''}`}
                        onClick={() => setGenesisData(prev => ({
                          ...prev,
                          personality: { ...prev.personality, conflict: option }
                        }))}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="personality-options">
                  <div className="personality-question">
                    你更倾向于？
                  </div>
                  <div className="personality-buttons">
                    {['独处思考', '社交互动'].map(option => (
                      <button
                        key={option}
                        className={`personality-btn ${genesisData.personality.social === option ? 'selected' : ''}`}
                        onClick={() => setGenesisData(prev => ({
                          ...prev,
                          personality: { ...prev.personality, social: option }
                        }))}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  className="genesis-next-btn"
                  onClick={nextGenesisStep}
                  disabled={!genesisData.personality.conflict || !genesisData.personality.social}
                >
                  下一步 / Next
                </button>
              </>
            )}

            {genesisStep === 3 && (
              <>
                <div className="genesis-title">核心记忆</div>
                <div className="genesis-subtitle">CORE MEMORIES / 塑造你的关键时刻</div>

                <textarea
                  className="memory-input"
                  placeholder="请输入一个塑造了今天的你的关键记忆或时刻..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey && e.target.value.trim()) {
                      addMemory(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <div style={{ fontSize: '12px', color: 'rgba(224, 230, 255, 0.5)', marginBottom: '20px' }}>
                  按 Ctrl+Enter 添加记忆
                </div>

                {genesisData.memories.length > 0 && (
                  <div className="memory-list">
                    {genesisData.memories.map((memory, idx) => (
                      <div key={idx} className="memory-item">
                        记忆 {idx + 1}: {memory}
                      </div>
                    ))}
                  </div>
                )}

                <button
                  className="genesis-next-btn"
                  onClick={nextGenesisStep}
                  disabled={genesisData.memories.length === 0}
                >
                  启动灵魂备份 / Initialize Genesis
                </button>
              </>
            )}

            {genesisStep === 4 && (
              <div className="generating-animation">
                <div className="generating-spinner" />
                <div className="generating-text">正在构建数据晶格化身...</div>
                <div style={{ marginTop: '20px', fontSize: '12px', color: 'rgba(224, 230, 255, 0.5)' }}>
                  分析面部特征 · 克隆声纹 · 建立性格矩阵 · 注入核心记忆
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 原有主界面 */}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Noto+Sans+SC:wght@300;400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { overflow: hidden; }
        .uploadsoul-container {
          width: 100vw; height: 100vh;
          background: linear-gradient(135deg, #050814 0%, #0a1128 50%, #1a0b2e 100%);
          color: #e0e6ff;
          font-family: 'Noto Sans SC', sans-serif;
          position: relative; overflow: hidden;
        }
        .particle-canvas {
          position: absolute; top: 0; left: 0;
          width: 100%; height: 100%;
          pointer-events: none; z-index: 1;
        }
        .soul-title {
          position: absolute; top: 40px; left: 40px; z-index: 5;
          font-family: 'Orbitron', monospace;
          font-size: 28px; font-weight: 900;
          background: linear-gradient(135deg, #64c8ff, #8a2be2, #00ff88);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 4px;
          animation: titleGlow 3s ease-in-out infinite;
        }
        @keyframes titleGlow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(100, 200, 255, 0.4)); }
          50% { filter: drop-shadow(0 0 40px rgba(100, 200, 255, 0.8)); }
        }
        .soul-subtitle {
          font-size: 11px;
          color: rgba(100, 200, 255, 0.7);
          letter-spacing: 3px; margin-top: 4px;
          font-weight: 400;
          -webkit-text-fill-color: rgba(100, 200, 255, 0.7);
        }
        .main-viewport {
          position: absolute; left: 0; top: 0;
          width: 62%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          z-index: 2;
        }
        .avatar-container {
          position: relative;
          width: 400px; height: 500px;
          perspective: 1000px;
        }
        .avatar-figure {
          position: relative;
          width: 100%; height: 100%;
          animation: avatarFloat 6s ease-in-out infinite;
        }
        @keyframes avatarFloat {
          0%, 100% { transform: translateY(0px) rotateY(-5deg); }
          50% { transform: translateY(-15px) rotateY(5deg); }
        }
        .avatar-core {
          position: absolute;
          width: 180px; height: 180px;
          left: 50%; top: 40%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(100, 200, 255, 0.4) 0%, rgba(138, 43, 226, 0.3) 50%, transparent 70%);
          filter: blur(30px);
          animation: corePulse 3s ease-in-out infinite;
        }
        @keyframes corePulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.9; }
        }
        .avatar-glow {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at center, 
            rgba(100, 200, 255, ${glowIntensity * 0.3}) 0%,
            rgba(138, 43, 226, ${glowIntensity * 0.2}) 40%,
            transparent 70%);
          filter: blur(50px);
          transition: all 0.8s ease;
        }
        .avatar-silhouette {
          position: absolute;
          left: 50%; top: 50%;
          transform: translate(-50%, -50%);
          width: 200px; height: 350px;
          background: linear-gradient(180deg, 
            rgba(100, 200, 255, 0.15) 0%,
            rgba(138, 43, 226, 0.1) 50%,
            rgba(0, 255, 136, 0.05) 100%);
          clip-path: polygon(
            30% 0%, 70% 0%, 75% 10%, 80% 25%, 80% 35%,
            90% 40%, 90% 60%, 85% 75%, 70% 85%, 65% 95%, 50% 100%,
            35% 95%, 30% 85%, 15% 75%, 10% 60%, 10% 40%, 20% 35%,
            20% 25%, 25% 10%
          );
          filter: blur(2px);
          border: 1px solid rgba(100, 200, 255, 0.3);
          box-shadow: 0 0 30px rgba(100, 200, 255, 0.4), inset 0 0 30px rgba(138, 43, 226, 0.2);
        }
        .data-streams {
          position: absolute; inset: 0;
          overflow: hidden; opacity: 0.7;
        }
        .data-stream {
          position: absolute; width: 2px; height: 100px;
          background: linear-gradient(180deg, transparent, #64c8ff, transparent);
          animation: streamFlow 3s linear infinite;
        }
        .data-stream:nth-child(1) { left: 20%; animation-delay: 0s; }
        .data-stream:nth-child(2) { left: 40%; animation-delay: 0.5s; }
        .data-stream:nth-child(3) { left: 60%; animation-delay: 1s; }
        .data-stream:nth-child(4) { left: 80%; animation-delay: 1.5s; }
        @keyframes streamFlow {
          0% { top: -100px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .memory-spark {
          position: absolute;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #ffd700;
          box-shadow: 0 0 20px #ffd700;
          animation: sparkFly 2s ease-out forwards;
          pointer-events: none;
        }
        @keyframes sparkFly {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
        .avatar-state-indicator {
          position: absolute;
          bottom: 20px; left: 50%;
          transform: translateX(-50%);
          font-family: 'Orbitron', monospace;
          font-size: 13px; color: #64c8ff;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          opacity: 1; padding: 10px 24px;
          background: rgba(10, 17, 40, 0.9);
          border: 2px solid rgba(100, 200, 255, 0.5);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          box-shadow: 0 0 20px rgba(100, 200, 255, 0.3);
          animation: stateGlow 2s ease-in-out infinite;
          white-space: nowrap;
          z-index: 10;
        }
        @keyframes stateGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(100, 200, 255, 0.3), 0 0 40px rgba(100, 200, 255, 0.1); }
          50% { box-shadow: 0 0 30px rgba(100, 200, 255, 0.6), 0 0 60px rgba(100, 200, 255, 0.2); }
        }
        .avatar-state-indicator.thinking {
          color: #ffd700;
          border-color: rgba(255, 215, 0, 0.6);
          animation: stateGlowThinking 1s ease-in-out infinite;
        }
        @keyframes stateGlowThinking {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.4), 0 0 40px rgba(255, 215, 0, 0.2); }
          50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.8), 0 0 80px rgba(255, 215, 0, 0.4); }
        }
        .avatar-state-indicator.responding {
          color: #00ff88;
          border-color: rgba(0, 255, 136, 0.6);
          animation: stateGlowResponding 1.5s ease-in-out infinite;
        }
        @keyframes stateGlowResponding {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 136, 0.4), 0 0 40px rgba(0, 255, 136, 0.2); }
          50% { box-shadow: 0 0 35px rgba(0, 255, 136, 0.7), 0 0 70px rgba(0, 255, 136, 0.3); }
        }
        .interaction-deck {
          position: absolute; right: 0; top: 0;
          width: 38%; height: 100%; z-index: 3;
          display: flex; flex-direction: column;
          padding: 85px 25px 40px 25px;
          backdrop-filter: blur(20px);
          background: linear-gradient(135deg, rgba(10, 17, 40, 0.4) 0%, rgba(26, 11, 46, 0.3) 100%);
          border-left: 1px solid rgba(100, 200, 255, 0.2);
          box-shadow: -5px 0 30px rgba(0, 0, 0, 0.5);
        }
        .deck-header { margin-bottom: 20px; }
        .deck-title {
          font-family: 'Orbitron', monospace;
          font-size: 14px; color: #64c8ff;
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-bottom: 15px; opacity: 0.9;
        }
        .system-log {
          font-family: 'Courier New', monospace;
          font-size: 11px; color: #00ff88;
          min-height: 40px; opacity: 1;
          animation: textFlicker 0.5s ease-in-out infinite;
          padding: 10px 14px;
          background: rgba(0, 255, 136, 0.08);
          border-left: 3px solid #00ff88;
          border-radius: 4px;
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.2);
        }
        @keyframes textFlicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .dialogue-stream {
          flex: 1;
          overflow-y: auto;
          margin-bottom: 15px;
          padding-right: 10px;
        }
        .dialogue-stream::-webkit-scrollbar { width: 4px; }
        .dialogue-stream::-webkit-scrollbar-track { background: rgba(100, 200, 255, 0.1); }
        .dialogue-stream::-webkit-scrollbar-thumb { background: rgba(100, 200, 255, 0.4); border-radius: 2px; }
        .message {
          margin-bottom: 25px;
          animation: messageSlideIn 0.4s ease-out;
        }
        @keyframes messageSlideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .message-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .message-avatar {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #64c8ff, #8a2be2);
          border: 1px solid rgba(100, 200, 255, 0.5);
        }
        .message-sender {
          font-size: 12px;
          color: #64c8ff;
          font-weight: 500;
        }
        .message-timestamp {
          font-size: 10px;
          color: rgba(224, 230, 255, 0.4);
          margin-left: auto;
        }
        .message-content {
          padding: 15px 18px;
          background: rgba(100, 200, 255, 0.05);
          border: 1px solid rgba(100, 200, 255, 0.15);
          border-radius: 12px;
          font-size: 14px;
          line-height: 1.7;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        .message.user .message-content {
          background: rgba(138, 43, 226, 0.08);
          border-color: rgba(138, 43, 226, 0.2);
        }
        .message.ai-observation .message-content {
          background: linear-gradient(135deg, rgba(0, 255, 136, 0.08) 0%, rgba(100, 200, 255, 0.05) 100%);
          border-color: rgba(0, 255, 136, 0.25);
          font-style: italic;
          position: relative;
        }
        .message.ai-observation .message-content::before {
          content: '"';
          position: absolute;
          top: -10px; left: 10px;
          font-size: 40px;
          color: rgba(0, 255, 136, 0.3);
          font-family: Georgia, serif;
        }
        .typing-indicator {
          display: flex; gap: 4px;
          padding: 15px 18px;
          background: rgba(100, 200, 255, 0.05);
          border: 1px solid rgba(100, 200, 255, 0.15);
          border-radius: 12px;
          width: fit-content;
        }
        .typing-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #64c8ff;
          animation: typingBounce 1.4s infinite;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-8px); }
        }
        .whisper-field {
          background: rgba(100, 200, 255, 0.03);
          border: 1px solid rgba(100, 200, 255, 0.2);
          border-radius: 16px;
          padding: 15px;
          backdrop-filter: blur(20px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          position: relative;
        }
        .input-prompt {
          font-size: 13px;
          color: rgba(224, 230, 255, 0.5);
          margin-bottom: 12px;
          font-weight: 300;
        }
        .input-area {
          background: transparent;
          border: none;
          color: #e0e6ff;
          font-size: 14px;
          width: 100%;
          resize: none;
          outline: none;
          font-family: 'Noto Sans SC', sans-serif;
          line-height: 1.6;
          min-height: 60px;
          margin-bottom: 15px;
        }
        .input-area::placeholder { color: rgba(224, 230, 255, 0.3); }
        .input-area:disabled { opacity: 0.5; }
        .input-controls {
          display: flex;
          flex-direction: column;
          gap: 12px;
          align-items: flex-start;
          position: relative;
        }
        .input-modes { display: flex; gap: 12px; }
        .mode-button {
          width: 40px; height: 40px;
          border-radius: 10px;
          border: 1px solid rgba(100, 200, 255, 0.3);
          background: rgba(100, 200, 255, 0.05);
          color: #64c8ff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }
        .mode-button.active {
          background: rgba(100, 200, 255, 0.25);
          border-color: rgba(100, 200, 255, 0.8);
          box-shadow: 0 0 20px rgba(100, 200, 255, 0.5);
        }
        .mode-button.active::before {
          content: '';
          position: absolute;
          top: -6px; right: -6px;
          width: 10px; height: 10px;
          background: #00ff88;
          border-radius: 50%;
          border: 2px solid #050814;
          box-shadow: 0 0 15px #00ff88;
          animation: activePulse 1.5s ease-in-out infinite;
        }
        @keyframes activePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
        .mode-button:hover:not(.active) {
          background: rgba(100, 200, 255, 0.15);
          border-color: rgba(100, 200, 255, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(100, 200, 255, 0.3);
        }
        .send-button {
          padding: 10px 24px;
          background: linear-gradient(135deg, #64c8ff, #8a2be2);
          border: none;
          border-radius: 8px;
          color: white;
          font-family: 'Orbitron', monospace;
          font-size: 12px;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          width: 100%;
        }
        .send-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(100, 200, 255, 0.4);
        }
        .evolution-engine {
          position: absolute;
          bottom: 160px;
          left: 20px;
          width: 380px;
          padding: 15px 18px;
          background: rgba(10, 17, 40, 0.7);
          border: 1px solid rgba(100, 200, 255, 0.25);
          border-radius: 10px;
          backdrop-filter: blur(20px);
          z-index: 4;
        }
        .evolution-label {
          font-family: 'Orbitron', monospace;
          font-size: 10px;
          color: #64c8ff;
          letter-spacing: 1.5px;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .dna-helix {
          position: relative;
          height: 10px;
          background: rgba(100, 200, 255, 0.1);
          border-radius: 5px;
          overflow: hidden;
        }
        .dna-progress {
          position: absolute;
          left: 0; top: 0;
          height: 100%;
          background: linear-gradient(90deg, #00ff88 0%, #64c8ff 50%, #8a2be2 100%);
          border-radius: 5px;
          transition: width 1s ease;
          box-shadow: 0 0 15px rgba(100, 200, 255, 0.5);
          animation: dnaPulse 2s ease-in-out infinite;
        }
        @keyframes dnaPulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        .evolution-status {
          font-size: 9px;
          color: rgba(224, 230, 255, 0.6);
          margin-top: 6px;
        }
        .memory-corridor-btn {
          position: absolute;
          top: 30px; right: 30px;
          z-index: 6;
          width: 44px; height: 44px;
          border-radius: 10px;
          border: 1px solid rgba(100, 200, 255, 0.3);
          background: rgba(10, 17, 40, 0.6);
          backdrop-filter: blur(20px);
          color: #64c8ff;
          display: flex;
          align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.3s ease;
        }
        .memory-corridor-btn:hover {
          background: rgba(100, 200, 255, 0.1);
          border-color: rgba(100, 200, 255, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(100, 200, 255, 0.3);
        }
        .reality-label {
          position: absolute;
          bottom: 100px; left: 50%;
          transform: translateX(-50%);
          font-family: 'Orbitron', monospace;
          font-size: 11px;
          color: rgba(100, 200, 255, 0.5);
          letter-spacing: 2.5px;
          z-index: 2;
        }
        .create-avatar-btn {
          position: absolute;
          top: 30px; right: 95px;
          z-index: 6;
          width: 44px; height: 44px;
          border-radius: 10px;
          border: 1px solid rgba(138, 43, 226, 0.4);
          background: rgba(26, 11, 46, 0.6);
          backdrop-filter: blur(20px);
          color: #8a2be2;
          display: flex;
          align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.3s ease;
        }
        .create-avatar-btn:hover {
          background: rgba(138, 43, 226, 0.2);
          border-color: rgba(138, 43, 226, 0.6);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(138, 43, 226, 0.4);
        }
        .genesis-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(5, 8, 20, 0.95);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center; justify-content: center;
        }
        .genesis-container {
          width: 80%;
          max-width: 900px;
          max-height: 85vh;
          overflow-y: auto;
          background: rgba(10, 17, 40, 0.9);
          border: 1px solid rgba(100, 200, 255, 0.3);
          border-radius: 20px;
          padding: 50px;
          backdrop-filter: blur(30px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          position: relative;
        }
        .genesis-close {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 32px; height: 32px;
          border: none;
          background: rgba(100, 200, 255, 0.1);
          color: #64c8ff;
          border-radius: 50%;
          cursor: pointer;
          font-size: 20px;
          line-height: 1;
          transition: all 0.3s ease;
        }
        .genesis-close:hover {
          background: rgba(100, 200, 255, 0.2);
          transform: rotate(90deg);
        }
        .genesis-title {
          font-family: 'Orbitron', monospace;
          font-size: 28px;
          color: #64c8ff;
          letter-spacing: 3px;
          margin-bottom: 10px;
          text-align: center;
        }
        .genesis-subtitle {
          font-size: 14px;
          color: rgba(224, 230, 255, 0.6);
          text-align: center;
          margin-bottom: 40px;
        }
        .genesis-step-indicator {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 40px;
        }
        .step-dot {
          width: 12px; height: 12px;
          border-radius: 50%;
          background: rgba(100, 200, 255, 0.2);
          transition: all 0.3s ease;
        }
        .step-dot.active {
          background: #64c8ff;
          box-shadow: 0 0 20px rgba(100, 200, 255, 0.8);
        }
        .step-dot.completed {
          background: #00ff88;
        }
        .upload-zone {
          border: 2px dashed rgba(100, 200, 255, 0.3);
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          margin-bottom: 20px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .upload-zone:hover {
          border-color: rgba(100, 200, 255, 0.6);
          background: rgba(100, 200, 255, 0.05);
        }
        .upload-zone-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }
        .upload-zone-text {
          color: rgba(224, 230, 255, 0.7);
          font-size: 14px;
        }
        .uploaded-preview {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 20px;
        }
        .preview-item {
          width: 80px; height: 80px;
          border-radius: 8px;
          object-fit: cover;
          border: 1px solid rgba(100, 200, 255, 0.3);
        }
        .genesis-next-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #64c8ff, #8a2be2);
          border: none;
          border-radius: 10px;
          color: white;
          font-family: 'Orbitron', monospace;
          font-size: 14px;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          margin-top: 30px;
        }
        .genesis-next-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(100, 200, 255, 0.4);
        }
        .genesis-next-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .memory-input {
          width: 100%;
          background: rgba(100, 200, 255, 0.05);
          border: 1px solid rgba(100, 200, 255, 0.2);
          border-radius: 8px;
          padding: 15px;
          color: #e0e6ff;
          font-size: 14px;
          font-family: 'Noto Sans SC', sans-serif;
          resize: vertical;
          min-height: 100px;
          margin-bottom: 15px;
        }
        .memory-input::placeholder {
          color: rgba(224, 230, 255, 0.3);
        }
        .memory-list {
          margin-top: 20px;
        }
        .memory-item {
          background: rgba(100, 200, 255, 0.05);
          border: 1px solid rgba(100, 200, 255, 0.2);
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 10px;
          font-size: 13px;
          color: rgba(224, 230, 255, 0.8);
        }
        .personality-options {
          margin-bottom: 20px;
        }
        .personality-question {
          color: rgba(224, 230, 255, 0.8);
          margin-bottom: 10px;
          font-size: 14px;
        }
        .personality-buttons {
          display: flex;
          gap: 10px;
        }
        .personality-btn {
          flex: 1;
          padding: 12px;
          background: rgba(100, 200, 255, 0.05);
          border: 1px solid rgba(100, 200, 255, 0.3);
          border-radius: 8px;
          color: #e0e6ff;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.3s ease;
        }
        .personality-btn:hover {
          background: rgba(100, 200, 255, 0.15);
        }
        .personality-btn.selected {
          background: rgba(100, 200, 255, 0.3);
          border-color: rgba(100, 200, 255, 0.6);
          box-shadow: 0 0 15px rgba(100, 200, 255, 0.3);
        }
        .generating-animation {
          text-align: center;
          padding: 60px 0;
        }
        .generating-spinner {
          width: 80px;
          height: 80px;
          margin: 0 auto 30px;
          border: 3px solid rgba(100, 200, 255, 0.2);
          border-top: 3px solid #64c8ff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .generating-text {
          font-family: 'Orbitron', monospace;
          font-size: 18px;
          color: #64c8ff;
          letter-spacing: 2px;
          animation: textFlicker 1s ease-in-out infinite;
        }
      `}</style>

      <div className="soul-title">
        UPLOADSOUL
        <div className="soul-subtitle">身外化身 · DIGITAL IMMORTALITY</div>
      </div>

      <div className="main-viewport">
        <div className="avatar-container">
          <div className="avatar-figure">
            <div className="avatar-glow" />
            <div className="avatar-core" />
            <div className="avatar-silhouette" />
            <div className="data-streams">
              <div className="data-stream" />
              <div className="data-stream" />
              <div className="data-stream" />
              <div className="data-stream" />
            </div>
            {sparks.map(spark => (
              <div
                key={spark.id}
                className="memory-spark"
                style={{
                  left: `${spark.x}%`,
                  top: `${spark.y}%`,
                  '--tx': `${Math.random() * 200 - 100}px`,
                  '--ty': `${-200 - Math.random() * 100}px`
                }}
              />
            ))}
          </div>
          <div className={`avatar-state-indicator ${avatarState}`}>
            {avatarState === 'listening' && '● 聆听中 / LISTENING'}
            {avatarState === 'thinking' && '◉ 思考中 / THINKING'}
            {avatarState === 'responding' && '◈ 共鸣中 / RESONATING'}
          </div>
        </div>
        <div className="reality-label">REALITY: 数字虚空 / DIGITAL VOID</div>
      </div>

      <button className="memory-corridor-btn" title="记忆回廊">
        <BookOpen size={20} />
      </button>

      <button className="create-avatar-btn" title="创建数字人" onClick={openGenesisModal}>
        <User size={20} />
      </button>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileUpload}
      />

      <div className="interaction-deck">
        <div className="deck-header">
          <div className="deck-title">灵魂日志 / Soul Log</div>
          {systemLog && <div className="system-log">{systemLog}</div>}
        </div>

        <div className="dialogue-stream">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.type}`}>
              <div className="message-header">
                <div className="message-avatar" />
                <span className="message-sender">
                  {msg.type === 'user' ? '你' : msg.type === 'ai-observation' ? '观察日记' : '身外化身'}
                </span>
                <span className="message-timestamp">{msg.timestamp}</span>
              </div>
              <div className="message-content">
                {msg.text}
                {msg.attachment && msg.attachment.startsWith('data:image') && (
                  <img
                    src={msg.attachment}
                    alt="uploaded"
                    style={{
                      maxWidth: '100%',
                      marginTop: '10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(100, 200, 255, 0.2)'
                    }}
                  />
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message ai">
              <div className="message-header">
                <div className="message-avatar" />
                <span className="message-sender">身外化身</span>
              </div>
              <div className="typing-indicator">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          )}
        </div>

        <div className="whisper-field">
          <div className="input-prompt">今天过得怎么样？有什么想告诉未来的自己吗？</div>
          <textarea
            className="input-area"
            placeholder="此刻你在想什么..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={activeInputMode === 'voice'}
          />
          <div className="input-controls">
            <div className="input-modes">
              <button
                className={`mode-button ${activeInputMode === 'voice' ? 'active' : ''}`}
                title="语音输入"
                onClick={handleVoiceInput}
              >
                <Mic size={18} />
              </button>
              <button
                className={`mode-button ${activeInputMode === 'image' ? 'active' : ''}`}
                title="上传照片"
                onClick={handleImageUpload}
              >
                <Camera size={18} />
              </button>
              <button
                className={`mode-button ${activeInputMode === 'text' ? 'active' : ''}`}
                title="文字输入"
                onClick={() => setActiveInputMode('text')}
              >
                <MessageSquare size={18} />
              </button>
            </div>
            <button className="send-button" onClick={handleSendMessage}>
              发送
            </button>
          </div>
        </div>
      </div>

      <div className="evolution-engine">
        <div className="evolution-label">
          <Zap size={12} />
          进化状态 / EVOLUTION STATUS
        </div>
        <div className="dna-helix">
          <div className="dna-progress" style={{ width: `${evolutionProgress}%` }} />
        </div>
        <div className="evolution-status">
          情感模拟拟合度: {evolutionProgress.toFixed(1)}% · 已学习新的对话模式
        </div>

        {/* Storage Quota Display */}
        <div style={{ marginTop: '12px', borderTop: '1px solid rgba(100, 200, 255, 0.1)', paddingTop: '10px' }}>
          <div className="evolution-label">
            存储空间 / STORAGE ({storageUsageMB.toFixed(1)}MB / 100MB)
          </div>
          <div className="dna-helix" style={{ height: '6px' }}>
            <div
              className="dna-progress"
              style={{
                width: `${Math.min((storageUsageMB / 100) * 100, 100)}%`,
                background: storageUsageMB > 90 ? '#ef4444' : 'linear-gradient(90deg, #64c8ff, #8a2be2)'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadSoul;