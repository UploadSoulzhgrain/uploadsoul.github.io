import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Upload, QrCode, Sparkles, ArrowRight, Star, Shield, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Helmet } from 'react-helmet-async';

export default function PetLandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStart = () => {
    if (user) {
      navigate('/pet-archive/dashboard');
    } else {
      navigate('/login', { state: { from: { pathname: '/pet-archive/dashboard' } } });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen pet-style-bg font-sans text-[#5D4037]">
      <Helmet>
        <title>萌宠档案馆 | UploadSoul</title>
        <meta name="description" content="PET STYLE - 您的爱宠数字档案馆" />
      </Helmet>

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-[80px]" />
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-amber-200/20 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
        
        {/* Hero Section */}
        <motion.div 
          className="text-center max-w-4xl mx-auto mb-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6 inline-block">
             <div className="flex items-center gap-2 justify-center mb-2">
                 <Camera className="w-6 h-6 text-[#5D4037]" />
                 <span className="text-[#8D6E63] font-medium tracking-widest uppercase text-sm">Pet Memory</span>
             </div>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-6xl md:text-8xl font-serif text-[#3E2723] mb-6 tracking-tight"
          >
            PET ARCHIVE
          </motion.h1>
          
          <motion.h2
            variants={itemVariants}
            className="text-2xl md:text-3xl text-[#5D4037] font-medium mb-8"
          >
             时尚造型 · 让爱宠更出众
          </motion.h2>

          <motion.p 
            variants={itemVariants}
            className="text-lg text-[#8D6E63] mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            这里是您爱宠的数字家园。记录每一个可爱瞬间，生成独一无二的数字档案。
            用心呵护，让爱宠更快乐。
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={handleStart}
              className="pet-btn-primary flex items-center gap-2 text-lg px-8 py-3"
            >
              <Heart className="w-5 h-5 fill-current" />
              <span>开始记录</span>
            </button>
            <button 
              onClick={() => navigate('/about')}
              className="pet-btn-secondary flex items-center gap-2 text-lg px-8 py-3"
            >
              <span>了解服务</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {[
            {
              icon: <Upload className="w-8 h-8 text-[#FF7043]" />,
              title: "云端相册",
              desc: "海量高清存储，一键上传备份，随时随地查看。"
            },
            {
              icon: <Sparkles className="w-8 h-8 text-[#FF7043]" />,
              title: "AI 焕活",
              desc: "智能生成动态回忆，让照片动起来，重现可爱瞬间。"
            },
            {
              icon: <Shield className="w-8 h-8 text-[#FF7043]" />,
              title: "隐私保护",
              desc: "银行级加密，只有您能查看，守护每一份珍贵记忆。"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="pet-card-white p-8 relative group overflow-hidden"
            >
              <div className="mb-6 p-4 bg-[#FBE9E7] rounded-full w-fit">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-[#3E2723] mb-3 font-serif tracking-wide">
                {feature.title}
              </h3>
              <p className="text-[#8D6E63] leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust/Stats Section (Styled like "Tags" in the image) */}
        <motion.div 
          className="mt-32 pt-12 border-t border-[#D7CCC8]/50 flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
            {["10,000+ 萌宠入住", "50TB+ 记忆存储", "5.0 评分", "专业守护"].map((tag, i) => (
                <span key={i} className="px-6 py-2 bg-white rounded-full text-[#5D4037] shadow-sm border border-[#EFEBE9] text-sm font-medium">
                    {tag}
                </span>
            ))}
        </motion.div>

      </div>
    </div>
  );
}
