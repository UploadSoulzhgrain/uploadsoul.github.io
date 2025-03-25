import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import digitalHumanService from '../../services/digitalHumanService';
import audioService from '../../services/audioService';

const CreateDigitalHuman = ({ onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    description: '',
    photo: null,
    photoFiles: [],
    voiceFiles: [],
    videoFiles: [],
    memories: []
  });

  // Preview state
  const [photoPreview, setPhotoPreview] = useState(null);
  const [memoryText, setMemoryText] = useState('');
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle file changes
  const handleFileChange = (e, fieldName) => {
    const files = Array.from(e.target.files);
    
    if (fieldName === 'photo' && files.length > 0) {
      setFormData({
        ...formData,
        photo: files[0]
      });
      setPhotoPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({
        ...formData,
        [fieldName]: [...(formData[fieldName] || []), ...files]
      });
    }
  };
  
  // Handle memory addition
  const handleAddMemory = () => {
    if (memoryText.trim()) {
      setFormData({
        ...formData,
        memories: [...formData.memories, memoryText]
      });
      setMemoryText('');
    }
  };
  
  // Handle memory removal
  const handleRemoveMemory = (index) => {
    const updatedMemories = formData.memories.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      memories: updatedMemories
    });
  };
  
  // Remove a file
  const handleRemoveFile = (type, index) => {
    const updatedFiles = formData[type].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [type]: updatedFiles
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Loading state
    const loadingToast = toast.loading(t('digitalHuman.creation.processing'));
    
    try {
      // Format basic data for API submission
      const digitalHumanData = {
        name: formData.name,
        relationship: formData.relationship,
        description: formData.description,
        // Additional metadata
        memories: formData.memories.length
      };
      
      // Create the digital human in the backend
      const digitalHuman = await digitalHumanService.create(digitalHumanData);
      
      if (digitalHuman && digitalHuman.id) {
        // Upload main photo if exists
        if (formData.photo) {
          const photosFormData = new FormData();
          photosFormData.append('main_photo', formData.photo, 'main_photo.jpg');
          await digitalHumanService.uploadFiles(digitalHuman.id, photosFormData);
        }
        
        // Upload additional photos if any
        if (formData.photoFiles.length) {
          const photosFormData = new FormData();
          formData.photoFiles.forEach((photo, index) => {
            photosFormData.append(`photo_${index}`, photo, `photo_${index}.jpg`);
          });
          await digitalHumanService.uploadFiles(digitalHuman.id, photosFormData);
        }
        
        // Upload videos if any
        if (formData.videoFiles.length) {
          const videoFormData = new FormData();
          formData.videoFiles.forEach((video, index) => {
            videoFormData.append(`video_${index}`, video, `video_${index}.mp4`);
          });
          await digitalHumanService.uploadFiles(digitalHuman.id, videoFormData);
        }
        
        // Create voice model if there are voice recordings
        if (formData.voiceFiles.length) {
          await audioService.createVoiceModel({
            name: `${formData.name}'s Voice`,
            digitalHumanId: digitalHuman.id,
            audioSamples: formData.voiceFiles
          });
          
          // Update digital human with voice model flag
          await digitalHumanService.update(digitalHuman.id, {
            voiceModel: true
          });
        }
        
        // Add memories if any
        if (formData.memories.length) {
          for (const memoryContent of formData.memories) {
            await digitalHumanService.addMemory(digitalHuman.id, {
              content: memoryContent,
              type: 'text'
            });
          }
        }
        
        // Update media files count
        let mediaFilesCount = 0;
        if (formData.photo) mediaFilesCount += 1;
        if (formData.photoFiles.length) mediaFilesCount += formData.photoFiles.length;
        if (formData.videoFiles.length) mediaFilesCount += formData.videoFiles.length;
        if (formData.voiceFiles.length) mediaFilesCount += formData.voiceFiles.length;
        
        await digitalHumanService.update(digitalHuman.id, {
          mediaFiles: mediaFilesCount,
          avatar: formData.photo ? true : false
        });
        
        toast.success(t('digitalHuman.creation.success'));
        toast.dismiss(loadingToast);
        
        // Pass the created digital human ID back to parent
        onSubmit(digitalHuman.id);
      } else {
        throw new Error('Failed to create digital human');
      }
    } catch (error) {
      console.error('Error creating digital human:', error);
      toast.error(t('digitalHuman.creation.error'));
      toast.dismiss(loadingToast);
    }
  };
  
  // Navigate between steps
  const nextStep = () => setStep(Math.min(step + 1, totalSteps));
  const prevStep = () => setStep(Math.max(step - 1, 1));
  
  // Render progress bar
  const renderProgress = () => {
    return (
      <div className="w-full mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-purple-700">
            {t(`digitalHuman.creation.step${step}Title`)}
          </span>
          <span className="text-sm font-medium text-gray-500">
            {step}/{totalSteps}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Step 1: Basic Info
  const renderBasicInfoForm = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          {t('digitalHuman.creation.nameLabel')}*
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={t('digitalHuman.creation.namePlaceholder')}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          {t('digitalHuman.creation.relationshipLabel')}*
        </label>
        <select
          name="relationship"
          value={formData.relationship}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        >
          <option value="">{t('digitalHuman.creation.selectRelationship')}</option>
          <option value="parent">{t('digitalHuman.creation.relationships.parent')}</option>
          <option value="child">{t('digitalHuman.creation.relationships.child')}</option>
          <option value="sibling">{t('digitalHuman.creation.relationships.sibling')}</option>
          <option value="grandparent">{t('digitalHuman.creation.relationships.grandparent')}</option>
          <option value="grandchild">{t('digitalHuman.creation.relationships.grandchild')}</option>
          <option value="friend">{t('digitalHuman.creation.relationships.friend')}</option>
          <option value="spouse">{t('digitalHuman.creation.relationships.spouse')}</option>
          <option value="other">{t('digitalHuman.creation.relationships.other')}</option>
        </select>
      </div>
      
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          {t('digitalHuman.creation.descriptionLabel', {defaultValue: 'Description'})}
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder={t('digitalHuman.creation.descriptionPlaceholder', {defaultValue: 'Describe this person...'})}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
        />
      </div>
    </div>
  );
  
  // Step 2: Photo Upload
  const renderPhotoUpload = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          {t('digitalHuman.creation.photoUploadLabel')}*
        </label>
        
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${photoPreview ? 'border-purple-300' : 'border-gray-300 hover:border-purple-500'}`}
          onClick={() => document.getElementById('mainPhotoUpload').click()}
        >
          {photoPreview ? (
            <div className="flex flex-col items-center">
              <img 
                src={photoPreview} 
                alt="Preview" 
                className="h-48 object-cover rounded-lg mb-3"
              />
              <span className="text-sm text-purple-600">{t('digitalHuman.creation.changePhoto', {defaultValue: 'Click to change photo'})}</span>
            </div>
          ) : (
            <>
              <div className="text-gray-500 mb-2">{t('digitalHuman.creation.photoUploadInstruction')}</div>
              <div className="text-xs text-gray-400">{t('digitalHuman.creation.photoUploadFormats')}</div>
            </>
          )}
          <input
            id="mainPhotoUpload"
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={(e) => handleFileChange(e, 'photo')}
            className="hidden"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          {t('digitalHuman.creation.additionalPhotosLabel')}
        </label>
        
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-all"
          onClick={() => document.getElementById('additionalPhotos').click()}
        >
          <div className="text-gray-500 mb-2">{t('digitalHuman.creation.photoUploadInstruction')}</div>
          <div className="text-xs text-gray-400">{t('digitalHuman.creation.photoUploadFormats')}</div>
          <input
            id="additionalPhotos"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/jpg"
            onChange={(e) => handleFileChange(e, 'photoFiles')}
            className="hidden"
          />
        </div>
        
        {formData.photoFiles.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">
              {formData.photoFiles.length} {t('digitalHuman.creation.files')}
            </p>
            <div className="flex flex-wrap gap-2">
              {formData.photoFiles.slice(0, 4).map((file, index) => (
                <div key={index} className="relative">
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt={`Preview ${index}`} 
                    className="h-16 w-16 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile('photoFiles', index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
              {formData.photoFiles.length > 4 && (
                <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                  <span className="text-sm text-gray-500">+{formData.photoFiles.length - 4}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  // Step 3: Voice Upload
  const renderVoiceUpload = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          {t('digitalHuman.creation.voiceUploadLabel')}
        </label>
        
        <div className="bg-purple-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-purple-700 mb-1">
            {t('digitalHuman.creation.voiceUploadInstruction')}
          </p>
          <p className="text-xs text-purple-600">
            {t('digitalHuman.creation.voiceUploadFormats')}
          </p>
          <div className="mt-2 border-t border-purple-100 pt-2">
            <p className="text-xs text-purple-800 font-medium">{t('digitalHuman.creation.voiceTipsTitle', {defaultValue: 'Tips for best results:'})}</p>
            <ul className="text-xs text-purple-700 list-disc ml-4 mt-1 space-y-1">
              <li>{t('digitalHuman.creation.voiceTip1', {defaultValue: 'Upload at least 3 audio samples of the person speaking'})}</li>
              <li>{t('digitalHuman.creation.voiceTip2', {defaultValue: 'Each clip should be 5-30 seconds in length'})}</li>
              <li>{t('digitalHuman.creation.voiceTip3', {defaultValue: 'Clear audio without background noise works best'})}</li>
              <li>{t('digitalHuman.creation.voiceTip4', {defaultValue: 'Samples should capture the person\'s natural speaking voice'})}</li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div 
            className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-purple-500 transition-all"
            onClick={() => document.getElementById('voiceFiles').click()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <div className="text-gray-500">{t('digitalHuman.creation.uploadVoiceSamples', {defaultValue: 'Upload Voice Samples'})}</div>
            <p className="text-xs text-gray-400 mt-1">Select MP3, WAV, or M4A files</p>
            <input
              id="voiceFiles"
              type="file"
              multiple
              accept="audio/mpeg,audio/wav,audio/mp4"
              onChange={(e) => handleFileChange(e, 'voiceFiles')}
              className="hidden"
            />
          </div>
          
          <div className="flex-1 border-2 border-gray-200 rounded-lg p-6 text-center relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-purple-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <div className="text-gray-700">{t('digitalHuman.creation.recordVoice')}</div>
            <p className="text-xs text-gray-500 mt-1">Coming soon</p>
            <div className="absolute top-2 right-2 bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded">Beta</div>
          </div>
        </div>
        
        {formData.voiceFiles.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">
              {formData.voiceFiles.length} {t('digitalHuman.creation.files')}
            </p>
            <div className="space-y-2">
              {formData.voiceFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile('voiceFiles', index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  // Step 4: Video Upload
  const renderVideoUpload = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          {t('digitalHuman.creation.videoUploadLabel')}
        </label>
        
        <div className="bg-purple-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-purple-700 mb-1">
            {t('digitalHuman.creation.videoUploadInstruction')}
          </p>
          <p className="text-xs text-purple-600">
            {t('digitalHuman.creation.videoUploadFormats')}
          </p>
        </div>
        
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-all"
          onClick={() => document.getElementById('videoFiles').click()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <div className="text-gray-500">{t('digitalHuman.creation.uploadVideos', {defaultValue: 'Click or drag to upload videos'})}</div>
          <input
            id="videoFiles"
            type="file"
            multiple
            accept="video/mp4,video/quicktime"
            onChange={(e) => handleFileChange(e, 'videoFiles')}
            className="hidden"
          />
        </div>
        
        {formData.videoFiles.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">
              {formData.videoFiles.length} {t('digitalHuman.creation.files')}
            </p>
            <div className="space-y-2">
              {formData.videoFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">{file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile('videoFiles', index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  // Step 5: Memories
  const renderMemories = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          {t('digitalHuman.creation.memoryLabel')}
        </label>
        
        <div className="bg-purple-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-purple-700">
            {t('digitalHuman.creation.memoryInstruction', {defaultValue: 'Add stories, memories, and characteristics that make this person special'})}
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex space-x-2">
            <textarea
              value={memoryText}
              onChange={(e) => setMemoryText(e.target.value)}
              placeholder={t('digitalHuman.creation.memoryPlaceholder')}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none h-20"
            />
            <button
              type="button"
              onClick={handleAddMemory}
              disabled={!memoryText.trim()}
              className="bg-purple-600 text-white rounded-lg px-4 py-2 hover:bg-purple-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {t('digitalHuman.creation.addButton', {defaultValue: 'Add'})}
            </button>
          </div>
          
          {formData.memories.length > 0 && (
            <div className="space-y-2 mt-4">
              <h4 className="font-medium text-gray-700">{t('digitalHuman.creation.addedMemories', {defaultValue: 'Added Memories:'})}</h4>
              {formData.memories.map((memory, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">{memory}</p>
                  <button
                    type="button"
                    onClick={() => handleRemoveMemory(index)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="text-xs text-gray-500 mt-4">
        {t('digitalHuman.creation.privacyNote')}
      </div>
    </div>
  );
  
  // Render the appropriate step
  const renderStep = () => {
    switch(step) {
      case 1:
        return renderBasicInfoForm();
      case 2:
        return renderPhotoUpload();
      case 3:
        return renderVoiceUpload();
      case 4:
        return renderVideoUpload();
      case 5:
        return renderMemories();
      default:
        return renderBasicInfoForm();
    }
  };
  
  // Check if current step is valid to proceed
  const isCurrentStepValid = () => {
    switch(step) {
      case 1:
        return formData.name && formData.relationship;
      case 2:
        return formData.photo !== null;
      case 3:
      case 4:
      case 5:
        return true;
      default:
        return false;
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">
              {t('digitalHuman.creation.title')}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <p className="text-gray-600 mb-6">
            {t('digitalHuman.creation.description')}
          </p>
          
          {renderProgress()}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {renderStep()}
            
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('digitalHuman.creation.previous')}
              </button>
              
              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isCurrentStepValid()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('digitalHuman.creation.next')}
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  {t('digitalHuman.creation.createButton')}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDigitalHuman;