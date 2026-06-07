import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Camera, Database, FileAudio, GitBranch, Image as ImageIcon, Landmark, Maximize2, MessageSquare, Mic, MicOff, Minimize2, Play, RefreshCw, Send, ShieldCheck, Sparkles, Square, Upload, Video, Volume2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

async function authedFetch(session, url, options = {}) {
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
    Authorization: `Bearer ${session?.access_token}`
  };
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `请求失败: ${response.status}`);
  }
  return response;
}

const stepCopy = [
  ['账号', '登录后创建或读取默认 profile'],
  ['声音', '上传 3-5 秒微信语音或现场录音'],
  ['克隆', '转写参考文本并生成 CosyVoice2 音色 URI'],
  ['记忆', '把文本/语音/照片整理成 memory_fragment'],
  ['对话', 'LLM 生成回复，再用克隆声音输出']
];

const captureModes = [
  {
    id: 'relationship',
    title: '关系图谱采集',
    icon: GitBranch,
    prompt: '请写下一个对你很重要的人：你们是什么关系？你们之间最常被想起的一件小事是什么？',
    note: '人物、关系、亲疏、称呼、情感强度'
  },
  {
    id: 'life_stage',
    title: '人生阶段采集',
    icon: Landmark,
    prompt: '请选择一个人生阶段，比如童年、求学、工作、婚恋、迁徙。那段时间最能代表你的一个场景是什么？',
    note: '童年、求学、工作、婚恋、迁徙、告别'
  },
  {
    id: 'object_photo',
    title: '物件/照片触发',
    icon: Box,
    prompt: '想起一张照片或一个旧物件。它现在在哪里？它让你想起谁、哪一天、什么声音或气味？',
    note: '照片、旧物、声音、气味、地点线索'
  }
];

const defaultEmotionState = {
  emotion_label: 'neutral',
  intensity: 2,
  tone: 'calm',
  speaking_style: '平静、温柔、自然',
  tts_prompt: 'Calm and warm',
  visual_mood: 'neutral',
  reason: '等待对话'
};

const emotionVisuals = {
  joy: { rgb: '245,197,66', label: '喜悦' },
  sadness: { rgb: '79,140,255', label: '怀念/低落' },
  anger: { rgb: '239,68,68', label: '严肃' },
  fear: { rgb: '139,92,246', label: '不安' },
  surprise: { rgb: '34,197,94', label: '惊喜' },
  neutral: { rgb: '16,185,129', label: '平静' },
  warm: { rgb: '245,197,66', label: '温暖' },
  blue: { rgb: '79,140,255', label: '安静' },
  red: { rgb: '239,68,68', label: '强烈' },
  green: { rgb: '34,197,94', label: '轻快' }
};

function audioBufferToWav(audioBuffer) {
  const channels = Math.min(2, audioBuffer.numberOfChannels);
  const sampleRate = audioBuffer.sampleRate;
  const samples = audioBuffer.length;
  const blockAlign = channels * 2;
  const buffer = new ArrayBuffer(44 + samples * blockAlign);
  const view = new DataView(buffer);
  let offset = 0;

  const writeString = (value) => {
    for (let i = 0; i < value.length; i += 1) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
    offset += value.length;
  };

  writeString('RIFF');
  view.setUint32(offset, 36 + samples * blockAlign, true); offset += 4;
  writeString('WAVE');
  writeString('fmt ');
  view.setUint32(offset, 16, true); offset += 4;
  view.setUint16(offset, 1, true); offset += 2;
  view.setUint16(offset, channels, true); offset += 2;
  view.setUint32(offset, sampleRate, true); offset += 4;
  view.setUint32(offset, sampleRate * blockAlign, true); offset += 4;
  view.setUint16(offset, blockAlign, true); offset += 2;
  view.setUint16(offset, 16, true); offset += 2;
  writeString('data');
  view.setUint32(offset, samples * blockAlign, true); offset += 4;

  for (let i = 0; i < samples; i += 1) {
    for (let channel = 0; channel < channels; channel += 1) {
      const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

async function recordedBlobToWavFile(blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) throw new Error('AudioContext unsupported');
  const context = new AudioContextCtor();
  try {
    const audioBuffer = await context.decodeAudioData(arrayBuffer.slice(0));
    const wavBlob = audioBufferToWav(audioBuffer);
    return new File([wavBlob], `voice-sample-${Date.now()}.wav`, { type: 'audio/wav' });
  } finally {
    await context.close().catch(() => {});
  }
}

function takeSpeakableSentence(buffer, force = false) {
  const text = buffer.trimStart();
  if (!text) return null;
  const match = text.match(/^(.{8,}?[。！？!?；;]|.{16,}?[，,、])/);
  if (match) {
    const sentence = match[0].trim();
    return { sentence, rest: text.slice(match[0].length) };
  }
  if (force && text.trim()) return { sentence: text.trim(), rest: '' };
  if (text.length >= 28) return { sentence: text.slice(0, 28).trim(), rest: text.slice(28) };
  return null;
}

const MVPChinaPage = () => {
  const { user, session } = useAuth();
  const [profile, setProfile] = useState(null);
  const [booting, setBooting] = useState(true);
  const [setupError, setSetupError] = useState('');
  const [voiceFile, setVoiceFile] = useState(null);
  const [cloneState, setCloneState] = useState('idle');
  const [transcript, setTranscript] = useState('');
  const [memoryText, setMemoryText] = useState('');
  const [memoryState, setMemoryState] = useState('idle');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('你能用刚才上传的声音跟我打个招呼吗？');
  const [chatState, setChatState] = useState('idle');
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [captureMode, setCaptureMode] = useState(captureModes[0]);
  const [interviewQuestion, setInterviewQuestion] = useState('');
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [visualUrl, setVisualUrl] = useState('');
  const [visualType, setVisualType] = useState('avatar');
  const [visualState, setVisualState] = useState('idle');
  const [audioLevel, setAudioLevel] = useState(0);
  const [emotionState, setEmotionState] = useState(defaultEmotionState);
  const [callFullscreen, setCallFullscreen] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [listening, setListening] = useState(false);
  const [streamingReply, setStreamingReply] = useState(false);
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const animationRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const fileRef = useRef(null);
  const visualFileRef = useRef(null);
  const voiceFileRef = useRef(null);
  const callShellRef = useRef(null);
  const userVideoRef = useRef(null);
  const cameraStreamRef = useRef(null);
  const recognitionRef = useRef(null);
  const streamAbortRef = useRef(null);
  const ttsQueueRef = useRef([]);
  const ttsPlayingRef = useRef(false);
  const sentenceBufferRef = useRef('');

  const hasVoice = Boolean(profile?.elevenlabs_voice_id);
  const activeEmotionVisual = emotionVisuals[emotionState.visual_mood] || emotionVisuals[emotionState.emotion_label] || emotionVisuals.neutral;
  const flowProgress = useMemo(() => {
    let count = 1;
    if (profile) count += 1;
    if (voiceFile || profile?.voice_sample_url) count += 1;
    if (hasVoice) count += 1;
    if (messages.length) count += 1;
    return Math.min(5, count);
  }, [hasVoice, messages.length, profile, voiceFile]);

  const loadOrCreateProfile = useCallback(async () => {
    if (!session) return;
    setBooting(true);
    setSetupError('');
    try {
      const response = await authedFetch(session, '/api/profiles');
      const data = await response.json();
      if (data.profiles?.[0]) {
        setProfile(data.profiles[0]);
        return;
      }
      const created = await authedFetch(session, '/api/profiles', {
        method: 'POST',
        body: JSON.stringify({
          display_name: user?.user_metadata?.nickname || user?.email?.split('@')[0] || '我的数字人',
          description: '用于 UploadSoul 内部测试的默认数字人档案。'
        })
      });
      const createdData = await created.json();
      setProfile(createdData.profile);
    } catch (error) {
      setSetupError(error.message);
      toast.error(error.message);
    } finally {
      setBooting(false);
    }
  }, [session, user]);

  useEffect(() => {
    loadOrCreateProfile();
  }, [loadOrCreateProfile]);

  useEffect(() => {
    if (profile?.avatar_url && !visualUrl) {
      setVisualUrl(profile.avatar_url);
      setVisualType(profile.avatar_url.match(/\.(mp4|webm|mov)(\?|$)/i) ? 'video' : 'avatar');
    }
  }, [profile, visualUrl]);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    streamAbortRef.current?.abort();
    audioContextRef.current?.close?.();
    recorderRef.current?.stream?.getTracks?.().forEach(track => track.stop());
    cameraStreamRef.current?.getTracks?.().forEach(track => track.stop());
    recognitionRef.current?.stop?.();
  }, []);

  const startRecording = async () => {
    if (recording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferredMimeType = MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
        ? 'audio/ogg;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : '';
      const recorder = new MediaRecorder(stream, preferredMimeType ? { mimeType: preferredMimeType } : undefined);
      recorderRef.current = recorder;
      chunksRef.current = [];
      setRecordSeconds(0);
      recorder.ondataavailable = event => {
        if (event.data.size) chunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        try {
          const file = await recordedBlobToWavFile(blob);
          setVoiceFile(file);
          voiceFileRef.current = file;
          toast.success('录音已转换为 wav，正在生成克隆声音');
          if (profile?.id) {
            cloneVoice(file).catch(() => {});
          }
        } catch (error) {
          console.error('Recorded audio conversion failed:', error);
          toast.error('录音转 wav 失败，请改用 mp3/wav 文件上传');
        } finally {
          stream.getTracks().forEach(track => track.stop());
        }
      };
      recorder.start();
      setRecording(true);
      timerRef.current = setInterval(() => {
        setRecordSeconds(prev => {
          if (prev >= 4) {
            stopRecording();
            return 5;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      toast.error(`无法打开麦克风：${error.message}`);
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.stop();
    }
    setRecording(false);
  };

  useEffect(() => {
    voiceFileRef.current = voiceFile;
  }, [voiceFile]);

  const cloneVoice = async (fileOverride = null) => {
    const fileToClone = fileOverride || voiceFileRef.current;
    if (!profile?.id || !fileToClone) {
      toast.error('请先选择或录制一段声音样本');
      return;
    }
    setCloneState('working');
    try {
      const form = new FormData();
      form.append('profile_id', profile.id);
      form.append('file', fileToClone);
      const response = await authedFetch(session, '/api/voice/clone', { method: 'POST', body: form });
      const data = await response.json();
      const nextProfile = {
        ...(data.profile || profile),
        elevenlabs_voice_id: data.voice_uri || data.profile?.elevenlabs_voice_id || profile?.elevenlabs_voice_id
      };
      setProfile(nextProfile);
      setTranscript(data.transcript || '');
      setMemoryText(data.transcript || '');
      toast.success('声音克隆完成，后续对话将使用该声线');
      setCloneState('done');
      return nextProfile;
    } catch (error) {
      toast.error(error.message);
      setCloneState('error');
      throw error;
    }
  };

  const saveMemory = async () => {
    if (!profile?.id || !memoryText.trim()) {
      toast.error('先输入一段要写入记忆系统的内容');
      return;
    }
    setMemoryState('working');
    try {
      const form = new FormData();
      form.append('profile_id', profile.id);
      form.append('content_type', 'diary');
      form.append('text', `采集入口：${captureMode.title}\n${memoryText.trim()}`);
      const response = await authedFetch(session, '/api/memory/upload', { method: 'POST', body: form });
      await response.json();
      toast.success('记忆片段已写入采集层');
      setMemoryState('done');
    } catch (error) {
      toast.error(error.message);
      setMemoryState('error');
    }
  };

  const ensureAudioContext = () => {
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) throw new Error('AudioContext unsupported');
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new AudioContextCtor();
      analyserRef.current = null;
      sourceRef.current = null;
    }
    return audioContextRef.current;
  };

  const monitorAudio = (audio) => {
    try {
      const audioContext = ensureAudioContext();
      if (!analyserRef.current) {
        analyserRef.current = audioContext.createAnalyser();
        analyserRef.current.fftSize = 128;
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
      sourceRef.current = audioContext.createMediaElementSource(audio);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContext.destination);
      const data = new Uint8Array(analyserRef.current.frequencyBinCount);
      const tick = () => {
        analyserRef.current.getByteFrequencyData(data);
        const avg = data.reduce((sum, value) => sum + value, 0) / data.length;
        setAudioLevel(Math.min(1, avg / 120));
        animationRef.current = requestAnimationFrame(tick);
      };
      tick();
      return audioContext;
    } catch (error) {
      console.warn('Audio visualizer unavailable:', error.message);
      return null;
    }
  };

  const updateVisual = async (file) => {
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setVisualUrl(localUrl);
    setVisualType(file.type.startsWith('video') ? 'video' : 'avatar');

    if (!profile?.id) return;
    try {
      const signatureResponse = await authedFetch(session, '/api/cloudinary/signature', {
        method: 'POST',
        body: JSON.stringify({ folder: `user_content/${user.id}` })
      });
      const signatureData = await signatureResponse.json();
      const resourceType = file.type.startsWith('video') ? 'video' : 'image';
      const form = new FormData();
      form.append('file', file);
      form.append('api_key', signatureData.apiKey);
      form.append('timestamp', signatureData.timestamp.toString());
      form.append('signature', signatureData.signature);
      form.append('folder', signatureData.folder);
      const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${signatureData.cloudName}/${resourceType}/upload`, {
        method: 'POST',
        body: form
      });
      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) throw new Error(uploadData.error?.message || '形象上传失败');
      const patchResponse = await authedFetch(session, '/api/profiles', {
        method: 'PATCH',
        body: JSON.stringify({ id: profile.id, avatar_url: uploadData.secure_url })
      });
      const patchData = await patchResponse.json();
      setProfile(patchData.profile);
      setVisualUrl(uploadData.secure_url);
      toast.success('数字人形象已保存');
    } catch (error) {
      toast.error(`形象仅本地预览：${error.message}`);
    }
  };

  const askInterviewQuestion = async () => {
    if (!profile?.id || interviewLoading) return;
    setInterviewLoading(true);
    try {
      const response = await authedFetch(session, '/api/memory/interview/next', {
        method: 'POST',
        body: JSON.stringify({
          profile_id: profile.id,
          mode: captureMode.id,
          history: memoryText ? [{ role: 'user', content: memoryText }] : []
        })
      });
      const data = await response.json();
      setInterviewQuestion(data.question);
      setMemoryText(prev => prev ? `${prev}\n\nAI追问：${data.question}\n我的回答：` : `AI追问：${data.question}\n我的回答：`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setInterviewLoading(false);
    }
  };

  const speakText = async (text, emotion = emotionState, profileOverride = null) => {
    setVisualState('thinking');
    try {
      const activeProfile = profileOverride || profile;
      const voiceUri = activeProfile?.elevenlabs_voice_id;
      if (!voiceUri) throw new Error('当前档案还没有克隆 voice uri，请先重新生成克隆声音');
      const response = await authedFetch(session, '/api/voice/speech', {
        method: 'POST',
        body: JSON.stringify({ profile_id: activeProfile.id, text, emotion, voice_uri: voiceUri })
      });
      const data = await response.json();
      if (!data.audio) throw new Error('语音接口没有返回音频');
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(data.audio);
      audioRef.current = audio;
      audio.volume = 1;
      audio.muted = false;
      audio.onplay = () => setVisualState('speaking');
      audio.onended = () => {
        setVisualState('idle');
        setAudioLevel(0);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
      audio.onerror = () => {
        setVisualState('idle');
        setAudioLevel(0);
        toast.error('浏览器无法解码这段语音，请查看后端日志');
      };
      const audioContext = monitorAudio(audio);
      if (audioContext?.state === 'suspended') {
        await audioContext.resume();
      }
      await audio.play();
    } catch (error) {
      setVisualState('idle');
      setAudioLevel(0);
      toast.error(`语音播放失败：${error.message}`);
      throw error;
    }
  };

  const stopSpeaking = () => {
    streamAbortRef.current?.abort();
    streamAbortRef.current = null;
    ttsQueueRef.current = [];
    ttsPlayingRef.current = false;
    sentenceBufferRef.current = '';
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setAudioLevel(0);
    setVisualState('idle');
    setStreamingReply(false);
  };

  const playTtsQueue = async (activeProfile) => {
    if (ttsPlayingRef.current) return;
    ttsPlayingRef.current = true;
    try {
      while (ttsQueueRef.current.length) {
        const next = ttsQueueRef.current.shift();
        if (next?.text) await speakText(next.text, next.emotion || emotionState, activeProfile);
      }
    } finally {
      ttsPlayingRef.current = false;
    }
  };

  const enqueueSentenceForSpeech = (text, emotion, activeProfile) => {
    const cleaned = text.trim();
    if (!cleaned) return;
    ttsQueueRef.current.push({ text: cleaned, emotion });
    playTtsQueue(activeProfile).catch(error => console.warn('TTS queue failed:', error.message));
  };

  const flushSentenceBuffer = (emotion, activeProfile, force = false) => {
    let picked = takeSpeakableSentence(sentenceBufferRef.current, force);
    while (picked) {
      enqueueSentenceForSpeech(picked.sentence, emotion, activeProfile);
      sentenceBufferRef.current = picked.rest;
      picked = takeSpeakableSentence(sentenceBufferRef.current, force);
    }
  };

  const sendMessage = async () => {
    if (!profile?.id || !input.trim() || chatState === 'working') return;
    const text = input.trim();
    stopSpeaking();
    setInput('');
    const assistantId = `assistant-${Date.now()}`;
    setMessages(prev => [...prev, { role: 'user', text }, { id: assistantId, role: 'assistant', text: '' }]);
    setChatState('working');
    setStreamingReply(true);
    setVisualState('thinking');
    try {
      let activeProfile = profile;
      if (!activeProfile?.elevenlabs_voice_id && voiceFileRef.current) {
        toast('正在先生成克隆声音...');
        activeProfile = await cloneVoice(voiceFileRef.current);
      }
      if (!activeProfile?.elevenlabs_voice_id) {
        throw new Error('当前档案还没有克隆 voice uri，请先录音并等待克隆完成');
      }
      const controller = new AbortController();
      streamAbortRef.current = controller;
      const response = await authedFetch(session, '/api/test-chat-stream', {
        method: 'POST',
        body: JSON.stringify({ profile_id: activeProfile.id, message: text }),
        signal: controller.signal
      });
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let nextEmotion = emotionState;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';
        events.forEach(event => {
          const line = event.split('\n').find(row => row.startsWith('data: '));
          if (!line) return;
          const payload = JSON.parse(line.slice(6));
          if (payload.type === 'emotion') {
            nextEmotion = payload.emotion || defaultEmotionState;
            setEmotionState(nextEmotion);
          }
          if (payload.type === 'token') {
            sentenceBufferRef.current += payload.text;
            setMessages(prev => prev.map(item => (
              item.id === assistantId ? { ...item, text: `${item.text || ''}${payload.text}`, emotion: nextEmotion } : item
            )));
            flushSentenceBuffer(nextEmotion, activeProfile, false);
          }
          if (payload.type === 'done') {
            flushSentenceBuffer(nextEmotion, activeProfile, true);
          }
          if (payload.type === 'error') throw new Error(payload.error);
        });
      }
      flushSentenceBuffer(nextEmotion, activeProfile, true);
      setChatState('done');
    } catch (error) {
      if (error.name !== 'AbortError') toast.error(error.message);
      setMessages(prev => prev.map(item => (
        item.id === assistantId && !item.text ? { ...item, text: `测试失败：${error.message}` } : item
      )));
      setChatState('error');
      setVisualState('idle');
      setAudioLevel(0);
    } finally {
      streamAbortRef.current = null;
      setStreamingReply(false);
    }
  };

  const playLastReply = async () => {
    const last = [...messages].reverse().find(item => item.role === 'assistant');
    if (last?.text) await speakText(last.text);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && callShellRef.current) {
        await callShellRef.current.requestFullscreen();
        setCallFullscreen(true);
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
        setCallFullscreen(false);
      }
    } catch (error) {
      toast.error(`全屏失败：${error.message}`);
    }
  };

  useEffect(() => {
    const onFullscreen = () => setCallFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFullscreen);
    return () => document.removeEventListener('fullscreenchange', onFullscreen);
  }, []);

  const toggleCamera = async () => {
    if (cameraOn) {
      cameraStreamRef.current?.getTracks?.().forEach(track => track.stop());
      cameraStreamRef.current = null;
      if (userVideoRef.current) userVideoRef.current.srcObject = null;
      setCameraOn(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 360, facingMode: 'user' }, audio: false });
      cameraStreamRef.current = stream;
      setCameraOn(true);
      setTimeout(() => {
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
          userVideoRef.current.play().catch(() => {});
        }
      }, 0);
    } catch (error) {
      toast.error(`无法打开摄像头：${error.message}`);
    }
  };

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('当前浏览器不支持语音输入');
      return;
    }
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = event => {
      setListening(false);
      toast.error(`语音识别失败：${event.error}`);
    };
    recognition.onresult = event => {
      const text = event.results?.[0]?.[0]?.transcript || '';
      if (text.trim()) setInput(text.trim());
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className="min-h-screen bg-[#080b10] text-white pt-20">
      <style>{`
        .test-shell { background: radial-gradient(circle at 18% 8%, rgba(16,185,129,.16), transparent 28%), radial-gradient(circle at 82% 0%, rgba(245,197,66,.12), transparent 24%), #080b10; }
        .test-panel { background: rgba(255,255,255,.045); border: 1px solid rgba(255,255,255,.09); border-radius: 8px; }
        .test-input { background: rgba(255,255,255,.055); border: 1px solid rgba(255,255,255,.12); border-radius: 8px; color: white; outline: none; }
        .test-input:focus { border-color: rgba(245,197,66,.65); box-shadow: 0 0 0 3px rgba(245,197,66,.1); }
      `}</style>
      <div className="test-shell min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-emerald-300/75 mb-3">UploadSoul Test Module</div>
              <h1 className="text-3xl md:text-4xl font-bold">数字重生 / 数字永生流程测试舱</h1>
              <p className="text-white/56 mt-3 max-w-3xl">这里验证从注册登录、默认档案、3-5 秒声音样本、CosyVoice2 克隆、记忆采集，到数字人用同一声线回答的完整闭环。</p>
            </div>
            <button onClick={loadOrCreateProfile} className="px-4 py-2 rounded-lg border border-white/10 text-white/75 hover:text-white flex items-center gap-2">
              <RefreshCw size={16} /> 刷新档案
            </button>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
            {stepCopy.map((step, index) => (
              <div key={step[0]} className={`test-panel p-4 ${index < flowProgress ? 'border-emerald-300/35' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold mb-3 ${index < flowProgress ? 'bg-emerald-300 text-black' : 'bg-white/10 text-white/45'}`}>{index + 1}</div>
                <div className="font-semibold">{step[0]}</div>
                <div className="text-xs text-white/45 mt-1">{step[1]}</div>
              </div>
            ))}
          </section>

          {setupError && (
            <section className="test-panel p-4 mb-6 border-red-400/30 bg-red-500/8">
              <div className="font-semibold text-red-200 mb-1">测试页初始化失败</div>
              <div className="text-sm text-white/65">{setupError}</div>
              <div className="text-xs text-white/42 mt-2">通常是 Supabase SQL 尚未完整执行、profiles 表不存在、RLS/Service Role 配置未完成，或本地 Vite 没有连到 Vercel API。</div>
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
            <aside className="space-y-6">
              <section className="test-panel p-5">
                <div className="flex items-center gap-2 mb-4"><ShieldCheck size={18} className="text-emerald-300" /><h2 className="font-semibold">当前测试档案</h2></div>
                {booting ? (
                  <div className="text-sm text-white/45">正在初始化 profile...</div>
                ) : (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between gap-4"><span className="text-white/45">登录账号</span><span className="text-right">{user?.email}</span></div>
                    <div className="flex justify-between gap-4"><span className="text-white/45">档案名</span><span>{profile?.display_name}</span></div>
                    <div className="flex justify-between gap-4"><span className="text-white/45">声音状态</span><span className={hasVoice ? 'text-emerald-300' : 'text-amber-300'}>{hasVoice ? '已克隆' : '未初始化'}</span></div>
                    {hasVoice && <div className="text-xs text-white/40 break-all pt-2 border-t border-white/10">{profile.elevenlabs_voice_id}</div>}
                  </div>
                )}
              </section>

              <section className="test-panel p-5">
                <div className="flex items-center gap-2 mb-4"><FileAudio size={18} className="text-amber-200" /><h2 className="font-semibold">声音初始化</h2></div>
                <div className="space-y-3">
                  <input
                    ref={fileRef}
                    className="hidden"
                    type="file"
                    accept="audio/*,.mp3,.wav,.opus,.ogg"
                    onChange={event => setVoiceFile(event.target.files?.[0] || null)}
                  />
                  <button onClick={() => fileRef.current?.click()} className="w-full px-4 py-3 rounded-lg border border-white/10 hover:border-amber-200/40 flex items-center justify-center gap-2">
                    <Upload size={17} /> 上传微信语音/短音频
                  </button>
                  <button onClick={recording ? stopRecording : startRecording} className={`w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2 ${recording ? 'bg-red-500 text-white' : 'bg-white/8 border border-white/10'}`}>
                    <Mic size={17} /> {recording ? `录音中 ${recordSeconds}s，点击停止` : '现场录 5 秒'}
                  </button>
                  {voiceFile && <div className="text-xs text-white/55 border border-white/10 rounded-lg p-3">{voiceFile.name} · {(voiceFile.size / 1024 / 1024).toFixed(2)} MB</div>}
                  <div className="text-[11px] text-white/38 leading-relaxed">正式验证优先上传 mp3 / wav / opus。浏览器现场录音会尽量使用 ogg-opus，部分浏览器可能退回 webm。</div>
                  <button onClick={cloneVoice} disabled={!voiceFile || cloneState === 'working'} className="w-full px-4 py-3 rounded-lg bg-amber-300 text-black font-semibold disabled:opacity-55">
                    {cloneState === 'working' ? '转写并克隆中...' : '生成克隆声音'}
                  </button>
                  {transcript && <div className="text-xs text-white/55 border border-white/10 rounded-lg p-3">转写结果：{transcript}</div>}
                </div>
              </section>
            </aside>

            <main className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
              <section ref={callShellRef} className={`test-panel p-5 min-h-[640px] flex flex-col ${callFullscreen ? 'bg-[#080b10] w-screen h-screen max-w-none p-6' : ''}`}>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={18} className="text-emerald-300" />
                    <h2 className="font-semibold">对话与声音输出测试</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={toggleCamera} className={`w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center ${cameraOn ? 'bg-emerald-300 text-black' : 'text-white/70 hover:text-white'}`} title="摄像头">
                      <Camera size={16} />
                    </button>
                    <button onClick={toggleFullscreen} className="w-9 h-9 rounded-lg border border-white/10 text-white/70 hover:text-white flex items-center justify-center" title="全屏">
                      {callFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                  </div>
                </div>
                <div className="test-panel overflow-hidden mb-4">
                  <div className="relative aspect-[16/10] bg-black flex items-center justify-center">
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        background: `radial-gradient(circle at 50% 42%, rgba(${activeEmotionVisual.rgb},${0.12 + audioLevel * 0.38}), transparent 32%), radial-gradient(circle at 50% 100%, rgba(${activeEmotionVisual.rgb},.12), transparent 38%)`
                      }}
                    />
                    {visualUrl ? (
                      visualType === 'video' ? (
                        <video src={visualUrl} className="relative z-10 w-full h-full object-cover" autoPlay loop muted playsInline />
                      ) : (
                        <img
                          src={visualUrl}
                          alt="digital avatar"
                          className="relative z-10 w-44 h-44 rounded-full object-cover border border-white/15 shadow-2xl transition-transform duration-150"
                          style={{ transform: `scale(${1 + audioLevel * 0.045})` }}
                        />
                      )
                    ) : (
                      <div
                        className="relative z-10 w-44 h-44 rounded-full border border-emerald-200/25 bg-gradient-to-br from-emerald-300/20 via-white/8 to-amber-200/12 flex items-center justify-center text-5xl font-serif text-white/70 shadow-2xl transition-transform duration-150"
                        style={{ transform: `scale(${1 + audioLevel * 0.045})` }}
                      >
                        {profile?.display_name?.slice(0, 1) || 'U'}
                      </div>
                    )}
                    <div className="absolute left-4 right-4 bottom-4 z-20">
                      <div className="flex items-end justify-center gap-1 h-12">
                        {Array.from({ length: 32 }).map((_, index) => {
                          const wave = Math.sin(index * 0.65 + audioLevel * 8);
                          const h = visualState === 'speaking'
                            ? 12 + Math.abs(wave) * 18 + audioLevel * 42
                            : visualState === 'thinking'
                              ? 8 + (index % 4) * 3
                              : 6;
                          return <span key={index} className="w-1.5 rounded-full" style={{ height: `${h}px`, opacity: visualState === 'idle' ? 0.28 : 0.85, backgroundColor: `rgba(${activeEmotionVisual.rgb}, .85)` }} />;
                        })}
                      </div>
                      <div className="text-center text-xs text-white/50 mt-2">
                        {visualState === 'speaking' ? '正在用克隆声线说话' : visualState === 'thinking' ? '正在组织记忆与回答' : '待机中'}
                      </div>
                    </div>
                    {cameraOn && (
                      <div className="absolute right-4 top-4 z-30 w-32 md:w-44 aspect-[4/3] rounded-lg overflow-hidden border border-white/20 bg-black shadow-xl">
                        <video ref={userVideoRef} className="w-full h-full object-cover scale-x-[-1]" muted playsInline autoPlay />
                        <div className="absolute left-2 bottom-1 text-[10px] text-white/70">你</div>
                      </div>
                    )}
                  </div>
                  <div className="p-3 grid grid-cols-2 gap-2">
                    <input
                      ref={visualFileRef}
                      type="file"
                      accept="image/*,video/mp4,video/webm"
                      className="hidden"
                      onChange={event => updateVisual(event.target.files?.[0])}
                    />
                    <button onClick={() => visualFileRef.current?.click()} className="px-3 py-2 rounded-lg border border-white/10 text-white/70 hover:text-white flex items-center justify-center gap-2 text-sm">
                      <ImageIcon size={15} /> 上传照片/短视频
                    </button>
                    <button onClick={() => setVisualType(visualType === 'video' ? 'avatar' : 'video')} className="px-3 py-2 rounded-lg border border-white/10 text-white/70 hover:text-white flex items-center justify-center gap-2 text-sm">
                      <Video size={15} /> {visualType === 'video' ? '头像模式' : '循环视频模式'}
                    </button>
                  </div>
                  <div className="mx-3 mb-3 p-3 rounded-lg border border-white/10 bg-white/5">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-white/45">情绪感知</span>
                      <span className="font-semibold" style={{ color: `rgb(${activeEmotionVisual.rgb})` }}>
                        {activeEmotionVisual.label} · {emotionState.emotion_label} · {emotionState.intensity}/5
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-white/50 leading-relaxed">
                      {emotionState.speaking_style} · {emotionState.reason}
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {messages.length === 0 && (
                    <div className="test-panel p-5 text-sm text-white/52">完成声音初始化后，发送一句话。系统会先生成数字人回复，再用刚才克隆的声线播放。</div>
                  )}
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[82%] px-4 py-3 rounded-lg text-sm ${message.role === 'user' ? 'bg-amber-300 text-black' : 'bg-white/8 border border-white/10 text-white/82'}`}>{message.text}</div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex gap-2">
                    <button onClick={toggleListening} className={`w-11 h-11 rounded-lg border border-white/10 flex items-center justify-center ${listening ? 'bg-red-500 text-white' : 'text-white/70 hover:text-white'}`} title="语音输入">
                      {listening ? <MicOff size={17} /> : <Mic size={17} />}
                    </button>
                    <input
                      className="test-input flex-1 px-3 text-sm"
                      value={input}
                      onChange={event => setInput(event.target.value)}
                      onKeyDown={event => {
                        if (event.key === 'Enter') sendMessage();
                      }}
                      placeholder="输入测试问题..."
                    />
                    <button onClick={streamingReply ? stopSpeaking : sendMessage} disabled={!streamingReply && !input.trim()} className={`w-11 h-11 rounded-lg flex items-center justify-center disabled:opacity-55 ${streamingReply ? 'border border-white/10 text-white/80' : 'bg-emerald-300 text-black'}`}>
                      {streamingReply ? <Square size={15} /> : <Send size={17} />}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={playLastReply} disabled={!messages.some(item => item.role === 'assistant')} className="px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:text-white flex items-center gap-2 disabled:opacity-45">
                      <Volume2 size={16} /> 重播上一条
                    </button>
                    <button onClick={stopSpeaking} disabled={visualState !== 'speaking' && visualState !== 'thinking' && !streamingReply} className="px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:text-white flex items-center gap-2 disabled:opacity-45">
                      <Square size={15} /> 打断
                    </button>
                    <button onClick={toggleCamera} className="px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:text-white flex items-center gap-2">
                      <Camera size={15} /> {cameraOn ? '关闭摄像头' : '打开摄像头'}
                    </button>
                    <button onClick={toggleFullscreen} className="px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:text-white flex items-center gap-2">
                      {callFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />} {callFullscreen ? '退出全屏' : '全屏通话'}
                    </button>
                  </div>
                  {streamingReply && <div className="text-xs text-emerald-200/70">正在流式生成，数字人会按句子分段开口。</div>}
                </div>
              </section>

              <section className="test-panel p-5 min-h-[640px] flex flex-col">
                <div className="flex items-center gap-2 mb-4"><Database size={18} className="text-blue-300" /><h2 className="font-semibold">记忆采集测试</h2></div>
                <div className="grid grid-cols-1 gap-2 mb-4">
                  {captureModes.map(mode => {
                    const Icon = mode.icon;
                    const active = captureMode.id === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => {
                          setCaptureMode(mode);
                          setMemoryText(prev => prev || mode.prompt);
                        }}
                        className={`text-left p-3 rounded-lg border transition-all ${active ? 'border-emerald-300/45 bg-emerald-300/10' : 'border-white/10 bg-white/5 hover:border-white/20'}`}
                      >
                        <div className="flex items-center gap-2 font-semibold text-sm">
                          <Icon size={16} className={active ? 'text-emerald-300' : 'text-white/45'} />
                          {mode.title}
                        </div>
                        <div className="text-xs text-white/42 mt-1">{mode.note}</div>
                      </button>
                    );
                  })}
                </div>
                <div className="test-panel p-3 mb-3">
                  <div className="flex items-center gap-2 text-sm font-semibold mb-2"><Sparkles size={16} className="text-emerald-300" />AI 访谈开门问题</div>
                  <div className="text-xs text-white/50 leading-relaxed">{interviewQuestion || captureMode.prompt}</div>
                  <button
                    onClick={askInterviewQuestion}
                    disabled={!profile?.id || interviewLoading}
                    className="mt-3 px-3 py-2 rounded-lg bg-emerald-300 text-black text-sm font-semibold disabled:opacity-50"
                  >
                    {interviewLoading ? '生成追问中...' : '让 AI 继续追问'}
                  </button>
                </div>
                <textarea
                  className="test-input w-full min-h-[180px] p-3 text-sm resize-none"
                  value={memoryText}
                  onChange={event => setMemoryText(event.target.value)}
                  placeholder="把刚才语音转写、微信聊天、日记片段粘贴到这里，写入 memory_fragments..."
                />
                <button onClick={saveMemory} disabled={memoryState === 'working'} className="mt-3 px-4 py-3 rounded-lg bg-blue-300 text-black font-semibold disabled:opacity-55">
                  {memoryState === 'working' ? '写入中...' : '写入记忆系统'}
                </button>
                <div className="mt-5 space-y-3 text-sm text-white/55">
                  <div className="test-panel p-3"><span className="text-white/85">设计结论：</span>上传声音是能力解锁，不是浏览前置门槛。</div>
                  <div className="test-panel p-3"><span className="text-white/85">数字永生：</span>用户本人上传声音与记忆，形成自我数字分身。</div>
                  <div className="test-panel p-3"><span className="text-white/85">数字重生：</span>家人上传旧语音、照片、访谈与记忆，形成纪念型数字人。</div>
                  <div className="test-panel p-3"><span className="text-white/85">统一底座：</span>两个板块最终都落到同一套 profile、memory_fragments、voice_uri。</div>
                </div>
                <button onClick={() => profile?.elevenlabs_voice_id && navigator.clipboard?.writeText(profile.elevenlabs_voice_id)} className="mt-auto px-4 py-2 rounded-lg border border-white/10 text-white/65 hover:text-white flex items-center justify-center gap-2">
                  <Play size={15} /> 复制当前 voice URI
                </button>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MVPChinaPage;
