import React from 'react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon, title, description, link, children }) => {
  return (
    <Link to={link} className="block h-full">
      <div className="p-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl transform hover:scale-105 transition duration-300 shadow-lg group animate-fadeInUp h-full flex flex-col">
        <div className="flex justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            {icon}
          </div>
        </div>
        <h3 className="text-xl font-bold text-center text-white mb-3">{title}</h3>
        <p className="text-white text-center opacity-90 flex-grow">
          {description}
        </p>
        {children}
        <div className="mt-4 flex justify-center">
          <span className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-medium">
            Start Experience
          </span>
        </div>
        <div className="w-full h-1 bg-white/30 rounded-full mt-4 overflow-hidden">
          <div className="h-full w-1/2 bg-white animate-shimmer"></div>
        </div>
      </div>
    </Link>
  );
};

export default FeatureCard; 