import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = ({ title, description, buttonText, buttonLink }) => {
  return (
    <div className="bg-purple-100 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-4">
          {title}
        </h2>
        <p className="text-lg text-purple-700 max-w-2xl mx-auto mb-8">
          {description}
        </p>
        <Link 
          to={buttonLink} 
          className="px-8 py-3 bg-purple-600 text-white rounded-full font-medium hover:bg-purple-700 transition"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

export default CallToAction; 