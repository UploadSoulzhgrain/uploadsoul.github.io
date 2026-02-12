import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Cat, Heart, Upload, Eye, MousePointer2, Calendar, Sparkles, Share2, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import CreatePetModal from '../components/pet-archive/CreatePetModal';
import UploadModal from '../components/pet-archive/UploadModal';

const PetArchivePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('landing');
  const [viewingPet, setViewingPet] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPetForUpload, setSelectedPetForUpload] = useState(null);

  const fetchPets = async () => {
    if (!user) {
      setPets([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPets(data || []);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [user]);

  const handleViewPet = (pet) => {
    setViewingPet(pet);
    setActiveSection('magazine');
  };

  const navItems = [
    { id: 'landing', label: '首页' },
    { id: 'dashboard', label: '控制台' },
    { id: 'magazine', label: '画报页', disabled: !viewingPet && activeSection !== 'magazine' }
  ];

  return (
    <div className="min-h-screen bg-latte-100 dark:bg-twilight-200 transition-colors duration-300">
      {/* Internal Navigation */}
      <nav className="sticky top-0 z-40 border-b border-latte-200 dark:border-twilight-100 bg-white/80 dark:bg-twilight-200/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="font-serif font-black text-2xl tracking-tighter uppercase text-charcoal-300 dark:text-white">
            PET VOGUE
          </h1>
          <div className="flex gap-2 md:gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => !item.disabled && setActiveSection(item.id)}
                className={`px-3 md:px-4 py-2 text-sm font-mono rounded-lg transition-colors ${activeSection === item.id
                    ? 'bg-charcoal-300 dark:bg-ice-300 text-white dark:text-twilight-200'
                    : 'text-charcoal-300 dark:text-white hover:bg-latte-200 dark:hover:bg-twilight-100'
                  } ${item.disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main>
        <AnimatePresence mode="wait">
          {/* Landing Section */}
          {activeSection === 'landing' && (
            <motion.section
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-[calc(100vh-73px)] relative overflow-hidden flex flex-col items-center justify-center px-4 py-20"
            >
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-ice-200 dark:bg-ice-400 rounded-full opacity-20 blur-3xl animate-float"></div>
              <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-latte-300 dark:bg-twilight-50 rounded-full opacity-20 blur-3xl" style={{ animation: 'float 3s ease-in-out infinite', animationDelay: '1.5s' }}></div>

              <div className="relative z-10 text-center mb-16">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block mb-6"
                >
                  <Heart className="w-20 h-20 text-charcoal-300 dark:text-white mb-4 mx-auto" strokeWidth={1.5} />
                </motion.div>

                <h1 className="font-serif font-black text-6xl md:text-8xl tracking-tighter uppercase text-charcoal-300 dark:text-white mb-4">
                  PET VOGUE
                </h1>

                <p className="font-mono text-lg md:text-xl text-charcoal-200 dark:text-white/70 tracking-widest uppercase">
                  SPECIAL EDITION: FOREVER IN SOUL
                </p>

                <div className="w-24 h-0.5 bg-charcoal-300 dark:bg-white mx-auto mt-8"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl w-full">
                {[
                  { icon: <Calendar />, title: '永恒档案', desc: '上传照片、视频、声音，建立完整的宠物档案' },
                  { icon: <Sparkles />, title: '时尚画报', desc: '杂志级排版，让每一段记忆都成为艺术品' },
                  { icon: <Share2 />, title: '永久分享', desc: '生成专属二维码，随时随地缅怀与分享' }
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    className="editorial-card p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="w-8 h-8 mx-auto mb-4 text-charcoal-300 dark:text-white">
                      {React.cloneElement(feature.icon, { strokeWidth: 2 })}
                    </div>
                    <h3 className="font-serif font-bold text-xl mb-2 text-charcoal-300 dark:text-white">{feature.title}</h3>
                    <p className="text-sm text-charcoal-200 dark:text-white/70 leading-relaxed">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSection('dashboard')}
                className="px-12 py-4 rounded-full bg-charcoal-300 dark:bg-ice-300 text-white dark:text-twilight-200 font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                进入空间 <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.section>
          )}

          {/* Dashboard Section */}
          {activeSection === 'dashboard' && (
            <motion.section
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-4 py-12"
            >
              <div className="mb-12 flex justify-between items-end">
                <div>
                  <h2 className="font-serif font-black text-4xl tracking-tighter uppercase text-charcoal-300 dark:text-white mb-2">
                    MY PETS
                  </h2>
                  <p className="font-mono text-xs opacity-70 uppercase tracking-wider text-charcoal-200 dark:text-white/70">
                    YOUR BELOVED COMPANIONS
                  </p>
                </div>
                {user && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="hidden md:flex items-center gap-2 px-6 py-3 bg-charcoal-300 dark:bg-ice-300 text-white dark:text-twilight-200 rounded-full font-medium shadow-lg hover:shadow-xl transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    创建新档案
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="w-8 h-8 border-4 border-charcoal-300/10 dark:border-white/10 border-t-charcoal-300 dark:border-t-white rounded-full animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pets.map((pet) => (
                    <motion.div
                      key={pet.id}
                      layout
                      className="editorial-card group cursor-pointer"
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-latte-200 to-latte-300 dark:from-twilight-100 dark:to-twilight-50">
                        {pet.avatar_url ? (
                          <img src={pet.avatar_url} alt={pet.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Cat className="w-20 h-20 text-charcoal-200 dark:text-white/30" strokeWidth={1.5} />
                          </div>
                        )}
                        <div className="absolute top-4 right-4 glass-effect px-3 py-1 rounded-full">
                          <span className="text-xs font-mono text-white dark:text-white text-photo-overlay">{pet.breed || '可爱'}</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-serif font-black text-2xl tracking-tighter uppercase mb-2 text-charcoal-300 dark:text-white">{pet.name}</h3>
                        <p className="font-mono text-xs opacity-70 uppercase tracking-wider mb-4 text-charcoal-200 dark:text-white/70">@{pet.name.toLowerCase()}</p>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <p className="font-mono text-xs opacity-70 uppercase tracking-wider mb-1 text-charcoal-200 dark:text-white/70">出生日期</p>
                            <p className="text-sm font-medium text-charcoal-300 dark:text-white">{pet.birth_date || '未设置'}</p>
                          </div>
                          <div>
                            <p className="font-mono text-xs opacity-70 uppercase tracking-wider mb-1 text-charcoal-200 dark:text-white/70">状态</p>
                            <p className="text-sm font-medium text-charcoal-300 dark:text-white">{pet.status || '活跃'}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedPetForUpload(pet); }}
                            className="flex-1 px-4 py-2 rounded-full border-2 border-charcoal-300 dark:border-ice-300 text-charcoal-300 dark:text-ice-300 hover:bg-charcoal-300 dark:hover:bg-ice-300 hover:text-white dark:hover:text-twilight-200 transition-all text-sm font-medium flex items-center justify-center gap-1"
                          >
                            <Upload className="w-4 h-4" /> 上传
                          </button>
                          <button
                            onClick={() => handleViewPet(pet)}
                            className="flex-1 px-4 py-2 rounded-full bg-charcoal-300 dark:bg-ice-300 text-white dark:text-twilight-200 hover:shadow-lg transition-all text-sm font-medium flex items-center justify-center gap-1"
                          >
                            <Eye className="w-4 h-4" /> 查看
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Add Pet Card */}
                  <motion.div
                    onClick={() => setShowCreateModal(true)}
                    className="editorial-card border-2 border-dashed border-latte-300 dark:border-twilight-50 bg-white/50 dark:bg-twilight-100/50 flex items-center justify-center aspect-[3/4] cursor-pointer hover:border-ice-300 dark:hover:border-ice-300 transition-all group"
                  >
                    <div className="text-center p-8">
                      <Plus className="w-16 h-16 mx-auto mb-4 text-charcoal-200 dark:text-white/50 group-hover:text-ice-400 transition-colors" />
                      <p className="font-serif text-xl text-charcoal-300 dark:text-white">创建新档案</p>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.section>
          )}

          {/* Magazine Section */}
          {activeSection === 'magazine' && viewingPet && (
            <motion.section
              key="magazine"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen"
            >
              {/* Cover Hero */}
              <div className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-charcoal-300 to-charcoal-400 dark:from-twilight-200 dark:to-twilight-300"></div>
                {viewingPet.avatar_url && (
                  <img src={viewingPet.avatar_url} alt={viewingPet.name} className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay animate-breath" />
                )}
                <div className="gradient-overlay absolute inset-0"></div>

                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ctext x='50%25' y='50%25' font-size='60' text-anchor='middle' dy='.3em' fill='%23ffffff'%3E🐾%3C/text%3E%3C/svg%3E")`, backgroundSize: '150px 150px' }}></div>

                <div className="relative z-10 text-center px-4">
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-white text-photo-overlay mb-4">
                    SPECIAL EDITION: NO. {viewingPet.id.slice(0, 2).toUpperCase()}
                  </p>

                  <h1 className="font-serif font-black text-7xl md:text-9xl tracking-tighter uppercase text-white text-photo-overlay mb-6">
                    {viewingPet.name}
                  </h1>

                  <p className="font-serif text-2xl md:text-3xl text-white text-photo-overlay mb-8">
                    FOREVER IN SOUL
                  </p>

                  <div className="flex flex-wrap justify-center gap-4">
                    <div className="glass-effect px-4 py-2 rounded-full">
                      <span className="text-sm font-mono text-white text-photo-overlay">品种：{viewingPet.breed || '未知'}</span>
                    </div>
                    <div className="glass-effect px-4 py-2 rounded-full">
                      <span className="text-sm font-mono text-white text-photo-overlay">状态：{viewingPet.status || '活跃'}</span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                  <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Story Section */}
              <div className="max-w-6xl mx-auto px-4 py-20">
                <h2 className="font-serif font-black text-4xl md:text-5xl tracking-tighter uppercase text-center mb-16 text-charcoal-300 dark:text-white">
                  THE STORY
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                  <div className="editorial-card p-6">
                    <Calendar className="w-8 h-8 text-charcoal-300 dark:text-white mb-4" />
                    <h3 className="font-serif font-bold text-xl mb-2 text-charcoal-300 dark:text-white">出生日期</h3>
                    <p className="text-charcoal-200 dark:text-white/70">{viewingPet.birth_date || '未知'}</p>
                  </div>

                  <div className="editorial-card p-6">
                    <Heart className="w-8 h-8 text-charcoal-300 dark:text-white mb-4" />
                    <h3 className="font-serif font-bold text-xl mb-2 text-charcoal-300 dark:text-white">纪念日</h3>
                    <p className="text-charcoal-200 dark:text-white/70">{viewingPet.passing_date || '正在陪伴中'}</p>
                  </div>

                  <div className="editorial-card p-6">
                    <Sparkles className="w-8 h-8 text-charcoal-300 dark:text-white mb-4" />
                    <h3 className="font-serif font-bold text-xl mb-2 text-charcoal-300 dark:text-white">珍藏记忆</h3>
                    <p className="text-charcoal-200 dark:text-white/70">每一个瞬间都值得铭记</p>
                  </div>
                </div>

                <h2 className="font-serif font-black text-4xl md:text-5xl tracking-tighter uppercase text-center mb-12 text-charcoal-300 dark:text-white">
                  MEMORIES
                </h2>
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-latte-300 dark:border-twilight-100 rounded-3xl">
                  <Cat className="w-12 h-12 text-charcoal-200 dark:text-white/30 mb-4" />
                  <p className="text-charcoal-200 dark:text-white/70 font-mono text-sm uppercase tracking-wider">
                    更多回忆影像即将解锁
                  </p>
                </div>
              </div>

              {/* Magazine Footer */}
              <footer className="border-t border-latte-200 dark:border-twilight-100 py-20">
                <div className="max-w-6xl mx-auto px-4">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                      <p className="font-serif text-4xl text-charcoal-300 dark:text-white mb-2">{viewingPet.name}</p>
                      <p className="font-mono text-xs opacity-70 uppercase tracking-wider text-charcoal-200 dark:text-white/70">FOREVER REMEMBERED</p>
                    </div>

                    <div className="text-center">
                      <div className="inline-block p-4 bg-white dark:bg-twilight-100 rounded-2xl shadow-lg">
                        <div className="w-48 h-48 bg-charcoal-300 dark:bg-ice-300 rounded-lg flex items-center justify-center">
                          <p className="font-mono text-[10px] text-white dark:text-twilight-200 text-center px-4">
                            SOUL ARCHIVE KEY<br />{viewingPet.id}
                          </p>
                        </div>
                        <p className="font-mono text-xs opacity-70 uppercase tracking-wider mt-4 text-charcoal-200 dark:text-white/70">
                          TRACE THIS SOUL
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </footer>
            </motion.section>
          )}

          {/* Access Denied State */}
          {!user && activeSection !== 'landing' && (
            <motion.section
              key="denied"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-40 text-center px-4"
            >
              <div className="bg-latte-200 dark:bg-twilight-100 p-8 rounded-full mb-8">
                <MousePointer2 className="w-12 h-12 text-charcoal-300 dark:text-white" />
              </div>
              <h3 className="font-serif text-3xl font-black uppercase tracking-tighter text-charcoal-300 dark:text-white mb-4">
                请先登录
              </h3>
              <p className="text-charcoal-200 dark:text-white/70 max-w-md mb-8">
                登录后即可开启您的专属萌宠画报空间，记录和分享那些温暖的瞬间。
              </p>
              <button
                onClick={() => window.location.href = '/login'}
                className="px-8 py-3 bg-charcoal-300 dark:bg-ice-300 text-white dark:text-twilight-200 rounded-full font-bold shadow-lg"
              >
                前往登录
              </button>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      {showCreateModal && (
        <CreatePetModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchPets}
        />
      )}

      {selectedPetForUpload && (
        <UploadModal
          pet={selectedPetForUpload}
          onClose={() => setSelectedPetForUpload(null)}
          onSuccess={fetchPets}
        />
      )}
    </div>
  );
};

export default PetArchivePage;
