import React from 'react';

// Collection of illustrations for features
const FeatureIllustrations = ({ type, className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;

  const illustrations = {
    // Digital Immortality illustration
    digitalImmortality: (
      <svg viewBox="0 0 128 128" className={`${selectedSize} ${className}`} xmlns="http://www.w3.org/2000/svg">
        {/* Base container */}
        <rect x="16" y="16" width="96" height="96" rx="8" fill="#F3E8FF" />
        
        {/* Brain representation */}
        <path d="M64 32C48 32 36 44 36 60C36 76 48 88 64 88C80 88 92 76 92 60C92 44 80 32 64 32Z" 
          fill="#7C3AED" fillOpacity="0.8" />
        
        {/* Neural network connections */}
        <path d="M64 32C64 32 56 48 56 56C56 64 72 64 72 56C72 48 64 32 64 32Z" 
          fill="#A78BFA" />
        
        {/* Digital circuitry patterns */}
        <circle cx="48" cy="52" r="4" fill="#C4B5FD" />
        <circle cx="80" cy="52" r="4" fill="#C4B5FD" />
        <circle cx="64" cy="76" r="4" fill="#C4B5FD" />
        
        {/* Data upload symbol */}
        <path d="M64 96L56 108H60V116H68V108H72L64 96Z" 
          fill="#7C3AED" />
        
        {/* Infinity symbol for immortality */}
        <path d="M44 44C40 44 36 48 36 52C36 56 40 60 44 60C48 60 52 56 52 52" 
          stroke="#DDD6FE" strokeWidth="2" fill="none" />
        <path d="M52 52C52 48 56 44 60 44C64 44 68 48 68 52C68 56 64 60 60 60C56 60 52 56 52 52Z" 
          stroke="#DDD6FE" strokeWidth="2" fill="none" />
      </svg>
    ),
    
    // Emotional Companion illustration
    emotionalCompanion: (
      <svg viewBox="0 0 128 128" className={`${selectedSize} ${className}`} xmlns="http://www.w3.org/2000/svg">
        {/* Base shape */}
        <circle cx="64" cy="64" r="48" fill="#F3E8FF" />
        
        {/* Digital heart representing emotional connection */}
        <path d="M64 40L72 32C80 24 92 28 96 36C100 44 96 52 64 80C32 52 28 44 32 36C36 28 48 24 56 32L64 40Z" 
          fill="#7C3AED" />
        
        {/* Face representing companion */}
        <circle cx="48" cy="56" r="4" fill="#A78BFA" />
        <circle cx="80" cy="56" r="4" fill="#A78BFA" />
        <path d="M48 76C48 76 56 84 64 84C72 84 80 76 80 76" 
          stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" fill="none" />
        
        {/* Digital particles/sparkles */}
        <circle cx="36" cy="44" r="2" fill="#C4B5FD" />
        <circle cx="92" cy="44" r="2" fill="#C4B5FD" />
        <circle cx="40" cy="92" r="2" fill="#C4B5FD" />
        <circle cx="88" cy="92" r="2" fill="#C4B5FD" />
        <circle cx="64" cy="28" r="2" fill="#C4B5FD" />
        <circle cx="64" cy="100" r="2" fill="#C4B5FD" />
      </svg>
    ),
    
    // Virtual Partner illustration
    virtualPartner: (
      <svg viewBox="0 0 128 128" className={`${selectedSize} ${className}`} xmlns="http://www.w3.org/2000/svg">
        {/* Base shape */}
        <rect x="24" y="24" width="80" height="80" rx="16" fill="#F3E8FF" />
        
        {/* Two figures representing partnership */}
        <circle cx="48" cy="48" r="16" fill="#A78BFA" />
        <rect x="40" y="68" width="16" height="28" rx="8" fill="#A78BFA" />
        
        <circle cx="80" cy="48" r="16" fill="#7C3AED" />
        <rect x="72" y="68" width="16" height="28" rx="8" fill="#7C3AED" />
        
        {/* Digital connection between the partners */}
        <path d="M56 48H72" stroke="#C4B5FD" strokeWidth="4" strokeLinecap="round" />
        <path d="M56 56H72" stroke="#C4B5FD" strokeWidth="4" strokeLinecap="round" />
        <path d="M56 64H72" stroke="#C4B5FD" strokeWidth="4" strokeLinecap="round" />
        
        {/* Simple facial features */}
        <circle cx="44" cy="44" r="2" fill="#F3E8FF" />
        <circle cx="52" cy="44" r="2" fill="#F3E8FF" />
        <path d="M42 52C42 52 46 56 48 56C50 56 54 52 54 52" 
          stroke="#F3E8FF" strokeWidth="1" fill="none" />
          
        <circle cx="76" cy="44" r="2" fill="#F3E8FF" />
        <circle cx="84" cy="44" r="2" fill="#F3E8FF" />
        <path d="M74 52C74 52 78 56 80 56C82 56 86 52 86 52" 
          stroke="#F3E8FF" strokeWidth="1" fill="none" />
      </svg>
    ),
    
    // Virtual Reality illustration
    virtualReality: (
      <svg viewBox="0 0 128 128" className={`${selectedSize} ${className}`} xmlns="http://www.w3.org/2000/svg">
        {/* VR headset */}
        <rect x="24" y="40" width="80" height="48" rx="8" fill="#7C3AED" />
        <rect x="32" y="48" width="64" height="32" rx="4" fill="#A78BFA" />
        
        {/* Straps */}
        <path d="M24 64C24 64 16 56 16 64C16 72 24 64 24 64" fill="#7C3AED" />
        <path d="M104 64C104 64 112 56 112 64C112 72 104 64 104 64" fill="#7C3AED" />
        
        {/* Digital world projection */}
        <circle cx="64" cy="64" r="12" fill="#C4B5FD" fillOpacity="0.6" />
        <path d="M64 52L68 64L64 76L60 64L64 52Z" fill="#F3E8FF" />
        <path d="M52 64L64 68L76 64L64 60L52 64Z" fill="#F3E8FF" />
        
        {/* Particles/Stars in VR space */}
        <circle cx="48" cy="54" r="2" fill="#F3E8FF" />
        <circle cx="78" cy="58" r="1" fill="#F3E8FF" />
        <circle cx="54" cy="78" r="1" fill="#F3E8FF" />
        <circle cx="74" cy="70" r="2" fill="#F3E8FF" />
      </svg>
    ),
    
    // Digital World illustration
    digitalWorld: (
      <svg viewBox="0 0 128 128" className={`${selectedSize} ${className}`} xmlns="http://www.w3.org/2000/svg">
        {/* Digital globe */}
        <circle cx="64" cy="64" r="40" fill="#F3E8FF" />
        
        {/* Digital lattice/grid lines */}
        <path d="M24 64H104" stroke="#A78BFA" strokeWidth="1" strokeDasharray="2 2" />
        <path d="M64 24V104" stroke="#A78BFA" strokeWidth="1" strokeDasharray="2 2" />
        
        <circle cx="64" cy="64" r="32" stroke="#7C3AED" strokeWidth="1" fill="none" />
        <circle cx="64" cy="64" r="24" stroke="#7C3AED" strokeWidth="1" fill="none" />
        
        {/* Digital elements */}
        <rect x="60" y="48" width="8" height="8" fill="#C4B5FD" />
        <rect x="44" y="60" width="8" height="8" fill="#C4B5FD" />
        <rect x="76" y="60" width="8" height="8" fill="#C4B5FD" />
        <rect x="60" y="76" width="8" height="8" fill="#C4B5FD" />
        
        {/* Digital connection/network lines */}
        <path d="M64 52L48 64L64 76L80 64L64 52Z" stroke="#7C3AED" strokeWidth="1" fill="none" />
      </svg>
    ),
    
    // Default illustration if type doesn't match any of the above
    default: (
      <svg viewBox="0 0 128 128" className={`${selectedSize} ${className}`} xmlns="http://www.w3.org/2000/svg">
        <circle cx="64" cy="64" r="48" fill="#F3E8FF" />
        <path d="M64 32C48 32 36 44 36 60C36 76 48 88 64 88C80 88 92 76 92 60C92 44 80 32 64 32Z" 
          stroke="#7C3AED" strokeWidth="4" fill="none" />
        <circle cx="64" cy="64" r="12" fill="#7C3AED" />
      </svg>
    )
  };

  return illustrations[type] || illustrations.default;
};

export default FeatureIllustrations;