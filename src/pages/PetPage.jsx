// pages/PetPage.jsx
import React, { useState, useEffect } from 'react';

const PetPage = () => {
  const [selectedPet, setSelectedPet] = useState(null);
  const [petStats, setPetStats] = useState(null);
  const [pets, setPets] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('cat');

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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">我的虚拟宠物</h1>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            领养新宠物
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Pet Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-4">
              <h2 className="font-bold text-lg text-gray-800 mb-4">我的宠物</h2>
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
                          {pet.species === 'cat' ? '猫' : 
                           pet.species === 'dog' ? '狗' : 
                           pet.species === 'rabbit' ? '兔子' : '鸟'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {pets.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-gray-500">您还没有宠物，快去领养一只吧！</p>
                    <button 
                      onClick={() => setShowCreateModal(true)}
                      className="mt-3 text-purple-600 hover:text-purple-800 transition"
                    >
                      领养宠物
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {!selectedPet ? (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">选择或领养宠物</h2>
                <p className="text-gray-600 mb-6">从左侧选择一只宠物进行互动，或者领养一只新的宠物开始您的养宠之旅。</p>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
                >
                  领养新宠物
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Pet Header */}
                <div className="h-40 md:h-60 relative bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                  <div className="absolute inset-0 flex items-end">
                    <div className="w-32 h-32 md:w-48 md:h-48 relative mx-auto mb-[-24px] md:mb-[-40px]">
                      <img 
                        src={selectedPet.avatar} 
                        alt={selectedPet.name}
                        className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
                      />
                      <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-10 md:pt-14 px-4 md:px-8">
                  {/* Pet Name and Info */}
                  <div className="text-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{selectedPet.name}</h2>
                    <p className="text-gray-500">
                      {selectedPet.species === 'cat' ? '猫' : 
                      selectedPet.species === 'dog' ? '狗' : 
                      selectedPet.species === 'rabbit' ? '兔子' : '鸟'} · 
                      等级 {petStats.level} · 
                      经验值 {petStats.experience}/{petStats.level * 100}
                    </p>
                  </div>

                  {/* Status Bars */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div>
                      <StatBar label="心情" value={petStats.happiness} color="bg-yellow-500" />
                    </div>
                    <div>
                      <StatBar label="体力" value={petStats.energy} color="bg-blue-500" />
                    </div>
                    <div>
                      <StatBar label="健康" value={petStats.health} color="bg-green-500" />
                    </div>
                    <div>
                      <StatBar 
                        label="经验" 
                        value={(petStats.experience / (petStats.level * 100)) * 100} 
                        color="bg-purple-500" 
                      />
                    </div>
                  </div>

                  {/* Interaction Buttons */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <button
                      onClick={() => handlePetInteraction('feed')}
                      className="flex flex-col items-center justify-center bg-amber-50 hover:bg-amber-100 transition p-4 rounded-lg"
                    >
                      <div className="text-3xl mb-2">🍖</div>
                      <span className="text-gray-800 font-medium">喂食</span>
                    </button>
                    <button
                      onClick={() => handlePetInteraction('play')}
                      className="flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 transition p-4 rounded-lg"
                    >
                      <div className="text-3xl mb-2">🎾</div>
                      <span className="text-gray-800 font-medium">玩耍</span>
                    </button>
                    <button
                      onClick={() => handlePetInteraction('sleep')}
                      className="flex flex-col items-center justify-center bg-purple-50 hover:bg-purple-100 transition p-4 rounded-lg"
                    >
                      <div className="text-3xl mb-2">😴</div>
                      <span className="text-gray-800 font-medium">休息</span>
                    </button>
                    <button
                      onClick={() => handlePetInteraction('clean')}
                      className="flex flex-col items-center justify-center bg-teal-50 hover:bg-teal-100 transition p-4 rounded-lg"
                    >
                      <div className="text-3xl mb-2">🛁</div>
                      <span className="text-gray-800 font-medium">清洁</span>
                    </button>
                  </div>

                  {/* Pet Customization Preview */}
                  <div className="border-t border-gray-200 pt-6 mb-8">
                    <h3 className="font-bold text-gray-800 mb-4">宠物装扮</h3>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      <div className="border border-gray-200 rounded-lg p-2 text-center cursor-pointer hover:border-purple-500">
                        <div className="text-2xl mb-1">🎩</div>
                        <span className="text-xs text-gray-600">帽子</span>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-2 text-center cursor-pointer hover:border-purple-500">
                        <div className="text-2xl mb-1">🧣</div>
                        <span className="text-xs text-gray-600">围巾</span>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-2 text-center cursor-pointer hover:border-purple-500">
                        <div className="text-2xl mb-1">👓</div>
                        <span className="text-xs text-gray-600">眼镜</span>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-2 text-center cursor-pointer hover:border-purple-500">
                        <div className="text-2xl mb-1">🦺</div>
                        <span className="text-xs text-gray-600">背心</span>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-2 text-center cursor-pointer hover:border-purple-500">
                        <div className="text-2xl mb-1">👕</div>
                        <span className="text-xs text-gray-600">衣服</span>
                      </div>
                      <div className="border border-dashed border-gray-300 rounded-lg p-2 text-center cursor-pointer hover:border-purple-500">
                        <div className="text-xl mb-1 text-gray-400">+</div>
                        <span className="text-xs text-gray-500">更多</span>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <button className="text-purple-600 hover:text-purple-800 transition text-sm">
                        前往商城查看更多宠物装扮 →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Pet Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">领养新宠物</h3>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">宠物名称</label>
                <input
                  type="text"
                  value={newPetName}
                  onChange={(e) => setNewPetName(e.target.value)}
                  placeholder="给您的宠物起个名字"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">宠物类型</label>
                <div className="grid grid-cols-4 gap-2">
                  {petSpecies.map((species) => (
                    <div
                      key={species.id}
                      onClick={() => setSelectedSpecies(species.id)}
                      className={`cursor-pointer border rounded-lg p-2 text-center transition ${
                        selectedSpecies === species.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="w-12 h-12 mx-auto rounded-full overflow-hidden mb-1">
                        <img src={species.avatar} alt={species.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm">{species.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  取消
                </button>
                <button
                  onClick={handleCreatePet}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  确认领养
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