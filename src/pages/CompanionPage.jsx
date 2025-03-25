import React, { useState, useEffect, useRef } from 'react';

const CompanionPage = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="container mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 min-h-[80vh]">
            {/* Character Selection Sidebar */}
            <div className="md:col-span-1 border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-xl text-gray-800">选择您的AI伙伴</h2>
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">选择一个AI伙伴开始对话</h2>
                    <p className="text-gray-600">
                      从左侧选择一个AI角色，开始您的情感陪伴之旅。每个角色都有独特的性格和特点。
                    </p>
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
                        <h3 className="text-lg font-medium text-gray-800">开始与{selectedCharacter.name}的对话</h3>
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
                        placeholder="输入消息..."
                        className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        type="submit"
                        className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700 transition"
                        disabled={isLoading}
                      >
                        发送
                      </button>
                    </form>
                    <div className="mt-2 flex justify-center space-x-3 text-xs text-gray-500">
                      <button className="hover:text-purple-600">录音</button>
                      <span>|</span>
                      <button className="hover:text-purple-600">上传图片</button>
                      <span>|</span>
                      <button className="hover:text-purple-600">添加表情</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanionPage;