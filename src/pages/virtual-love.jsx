import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaHeart, FaUser, FaMicrophone, FaBrain, FaMemory } from 'react-icons/fa';

const VirtualLove = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    appearance: '',
    voice: '',
    personality: '',
    memories: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
  };

  const handleMemoryAdd = () => {
    setFormData(prev => ({
      ...prev,
      memories: [...prev.memories, '']
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold mb-4"
        >
          {t('virtualLove.title')}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl mb-8"
        >
          {t('virtualLove.subtitle')}
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-300 max-w-2xl mx-auto"
        >
          {t('virtualLove.description')}
        </motion.p>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">{t('virtualLove.features.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-purple-800/30 p-6 rounded-lg"
          >
            <FaUser className="text-4xl mb-4 text-purple-400" />
            <h3 className="text-xl font-bold mb-2">{t('virtualLove.features.customization.title')}</h3>
            <p className="text-gray-300">{t('virtualLove.features.customization.description')}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-purple-800/30 p-6 rounded-lg"
          >
            <FaBrain className="text-4xl mb-4 text-purple-400" />
            <h3 className="text-xl font-bold mb-2">{t('virtualLove.features.aiTechnology.title')}</h3>
            <p className="text-gray-300">{t('virtualLove.features.aiTechnology.description')}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-purple-800/30 p-6 rounded-lg"
          >
            <FaMemory className="text-4xl mb-4 text-purple-400" />
            <h3 className="text-xl font-bold mb-2">{t('virtualLove.features.memorySharing.title')}</h3>
            <p className="text-gray-300">{t('virtualLove.features.memorySharing.description')}</p>
          </motion.div>
        </div>
      </section>

      {/* Companion Types Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">{t('virtualLove.companionTypes.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-purple-800/30 p-6 rounded-lg"
          >
            <FaHeart className="text-4xl mb-4 text-red-400" />
            <h3 className="text-xl font-bold mb-2">{t('virtualLove.companionTypes.soulmate.title')}</h3>
            <p className="text-gray-300">{t('virtualLove.companionTypes.soulmate.description')}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-purple-800/30 p-6 rounded-lg"
          >
            <FaUser className="text-4xl mb-4 text-blue-400" />
            <h3 className="text-xl font-bold mb-2">{t('virtualLove.companionTypes.temporary.title')}</h3>
            <p className="text-gray-300">{t('virtualLove.companionTypes.temporary.description')}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-purple-800/30 p-6 rounded-lg"
          >
            <FaHeart className="text-4xl mb-4 text-green-400" />
            <h3 className="text-xl font-bold mb-2">{t('virtualLove.companionTypes.friend.title')}</h3>
            <p className="text-gray-300">{t('virtualLove.companionTypes.friend.description')}</p>
          </motion.div>
        </div>
      </section>

      {/* Customization Form */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">{t('virtualLove.customization.title')}</h2>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-purple-800/30 p-8 rounded-lg">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">{t('virtualLove.form.name')}</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-purple-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder={t('virtualLove.form.namePlaceholder')}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">{t('virtualLove.form.type')}</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 bg-purple-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">{t('virtualLove.form.selectType')}</option>
              <option value="soulmate">{t('virtualLove.companionTypes.soulmate.title')}</option>
              <option value="temporary">{t('virtualLove.companionTypes.temporary.title')}</option>
              <option value="friend">{t('virtualLove.companionTypes.friend.title')}</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">{t('virtualLove.form.appearance')}</label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                className="px-4 py-2 bg-purple-900/50 rounded-lg hover:bg-purple-900/70 transition-colors"
              >
                {t('virtualLove.customization.appearance.options.upload')}
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-purple-900/50 rounded-lg hover:bg-purple-900/70 transition-colors"
              >
                {t('virtualLove.customization.appearance.options.generate')}
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-purple-900/50 rounded-lg hover:bg-purple-900/70 transition-colors"
              >
                {t('virtualLove.customization.appearance.options.template')}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">{t('virtualLove.form.voice')}</label>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                className="px-4 py-2 bg-purple-900/50 rounded-lg hover:bg-purple-900/70 transition-colors"
              >
                {t('virtualLove.customization.voice.options.upload')}
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-purple-900/50 rounded-lg hover:bg-purple-900/70 transition-colors"
              >
                {t('virtualLove.customization.voice.options.record')}
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-purple-900/50 rounded-lg hover:bg-purple-900/70 transition-colors"
              >
                {t('virtualLove.customization.voice.options.template')}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">{t('virtualLove.form.personality')}</label>
            <div className="space-y-2">
              {Object.entries(t('virtualLove.customization.personality.traits', { returnObjects: true })).map(([key, label]) => (
                <div key={key} className="flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="w-full"
                  />
                  <span className="ml-4">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">{t('virtualLove.form.memories')}</label>
            <div className="space-y-2">
              {formData.memories.map((memory, index) => (
                <input
                  key={index}
                  type="text"
                  value={memory}
                  onChange={(e) => {
                    const newMemories = [...formData.memories];
                    newMemories[index] = e.target.value;
                    setFormData({ ...formData, memories: newMemories });
                  }}
                  className="w-full px-4 py-2 bg-purple-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={t('virtualLove.customization.memories.placeholder')}
                />
              ))}
              <button
                type="button"
                onClick={handleMemoryAdd}
                className="w-full px-4 py-2 bg-purple-900/50 rounded-lg hover:bg-purple-900/70 transition-colors"
              >
                {t('virtualLove.customization.memories.add')}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
          >
            {t('virtualLove.form.submit')}
          </button>
        </form>
      </section>
    </div>
  );
};

export default VirtualLove; 