import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FeatureIllustrations from '../components/common/FeatureIllustrations';
import CreateDigitalHuman from '../components/digitalHuman/CreateDigitalHuman';
import VoiceChat from '../components/digitalHuman/EnhancedVoiceChat';
import digitalHumanService from '../services/digitalHumanService';

const DigitalHumanExperiencePage = ({ create = false }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedHuman, setSelectedHuman] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(create);
  const [showVoiceChat, setShowVoiceChat] = useState(false);
  const [activeTab, setActiveTab] = useState('memories');
  const [newMemory, setNewMemory] = useState('');
  const [digitalHumans, setDigitalHumans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  async function fetchDigitalHumans() {
    try {
      setIsLoading(true);
      setLoadError(null);
      const humans = await digitalHumanService.getAll();
      setDigitalHumans(humans);
    } catch (error) {
      console.error('Error fetching digital humans:', error);
      setLoadError(t('digitalHuman.errors.loadFailed'));
      setDigitalHumans([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchDigitalHumans();
  }, []);

  const handleCreateDigitalHuman = async (digitalHumanId) => {
    try {
      const newHuman = await digitalHumanService.getById(digitalHumanId);
      setDigitalHumans(prevHumans => [...prevHumans, newHuman]);
      setShowCreateModal(false);
      setSelectedHuman(newHuman);
    } catch (error) {
      console.error('Error creating digital human:', error);
      alert(t('digitalHuman.creation.error'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-8">
            {t('digitalHuman.title')}
          </h1>
          
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex justify-center mb-8">
              <FeatureIllustrations type="digitalHuman" size="lg" />
            </div>
            <p className="text-gray-600 text-center mb-8">
              {t('digitalHuman.description')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-600 mb-2">记忆数字化</h3>
                <p className="text-gray-600">通过AI技术，将您的记忆、照片和视频转化为数字形式</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">AI训练系统</h3>
                <p className="text-gray-600">使用先进的AI模型，学习您的性格特征和说话方式</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-600 mb-2">硬件集成</h3>
                <p className="text-gray-600">为未来脑机接口做好准备，实现真正的数字永生</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">持续进化</h3>
                <p className="text-gray-600">您的数字版本会不断学习和进化，保持与时代的同步</p>
              </div>
            </div>
            <div className="text-center">
              <Link 
                to="/digital-human/create" 
                className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                {t('digitalHuman.createButton')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalHumanExperiencePage; 