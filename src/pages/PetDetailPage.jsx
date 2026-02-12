import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Calendar, Sparkles, Share2, QrCode as QrCodeIcon, ArrowLeft } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../lib/supabaseClient';
import { Helmet } from 'react-helmet-async';

export default function PetDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [memories, setMemories] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    loadPetData();
  }, [slug]);

  const loadPetData = async () => {
    try {
      const { data: petData, error: petError } = await supabase
        .from('pets')
        .select('*')
        .eq('slug', slug)
        .single();

      if (petError) throw petError;
      setPet(petData);

      const { data: memoriesData } = await supabase
        .from('memories')
        .select('*')
        .eq('pet_id', petData.id)
        .order('date', { ascending: false });

      setMemories(memoriesData || []);

      const { data: milestonesData } = await supabase
        .from('milestones')
        .select('*')
        .eq('pet_id', petData.id)
        .order('date', { ascending: false });

      setMilestones(milestonesData || []);
    } catch (error) {
      console.error('Error loading pet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pet-style-bg">
        <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-[#D7CCC8] rounded-full" />
            <div className="absolute inset-0 border-4 border-[#FF7043] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 pet-style-bg text-[#5D4037]">
        <div className="text-center">
          <h1 className="text-4xl font-serif text-[#3E2723] mb-4">
            未找到该宠物
          </h1>
          <p className="text-[#8D6E63]">
            该页面可能不存在或尚未公开
          </p>
          <button onClick={() => navigate('/pet-archive')} className="mt-8 pet-btn-secondary">
            返回档案馆
          </button>
        </div>
      </div>
    );
  }

  const currentUrl = window.location.href;

  return (
    <div className="min-h-screen pet-style-bg font-sans selection:bg-[#FFAB91]/30">
      <Helmet>
        <title>{pet.name} | 永恒档案</title>
        <meta name="description" content={`查看 ${pet.name} 的数字灵魂档案`} />
      </Helmet>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center">
        <button 
            onClick={() => navigate('/pet-archive/dashboard')}
            className="flex items-center gap-2 text-[#5D4037] hover:text-[#3E2723] transition-colors bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-[#D7CCC8] shadow-sm"
        >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">返回</span>
        </button>
        <button 
            onClick={() => setShowQR(true)}
            className="p-2 rounded-full bg-white/80 backdrop-blur-md border border-[#D7CCC8] text-[#5D4037] hover:text-[#3E2723] shadow-sm transition-all"
        >
            <QrCodeIcon className="w-5 h-5" />
        </button>
      </nav>

      {/* Hero Header */}
      <div className="relative h-[60vh] w-full overflow-hidden bg-[#F5F0E9]">
        {pet.cover_image_url ? (
            <motion.img 
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5 }}
                src={pet.cover_image_url} 
                className="w-full h-full object-cover"
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#FBE9E7]">
                <Heart className="w-24 h-24 text-[#D7CCC8]" />
            </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#F9F3E5] via-[#F9F3E5]/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-center">
            <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                <div className="flex items-center justify-center gap-4 mb-4">
                    <span className="px-3 py-1 rounded-full border border-[#FFAB91] bg-[#FBE9E7] text-[#D84315] text-xs font-medium tracking-wider uppercase">
                        Digital Soul
                    </span>
                    {pet.personality && (
                        <span className="px-3 py-1 rounded-full border border-[#D7CCC8] bg-white text-[#5D4037] text-xs font-medium">
                            {pet.personality}
                        </span>
                    )}
                </div>
                
                <h1 className="text-5xl md:text-7xl font-serif text-[#3E2723] mb-6 leading-tight">
                    {pet.name}
                </h1>
                
                <div className="flex flex-wrap justify-center gap-8 text-[#8D6E63] text-sm">
                    {pet.birth_date && (
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#FF7043]" />
                            <span>Born {new Date(pet.birth_date).getFullYear()}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#FF7043]" />
                        <span>Level {pet.power_level || 1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-[#FF7043]" />
                        <span>{memories.length} Memories</span>
                    </div>
                </div>
            </motion.div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Memory Gallery */}
        <div className="mb-20">
            <h2 className="text-3xl font-serif text-[#3E2723] mb-8 flex items-center justify-center gap-3">
                <span className="w-8 h-[2px] bg-[#D7CCC8]" />
                Memory Gallery
                <span className="w-8 h-[2px] bg-[#D7CCC8]" />
            </h2>
            
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {memories.map((memory, i) => (
                    <motion.div
                        key={memory.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="pet-card-white overflow-hidden break-inside-avoid"
                    >
                        {memory.type === 'photo' && (
                            <img src={memory.media_url} className="w-full h-auto" loading="lazy" />
                        )}
                        {memory.caption && (
                            <div className="p-4 bg-white">
                                <p className="text-[#5D4037] italic font-serif">"{memory.caption}"</p>
                                <p className="text-xs text-[#8D6E63] mt-2 font-medium">
                                    {new Date(memory.date).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
            
            {memories.length === 0 && (
                <div className="text-center py-20 border border-dashed border-[#D7CCC8] rounded-2xl bg-white/50">
                    <p className="text-[#8D6E63]">No memories uploaded yet.</p>
                </div>
            )}
        </div>
      </div>

      {/* QR Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3E2723]/60 backdrop-blur-sm"
            onClick={() => setShowQR(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl border border-[#F5F0E9]"
            >
              <h3 className="text-2xl font-serif text-[#3E2723] mb-2">Soul Card</h3>
              <p className="text-[#8D6E63] text-sm mb-8">Scan to visit {pet.name}'s archive</p>
              
              <div className="bg-[#F9F3E5] p-4 rounded-xl inline-block mb-8">
                <QRCodeSVG value={currentUrl} size={200} fgColor="#3E2723" bgColor="#F9F3E5" />
              </div>

              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => setShowQR(false)}
                  className="pet-btn-secondary py-2 px-6"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
