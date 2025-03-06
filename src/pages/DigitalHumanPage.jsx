// pages/DigitalHumanPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const DigitalHumanPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [digitalHumans, setDigitalHumans] = useState([
    {
      id: '1',
      name: '张伯父',
      relationship: '祖父',
      avatar: '/assets/digital-humans/grandpa.jpg',
      memories: 15,
      createdAt: '2023-11-10',
      voiceModel: true,
      mediaFiles: 23
    },
    {
      id: '2',
      name: '李奶奶',
      relationship: '外婆',
      avatar: '/assets/digital-humans/grandma.jpg',
      memories: 7,
      createdAt: '2023-12-05',
      voiceModel: false,
      mediaFiles: 16
    }
  ]);
  const [selectedHuman, setSelectedHuman] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState('memories'); // memories, conversation, media, tree
  const [newMemory, setNewMemory] = useState('');
  
  // Mock family tree data
  const familyTreeData = {
    name: '张伯父',
    avatar: '/assets/digital-humans/grandpa.jpg',
    spouse: '王奶奶',
    children: [
      {
        name: '张叔叔',
        avatar: '/assets/digital-humans/uncle.jpg',
        spouse: '李阿姨',
        children: [
          { name: '张小明', avatar: '/assets/digital-humans/cousin1.jpg' },
          { name: '张小红', avatar: '/assets/digital-humans/cousin2.jpg' }
        ]
      },
      {
        name: '张母',
        avatar: '/assets/digital-humans/mother.jpg',
        spouse: '李父',
        children: [
          { name: '我', avatar: '/assets/digital-humans/me.jpg', current: true }
        ]
      }
    ]
  };
  
  // Mock memories
  const memories = [
    {
      id: 'm1',
      content: '张伯父教我下棋的时光是最美好的记忆，他总是有无穷的耐心，一遍遍教我如何思考下一步。',
      date: '2022-05-15',
      tags: ['童年', '家庭', '游戏']
    },
    {
      id: 'm2',
      content: '记得每年春节，伯父都会给我准备红包，还会讲述他年轻时候的故事，那些战争年代的经历让我深受启发。',
      date: '2023-01-21',
      tags: ['春节', '故事', '历史']
    },
    {
      id: 'm3',
      content: '伯父最喜欢的食物是红烧肉，每次奶奶做这道菜，他总会多吃两碗饭。我现在做红烧肉的方法，就是跟奶奶学的。',
      date: '2022-10-03',
      tags: ['美食', '家庭', '技艺']
    }
  ];
  
  // Mock conversation
  const conversation = [
    { id: 1, sender: 'user', content: '伯父，您还记得您是如何遇见奶奶的吗？' },
    { id: 2, sender: 'ai', content: '当然记得，那是1955年的春天，我在县城参加教师会议的时候遇见了你奶奶。她当时在文化馆工作，负责安排我们的住宿。她温柔大方，我第一眼见到她就被吸引住了。' },
    { id: 3, sender: 'user', content: '那您是怎么追到奶奶的呢？' },
    { id: 4, sender: 'ai', content: '哈哈，那时候不像你们现在这么开放。我每周都会去文化馆"偶遇"她，帮她整理书籍，一起讨论文学作品。大约三个月后，我鼓起勇气邀请她去看露天电影。半年后我们就订婚了，第二年结的婚。' },
  ];
  
  // Mock media files
  const mediaFiles = [
    { id: 'media1', type: 'image', url: '/assets/digital-humans/memory1.jpg', date: '1965-03-12', description: '结婚照' },
    { id: 'media2', type: 'image', url: '/assets/digital-humans/memory2.jpg', date: '1970-10-01', description: '全家福' },
    { id: 'media3', type: 'audio', url: '/assets/digital-humans/audio1.mp3', date: '1985-07-15', description: '讲述战争经历' },
    { id: 'media4', type: 'video', url: '/assets/digital-humans/video1.mp4', date: '1995-02-03', description: '80大寿视频' },
    { id: 'media5', type: 'image', url: '/assets/digital-humans/memory3.jpg', date: '2000-01-01', description: '千禧年新年' },
    { id: 'media6', type: 'image', url: '/assets/digital-humans/memory4.jpg', date: '2010-06-18', description: '与孙子们' },
  ];
  
  // Handle select digital human
  const handleSelectHuman = (human) => {
    setSelectedHuman(human);
    setActiveTab('memories');
  };
  
  // Add memory
  const handleAddMemory = () => {
    if (!newMemory.trim()) return;
    
    // In a real app, you'd send this to the backend
    alert(`已添加新记忆: ${newMemory}`);
    setNewMemory('');
  };
  
  // Render file thumbnail
  const MediaThumbnail = ({ file }) => {
    if (file.type === 'image') {
      return (
        <div className="relative group overflow-hidden rounded-lg">
          <img src={file.url} alt={file.description} className="w-full h-24 object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <span className="text-white text-sm">{file.description}</span>
          </div>
        </div>
      );
    } else if (file.type === 'audio') {
      return (
        <div className="relative group overflow-hidden rounded-lg bg-purple-100 p-2 flex items-center justify-center h-24">
          <div className="text-purple-600 text-3xl">🎵</div>
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <span className="text-white text-sm">{file.description}</span>
          </div>
        </div>
      );
    } else if (file.type === 'video') {
      return (
        <div className="relative group overflow-hidden rounded-lg bg-blue-100 p-2 flex items-center justify-center h-24">
          <div className="text-blue-600 text-3xl">🎬</div>
          <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <span className="text-white text-sm">{file.description}</span>
          </div>
        </div>
      );
    }
    return null;
  };
  
  // Render family tree node
  const FamilyTreeNode = ({ node, level = 0 }) => {
    return (
      <div className="mb-4">
        <div className={`flex items-center ${node.current ? 'bg-purple-50 border border-purple-200 rounded-lg p-2' : ''}`}>
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
            <img src={node.avatar} alt={node.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className={`font-medium ${node.current ? 'text-purple-700' : 'text-gray-900'}`}>{node.name}</h4>
            {node.spouse && <p className="text-xs text-gray-500">配偶: {node.spouse}</p>}
          </div>
        </div>
        
        {node.children && node.children.length > 0 && (
          <div className="pl-8 mt-2 border-l-2 border-gray-200">
            {node.children.map((child, index) => (
              <FamilyTreeNode key={`${child.name}-${index}`} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="container mx-auto">
        {/* Page Header */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{t('digitalHuman.title')}</h1>
            <p className="text-gray-600 mt-1">{t('digitalHuman.description')}</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            {t('digitalHuman.createButton')}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Digital Human Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-4">
              <h2 className="font-bold text-lg text-gray-800 mb-4">我的数字人</h2>
              <div className="space-y-3">
                {digitalHumans.map((human) => (
                  <div 
                    key={human.id} 
                    onClick={() => handleSelectHuman(human)}
                    className={`p-3 flex items-center rounded-lg cursor-pointer transition ${
                      selectedHuman?.id === human.id 
                        ? 'bg-purple-50 border-l-4 border-purple-500' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                      <img src={human.avatar} alt={human.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{human.name}</h3>
                      <div className="text-xs text-gray-500">
                        {human.relationship} · {human.memories} 记忆 · {human.mediaFiles} 媒体文件
                      </div>
                      <div className="mt-1 flex items-center">
                        {human.voiceModel && (
                          <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                            声音模型
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {digitalHumans.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-gray-500">您还没有创建数字人</p>
                    <button 
                      onClick={() => setShowCreateModal(true)}
                      className="mt-3 text-purple-600 hover:text-purple-800 transition"
                    >
                      创建数字人
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {!selectedHuman ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">创建数字人</h2>
                <p className="text-gray-600 mb-6">通过录入照片、声音、视频和珍贵记忆，创建您爱的人的数字形象，永远珍藏这些记忆。</p>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
                >
                  开始创建数字人
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Digital Human Header */}
                <div className="h-40 md:h-60 relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                  <div className="absolute inset-0 flex items-end">
                    <div className="w-32 h-32 md:w-48 md:h-48 relative mx-auto mb-[-24px] md:mb-[-40px]">
                      <img 
                        src={selectedHuman.avatar} 
                        alt={selectedHuman.name}
                        className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-10 md:pt-14 px-4 md:px-8">
                  {/* Name and Info */}
                  <div className="text-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{selectedHuman.name}</h2>
                    <p className="text-gray-500">
                      {selectedHuman.relationship} · 创建于 {selectedHuman.createdAt}
                    </p>
                  </div>

                  {/* Tabs */}
                  <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-6">
                      <button
                        onClick={() => setActiveTab('memories')}
                        className={`py-3 border-b-2 font-medium text-sm ${activeTab === 'memories' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                      >
                        记忆库
                      </button>
                      <button
                        onClick={() => setActiveTab('conversation')}
                        className={`py-3 border-b-2 font-medium text-sm ${activeTab === 'conversation' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                      >
                        对话
                      </button>
                      <button
                        onClick={() => setActiveTab('media')}
                        className={`py-3 border-b-2 font-medium text-sm ${activeTab === 'media' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                      >
                        媒体文件
                      </button>
                      <button
                        onClick={() => setActiveTab('tree')}
                        className={`py-3 border-b-2 font-medium text-sm ${activeTab === 'tree' ? 'border-purple-500 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                      >
                        家族树
                      </button>
                    </nav>
                  </div>

                  {/* Tab Content */}
                  {activeTab === 'memories' && (
                    <div className="mb-6">
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">添加新记忆</h3>
                        <div className="flex">
                          <textarea
                            value={newMemory}
                            onChange={(e) => setNewMemory(e.target.value)}
                            placeholder="记录一个关于此人的珍贵记忆..."
                            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            rows="2"
                          ></textarea>
                          <button
                            onClick={handleAddMemory}
                            className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700 transition"
                          >
                            保存
                          </button>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">这些记忆将用于训练数字人，让其更好地呈现真实的人格特征。</div>
                      </div>

                      <h3 className="text-lg font-medium text-gray-900 mb-4">记忆库</h3>
                      <div className="space-y-4">
                        {memories.map((memory) => (
                          <div key={memory.id} className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-800 mb-3">{memory.content}</p>
                            <div className="flex justify-between items-center">
                              <div className="flex space-x-2">
                                {memory.tags.map((tag, i) => (
                                  <span key={i} className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">{memory.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'conversation' && (
                    <div className="mb-6">
                      <div className="mb-4 bg-purple-50 rounded-lg p-3">
                        <p className="text-sm text-purple-700">
                          您可以与数字人进行对话，探索珍贵记忆，感受他们的性格和思想。
                        </p>
                      </div>

                      <div className="space-y-4 mb-4">
                        {conversation.map((msg) => (
                          <div 
                            key={msg.id} 
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            {msg.sender === 'ai' && (
                              <div className="w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0">
                                <img src={selectedHuman.avatar} alt={selectedHuman.name} className="w-full h-full object-cover" />
                              </div>
                            )}
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
                      </div>

                      <div className="flex">
                        <input
                          type="text"
                          placeholder="输入消息..."
                          className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button
                          className="bg-purple-600 text-white px-4 py-2 rounded-r-lg hover:bg-purple-700 transition"
                        >
                          发送
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'media' && (
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">媒体文件</h3>
                        <button className="text-sm text-purple-600 hover:text-purple-800 transition">
                          上传新文件
                        </button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {mediaFiles.map((file) => (
                          <MediaThumbnail key={file.id} file={file} />
                        ))}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center h-24 cursor-pointer hover:border-purple-500">
                          <span className="text-gray-500 text-2xl">+</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'tree' && (
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">{t('digitalHuman.familyTree')}</h3>
                        <button
                          onClick={() => navigate(`/digital-human/family-tree/${selectedHuman.id}`)}
                          className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                        >
                          {t('digitalHuman.reunionFeatures.title')}
                        </button>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-5">
                        <p className="text-purple-700">{t('digitalHuman.reunionFeatures.description')}</p>
                      </div>
                      <FamilyTreeNode node={familyTreeData} />
                      <div className="mt-6 text-center">
                        <Link 
                          to={`/digital-human/family-tree/${selectedHuman.id}`}
                          className="text-purple-600 hover:text-purple-800 transition font-medium"
                        >
                          {t('digitalHuman.visualTree')} →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Digital Human Modal - Simplified version */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">创建数字人</h3>
              <p className="text-gray-600 mb-4">填写基本信息以创建一个数字人形象。之后您可以添加记忆、上传照片和声音样本。</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">名称</label>
                  <input
                    type="text"
                    placeholder="数字人的名字"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">关系</label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="">选择关系</option>
                    <option value="father">父亲</option>
                    <option value="mother">母亲</option>
                    <option value="grandfather">祖父</option>
                    <option value="grandmother">祖母</option>
                    <option value="other">其他</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-1">上传照片</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500">
                    <div className="text-gray-500 mb-2">点击或拖放照片</div>
                    <div className="text-xs text-gray-400">支持 JPG, PNG 格式</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    alert('此功能仅作演示，实际创建需要更复杂的上传和训练流程');
                    setShowCreateModal(false);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  创建
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalHumanPage;