import React from 'react';

const HeroBackground = ({ className = '', animated = true }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Digital neurons background */}
      <div className="absolute w-full h-full">
        {/* Grid pattern */}
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(124, 58, 237, 0.06) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
        
        {/* Digital circles that represent digital consciousness nodes */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-purple-600 opacity-${Math.random() > 0.5 ? '5' : '10'}`}
            style={{
              width: `${20 + Math.random() * 50}px`,
              height: `${20 + Math.random() * 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: 'translate(-50%, -50%)',
              filter: 'blur(10px)',
              animation: animated ? `float ${5 + Math.random() * 10}s ease-in-out infinite alternate` : 'none'
            }}
          ></div>
        ))}
        
        {/* Animated connecting lines to represent digital neural network */}
        {animated && (
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(124, 58, 237, 0)" />
                <stop offset="50%" stopColor="rgba(124, 58, 237, 0.3)" />
                <stop offset="100%" stopColor="rgba(124, 58, 237, 0)" />
              </linearGradient>
              <mask id="lineMask">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
              </mask>
            </defs>
            
            {/* Horizontal flowing lines */}
            {[...Array(6)].map((_, i) => (
              <rect
                key={`h-${i}`}
                className="animate-pulse"
                y={`${15 + i * 15}%`}
                width="100%"
                height="1"
                fill="url(#lineGradient)"
                style={{
                  animation: `flowHorizontal ${10 + i * 2}s linear infinite`,
                  animationDelay: `${i * 1.5}s`,
                  opacity: 0.5
                }}
              />
            ))}
            
            {/* Vertical flowing lines */}
            {[...Array(8)].map((_, i) => (
              <rect
                key={`v-${i}`}
                className="animate-pulse"
                x={`${10 + i * 12}%`}
                width="1"
                height="100%"
                fill="url(#lineGradient)"
                style={{
                  animation: `flowVertical ${8 + i * 2}s linear infinite`,
                  animationDelay: `${i * 1.2}s`,
                  opacity: 0.3
                }}
              />
            ))}
          </svg>
        )}
      </div>
      
      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50 via-transparent to-white opacity-70"></div>
    </div>
  );
};

export default HeroBackground;