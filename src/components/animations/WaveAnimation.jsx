import React from 'react';

const WaveAnimation = ({ className = '', color = '#7C3AED', opacity = 0.1 }) => {
  return (
    <div className={`absolute w-full overflow-hidden ${className}`} style={{ zIndex: 0 }}>
      {/* Wave 1 - Bottom wave with slower animation */}
      <svg 
        className="absolute bottom-0 w-full h-auto" 
        viewBox="0 0 1440 320" 
        preserveAspectRatio="none"
        style={{ 
          animation: 'float 15s ease-in-out infinite alternate',
          height: '120px'
        }}
      >
        <path
          fill={color}
          fillOpacity={opacity}
          d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
      
      {/* Wave 2 - Middle wave with medium animation */}
      <svg 
        className="absolute bottom-0 w-full h-auto" 
        viewBox="0 0 1440 320" 
        preserveAspectRatio="none"
        style={{ 
          animation: 'float 10s ease-in-out infinite alternate-reverse',
          height: '100px'
        }}
      >
        <path
          fill={color}
          fillOpacity={opacity * 1.5}
          d="M0,160L48,176C96,192,192,224,288,218.7C384,213,480,171,576,165.3C672,160,768,192,864,186.7C960,181,1056,139,1152,149.3C1248,160,1344,224,1392,256L1440,288L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
      
      {/* Wave 3 - Top wave with fastest animation */}
      <svg 
        className="absolute bottom-0 w-full h-auto" 
        viewBox="0 0 1440 320" 
        preserveAspectRatio="none"
        style={{ 
          animation: 'float 7s ease-in-out infinite alternate',
          height: '80px'
        }}
      >
        <path
          fill={color}
          fillOpacity={opacity * 2}
          d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,218.7C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
};

export default WaveAnimation;