// pages/PetPage.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const PetPage = () => {
  const { t, i18n } = useTranslation();
  const [selectedPet, setSelectedPet] = useState(null);
  const [petStats, setPetStats] = useState(null);
  const [pets, setPets] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('cat');
  const [customPetData, setCustomPetData] = useState({
    name: '',
    photo: null,
    video: null,
    realSound: null,
    customVoice: null,
    memories: [],
    personality: 'friendly'
  });

  // Mock pet data
  useEffect(() => {
    setPets([
      {
        id: '1',
        name: '小花',
        species: 'cat',
        avatar: '/assets/pets/cat.jpg',
        stats: {
          happiness: 80,
          energy: 60,
          health: 90,
          experience: 350,
          level: 3
        },
        lastInteraction: new Date().toISOString()
      },
      {
        id: '2',
        name: '旺财',
        species: 'dog',
        avatar: '/assets/pets/dog.jpg',
        stats: {
          happiness: 95,
          energy: 75,
          health: 85,
          experience: 520,
          level: 5
        },
        lastInteraction: new Date().toISOString()
      }
    ]);
  }, []);

  // Pet species options
  const petSpecies = [
    { id: 'cat', name: '猫', avatar: '/assets/pets/cat-icon.jpg' },
    { id: 'dog', name: '狗', avatar: '/assets/pets/dog-icon.jpg' },
    { id: 'rabbit', name: '兔子', avatar: '/assets/pets/rabbit-icon.jpg' },
    { id: 'bird', name: '鸟', avatar: '/assets/pets/bird-icon.jpg' }
  ];

  // Select a pet
  const handleSelectPet = (pet) => {
    setSelectedPet(pet);
    setPetStats(pet.stats);
  };

  // Create a new pet
  const handleCreatePet = () => {
    if (!newPetName.trim()) return;
    
    const newPet = {
      id: `${pets.length + 1}`,
      name: newPetName,
      species: selectedSpecies,
      avatar: `/assets/pets/${selectedSpecies}.jpg`,
      stats: {
        happiness: 50,
        energy: 50,
        health: 50,
        experience: 0,
        level: 1
      },
      lastInteraction: new Date().toISOString()
    };
    
    setPets([...pets, newPet]);
    setNewPetName('');
    setSelectedSpecies('cat');
    setShowCreateModal(false);
    handleSelectPet(newPet);
  };

  // Interact with pet
  const handlePetInteraction = (action) => {
    if (!selectedPet) return;

    const updatedStats = { ...petStats };
    
    switch(action) {
      case 'feed':
        updatedStats.happiness = Math.min(100, updatedStats.happiness + 10);
        updatedStats.energy = Math.min(100, updatedStats.energy + 15);
        break;
      case 'play':
        updatedStats.happiness = Math.min(100, updatedStats.happiness + 20);
        updatedStats.energy = Math.max(0, updatedStats.energy - 10);
        updatedStats.experience = updatedStats.experience + 20;
        break;
      case 'sleep':
        updatedStats.energy = Math.min(100, updatedStats.energy + 30);
        break;
      case 'clean':
        updatedStats.health = Math.min(100, updatedStats.health + 15);
        break;
      default:
        break;
    }
    
    // Check for level up
    if (updatedStats.experience >= updatedStats.level * 100) {
      updatedStats.level += 1;
    }
    
    setPetStats(updatedStats);
    
    // Update pet in the list
    const updatedPets = pets.map(p => {
      if (p.id === selectedPet.id) {
        return {
          ...p,
          stats: updatedStats,
          lastInteraction: new Date().toISOString()
        };
      }
      return p;
    });
    
    setPets(updatedPets);
    setSelectedPet({
      ...selectedPet,
      stats: updatedStats,
      lastInteraction: new Date().toISOString()
    });
  };

  // Handle custom pet creation
  const handleCustomPetCreate = () => {
    if (!customPetData.name.trim()) return;
    
    const newPet = {
      id: `${pets.length + 1}`,
      name: customPetData.name,
      species: 'custom',
      avatar: customPetData.photo || '/assets/pets/custom-pet.jpg',
      video: customPetData.video,
      sounds: {
        real: customPetData.realSound,
        custom: customPetData.customVoice
      },
      memories: customPetData.memories,
      personality: customPetData.personality,
      stats: {
        happiness: 50,
        energy: 50,
        health: 50,
        experience: 0,
        level: 1
      },
      lastInteraction: new Date().toISOString()
    };
    
    setPets([...pets, newPet]);
    setCustomPetData({
      name: '',
      photo: null,
      video: null,
      realSound: null,
      customVoice: null,
      memories: [],
      personality: 'friendly'
    });
    setShowCustomizeModal(false);
    handleSelectPet(newPet);
  };

  // Handle file uploads
  const handleFileUpload = (type, file) => {
    setCustomPetData(prev => ({
      ...prev,
      [type]: file
    }));
  };

  // Add memory
  const handleAddMemory = (memory) => {
    setCustomPetData(prev => ({
      ...prev,
      memories: [...prev.memories, {
        id: Date.now(),
        text: memory,
        date: new Date().toISOString()
      }]
    }));
  };

  // Change language
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Render stat bar
  const StatBar = ({ label, value, color }) => (
    <div className="mb-2">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="container mx-auto">
        {/* Page Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{t('pet.title')}</h1>
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-white rounded-lg shadow-sm p-1">
              <button 
                onClick={() => changeLanguage('zh-CN')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                  i18n.language === 'zh-CN' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                中文
              </button>
              <button 
                onClick={() => changeLanguage('en')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                  i18n.language === 'en' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                English
              </button>
            </div>
            <button 
              onClick={() => setShowCustomizeModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              {t('pet.customize')}
            </button>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              {t('pet.adopt')}
            </button>
          </div>
        </div>

        {/* Introduction Section */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t('pet.introduction.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-700 mb-2">{t('pet.introduction.customize.title')}</h3>
              <p className="text-gray-700 mb-3">
                {t('pet.introduction.customize.description')}
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>{t('pet.introduction.customize.features.photo')}</li>
                <li>{t('pet.introduction.customize.features.sound')}</li>
                <li>{t('pet.introduction.customize.features.voice')}</li>
                <li>{t('pet.introduction.customize.features.memories')}</li>
                <li>{t('pet.introduction.customize.features.personality')}</li>
              </ul>
              <button 
                onClick={() => setShowCustomizeModal(true)}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition w-full"
              >
                {t('pet.introduction.customize.button')}
              </button>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-700 mb-2">{t('pet.introduction.adopt.title')}</h3>
              <p className="text-gray-700 mb-3">
                {t('pet.introduction.adopt.description')}
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>{t('pet.introduction.adopt.features.species')}</li>
                <li>{t('pet.introduction.adopt.features.name')}</li>
                <li>{t('pet.introduction.adopt.features.stats')}</li>
                <li>{t('pet.introduction.adopt.features.memories')}</li>
                <li>{t('pet.introduction.adopt.features.growth')}</li>
              </ul>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition w-full"
              >
                {t('pet.introduction.adopt.button')}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Pet Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-4">
              <h2 className="font-bold text-lg text-gray-800 mb-4">{t('pet.myPets')}</h2>
              <div className="space-y-3">
                {pets.map((pet) => (
                  <div 
                    key={pet.id} 
                    onClick={() => handleSelectPet(pet)}
                    className={`p-3 flex items-center rounded-lg cursor-pointer transition ${
                      selectedPet?.id === pet.id 
                        ? 'bg-purple-50 border-l-4 border-purple-500' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                      <img src={pet.avatar} alt={pet.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{pet.name}</h3>
                      <div className="flex items-center">
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                          Lv.{pet.stats.level}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {pet.species === 'custom' ? t('pet.custom') : t(`pet.species.${pet.species}`)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pet Details and Interaction */}
          <div className="lg:col-span-3">
            {selectedPet ? (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pet Info */}
                  <div>
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedPet.name}</h2>
                      <p className="text-gray-600">{t(`pet.species.${selectedPet.species}`)}</p>
                    </div>
                    
                    {/* Stats */}
                    <div className="mb-6">
                      <h3 className="font-semibold text-gray-700 mb-3">{t('pet.stats')}</h3>
                      <StatBar label={t('pet.happiness')} value={petStats.happiness} color="bg-yellow-400" />
                      <StatBar label={t('pet.energy')} value={petStats.energy} color="bg-blue-400" />
                      <StatBar label={t('pet.health')} value={petStats.health} color="bg-green-400" />
                      <div className="mt-2 text-sm text-gray-600">
                        {t('pet.level')}: {petStats.level} | {t('pet.experience')}: {petStats.experience}
                      </div>
                    </div>

                    {/* Custom Pet Features */}
                    {selectedPet.species === 'custom' && (
                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-700 mb-3">{t('pet.customFeatures')}</h3>
                        <div className="space-y-4">
                          {/* Voice Controls */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-600 mb-2">{t('pet.voice')}</h4>
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => {/* Play real sound */}}
                                className="px-3 py-1 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
                              >
                                {t('pet.playRealSound')}
                              </button>
                              <button 
                                onClick={() => {/* Play custom voice */}}
                                className="px-3 py-1 bg-gray-100 rounded-lg text-sm hover:bg-gray-200"
                              >
                                {t('pet.playCustomVoice')}
                              </button>
                            </div>
                          </div>

                          {/* Memories */}
                          <div>
                            <h4 className="text-sm font-medium text-gray-600 mb-2">{t('pet.memories')}</h4>
                            <div className="space-y-2">
                              {selectedPet.memories.map(memory => (
                                <div key={memory.id} className="p-2 bg-gray-50 rounded-lg text-sm">
                                  {memory.text}
                                  <div className="text-xs text-gray-500 mt-1">
                                    {new Date(memory.date).toLocaleDateString()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Interaction Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => handlePetInteraction('feed')}
                        className="p-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition"
                      >
                        {t('pet.actions.feed')}
                      </button>
                      <button 
                        onClick={() => handlePetInteraction('play')}
                        className="p-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition"
                      >
                        {t('pet.actions.play')}
                      </button>
                      <button 
                        onClick={() => handlePetInteraction('sleep')}
                        className="p-2 bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200 transition"
                      >
                        {t('pet.actions.sleep')}
                      </button>
                      <button 
                        onClick={() => handlePetInteraction('clean')}
                        className="p-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition"
                      >
                        {t('pet.actions.clean')}
                      </button>
                    </div>
                  </div>

                  {/* Pet Display */}
                  <div className="relative">
                    {selectedPet.video ? (
                      <video 
                        src={selectedPet.video} 
                        className="w-full rounded-lg"
                        controls
                        autoPlay
                        loop
                      />
                    ) : (
                      <img 
                        src={selectedPet.avatar} 
                        alt={selectedPet.name}
                        className="w-full rounded-lg"
                      />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <p className="text-gray-600">{t('pet.selectPrompt')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Pet Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">{t('pet.createNew')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('pet.name')}
                </label>
                <input
                  type="text"
                  value={newPetName}
                  onChange={(e) => setNewPetName(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  placeholder={t('pet.namePlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('pet.species')}
                </label>
                <select
                  value={selectedSpecies}
                  onChange={(e) => setSelectedSpecies(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                >
                  {petSpecies.map(species => (
                    <option key={species.id} value={species.id}>
                      {t(`pet.species.${species.id}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleCreatePet}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {t('common.create')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customize Pet Modal */}
      {showCustomizeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">{t('pet.customizeTitle')}</h2>
            <div className="space-y-4">
              {/* Basic Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('pet.name')}
                </label>
                <input
                  type="text"
                  value={customPetData.name}
                  onChange={(e) => setCustomPetData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                  placeholder={t('pet.namePlaceholder')}
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('pet.photo')}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('photo', e.target.files[0])}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* Video Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('pet.video')}
                </label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileUpload('video', e.target.files[0])}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              {/* Sound Uploads */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('pet.realSound')}
                  </label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleFileUpload('realSound', e.target.files[0])}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('pet.customVoice')}
                  </label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleFileUpload('customVoice', e.target.files[0])}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>
              </div>

              {/* Memories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('pet.addMemory')}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    className="flex-1 p-2 border rounded-lg"
                    placeholder={t('pet.memoryPlaceholder')}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddMemory(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="' + t('pet.memoryPlaceholder') + '"]');
                      if (input.value) {
                        handleAddMemory(input.value);
                        input.value = '';
                      }
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    {t('common.add')}
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  {customPetData.memories.map(memory => (
                    <div key={memory.id} className="p-2 bg-gray-50 rounded-lg text-sm flex justify-between items-center">
                      <span>{memory.text}</span>
                      <button
                        onClick={() => {
                          setCustomPetData(prev => ({
                            ...prev,
                            memories: prev.memories.filter(m => m.id !== memory.id)
                          }));
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        {t('common.delete')}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personality */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('pet.personality')}
                </label>
                <select
                  value={customPetData.personality}
                  onChange={(e) => setCustomPetData(prev => ({ ...prev, personality: e.target.value }))}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="friendly">{t('pet.personalities.friendly')}</option>
                  <option value="playful">{t('pet.personalities.playful')}</option>
                  <option value="calm">{t('pet.personalities.calm')}</option>
                  <option value="energetic">{t('pet.personalities.energetic')}</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCustomizeModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  {t('common.cancel')}
                </button>
                <button
                  onClick={handleCustomPetCreate}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  {t('common.create')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetPage;