import React from 'react';
import SayItApp from '../sayit/App';

const SpeakBarPage = () => {
  return (
    <div className="min-h-screen bg-cream font-display antialiased text-dark-brown">
      {/* 
        SayIt is a mobile-focused PWA. 
        We wrap it in a container that centers it on large screens.
      */}
      <div className="pt-20 pb-10 flex items-center justify-center">
        <SayItApp />
      </div>
    </div>
  );
};

export default SpeakBarPage;
