import React, { useState, useEffect } from 'react';
import Card from './Card';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import gameService from '../../services/gameService';

const MemoryGame = ({ digitalHuman, onFinish }) => {
  const { t } = useTranslation();
  const [cards, setCards] = useState([]);
  const [flippedIndexes, setFlippedIndexes] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [difficulty, setDifficulty] = useState('medium'); // easy, medium, hard
  const [timerInterval, setTimerInterval] = useState(null);

  // Card counts for different difficulty levels
  const difficultyConfig = {
    easy: 6, // 6 pairs (12 cards)
    medium: 8, // 8 pairs (16 cards)
    hard: 12 // 12 pairs (24 cards)
  };

  // Initialize game with cards
  useEffect(() => {
    if (gameStarted && !gameFinished) {
      const interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      setTimerInterval(interval);
      return () => clearInterval(interval);
    }
  }, [gameStarted, gameFinished]);
  
  // Clean up timer when component unmounts
  useEffect(() => {
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [timerInterval]);

  // Listen for game completion
  useEffect(() => {
    if (gameStarted && matchedPairs.length > 0 && matchedPairs.length === cards.length / 2) {
      if (timerInterval) clearInterval(timerInterval);
      setGameFinished(true);
      
      // Save game stats
      const gameStats = {
        digitalHumanId: digitalHuman?.id || 'demo',
        moves,
        timeElapsed,
        difficulty,
        timestamp: new Date().toISOString()
      };
      
      gameService.saveGameStats(gameStats);
      
      // Show success message
      toast.success(t('games.memory.successMessage', { moves, time: formatTime(timeElapsed) }));
      
      // Notify parent component
      if (onFinish) {
        onFinish(gameStats);
      }
    }
  }, [matchedPairs, cards, gameStarted, moves, timeElapsed, difficulty, digitalHuman, t, timerInterval, onFinish]);

  const startGame = () => {
    if (timerInterval) clearInterval(timerInterval);
    
    // Reset game state
    setFlippedIndexes([]);
    setMatchedPairs([]);
    setMoves(0);
    setTimeElapsed(0);
    setGameFinished(false);
    
    // Initialize cards based on difficulty
    const pairCount = difficultyConfig[difficulty];
    const memoryImages = gameService.getMemoryImages(pairCount, digitalHuman);
    
    // Create card pairs and shuffle them
    const newCards = [];
    memoryImages.forEach((image, index) => {
      newCards.push({ 
        id: `card-${index}-a`, 
        imageUrl: image.url,
        name: image.name || `Memory ${index + 1}`
      });
      newCards.push({ 
        id: `card-${index}-b`, 
        imageUrl: image.url,
        name: image.name || `Memory ${index + 1}`
      });
    });
    
    // Shuffle cards
    const shuffledCards = [...newCards].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setGameStarted(true);
  };

  const handleCardClick = (index) => {
    // Prevent clicking if already two cards are flipped or this card is already flipped
    if (flippedIndexes.length === 2 || flippedIndexes.includes(index) || matchedPairs.includes(cards[index].name)) {
      return;
    }
    
    // Flip the card
    setFlippedIndexes([...flippedIndexes, index]);
    
    // If this is the second card, check for a match
    if (flippedIndexes.length === 1) {
      setMoves(moves + 1);
      const firstIndex = flippedIndexes[0];
      
      // Check if the cards match
      if (cards[firstIndex].name === cards[index].name) {
        // It's a match!
        setMatchedPairs([...matchedPairs, cards[firstIndex].name]);
        setFlippedIndexes([]);
        
        // Play match sound
        new Audio('/assets/sounds/match.mp3').play().catch(() => {});
      } else {
        // No match, flip cards back after a delay
        setTimeout(() => {
          setFlippedIndexes([]);
        }, 1000);
        
        // Play no match sound
        new Audio('/assets/sounds/nomatch.mp3').play().catch(() => {});
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="memory-game p-4 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('games.memory.title')}</h2>
        <p className="text-gray-600">{t('games.memory.description')}</p>
      </div>
      
      {!gameStarted || gameFinished ? (
        <div className="game-setup text-center py-8">
          {gameFinished && (
            <div className="game-result mb-8 bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-xl font-semibold text-green-700 mb-2">{t('games.memory.gameComplete')}</h3>
              <div className="text-green-600">
                <p>{t('games.memory.moves')}: <strong>{moves}</strong></p>
                <p>{t('games.memory.time')}: <strong>{formatTime(timeElapsed)}</strong></p>
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">{t('games.memory.selectDifficulty')}</h3>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => setDifficulty('easy')}
                className={`px-4 py-2 rounded-lg transition ${
                  difficulty === 'easy' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {t('games.memory.easy')}
              </button>
              <button 
                onClick={() => setDifficulty('medium')}
                className={`px-4 py-2 rounded-lg transition ${
                  difficulty === 'medium' 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {t('games.memory.medium')}
              </button>
              <button 
                onClick={() => setDifficulty('hard')}
                className={`px-4 py-2 rounded-lg transition ${
                  difficulty === 'hard' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {t('games.memory.hard')}
              </button>
            </div>
          </div>
          
          <button
            onClick={startGame}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition shadow-md"
          >
            {gameFinished ? t('games.memory.playAgain') : t('games.memory.startGame')}
          </button>
        </div>
      ) : (
        <div className="game-board">
          <div className="game-stats flex justify-between items-center mb-4 bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{formatTime(timeElapsed)}</span>
            </div>
            <div>
              <span className="font-medium text-purple-700">{t('games.memory.difficulty')}: {t(`games.memory.${difficulty}`)}</span>
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="font-medium">{moves} {t('games.memory.moves')}</span>
            </div>
          </div>
          
          <div className={`grid gap-3 ${
            difficulty === 'easy' ? 'grid-cols-3 sm:grid-cols-4' : 
            difficulty === 'medium' ? 'grid-cols-3 sm:grid-cols-4' :
            'grid-cols-4 sm:grid-cols-6'
          }`}>
            {cards.map((card, index) => (
              <Card
                key={card.id}
                card={card}
                isFlipped={flippedIndexes.includes(index) || matchedPairs.includes(card.name)}
                isMatched={matchedPairs.includes(card.name)}
                onClick={() => handleCardClick(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;