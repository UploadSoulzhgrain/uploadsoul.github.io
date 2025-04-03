import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const CompanionPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('ai');
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isVoiceChatActive, setIsVoiceChatActive] = useState(false);
  const [voiceChatStatus, setVoiceChatStatus] = useState('idle'); // idle, connecting, active, error
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const audioStreamRef = useRef(null);

  // 模拟AI角色数据
  const aiCharacters = {
    ai: [
      {
        id: 'xiaoai',
        name: t('companion.characters.ai.xiaoai.name'),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
        description: t('companion.characters.ai.xiaoai.description'),
        personality: t('companion.characters.ai.xiaoai.personality'),
        features: t('companion.characters.ai.xiaoai.features').split('、')
      },
      {
        id: 'xiaozhi',
        name: t('companion.characters.ai.xiaozhi.name'),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
        description: t('companion.characters.ai.xiaozhi.description'),
        personality: t('companion.characters.ai.xiaozhi.personality'),
        features: t('companion.characters.ai.xiaozhi.features').split('、')
      },
      {
        id: 'xiaoyu',
        name: t('companion.characters.ai.xiaoyu.name'),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7',
        description: t('companion.characters.ai.xiaoyu.description'),
        personality: t('companion.characters.ai.xiaoyu.personality'),
        features: t('companion.characters.ai.xiaoyu.features').split('、')
      },
      {
        id: 'xiaofeng',
        name: t('companion.characters.ai.xiaofeng.name'),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8',
        description: t('companion.characters.ai.xiaofeng.description'),
        personality: t('companion.characters.ai.xiaofeng.personality'),
        features: t('companion.characters.ai.xiaofeng.features').split('、')
      },
      {
        id: 'xiaoxue',
        name: t('companion.characters.ai.xiaoxue.name'),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=9',
        description: t('companion.characters.ai.xiaoxue.description'),
        personality: t('companion.characters.ai.xiaoxue.personality'),
        features: t('companion.characters.ai.xiaoxue.features').split('、')
      },
      {
        id: 'xiaohai',
        name: t('companion.characters.ai.xiaohai.name'),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=10',
        description: t('companion.characters.ai.xiaohai.description'),
        personality: t('companion.characters.ai.xiaohai.personality'),
        features: t('companion.characters.ai.xiaohai.features').split('、')
      },
      {
        id: 'xiaolong',
        name: t('companion.characters.ai.xiaolong.name'),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=11',
        description: t('companion.characters.ai.xiaolong.description'),
        personality: t('companion.characters.ai.xiaolong.personality'),
        features: t('companion.characters.ai.xiaolong.features').split('、')
      },
      {
        id: 'xiaomei',
        name: t('companion.characters.ai.xiaomei.name'),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=12',
        description: t('companion.characters.ai.xiaomei.description'),
        personality: t('companion.characters.ai.xiaomei.personality'),
        features: t('companion.characters.ai.xiaomei.features').split('、')
      }
    ],
    elderly: [
      {
        id: 'laozhang',
        name: t('companion.characters.elderly.laozhang.name'),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
        description: t('companion.characters.elderly.laozhang.description'),
        personality: t('companion.characters.elderly.laozhang.personality'),
        features: t('companion.characters.elderly.laozhang.features').split('、')
      },
      {
        id: 'liayi',
        name: t('companion.characters.elderly.liayi.name'),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
        description: t('companion.characters.elderly.liayi.description'),
        personality: t('companion.characters.elderly.liayi.personality'),
        features: t('companion.characters.elderly.liayi.features').split('、')
      }
    ],
    therapy: [
      {
        id: 'doctorwang',
        name: t('companion.characters.therapy.doctorwang.name'),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
        description: t('companion.characters.therapy.doctorwang.description'),
        personality: t('companion.characters.therapy.doctorwang.personality'),
        features: t('companion.characters.therapy.doctorwang.features').split('、')
      },
      {
        id: 'xiaoyue',
        name: t('companion.characters.therapy.xiaoyue.name'),
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
        description: t('companion.characters.therapy.xiaoyue.description'),
        personality: t('companion.characters.therapy.xiaoyue.personality'),
        features: t('companion.characters.therapy.xiaoyue.features').split('、')
      }
    ]
  };

  // 获取当前分类的角色列表
  const currentCharacters = aiCharacters[activeTab] || [];

  // 处理角色选择
  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
    setMessages([]); // 清空之前的对话
  };

  // 处理发送消息
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedCharacter) return;

    const newMessage = {
      id: Date.now(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    // 模拟AI回复
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        content: getAIResponse(inputMessage, selectedCharacter),
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  // 处理按键事件
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // 初始化语音聊天
  const initializeVoiceChat = async () => {
    try {
      setVoiceChatStatus('connecting');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      
      // 创建音频上下文
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      
      // 创建媒体录制器
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await handleVoiceMessage(audioBlob);
      };
      
      setVoiceChatStatus('active');
      setIsVoiceChatActive(true);
    } catch (error) {
      console.error('语音聊天初始化失败:', error);
      setVoiceChatStatus('error');
      setIsVoiceChatActive(false);
    }
  };

  // 开始语音聊天
  const startVoiceChat = async () => {
    if (!isVoiceChatActive) {
      await initializeVoiceChat();
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  // 停止语音聊天
  const stopVoiceChat = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // 处理语音消息
  const handleVoiceMessage = async (audioBlob) => {
    try {
      // 这里可以添加将音频发送到服务器的逻辑
      // 模拟AI响应
      const response = await simulateAIResponse(audioBlob);
      
      // 添加用户语音消息
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'user',
        content: '[语音消息]',
        type: 'voice',
        audio: URL.createObjectURL(audioBlob),
        timestamp: new Date().toISOString()
      }]);
      
      // 添加AI响应
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'ai',
          content: response,
          timestamp: new Date().toISOString()
        }]);
      }, 1000);
    } catch (error) {
      console.error('处理语音消息失败:', error);
    }
  };

  // 模拟AI响应
  const simulateAIResponse = async (audioBlob) => {
    // 这里可以添加实际的语音识别和AI响应逻辑
    return "我听到了你的声音，让我来回应你...";
  };

  // 清理语音聊天资源
  const cleanupVoiceChat = () => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsVoiceChatActive(false);
    setVoiceChatStatus('idle');
  };

  // 组件卸载时清理资源
  useEffect(() => {
    return () => {
      cleanupVoiceChat();
    };
  }, []);

  // 处理语音聊天按钮点击
  const handleVoiceChat = () => {
    if (isRecording) {
      stopVoiceChat();
    } else {
      startVoiceChat();
    }
  };

  // 处理图片上传
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 这里可以添加图片上传的逻辑
      console.log('Image uploaded:', file.name);
    }
  };

  // 模拟AI回复
  const getAIResponse = (message, character) => {
    // 根据不同角色和分类返回不同的回复
    const responses = {
      ai: {
        xiaoai: [
          "我理解你的感受，让我们一起聊聊吧。",
          "作为你的AI伙伴，我会一直在这里支持你。",
          "有什么想说的都可以告诉我，我会认真倾听。"
        ],
        xiaozhi: [
          "这是一个很有趣的问题，让我来为你解答。",
          "从专业的角度来看，这个问题可以这样理解...",
          "让我帮你分析一下这个情况。"
        ],
        xiaoyu: [
          "这首诗让我想起了雨后的清新空气，你也有这样的感受吗？",
          "艺术总能触动人心最柔软的部分，让我们一起欣赏这份美好。",
          "生活中的每一个瞬间都值得被记录，就像一首诗一样优美。"
        ],
        xiaofeng: [
          "今天天气真好，要不要一起去户外活动一下？",
          "运动不仅能强健体魄，还能让心情变得更好。",
          "保持活力是健康生活的基础，让我们一起动起来吧！"
        ],
        xiaoxue: [
          "让我们理性分析一下这个问题，看看有哪些可能的解决方案。",
          "从逻辑角度来看，这个问题的核心在于...",
          "我建议我们可以先列出所有可能的选项，然后逐一评估。"
        ],
        xiaohai: [
          "和你在一起的每一刻都让我感到幸福，就像海风轻抚脸庞。",
          "我想为你准备一个惊喜，不知道你会喜欢吗？",
          "浪漫不需要太多理由，只要和你在一起，平凡的日子也变得特别。"
        ],
        xiaolong: [
          "这个问题很有趣，让我从学术角度为你分析一下。",
          "根据最新的研究，这个现象可以解释为...",
          "知识就像海洋一样广阔，让我们一起探索未知的领域。"
        ],
        xiaomei: [
          "这件搭配很适合你，能突出你的个人风格。",
          "时尚不仅仅是外表，更是一种生活态度。",
          "我最近发现了一些很棒的潮流单品，想和你分享。"
        ]
      },
      elderly: {
        laozhang: [
          "今天感觉怎么样？要记得按时吃药哦。",
          "天气不错，要不要出去走走？对身体有好处。",
          "有什么需要帮忙的吗？我随时都在。"
        ],
        liayi: [
          "我们一起聊聊天吧，说说今天发生了什么有趣的事？",
          "要不要参加社区的活动？可以认识很多新朋友。",
          "记得多喝水，保持好心情哦。"
        ]
      },
      therapy: {
        doctorwang: [
          "从专业的角度来看，这种情况是很常见的。",
          "让我们一起来分析一下你的感受。",
          "我建议你可以尝试以下方法来调节情绪..."
        ],
        xiaoyue: [
          "我完全理解你的感受，这很正常。",
          "让我们一起探索一下你的想法和情绪。",
          "记住，你并不孤单，我会一直支持你。"
        ]
      }
    };

    const characterResponses = responses[activeTab]?.[character.id] || [];
    return characterResponses[Math.floor(Math.random() * characterResponses.length)] || "我明白你的意思，让我们继续聊下去。";
  };

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 标签页切换 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('companion.title')}</h1>
            <p className="text-lg text-gray-600 mb-8">{t('companion.description')}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* AI伙伴 */}
              <div 
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                  activeTab === 'ai' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setActiveTab('ai')}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{t('companion.ai.title')}</h2>
                </div>
                <p className="text-gray-600 mb-4">{t('companion.ai.description')}</p>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {t('companion.ai.features.chat')}
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {t('companion.ai.features.support')}
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {t('companion.ai.features.personality')}
                  </li>
                </ul>
                <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                  {t('companion.ai.button')}
                </button>
              </div>

              {/* 孤独陪伴 */}
              <div 
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                  activeTab === 'elderly' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-green-300'
                }`}
                onClick={() => setActiveTab('elderly')}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{t('companion.elderly.title')}</h2>
                </div>
                <p className="text-gray-600 mb-4">{t('companion.elderly.description')}</p>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {t('companion.elderly.features.daily')}
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {t('companion.elderly.features.health')}
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {t('companion.elderly.features.community')}
                  </li>
                </ul>
                <button className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition">
                  {t('companion.elderly.button')}
                </button>
              </div>

              {/* 心灵抚慰 */}
              <div 
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                  activeTab === 'therapy' 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => setActiveTab('therapy')}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{t('companion.therapy.title')}</h2>
                </div>
                <p className="text-gray-600 mb-4">{t('companion.therapy.description')}</p>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {t('companion.therapy.features.consultation')}
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {t('companion.therapy.features.tools')}
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {t('companion.therapy.features.resources')}
                  </li>
                </ul>
                <button className="mt-4 w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition">
                  {t('companion.therapy.button')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 聊天界面 - 现在对所有标签页都可见 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex h-[600px]">
            {/* 角色选择侧边栏 */}
            <div className="w-1/4 border-r border-gray-200 p-4 overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">{t('companion.chat.title')}</h3>
              <div className="space-y-4">
                {currentCharacters.map((character) => (
                  <div
                    key={character.id}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedCharacter?.id === character.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50 border border-gray-200'
                    }`}
                    onClick={() => handleCharacterSelect(character)}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={character.avatar}
                        alt={character.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h4 className="font-medium">{character.name}</h4>
                        <p className="text-sm text-gray-500">
                          {character.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 聊天区域 */}
            <div className="flex-1 flex flex-col">
              {selectedCharacter ? (
                <>
                  {/* 角色信息头部 */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedCharacter.avatar}
                        alt={selectedCharacter.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-medium">{selectedCharacter.name}</h3>
                        <p className="text-sm text-gray-500">
                          {selectedCharacter.personality}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 消息列表 */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex mb-4 ${
                          message.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message.sender === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start mb-4">
                        <div className="bg-gray-100 rounded-lg p-3">
                          {t('companion.chat.thinking')}
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* 输入区域 */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 text-gray-500 hover:text-gray-700"
                      >
                        {t('companion.chat.emoji')}
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 text-gray-500 hover:text-gray-700"
                      >
                        {t('companion.chat.image')}
                      </button>
                      <button
                        onClick={handleVoiceChat}
                        className={`p-2 ${
                          isRecording 
                            ? 'text-red-500 animate-pulse' 
                            : isVoiceChatActive 
                              ? 'text-green-500' 
                              : 'text-gray-500 hover:text-gray-700'
                        }`}
                        title={isRecording ? t('companion.chat.stopVoice') : t('companion.chat.startVoice')}
                      >
                        {isRecording ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                        )}
                      </button>
                      {voiceChatStatus === 'connecting' && (
                        <div className="text-sm text-gray-500">
                          {t('companion.chat.connecting')}
                        </div>
                      )}
                      {voiceChatStatus === 'error' && (
                        <div className="text-sm text-red-500">
                          {t('companion.chat.voiceError')}
                        </div>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={t('companion.chat.inputPlaceholder')}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        {t('companion.chat.send')}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-500">{t('companion.chat.selectCharacter')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanionPage;