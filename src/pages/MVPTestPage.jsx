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
      console.log('Secure Context:', window.isSecureContext);
      console.log('RTCPeerConnection:', typeof window.RTCPeerConnection !== 'undefined');

      if (!window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        throw new Error('WebRTC 仅可在安全上下文 (HTTPS 或 localhost/127.0.0.1) 中运行。');
      }

      // 1. 获取 Token 和 ICE 服务器
      const [tokenRes, iceRes] = await Promise.all([
        fetch('/api/speech-token'),
        fetch('/api/ice-servers')
      ]);

      if (!tokenRes.ok || !iceRes.ok) {
        throw new Error('无法连接到音视频身份验证服务，请检查网络或后端。');
      }

      const { token, region } = await tokenRes.json();
      const iceServers = await iceRes.json();

      // 3. 配置 Speech
      const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(token, region);
      speechConfig.speechSynthesisLanguage = "zh-CN";
      speechConfig.speechSynthesisVoiceName = "zh-CN-XiaoxiaoNeural";

      // 4. 配置 Avatar
      const avatarConfig = new SpeechSDK.AvatarConfig("lisa", "graceful");

      // 5. 创建合成器
      synthesizerRef.current = new SpeechSDK.AvatarSynthesizer(speechConfig, avatarConfig);

      // 重要：绑定视频元素给 SDK
      if (videoRef.current) {
        synthesizerRef.current.videoElement = videoRef.current;
      }

      // 6. 准备 WebRTC 连接 (使用 ICE 服务器)
      // Azure 返回格式: { Urls: [...], Username: "...", Password: "..." }
      addDebug(`ICE from Azure: ${JSON.stringify(iceServers).substring(0, 80)}...`);

      const rtcIceServers = iceServers.Urls ? [{
        urls: iceServers.Urls,
        username: iceServers.Username,
        credential: iceServers.Password
      }] : [];

      addDebug(`Using ${rtcIceServers.length} ICE server(s)`);
      const peerConnection = new RTCPeerConnection({
        iceServers: rtcIceServers
      });

      // 配置监听音视频流
      peerConnection.ontrack = (e) => {
        addDebug(`Track received: ${e.track.kind}`);
        if (e.track.kind === 'video') setHasVideoTrack(true);
        if (e.track.kind === 'audio') setHasAudioTrack(true);

        if (videoRef.current && e.streams && e.streams[0]) {
          videoRef.current.srcObject = e.streams[0];
          videoRef.current.play().catch(err => addDebug(`Autoplay blocked: ${err.message}`));
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
      addDebug('Starting Avatar session...');
      await synthesizerRef.current.startAvatarAsync(peerConnection);

      addDebug('Avatar Ready!');
      setStatus('ready');
      addBotMessage("您好！我是 UploadSoul 的数字助手。我已经准备好为您提供陪伴了。");
    } catch (error) {
      addDebug(`Error: ${error.message}`);
      console.error('Detailed Avatar Init Error:', error);
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
                muted={false}
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
                    <div className="text-gray-400"># DIAGNOSTICS</div>
                    <div className="flex gap-4">
                      <span>ICE: <b className={iceState === 'connected' || iceState === 'completed' ? 'text-green-400' : 'text-amber-400'}>{iceState}</b></span>
                      <span>VIDEO: <b className={hasVideoTrack ? 'text-green-400' : 'text-red-400'}>{hasVideoTrack ? 'OK' : 'NO'}</b></span>
                      <span>AUDIO: <b className={hasAudioTrack ? 'text-green-400' : 'text-red-400'}>{hasAudioTrack ? 'OK' : 'NO'}</b></span>
                    </div>
                    {debugLog.length > 0 && (
                      <div className="text-[9px] text-gray-500 italic truncate max-w-[200px]">
                        Last: {debugLog[debugLog.length - 1]}
                      </div>
                    )}
                  </div>

                  {!hasVideoTrack && status === 'ready' && (
                    <div className="bg-red-500/20 text-red-400 text-[10px] px-3 py-1 rounded-full animate-pulse border border-red-500/30">
                      等待媒体流...
                    </div>
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

      {/* 全屏对话模式的底部提示 */}
      <div className="py-4 text-center text-[10px] text-gray-700 uppercase tracking-[0.2em] font-light">
        Powered by Azure AI Speech & GPT-4 API
      </div>
    </div>
  );
};

export default MVPTestPage;