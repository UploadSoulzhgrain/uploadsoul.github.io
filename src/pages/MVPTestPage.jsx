import React, { useState, useEffect, useRef } from 'react';
import * as Transition from '@headlessui/react';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { useTranslation } from 'react-i18next';
import Logo from '../components/common/Logo';

const MVPTestPage = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState('idle'); // idle, connecting, ready, error
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTalking, setIsTalking] = useState(false);

  const videoRef = useRef(null);
  const synthesizerRef = useRef(null);
  const chatEndRef = useRef(null);
  const [debugLog, setDebugLog] = useState([]);
  const [webrtcState, setWebrtcState] = useState('new');
  const [iceState, setIceState] = useState('new');
  const [sigState, setSigState] = useState('stable');
  const [gathState, setGathState] = useState('new');
  const [hasVideoTrack, setHasVideoTrack] = useState(false);
  const [hasAudioTrack, setHasAudioTrack] = useState(false);

  const addDebug = (msg) => {
    console.log(`[AVATAR_DEBUG] ${msg}`);
    setDebugLog(prev => [...prev.slice(-4), msg]);
  };

  useEffect(() => {
    // 自动滚动到底部
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initAvatar = async () => {
    if (synthesizerRef.current) return;

    setStatus('connecting');
    try {
      // 1. 环境诊断
      addDebug('正在检查环境安全上下文...');

      // 2. 获取连接凭证
      const [tokenRes, iceRes] = await Promise.all([
        fetch('/api/speech-token'),
        fetch('/api/ice-servers')
      ]);

      if (!tokenRes.ok || !iceRes.ok) {
        throw new Error('无法连接到服务，请检查网络连接。');
      }

      const { token, region } = await tokenRes.json();
      const iceServers = await iceRes.json();

      // 3. 配置核心参数
      const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(token, region);
      speechConfig.speechSynthesisLanguage = "zh-CN";
      speechConfig.speechSynthesisVoiceName = "zh-CN-XiaoxiaoNeural";

      // 4. 配置虚拟形象
      const avatarConfig = new SpeechSDK.AvatarConfig("jenny", "graceful");

      // 5. 创建合成器
      synthesizerRef.current = new SpeechSDK.AvatarSynthesizer(speechConfig, avatarConfig);

      // 绑定视频元素
      if (videoRef.current) {
        synthesizerRef.current.videoElement = videoRef.current;
      }

      // 6. 准备加密传输通道
      addDebug('正在初始化安全通信通道...');

      // 标准化 ICE 服务器配置 (包含 Google STUN 和 Azure TURN)
      const rtcIceServers = [
        {
          urls: [
            'stun:stun.l.google.com:19302',
            'stun:stun1.l.google.com:19302'
          ]
        },
        {
          urls: iceServers.Urls || iceServers.urls,
          username: iceServers.Username || iceServers.username,
          credential: iceServers.Password || iceServers.password || iceServers.credential
        }
      ];

      addDebug('正在配置核心通信轨道...');
      const peerConnection = new RTCPeerConnection({
        iceServers: rtcIceServers,
        iceCandidatePoolSize: 10,
        bundlePolicy: 'max-bundle'
      });

      // 【强效修复】创建一个虚拟数据通道，强制浏览器立即启动 ICE 候选者搜寻
      // 这能解决在某些环境下 GATH 卡在 new 的问题
      peerConnection.createDataChannel('health-check');

      // 实时状态同步
      peerConnection.onsignalingstatechange = () => setSigState(peerConnection.signalingState);
      peerConnection.onicegatheringstatechange = () => setGathState(peerConnection.iceGatheringState);
      peerConnection.onconnectionstatechange = () => setWebrtcState(peerConnection.connectionState);
      peerConnection.oniceconnectionstatechange = () => setIceState(peerConnection.iceConnectionState);

      // 发现网络路径即时反馈
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          setDebugLog(prev => [...prev.slice(-1), `找到网络路径: ${event.candidate.type}`]);
        }
      };

      // 调试：监听 ICE 收集状态变化
      peerConnection.onicegatheringstatechange = () => {
        addDebug(`ICE Gathering: ${peerConnection.iceGatheringState}`);
      };

      // 配置监听音视频流
      peerConnection.ontrack = (e) => {
        addDebug(`Track received: ${e.track.kind}`);
        if (e.track.kind === 'video') setHasVideoTrack(true);
        if (e.track.kind === 'audio') setHasAudioTrack(true);

        if (videoRef.current && e.streams && e.streams[0]) {
          videoRef.current.srcObject = e.streams[0];

          // 确保静音状态下先播放，然后再尝试取消静音 (处理浏览器限制)
          videoRef.current.play().then(() => {
            addDebug('Video playing successfully');
          }).catch(err => {
            addDebug(`Playback failed: ${err.message}`);
            // 如果报错尝试显示一个手动的“点击恢复声音”按钮
          });
        }
      };

      // 监听连接状态
      peerConnection.onconnectionstatechange = () => {
        setWebrtcState(peerConnection.connectionState);
        addDebug(`Conn State: ${peerConnection.connectionState}`);
      };

      peerConnection.oniceconnectionstatechange = () => {
        setIceState(peerConnection.iceConnectionState);
        addDebug(`ICE State: ${peerConnection.iceConnectionState}`);
      };

      // 注意：不要手动添加 transceiver，让 SDK 自己处理媒体协商
      // peerConnection.addTransceiver('video', { direction: 'recvonly' });
      // peerConnection.addTransceiver('audio', { direction: 'recvonly' });

      // 7. 建立连接 (WebRTC)
      // 预激活媒体引擎 (某些浏览器需要至少请求一次权限才能让 WebRTC 正常接收流)
      try {
        addDebug('Priming audio context...');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // 授权后立即释放
        addDebug('Audio system ready');
      } catch (e) {
        addDebug('Mic access skipped (non-critical)');
      }

      addDebug('正在验证服务权限...');

      // 启动会话并添加超时监控
      const startAvatarSession = async () => {
        return new Promise((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error('连接超时 (60秒)')), 60000);

          synthesizerRef.current.startAvatarAsync(peerConnection).then(() => {
            clearTimeout(timer);
            resolve();
          }).catch(err => {
            clearTimeout(timer);
            reject(err);
          });
        });
      };

      await startAvatarSession();

      addDebug('会话已开启');
      setStatus('ready');
      addBotMessage("您好！我是 UploadSoul 的数字助手。我已经准备好为您提供陪伴了。");
    } catch (error) {
      addDebug(`初始化失败`);
      console.error('Detailed Error:', error);
      setStatus('error');
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      addDebug(`Audio: ${videoRef.current.muted ? 'Muted' : 'Unmuted'}`);
    }
  };

  const addBotMessage = (text) => {
    setMessages(prev => [...prev, { role: 'bot', text }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { role: 'user', text }]);
  };

  const handleSend = async () => {
    if (!inputValue.trim() || status !== 'ready') return;

    const text = inputValue;
    setInputValue('');
    addUserMessage(text);
    setIsTalking(true);

    try {
      // 1. 获取 GPT 回复
      const chatRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      if (!chatRes.ok) {
        throw new Error(`Chat API 响应异常: ${chatRes.status}`);
      }

      const data = await chatRes.json();
      const reply = data.reply;

      if (!reply) {
        throw new Error('未能从回复中解析出文字。');
      }

      addBotMessage(reply);

      // 2. 让数字人说话
      if (synthesizerRef.current) {
        console.log('Synthesizing speech for:', reply);
        await synthesizerRef.current.speakTextAsync(reply);
      }
    } catch (error) {
      console.error('Chat Error:', error);
      addBotMessage(`抱歉，我现在出了一点小状况 (${error.message})，请稍后再试。`);
    } finally {
      setIsTalking(false);
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
              <span className="text-xs font-medium uppercase tracking-wider">
                {status === 'ready' ? '实时连接中' : '准备连接'}
              </span>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center relative">
            {/* 视频渲染容器 */}
            <div id="video-container" className="w-full h-full min-h-[400px] flex items-center justify-center">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                autoPlay
                muted={true}
                controls={false}
              />

              {status === 'idle' && (
                <button
                  onClick={initAvatar}
                  className="px-8 py-4 bg-amber-500 text-black font-bold rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 active:scale-95"
                >
                  启动数字人交互
                </button>
              )}

              {status === 'connecting' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-400 animate-pulse font-light tracking-widest">初始化神经渲染...</p>
                </div>
              )}

              {status === 'ready' && (
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-20">
                  <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 text-[10px] space-y-1 font-mono">
                    <div className="text-gray-400 flex justify-between">
                      <span># DIAGNOSTICS</span>
                      <span className="text-[8px] opacity-50">{webrtcState}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-3">
                        <span>ICE: <b className={(iceState === 'connected' || iceState === 'completed') ? 'text-green-400' : 'text-amber-400'}>{iceState}</b></span>
                        <span>V: <b className={hasVideoTrack ? 'text-green-400' : 'text-red-400'}>{hasVideoTrack ? 'OK' : 'NO'}</b></span>
                        <span>A: <b className={hasAudioTrack ? 'text-green-400' : 'text-red-400'}>{hasAudioTrack ? 'OK' : 'NO'}</b></span>
                      </div>
                      <div className="text-amber-500/80 text-[8px] flex gap-2">
                        <span>SIG: {sigState}</span>
                        <span>GATH: {gathState}</span>
                      </div>
                      <div className="text-gray-500 text-[9px] truncate mt-1">
                        {debugLog.length > 0 ? `> ${debugLog[debugLog.length - 1]}` : 'Waiting for init...'}
                      </div>
                    </div>
                  </div>

                  {!hasVideoTrack && status === 'ready' && (
                    <div className="bg-amber-500/20 text-amber-400 text-[10px] px-3 py-1 rounded-full animate-pulse border border-amber-500/30">
                      正在加载视频流...
                    </div>
                  )}

                  {hasVideoTrack && (
                    <button
                      onClick={toggleMute}
                      className="bg-amber-500 text-black px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg hover:bg-amber-400 transition-all flex items-center gap-1.5"
                    >
                      <span>{videoRef.current?.muted ? '开启声音' : '静音'}</span>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        {videoRef.current?.muted ? (
                          <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828 1 1 0 010-1.415z" />
                        ) : (
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        )}
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右侧：聊天对话区 */}
        <div className="w-full md:w-[400px] flex flex-col bg-[#12121A] rounded-3xl border border-white/5 shadow-2xl relative">
          <div className="p-6 border-b border-white/5">
            <h3 className="font-bold flex items-center gap-2 text-amber-500 uppercase tracking-widest text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              聊天记录
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-600 text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">💬</div>
                <p className="text-sm">尚未开始对话。启动数字人后即可进行实时交流。</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${msg.role === 'user'
                    ? 'bg-amber-500 text-black font-medium'
                    : 'bg-white/5 text-gray-200 border border-white/10'
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
                placeholder={status === 'ready' ? "发送消息给数字人..." : "请先启动数字人..."}
                disabled={status !== 'ready' || isTalking}
                className="w-full bg-gray-900 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all placeholder:text-gray-600 disabled:opacity-50"
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