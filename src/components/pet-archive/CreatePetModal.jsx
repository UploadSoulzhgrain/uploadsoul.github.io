import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { checkSlugAvailability, generateSlugSuggestion } from '../../utils/petHelpers';

export default function CreatePetModal({ onClose, onSuccess, isOpen }) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState(null);
  const [slugSuggestion, setSlugSuggestion] = useState('');
  const [personality, setPersonality] = useState('');
  const [powerLevel, setPowerLevel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset form when opening
  useEffect(() => {
    if (isOpen) {
      setName('');
      setSlug('');
      setPersonality('');
      setPowerLevel('');
      setError('');
      setSlugAvailable(null);
    }
  }, [isOpen]);

  // Auto-generate slug from name
  useEffect(() => {
    if (name && !slug) {
      const autoSlug = name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      setSlug(autoSlug);
    }
  }, [name]); // Only when name changes and slug is empty

  // Check slug availability
  useEffect(() => {
    const checkSlug = async () => {
      if (!slug || slug.length < 2) {
        setSlugAvailable(null);
        return;
      }

      setSlugChecking(true);
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const available = await checkSlugAvailability(slug);
        setSlugAvailable(available);
        
        if (!available) {
          setSlugSuggestion(generateSlugSuggestion(slug));
        } else {
          setSlugSuggestion('');
        }
      } catch (error) {
        console.error('Slug check error:', error);
      } finally {
        setSlugChecking(false);
      }
    };

    const timeoutId = setTimeout(checkSlug, 500);
    return () => clearTimeout(timeoutId);
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !slug) {
      setError('Please fill in name and ID');
      return;
    }

    if (slugAvailable === false) {
      setError('This ID is already taken');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');

      const { error: insertError } = await supabase
        .from('pets')
        .insert({
          user_id: user.id,
          name,
          slug,
          personality: personality || null,
          power_level: powerLevel || null,
          is_public: false,
        });

      if (insertError) throw insertError;

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Create pet error:', error);
      setError(error.message || 'Creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="card-premium w-full max-w-md overflow-hidden relative"
        >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <h2 className="text-xl font-bold text-white font-serif">
                        Create Soul Archive
                    </h2>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {error && (
                    <div className="bg-red-900/20 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                {/* Name */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                        Pet Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Oreo"
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition-colors"
                        required
                    />
                </div>

                {/* Slug */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                        Soul ID (Unique URL)
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value.toLowerCase())}
                            placeholder="e.g. oreo-forever"
                            className={`w-full bg-black/20 border rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition-colors ${
                                slugAvailable === false 
                                    ? 'border-red-500/50 focus:border-red-500' 
                                    : slugAvailable === true 
                                        ? 'border-green-500/50 focus:border-green-500'
                                        : 'border-white/10 focus:border-amber-500'
                            }`}
                            required
                        />
                        {slugChecking && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                            </div>
                        )}
                    </div>
                    
                    {/* Slug Suggestions/Status */}
                    {slug && !slugChecking && (
                        <div className="min-h-[24px]">
                            {slugAvailable === false ? (
                                <div className="text-red-400 text-xs flex items-center gap-2">
                                    <span>Taken. Try:</span>
                                    {slugSuggestion && (
                                        <button
                                            type="button"
                                            onClick={() => setSlug(slugSuggestion)}
                                            className="underline hover:text-red-300 font-mono"
                                        >
                                            {slugSuggestion}
                                        </button>
                                    )}
                                </div>
                            ) : slugAvailable === true ? (
                                <div className="text-green-400 text-xs">
                                    ✓ Available
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>

                {/* Optional Fields */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                            Personality
                        </label>
                        <input
                            type="text"
                            value={personality}
                            onChange={(e) => setPersonality(e.target.value)}
                            placeholder="e.g. Cheerful"
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition-colors"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                            Level
                        </label>
                        <input
                            type="number"
                            value={powerLevel}
                            onChange={(e) => setPowerLevel(e.target.value)}
                            placeholder="1"
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting || slugAvailable === false}
                        className="w-full btn-premium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Sparkles className="w-5 h-5" />
                        )}
                        <span>Create Archive</span>
                    </button>
                </div>
            </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
