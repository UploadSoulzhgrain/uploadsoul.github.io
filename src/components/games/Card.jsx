import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ card, isFlipped, isMatched, onClick }) => {
  // Animation variants
  const cardVariants = {
    flipped: { 
      rotateY: 180,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    unflipped: { 
      rotateY: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    matched: {
      scale: [1, 1.1, 1],
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  // Handle click with debounce to prevent rapid clicking
  const handleClick = () => {
    if (!isFlipped && !isMatched) {
      onClick();
    }
  };

  return (
    <motion.div
      className={`memory-card relative cursor-pointer w-full pb-[100%] perspective-500 ${isMatched ? 'matched' : ''}`}
      onClick={handleClick}
      animate={isMatched ? "matched" : (isFlipped ? "flipped" : "unflipped")}
      variants={cardVariants}
    >
      <div
        className={`absolute inset-0 w-full h-full rounded-lg shadow-md transform-style-3d transition-all duration-300 ${
          isFlipped ? 'rotate-y-180' : ''
        } ${
          isMatched ? 'border-2 border-green-500 shadow-green-100' : ''
        }`}
      >
        {/* Card Back */}
        <div 
          className={`absolute inset-0 w-full h-full rounded-lg backface-hidden ${
            isFlipped ? 'invisible' : ''
          }`}
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-600 to-indigo-500 rounded-lg flex items-center justify-center">
            <div className="text-4xl text-white opacity-80">?</div>
          </div>
        </div>
        
        {/* Card Front */}
        <div 
          className={`absolute inset-0 w-full h-full rounded-lg backface-hidden rotate-y-180 overflow-hidden ${
            !isFlipped ? 'invisible' : ''
          }`}
        >
          <img 
            src={card.imageUrl} 
            alt={card.name}
            className="w-full h-full object-cover rounded-lg"
            onDragStart={e => e.preventDefault()}
          />
          {isMatched && (
            <div className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center">
              <div className="bg-white bg-opacity-90 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Card;