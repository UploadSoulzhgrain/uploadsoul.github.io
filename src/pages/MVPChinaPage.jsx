import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import StreamingAvatar, { AvatarQuality, TaskType } from "@heygen/streaming-avatar";

const MVPChinaPage = () => {
  const { t, i18n } = useTranslation();
  const [status, setStatus] = useState('idle'); // idle, connecting, ready, error
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTalking, setIsTalking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [continuousMode, setContinuousMode] = useState(true); // 连续对话模式

  const videoRef = useRef(null);
  const avatarRef = useRef(null);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const sendMessageRef = useRef(null);
  const isTalkingRef = useRef(false); // 存储最新的 isTalking 状态
  const [debugLog, setDebugLog] = useState([]);
  const [hasVideoTrack, setHasVideoTrack] = useState(false);

  const addDebug = (msg) => {
    console.log(`[AVATAR_DEBUG] ${msg}`);
    setDebugLog(prev => [...prev.slice(-4), msg]);
  };

  // 根据语言选择 Voice ID
  // 根据语言选择 Voice ID
  const getVoiceId = () => {
    const lang = i18n.language;
    console.log('[Voice Config] Current i18n language:', lang);
    if (lang.startsWith('zh')) {
      console.log('[Voice Config] Selected: Mandarin Chinese voice');
      // 中文 - 标准普通话女声
      return '867e42cd03df44929a6744e8fa663884';
    } else {
      console.log('[Voice Config] Selected: English voice');
      // 英文 - 使用默认英语女声
      return '1bd001e7e50f421d891986aad5158bc8'; // HeyGen 英语女声
    }
  };

  // 启动语音识别的辅助函数，带错误恢复
  const startVoiceRecognition = useCallback(() => {
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

      console.log('[Voice] Starting recognition...');
      recognitionRef.current.start();
      setIsListening(true);
      console.log('[Voice] ✅ Recognition started successfully');
    } catch (error) {
      console.error('[Voice] ❌ Start recognition error:', error);

      // 如果是"already started"错误，先停止再重启
      if (error.message && error.message.includes('already started')) {
        console.log('[Voice] Already started detected, stopping and restarting...');
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error('[Voice] Error stopping:', e);
        }
        setTimeout(() => startVoiceRecognition(), 300);
      } else {
        console.log(`[Voice] Failed to start: ${error.message || error}`);
        setIsListening(false);
      }
    }
  }, [i18n.language]);

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
      // 初始语言设置，后续在 startVoiceRecognition 中动态同步
      recognitionInstance.lang = i18n.language.startsWith('zh') ? 'zh-CN' : 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('[Voice] Recognized:', transcript);

        // 直接调用 ref 中的发送函数，避免闭包问题
        if (transcript.trim() && sendMessageRef.current) {
          sendMessageRef.current(transcript.trim());
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        addDebug(`${t('mvpChina.chat.error')}: ${event.error}`);
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
  }, [t, i18n.language]);

  // 同步 isTalking 状态到 ref
  useEffect(() => {
    isTalkingRef.current = isTalking;
  }, [isTalking]);

  // 清理函数
  useEffect(() => {
    return () => {
      if (avatarRef.current) {
        avatarRef.current.stopAvatar();
      }
      if (recognitionRef.current) { // 修正为正确的 ref 名称
        recognitionRef.current.stop();
      }
    };
  }, []);

  const initAvatar = async () => {
    if (avatarRef.current) return;

    setStatus('connecting');
    try {
      addDebug(t('mvpChina.logs.getToken'));
      const response = await fetch('/api/heygen-token');
      const data = await response.json();
      const { token } = data;

      if (!token) throw new Error(t('mvpChina.logs.error'));

      addDebug(t('mvpChina.logs.initEngine'));
      avatarRef.current = new StreamingAvatar({ token });

      // 绑定流准备就绪事件
      avatarRef.current.on('stream_ready', (event) => {
        addDebug(t('mvpChina.logs.streamReady'));
        if (videoRef.current) {
          videoRef.current.srcObject = event.detail;
          videoRef.current.oncanplay = () => {
            videoRef.current.play().catch(err => console.error('[Avatar] Play error:', err));
            setHasVideoTrack(true);
          };
        }
      });

      avatarRef.current.on('stream_disconnected', () => {
        addDebug(t('mvpChina.logs.streamDisconnected'));
        setHasVideoTrack(false);
        setStatus('idle');
        avatarRef.current = null;
      });

      // 启动正式会话
      const selectedVoiceId = getVoiceId();
      console.log('[Avatar] Starting session with voice_id:', selectedVoiceId);

      await avatarRef.current.createStartAvatar({
        avatarName: "Anna_public_3_20240108", // 精选的高质量演示角色
        quality: AvatarQuality.Low, // 快速演示建议用 Low
        voice: {
          voice_id: selectedVoiceId // 根据语言动态选择语音
        }
      });

      addDebug(t('mvpChina.logs.sessionEstablished'));
      setStatus('ready');

      const welcome = t('mvpChina.chat.welcome');
      addBotMessage(welcome);

      // 启动后自动朗读欢迎词
      if (avatarRef.current) {
        avatarRef.current.speak({
          text: welcome,
          task_type: TaskType.REPEAT
        }).catch(err => console.error('[Avatar] Welcome speech failed:', err));
      }

    } catch (error) {
      console.error('[Avatar] Initialization failed:', error);
      addDebug(`${t('mvpChina.status.error')}: ${error.message}`);
      setStatus('error');
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
    setIsListening(false); // 确保停止监听

    try {
      addDebug(t('mvpChina.logs.thinking'));
      // 1. 获取 GPT 回复
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
          addDebug(`[Avatar] Start speaking: ${reply.substring(0, 20)}...`);
          await avatarRef.current.speak({
            text: reply,
            task_type: TaskType.REPEAT
          });
          addDebug('[Avatar] Finished speaking');
        }
      }
    } catch (error) {
      console.error('Chat Error:', error);
      addBotMessage(`${t('mvpChina.chat.error')} (${error.message})`);
    } finally {
      setIsTalking(false);

      // 连续对话模式：数字人回复完毕后自动重新开启麦克风
      if (continuousMode && recognitionRef.current && status === 'ready') {
        console.log('[Voice] Scheduling mic restart in continuous mode');
        setTimeout(() => {
          // 使用 ref 访问最新状态，避免闭包问题
          console.log('[Voice] Attempting to restart mic, isTalking:', isTalkingRef.current);
          if (!isTalkingRef.current) {
            startVoiceRecognition();
          } else {
            console.log('[Voice] Still talking, skipping restart');
          }
        }, 2000); // 增加延迟到 2 秒，确保语音播放物理层面结束
      }
    }
  };

  // 更新 ref，确保语音识别回调能访问最新的函数
  useEffect(() => {
    sendMessageRef.current = handleSendMessage;
  }, [status, isTalking, continuousMode]);

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

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white flex flex-col pt-20">
      <div className="flex-1 container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 max-w-7xl">

        {/* 左侧：数字人视频区 */}
        <div className="flex-1 bg-[#12121A] rounded-3xl border border-white/5 overflow-hidden relative shadow-2xl flex flex-col">
          <div className="absolute top-6 left-6 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              <span className={`w-2 h-2 rounded-full ${status === 'ready' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-xs font-medium uppercase tracking-wider text-gray-300">
                {status === 'ready' ? t('mvpChina.status.ready') : t('mvpChina.status.idle')}
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
                muted={false}
              />

              {status === 'idle' && (
                <button
                  onClick={initAvatar}
                  className="px-8 py-4 bg-amber-500 text-black font-bold rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20 active:scale-95 z-20"
                >
                  {t('mvpChina.controls.start')}
                </button>
              )}

              {status === 'connecting' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-400 animate-pulse font-light tracking-widest text-sm">{t('mvpChina.controls.connecting')}</p>
                </div>
              )}

              {status === 'ready' && (
                <>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end z-20">
                    <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 text-[10px] space-y-1 font-mono w-64">
                      <div className="text-gray-400 flex justify-between">
                        <span># SYSTEM_LOG</span>
                        <span className="text-[8px] opacity-50 tracking-tighter">CHINA_v2</span>
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

                  {/* 核心修复：显著的对话启动按钮 */}
                  {!isListening && !isTalking && (
                    <button
                      onClick={toggleVoiceInput}
                      className="absolute inset-x-0 mx-auto w-fit bottom-32 bg-amber-500/90 hover:bg-amber-400 text-black px-8 py-3 rounded-full font-bold shadow-2xl transition-all active:scale-95 flex items-center gap-3 animate-bounce-subtle z-30"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                      </svg>
                      {t('companion.chat.startVoiceChat')}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* 右侧：聊天对话区 */}
        <div className="w-full md:w-[400px] flex flex-col bg-[#12121A] rounded-3xl border border-white/5 shadow-2xl relative">
          <div className="p-6 border-b border-white/5">
            <h3 className="font-bold flex items-center gap-2 text-amber-500 uppercase tracking-widest text-sm">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
              {t('mvpChina.chat.title')}
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-600 text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 opacity-20">💬</div>
                <p className="text-xs tracking-wider">{t('mvpChina.chat.ready')}</p>
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
                onKeyPress={(e) => e.key === 'Enter' && !isTalking && handleSendMessage(inputValue.trim())}
                placeholder={status === 'ready' ? (isListening ? '正在监听...' : t('mvpChina.chat.placeholder')) : t('mvpChina.chat.waitConnect')}
                disabled={status !== 'ready' || isTalking}
                className="w-full bg-gray-900/50 border border-white/10 rounded-2xl px-5 py-4 pr-24 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all placeholder:text-gray-600 disabled:opacity-50"
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

export default MVPChinaPage;