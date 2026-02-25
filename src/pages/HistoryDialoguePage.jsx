import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';

const HistoryDialoguePage = () => {
  const { id } = useParams();
  const [currentScene, setCurrentScene] = useState('poetry');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  // 历史人物数据
  const sagesData = {
    '1': { name: '李白', initial: '李', period: '701-762', title: '诗仙', field: '诗人', greeting: '来者何人？能于此月夜江畔相遇，当是有缘之士。尔欲与吾言何事？' },
    '2': { name: '苏格拉底', initial: '苏', period: '公元前469-399', title: '哲学家', field: '哲学家', greeting: '陌生人，欢迎。你是在寻求智慧，还是在寻求问题的答案？' },
    '3': { name: '爱因斯坦', initial: '爱', period: '1879-1955', title: '物理学家', field: '物理学家', greeting: '你好。想象力比知识更重要。你今天想到了什么有趣的思维实验吗？' },
    '4': { name: '孔子', initial: '孔', period: '公元前551-479', title: '至圣先师', field: '思想家', greeting: '有朋自远方来，不亦乐乎？不知小友今日有何指教？' },
    '5': { name: '杜甫', initial: '杜', period: '712-770', title: '诗圣', field: '诗人', greeting: '感时花溅泪，恨别鸟惊心。在这乱世浮沉中，你我有缘相会，实属难得。' }
  };

  const currentSage = sagesData[id] || sagesData['1'];

  // 对话响应库
  const responses = {
    '李白': [
      "此言甚妙！吾闻之，不禁想起当年月下独酌之景。举杯邀明月，对影成三人。汝可知此中滋味？",
      "哈哈！痛快！人生得意须尽欢，莫使金樽空对月。尔今所言，正合吾意。",
      "汝之所问，倒是新奇。若吾当年有此等见识，定能再添几首好诗！",
      "妙哉妙哉！此等奇思，恰似天上白云，自由飘荡。吾甚喜之。",
      "尔言及此，让吾想起故友。人生在世不称意，明朝散发弄扁舟啊！"
    ],
    '孔子': [
      "善哉！君子和而不同，小人同而不和。汝之见解，颇有见地。",
      "学而时习之，不亦说乎？汝今所问，正是好学之表现。",
      "三人行，必有我师焉。汝今日之问，亦让为师获益良多。",
      "知之为知之，不知为不知，是知也。汝之诚实，甚为可贵。",
      "己所不欲，勿施于人。汝能思及此，已是仁者之心。"
    ],
    'default': [
      "汝之所言，颇有见地。让我深思。",
      "此问甚好，值得细细思量。",
      "有趣！在我那个年代，未曾有人如此发问。",
      "汝之思想，超越时代。若当年有此见识，该有多好。",
      "听君一席话，胜读十年书。感谢汝的分享。"
    ]
  };

  useEffect(() => {
    // 初始化欢迎语
    setMessages([
      {
        type: 'sage',
        text: currentSage.greeting,
        time: '刚刚'
      }
    ]);
  }, [id, currentSage.greeting]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    const text = chatInput.trim();
    if (!text) return;

    const userMsg = {
      type: 'user',
      text: text,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput('');

    // AI回复
    setTimeout(() => {
      const responseList = responses[currentSage.name] || responses['default'];
      const response = responseList[Math.floor(Math.random() * responseList.length)];

      const aiMsg = {
        type: 'sage',
        text: response,
        time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  return (
    <div className="history-dialogue-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;700&display=swap');

        .history-dialogue-wrapper {
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
        .dialogue-top-bar {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: rgba(10, 10, 10, 0.95);
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          z-index: 1000;
        }

        .dialogue-top-left {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .history-back-btn {
          color: #d4af37;
          text-decoration: none;
          font-size: 0.85rem;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        @media (min-width: 768px) {
          .history-back-btn {
            font-size: 0.9rem;
          }
        }
        .history-back-btn:hover { color: #f4d03f; }

        .top-sage-info {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .top-sage-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: radial-gradient(circle, #d4af37, #8b7355);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          color: #000;
          font-weight: bold;
          border: 1.5px solid #d4af37;
        }

        .top-sage-details h3 { font-size: 1.1rem; margin: 0; letter-spacing: 0.1rem; }
        .top-sage-details p { font-size: 0.75rem; color: #8b7355; margin: 0; }

        .scene-controls {
          display: flex;
          gap: 0.4rem;
          overflow-x: auto;
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .scene-controls::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }

        @media (min-width: 768px) {
          .scene-controls {
            gap: 0.8rem;
            overflow-x: visible;
          }
        }

        .scene-control-btn {
          padding: 0.3rem 0.6rem;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #d4af37;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.75rem;
          white-space: nowrap;
        }

        @media (min-width: 768px) {
          .scene-control-btn {
             padding: 0.4rem 1.2rem;
             font-size: 0.85rem;
          }
        }

        .scene-control-btn.active { 
          background: rgba(212, 175, 55, 0.25); 
          border-color: #d4af37; 
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.3);
        }

        /* 主容器 */
        .dialogue-main-container {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          padding-top: 60px;
        }

        @media (min-width: 900px) {
          .dialogue-main-container {
            flex-direction: row;
          }
        }

        /* 场景区域 */
        .dialogue-scene-area {
          flex: 1;
          position: relative;
          overflow: hidden;
          background: #000;
        }

        .scene-layer {
          position: absolute;
          inset: 0;
          transition: opacity 0.8s ease;
          opacity: 0;
          visibility: hidden;
        }
        .scene-layer.active {
          opacity: 1;
          visibility: visible;
        }

        .scene-bg-image {
          position: absolute;
          inset: 0;
          opacity: 0.3;
          background-size: cover;
          background-position: center;
        }

        .bg-poetry { background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><circle cx="650" cy="100" r="60" fill="%23f4d03f" opacity="0.6"/><path d="M 0 400 Q 200 350 400 380 T 800 400 L 800 600 L 0 600 Z" fill="%23d4af37" opacity="0.1"/></svg>'); }
        .bg-philosophy { background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect x="100" y="100" width="40" height="400" fill="%23d4af37" opacity="0.1"/><rect x="660" y="100" width="40" height="400" fill="%23d4af37" opacity="0.1"/><circle cx="400" cy="300" r="150" stroke="%23d4af37" stroke-width="1" fill="none" opacity="0.1"/></svg>'); }
        .bg-science { background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><rect x="50" y="50" width="500" height="350" fill="none" stroke="%23d4af37" stroke-width="2" opacity="0.1"/><path d="M 100 300 Q 275 250 450 300" stroke="%23d4af37" stroke-width="1" fill="none" opacity="0.15"/></svg>'); }

        .scene-poetry { background: linear-gradient(135deg, #0a0a15, #151520); }
        .scene-philosophy { background: linear-gradient(135deg, #0a0a0a, #1a1a1a); }
        .scene-science { background: linear-gradient(135deg, #050510, #101020); }

        .scene-sage-figure {
          position: absolute;
          bottom: 10%;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .scene-sage-avatar-large {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: radial-gradient(circle, #d4af37, rgba(212, 175, 55, 0.2));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          color: #000;
          border: 3px solid #d4af37;
          box-shadow: 0 0 40px rgba(212, 175, 55, 0.6);
          margin-bottom: 0.8rem;
          animation: historySagePulse 4s ease-in-out infinite;
        }

        @media (min-width: 768px) {
          .scene-sage-avatar-large {
            width: 160px;
            height: 160px;
            font-size: 4rem;
            margin-bottom: 1.2rem;
          }
        }

        @keyframes historySagePulse {
          0%, 100% { transform: scale(1); filter: brightness(1) drop-shadow(0 0 10px rgba(212,175,55,0.3)); }
          50% { transform: scale(1.03); filter: brightness(1.2) drop-shadow(0 0 25px rgba(212,175,55,0.7)); }
        }

        .scene-sage-name {
          font-size: 1.4rem;
          letter-spacing: 0.2rem;
          text-shadow: 0 0 15px rgba(212, 175, 55, 0.6);
          margin-bottom: 0.3rem;
        }

        @media (min-width: 768px) {
          .scene-sage-name {
            font-size: 1.8rem;
            letter-spacing: 0.3rem;
          }
        }

        .scene-sage-title {
          font-size: 0.85rem;
          color: #8b7355;
          letter-spacing: 0.15rem;
        }

        @media (min-width: 768px) {
          .scene-sage-title {
            font-size: 0.95rem;
            letter-spacing: 0.2rem;
          }
        }

        .ambient-audio-note {
          position: absolute;
          bottom: 1.5rem;
          left: 1.5rem;
          font-size: 0.8rem;
          color: #555;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        /* 对话区 */
        .dialogue-chat-panel {
          flex: 1;
          background: rgba(10, 10, 10, 0.98);
          border-top: 1px solid rgba(212, 175, 55, 0.2);
          display: flex;
          flex-direction: column;
          z-index: 10;
        }

        @media (min-width: 900px) {
          .dialogue-chat-panel {
            width: 440px;
            flex: none;
            border-top: none;
            border-left: 1px solid rgba(212, 175, 55, 0.2);
          }
        }

        .chat-panel-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
          text-align: center;
        }

        .chat-panel-header h2 { font-size: 1.4rem; margin-bottom: 0.5rem; }
        .chat-panel-header p { font-size: 0.85rem; color: #8b7355; line-height: 1.5; }

        .chat-messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .chat-message-item {
          display: flex;
          gap: 0.8rem;
          animation: chatMsgFadeIn 0.3s ease-out;
        }

        @keyframes chatMsgFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .chat-message-item.user { flex-direction: row-reverse; }

        .chat-avatar-circle {
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
        .chat-avatar-circle.sage {
          background: radial-gradient(circle, #d4af37, #8b7355);
          color: #000;
          border: 1.5px solid #d4af37;
        }
        .chat-avatar-circle.user {
          background: radial-gradient(circle, #4CAF50, #2E7D32);
          color: #fff;
        }

        .chat-msg-bubble {
          max-width: 80%;
          background: rgba(30, 30, 30, 0.75);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 10px;
          padding: 0.8rem 1rem;
          line-height: 1.6;
          font-size: 0.93rem;
          position: relative;
        }
        .chat-message-item.user .chat-msg-bubble { 
          background: rgba(76, 175, 80, 0.1);
          border-color: rgba(76, 175, 80, 0.3);
        }

        .chat-msg-time {
          font-size: 0.7rem;
          color: #555;
          margin-top: 0.4rem;
        }

        .chat-input-wrapper {
          padding: 1.2rem;
          border-top: 1px solid rgba(212, 175, 55, 0.1);
        }

        .chat-input-box {
          display: flex;
          gap: 0.7rem;
        }

        .chat-text-area {
          flex: 1;
          background: rgba(40, 40, 40, 0.7);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 6px;
          padding: 0.8rem;
          color: #d4af37;
          font-size: 0.95rem;
          font-family: inherit;
          resize: none;
          min-height: 50px;
          max-height: 120px;
        }
        .chat-text-area:focus { outline: none; border-color: #d4af37; }

        .chat-send-btn {
          width: 54px;
          background: linear-gradient(135deg, #d4af37, #f4d03f);
          border: none;
          border-radius: 6px;
          color: #000;
          font-size: 1.3rem;
          cursor: pointer;
          transition: 0.2s;
        }
        .chat-send-btn:hover { filter: brightness(1.1); transform: scale(1.02); }

        @media (max-width: 900px) {
          .ambient-audio-note { font-size: 0.7rem; bottom: 0.8rem; left: 0.8rem; }
          .chat-panel-header { padding: 1rem; }
          .chat-panel-header h2 { font-size: 1.2rem; }
          .chat-messages-container { padding: 1rem; gap: 1rem; }
        }
      `}</style>

      {/* 顶部控制栏 */}
      <div className="dialogue-top-bar">
        <div className="dialogue-top-left">
          <Link to="/digital-rebirth/history-hall" className="history-back-btn">
            <span>◀</span> 返回
          </Link>
          <div className="top-sage-info">
            <div className="top-sage-avatar">{currentSage.initial}</div>
            <div className="top-sage-details">
              <h3>{currentSage.name}</h3>
              <p>{currentSage.period} · {currentSage.field}</p>
            </div>
          </div>
        </div>
        <div className="scene-controls">
          <button className={`scene-control-btn ${currentScene === 'poetry' ? 'active' : ''}`} onClick={() => setCurrentScene('poetry')}>月下江边</button>
          <button className={`scene-control-btn ${currentScene === 'philosophy' ? 'active' : ''}`} onClick={() => setCurrentScene('philosophy')}>庭院论道</button>
          <button className={`scene-control-btn ${currentScene === 'science' ? 'active' : ''}`} onClick={() => setCurrentScene('science')}>书房对谈</button>
        </div>
      </div>

      <div className="dialogue-main-container">
        {/* 场景渲染 */}
        <div className="dialogue-scene-area">
          {/* Poetry Scene */}
          <div className={`scene-layer scene-poetry ${currentScene === 'poetry' ? 'active' : ''}`}>
            <div className="scene-bg-image bg-poetry"></div>
            <div className="scene-sage-figure">
              <div className="scene-sage-avatar-large">{currentSage.initial}</div>
              <div className="scene-sage-name">{currentSage.name}</div>
              <div className="scene-sage-title">{currentSage.title}</div>
            </div>
            <div className="ambient-audio-note">🎵 环境音：江水潺潺，夜风习习</div>
          </div>

          {/* Philosophy Scene */}
          <div className={`scene-layer scene-philosophy ${currentScene === 'philosophy' ? 'active' : ''}`}>
            <div className="scene-bg-image bg-philosophy"></div>
            <div className="scene-sage-figure">
              <div className="scene-sage-avatar-large">{currentSage.initial}</div>
              <div className="scene-sage-name">{currentSage.name}</div>
              <div className="scene-sage-title">{currentSage.title}</div>
            </div>
            <div className="ambient-audio-note">🎵 环境音：鸟鸣啾啾，风过竹林</div>
          </div>

          {/* Science Scene */}
          <div className={`scene-layer scene-science ${currentScene === 'science' ? 'active' : ''}`}>
            <div className="scene-bg-image bg-science"></div>
            <div className="scene-sage-figure">
              <div className="scene-sage-avatar-large">{currentSage.initial}</div>
              <div className="scene-sage-name">{currentSage.name}</div>
              <div className="scene-sage-title">{currentSage.title}</div>
            </div>
            <div className="ambient-audio-note">🎵 环境音：笔尖沙沙，烛火摇曳</div>
          </div>
        </div>

        {/* 对话面板 */}
        <div className="dialogue-chat-panel">
          <div className="chat-panel-header">
            <h2>时空对话</h2>
            <p>您正在与历史对话。AI将基于史料，以当时的认知理解您的问题。</p>
          </div>

          <div className="chat-messages-container" ref={messagesEndRef}>
            {messages.map((m, i) => (
              <div key={i} className={`chat-message-item ${m.type === 'user' ? 'user' : ''}`}>
                <div className={`chat-avatar-circle ${m.type === 'user' ? 'user' : 'sage'}`}>
                  {m.type === 'user' ? '我' : currentSage.initial}
                </div>
                <div className="chat-msg-bubble">
                  {m.text}
                  <div className="chat-msg-time">{m.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="chat-input-wrapper">
            <div className="chat-input-box">
              <textarea
                className="chat-text-area"
                placeholder="向先贤请教..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button className="chat-send-btn" onClick={sendMessage}>➤</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryDialoguePage;
