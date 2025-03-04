import React from 'react';

const Logo = ({ variant = 'default', size = 'md', className = '' }) => {
  // Define size classes
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  // Define colors based on variant
  const colors = {
    default: {
      primary: '#7C3AED', // purple-600
      secondary: '#A78BFA', // purple-400
      accent: '#C4B5FD', // purple-300
      text: '#7C3AED', // purple-600
    },
    white: {
      primary: '#FFFFFF',
      secondary: '#E5E7EB', // slightly darker to be visible on dark bg
      accent: '#D1D5DB',   // slightly darker to be visible on dark bg
      text: '#FFFFFF',
    },
  };

  const selectedColors = colors[variant] || colors.default;
  const selectedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`${selectedSize} relative`}>
        {/* Logo SVG - Digital soul/upload concept */}
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Base circular shape */}
          <circle cx="32" cy="32" r="28" fill={selectedColors.primary} opacity="0.2" />
          
          {/* Brain-like pattern representing digital consciousness */}
          <path 
            d="M32 12C23.2 12 16 19.2 16 28C16 36.8 23.2 44 32 44C40.8 44 48 36.8 48 28C48 19.2 40.8 12 32 12Z" 
            fill={selectedColors.primary} 
          />
          
          {/* Soul/consciousness rising effect */}
          <path 
            d="M32 8C32 8 28 16 28 22C28 28 36 28 36 22C36 16 32 8 32 8Z" 
            fill={selectedColors.secondary} 
          />
          
          {/* Digital upload symbol */}
          <path 
            d="M32 28L24 38H28V46H36V38H40L32 28Z" 
            fill={selectedColors.accent} 
          />
          
          {/* Connection nodes representing digital network */}
          <circle cx="22" cy="24" r="3" fill={selectedColors.accent} />
          <circle cx="42" cy="24" r="3" fill={selectedColors.accent} />
          <circle cx="32" cy="40" r="2" fill={selectedColors.accent} />
        </svg>
      </div>
      
      {/* Text part of the logo */}
      <div className="ml-2 flex flex-col">
        <span className={`font-bold text-${size === 'sm' ? 'md' : (size === 'lg' || size === 'xl') ? '2xl' : 'lg'}`} style={{ color: selectedColors.text }}>
          UploadSoul
        </span>
        {(size === 'lg' || size === 'xl') && (
          <span className={`text-${size === 'xl' ? 'md' : 'sm'} font-light`} style={{ color: selectedColors.text }}>
            传灵
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;