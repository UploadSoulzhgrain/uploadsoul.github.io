import React from 'react';
import { WifiOff, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-latte-50 flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md"
      >
        <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 bg-charcoal-300/5 rounded-full animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
                <WifiOff className="w-16 h-16 text-charcoal-300" />
            </div>
        </div>

        <h1 className="font-serif text-3xl md:text-4xl text-charcoal-300 mb-4">
          Connection Lost
        </h1>
        
        <p className="font-sans text-charcoal-200 text-lg mb-8 leading-relaxed">
          It seems we've lost the signal to the cloud.
          <br />
          But don't worry, your memories are safe.
        </p>

        <div className="flex justify-center gap-2 text-sm text-charcoal-100 font-mono uppercase tracking-widest">
            <Heart className="w-4 h-4 fill-current text-red-400" />
            <span>Waiting for reconnection...</span>
        </div>

        <button 
            onClick={() => window.location.reload()}
            className="mt-12 px-8 py-3 bg-charcoal-300 text-latte-50 rounded-full hover:bg-charcoal-400 transition-colors font-medium"
        >
            Try Reconnecting
        </button>
      </motion.div>
    </div>
  );
}
