import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const CompanionPage = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ai'); // 'ai', 'elderly', 'therapy'
  const chatEndRef = useRef(null);

  // Mock AI companion characters
  useEffect(() => {
    setCharacters([
      { 
        id: '1', 
        name: '小艾', 
        personality: '温柔贴心，善解人意',
        description: '小艾是一位温柔体贴的AI助手，善于倾听和安慰，是您情感支持的最佳伙伴。'
      },
      { 
        id: '2', 
        name: '阿智', 
        personality: '幽默风趣，知识渊博',
        description: '阿智拥有丰富的知识，喜欢用幽默的方式交流，能给您带来欢乐和知识。'
      },
      { 
        id: '3', 
        name: '夏夏', 
        personality: '活泼开朗，充满活力',
        description: '夏夏性格开朗活泼，是您工作疲惫时放松心情的最佳伙伴。'
      },
      { 
        id: '4', 
        name: '星辰', 
        personality: '浪漫文艺，思维深邃',
        description: '星辰有着诗人般的灵魂，擅长文学和艺术交流，能给您带来精神层面的共鸣。'
      }
    ]);
  }, []);

  useEffect(() => {
    // Scroll to bottom of chat whenever conversation updates
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedCharacter) return;

    // Add user message to conversation
    const userMessage = { sender: 'user', content: message };
    setConversation([...conversation, userMessage]);
    setIsLoading(true);
    setMessage('');

    // Simulate AI response
    setTimeout(() => {
      let response;
      switch (selectedCharacter.id) {
        case '1':
          response = { 
            sender: 'ai', 
            content: `作为${selectedCharacter.name}，我能理解你的感受。有什么我能帮到你的吗？`,
            character: selectedCharacter 
          };
          break;
        case '2':
          response = { 
            sender: 'ai', 
            content: `有趣的问题！让${selectedCharacter.name}来思考一下这个...`,
            character: selectedCharacter 
          };
          break;
        case '3':
          response = { 
            sender: 'ai', 
            content: `嗨！${selectedCharacter.name}在这里！我们来聊点开心的事情吧！`,
            character: selectedCharacter 
          };
          break;
        case '4':
          response = { 
            sender: 'ai', 
            content: `${selectedCharacter.name}思考了一下你说的话...这让我想起了一首诗...`,
            character: selectedCharacter 
          };
          break;
        default:
          response = { 
            sender: 'ai', 
            content: '我理解你的意思了。请继续告诉我更多。',
            character: selectedCharacter 
          };
      }
      setConversation(prev => [...prev, response]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">{t('header.companions')}</h1>
      
      {/* 情感陪伴介绍部分 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* AI伙伴 */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
          <div className="text-purple-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-4">{t('companion.ai.title')}</h2>
          <p className="text-gray-600 mb-4">{t('companion.ai.description')}</p>
          <ul className="space-y-2 mb-4">
            <li className="flex items-center text-gray-600">
              <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {t('companion.ai.features.personality')}
            </li>
            <li className="flex items-center text-gray-600">
              <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {t('companion.ai.features.chat')}
            </li>
            <li className="flex items-center text-gray-600">
              <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {t('companion.ai.features.support')}
            </li>
          </ul>
          <button 
            onClick={() => setActiveTab('ai')}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition"
          >
            {t('companion.ai.button')}
          </button>
        </div>

        {/* 孤独陪伴 */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
          <div className="text-blue-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-4">{t('companion.elderly.title')}</h2>
          <p className="text-gray-600 mb-4">{t('companion.elderly.description')}</p>
          <ul className="space-y-2 mb-4">
            <li className="flex items-center text-gray-600">
              <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {t('companion.elderly.features.daily')}
            </li>
            <li className="flex items-center text-gray-600">
              <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {t('companion.elderly.features.health')}
            </li>
            <li className="flex items-center text-gray-600">
              <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {t('companion.elderly.features.activities')}
            </li>
          </ul>
          <button 
            onClick={() => setActiveTab('elderly')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            {t('companion.elderly.button')}
          </button>
        </div>

        {/* 心灵抚慰 */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
          <div className="text-green-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold mb-4">{t('companion.therapy.title')}</h2>
          <p className="text-gray-600 mb-4">{t('companion.therapy.description')}</p>
          <ul className="space-y-2 mb-4">
            <li className="flex items-center text-gray-600">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {t('companion.therapy.features.professional')}
            </li>
            <li className="flex items-center text-gray-600">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {t('companion.therapy.features.tools')}
            </li>
            <li className="flex items-center text-gray-600">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {t('companion.therapy.features.support')}
            </li>
          </ul>
          <button 
            onClick={() => setActiveTab('therapy')}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
          >
            {t('companion.therapy.button')}
          </button>
        </div>
      </div>

      {/* 功能区域 */}
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="container mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* AI伙伴聊天界面 */}
            {activeTab === 'ai' && (
              <div className="grid grid-cols-1 md:grid-cols-4 min-h-[80vh]">
                {/* Character Selection Sidebar */}
                <div className="md:col-span-1 border-r border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="font-bold text-xl text-gray-800">{t('companion.ai.select')}</h2>
                  </div>
                  <div className="overflow-y-auto h-[calc(80vh-64px)]">
                    {characters.map((character) => (
                      <div 
                        key={character.id} 
                        className={`p-4 flex items-center cursor-pointer hover:bg-gray-50 transition ${selectedCharacter?.id === character.id ? 'bg-purple-50 border-l-4 border-purple-500' : ''}`}
                        onClick={() => {
                          setSelectedCharacter(character);
                          setConversation([]);
                        }}
                      >
                        <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                          <div className="bg-purple-200 w-full h-full flex items-center justify-center">
                            <span className="text-purple-700 font-medium text-xs">{character.name}</span>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{character.name}</h3>
                          <p className="text-sm text-gray-500">{character.personality}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat Area */}
                <div className="md:col-span-3 flex flex-col">
                  {!selectedCharacter ? (
                    <div className="flex-1 flex items-center justify-center p-4 md:p-10 text-center">
                      <div className="max-w-md">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('companion.ai.selectPrompt')}</h2>
                        <p className="text-gray-600">{t('companion.ai.selectDescription')}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Chat Header */}
                      <div className="p-4 border-b border-gray-200 flex items-center">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                          <div className="bg-purple-200 w-full h-full flex items-center justify-center">
                            <span className="text-purple-700 font-medium text-xs">{selectedCharacter.name}</span>
                          </div>
                        </div>
                        <div>
                          <h2 className="font-medium text-gray-900">{selectedCharacter.name}</h2>
                          <p className="text-sm text-gray-500">{selectedCharacter.personality}</p>
                        </div>
                      </div>
                      
                      {/* Messages */}
                      <div className="flex-1 p-4 overflow-y-auto">
                        {conversation.length === 0 ? (
                          <div className="text-center py-10">
                            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-800">{t('companion.ai.startChat', { name: selectedCharacter.name })}</h3>
                            <p className="mt-2 text-gray-600">{selectedCharacter.description}</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {conversation.map((msg, index) => (
                              <div 
                                key={index} 
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div 
                                  className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                                    msg.sender === 'user' 
                                      ? 'bg-purple-600 text-white rounded-br-none' 
                                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                  }`}
                                >
                                  {msg.content}
                                </div>
                              </div>
                            ))}
                            {isLoading && (
                              <div className="flex justify-start">
                                <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg bg-gray-100 text-gray-800 rounded-bl-none">
                                  <div className="flex space-x-1">
                                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                  </div>
                                </div>
                              </div>
                            )}
                            <div ref={chatEndRef} />
                          </div>
                        )}
                      </div>
                      
                      {/* Input Field */}
                      <div className="p-4 border-t border-gray-200">
                        <form onSubmit={handleSendMessage} className="flex">
                          <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={t('companion.ai.inputPlaceholder')}
                            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <button
                            type="submit"
                            className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700 transition"
                            disabled={isLoading}
                          >
                            {t('companion.ai.send')}
                          </button>
                        </form>
                        <div className="mt-2 flex justify-center space-x-3 text-xs text-gray-500">
                          <button className="hover:text-purple-600">{t('companion.ai.record')}</button>
                          <span>|</span>
                          <button className="hover:text-purple-600">{t('companion.ai.uploadImage')}</button>
                          <span>|</span>
                          <button className="hover:text-purple-600">{t('companion.ai.addEmoji')}</button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* 孤独陪伴界面 */}
            {activeTab === 'elderly' && (
              <div className="p-8">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('companion.elderly.title')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* 日常陪伴 */}
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-blue-800 mb-4">{t('companion.elderly.daily.title')}</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <svg className="h-6 w-6 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-700">{t('companion.elderly.daily.reminder')}</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-6 w-6 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span className="text-gray-700">{t('companion.elderly.daily.schedule')}</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-6 w-6 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-700">{t('companion.elderly.daily.activities')}</span>
                        </li>
                      </ul>
                    </div>

                    {/* 健康关怀 */}
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-blue-800 mb-4">{t('companion.elderly.health.title')}</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <svg className="h-6 w-6 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-700">{t('companion.elderly.health.monitor')}</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-6 w-6 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-gray-700">{t('companion.elderly.health.medication')}</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-6 w-6 text-blue-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span className="text-gray-700">{t('companion.elderly.health.emergency')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* 社区互动 */}
                  <div className="mt-8 bg-blue-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-blue-800 mb-4">{t('companion.elderly.community.title')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <h4 className="font-medium text-gray-800 mb-2">{t('companion.elderly.community.groups')}</h4>
                        <p className="text-gray-600 text-sm">{t('companion.elderly.community.groupsDesc')}</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        </div>
                        <h4 className="font-medium text-gray-800 mb-2">{t('companion.elderly.community.events')}</h4>
                        <p className="text-gray-600 text-sm">{t('companion.elderly.community.eventsDesc')}</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <h4 className="font-medium text-gray-800 mb-2">{t('companion.elderly.community.support')}</h4>
                        <p className="text-gray-600 text-sm">{t('companion.elderly.community.supportDesc')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 心灵抚慰界面 */}
            {activeTab === 'therapy' && (
              <div className="p-8">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('companion.therapy.title')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* 专业咨询 */}
                    <div className="bg-green-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-green-800 mb-4">{t('companion.therapy.professional.title')}</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <svg className="h-6 w-6 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="text-gray-700">{t('companion.therapy.professional.consultants')}</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-6 w-6 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-gray-700">{t('companion.therapy.professional.schedule')}</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-6 w-6 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <span className="text-gray-700">{t('companion.therapy.professional.privacy')}</span>
                        </li>
                      </ul>
                    </div>

                    {/* 心理工具 */}
                    <div className="bg-green-50 rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-green-800 mb-4">{t('companion.therapy.tools.title')}</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start">
                          <svg className="h-6 w-6 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span className="text-gray-700">{t('companion.therapy.tools.assessment')}</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-6 w-6 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span className="text-gray-700">{t('companion.therapy.tools.exercises')}</span>
                        </li>
                        <li className="flex items-start">
                          <svg className="h-6 w-6 text-green-500 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span className="text-gray-700">{t('companion.therapy.tools.progress')}</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* 资源中心 */}
                  <div className="mt-8 bg-green-50 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-green-800 mb-4">{t('companion.therapy.resources.title')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <h4 className="font-medium text-gray-800 mb-2">{t('companion.therapy.resources.articles')}</h4>
                        <p className="text-gray-600 text-sm">{t('companion.therapy.resources.articlesDesc')}</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h4 className="font-medium text-gray-800 mb-2">{t('companion.therapy.resources.videos')}</h4>
                        <p className="text-gray-600 text-sm">{t('companion.therapy.resources.videosDesc')}</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <h4 className="font-medium text-gray-800 mb-2">{t('companion.therapy.resources.support')}</h4>
                        <p className="text-gray-600 text-sm">{t('companion.therapy.resources.supportDesc')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanionPage;