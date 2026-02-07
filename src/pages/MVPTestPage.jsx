import React, { useState, useEffect, useRef } from 'react';
import * as Transition from '@headlessui/react';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import { useTranslation } from 'react-i18next';
import Logo from '../components/common/Logo';

const MVPTestPage = () => {
  const { t, i18n } = useTranslation();
  const [status, setStatus] = useState('idle'); // idle, connecting, ready, error
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTalking, setIsTalking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [continuousMode, setContinuousMode] = useState(true);

  const videoRef = useRef(null);
  const synthesizerRef = useRef(null);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const sendMessageRef = useRef(null);
  const isTalkingRef = useRef(false);
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
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 初始化语音识别
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'zh-CN';

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
        throw new Error(`Token API Failed (${tokenRes.status})`);
      }

      if (!iceRes.ok) {
        // ICE failure is not critical for checking envs, but critical for startup
        const errText = await iceRes.text();
        addDebug(`ICE API Error: ${iceRes.status} ${iceRes.statusText}`);
        throw new Error(`ICE API Failed (${iceRes.status})`);
      }

      const { token, region } = await tokenRes.json();
      const iceServers = await iceRes.json();

      const speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(token, region);

      // 根据语言选择语音
      const lang = i18n.language;
      if (lang.startsWith('zh')) {
        speechConfig.speechSynthesisLanguage = "zh-CN";
        speechConfig.speechSynthesisVoiceName = "zh-CN-XiaoxiaoNeural"; // 中文普通话女声
      } else {
        speechConfig.speechSynthesisLanguage = "en-US";
        speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural"; // 英文女声
      }

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

      const welcome = "您好！我是 UploadSoul 的数字助手。我已经准备好为您提供陪伴了。";
      addBotMessage(welcome);

      // 启动后自动朗读欢迎词 (Azure Avatar uses speakTextAsync)
      if (synthesizerRef.current) {
        synthesizerRef.current.speakTextAsync(welcome).catch(err => console.error('[Avatar] Welcome speech failed:', err));
      }
    } catch (error) {
      addDebug(`初始化失败: ${error.message}`);
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

    try {
      const chatRes = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      const data = await chatRes.json();
      const reply = data.reply;

      if (reply) {
        addBotMessage(reply);
        if (synthesizerRef.current) {
          await synthesizerRef.current.speakTextAsync(reply);
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
  }, [status, isTalking, continuousMode]);

  // 启动语音识别的辅助函数，带错误恢复
  const startVoiceRecognition = () => {
    if (!recognitionRef.current || isTalkingRef.current) {
      console.log('[Voice] Cannot start - no recognition or is talking');
      return;
    }

    try {
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
        <div className="flex-1 bg-[#12121A] rounded-3xl border border-white/5 overflow-hidden relative shadow-2xl flex flex-col">
          <div className="absolute top-6 left-6 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              <span className={`w-2 h-2 rounded-full ${status === 'ready' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-xs font-medium uppercase tracking-wider text-gray-300">
                {status === 'ready' ? '海外通道 · 实时连接中' : '准备连接'}
              </span>
            </div>
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

              {status === 'idle' && (
                <button
                  onClick={initAvatar}
                  className="px-8 py-4 bg-amber-500 text-black font-bold rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 active:scale-95"
                >
                  启动数字人助手
                </button>
              )}

              {status === 'connecting' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-400 animate-pulse font-light tracking-widest text-sm text-center px-4">建立神经渲染通道...</p>
                  <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 text-[10px] space-y-1 font-mono max-w-xs">
                    <div className="text-amber-500 font-bold">调试日志:</div>
                    {debugLog.map((log, i) => (
                      <div key={i} className="text-gray-400 truncate">&gt; {log}</div>
                    ))}
                  </div>
                </div>
              )}

              {status === 'ready' && (
                <>
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

                  {/* 对话启动控制层 */}
                  <div className="absolute inset-x-0 mx-auto w-fit bottom-32 pointer-events-none z-30">
                    {!isListening && !isTalking && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleVoiceInput();
                        }}
                        className="pointer-events-auto bg-amber-500/90 hover:bg-amber-400 text-black px-10 py-4 rounded-full font-bold shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all active:scale-95 flex items-center gap-3 animate-bounce"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                        </svg>
                        <span className="text-lg">{t('chat.startVoiceChat')}</span>
                      </button>
                    )}
                  </div>
                  {/* v2.1.2_FIX */}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="w-full md:w-[400px] flex flex-col bg-[#12121A] rounded-3xl border border-white/5 shadow-2xl relative">
          <div className="p-6 border-b border-white/5">
            <h3 className="font-bold flex items-center gap-2 text-amber-500 tracking-widest text-sm uppercase">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
              海外交互日志
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-600 text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">💬</div>
                <p className="text-xs">等待会话开始...</p>
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

          <div className="p-6 bg-black/20 rounded-b-3xl">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isTalking && handleSendMessage(inputValue.trim())}
                placeholder={status === 'ready' ? (isListening ? '正在监听...' : "发送消息...") : "请先开启连接..."}
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