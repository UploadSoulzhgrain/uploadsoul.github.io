// pages/VRPage.jsx
import React, { useState, useEffect, useRef } from 'react';

const VRPage = () => {
  const [isVRSupported, setIsVRSupported] = useState(true); // Assume supported for demo
  const [vrEnvironments, setVrEnvironments] = useState([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [vrCharacters, setVrCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isVRMode, setIsVRMode] = useState(false);
  const canvasRef = useRef(null);
  
  // Mock VR environments
  useEffect(() => {
    setVrEnvironments([
      {
        id: 'env1',
        name: '现代客厅',
        thumbnail: '/assets/vr/living-room.jpg',
        description: '舒适现代的家庭客厅环境，温暖而私密的对话空间'
      },
      {
        id: 'env2',
        name: '海滩日落',
        thumbnail: '/assets/vr/beach.jpg',
        description: '浪漫的海滩日落场景，伴随着轻柔的海浪声'
      },
      {
        id: 'env3',
        name: '星空花园',
        thumbnail: '/assets/vr/garden.jpg',
        description: '梦幻的星空下的花园，点点星光照亮夜空'
      },
      {
        id: 'env4',
        name: '城市咖啡馆',
        thumbnail: '/assets/vr/cafe.jpg',
        description: '热闹的城市咖啡馆，充满生活气息的约会场所'
      }
    ]);
    
    setVrCharacters([
      { 
        id: 'char1', 
        name: '小艾', 
        avatar: '/assets/characters/companion-1.jpg',
        model: '/assets/vr/models/companion-1.glb'
      },
      { 
        id: 'char2', 
        name: '阿智', 
        avatar: '/assets/characters/companion-2.jpg',
        model: '/assets/vr/models/companion-2.glb'
      },
      { 
        id: 'char3', 
        name: '夏夏', 
        avatar: '/assets/characters/companion-3.jpg',
        model: '/assets/vr/models/companion-3.glb'
      },
      { 
        id: 'char4', 
        name: '星辰', 
        avatar: '/assets/characters/companion-4.jpg',
        model: '/assets/vr/models/companion-4.glb'
      }
    ]);
  }, []);
  
  // Handle environment selection
  const selectEnvironment = (env) => {
    setSelectedEnvironment(env);
  };
  
  // Handle character selection
  const selectCharacter = (char) => {
    setSelectedCharacter(char);
  };
  
  // Toggle VR mode
  const toggleVRMode = () => {
    if (!selectedEnvironment || !selectedCharacter) {
      alert('请先选择环境和角色');
      return;
    }
    setIsVRMode(!isVRMode);
    
    // In a real app, this would initialize WebXR and Three.js
    if (!isVRMode) {
      setTimeout(() => {
        alert('此功能仅作界面演示，需要WebXR和Three.js真实实现VR体验');
      }, 500);
    }
  };
  
  // Render environment card
  const EnvironmentCard = ({ environment, isSelected, onClick }) => (
    <div 
      className={`cursor-pointer rounded-lg overflow-hidden shadow transition ${isSelected ? 'ring-2 ring-purple-500' : 'hover:shadow-md'}`}
      onClick={() => onClick(environment)}
    >
      <div className="h-36 overflow-hidden">
        <img 
          src={environment.thumbnail} 
          alt={environment.name} 
          className="w-full h-full object-cover transition transform hover:scale-105"
        />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-900">{environment.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{environment.description}</p>
      </div>
    </div>
  );
  
  // Render character card
  const CharacterCard = ({ character, isSelected, onClick }) => (
    <div 
      className={`cursor-pointer rounded-lg overflow-hidden shadow transition ${isSelected ? 'ring-2 ring-purple-500' : 'hover:shadow-md'}`}
      onClick={() => onClick(character)}
    >
      <div className="h-36 overflow-hidden">
        <img 
          src={character.avatar} 
          alt={character.name} 
          className="w-full h-full object-cover transition transform hover:scale-105"
        />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-gray-900">{character.name}</h3>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="container mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">VR体验专区</h1>
          <p className="text-gray-600 mt-2">通过VR技术，与您的AI伙伴进行沉浸式互动体验</p>
        </div>
        
        {!isVRSupported ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-700">您的设备似乎不支持VR体验。请使用支持WebXR的设备和浏览器。</p>
          </div>
        ) : null}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* VR Setup Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Environment Selection */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <h2 className="font-bold text-lg text-gray-800 mb-3">选择环境</h2>
              <div className="grid grid-cols-2 gap-3">
                {vrEnvironments.map((env) => (
                  <EnvironmentCard
                    key={env.id}
                    environment={env}
                    isSelected={selectedEnvironment?.id === env.id}
                    onClick={selectEnvironment}
                  />
                ))}
              </div>
            </div>
            
            {/* Character Selection */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <h2 className="font-bold text-lg text-gray-800 mb-3">选择角色</h2>
              <div className="grid grid-cols-2 gap-3">
                {vrCharacters.map((char) => (
                  <CharacterCard
                    key={char.id}
                    character={char}
                    isSelected={selectedCharacter?.id === char.id}
                    onClick={selectCharacter}
                  />
                ))}
              </div>
            </div>
            
            {/* VR Controls */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <h2 className="font-bold text-lg text-gray-800 mb-3">VR控制</h2>
              <button
                onClick={toggleVRMode}
                disabled={!isVRSupported}
                className={`w-full py-3 rounded-lg font-medium ${isVRMode 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white'} 
                  transition disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isVRMode ? '退出VR模式' : '进入VR模式'}
              </button>
              
              <div className="mt-4 text-sm text-gray-600">
                <h3 className="font-medium mb-1">VR体验提示：</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>确保您使用支持VR的设备和浏览器</li>
                  <li>建议使用耳机获得更好的音频体验</li>
                  <li>保持周围环境安全，预留足够的活动空间</li>
                  <li>如感到不适，请立即退出VR模式</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* VR Preview/Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-4 h-full">
              {!selectedEnvironment || !selectedCharacter ? (
                <div className="flex flex-col items-center justify-center h-full py-10 text-center">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">准备VR体验</h3>
                  <p className="text-gray-600 mb-4 max-w-md">
                    请从左侧面板选择一个虚拟环境和一个AI角色，然后点击"进入VR模式"开始沉浸式体验。
                  </p>
                </div>
              ) : (
                <div className="h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-900">
                      {selectedEnvironment.name} + {selectedCharacter.name}
                    </h3>
                    {isVRMode && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                        VR模式运行中
                      </span>
                    )}
                  </div>
                  
                  {/* VR Canvas */}
                  <div className="relative rounded-lg overflow-hidden bg-gray-900 h-[400px] flex items-center justify-center">
                    <canvas ref={canvasRef} className="w-full h-full"></canvas>
                    
                    {/* Preview Image (in real app, this would be Three.js content) */}
                    <img 
                      src={selectedEnvironment.thumbnail} 
                      alt="VR Preview" 
                      className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    
                    {!isVRMode && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-40 text-white">
                        <button
                          onClick={toggleVRMode}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          进入VR体验
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Interaction Controls */}
                  <div className="mt-4 flex justify-center">
                    <div className="bg-gray-100 rounded-lg p-3 inline-flex space-x-4">
                      <button className="text-gray-700 hover:text-purple-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </button>
                      <button className="text-gray-700 hover:text-purple-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button className="text-gray-700 hover:text-purple-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                      <button className="text-gray-700 hover:text-purple-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VRPage;