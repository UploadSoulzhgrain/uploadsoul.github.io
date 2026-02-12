import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Eye, Share2, Sparkles, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PetCard({ pet, index, onUpload }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.1 }}
      className="pet-card-white group relative overflow-hidden"
    >
      {/* Cover Image Area */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
        {pet.cover_image_url ? (
          <img
            src={pet.cover_image_url}
            alt={pet.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-[#F5F0E9] flex items-center justify-center">
            <Heart className="w-12 h-12 text-[#D7CCC8]" />
          </div>
        )}
        
        {/* Top Badges */}
        <div className="absolute top-3 right-3 flex gap-2">
            {pet.is_public && (
            <div className="px-2 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-sm">
                <span className="text-[10px] font-bold text-[#FF7043] flex items-center gap-1 uppercase">
                <Share2 className="w-3 h-3" />
                公开
                </span>
            </div>
            )}
        </div>
      </div>

      {/* Content Below Image */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="text-xl font-bold text-[#3E2723] font-serif leading-tight">
                    {pet.name}
                </h3>
                <p className="text-xs text-[#8D6E63] mt-1">@{pet.slug}</p>
            </div>
            {pet.personality && (
                <span className="text-[10px] text-[#D84315] bg-[#FBE9E7] px-2 py-1 rounded-full font-medium">
                    {pet.personality}
                </span>
            )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              onUpload(pet);
            }}
            className="py-2 px-3 text-xs font-medium rounded-full border border-[#FFAB91] text-[#D84315] hover:bg-[#FBE9E7] flex items-center justify-center gap-1 transition-colors"
          >
            <Upload className="w-3 h-3" />
            上传
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/pet-archive/p/${pet.slug}`)}
            className="py-2 px-3 text-xs font-medium rounded-full bg-gradient-to-r from-[#FF7043] to-[#FFAB91] text-white shadow-sm flex items-center justify-center gap-1 transition-colors"
          >
            <Eye className="w-3 h-3" />
            查看
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
