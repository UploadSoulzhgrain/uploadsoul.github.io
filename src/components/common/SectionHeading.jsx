import React from 'react';

const SectionHeading = ({ title, subtitle, className = '', align = 'center' }) => {
  const alignClass = align === 'left' 
    ? 'text-left' 
    : align === 'right' 
      ? 'text-right' 
      : 'text-center';
  
  return (
    <div className={`${alignClass} ${className}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-purple-700 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading; 