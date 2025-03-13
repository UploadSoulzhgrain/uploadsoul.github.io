import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import MemoryGame from '../components/games/MemoryGame';
import gameService from '../services/gameService';
import digitalHumanService from '../services/digitalHumanService';

const GamesPage = () => {
  const { t } = useTranslation();
  const { digitalHumanId } = useParams();
  const [selectedGame, setSelectedGame] = useState(null);
  const [digitalHuman, setDigitalHuman] = useState(null);
  const [gameStats, setGameStats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch digital human if ID is provided
  useEffect(() => {
    const fetchDigitalHuman = async () => {
      if (digitalHumanId) {
        setIsLoading(true);
        try {
          const human = await digitalHumanService.getById(digitalHumanId);
          setDigitalHuman(human);
          
          // Load game stats for this digital human
          const stats = await gameService.getGameStats(digitalHumanId);
          setGameStats(stats);
        } catch (error) {
          console.error('Error loading digital human or game stats:', error);
          toast.error(t('games.errorLoading'));
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchDigitalHuman();
  }, [digitalHumanId, t]);

  // Game options
  const games = [
    {
      id: 'memory',
      name: t('games.memory.title'),
      description: t('games.memory.shortDescription'),
      image: '/assets/digital-humans/memory1.jpg',
      difficulty: 'medium',
      timeEstimate: '5-10',
      component: MemoryGame
    }
  ];

  // Handle game selection
  const selectGame = (gameId) => {
    const game = games.find(g => g.id === gameId);
    setSelectedGame(game);
  };

  // Handle game completion
  const handleGameFinished = (stats) => {
    // Add new stats to the list
    setGameStats(prevStats => [stats, ...prevStats]);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {digitalHuman ? t('games.personalized', { name: digitalHuman.name }) : t('games.title')}
          </h1>
          <p className="text-gray-600">
            {digitalHuman 
              ? t('games.personalizedDescription', { name: digitalHuman.name }) 
              : t('games.description')}
          </p>
          
          {digitalHuman && (
            <div className="mt-3">
              <Link 
                to={`/digital-human`}
                className="text-purple-600 hover:text-purple-800 transition flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t('general.backTo', { name: t('navigation.digitalHuman') })}
              </Link>
            </div>
          )}
        </div>
        
        {/* Game content */}
        <div className={`${selectedGame ? 'grid grid-cols-1 lg:grid-cols-4 gap-6' : ''}`}>
          {/* Game selection */}
          <div className={selectedGame ? 'lg:col-span-1' : ''}>
            {selectedGame ? (
              <div>
                <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                  <h2 className="font-bold text-lg text-gray-800 mb-4">{t('games.available')}</h2>
                  <div className="space-y-3">
                    {games.map((game) => (
                      <div 
                        key={game.id} 
                        onClick={() => selectGame(game.id)}
                        className={`p-3 flex items-center rounded-lg cursor-pointer transition ${ 
                          selectedGame?.id === game.id 
                            ? 'bg-purple-50 border-l-4 border-purple-500' 
                            : 'hover:bg-gray-50' 
                        }`}
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 bg-gray-100 flex items-center justify-center">
                          <img 
                            src={game.image || '/assets/digital-humans/memory1.jpg'} 
                            alt={game.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/assets/digital-humans/memory1.jpg';
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{game.name}</h3>
                          <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                            <span>{t('games.difficulty')}: {t(`games.${game.difficulty}`)}</span>
                            <span>•</span>
                            <span>{t('games.timeEstimate', { time: game.timeEstimate })}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Game stats section */}
                {gameStats.length > 0 && (
                  <div className="bg-white rounded-xl shadow-md p-4">
                    <h2 className="font-bold text-lg text-gray-800 mb-4">{t('games.recentStats')}</h2>
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {gameStats.slice(0, 5).map((stat, index) => (
                        <div key={index} className="p-3 border border-gray-100 rounded-lg bg-gray-50">
                          <div className="text-sm text-gray-800">
                            <div className="flex justify-between">
                              <span className="font-medium">{t(`games.${stat.difficulty}`)}</span>
                              <span>{formatDate(stat.timestamp)}</span>
                            </div>
                            <div className="mt-1 flex items-center justify-between">
                              <span>{t('games.memory.moves')}: {stat.moves}</span>
                              <span>{t('games.memory.time')}: {Math.floor(stat.timeElapsed / 60)}:{(stat.timeElapsed % 60).toString().padStart(2, '0')}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game) => (
                  <div 
                    key={game.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition hover:-translate-y-1 hover:shadow-lg"
                    onClick={() => selectGame(game.id)}
                  >
                    <div className="h-40 bg-gray-100">
                      <img 
                        src={game.image || '/assets/digital-humans/memory1.jpg'} 
                        alt={game.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/assets/digital-humans/memory1.jpg';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-800">{game.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{game.description}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1 space-x-3">
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {t('games.difficulty')}: {t(`games.${game.difficulty}`)}
                        </span>
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {t('games.timeEstimate', { time: game.timeEstimate })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Game area */}
          {selectedGame && (
            <div className="lg:col-span-3">
              {React.createElement(selectedGame.component, {
                digitalHuman,
                onFinish: handleGameFinished
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamesPage;