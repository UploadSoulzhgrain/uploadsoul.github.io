import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Camera, Database, FileAudio, GitBranch, Image as ImageIcon, Landmark, Maximize2, MessageSquare, Mic, MicOff, Minimize2, RefreshCw, Send, ShieldCheck, Sparkles, Square, Upload, Video, Volume2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
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

const defaultEmotionState = {
  emotion_label: 'neutral',
  intensity: 2,
  tone: 'calm',
  speaking_style: '平静、温柔、自然',
  tts_prompt: 'Calm and warm',
  visual_mood: 'neutral',
  reason: '等待对话'
};

const captureModeIcons = {
  relationship: GitBranch,
  life_stage: Landmark,
  object_photo: Box
};

const mvpCopy = {
  zh: {
    moduleLabel: 'UploadSoul 测试模块',
    title: '数字重生 / 数字永生流程测试舱',
    subtitle: '这里验证从登录、创建档案、上传短声音样本、采集记忆，到数字人用相似声线自然回应的完整体验。',
    refreshProfile: '刷新档案',
    language: '语言',
    steps: [
      ['账号', '登录后创建或读取默认档案'],
      ['声音', '上传 3-5 秒语音或现场录音'],
      ['声线', '提取声音特征，准备专属声线'],
      ['记忆', '整理文本、语音、照片中的记忆线索'],
      ['对话', '数字人结合记忆，用专属声线回应']
    ],
    setupFailedTitle: '页面初始化失败',
    setupFailedHint: '请确认当前账号已登录，并稍后重试。如仍失败，请联系管理员检查服务配置。',
    profileTitle: '当前档案',
    initializingProfile: '正在准备档案...',
    account: '登录账号',
    profileName: '档案名',
    voiceStatus: '声音状态',
    voiceReady: '已准备好',
    voiceNotReady: '未初始化',
    voiceTitle: '声音初始化',
    uploadVoice: '上传语音/短音频',
    addVoiceSample: '添加声音素材',
    voiceLibrary: '声音素材库',
    voiceLibraryHint: '多条素材会帮助后续更稳定地还原说话习惯。当前阶段会优先采用你选中的清晰样本。',
    noVoiceSamples: '还没有添加声音素材',
    selected: '当前采用',
    useThisVoice: '采用这条声音',
    updateWithSelected: '用选中素材更新声音',
    recording: seconds => `录音中 ${seconds}s，点击停止`,
    recordFive: '现场录 5 秒',
    audioHint: '建议上传清晰、安静、无背景音乐的短音频。现场录音会自动整理成可用样本。',
    preparingVoice: '正在准备声线...',
    generateVoice: '生成专属声音',
    transcript: '识别结果',
    chatTitle: '对话与声音体验',
    camera: '摄像头',
    phoneMode: '电话模式',
    inCall: '通话中',
    fullscreen: '全屏',
    speaking: '正在用专属声线说话',
    thinking: '正在结合记忆组织回答',
    idle: '待机中',
    you: '你',
    uploadVisual: '上传照片/短视频',
    visualCaptureTitle: '形象采集',
    visualCaptureHint: '先采集照片和短视频素材。现在用于展示，后续有算力后可继续生成更完整的形象。',
    visualChecklist: ['正脸清晰照', '左右侧脸', '自然表情', '3-10 秒短视频'],
    visualLibrary: '形象素材',
    noVisualAssets: '还没有添加形象素材',
    setAsMainVisual: '设为当前形象',
    feedbackAccurate: '准确',
    feedbackNotLike: '不像',
    feedbackMissing: '缺少记忆',
    feedbackThanks: '已记录反馈',
    sourcePanelTitle: '记忆依据',
    sourcePanelHint: '最近一次回答参考的记忆会显示在这里。',
    sourceEmpty: '还没有可展示的记忆依据',
    sourceSimilarity: '相关度',
    sourceConfirmed: '已确认',
    portraitMode: '照片模式',
    loopVideoMode: '循环视频模式',
    emotionAwareness: '情绪感知',
    emptyChat: '完成声音初始化后，发送一句话。数字人会结合已采集的记忆，并用准备好的声线回应。',
    voiceInput: '语音输入',
    inputPlaceholder: '输入想说的话...',
    replayLast: '重播上一条',
    interrupt: '打断',
    openCamera: '打开摄像头',
    closeCamera: '关闭摄像头',
    hangupPhone: '挂断电话模式',
    enterPhone: '电话模式',
    exitFullscreen: '退出全屏',
    fullscreenCall: '全屏通话',
    generating: '正在生成回答，数字人会按自然语句分段开口。',
    phoneListening: '电话模式：正在听你说话，说完会自动发送。',
    phoneWaiting: '电话模式：数字人说完后会自动重新开麦。',
    memoryTitle: '记忆采集',
    interviewTitle: 'AI 访谈开门问题',
    generatingQuestion: '生成追问中...',
    askMore: '让 AI 继续追问',
    memoryPlaceholder: '把刚才的语音内容、聊天记录、日记片段粘贴到这里，保存为记忆线索...',
    savingMemory: '保存中...',
    saveMemory: '保存到记忆库',
    conclusionTitle: '设计结论：',
    conclusion: '上传声音是能力解锁，不是浏览前置门槛。',
    immortalityTitle: '数字永生：',
    immortality: '用户本人上传声音与记忆，形成自我数字分身。',
    rebirthTitle: '数字重生：',
    rebirth: '家人上传旧语音、照片、访谈与记忆，形成纪念型数字人。',
    foundationTitle: '统一体验：',
    foundation: '两个板块都围绕档案、记忆与声音资产沉淀。',
    defaultInput: '你能用刚才上传的声音跟我打个招呼吗？',
    defaultName: '我的数字人',
    defaultDescription: '用于 UploadSoul 内部测试的默认数字人档案。',
    captureModes: [
      { id: 'relationship', title: '关系图谱采集', prompt: '请写下一个对你很重要的人：你们是什么关系？你们之间最常被想起的一件小事是什么？', note: '人物、关系、亲疏、称呼、情感强度' },
      { id: 'life_stage', title: '人生阶段采集', prompt: '请选择一个人生阶段，比如童年、求学、工作、婚恋、迁徙。那段时间最能代表你的一个场景是什么？', note: '童年、求学、工作、婚恋、迁徙、告别' },
      { id: 'object_photo', title: '物件/照片触发', prompt: '想起一张照片或一个旧物件。它现在在哪里？它让你想起谁、哪一天、什么声音或气味？', note: '照片、旧物、声音、气味、地点线索' }
    ],
    emotions: { joy: '喜悦', sadness: '怀念/低落', anger: '强烈', fear: '不安', surprise: '惊喜', neutral: '平静', warm: '温暖', blue: '安静', red: '强烈', green: '轻快' },
    toasts: {
      recordingReady: '录音已整理完成，正在准备专属声音',
      recordingConvertFailed: '录音整理失败，请改用清晰的音频文件上传',
      micFailed: message => `无法打开麦克风：${message}`,
      chooseVoice: '请先选择或录制一段声音样本',
      sampleAdded: '声音素材已添加',
      voiceDone: '声音已准备好，后续对话将使用这条声线',
      memoryRequired: '先输入一段要保存的记忆内容',
      memorySaved: '记忆已保存',
      visualUploadFailed: '形象上传失败',
      visualAssetAdded: '形象素材已添加',
      visualSaved: '数字人形象已保存',
      feedbackSaved: '反馈已保存',
      visualLocalOnly: '形象已在本地预览，暂未保存到账号',
      voiceMissing: '当前档案还没有准备好声音，请先录音或上传音频',
      noAudio: '暂时没有生成语音，请稍后重试',
      audioDecodeFailed: '浏览器暂时无法播放这段语音，请稍后重试',
      audioPlayFailed: message => `语音播放失败：${message}`,
      preparingVoice: '正在先准备专属声音...',
      chatFailed: message => `体验失败：${message}`,
      fullscreenFailed: message => `全屏失败：${message}`,
      cameraFailed: message => `无法打开摄像头：${message}`,
      speechUnsupported: '当前浏览器不支持语音输入',
      speechFailed: error => `语音识别失败：${error}`,
      phoneOn: '电话模式已开启，说完一句会自动发送',
      phoneOff: '电话模式已关闭'
    }
  },
  en: {
    moduleLabel: 'UploadSoul Test Module',
    title: 'Digital Rebirth / Digital Immortality Test Studio',
    subtitle: 'Test the full experience: sign in, create a persona, add a short voice sample, collect memories, and let the digital person respond naturally in a familiar voice.',
    refreshProfile: 'Refresh persona',
    language: 'Language',
    steps: [
      ['Account', 'Create or load your default persona after sign-in'],
      ['Voice', 'Upload a 3-5 second clip or record live'],
      ['Voiceprint', 'Prepare a personal speaking voice'],
      ['Memory', 'Organize memory clues from text, voice, and photos'],
      ['Chat', 'The digital person responds with memory and voice']
    ],
    setupFailedTitle: 'Page setup failed',
    setupFailedHint: 'Please make sure you are signed in and try again. If it still fails, ask an administrator to check the service settings.',
    profileTitle: 'Current Persona',
    initializingProfile: 'Preparing persona...',
    account: 'Account',
    profileName: 'Persona name',
    voiceStatus: 'Voice status',
    voiceReady: 'Ready',
    voiceNotReady: 'Not set up',
    voiceTitle: 'Voice Setup',
    uploadVoice: 'Upload voice clip',
    addVoiceSample: 'Add voice sample',
    voiceLibrary: 'Voice Library',
    voiceLibraryHint: 'More samples help preserve speaking habits over time. For now, the selected clear sample is used first.',
    noVoiceSamples: 'No voice samples yet',
    selected: 'Selected',
    useThisVoice: 'Use this voice',
    updateWithSelected: 'Update voice with selected sample',
    recording: seconds => `Recording ${seconds}s, tap to stop`,
    recordFive: 'Record 5 seconds',
    audioHint: 'Use a clear short clip without background music. Live recording will be prepared automatically.',
    preparingVoice: 'Preparing voice...',
    generateVoice: 'Prepare personal voice',
    transcript: 'Recognized text',
    chatTitle: 'Conversation Experience',
    camera: 'Camera',
    phoneMode: 'Call mode',
    inCall: 'In call',
    fullscreen: 'Fullscreen',
    speaking: 'Speaking with the prepared voice',
    thinking: 'Thinking with collected memories',
    idle: 'Idle',
    you: 'You',
    uploadVisual: 'Upload photo/video',
    visualCaptureTitle: 'Appearance Capture',
    visualCaptureHint: 'Collect photos and short videos now. They are used for the current display and can support fuller generation later.',
    visualChecklist: ['Clear front photo', 'Left and right profile', 'Natural expressions', '3-10 second short video'],
    visualLibrary: 'Appearance Assets',
    noVisualAssets: 'No appearance assets yet',
    setAsMainVisual: 'Set as current look',
    feedbackAccurate: 'Accurate',
    feedbackNotLike: 'Not quite',
    feedbackMissing: 'Missing memory',
    feedbackThanks: 'Feedback saved',
    sourcePanelTitle: 'Memory Sources',
    sourcePanelHint: 'Memories used by the latest reply appear here.',
    sourceEmpty: 'No memory sources yet',
    sourceSimilarity: 'Relevance',
    sourceConfirmed: 'Confirmed',
    portraitMode: 'Photo mode',
    loopVideoMode: 'Loop video mode',
    emotionAwareness: 'Emotion awareness',
    emptyChat: 'After voice setup, send a message. The digital person will respond with collected memories and the prepared voice.',
    voiceInput: 'Voice input',
    inputPlaceholder: 'Type a message...',
    replayLast: 'Replay last',
    interrupt: 'Interrupt',
    openCamera: 'Open camera',
    closeCamera: 'Close camera',
    hangupPhone: 'End call mode',
    enterPhone: 'Call mode',
    exitFullscreen: 'Exit fullscreen',
    fullscreenCall: 'Fullscreen call',
    generating: 'Generating the reply. Speech will start naturally by sentence.',
    phoneListening: 'Call mode: listening now. Your sentence will be sent automatically.',
    phoneWaiting: 'Call mode: the microphone will reopen after the reply.',
    memoryTitle: 'Memory Capture',
    interviewTitle: 'AI Interview Starter',
    generatingQuestion: 'Creating follow-up...',
    askMore: 'Ask another question',
    memoryPlaceholder: 'Paste voice notes, chats, diary fragments, or memories here...',
    savingMemory: 'Saving...',
    saveMemory: 'Save to memory',
    conclusionTitle: 'Design note:',
    conclusion: 'Voice upload unlocks the experience, but browsing should not require it first.',
    immortalityTitle: 'Digital immortality:',
    immortality: 'A person can add their own voice and memories to form a self-representing digital presence.',
    rebirthTitle: 'Digital rebirth:',
    rebirth: 'Family members can add old voice clips, photos, interviews, and memories to create a commemorative presence.',
    foundationTitle: 'Unified experience:',
    foundation: 'Both paths build around profile, memory, and voice assets.',
    defaultInput: 'Can you greet me with the voice I just uploaded?',
    defaultName: 'My Digital Person',
    defaultDescription: 'Default UploadSoul test persona.',
    captureModes: [
      { id: 'relationship', title: 'Relationship Map', prompt: 'Write about someone important to you. What is your relationship, and what small moment do you remember most often?', note: 'People, relationships, closeness, names, emotional strength' },
      { id: 'life_stage', title: 'Life Stage', prompt: 'Choose a life stage: childhood, school, work, love, migration, or farewell. What scene best represents that time?', note: 'Childhood, school, work, love, migration, farewells' },
      { id: 'object_photo', title: 'Object / Photo Trigger', prompt: 'Think of a photo or old object. Where is it now? Who, which day, what sound, or what scent does it bring back?', note: 'Photos, keepsakes, sounds, scents, places' }
    ],
    emotions: { joy: 'Joy', sadness: 'Nostalgic', anger: 'Intense', fear: 'Uneasy', surprise: 'Surprised', neutral: 'Calm', warm: 'Warm', blue: 'Quiet', red: 'Intense', green: 'Light' },
    toasts: {
      recordingReady: 'Recording is ready. Preparing the personal voice.',
      recordingConvertFailed: 'Recording preparation failed. Please upload a clear audio file.',
      micFailed: message => `Cannot open microphone: ${message}`,
      chooseVoice: 'Please choose or record a voice sample first',
      sampleAdded: 'Voice sample added',
      voiceDone: 'Voice is ready. Future replies will use it.',
      memoryRequired: 'Please enter a memory before saving',
      memorySaved: 'Memory saved',
      visualUploadFailed: 'Avatar upload failed',
      visualAssetAdded: 'Appearance asset added',
      visualSaved: 'Digital appearance saved',
      feedbackSaved: 'Feedback saved',
      visualLocalOnly: 'Appearance is available for local preview, but was not saved yet',
      voiceMissing: 'This persona does not have a prepared voice yet. Please record or upload audio first.',
      noAudio: 'No speech was generated. Please try again.',
      audioDecodeFailed: 'The browser cannot play this audio right now. Please try again.',
      audioPlayFailed: message => `Speech playback failed: ${message}`,
      preparingVoice: 'Preparing your personal voice first...',
      chatFailed: message => `Test failed: ${message}`,
      fullscreenFailed: message => `Fullscreen failed: ${message}`,
      cameraFailed: message => `Cannot open camera: ${message}`,
      speechUnsupported: 'This browser does not support voice input',
      speechFailed: error => `Voice recognition failed: ${error}`,
      phoneOn: 'Call mode is on. A sentence will send automatically.',
      phoneOff: 'Call mode is off'
    }
  }
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

function cloudinaryImageVariant(url, width) {
  if (!url || !url.includes('/image/upload/')) return url;
  return url.replace('/image/upload/', `/image/upload/f_auto,q_auto,c_limit,w_${width}/`);
}

const MVPChinaPage = () => {
  const { i18n } = useTranslation();
  const { user, session } = useAuth();
  const [searchParams] = useSearchParams();
  const requestedProfileId = searchParams.get('profile_id');
  const requestedPersonaType = searchParams.get('persona_type') || 'test';
  const copy = i18n.language?.startsWith('en') ? mvpCopy.en : mvpCopy.zh;
  const localizedCaptureModes = copy.captureModes.map(mode => ({ ...mode, icon: captureModeIcons[mode.id] }));
  const [profile, setProfile] = useState(null);
  const [booting, setBooting] = useState(true);
  const [setupError, setSetupError] = useState('');
  const [voiceFile, setVoiceFile] = useState(null);
  const [voiceSamples, setVoiceSamples] = useState([]);
  const [selectedVoiceSampleId, setSelectedVoiceSampleId] = useState('');
  const [cloneState, setCloneState] = useState('idle');
  const [transcript, setTranscript] = useState('');
  const [memoryText, setMemoryText] = useState('');
  const [memoryState, setMemoryState] = useState('idle');
  const [messages, setMessages] = useState([]);
  const [selectedSourceMessageId, setSelectedSourceMessageId] = useState('');
  const [feedbackByMessage, setFeedbackByMessage] = useState({});
  const [input, setInput] = useState(copy.defaultInput);
  const [chatState, setChatState] = useState('idle');
  const [recording, setRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [captureModeId, setCaptureModeId] = useState('relationship');
  const [interviewQuestion, setInterviewQuestion] = useState('');
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [visualUrl, setVisualUrl] = useState('');
  const [visualType, setVisualType] = useState('avatar');
  const [visualAssets, setVisualAssets] = useState([]);
  const [visualState, setVisualState] = useState('idle');
  const [audioLevel, setAudioLevel] = useState(0);
  const [emotionState, setEmotionState] = useState(defaultEmotionState);
  const [callFullscreen, setCallFullscreen] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [listening, setListening] = useState(false);
  const [streamingReply, setStreamingReply] = useState(false);
  const [phoneMode, setPhoneMode] = useState(false);
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
  const phoneModeRef = useRef(false);

  const hasVoice = Boolean(profile?.elevenlabs_voice_id);
  const activeEmotionVisual = emotionVisuals[emotionState.visual_mood] || emotionVisuals[emotionState.emotion_label] || emotionVisuals.neutral;
  const activeEmotionLabel = copy.emotions[emotionState.visual_mood] || copy.emotions[emotionState.emotion_label] || copy.emotions.neutral;
  const captureMode = localizedCaptureModes.find(mode => mode.id === captureModeId) || localizedCaptureModes[0];
  const selectedVoiceSample = voiceSamples.find(sample => sample.id === selectedVoiceSampleId);
  const latestAssistantWithSources = useMemo(
    () => [...messages].reverse().find(message => message.role === 'assistant' && message.sources?.length),
    [messages]
  );
  const selectedSourceMessage = messages.find(message => message.id === selectedSourceMessageId && message.sources?.length) || latestAssistantWithSources;
  const latestSources = selectedSourceMessage?.sources || [];
  const flowProgress = useMemo(() => {
    let count = 1;
    if (profile) count += 1;
    if (voiceFile || profile?.voice_sample_url) count += 1;
    if (hasVoice) count += 1;
    if (messages.length) count += 1;
    return Math.min(5, count);
  }, [hasVoice, messages.length, profile, voiceFile]);

  const renderSourcePanel = (compact = false) => (
    <aside className={`test-panel p-4 ${compact ? 'max-h-72' : 'min-h-0'} overflow-hidden flex flex-col`}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-300" />
          <h3 className="text-sm font-semibold">{copy.sourcePanelTitle}</h3>
        </div>
        <span className="text-[11px] text-white/35">{latestSources.length}</span>
      </div>
      <div className="text-xs text-white/42 leading-relaxed mb-3">{copy.sourcePanelHint}</div>
      <div className="min-h-0 flex-1 overflow-y-auto space-y-2 pr-1">
        {latestSources.length === 0 ? (
          <div className="text-xs text-white/38">{copy.sourceEmpty}</div>
        ) : latestSources.map((source, index) => {
          const topics = Array.isArray(source.topics) ? source.topics.slice(0, 3) : [];
          const score = Number(source.similarity || 0);
          return (
            <div key={source.id || index} className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
              <div className="flex items-center justify-between gap-2 text-[11px] text-white/45 mb-2">
                <span>{source.emotion_label || 'memory'}</span>
                <span>{copy.sourceSimilarity} {score ? score.toFixed(2) : '-'}</span>
              </div>
              <div className="text-xs text-white/78 leading-relaxed line-clamp-4">
                {source.summary || source.content_text}
              </div>
              {source.summary && source.content_text && (
                <div className="mt-2 text-[11px] text-white/42 leading-relaxed line-clamp-3">{source.content_text}</div>
              )}
              <div className="mt-3 flex flex-wrap gap-1">
                {source.user_confirmed && <span className="px-2 py-1 rounded-md bg-emerald-300/10 text-emerald-200/75 text-[10px]">{copy.sourceConfirmed}</span>}
                {topics.map(topic => (
                  <span key={topic} className="px-2 py-1 rounded-md bg-white/5 text-white/45 text-[10px]">{topic}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );

  useEffect(() => {
    setInput(prev => (
      !prev || prev === mvpCopy.zh.defaultInput || prev === mvpCopy.en.defaultInput ? copy.defaultInput : prev
    ));
  }, [copy.defaultInput]);

  const loadOrCreateProfile = useCallback(async () => {
    if (!session) return;
    setBooting(true);
    setSetupError('');
    try {
      const response = await authedFetch(session, requestedProfileId ? '/api/profiles' : `/api/profiles?persona_type=${encodeURIComponent(requestedPersonaType)}`);
      const data = await response.json();
      const selectedProfile = requestedProfileId
        ? data.profiles?.find(item => item.id === requestedProfileId)
        : data.profiles?.[0];
      if (selectedProfile) {
        setProfile(selectedProfile);
        return;
      }
      const created = await authedFetch(session, '/api/profiles', {
        method: 'POST',
        body: JSON.stringify({
          persona_type: requestedPersonaType,
          relationship: requestedPersonaType === 'immortality' ? 'self' : '',
          display_name: user?.user_metadata?.nickname || user?.email?.split('@')[0] || copy.defaultName,
          description: copy.defaultDescription
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
  }, [copy.defaultDescription, copy.defaultName, requestedPersonaType, requestedProfileId, session, user]);

  useEffect(() => {
    loadOrCreateProfile();
  }, [loadOrCreateProfile]);

  useEffect(() => {
    phoneModeRef.current = phoneMode;
  }, [phoneMode]);

  useEffect(() => {
    if (profile?.avatar_url && !visualUrl) {
      setVisualUrl(profile.avatar_url);
      setVisualType(profile.avatar_url.match(/\.(mp4|webm|mov)(\?|$)/i) ? 'video' : 'avatar');
    }
  }, [profile, visualUrl]);

  const loadProfileAssets = useCallback(async (profileId) => {
    if (!session || !profileId) return;
    try {
      const response = await authedFetch(session, `/api/profile-assets?profile_id=${encodeURIComponent(profileId)}`);
      const data = await response.json();
      const assets = data.assets || [];
      setVoiceSamples(assets.filter(asset => asset.asset_type === 'voice').map(asset => ({
        id: asset.id,
        name: asset.file_name || copy.voiceLibrary,
        size: asset.file_size || 0,
        url: asset.url,
        transcript: asset.transcript,
        saved: true
      })));
      setVisualAssets(assets.filter(asset => asset.asset_type === 'image' || asset.asset_type === 'video').map(asset => ({
        id: asset.id,
        url: asset.url,
        type: asset.asset_type === 'video' ? 'video' : 'image',
        name: asset.file_name || copy.visualLibrary,
        size: asset.file_size || 0,
        saved: true
      })));
    } catch (error) {
      console.warn('Asset load skipped:', error.message);
    }
  }, [copy.visualLibrary, copy.voiceLibrary, session]);

  useEffect(() => {
    if (profile?.id) loadProfileAssets(profile.id);
  }, [loadProfileAssets, profile?.id]);

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
          addVoiceSample(file, 'record');
          toast.success(copy.toasts.recordingReady);
          if (profile?.id) {
            cloneVoice(file).catch(() => {});
          }
        } catch (error) {
          console.error('Recorded audio conversion failed:', error);
          toast.error(copy.toasts.recordingConvertFailed);
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
      toast.error(copy.toasts.micFailed(error.message));
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

  const addVoiceSample = (file, source = 'upload') => {
    if (!file) return;
    const sample = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      source,
      name: file.name,
      size: file.size,
      createdAt: new Date().toISOString()
    };
    setVoiceSamples(prev => [sample, ...prev].slice(0, 8));
    setSelectedVoiceSampleId(sample.id);
    setVoiceFile(file);
    voiceFileRef.current = file;
    toast.success(copy.toasts.sampleAdded);
    persistProfileAsset({ file, assetType: 'voice', role: source === 'record' ? 'recorded_sample' : 'uploaded_sample', localId: sample.id }).catch(error => {
      console.warn('Voice asset save skipped:', error.message);
    });
  };

  const persistProfileAsset = async ({ file, assetType, role = 'reference', localId = null }) => {
    if (!session || !profile?.id || !file) return null;
    const form = new FormData();
    form.append('profile_id', profile.id);
    form.append('asset_type', assetType);
    form.append('role', role);
    form.append('file', file);
    const response = await authedFetch(session, '/api/profile-assets', { method: 'POST', body: form });
    const data = await response.json();
    const asset = data.asset;
    if (!asset) return null;
    if (assetType === 'voice') {
      setVoiceSamples(prev => prev.map(item => (
        item.id === localId ? { ...item, id: asset.id, url: asset.url, saved: true } : item
      )));
      if (selectedVoiceSampleId === localId) setSelectedVoiceSampleId(asset.id);
    } else {
      setVisualAssets(prev => prev.map(item => (
        item.id === localId ? { ...item, id: asset.id, url: asset.url, saved: true } : item
      )));
    }
    return asset;
  };

  const cloneVoice = async (fileOverride = null) => {
    const fileToClone = fileOverride || selectedVoiceSample?.file || voiceFileRef.current;
    if (!profile?.id || !fileToClone) {
      toast.error(copy.toasts.chooseVoice);
      return;
    }
    setCloneState('working');
    try {
      const form = new FormData();
      form.append('profile_id', profile.id);
      form.append('file', fileToClone);
      if (selectedVoiceSample?.saved && selectedVoiceSample?.id) {
        form.append('asset_id', selectedVoiceSample.id);
      }
      const response = await authedFetch(session, '/api/voice/clone', { method: 'POST', body: form });
      const data = await response.json();
      const nextProfile = {
        ...(data.profile || profile),
        elevenlabs_voice_id: data.voice_uri || data.profile?.elevenlabs_voice_id || profile?.elevenlabs_voice_id
      };
      setProfile(nextProfile);
      if (data.asset) {
        setVoiceSamples(prev => {
          const withoutAsset = prev.filter(item => item.id !== data.asset.id);
          return [
            { id: data.asset.id, url: data.asset.url, name: data.asset.file_name || copy.voiceSample, size: data.asset.file_size, saved: true, primary: true },
            ...withoutAsset.map(item => ({ ...item, primary: false }))
          ].slice(0, 12);
        });
        setSelectedVoiceSampleId(data.asset.id);
      }
      setTranscript(data.transcript || '');
      setMemoryText(data.transcript || '');
      toast.success(copy.toasts.voiceDone);
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
      toast.error(copy.toasts.memoryRequired);
      return;
    }
    setMemoryState('working');
    try {
      const form = new FormData();
      form.append('profile_id', profile.id);
      form.append('content_type', 'diary');
      form.append('text', `采集入口：${captureMode.title}\n${memoryText.trim()}`);
      form.append('source_kind', captureModeId ? 'interview' : 'manual');
      form.append('user_confirmed', 'true');
      const response = await authedFetch(session, '/api/memory/upload', { method: 'POST', body: form });
      await response.json();
      toast.success(copy.toasts.memorySaved);
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
    const visualAsset = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      url: localUrl,
      type: file.type.startsWith('video') ? 'video' : 'image',
      name: file.name,
      size: file.size
    };
    setVisualAssets(prev => [visualAsset, ...prev].slice(0, 12));

    if (!profile?.id) return;
    try {
      const asset = await persistProfileAsset({
        file,
        assetType: file.type.startsWith('video') ? 'video' : 'image',
        role: 'appearance_reference',
        localId: visualAsset.id
      });
      if (!asset?.url) throw new Error(copy.toasts.visualUploadFailed);
      const patchResponse = await authedFetch(session, '/api/profiles', {
        method: 'PATCH',
        body: JSON.stringify({ id: profile.id, avatar_url: asset.url })
      });
      const patchData = await patchResponse.json();
      setProfile(patchData.profile);
      setVisualUrl(asset.url);
      toast.success(copy.toasts.visualAssetAdded);
      toast.success(copy.toasts.visualSaved);
    } catch (error) {
      toast.error(copy.toasts.visualLocalOnly);
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
      setMemoryText(prev => prev ? `${prev}\n\n${copy.interviewTitle}：${data.question}\n${copy.account === 'Account' ? 'My answer' : '我的回答'}：` : `${copy.interviewTitle}：${data.question}\n${copy.account === 'Account' ? 'My answer' : '我的回答'}：`);
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
      if (!voiceUri) throw new Error(copy.toasts.voiceMissing);
      const response = await authedFetch(session, '/api/voice/speech', {
        method: 'POST',
        body: JSON.stringify({ profile_id: activeProfile.id, text, emotion, voice_uri: voiceUri })
      });
      const data = await response.json();
      if (!data.audio) throw new Error(copy.toasts.noAudio);
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
        toast.error(copy.toasts.audioDecodeFailed);
      };
      const audioContext = monitorAudio(audio);
      if (audioContext?.state === 'suspended') {
        await audioContext.resume();
      }
      await audio.play();
    } catch (error) {
      setVisualState('idle');
      setAudioLevel(0);
      toast.error(copy.toasts.audioPlayFailed(error.message));
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
      if (phoneModeRef.current && !streamAbortRef.current) {
        window.setTimeout(() => startListening(true), 350);
      }
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

  const sendMessage = async (textOverride = null) => {
    const text = (textOverride || input).trim();
    if (!profile?.id || !text || chatState === 'working') return;
    stopSpeaking();
    setInput('');
    const assistantId = `assistant-${Date.now()}`;
    setMessages(prev => [...prev, { role: 'user', text }, { id: assistantId, role: 'assistant', text: '', query: text, sources: [] }]);
    setChatState('working');
    setStreamingReply(true);
    setVisualState('thinking');
    try {
      let activeProfile = profile;
      if (!activeProfile?.elevenlabs_voice_id && voiceFileRef.current) {
        toast(copy.toasts.preparingVoice);
        activeProfile = await cloneVoice(voiceFileRef.current);
      }
      if (!activeProfile?.elevenlabs_voice_id) {
        throw new Error(copy.toasts.voiceMissing);
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
          if (payload.type === 'sources') {
            setMessages(prev => prev.map(item => (
              item.id === assistantId ? { ...item, sources: payload.memories || [] } : item
            )));
            if (payload.memories?.length) setSelectedSourceMessageId(assistantId);
          }
          if (payload.type === 'done') {
            setMessages(prev => prev.map(item => (
              item.id === assistantId
                ? { ...item, text: payload.fullText || item.text, sources: payload.sources || item.sources || [], emotion: payload.emotion || nextEmotion }
                : item
            )));
            if (payload.sources?.length) setSelectedSourceMessageId(assistantId);
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
        item.id === assistantId && !item.text ? { ...item, text: copy.toasts.chatFailed(error.message) } : item
      )));
      setChatState('error');
      setVisualState('idle');
      setAudioLevel(0);
    } finally {
      streamAbortRef.current = null;
      setStreamingReply(false);
    }
  };

  const submitFeedback = async (message, feedbackType, rating) => {
    if (!profile?.id || !message?.id || feedbackByMessage[message.id]) return;
    try {
      const sourceIds = (message.sources || []).map(source => source?.id || source).filter(Boolean);
      await authedFetch(session, '/api/memory/feedback', {
        method: 'POST',
        body: JSON.stringify({
          profile_id: profile.id,
          query: message.query || '',
          answer: message.text || '',
          source_fragment_ids: sourceIds,
          rating,
          feedback_type: feedbackType
        })
      });
      setFeedbackByMessage(prev => ({ ...prev, [message.id]: feedbackType }));
      toast.success(copy.toasts.feedbackSaved);
    } catch (error) {
      toast.error(error.message);
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
      toast.error(copy.toasts.fullscreenFailed(error.message));
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
      toast.error(copy.toasts.cameraFailed(error.message));
    }
  };

  const startListening = (autoSend = false) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error(copy.toasts.speechUnsupported);
      return;
    }
    if (listening || streamingReply || visualState === 'speaking') return;
    const recognition = new SpeechRecognition();
    recognition.lang = copy === mvpCopy.en ? 'en-US' : 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = event => {
      setListening(false);
      toast.error(copy.toasts.speechFailed(event.error));
    };
    recognition.onresult = event => {
      const text = event.results?.[0]?.[0]?.transcript || '';
      if (!text.trim()) return;
      if (autoSend || phoneModeRef.current) {
        sendMessage(text.trim());
      } else {
        setInput(text.trim());
      }
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const toggleListening = () => {
    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }
    startListening(false);
  };

  const togglePhoneMode = async () => {
    const next = !phoneModeRef.current;
    setPhoneMode(next);
    phoneModeRef.current = next;
    if (next) {
      toast.success(copy.toasts.phoneOn);
      if (!document.fullscreenElement && callShellRef.current) {
        callShellRef.current.requestFullscreen?.().catch(() => {});
      }
      if (!listening && !streamingReply && visualState !== 'speaking') {
        window.setTimeout(() => startListening(true), 250);
      }
    } else {
      recognitionRef.current?.stop?.();
      setListening(false);
      toast(copy.toasts.phoneOff);
    }
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
              <div className="text-xs uppercase tracking-[0.28em] text-emerald-300/75 mb-3">{copy.moduleLabel}</div>
              <h1 className="text-3xl md:text-4xl font-bold">{copy.title}</h1>
              <p className="text-white/56 mt-3 max-w-3xl">{copy.subtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1 text-xs">
                <span className="px-2 text-white/45">{copy.language}</span>
                <button onClick={() => i18n.changeLanguage('zh-CN')} className={`px-3 py-1.5 rounded-md ${copy === mvpCopy.zh ? 'bg-emerald-300 text-black' : 'text-white/65 hover:text-white'}`}>中文</button>
                <button onClick={() => i18n.changeLanguage('en')} className={`px-3 py-1.5 rounded-md ${copy === mvpCopy.en ? 'bg-emerald-300 text-black' : 'text-white/65 hover:text-white'}`}>EN</button>
              </div>
              <button onClick={loadOrCreateProfile} className="px-4 py-2 rounded-lg border border-white/10 text-white/75 hover:text-white flex items-center gap-2">
                <RefreshCw size={16} /> {copy.refreshProfile}
              </button>
            </div>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
            {copy.steps.map((step, index) => (
              <div key={step[0]} className={`test-panel p-4 ${index < flowProgress ? 'border-emerald-300/35' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold mb-3 ${index < flowProgress ? 'bg-emerald-300 text-black' : 'bg-white/10 text-white/45'}`}>{index + 1}</div>
                <div className="font-semibold">{step[0]}</div>
                <div className="text-xs text-white/45 mt-1">{step[1]}</div>
              </div>
            ))}
          </section>

          {setupError && (
            <section className="test-panel p-4 mb-6 border-red-400/30 bg-red-500/8">
              <div className="font-semibold text-red-200 mb-1">{copy.setupFailedTitle}</div>
              <div className="text-sm text-white/65">{setupError}</div>
              <div className="text-xs text-white/42 mt-2">{copy.setupFailedHint}</div>
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
            <aside className="space-y-6">
              <section className="test-panel p-5">
                <div className="flex items-center gap-2 mb-4"><ShieldCheck size={18} className="text-emerald-300" /><h2 className="font-semibold">{copy.profileTitle}</h2></div>
                {booting ? (
                  <div className="text-sm text-white/45">{copy.initializingProfile}</div>
                ) : (
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between gap-4"><span className="text-white/45">{copy.account}</span><span className="text-right">{user?.email}</span></div>
                    <div className="flex justify-between gap-4"><span className="text-white/45">{copy.profileName}</span><span>{profile?.display_name}</span></div>
                    <div className="flex justify-between gap-4"><span className="text-white/45">{copy.voiceStatus}</span><span className={hasVoice ? 'text-emerald-300' : 'text-amber-300'}>{hasVoice ? copy.voiceReady : copy.voiceNotReady}</span></div>
                  </div>
                )}
              </section>

              <section className="test-panel p-5">
                <div className="flex items-center gap-2 mb-4"><FileAudio size={18} className="text-amber-200" /><h2 className="font-semibold">{copy.voiceTitle}</h2></div>
                <div className="space-y-3">
                  <input
                    ref={fileRef}
                    className="hidden"
                    type="file"
                    accept="audio/*,.mp3,.wav,.opus,.ogg"
                    onChange={event => addVoiceSample(event.target.files?.[0], 'upload')}
                  />
                  <button onClick={() => fileRef.current?.click()} className="w-full px-4 py-3 rounded-lg border border-white/10 hover:border-amber-200/40 flex items-center justify-center gap-2">
                    <Upload size={17} /> {copy.addVoiceSample}
                  </button>
                  <button onClick={recording ? stopRecording : startRecording} className={`w-full px-4 py-3 rounded-lg flex items-center justify-center gap-2 ${recording ? 'bg-red-500 text-white' : 'bg-white/8 border border-white/10'}`}>
                    <Mic size={17} /> {recording ? copy.recording(recordSeconds) : copy.recordFive}
                  </button>
                  {voiceFile && <div className="text-xs text-white/55 border border-white/10 rounded-lg p-3">{voiceFile.name} · {(voiceFile.size / 1024 / 1024).toFixed(2)} MB</div>}
                  <div className="text-[11px] text-white/38 leading-relaxed">{copy.audioHint}</div>
                  <button onClick={() => cloneVoice(selectedVoiceSample?.file)} disabled={(!selectedVoiceSample && !voiceFile) || cloneState === 'working'} className="w-full px-4 py-3 rounded-lg bg-amber-300 text-black font-semibold disabled:opacity-55">
                    {cloneState === 'working' ? copy.preparingVoice : copy.updateWithSelected}
                  </button>
                  {transcript && <div className="text-xs text-white/55 border border-white/10 rounded-lg p-3">{copy.transcript}：{transcript}</div>}
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-white/85">{copy.voiceLibrary}</div>
                      <div className="text-xs text-white/40">{voiceSamples.length}/8</div>
                    </div>
                    <div className="text-[11px] text-white/38 leading-relaxed mt-1">{copy.voiceLibraryHint}</div>
                    <div className="mt-3 space-y-2">
                      {voiceSamples.length === 0 ? (
                        <div className="text-xs text-white/38">{copy.noVoiceSamples}</div>
                      ) : voiceSamples.map(sample => {
                        const active = selectedVoiceSampleId === sample.id;
                        return (
                          <button
                            key={sample.id}
                            onClick={() => {
                              setSelectedVoiceSampleId(sample.id);
                              setVoiceFile(sample.file);
                              voiceFileRef.current = sample.file;
                            }}
                            className={`w-full text-left rounded-lg border p-2 text-xs transition-all ${active ? 'border-amber-300/60 bg-amber-300/10' : 'border-white/10 bg-black/10 hover:border-white/20'}`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate text-white/75">{sample.name}</span>
                              {active && <span className="shrink-0 text-amber-200">{copy.selected}</span>}
                            </div>
                            <div className="mt-1 text-white/35">{(sample.size / 1024 / 1024).toFixed(2)} MB</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>

              <section className="test-panel p-5">
                <div className="flex items-center gap-2 mb-4"><ImageIcon size={18} className="text-blue-200" /><h2 className="font-semibold">{copy.visualCaptureTitle}</h2></div>
                <div className="text-xs text-white/45 leading-relaxed mb-3">{copy.visualCaptureHint}</div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {copy.visualChecklist.map(item => (
                    <div key={item} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60">{item}</div>
                  ))}
                </div>
                <button onClick={() => visualFileRef.current?.click()} className="w-full px-4 py-3 rounded-lg border border-white/10 hover:border-blue-200/40 flex items-center justify-center gap-2 text-sm">
                  <Upload size={16} /> {copy.uploadVisual}
                </button>
                <div className="mt-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-white/85">{copy.visualLibrary}</div>
                    <div className="text-xs text-white/40">{visualAssets.length}/12</div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {visualAssets.length === 0 ? (
                      <div className="col-span-2 text-xs text-white/38">{copy.noVisualAssets}</div>
                    ) : visualAssets.map(asset => (
                      <button
                        key={asset.id}
                        onClick={() => {
                          setVisualUrl(asset.url);
                          setVisualType(asset.type === 'video' ? 'video' : 'avatar');
                        }}
                        className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-black text-left"
                        title={copy.setAsMainVisual}
                      >
                        {asset.type === 'video' ? (
                          <video src={asset.url} className="w-full h-full object-cover" muted playsInline />
                        ) : (
                          <img src={asset.url} alt="" className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-black/65 px-2 py-1 text-[10px] text-white/75 truncate">{asset.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            </aside>

            <main className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
              <section ref={callShellRef} className={`test-panel p-5 min-h-[640px] flex flex-col ${callFullscreen ? 'bg-[#080b10] w-screen h-screen max-w-none p-6' : ''}`}>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={18} className="text-emerald-300" />
                    <h2 className="font-semibold">{copy.chatTitle}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={toggleCamera} className={`w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center ${cameraOn ? 'bg-emerald-300 text-black' : 'text-white/70 hover:text-white'}`} title={copy.camera}>
                      <Camera size={16} />
                    </button>
                    <button onClick={togglePhoneMode} className={`px-3 h-9 rounded-lg border border-white/10 text-xs font-semibold ${phoneMode ? 'bg-emerald-300 text-black' : 'text-white/70 hover:text-white'}`} title={copy.phoneMode}>
                      {phoneMode ? copy.inCall : copy.phoneMode}
                    </button>
                    <button onClick={toggleFullscreen} className="w-9 h-9 rounded-lg border border-white/10 text-white/70 hover:text-white flex items-center justify-center" title={copy.fullscreen}>
                      {callFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                  </div>
                </div>
                <div className={callFullscreen ? 'flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(320px,400px)_minmax(280px,340px)] gap-4 overflow-y-auto xl:overflow-hidden' : 'contents'}>
                <div className={`test-panel overflow-hidden ${callFullscreen ? 'min-h-0 h-full flex flex-col mb-0' : 'mb-4'}`}>
                  <div className={`relative bg-black flex items-center justify-center overflow-hidden ${callFullscreen ? 'flex-1 min-h-[54vh]' : 'aspect-[16/10]'}`}>
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        background: `radial-gradient(circle at 50% 42%, rgba(${activeEmotionVisual.rgb},${0.12 + audioLevel * 0.38}), transparent 32%), radial-gradient(circle at 50% 100%, rgba(${activeEmotionVisual.rgb},.12), transparent 38%)`
                      }}
                    />
                    {visualUrl ? (
                      visualType === 'video' ? (
                        <video src={visualUrl} className="relative z-10 w-full h-full object-contain bg-black" autoPlay loop muted playsInline />
                      ) : (
                        <img
                          src={cloudinaryImageVariant(visualUrl, callFullscreen ? 2160 : 1440)}
                          srcSet={visualUrl.includes('/image/upload/') ? `${cloudinaryImageVariant(visualUrl, 960)} 960w, ${cloudinaryImageVariant(visualUrl, 1440)} 1440w, ${cloudinaryImageVariant(visualUrl, 2160)} 2160w` : undefined}
                          sizes={callFullscreen ? 'calc(100vw - 460px)' : '(min-width: 1280px) calc(100vw - 520px), 100vw'}
                          alt="digital avatar"
                          className="relative z-10 w-full h-full object-contain transition-transform duration-150"
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
                        {visualState === 'speaking' ? copy.speaking : visualState === 'thinking' ? copy.thinking : copy.idle}
                      </div>
                    </div>
                    {cameraOn && (
                      <div className="absolute right-4 top-4 z-30 w-32 md:w-44 aspect-[4/3] rounded-lg overflow-hidden border border-white/20 bg-black shadow-xl">
                        <video ref={userVideoRef} className="w-full h-full object-cover scale-x-[-1]" muted playsInline autoPlay />
                        <div className="absolute left-2 bottom-1 text-[10px] text-white/70">{copy.you}</div>
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
                      <ImageIcon size={15} /> {copy.uploadVisual}
                    </button>
                    <button onClick={() => setVisualType(visualType === 'video' ? 'avatar' : 'video')} className="px-3 py-2 rounded-lg border border-white/10 text-white/70 hover:text-white flex items-center justify-center gap-2 text-sm">
                      <Video size={15} /> {visualType === 'video' ? copy.portraitMode : copy.loopVideoMode}
                    </button>
                  </div>
                  <div className="mx-3 mb-3 p-3 rounded-lg border border-white/10 bg-white/5">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-white/45">{copy.emotionAwareness}</span>
                      <span className="font-semibold" style={{ color: `rgb(${activeEmotionVisual.rgb})` }}>
                        {activeEmotionLabel} · {emotionState.intensity}/5
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-white/50 leading-relaxed">
                      {emotionState.speaking_style} · {emotionState.reason}
                    </div>
                  </div>
                </div>
                <div className={callFullscreen ? 'min-h-0 flex flex-col test-panel p-4 overflow-hidden' : 'contents'}>
                <div className={`${callFullscreen ? 'min-h-0' : ''} flex-1 overflow-y-auto space-y-3 pr-1`}>
                  {messages.length === 0 && (
                    <div className="test-panel p-5 text-sm text-white/52">{copy.emptyChat}</div>
                  )}
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[82%] ${message.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
                        <div
                          onClick={() => message.role === 'assistant' && message.sources?.length && setSelectedSourceMessageId(message.id)}
                          className={`w-full px-4 py-3 rounded-lg text-sm ${message.role === 'user' ? 'bg-amber-300 text-black' : `bg-white/8 border text-white/82 ${message.sources?.length ? 'cursor-pointer hover:border-emerald-300/35' : ''} ${selectedSourceMessageId === message.id ? 'border-emerald-300/45' : 'border-white/10'}`}`}
                        >
                          {message.text}
                        </div>
                        {message.role === 'assistant' && message.id && message.text && (
                          <div className="flex flex-wrap gap-1 text-[11px]">
                            {feedbackByMessage[message.id] ? (
                              <span className="px-2 py-1 rounded-md bg-emerald-300/10 text-emerald-200/75">{copy.feedbackThanks}</span>
                            ) : (
                              <>
                                <button onClick={() => submitFeedback(message, 'accurate', 5)} className="px-2 py-1 rounded-md border border-white/10 text-white/45 hover:text-white/80">{copy.feedbackAccurate}</button>
                                <button onClick={() => submitFeedback(message, 'not_like_person', 2)} className="px-2 py-1 rounded-md border border-white/10 text-white/45 hover:text-white/80">{copy.feedbackNotLike}</button>
                                <button onClick={() => submitFeedback(message, 'missing_memory', 3)} className="px-2 py-1 rounded-md border border-white/10 text-white/45 hover:text-white/80">{copy.feedbackMissing}</button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex gap-2">
                    <button onClick={toggleListening} className={`w-11 h-11 rounded-lg border border-white/10 flex items-center justify-center ${listening ? 'bg-red-500 text-white' : 'text-white/70 hover:text-white'}`} title={copy.voiceInput}>
                      {listening ? <MicOff size={17} /> : <Mic size={17} />}
                    </button>
                    <input
                      className="test-input flex-1 px-3 text-sm"
                      value={input}
                      onChange={event => setInput(event.target.value)}
                      onKeyDown={event => {
                        if (event.key === 'Enter') sendMessage();
                      }}
                      placeholder={copy.inputPlaceholder}
                    />
                    <button onClick={streamingReply ? stopSpeaking : sendMessage} disabled={!streamingReply && !input.trim()} className={`w-11 h-11 rounded-lg flex items-center justify-center disabled:opacity-55 ${streamingReply ? 'border border-white/10 text-white/80' : 'bg-emerald-300 text-black'}`}>
                      {streamingReply ? <Square size={15} /> : <Send size={17} />}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={playLastReply} disabled={!messages.some(item => item.role === 'assistant')} className="px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:text-white flex items-center gap-2 disabled:opacity-45">
                      <Volume2 size={16} /> {copy.replayLast}
                    </button>
                    <button onClick={stopSpeaking} disabled={visualState !== 'speaking' && visualState !== 'thinking' && !streamingReply} className="px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:text-white flex items-center gap-2 disabled:opacity-45">
                      <Square size={15} /> {copy.interrupt}
                    </button>
                    <button onClick={toggleCamera} className="px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:text-white flex items-center gap-2">
                      <Camera size={15} /> {cameraOn ? copy.closeCamera : copy.openCamera}
                    </button>
                    <button onClick={togglePhoneMode} className={`px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2 ${phoneMode ? 'bg-emerald-300 text-black' : 'text-white/70 hover:text-white'}`}>
                      {phoneMode ? <MicOff size={15} /> : <Mic size={15} />} {phoneMode ? copy.hangupPhone : copy.enterPhone}
                    </button>
                    <button onClick={toggleFullscreen} className="px-4 py-2 rounded-lg border border-white/10 text-white/70 hover:text-white flex items-center gap-2">
                      {callFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />} {callFullscreen ? copy.exitFullscreen : copy.fullscreenCall}
                    </button>
                  </div>
                  {streamingReply && <div className="text-xs text-emerald-200/70">{copy.generating}</div>}
                  {phoneMode && !streamingReply && <div className="text-xs text-emerald-200/70">{listening ? copy.phoneListening : copy.phoneWaiting}</div>}
                  {!callFullscreen && renderSourcePanel(true)}
                </div>
                </div>
                {callFullscreen && renderSourcePanel(false)}
                </div>
              </section>

              <section className="test-panel p-5 min-h-[640px] flex flex-col">
                <div className="flex items-center gap-2 mb-4"><Database size={18} className="text-blue-300" /><h2 className="font-semibold">{copy.memoryTitle}</h2></div>
                <div className="grid grid-cols-1 gap-2 mb-4">
                  {localizedCaptureModes.map(mode => {
                    const Icon = mode.icon;
                    const active = captureModeId === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => {
                          setCaptureModeId(mode.id);
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
                  <div className="flex items-center gap-2 text-sm font-semibold mb-2"><Sparkles size={16} className="text-emerald-300" />{copy.interviewTitle}</div>
                  <div className="text-xs text-white/50 leading-relaxed">{interviewQuestion || captureMode.prompt}</div>
                  <button
                    onClick={askInterviewQuestion}
                    disabled={!profile?.id || interviewLoading}
                    className="mt-3 px-3 py-2 rounded-lg bg-emerald-300 text-black text-sm font-semibold disabled:opacity-50"
                  >
                    {interviewLoading ? copy.generatingQuestion : copy.askMore}
                  </button>
                </div>
                <textarea
                  className="test-input w-full min-h-[180px] p-3 text-sm resize-none"
                  value={memoryText}
                  onChange={event => setMemoryText(event.target.value)}
                  placeholder={copy.memoryPlaceholder}
                />
                <button onClick={saveMemory} disabled={memoryState === 'working'} className="mt-3 px-4 py-3 rounded-lg bg-blue-300 text-black font-semibold disabled:opacity-55">
                  {memoryState === 'working' ? copy.savingMemory : copy.saveMemory}
                </button>
                <div className="mt-5 space-y-3 text-sm text-white/55">
                  <div className="test-panel p-3"><span className="text-white/85">{copy.conclusionTitle}</span>{copy.conclusion}</div>
                  <div className="test-panel p-3"><span className="text-white/85">{copy.immortalityTitle}</span>{copy.immortality}</div>
                  <div className="test-panel p-3"><span className="text-white/85">{copy.rebirthTitle}</span>{copy.rebirth}</div>
                  <div className="test-panel p-3"><span className="text-white/85">{copy.foundationTitle}</span>{copy.foundation}</div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MVPChinaPage;
