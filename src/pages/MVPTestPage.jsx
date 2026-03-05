import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { useTranslation } from 'react-i18next';

/**
 * 从 TTS 朗读文本中移除不应读出的内容：括号/星号内的描述、表情动作短语、emoji。
 * 聊天界面仍显示完整原文，仅朗读时使用清洗后的文本。
 */
function textForSpeechOnly(rawText) {
  if (!rawText || typeof rawText !== 'string') return rawText || '';
  let t = rawText;
  // 移除各类括号及星号内的描述性文字
  t = t.replace(/\*[^*]*\*/g, '');
  t = t.replace(/（[^）]*）/g, '');
  t = t.replace(/【[^】]*】/g, '');
  t = t.replace(/\([^)]*\)/g, '');
  t = t.replace(/\[[^\]]*\]/g, '');
  t = t.replace(/「[^」]*」/g, '');
  t = t.replace(/『[^』]*』/g, '');
  // 移除常见表情/动作描述短语（独立成段或前后有标点/空格）
  const actionPhrases = [
    '眼角含笑', '微微一笑', '点点头', '摇摇头', '叹了口气', '笑着', '轻声', '柔声',
    '笑道', '说道', '问道', '答道', '心想', '心道', '暗道', '皱眉', '蹙眉', '莞尔',
    '笑盈盈', '笑呵呵', '笑眯眯', '笑而不语', '笑而不答', '含笑', '浅笑', '苦笑',
    '点头', '摇头', '叹息', '沉吟', '顿了顿', '顿了顿说', '顿了顿道', '缓缓说道',
    '淡淡说道', '冷冷说道', '轻声说道', '柔声说到', '笑着说道', '笑着说到',
    '微笑着', '微笑着说道', '微笑着说', '微笑着说到'
  ];
  actionPhrases.forEach(phrase => {
    const re = new RegExp(`[\\s，。、；：！？]*${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s，。、；：！？]*`, 'g');
    t = t.replace(re, ' ');
  });
  // 移除常见 emoji 范围（保留中文等）
  t = t.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
  t = t.replace(/\s{2,}/g, ' ').trim();
  return t;
}

const MVPTestPage = () => {
  const { t, i18n } = useTranslation();
  const [status, setStatus] = useState('idle'); // idle, connecting, ready, error
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTalking, setIsTalking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [continuousMode, setContinuousMode] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);

  const videoRef = useRef(null);
  const synthesizerRef = useRef(null);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const sendMessageRef = useRef(null);
  const isTalkingRef = useRef(false);
  const videoContainerRef = useRef(null);
  const userVideoRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [debugLog, setDebugLog] = useState([]);
  const [webrtcState, setWebrtcState] = useState('new');
  const [iceState, setIceState] = useState('new');
  const [sigState, setSigState] = useState('stable');
  const [gathState, setGathState] = useState('new');
  const [hasVideoTrack, setHasVideoTrack] = useState(false);
  const [hasAudioTrack, setHasAudioTrack] = useState(false);
  const [avatarLang, setAvatarLang] = useState('mandarin'); // 普通话（默认）/ 英文 / 粤语

  const addDebug = (msg) => {
    console.log(`[AVATAR_DEBUG] ${msg}`);
    setDebugLog(prev => [...prev.slice(-4), msg]);
  };

  // 全屏切换功能
  const toggleFullscreen = useCallback(() => {
    if (!videoContainerRef.current) return;

    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Fullscreen error:', err);
        addDebug(`全屏失败: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  }, []);

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // 摄像头开关功能
  const toggleCamera = useCallback(async () => {
    if (isCameraOn && cameraStream) {
      // 关闭摄像头
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setIsCameraOn(false);
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = null;
      }
    } else {
      // 开启摄像头
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: 'user' },
          audio: false
        });
        setCameraStream(stream);
        setIsCameraOn(true);
        // 不在此处给 ref 赋值：此时 <video> 尚未挂载（isCameraOn 刚变为 true），由 useEffect 在挂载后绑定
      } catch (err) {
        console.error('Camera error:', err);
        addDebug(`摄像头失败: ${err.message}`);
      }
    }
  }, [isCameraOn, cameraStream]);

  // 摄像头流就绪后绑定到 video 元素（video 在 isCameraOn 为 true 时才挂载，需在 effect 里赋值）
  useEffect(() => {
    if (!isCameraOn || !cameraStream || !userVideoRef.current) return;
    userVideoRef.current.srcObject = cameraStream;
    userVideoRef.current.play().catch((e) => console.log('User video autoplay:', e));
  }, [isCameraOn, cameraStream]);

  // 清理摄像头
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 初始化语音识别
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = i18n.language.startsWith('zh') ? 'zh-CN' : 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('[Voice] Recognized:', transcript);

        if (transcript.trim() && sendMessageRef.current) {
          sendMessageRef.current(transcript.trim());
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        addDebug(`语音识别错误: ${event.error}`);
      };

      recognitionInstance.onend = () => {
        console.log('[Voice] Recognition ended');
        setIsListening(false);
      };

      recognitionInstance.onnomatch = () => {
        console.log('[Voice] No match - please speak clearly');
        addDebug('未能识别，请再说一遍');
      };

      recognitionRef.current = recognitionInstance;
      setRecognition(recognitionInstance);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  // 同步 isTalking 状态到 ref
  useEffect(() => {
    isTalkingRef.current = isTalking;
  }, [isTalking]);

  // 像真人：要求什么语言就什么语言，或你说什么语言就同样用什么语言（无按钮）
  const resolveAvatarLang = (text) => {
    const t = (text || '').trim();
    if (/\b(用|说|讲|切换?成?)\s*(粤语|廣東話|广东话|Cantonese)\b/i.test(t)) {
      setAvatarLang('cantonese');
      return 'cantonese';
    }
    if (/\b(用|说|讲|切换?成?)\s*(英文|英语|English)\b/i.test(t) || /\b(switch to|in) english\b/i.test(t)) {
      setAvatarLang('english');
      return 'english';
    }
    if (/\b(用|说|讲|切换?成?)\s*(普通话|国语|Mandarin)\b/i.test(t)) {
      setAvatarLang('mandarin');
      return 'mandarin';
    }
    const enCount = (t.match(/[a-zA-Z]/g) || []).length;
    const cjkCount = (t.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
    const isMostlyEnglish = enCount >= cjkCount && (enCount + cjkCount) > 0;
    const lang = isMostlyEnglish ? 'english' : 'mandarin';
    setAvatarLang(lang);
    return lang;
  };

  const initAvatar = async () => {
    if (synthesizerRef.current) return;

    setStatus('connecting');
    try {
      addDebug('正在检查环境安全上下文...');

      const [tokenRes, iceRes] = await Promise.all([
        fetch('/api/speech-token'),
        fetch('/api/ice-servers')
      ]);

      if (!tokenRes.ok) {
        const errText = await tokenRes.text();
        addDebug(`Token API Error: ${tokenRes.status} ${tokenRes.statusText}`);
        console.error('Token API Response:', errText);
        throw new Error(`Token API Failed (${tokenRes.status}): ${errText.substring(0, 50)}...`);
      }

      if (!iceRes.ok) {
        // ICE failure is not critical for checking envs, but critical for startup
        const errText = await iceRes.text();
        addDebug(`ICE API Error: ${iceRes.status} ${iceRes.statusText}`);
        throw new Error(`ICE API Failed (${iceRes.status})`);
      }

      let token, region;
      try {
        const tokenData = await tokenRes.json();
        token = tokenData.token;
        region = tokenData.region;
      } catch (e) {
        const errText = await tokenRes.text().catch(() => 'Cannot read text');
        console.error('Token JSON Parse Error:', e, 'Response:', errText);
        addDebug(`Token JSON Error: ${e.message}`);
        throw new Error('Token API returned invalid JSON');
      }

      let iceServers;
      try {
        iceServers = await iceRes.json();
      } catch (e) {
        console.error('ICE JSON Parse Error:', e);
        addDebug(`ICE JSON Error: ${e.message}`);
        throw new Error('ICE API returned invalid JSON');
      }

      const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(token, region);

      // 使用多语言语音：一个数字人即可中英粤混说，无需因切换语言而重启（避免重连失败）
      speechConfig.speechSynthesisLanguage = "en-US";
      speechConfig.speechSynthesisVoiceName = "en-US-JennyMultilingualNeural";
      addDebug('Avatar 语音: 多语言 (中/英自动识别)');

      // Azure Avatar valid characters for REAL-TIME API:
      // Lisa: ONLY casual-sitting (graceful/technical styles are batch-only!)
      // Harry: business, casual, youthful
      // Lori: casual, graceful, formal
      const avatarConfig = new SpeechSDK.AvatarConfig("Lisa", "casual-sitting");
      addDebug('Avatar配置: Lisa (casual-sitting) - Realtime API Compatible');
      synthesizerRef.current = new SpeechSDK.AvatarSynthesizer(speechConfig, avatarConfig);

      if (videoRef.current) {
        synthesizerRef.current.videoElement = videoRef.current;
      }

      addDebug('正在初始化安全通信通道...');

      // Build ICE servers array - use normalized lowercase fields from backend
      // Azure docs recommend using ONLY TURN servers from their API
      const turnUrls = iceServers.urls;
      const turnUsername = iceServers.username;
      const turnCredential = iceServers.credential || iceServers.password;

      if (!turnUrls || !turnUsername || !turnCredential) {
        addDebug(`ICE Missing: urls=${!!turnUrls}, user=${!!turnUsername}, cred=${!!turnCredential}`);
        throw new Error('ICE服务器配置获取失败，请确认Azure AI服务运行正常');
      }

      addDebug(`TURN server: ${Array.isArray(turnUrls) ? turnUrls[0] : turnUrls}`);

      const peerConnection = new RTCPeerConnection({
        iceServers: [{
          urls: Array.isArray(turnUrls) ? turnUrls : [turnUrls],
          username: turnUsername,
          credential: turnCredential
        }]
      });

      // Per Azure docs: Offer to receive one video track, and one audio track
      // Direction MUST be 'sendrecv' for Azure Avatar to work
      peerConnection.addTransceiver('video', { direction: 'sendrecv' });
      peerConnection.addTransceiver('audio', { direction: 'sendrecv' });

      peerConnection.onsignalingstatechange = () => {
        addDebug(`Signaling: ${peerConnection.signalingState}`);
        setSigState(peerConnection.signalingState);
      };
      peerConnection.onicegatheringstatechange = () => {
        addDebug(`ICE Gathering: ${peerConnection.iceGatheringState}`);
        setGathState(peerConnection.iceGatheringState);
      };
      peerConnection.onconnectionstatechange = () => {
        addDebug(`Connection: ${peerConnection.connectionState}`);
        setWebrtcState(peerConnection.connectionState);
      };
      peerConnection.oniceconnectionstatechange = () => {
        addDebug(`ICE: ${peerConnection.iceConnectionState}`);
        setIceState(peerConnection.iceConnectionState);
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          addDebug(`ICE候选: ${event.candidate.type}`);
        } else {
          addDebug('ICE候选收集完成');
        }
      };

      // Per Azure docs: ontrack callback runs twice—once for video, once for audio
      peerConnection.ontrack = (event) => {
        addDebug(`Track: ${event.track.kind} (${event.track.readyState})`);

        if (event.track.kind === 'video') {
          setHasVideoTrack(true);
          if (videoRef.current) {
            videoRef.current.srcObject = event.streams[0];
            videoRef.current.autoplay = true;
            videoRef.current.playsInline = true;
          }
        }

        if (event.track.kind === 'audio') {
          setHasAudioTrack(true);
          // Create a separate audio element for audio playback
          // This is important because video element might be muted
          let audioElement = document.getElementById('avatarAudioPlayer');
          if (!audioElement) {
            audioElement = document.createElement('audio');
            audioElement.id = 'avatarAudioPlayer';
            audioElement.autoplay = true;
            document.body.appendChild(audioElement);
          }
          audioElement.srcObject = event.streams[0];
        }
      };

      addDebug('正在启动 Avatar 会话...');

      try {
        const result = await synthesizerRef.current.startAvatarAsync(peerConnection);

        // Check the result reason
        if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
          addDebug('Avatar 启动成功');
        } else if (result.reason === SpeechSDK.ResultReason.Canceled) {
          const cancellation = SpeechSDK.CancellationDetails.fromResult(result);
          addDebug(`Avatar 取消: ${cancellation.reason}`);
          if (cancellation.errorDetails) {
            addDebug(`错误: ${cancellation.errorDetails}`);
          }
          throw new Error(`Avatar启动被取消: ${cancellation.errorDetails || cancellation.reason}`);
        } else {
          addDebug(`Avatar 结果: ${SpeechSDK.ResultReason[result.reason] || result.reason}`);
        }
      } catch (avatarError) {
        addDebug(`Avatar启动失败: ${avatarError.message}`);
        throw avatarError;
      }

      // Wait for ICE connection (up to 10 seconds)
      let waitTime = 0;
      const maxWait = 10000;
      while (peerConnection.iceConnectionState === 'new' && waitTime < maxWait) {
        await new Promise(resolve => setTimeout(resolve, 500));
        waitTime += 500;
        addDebug(`等待ICE... ${peerConnection.iceConnectionState}`);
      }

      if (peerConnection.iceConnectionState === 'connected' || peerConnection.iceConnectionState === 'completed') {
        addDebug('ICE 连接成功');
      } else {
        addDebug(`ICE 最终状态: ${peerConnection.iceConnectionState}`);
      }

      addDebug('会话已开启');
      setStatus('ready');

      const welcome = t('mvpTest.chat.welcome');
      addBotMessage(welcome);
      if (synthesizerRef.current) {
        synthesizerRef.current.speakTextAsync(textForSpeechOnly(welcome)).catch(err => console.error('[Avatar] Welcome speech failed:', err));
      }
    } catch (error) {
      addDebug(`初始化失败: ${error.message}`);
      console.error('Detailed Error:', error);
      setStatus('error');
      synthesizerRef.current = null; // 允许用户点击「启动」重试
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      addDebug(`Audio: ${videoRef.current.muted ? 'Muted' : 'Unmuted'}`);
    }
  };

  const toggleVoiceInput = () => {
    if (!recognition) {
      addDebug('您的浏览器不支持语音识别');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setInputValue('');
      try {
        recognition.start();
        setIsListening(true);
        addDebug('正在监听您的语音...');
      } catch (error) {
        console.error('Failed to start recognition:', error);
        setIsListening(false);
      }
    }
  };

  const addBotMessage = (text) => {
    setMessages(prev => [...prev, { role: 'bot', text }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { role: 'user', text }]);
  };

  const handleSendMessage = async (messageText) => {
    if (!messageText || status !== 'ready' || isTalking) {
      console.log('[Send] Blocked:', { messageText, status, isTalking });
      return;
    }

    const text = messageText;
    setInputValue('');
    addUserMessage(text);
    setIsTalking(true);
    setIsListening(false);

    const effectiveLang = resolveAvatarLang(text);
    // 海外通道使用多语言语音，不因切换语言重启数字人，避免重连失败

    try {
      const chatRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, preferred_language: effectiveLang })
      });

      let data;
      const contentType = chatRes.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await chatRes.json();
      } else {
        const text = await chatRes.text();
        console.error('Chat API Non-JSON Response:', text);
        throw new Error(`Server Error: ${text.substring(0, 50)}...`);
      }

      const reply = data.reply;

      if (!chatRes.ok) {
        throw new Error(data.error || `Chat API Failed (${chatRes.status})`);
      }

      if (reply) {
        addBotMessage(reply);
        if (synthesizerRef.current) {
          const toSpeak = textForSpeechOnly(reply);
          if (toSpeak) await synthesizerRef.current.speakTextAsync(toSpeak);
        }
      }
    } catch (error) {
      console.error('Chat Error:', error);
      addBotMessage(`抱歉，我现在出了一点小状况 (${error.message})`);
    } finally {
      setIsTalking(false);

      if (continuousMode && recognitionRef.current && status === 'ready') {
        console.log('[Voice] Scheduling mic restart in continuous mode');
        setTimeout(() => {
          console.log('[Voice] Attempting to restart mic, isTalking:', isTalkingRef.current);
          if (!isTalkingRef.current) {
            startVoiceRecognition();
          } else {
            console.log('[Voice] Still talking, skipping restart');
          }
        }, 1000);
      }
    }
  };

  useEffect(() => {
    sendMessageRef.current = handleSendMessage;
  }, [status, isTalking, continuousMode, avatarLang]);

  // 启动语音识别的辅助函数，带错误恢复
  const startVoiceRecognition = () => {
    if (!recognitionRef.current || isTalkingRef.current) {
      console.log('[Voice] Cannot start - no recognition or is talking');
      return;
    }

    try {
      // 动态同步识别语言
      const currentLang = i18n.language.startsWith('zh') ? 'zh-CN' : 'en-US';
      if (recognitionRef.current.lang !== currentLang) {
        console.log(`[Voice] Updating recognition language to: ${currentLang}`);
        recognitionRef.current.lang = currentLang;
      }

      recognitionRef.current.start();
      setIsListening(true);
      addDebug('麦克风已启动');
      console.log('[Voice] Recognition started successfully');
    } catch (error) {
      console.error('[Voice] Start recognition error:', error);

      if (error.message && error.message.includes('already started')) {
        console.log('[Voice] Already started, stopping and restarting...');
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error('[Voice] Error stopping:', e);
        }
        setTimeout(() => startVoiceRecognition(), 300);
      } else {
        addDebug(`语音启动失败: ${error.message}`);
        setIsListening(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col pt-20">
      <div className="flex-1 container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 max-w-7xl">

        {/* 左侧：数字人视频区 */}
        <div
          ref={videoContainerRef}
          className="flex-1 bg-[#12121A] rounded-3xl border border-white/5 overflow-hidden relative shadow-2xl flex flex-col"
        >
          {/* 顶部状态栏 */}
          <div className="absolute top-6 left-6 right-6 z-10 flex justify-between items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              <span className={`w-2 h-2 rounded-full ${status === 'ready' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-xs font-medium uppercase tracking-wider text-gray-300">
                {status === 'ready' ? t('mvpTest.status.ready') : t('mvpTest.status.idle')}
              </span>
            </div>

            {/* 全屏按钮 */}
            {status === 'ready' && (
              <button
                onClick={toggleFullscreen}
                className="p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/70 hover:text-white hover:bg-black/60 transition-all"
                title={isFullscreen ? '退出全屏' : '全屏显示'}
              >
                {isFullscreen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                )}
              </button>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center relative">
            <div id="video-container" className="w-full h-full min-h-[400px] flex items-center justify-center">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                autoPlay
                muted={false}
              />

              {(status === 'idle' || status === 'error') && (
                <div className="flex flex-col items-center gap-3">
                  {status === 'error' && debugLog.length > 0 && (
                    <p className="text-red-400/90 text-sm max-w-md text-center px-4">
                      {debugLog[debugLog.length - 1]}
                    </p>
                  )}
                  <button
                    onClick={initAvatar}
                    className="px-8 py-4 bg-amber-500 text-black font-bold rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 active:scale-95"
                  >
                    {status === 'error' ? (t('mvpTest.controls.retry') || '重试') : t('mvpTest.controls.start')}
                  </button>
                </div>
              )}

              {status === 'connecting' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-400 animate-pulse font-light tracking-widest text-sm text-center px-4">{t('mvpTest.controls.connecting')}</p>
                  <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 text-[10px] space-y-1 font-mono max-w-xs">
                    <div className="text-amber-500 font-bold">调试日志:</div>
                    {debugLog.map((log, i) => (
                      <div key={i} className="text-gray-400 truncate">&gt; {log}</div>
                    ))}
                  </div>
                </div>
              )}

              {status === 'ready' && (
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-20">
                  <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 text-[10px] space-y-1 font-mono w-64">
                    <div className="text-gray-400 flex justify-between">
                      <span># DIAGNOSTICS</span>
                      <span className="text-[8px] opacity-50">{webrtcState}</span>
                    </div>
                    <div className="flex flex-col gap-1 overflow-hidden">
                      <div className="flex gap-3">
                        <span>ICE: <b className={(iceState === 'connected' || iceState === 'completed') ? 'text-green-400' : 'text-amber-400'}>{iceState}</b></span>
                        <span>V: <b className={hasVideoTrack ? 'text-green-400' : 'text-red-400'}>{hasVideoTrack ? 'OK' : 'NO'}</b></span>
                        <span>A: <b className={hasAudioTrack ? 'text-green-400' : 'text-red-400'}>{hasAudioTrack ? 'OK' : 'NO'}</b></span>
                      </div>
                      <div className="text-gray-500 text-[9px] truncate">
                        {debugLog.length > 0 ? `> ${debugLog[debugLog.length - 1]}` : 'Waiting...'}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={toggleMute}
                    className={`px-4 py-2 rounded-full text-xs font-bold shadow-lg transition-all flex items-center gap-2 ${videoRef.current?.muted
                      ? 'bg-gray-700 text-white'
                      : 'bg-amber-500 text-black shadow-amber-500/20'
                      }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      {videoRef.current?.muted ? (
                        <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.984 3.984 0 00-1.172-2.828 1 1 0 010-1.415z" />
                      ) : (
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      )}
                    </svg>
                    <span>{videoRef.current?.muted ? '取消静音' : '静音声音'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右侧：聊天对话区 */}
        <div className="w-full md:w-[400px] flex flex-col bg-[#12121A] rounded-3xl border border-white/5 shadow-2xl relative">
          {/* 摄像头和语音控制区 */}
          <div className="p-4 border-b border-white/5 space-y-4">
            {/* 摄像头控制 */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleCamera}
                className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${isCameraOn
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                  : 'bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10'
                  }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {isCameraOn ? '关闭摄像头' : '开启摄像头'}
              </button>
            </div>

            {/* 用户摄像头画面 */}
            {isCameraOn && (
              <div className="relative rounded-xl overflow-hidden bg-black/40 border border-white/10 aspect-video min-h-[200px]">
                <video
                  ref={userVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full min-h-[200px] object-contain"
                />
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-[10px] text-gray-400">
                  您的画面
                </div>
              </div>
            )}

            {/* 语音控制按钮 - 从左侧移到这里 */}
            {status === 'ready' && !isListening && !isTalking && (
              <button
                onClick={toggleVoiceInput}
                className="w-full bg-amber-500 hover:bg-amber-400 text-black py-4 rounded-xl font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                <span className="text-lg">{t('mvpTest.chat.startVoiceChat') || '点击开始对话'}</span>
              </button>
            )}

            {status === 'ready' && isListening && (
              <div className="w-full bg-red-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 animate-pulse">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                <span className="text-lg">正在聆听...</span>
              </div>
            )}

            {status === 'ready' && isTalking && (
              <div className="w-full bg-amber-500/20 text-amber-400 py-4 rounded-xl font-medium flex items-center justify-center gap-3 border border-amber-500/30">
                <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                <span>数字人正在回复...</span>
              </div>
            )}
          </div>

          {/* 聊天标题 */}
          <div className="p-4 border-b border-white/5">
            <h3 className="font-bold flex items-center gap-2 text-amber-500 tracking-widest text-sm uppercase">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
              {t('mvpTest.chat.title')}
            </h3>
          </div>

          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-600 text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">💬</div>
                <p className="text-xs">{t('mvpTest.chat.ready')}</p>
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
          </div>

          <div className="p-6 bg-black/20 rounded-b-3xl">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isTalking && handleSendMessage(inputValue.trim())}
                placeholder={status === 'ready' ? (isListening ? '正在监听...' : t('mvpTest.chat.placeholder')) : t('mvpTest.chat.waitConnect')}
                disabled={status !== 'ready' || isTalking}
                className="w-full bg-gray-900 border border-white/10 rounded-2xl px-5 py-4 pr-24 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all placeholder:text-gray-600 disabled:opacity-50"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  onClick={toggleVoiceInput}
                  disabled={status !== 'ready' || isTalking}
                  className={`p-2 rounded-full transition-all ${isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'text-gray-400 hover:text-amber-400'
                    } disabled:text-gray-600 disabled:cursor-not-allowed`}
                  title={isListening ? '停止录音' : '语音输入'}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => handleSendMessage(inputValue.trim())}
                  disabled={status !== 'ready' || isTalking || !inputValue.trim()}
                  className="p-2 text-amber-500 hover:text-amber-400 disabled:text-gray-600 transition-colors"
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
    </div>
  );
};

export default MVPTestPage;