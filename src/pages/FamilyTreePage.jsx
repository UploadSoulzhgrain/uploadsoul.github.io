// pages/FamilyTreePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FamilyTreePage = () => {
  const { t } = useTranslation();
  const { digitalHumanId } = useParams();
  const [loading, setLoading] = useState(true);
  const [familyData, setFamilyData] = useState(null);
  const [viewMode, setViewMode] = useState('visual'); // visual, list, timeline
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showReunionModal, setShowReunionModal] = useState(false);
  
  // Mock digital humans
  const digitalHumans = [
    {
      id: '1',
      name: '张伯父',
      relationship: '祖父',
      avatar: '/assets/digital-humans/grandpa.jpg',
    },
    {
      id: '2',
      name: '李奶奶',
      relationship: '外婆',
      avatar: '/assets/digital-humans/grandma.jpg',
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
    memories: [
      {
        id: 'mem1',
        title: '第一次教我下象棋',
        date: '1992-07-15',
        description: '爷爷在我7岁时教我下象棋，那是夏天的一个下午，我们坐在院子的老槐树下，阳光透过树叶斑驳地洒在棋盘上。'
      }
    ]
  };

  // Timeline events
  const timelineEvents = [
    { year: '1930', event: t('digitalHuman.grandparentsBorn'), description: `${mockFamilyData.name}` },
    { year: '1955', event: t('digitalHuman.parentsBorn'), description: `${mockFamilyData.children[0].name} & ${mockFamilyData.children[1].name}` },
    { year: '1985', event: t('digitalHuman.selfBorn'), description: `${mockFamilyData.children[1].children[0].name}` },
    { year: '2015', event: `${mockFamilyData.name} ${t('digitalHuman.dateOfDeath')}`, description: '' },
    { year: '2023', event: t('digitalHuman.digitalHumanCreated'), description: `${mockFamilyData.name}` }
  ];

  useEffect(() => {
    // Simulate loading family data from API
    const fetchFamilyData = async () => {
      setLoading(true);
      try {
        // In a real app, you'd fetch this data from your backend
        setFamilyData(mockFamilyData);
      } catch (error) {
        console.error('Error fetching family data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyData();
  }, [digitalHumanId]);

  // Render a family tree node recursively
  const renderFamilyNode = (node, level = 0) => {
    if (!node) return null;

    return (
      <div className={`mb-6 ${level > 0 ? 'ml-8 border-l-2 border-gray-200 pl-6' : ''}`} key={node.id || node.name}>
        <div className="flex items-start">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-4 border-white shadow-lg">
            <img src={node.avatar} alt={node.name} className="w-full h-full object-cover" />
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
                <img src={node.spouse.avatar} alt={node.spouse.name} className="w-full h-full object-cover" />
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
          <p className="text-gray-600">{t('digitalHuman.loadingFamilyTree')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="container mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <div>
              <Link to="/digital-human" className="text-gray-500 hover:text-gray-700 transition flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                {t('digitalHuman.title')}
              </Link>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            {selectedHuman?.name} {t('digitalHuman.familyTree')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('digitalHuman.loveNeverDies')}
          </p>
        </div>

        {/* Reunion Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 mb-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl md:text-2xl font-bold mb-2">{t('digitalHuman.reunionFeatures.title')}</h2>
              <p className="opacity-90">{t('digitalHuman.reunionFeatures.description')}</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowReunionModal(true)}
                className="bg-white text-purple-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
              >
                {t('digitalHuman.reunionFeatures.createRoom')}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {viewMode === 'visual' && familyData && (
            <div className="family-tree-container">
              {renderFamilyNode(familyData)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FamilyTreePage;