// pages/FamilyTreePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const FamilyTreePage = () => {
  const { t, ready } = useTranslation();
  const { digitalHumanId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [familyData, setFamilyData] = useState(null);
  const [viewMode, setViewMode] = useState('visual'); // visual, list, timeline
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showReunionModal, setShowReunionModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [activeTab, setActiveTab] = useState('tree'); // 'tree', 'memories', 'events'
  
  // Mock digital humans
  const digitalHumans = [
    {
      id: '1',
      name: '张伯父',
      relationship: '祖父',
      avatar: '/assets/digital-humans/grandpa.jpg',
      birthDate: '1930-05-15',
      deathDate: '2015-11-23',
      bio: '张伯父是一位退休教师，喜欢园艺和下象棋。',
      memories: 5,
      events: 3,
      current: true
    },
    {
      id: '2',
      name: '李奶奶',
      relationship: '外婆',
      avatar: '/assets/digital-humans/grandma.jpg',
      birthDate: '1932-08-22',
      deathDate: '2018-03-10',
      bio: '李奶奶是一位慈爱的家庭主妇，擅长烹饪传统菜肴。',
      memories: 7,
      events: 4,
      current: true
    }
  ];

  // Mock memories data
  const memoriesData = [
    {
      id: 'mem1',
      title: '第一次教我下象棋',
      date: '1992-07-15',
      description: '爷爷在我7岁时教我下象棋，那是夏天的一个下午，我们坐在院子的老槐树下，阳光透过树叶斑驳地洒在棋盘上。'
    },
    {
      id: 'mem2',
      title: '奶奶的红烧肉',
      date: '1995-03-20',
      description: '奶奶的红烧肉是全家人的最爱，每次过节她都会做一大锅，香气四溢，让人垂涎欲滴。'
    }
  ];

  // Mock events data
  const eventsData = [
    {
      id: 'evt1',
      title: '爷爷的生日聚会',
      date: '2023-05-15',
      participants: 8,
      environment: '老家的客厅',
      activity: '家庭聚餐'
    },
    {
      id: 'evt2',
      title: '奶奶的纪念日',
      date: '2023-03-10',
      participants: 6,
      environment: '花园',
      activity: '讲故事'
    }
  ];

  // Get the selected digital human
  const selectedHuman = digitalHumans.find(human => human.id === digitalHumanId) || digitalHumans[0];

  // Mock family tree data
  const mockFamilyData = {
    id: 'root',
    name: '张伯父',
    relationship: '祖父',
    avatar: '/assets/digital-humans/grandpa.jpg',
    birthDate: '1930-05-15',
    deathDate: '2015-11-23',
    bio: '张伯父是一位退休教师，喜欢园艺和下象棋。他曾是家族的精神支柱，为后代树立了勤劳和奉献的榜样。',
    spouse: {
      name: '王奶奶',
      avatar: '/assets/digital-humans/grandma.jpg',
      birthDate: '1932-08-22',
      deathDate: '2018-03-10',
      bio: '王奶奶是一位慈爱的家庭主妇，擅长烹饪传统菜肴，尤其是红烧肉和饺子。她的爱心和关怀温暖了整个家族。'
    },
    children: [
      {
        id: 'child1',
        name: '张叔叔',
        relationship: '叔叔',
        avatar: '/assets/digital-humans/uncle.jpg',
        birthDate: '1955-02-18',
        bio: '张叔叔是一位成功的企业家，在电子行业有自己的公司。他热爱旅行和摄影。',
        spouse: {
          name: '李阿姨',
          avatar: '/assets/digital-humans/aunt.jpg',
          birthDate: '1957-11-30',
          bio: '李阿姨曾是一名医生，现已退休。她热爱园艺和阅读。'
        },
        children: [
          { 
            id: 'grandchild1',
            name: '张小明', 
            avatar: '/assets/digital-humans/cousin1.jpg',
            birthDate: '1985-07-12',
            bio: '张小明在IT行业工作，是一名软件工程师。他喜欢打篮球和旅游。'
          }
        ]
      },
      {
        id: 'child2',
        name: '张母',
        relationship: '母亲',
        avatar: '/assets/digital-humans/mother.jpg',
        birthDate: '1958-09-25',
        bio: '张母是一名小学教师，热爱教育事业。她擅长讲故事，常常用自己的经历教育孩子们。',
        spouse: {
          name: '李父',
          avatar: '/assets/digital-humans/father.jpg',
          birthDate: '1956-12-10',
          bio: '李父是一名机械工程师，喜欢修理各种家用电器。他的动手能力很强，总能解决家里的各种问题。'
        },
        children: [
          { 
            id: 'self',
            name: '我', 
            avatar: '/assets/digital-humans/me.jpg', 
            birthDate: '1985-06-23',
            bio: '我喜欢科技和历史，目前在一家科技公司工作。空闲时间喜欢研究家族历史和数字技术。',
            current: true 
          }
        ]
      }
    ],
    memories: memoriesData
  };

  // Timeline events
  const timelineEvents = [
    { year: '1930', event: t('familyTree.timeline.grandparentsBorn'), description: `${mockFamilyData.name}` },
    { year: '1955', event: t('familyTree.timeline.parentsBorn'), description: `${mockFamilyData.children[0].name} & ${mockFamilyData.children[1].name}` },
    { year: '1985', event: t('familyTree.timeline.selfBorn'), description: `${mockFamilyData.children[1].children[0].name}` },
    { year: '2015', event: `${mockFamilyData.name} ${t('familyTree.timeline.dateOfDeath')}`, description: '' },
    { year: '2023', event: t('familyTree.timeline.digitalHumanCreated'), description: `${mockFamilyData.name}` }
  ];

  useEffect(() => {
    // Simulate loading family data from API
    const fetchFamilyData = async () => {
      try {
        setLoading(true);
        setError(null);
        // In a real app, you'd fetch this data from your backend
        setFamilyData(mockFamilyData);
        // Set the first digital human as selected member
        setSelectedMember(digitalHumans[0]);
      } catch (error) {
        console.error('Error fetching family data:', error);
        setError(t('errors.general'));
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyData();
  }, [digitalHumanId, t]);

  // 如果翻译还没有准备好，显示加载状态
  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 text-purple-600 mx-auto mb-4">Loading...</div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // 如果发生错误，显示错误信息
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  // Render a family tree node recursively
  const renderFamilyNode = (node, level = 0) => {
    if (!node) return null;

    return (
      <div className={`mb-6 ${level > 0 ? 'ml-8 border-l-2 border-gray-200 pl-6' : ''}`} key={node.id || node.name}>
        <div className="flex items-start">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-4 border-white shadow-lg">
            <img 
              src={node.avatar} 
              alt={node.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/80?text=Avatar';
              }}
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h3 className="text-xl font-bold text-gray-900">{node.name}</h3>
              {node.current && (
                <span className="ml-2 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                  {t('digitalHuman.relationshipTypes.self')}
                </span>
              )}
            </div>

            {node.birthDate && (
              <p className="text-sm text-gray-600">
                {t('digitalHuman.dateOfBirth')}: {node.birthDate}
                {node.deathDate && ` · ${t('digitalHuman.dateOfDeath')}: ${node.deathDate}`}
              </p>
            )}

            {node.bio && <p className="text-gray-700 mt-2">{node.bio}</p>}
          </div>
        </div>

        {/* Spouse */}
        {node.spouse && (
          <div className="ml-8 mt-4 border-l-2 border-pink-200 pl-6">
            <div className="flex items-start">
              <div className="w-14 h-14 rounded-full overflow-hidden mr-4 border-2 border-pink-200">
                <img 
                  src={node.spouse.avatar} 
                  alt={node.spouse.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/80?text=Avatar';
                  }}
                />
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900">{node.spouse.name}</h4>
                <p className="text-sm text-gray-500">{t('digitalHuman.relationshipTypes.spouse')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Children */}
        {node.children && node.children.length > 0 && (
          <div className="mt-6 pl-4">
            <h4 className="text-sm font-medium text-gray-500 mb-3">{t('digitalHuman.relationshipTypes.child')}:</h4>
            {node.children.map((child) => renderFamilyNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 text-purple-600 mx-auto mb-4">Loading...</div>
          <p className="text-gray-600">{t('familyTree.loading')}</p>
        </div>
      </div>
    );
  }

  // Render the family tree
  const renderFamilyTree = () => {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-4xl">
            {/* 这里应该是一个实际的家族树可视化组件 */}
            {/* 为了演示，我们使用一个简化的版本 */}
            <div className="grid grid-cols-5 gap-4">
              {/* 第一代 */}
              <div className="col-span-5 flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`bg-purple-100 rounded-lg p-4 w-40 text-center cursor-pointer ${
                    selectedMember?.id === '1' ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => setSelectedMember(digitalHumans[0])}
                >
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-2 bg-gray-200">
                    <img 
                      src={digitalHumans[0].avatar} 
                      alt={digitalHumans[0].name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80?text=Avatar';
                      }}
                    />
                  </div>
                  <h3 className="font-semibold">{digitalHumans[0].name}</h3>
                  <p className="text-sm text-gray-600">{digitalHumans[0].relationship}</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`bg-purple-100 rounded-lg p-4 w-40 text-center cursor-pointer ${
                    selectedMember?.id === '2' ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => setSelectedMember(digitalHumans[1])}
                >
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-2 bg-gray-200">
                    <img 
                      src={digitalHumans[1].avatar} 
                      alt={digitalHumans[1].name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80?text=Avatar';
                      }}
                    />
                  </div>
                  <h3 className="font-semibold">{digitalHumans[1].name}</h3>
                  <p className="text-sm text-gray-600">{digitalHumans[1].relationship}</p>
                </motion.div>
              </div>
              
              {/* 第二代 */}
              <div className="col-span-5 flex justify-center gap-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`bg-indigo-100 rounded-lg p-4 w-40 text-center cursor-pointer ${
                    selectedMember?.id === '3' ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => setSelectedMember(mockFamilyData.children[0])}
                >
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-2 bg-gray-200">
                    <img 
                      src={mockFamilyData.children[0].avatar} 
                      alt={mockFamilyData.children[0].name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80?text=Avatar';
                      }}
                    />
                  </div>
                  <h3 className="font-semibold">{mockFamilyData.children[0].name}</h3>
                  <p className="text-sm text-gray-600">{mockFamilyData.children[0].relationship}</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`bg-indigo-100 rounded-lg p-4 w-40 text-center cursor-pointer ${
                    selectedMember?.id === '4' ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => setSelectedMember(mockFamilyData.children[1])}
                >
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-2 bg-gray-200">
                    <img 
                      src={mockFamilyData.children[1].avatar} 
                      alt={mockFamilyData.children[1].name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80?text=Avatar';
                      }}
                    />
                  </div>
                  <h3 className="font-semibold">{mockFamilyData.children[1].name}</h3>
                  <p className="text-sm text-gray-600">{mockFamilyData.children[1].relationship}</p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        
        {selectedMember && (
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="w-20 h-20 rounded-full overflow-hidden mr-4 bg-gray-200">
                <img 
                  src={selectedMember.avatar} 
                  alt={selectedMember.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/80?text=Avatar';
                  }}
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{selectedMember.name}</h3>
                <p className="text-gray-600">{selectedMember.relationship}</p>
                <p className="text-sm text-gray-500">
                  {t('familyTree.birthDate')}: {selectedMember.birthDate} | {t('familyTree.deathDate')}: {selectedMember.deathDate}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-purple-700">{t('familyTree.digitalAvatar')}</h4>
                <p className="text-gray-700">
                  {selectedMember.current ? t('familyTree.hasAvatar') : t('familyTree.noAvatar')}
                </p>
                {!selectedMember.current && (
                  <button className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                    {t('familyTree.createAvatar')}
                  </button>
                )}
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-indigo-700">{t('familyTree.memories')}</h4>
                <p className="text-gray-700">{selectedMember.memories || 0} {t('familyTree.memoryCount')}</p>
                <button className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors">
                  {t('familyTree.viewMemories')}
                </button>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-blue-700">{t('familyTree.events')}</h4>
                <p className="text-gray-700">{selectedMember.events || 0} {t('familyTree.eventCount')}</p>
                <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  {t('familyTree.viewEvents')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render the memories section
  const renderMemories = () => {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">{t('familyTree.memorySharing')}</h2>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
            {t('familyTree.addMemory')}
          </button>
        </div>
        
        <div className="space-y-6">
          {memoriesData.map((memory) => (
            <div key={memory.id} className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-900">{memory.title}</h3>
                <span className="text-sm text-gray-500">{memory.date}</span>
              </div>
              <p className="text-gray-600 mb-4">{memory.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{t('familyTree.contributor')}: {selectedHuman.name}</span>
                <div className="flex space-x-2">
                  <button className="text-purple-600 hover:text-purple-800">
                    {t('familyTree.edit')}
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    {t('familyTree.delete')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render the events section
  const renderEvents = () => {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">{t('familyTree.familyEvents')}</h2>
          <Link 
            to="/digital-rebirth/reunion-space" 
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {t('familyTree.planEvent')}
          </Link>
        </div>
        
        <div className="space-y-6">
          {eventsData.map((event) => (
            <div key={event.id} className="bg-gray-50 rounded-lg p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                <span className="text-sm text-gray-500">{event.date}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">{t('familyTree.participants')}</p>
                  <p className="font-medium">{event.participants} {t('familyTree.people')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('familyTree.environment')}</p>
                  <p className="font-medium">{event.environment}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('familyTree.activity')}</p>
                  <p className="font-medium">{event.activity}</p>
                </div>
              </div>
              <div className="flex justify-end">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  {t('familyTree.viewDetails')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-4">
            {t('familyTree.title')}
          </h1>
          <p className="text-xl text-gray-600 text-center mb-8">{t('familyTree.description')}</p>
          
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-medium text-center bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text"
            >
              {t('familyTree.slogan')}
            </motion.div>
          </div>

          {/* 标签页 */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
              <button
                className={`px-6 py-2 rounded-md transition-colors ${
                  activeTab === 'tree' ? 'bg-purple-100 text-purple-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('tree')}
              >
                {t('familyTree.treeTab')}
              </button>
              <button
                className={`px-6 py-2 rounded-md transition-colors ${
                  activeTab === 'memories' ? 'bg-purple-100 text-purple-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('memories')}
              >
                {t('familyTree.memoriesTab')}
              </button>
              <button
                className={`px-6 py-2 rounded-md transition-colors ${
                  activeTab === 'events' ? 'bg-purple-100 text-purple-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('events')}
              >
                {t('familyTree.eventsTab')}
              </button>
            </div>
          </div>

          {/* 内容区域 */}
          {activeTab === 'tree' && renderFamilyTree()}
          {activeTab === 'memories' && renderMemories()}
          {activeTab === 'events' && renderEvents()}

          {/* 特殊日期提醒 */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('familyTree.upcomingDates')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">{t('familyTree.grandfatherBirthday')}</h3>
                <p className="text-gray-700 mb-2">2023-05-15</p>
                <p className="text-gray-600 text-sm mb-4">{t('familyTree.grandfatherBirthdayDesc')}</p>
                <Link 
                  to="/digital-rebirth/reunion-space" 
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors inline-block"
                >
                  {t('familyTree.planEvent')}
                </Link>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">{t('familyTree.grandmotherAnniversary')}</h3>
                <p className="text-gray-700 mb-2">2023-11-10</p>
                <p className="text-gray-600 text-sm mb-4">{t('familyTree.grandmotherAnniversaryDesc')}</p>
                <Link 
                  to="/digital-rebirth/reunion-space" 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors inline-block"
                >
                  {t('familyTree.planEvent')}
                </Link>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">{t('familyTree.familyReunion')}</h3>
                <p className="text-gray-700 mb-2">2023-12-25</p>
                <p className="text-gray-600 text-sm mb-4">{t('familyTree.familyReunionDesc')}</p>
                <Link 
                  to="/digital-rebirth/reunion-space" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                >
                  {t('familyTree.planEvent')}
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FamilyTreePage;