import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const ReunionSpacePage = () => {
  const [mode, setMode] = useState('chat');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'ancestor',
      text: '孩子，有什么想和爷爷说的吗？虽然我已离开，但我的爱与思念永远陪伴着你。',
      avatar: '李',
      time: '刚刚'
    }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [memorialDialogue, setMemorialDialogue] = useState({
    text: '孩子，又见面了。看到你过得好，我们就放心了。',
    speaker: '李明远',
    active: false
  });
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const chatMessagesRef = useRef(null);

  const responses = [
    { text: "孩子，最近工作还顺利吗？记得劳逸结合，身体最重要。", speaker: "李明远" },
    { text: "爷爷当年也是这样过来的，困难总会过去的。你要相信自己。", speaker: "李明远" },
    { text: "听你这么说，爷爷很欣慰。继续努力，爷爷永远支持你。", speaker: "李明远" },
    { text: "人生就是这样，有起有落。重要的是保持乐观的心态。", speaker: "李明远" },
    { text: "孩子，爷爷虽然不在了，但我的精神会一直陪伴着你。要坚强。", speaker: "李明远" }
  ];

  const memorialDialogues = [
    { text: "孩子，又见面了。看到你过得好，我们就放心了。", speaker: "李明远" },
    { text: "是啊，孩子长大了，都有自己的事业了。", speaker: "王秀英" },
    { text: "记得照顾好自己，不要太劳累。家人永远是最重要的。", speaker: "李明远" },
    { text: "你奶奶说得对。工作再忙，也要抽时间回家看看。", speaker: "李明远" },
    { text: "爷爷奶奶一直在守护着你，为你骄傲。", speaker: "王秀英" }
  ];

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (mode === 'memorial') {
      const timer = setTimeout(() => {
        setMemorialDialogue(prev => ({ ...prev, active: true }));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [mode]);

  const sendMessage = () => {
    const text = chatInput.trim();
    if (!text) return;

    const userMsg = {
      type: 'user',
      text: text,
      avatar: '我',
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput('');

    // Simulate AI Response
    setTimeout(() => {
      const response = responses[Math.floor(Math.random() * responses.length)];
      const aiMsg = {
        type: 'ancestor',
        text: response.text,
        avatar: '李',
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  const triggerDialogue = () => {
    const nextIdx = (dialogueIndex + 1) % memorialDialogues.length;
    const dialogue = memorialDialogues[nextIdx];
    setDialogueIndex(nextIdx);
    setMemorialDialogue({
      text: dialogue.text,
      speaker: dialogue.speaker,
      active: true
    });
  };

  const toggleMic = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Simulate voice recognition
      setTimeout(() => {
        const response = "好孩子，爷爷很想念你。看到你这么孝顺，我们都很欣慰。";
        setMemorialDialogue({
          text: response,
          speaker: "李明远",
          active: true
        });
        setIsRecording(false);
      }, 3000);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="reunion-space-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;700&display=swap');

        .reunion-space-wrapper {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Noto Serif SC', 'STSong', 'Songti SC', 'SimSun', serif;
          background: #000;
          color: #d4af37;
          overflow: hidden;
          width: 100%;
          height: calc(100vh - 80px); /* 适配 Header */
          position: relative;
        }

        /* 顶部控制栏 */
        .reunion-top-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: rgba(10, 10, 10, 0.9);
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          z-index: 1000;
        }

        .reunion-top-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .reunion-back-btn {
          color: #d4af37;
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .reunion-back-btn:hover {
          color: #f4d03f;
        }

        .reunion-member-info {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .reunion-member-avatar-small {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: radial-gradient(circle, #d4af37, #8b7355);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          color: #000;
          font-weight: bold;
          border: 1.5px solid #d4af37;
        }

        .reunion-member-name-small {
          font-size: 1.1rem;
          letter-spacing: 0.1rem;
        }

        .reunion-member-dates-small {
          font-size: 0.75rem;
          color: #8b7355;
        }

        .reunion-mode-switch {
          display: flex;
          gap: 0.8rem;
        }

        .reunion-mode-btn {
          padding: 0.4rem 1.2rem;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #d4af37;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.85rem;
        }

        .reunion-mode-btn.active {
          background: rgba(212, 175, 55, 0.25);
          border-color: #d4af37;
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
        }

        /* 主容器 */
        .reunion-main-container {
          position: relative;
          width: 100%;
          height: 100%;
          padding-top: 60px;
        }

        /* 日常模式 */
        .reunion-chat-mode {
          display: flex;
          width: 100%;
          height: 100%;
        }

        .reunion-chat-mode.hidden { display: none; }

        .reunion-scene-preview {
          flex: 1;
          background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
          position: relative;
          overflow: hidden;
        }

        .reunion-scene-background {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0.2;
          background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect fill="%23000" width="800" height="600"/><path fill="%23d4af37" opacity="0.1" d="M0,300 Q200,200 400,300 T800,300 L800,600 L0,600 Z"/></svg>');
          background-size: cover;
          background-position: center;
        }

        .reunion-ancestor-figure {
          position: absolute;
          bottom: 10%;
          left: 50%;
          transform: translateX(-50%);
          width: 180px;
          height: 280px;
          background: radial-gradient(ellipse at center, rgba(212, 175, 55, 0.2), transparent);
          border-radius: 50% 50% 0 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding-top: 1.5rem;
        }

        .reunion-ancestor-avatar {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: radial-gradient(circle, #d4af37, #8b7355);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          color: #000;
          border: 3px solid #d4af37;
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.7);
          margin-bottom: 0.8rem;
        }

        .reunion-status-indicator {
          color: #8b7355;
          font-size: 0.8rem;
          letter-spacing: 0.1rem;
        }

        .reunion-chat-panel {
          width: 420px;
          background: rgba(10, 10, 10, 0.98);
          border-left: 1px solid rgba(212, 175, 55, 0.2);
          display: flex;
          flex-direction: column;
        }

        .reunion-chat-header {
          padding: 1.2rem;
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
          text-align: center;
        }

        .reunion-chat-header h2 { font-size: 1.3rem; margin-bottom: 0.4rem; }
        .reunion-chat-header p { color: #8b7355; font-size: 0.85rem; }

        .reunion-chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .reunion-message {
          display: flex;
          gap: 0.8rem;
          animation: reunionMessageAppear 0.3s ease-out;
        }

        @keyframes reunionMessageAppear {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .reunion-message.user { flex-direction: row-reverse; }

        .reunion-message-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .reunion-message-avatar.ancestor {
          background: radial-gradient(circle, #d4af37, #8b7355);
          color: #000;
          border: 1.5px solid #d4af37;
        }

        .reunion-message-avatar.user {
          background: radial-gradient(circle, #4CAF50, #2E7D32);
          color: #fff;
        }

        .reunion-message-content {
          max-width: 80%;
          background: rgba(30, 30, 30, 0.7);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 10px;
          padding: 0.8rem 1.2rem;
          line-height: 1.6;
          font-size: 0.9rem;
        }

        .reunion-message.user .reunion-message-content {
          background: rgba(76, 175, 80, 0.15);
          border-color: rgba(76, 175, 80, 0.4);
        }

        .reunion-message-time {
          font-size: 0.7rem;
          color: #666;
          margin-top: 0.4rem;
        }

        .reunion-chat-input-area {
          padding: 1.2rem;
          border-top: 1px solid rgba(212, 175, 55, 0.1);
        }

        .reunion-input-wrapper { display: flex; gap: 0.8rem; }

        .reunion-chat-input {
          flex: 1;
          background: rgba(30, 30, 30, 0.7);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 6px;
          padding: 0.8rem;
          color: #d4af37;
          font-size: 0.9rem;
          font-family: inherit;
          resize: none;
        }

        .reunion-chat-input:focus { outline: none; border-color: #d4af37; }

        .reunion-send-btn {
          width: 50px;
          background: linear-gradient(135deg, #d4af37, #f4d03f);
          border: none;
          border-radius: 6px;
          color: #000;
          font-size: 1.2rem;
          cursor: pointer;
        }

        /* 纪念模式 */
        .reunion-memorial-mode {
          display: none;
          width: 100%;
          height: 100%;
          position: relative;
          background: #000;
        }

        .reunion-memorial-mode.active { display: block; }

        .reunion-memorial-scene {
          position: absolute;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, #0a0a0a, #1a1015);
          overflow: hidden;
        }

        .reunion-memorial-background {
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0.3;
          background-image: radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.1), transparent 60%);
        }

        .reunion-candle-lights {
          position: absolute;
          bottom: 10%;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 2.5rem;
        }

        .reunion-candle {
          width: 16px;
          height: 60px;
          background: linear-gradient(to top, #8b7355, #d4af37);
          border-radius: 1.5px 1.5px 0 0;
          position: relative;
        }

        .reunion-candle::before {
          content: '';
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 12px;
          height: 15px;
          background: radial-gradient(ellipse, #ffd700, #ff8c00);
          border-radius: 50% 50% 0 0;
          box-shadow: 0 0 20px #ff8c00, 0 0 40px rgba(255, 140, 0, 0.4);
          animation: reunionFlicker 2s ease-in-out infinite;
        }

        @keyframes reunionFlicker {
          0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
          50% { opacity: 0.8; transform: translateX(-50%) scale(0.9); }
        }

        .reunion-ancestors-group {
          position: absolute;
          bottom: 25%;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 3.5rem;
          align-items: flex-end;
        }

        .reunion-hologram-figure {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: reunionHoloGlow 4s ease-in-out infinite;
        }

        @keyframes reunionHoloGlow {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 10px rgba(212,175,55,0.2)); }
          50% { filter: brightness(1.2) drop-shadow(0 0 25px rgba(212,175,55,0.5)); }
        }

        .reunion-hologram-avatar {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background: radial-gradient(circle, #d4af37, rgba(212, 175, 55, 0.2));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3.5rem;
          color: #000;
          border: 2px solid #d4af37;
          box-shadow: 0 0 50px rgba(212, 175, 55, 0.8);
          position: relative;
          margin-bottom: 0.8rem;
        }

        .reunion-hologram-avatar::after {
          content: '';
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          border: 1.5px solid rgba(212, 175, 55, 0.2);
          animation: reunionRipple 3s ease-out infinite;
        }

        @keyframes reunionRipple {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        .reunion-hologram-name {
          font-size: 1.2rem;
          letter-spacing: 0.15rem;
          text-shadow: 0 0 10px rgba(212, 175, 55, 0.6);
          margin-bottom: 0.3rem;
        }

        .reunion-hologram-relation { font-size: 0.85rem; color: #8b7355; }

        .reunion-memorial-dialogue {
          position: absolute;
          bottom: 12%;
          left: 50%;
          transform: translateX(-50%);
          width: 85%;
          max-width: 700px;
          background: rgba(10, 10, 10, 0.9);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          backdrop-filter: blur(8px);
          opacity: 0;
          visibility: hidden;
          transition: all 0.5s ease;
        }

        .reunion-memorial-dialogue.active {
          opacity: 1;
          visibility: visible;
          transform: translate(-50%, -15px);
        }

        .reunion-dialogue-text { font-size: 1.2rem; line-height: 1.8; color: #d4af37; margin-bottom: 0.8rem; }
        .reunion-dialogue-speaker { font-size: 0.9rem; color: #8b7355; }

        .reunion-memorial-controls {
          position: absolute;
          bottom: 2.5rem;
          right: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .reunion-control-btn {
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #d4af37;
          padding: 0.7rem 1.4rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s;
        }

        .reunion-control-btn:hover { background: rgba(212, 175, 55, 0.2); }

        .reunion-mic-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d4af37, #f4d03f);
          border: none;
          color: #000;
          font-size: 1.4rem;
          cursor: pointer;
          align-self: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reunion-mic-btn.active {
          animation: reunionPulseMic 1.2s ease-in-out infinite;
        }

        @keyframes reunionPulseMic {
          0%, 100% { box-shadow: 0 0 15px rgba(212, 175, 55, 0.5); }
          50% { box-shadow: 0 0 30px rgba(212, 175, 55, 0.9); }
        }

        .reunion-music-info {
          position: absolute;
          bottom: 2.5rem;
          left: 2.5rem;
          color: #666;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        @media (max-width: 1024px) {
          .reunion-chat-panel { width: 350px; }
          .reunion-ancestors-group { gap: 1.5rem; }
          .reunion-hologram-avatar { width: 100px; height: 100px; font-size: 2.5rem; }
        }
      `}</style>

      {/* 顶部控制栏 */}
      <div className="reunion-top-bar">
        <div className="reunion-top-left">
          <Link to="/digital-rebirth/family-galaxy" className="reunion-back-btn">
            <span>◀</span> 返回
          </Link>
          <div className="reunion-member-info">
            <div className="reunion-member-avatar-small">李</div>
            <div>
              <div className="reunion-member-name-small">李明远</div>
              <div className="reunion-member-dates-small">1930 - 2015</div>
            </div>
          </div>
        </div>
        <div className="reunion-mode-switch">
          <button
            className={`reunion-mode-btn ${mode === 'chat' ? 'active' : ''}`}
            onClick={() => setMode('chat')}
          >
            日常对话
          </button>
          <button
            className={`reunion-mode-btn ${mode === 'memorial' ? 'active' : ''}`}
            onClick={() => setMode('memorial')}
          >
            家族大典
          </button>
        </div>
      </div>

      <div className="reunion-main-container">
        {/* 日常模式 */}
        <div className={`reunion-chat-mode ${mode === 'memorial' ? 'hidden' : ''}`}>
          <div className="reunion-scene-preview">
            <div className="reunion-scene-background"></div>
            <div className="reunion-ancestor-figure">
              <div className="reunion-ancestor-avatar">李</div>
              <div className="reunion-status-indicator">● 在线</div>
            </div>
          </div>
          <div className="reunion-chat-panel">
            <div className="reunion-chat-header">
              <h2>与爷爷对话</h2>
              <p>您可以随时留言，AI 会以他的口吻回复</p>
            </div>
            <div className="reunion-chat-messages" ref={chatMessagesRef}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`reunion-message ${msg.type === 'user' ? 'user' : ''}`}>
                  <div className={`reunion-message-avatar ${msg.type}`}>
                    {msg.avatar}
                  </div>
                  <div className="reunion-message-content">
                    {msg.text}
                    <div className="reunion-message-time">{msg.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="reunion-chat-input-area">
              <div className="reunion-input-wrapper">
                <textarea
                  className="reunion-chat-input"
                  rows="2"
                  placeholder="输入您想说的话..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <button className="reunion-send-btn" onClick={sendMessage}>
                  ➤
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 家族大典模式 */}
        <div className={`reunion-memorial-mode ${mode === 'memorial' ? 'active' : ''}`}>
          <div className="reunion-memorial-scene">
            <div className="reunion-memorial-background"></div>

            <div className="reunion-candle-lights">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="reunion-candle"></div>)}
            </div>

            <div className="reunion-ancestors-group">
              <div className="reunion-hologram-figure" style={{ animationDelay: '0s' }}>
                <div className="reunion-hologram-avatar">李</div>
                <div className="reunion-hologram-name">李明远</div>
                <div className="reunion-hologram-relation">祖父</div>
              </div>
              <div className="reunion-hologram-figure" style={{ animationDelay: '1s' }}>
                <div className="reunion-hologram-avatar">王</div>
                <div className="reunion-hologram-name">王秀英</div>
                <div className="reunion-hologram-relation">祖母</div>
              </div>
            </div>

            <div className={`reunion-memorial-dialogue ${memorialDialogue.active ? 'active' : ''}`}>
              <div className="reunion-dialogue-text">
                {memorialDialogue.text}
              </div>
              <div className="reunion-dialogue-speaker">— {memorialDialogue.speaker}</div>
            </div>

            <div className="reunion-memorial-controls">
              <button className="reunion-control-btn" onClick={triggerDialogue}>触发对话</button>
              <button
                className={`reunion-mic-btn ${isRecording ? 'active' : ''}`}
                onClick={toggleMic}
              >
                {isRecording ? '⏸' : '🎤'}
              </button>
              <button className="reunion-control-btn" onClick={() => alert('拍摄合影功能开发中')}>拍摄合影</button>
            </div>

            <div className="reunion-music-info">
              <span>🎵 背景音乐：《思念》</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReunionSpacePage;