import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Settings, Download, Upload as UploadIcon, Cat, Search } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import UploadModal from '../components/pet-archive/UploadModal';
import PetCard from '../components/pet-archive/PetCard';
import CreatePetModal from '../components/pet-archive/CreatePetModal';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function PetDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPets();
  }, [user]);

  const loadPets = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPets(data || []);
    } catch (error) {
      console.error('Error loading pets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      if (!user) return;

      const { data: petsData, error: petsError } = await supabase
        .from('pets')
        .select('*')
        .eq('user_id', user.id);

      if (petsError) throw petsError;

      const petIds = petsData.map(p => p.id);
      let memoriesData = [];
      
      if (petIds.length > 0) {
        const { data: memories, error: memoriesError } = await supabase
          .from('memories')
          .select('*')
          .in('pet_id', petIds);
          
        if (memoriesError) throw memoriesError;
        memoriesData = memories;
      }
      
      const exportData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        user_id: user.id,
        pets: petsData,
        memories: memoriesData
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pet-memory-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    }
  };

  const handleUpload = (pet) => {
    setSelectedPet(pet);
    setShowUploadModal(true);
  };

  return (
    <div className="min-h-screen pet-style-bg text-[#5D4037] pt-20 pb-12 font-sans">
      <Helmet>
        <title>我的档案馆 | UploadSoul</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-[#D7CCC8] pb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="pet-title-serif">萌宠档案馆</span>
            </h1>
            <p className="text-[#8D6E63]">
              管理您的 {pets.length} 个永恒灵魂档案
            </p>
          </div>
          
          <div className="flex gap-4 mt-6 md:mt-0">
             <button 
              onClick={handleExportData}
              className="pet-btn-secondary flex items-center gap-2 text-sm py-2 px-4"
              title="Backup Data"
            >
              <Download className="w-4 h-4" />
              <span>备份数据</span>
            </button>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="pet-btn-primary flex items-center gap-2 text-sm py-2 px-6"
            >
              <Plus className="w-4 h-4" />
              <span>新建档案</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-[#D7CCC8] rounded-full" />
              <div className="absolute inset-0 border-4 border-[#FF7043] border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        ) : pets.length === 0 ? (
          /* Empty State */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-96 pet-card-white border-dashed border-2 border-[#D7CCC8] bg-transparent shadow-none"
          >
            <div className="w-24 h-24 bg-[#FBE9E7] rounded-full flex items-center justify-center mb-6">
              <Cat className="w-12 h-12 text-[#FF7043]" />
            </div>
            <h3 className="text-2xl font-bold text-[#3E2723] mb-2 font-serif">还没有档案</h3>
            <p className="text-[#8D6E63] mb-8 max-w-md text-center">
              创建一个档案，开始为您心爱的宠物记录永恒的记忆。
            </p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="pet-btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>开始创建</span>
            </button>
          </motion.div>
        ) : (
          /* Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {pets.map((pet, index) => (
                <motion.div
                  key={pet.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PetCard 
                    pet={pet} 
                    onUpload={() => handleUpload(pet)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreatePetModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          loadPets();
          setShowCreateModal(false);
        }}
      />

      {selectedPet && (
        <UploadModal 
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          pet={selectedPet}
          onSuccess={() => {
            // Optional: refresh something if needed
          }}
        />
      )}
    </div>
  );
}
