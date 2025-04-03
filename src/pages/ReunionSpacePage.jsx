import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ReunionSpacePage = () => {
  const { t, ready } = useTranslation();
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [digitalAvatars, setDigitalAvatars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 模拟从API获取用户的数字亲人数据
  useEffect(() => {
    // 这里应该是从API获取数据
    // 模拟API调用
    const fetchDigitalAvatars = async () => {
      try {
        setLoading(true);
        setError(null);
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 模拟数据 - 实际应用中应从API获取
        const avatars = [
          { 
            id: 1, 
            name: '张爷爷', 
            image: '/images/avatars/grandfather.jpg', 
            relationship: '祖父',
            birthDate: '1930-05-15',
            deathDate: '2015-11-23',
            bio: '张爷爷是一位退休教师，喜欢园艺和下象棋。'
          },
          { 
            id: 2, 
            name: '李奶奶', 
            image: '/images/avatars/grandmother.jpg', 
            relationship: '祖母',
            birthDate: '1932-08-22',
            deathDate: '2018-03-10',
            bio: '李奶奶是一位慈爱的家庭主妇，擅长烹饪传统菜肴。'
          }
        ];
        
        setDigitalAvatars(avatars);
      } catch (error) {
        console.error('获取数字亲人数据失败:', error);
        setError(t('errors.general'));
      } finally {
        setLoading(false);
      }
    };

    fetchDigitalAvatars();
  }, [t]);

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

  const environments = [
    { id: 1, name: '老家的客厅', image: '/images/environments/living-room.jpg', description: '充满温馨回忆的家庭客厅' },
    { id: 2, name: '花园', image: '/images/environments/garden.jpg', description: '阳光明媚的家庭花园' },
    { id: 3, name: '海边', image: '/images/environments/beach.jpg', description: '宁静的海边日落' },
    { id: 4, name: '老房子', image: '/images/environments/old-house.jpg', description: '充满童年回忆的老房子' },
  ];

  const activities = [
    { id: 1, name: '家庭聚餐', image: '/images/activities/dinner.jpg', description: '一起享用美味的家庭晚餐' },
    { id: 2, name: '讲故事', image: '/images/activities/storytelling.jpg', description: '聆听长辈讲述家族故事' },
    { id: 3, name: '庆祝生日', image: '/images/activities/birthday.jpg', description: '为数字人庆祝生日' },
    { id: 4, name: '节日庆祝', image: '/images/activities/festival.jpg', description: '一起庆祝传统节日' },
  ];

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
            {t('reunionSpace.title')}
          </h1>
          <p className="text-xl text-gray-600 text-center mb-8">{t('reunionSpace.description')}</p>
          
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-medium text-center bg-gradient-to-r from-purple-500 to-indigo-500 text-transparent bg-clip-text"
            >
              {t('reunionSpace.slogan')}
            </motion.div>
          </div>

          {/* 选择数字人 */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">{t('reunionSpace.selectAvatar')}</h2>
              <Link 
                to="/digital-immortality/create" 
                className="text-purple-600 hover:text-purple-800 font-medium flex items-center"
              >
                <span>定制新的数字亲人</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : digitalAvatars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {digitalAvatars.map((avatar) => (
                  <motion.div
                    key={avatar.id}
                    whileHover={{ scale: 1.05 }}
                    className={`bg-white rounded-xl shadow-lg p-4 cursor-pointer transition-all duration-300 ${
                      selectedAvatar?.id === avatar.id ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => setSelectedAvatar(avatar)}
                  >
                    <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gray-200">
                      <img 
                        src={avatar.image} 
                        alt={avatar.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300?text=Avatar';
                        }}
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{avatar.name}</h3>
                    <p className="text-gray-600">{avatar.relationship}</p>
                    <p className="text-sm text-gray-500 mt-1">{avatar.birthDate} - {avatar.deathDate}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <p className="text-gray-600 mb-4">您还没有定制任何数字亲人</p>
                <Link 
                  to="/digital-immortality/create" 
                  className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                >
                  立即定制
                </Link>
              </div>
            )}
          </div>

          {/* 选择环境 */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('reunionSpace.selectEnvironment')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {environments.map((env) => (
                <motion.div
                  key={env.id}
                  whileHover={{ scale: 1.05 }}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                    selectedEnvironment?.id === env.id ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => setSelectedEnvironment(env)}
                >
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={env.image} 
                      alt={env.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x225?text=Environment';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">{env.name}</h3>
                    <p className="text-gray-600 text-sm">{env.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 选择活动 */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('reunionSpace.selectActivity')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {activities.map((activity) => (
                <motion.div
                  key={activity.id}
                  whileHover={{ scale: 1.05 }}
                  className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                    selectedActivity?.id === activity.id ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => setSelectedActivity(activity)}
                >
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={activity.image} 
                      alt={activity.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x225?text=Activity';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900">{activity.name}</h3>
                    <p className="text-gray-600 text-sm">{activity.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 特殊日期 */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('reunionSpace.specialDates')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('reunionSpace.birthday')}</h3>
                <p className="text-gray-600 mb-4">{t('reunionSpace.birthdayDesc')}</p>
                <button className="text-purple-600 hover:text-purple-800 font-medium">
                  {t('reunionSpace.planEvent')}
                </button>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('reunionSpace.anniversary')}</h3>
                <p className="text-gray-600 mb-4">{t('reunionSpace.anniversaryDesc')}</p>
                <button className="text-purple-600 hover:text-purple-800 font-medium">
                  {t('reunionSpace.planEvent')}
                </button>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('reunionSpace.festival')}</h3>
                <p className="text-gray-600 mb-4">{t('reunionSpace.festivalDesc')}</p>
                <button className="text-purple-600 hover:text-purple-800 font-medium">
                  {t('reunionSpace.planEvent')}
                </button>
              </div>
            </div>
          </div>

          {/* 开始团聚按钮 */}
          <div className="text-center">
            <button 
              className={`px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${
                selectedAvatar && selectedEnvironment && selectedActivity
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg transform hover:-translate-y-1'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!selectedAvatar || !selectedEnvironment || !selectedActivity}
            >
              {t('reunionSpace.startReunion')}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReunionSpacePage; 