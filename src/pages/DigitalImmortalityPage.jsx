import React, { useState, useEffect, useRef } from 'react';
import { Mic, Camera, MessageSquare, BookOpen, Zap, Sparkles, Eye } from 'lucide-react';

const DigitalImmortalityPage = () => {
  const [messages, setMessages] = useState([
    {
      type: 'ai-observation',
      text: '今天你似乎对那只流浪猫很在意，你的语气变得很温柔。我记住了，原来我们内心深处是柔软的。—— 你的数字化身',
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
  const canvasRef = useRef(null);

  // Particle system for background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', updateSize);
    updateSize();

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

        // Connect nearby particles
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

    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationId);
    }
  }, []);

  // Memory spark animation
  const createSpark = () => {
    const id = Date.now();
    setSparks(prev => [...prev, { id, x: Math.random() * 100, y: Math.random() * 100 }]);
    setTimeout(() => {
      setSparks(prev => prev.filter(s => s.id !== id));
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input, timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAvatarState('thinking');

    // Simulate AI processing
    setTimeout(() => {
      setSystemLog('> 正在检索核心记忆块: "童年的外婆"...');
      setTimeout(() => {
        setSystemLog('> 正在模拟情感反应: "怀念 + 温暖"...');
        createSpark();
        setGlowIntensity(0.9);

        setTimeout(() => {
          setIsTyping(true);
          setAvatarState('responding');
          setTimeout(() => {
            const aiResponse = {
              type: 'ai',
              text: '我在听。这种感觉我记住了。每个人心中都有那样一个特殊的地方，是吗？',
              timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
            setSystemLog('');
            setAvatarState('listening');
            setGlowIntensity(0.5);
            setEvolutionProgress(prev => Math.min(prev + 0.5, 100));
          }, 2000);
        }, 1000);
      }, 800);
    }, 500);
  };

  return (
    <div className="uploadsoul-container pt-20">
      <canvas ref={canvasRef} className="particle-canvas" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Noto+Sans+SC:wght@300;400;500&display=swap');
        
        .uploadsoul-container {
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #050814 0%, #0a1128 50%, #1a0b2e 100%);
          color: #e0e6ff;
          font-family: 'Noto Sans SC', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .particle-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .main-viewport {
          position: absolute;
          left: 0;
          top: 0;
          width: 65%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .avatar-container {
          position: relative;
          width: 400px;
          height: 500px;
          perspective: 1000px;
        }

        .avatar-figure {
          position: relative;
          width: 100%;
          height: 100%;
          animation: avatarFloat 6s ease-in-out infinite;
        }

        @keyframes avatarFloat {
          0%, 100% { transform: translateY(0px) rotateY(-5deg); }
          50% { transform: translateY(-15px) rotateY(5deg); }
        }

        .avatar-core {
          position: absolute;
          width: 180px;
          height: 180px;
          left: 50%;
          top: 40%;
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
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, 
            rgba(100, 200, 255, ${glowIntensity * 0.3}) 0%,
            rgba(138, 43, 226, ${glowIntensity * 0.2}) 40%,
            transparent 70%);
          filter: blur(50px);
          transition: all 0.8s ease;
        }

        .avatar-silhouette {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 350px;
          background: linear-gradient(180deg, 
            rgba(100, 200, 255, 0.15) 0%,
            rgba(138, 43, 226, 0.1) 50%,
            rgba(0, 255, 136, 0.05) 100%);
          clip-path: polygon(
            30% 0%, 70% 0%,
            75% 10%, 80% 25%, 80% 35%,
            90% 40%, 90% 60%, 85% 75%,
            70% 85%, 65% 95%, 50% 100%,
            35% 95%, 30% 85%, 15% 75%,
            10% 60%, 10% 40%, 20% 35%,
            20% 25%, 25% 10%
          );
          filter: blur(2px);
          border: 1px solid rgba(100, 200, 255, 0.3);
          box-shadow: 
            0 0 30px rgba(100, 200, 255, 0.4),
            inset 0 0 30px rgba(138, 43, 226, 0.2);
        }

        .data-streams {
          position: absolute;
          inset: 0;
          overflow: hidden;
          opacity: 0.7;
        }

        .data-stream {
          position: absolute;
          width: 2px;
          height: 100px;
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
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ffd700;
          box-shadow: 0 0 20px #ffd700;
          animation: sparkFly 2s ease-out forwards;
          pointer-events: none;
        }

        @keyframes sparkFly {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(0);
            opacity: 0;
          }
        }

        .avatar-state-indicator {
          position: absolute;
          bottom: -50px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Orbitron', monospace;
          font-size: 12px;
          color: #64c8ff;
          letter-spacing: 3px;
          text-transform: uppercase;
          opacity: 0.6;
        }

        .interaction-deck {
          position: absolute;
          right: 0;
          top: 0;
          width: 35%;
          height: 100%;
          z-index: 3;
          display: flex;
          flex-direction: column;
          padding: 100px 30px 40px;
          backdrop-filter: blur(20px);
          background: linear-gradient(135deg, rgba(10, 17, 40, 0.4) 0%, rgba(26, 11, 46, 0.3) 100%);
          border-left: 1px solid rgba(100, 200, 255, 0.2);
          box-shadow: -5px 0 30px rgba(0, 0, 0, 0.5);
        }

        .deck-header {
          margin-bottom: 30px;
        }

        .deck-title {
          font-family: 'Orbitron', monospace;
          font-size: 14px;
          color: #64c8ff;
          letter-spacing: 4px;
          text-transform: uppercase;
          margin-bottom: 10px;
          opacity: 0.8;
        }

        .system-log {
          font-family: 'Courier New', monospace;
          font-size: 11px;
          color: #00ff88;
          min-height: 20px;
          opacity: 0.7;
          animation: textFlicker 0.3s ease-in-out;
        }

        @keyframes textFlicker {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        .dialogue-stream {
          flex: 1;
          overflow-y: auto;
          margin-bottom: 20px;
          padding-right: 10px;
        }

        .dialogue-stream::-webkit-scrollbar {
          width: 4px;
        }

        .dialogue-stream::-webkit-scrollbar-track {
          background: rgba(100, 200, 255, 0.1);
        }

        .dialogue-stream::-webkit-scrollbar-thumb {
          background: rgba(100, 200, 255, 0.4);
          border-radius: 2px;
        }

        .message {
          margin-bottom: 25px;
          animation: messageSlideIn 0.4s ease-out;
        }

        @keyframes messageSlideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .message-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .message-avatar {
          width: 20px;
          height: 20px;
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

        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 15px 18px;
          background: rgba(100, 200, 255, 0.05);
          border: 1px solid rgba(100, 200, 255, 0.15);
          border-radius: 12px;
          width: fit-content;
        }

        .typing-dot {
          width: 6px;
          height: 6px;
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
          padding: 20px;
          backdrop-filter: blur(20px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
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
          min-height: 80px;
          margin-bottom: 15px;
        }

        .input-area::placeholder {
          color: rgba(224, 230, 255, 0.3);
        }

        .input-controls {
          display: flex;
          gap: 12px;
          justify-content: space-between;
          align-items: center;
        }

        .input-modes {
          display: flex;
          gap: 12px;
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
        }

        .send-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(100, 200, 255, 0.4);
        }

        .evolution-engine {
          position: absolute;
          bottom: 30px;
          left: 30px;
          right: 30px;
          padding: 20px;
          background: rgba(10, 17, 40, 0.6);
          border: 1px solid rgba(100, 200, 255, 0.2);
          border-radius: 12px;
          backdrop-filter: blur(20px);
          z-index: 4;
        }

        .evolution-label {
          font-family: 'Orbitron', monospace;
          font-size: 11px;
          color: #64c8ff;
          letter-spacing: 2px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dna-helix {
          position: relative;
          height: 12px;
          background: rgba(100, 200, 255, 0.1);
          border-radius: 6px;
          overflow: hidden;
        }

        .dna-progress {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background: linear-gradient(90deg, 
            #00ff88 0%, 
            #64c8ff 50%, 
            #8a2be2 100%);
          border-radius: 6px;
          transition: width 1s ease;
          box-shadow: 0 0 20px rgba(100, 200, 255, 0.6);
          animation: dnaPulse 2s ease-in-out infinite;
        }

        @keyframes dnaPulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        .evolution-status {
          font-size: 10px;
          color: rgba(224, 230, 255, 0.6);
          margin-top: 8px;
        }

        .memory-corridor-btn {
          position: absolute;
          top: 100px;
          right: 40px;
          z-index: 5;
          width: 50px;
          height: 50px;
          border-radius: 12px;
          border: 1px solid rgba(100, 200, 255, 0.3);
          background: rgba(10, 17, 40, 0.6);
          backdrop-filter: blur(20px);
          color: #64c8ff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .reality-label {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Orbitron', monospace;
          font-size: 10px;
          color: rgba(100, 200, 255, 0.5);
          letter-spacing: 2px;
          z-index: 2;
        }
      `}</style>

      {/* Main Viewport - Avatar */}
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
          <div className="avatar-state-indicator">
            {avatarState === 'listening' && '● LISTENING'}
            {avatarState === 'thinking' && '◉ THINKING'}
            {avatarState === 'responding' && '◈ RESONATING'}
          </div>
        </div>
        <div className="reality-label">REALITY: 数字虚空 / DIGITAL VOID</div>
      </div>

      {/* Memory Corridor Button */}
      <button className="memory-corridor-btn" title="记忆回廊">
        <BookOpen size={20} />
      </button>

      {/* Interaction Deck */}
      <div className="interaction-deck">
        <div className="deck-header">
          <div className="deck-title">灵魂日志 / Soul Log</div>
          <div className="system-log">{systemLog}</div>
        </div>

        <div className="dialogue-stream">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.type}`}>
              <div className="message-header">
                <div className="message-avatar" />
                <span className="message-sender">
                  {msg.type === 'user' ? '你' : msg.type === 'ai-observation' ? '观察日记' : '数字化身'}
                </span>
                <span className="message-timestamp">{msg.timestamp}</span>
              </div>
              <div className="message-content">{msg.text}</div>
            </div>
          ))}
          {isTyping && (
            <div className="message ai">
              <div className="message-header">
                <div className="message-avatar" />
                <span className="message-sender">数字化身</span>
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
          />
          <div className="input-controls">
            <div className="input-modes">
              <button className="p-2 text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-colors" title="语音输入">
                <Mic size={18} />
              </button>
              <button className="p-2 text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-colors" title="上传照片">
                <Camera size={18} />
              </button>
              <button className="p-2 text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-colors" title="文字输入">
                <MessageSquare size={18} />
              </button>
            </div>
            <button className="send-button" onClick={handleSendMessage}>
              发送
            </button>
          </div>
        </div>
      </div>

      {/* Evolution Engine */}
      <div className="evolution-engine">
        <div className="evolution-label">
          <Zap size={14} />
          进化状态 / EVOLUTION STATUS
        </div>
        <div className="dna-helix">
          <div className="dna-progress" style={{ width: `${evolutionProgress}%` }} />
        </div>
        <div className="evolution-status">
          情感模拟拟合度: {evolutionProgress.toFixed(1)}% · 已学习新的对话模式
        </div>
      </div>
    </div>
  );
};

export default DigitalImmortalityPage;