import StreamingAvatar, { AvatarQuality, TaskType } from "@heygen/streaming-avatar";

const MVPTestPage = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState('idle'); // idle, connecting, ready, error
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTalking, setIsTalking] = useState(false);

  const videoRef = useRef(null);
  const avatarRef = useRef(null);
  const chatEndRef = useRef(null);
  const [debugLog, setDebugLog] = useState([]);
  const [hasVideoTrack, setHasVideoTrack] = useState(false);

  const addDebug = (msg) => {
    console.log(`[HEYGEN_DEBUG] ${msg}`);
    setDebugLog(prev => [...prev.slice(-4), msg]);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 清理函数
  useEffect(() => {
    return () => {
      if (avatarRef.current) {
        avatarRef.current.stopAvatar();
      }
    };
  }, []);

  const initAvatar = async () => {
    if (avatarRef.current) return;

    setStatus('connecting');
    try {
      addDebug('正在获取 HeyGen 访问令牌...');
      const response = await fetch('/api/heygen-token');
      const { token } = await response.json();

      if (!token) throw new Error('未能获取令牌');

      addDebug('正在初始化 HeyGen 引擎...');
      avatarRef.current = new StreamingAvatar({ token });

      // 绑定流准备就绪事件
      avatarRef.current.on('stream_ready', (event) => {
        addDebug('视频流已就绪');
        if (videoRef.current) {
          videoRef.current.srcObject = event.detail;
          videoRef.current.oncanplay = () => {
            videoRef.current.play().catch(console.error);
            setHasVideoTrack(true);
          };
        }
      });

      avatarRef.current.on('stream_disconnected', () => {
        addDebug('流连接已断开');
        setHasVideoTrack(false);
        setStatus('idle');
        avatarRef.current = null;
      });

      // 启动正式会话
      await avatarRef.current.createStartAvatar({
        avatarName: "Anna_public_3_20240108", // 精选的高质量演示角色
        quality: AvatarQuality.Low, // 快速演示建议用 Low
      });

      addDebug('HeyGen 会话已建立');
      setStatus('ready');
      addBotMessage("您好！我是 UploadSoul 的数字助手。借助 HeyGen 技术，我现在能为您提供更自然的交互体验了。");

    } catch (error) {
      addDebug(`初始化失败: ${error.message}`);
      console.error('HeyGen Error:', error);
      setStatus('error');
    }
  };

  const addBotMessage = (text) => {
    setMessages(prev => [...prev, { role: 'bot', text }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { role: 'user', text }]);
  };

  const handleSend = async () => {
    if (!inputValue.trim() || status !== 'ready' || isTalking) return;

    const text = inputValue;
    setInputValue('');
    addUserMessage(text);
    setIsTalking(true);

    try {
      addDebug('正在思考回复...');
      // 1. 获取 GPT 回复 (复用现有的后端 API)
      const chatRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      const data = await chatRes.json();
      const reply = data.reply;

      if (reply) {
        addBotMessage(reply);

        // 2. 让 HeyGen 数字人说话
        if (avatarRef.current) {
          addDebug('正在生成语音及表情...');
          await avatarRef.current.speak({
            text: reply,
            task_type: TaskType.REPEAT
          });
        }
      }
    } catch (error) {
      console.error('Chat Error:', error);
      addBotMessage(`抱歉，我现在出了一点小状况 (${error.message})`);
    } finally {
      setIsTalking(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      addDebug(`Audio: ${videoRef.current.muted ? 'Muted' : 'Unmuted'}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col pt-20">
      <div className="flex-1 container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 max-w-7xl">

        {/* 左侧：数字人视频区 */}
        <div className="flex-1 bg-[#12121A] rounded-3xl border border-white/5 overflow-hidden relative shadow-2xl flex flex-col">
          <div className="absolute top-6 left-6 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              <span className={`w-2 h-2 rounded-full ${status === 'ready' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-xs font-medium uppercase tracking-wider text-gray-300">
                {status === 'ready' ? 'HEYGEN 实时连接中' : '等待初始化'}
              </span>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center relative bg-black/40">
            {/* 视频渲染容器 */}
            <div id="video-container" className="w-full h-full min-h-[400px] flex items-center justify-center">
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                playsInline
                autoPlay
                muted={true}
              />

              {status === 'idle' && (
                <button
                  onClick={initAvatar}
                  className="px-8 py-4 bg-amber-500 text-black font-bold rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 active:scale-95 z-20"
                >
                  启动 HeyGen 数字人
                </button>
              )}

              {status === 'connecting' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-400 animate-pulse font-light tracking-widest text-sm">构建神经渲染通道...</p>
                </div>
              )}

              {status === 'ready' && (
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-20">
                  <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 text-[10px] space-y-1 font-mono w-64">
                    <div className="text-gray-400 flex justify-between">
                      <span># SYSTEM_LOG</span>
                      <span className="text-[8px] opacity-50 tracking-tighter">HEYGEN_v2</span>
                    </div>
                    <div className="flex flex-col gap-1 overflow-hidden">
                      <div className="text-gray-500 text-[9px] truncate">
                        {debugLog.length > 0 ? `> ${debugLog[debugLog.length - 1]}` : 'Waiting...'}
                      </div>
                      <div className="flex gap-2 text-amber-500/60 text-[8px]">
                        <span>STREAM: {hasVideoTrack ? 'ACTIVE' : 'READY'}</span>
                        <span>LATENCY: LOW</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={toggleMute}
                    className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg transition-all flex items-center gap-2 ${videoRef.current?.muted
                        ? 'bg-gray-700 text-white'
                        : 'bg-amber-500 text-black animate-pulse shadow-amber-500/20'
                      }`}
                  >
                    <span>{videoRef.current?.muted ? '取消静音' : '正在收听'}</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      {videoRef.current?.muted ? (
                        <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828 1 1 0 010-1.415z" />
                      ) : (
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      )}
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右侧：聊天对话区 */}
        <div className="w-full md:w-[400px] flex flex-col bg-[#12121A] rounded-3xl border border-white/5 shadow-2xl relative">
          <div className="p-6 border-b border-white/5">
            <h3 className="font-bold flex items-center gap-2 text-amber-500 uppercase tracking-widest text-sm">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
              交互对话日志
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-600 text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 opacity-20">💬</div>
                <p className="text-xs tracking-wider">对话窗口已就绪</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${msg.role === 'user'
                    ? 'bg-amber-500 text-black font-medium shadow-lg shadow-amber-500/10'
                    : 'bg-white/5 text-gray-200 border border-white/10 backdrop-blur-sm'
                    }`}>
                    {msg.text}
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* 输入框 */}
          <div className="p-6 bg-black/20 rounded-b-3xl">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={status === 'ready' ? "输入消息..." : "请先开启连接..."}
                disabled={status !== 'ready' || isTalking}
                className="w-full bg-gray-900/50 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all placeholder:text-gray-600 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={status !== 'ready' || isTalking}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-amber-500 hover:text-amber-400 disabled:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MVPTestPage;