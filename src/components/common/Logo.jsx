import React from 'react';

const Logo = ({ variant = 'default', size = 'md', className = '' }) => {
  // Define size classes
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  // Define colors based on variant - Updated with Vibrant Amber for contrast
  const colors = {
    default: {
      primary: '#F59E0B',    // Amber 500
      secondary: '#FB923C',  // Orange 400
      accent: '#FCD34D',     // Amber 300
      text: '#FFFFFF',
    },
    white: {
      primary: '#FFFFFF',
      secondary: '#F3F4F6',
      accent: '#E5E7EB',
      text: '#FFFFFF',
    },
    dark: {
      primary: '#0F172A',
      secondary: '#334155',
      accent: '#475569',
      text: '#0F172A',
    }
  };

  const selectedColors = colors[variant] || colors.default;
  const selectedSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`${selectedSize} relative group`}>
        {/* Premium Logo Design - Abstract and Vibrant */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_8px_rgba(245,158,11,0.3)] transition-transform duration-500 group-hover:scale-110">
          <defs>
            <linearGradient id="logoPremiumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={selectedColors.primary} />
              <stop offset="100%" stopColor={selectedColors.secondary} />
            </linearGradient>
            <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Main geometric form - stylized hexagon shell */}
          <path
            d="M50 15L85 35V65L50 85L15 65V35L50 15Z"
            stroke="url(#logoPremiumGradient)"
            strokeWidth="2"
            strokeLinejoin="round"
            className="opacity-40"
          />

          {/* Central soul symbol - core connection mark */}
          <circle
            cx="50" cy="50" r="18"
            stroke={selectedColors.primary}
            strokeWidth="3.5"
            strokeDasharray="4 4"
            className="animate-pulse"
            filter="url(#logoGlow)"
          />

          <path
            d="M50 20V40M50 60V80M20 50H40M60 50H80"
            stroke={selectedColors.accent}
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Inner crystal core - rotating element */}
          <rect
            x="44" y="44" width="12" height="12" rx="3"
            fill="url(#logoPremiumGradient)"
            className="animate-spin-slow shadow-lg"
          />
        </svg>
      </div>

      {/* Text part of the logo - Premium Typography with Amber Accent */}
      <div className="ml-3 flex flex-col justify-center leading-tight">
        <span className={`font-bold tracking-tight text-${size === 'sm' ? 'lg' : (size === 'lg' || size === 'xl') ? '3xl' : 'xl'}`} style={{ color: selectedColors.text }}>
          UploadSoul
        </span>
        {(size === 'lg' || size === 'xl') && (
          <span className={`text-${size === 'xl' ? 'lg' : 'sm'} font-light tracking-[0.3em] uppercase opacity-70 text-amber-500`}>
            传灵
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;