import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const CreateDigitalHumanPage = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    photos: [],
    personality: '',
    memories: '',
    voice: null
  });

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      toast.error(t('digitalRebirth.form.uploadHint'));
      return;
    }
    setFormData(prev => ({
      ...prev,
      photos: files
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 实现表单提交逻辑
    toast.success(t('digitalRebirth.form.submit'));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('header.virtualLove')}</h1>
        <p className="text-gray-600 mb-8">{t('digitalRebirth.description')}</p>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= step ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  currentStep > step ? 'bg-purple-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('digitalRebirth.form.name')}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder={t('digitalRebirth.form.namePlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('digitalRebirth.form.photos')}
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2"
                      >
                        <span>{t('digitalRebirth.form.uploadButton')}</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoUpload}
                        />
                      </label>
                      <p className="pl-1">{t('digitalRebirth.form.orDragDrop')}</p>
                    </div>
                    <p className="text-xs text-gray-500">{t('digitalRebirth.form.uploadHint')}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {t('common.next')}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Personality */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('digitalRebirth.form.personality')}
                </label>
                <textarea
                  value={formData.personality}
                  onChange={(e) => setFormData(prev => ({ ...prev, personality: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={4}
                  placeholder={t('digitalRebirth.form.personalityPlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('digitalRebirth.form.memories')}
                </label>
                <textarea
                  value={formData.memories}
                  onChange={(e) => setFormData(prev => ({ ...prev, memories: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={4}
                  placeholder={t('digitalRebirth.form.memoriesPlaceholder')}
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {t('common.previous')}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {t('common.next')}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('digitalRebirth.steps.review')}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('digitalRebirth.form.name')}</label>
                    <p className="mt-1 text-gray-900">{formData.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('digitalRebirth.form.photos')}</label>
                    <p className="mt-1 text-gray-900">{formData.photos.length} {t('digitalRebirth.form.uploadButton')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('digitalRebirth.form.personality')}</label>
                    <p className="mt-1 text-gray-900">{formData.personality}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">{t('digitalRebirth.form.memories')}</label>
                    <p className="mt-1 text-gray-900">{formData.memories}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {t('common.previous')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  {t('digitalRebirth.form.submit')}
                </button>
              </div>
            </div>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default CreateDigitalHumanPage; 