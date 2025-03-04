// src/core/api/virtualPetAPI.js
/**
 * 虚拟宠物API服务
 * 处理虚拟宠物相关的API请求
 */

import apiClient from './apiClient';

class VirtualPetAPI {
  /**
   * 获取用户的宠物列表
   * @returns {Promise<Array>} - 宠物列表
   */
  async getPets() {
    return apiClient.get('/pets');
  }

  /**
   * 获取单个宠物详情
   * @param {string} id - 宠物ID
   * @returns {Promise<object>} - 宠物详情
   */
  async getPetById(id) {
    return apiClient.get(`/pets/${id}`);
  }

  /**
   * 创建新宠物
   * @param {object} pet - 宠物数据
   * @returns {Promise<object>} - 创建的宠物
   */
  async createPet(pet) {
    return apiClient.post('/pets', pet);
  }

  /**
   * 与宠物互动
   * @param {string} petId - 宠物ID
   * @param {string} action - 互动动作
   * @returns {Promise<{pet: object, reaction: string}>} - 宠物更新和反应
   */
  async interact(petId, action) {
    return apiClient.post(`/pets/${petId}/interact`, { action });
  }

  /**
   * 喂养宠物
   * @param {string} petId - 宠物ID
   * @param {string} foodId - 食物ID
   * @returns {Promise<{pet: object, reaction: string}>} - 宠物更新和反应
   */
  async feed(petId, foodId) {
    return apiClient.post(`/pets/${petId}/feed`, { foodId });
  }

  /**
   * 训练宠物
   * @param {string} petId - 宠物ID
   * @param {string} skillId - 技能ID
   * @returns {Promise<{pet: object, skillProgress: number}>} - 宠物更新和技能进度
   */
  async train(petId, skillId) {
    return apiClient.post(`/pets/${petId}/train`, { skillId });
  }

  /**
   * 自定义宠物外观
   * @param {string} petId - 宠物ID
   * @param {object} appearance - 外观数据
   * @returns {Promise<object>} - 更新后的宠物
   */
  async customize(petId, appearance) {
    return apiClient.put(`/pets/${petId}/appearance`, appearance);
  }

  /**
   * 上传宠物照片
   * @param {string} petId - 宠物ID
   * @param {File} imageFile - 图片文件
   * @returns {Promise<{imageUrl: string}>} - 上传后的图片URL
   */
  async uploadPetImage(petId, imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    return apiClient.uploadFile(`/pets/${petId}/image`, formData);
  }

  /**
   * 获取可用宠物物种
   * @returns {Promise<Array>} - 物种列表
   */
  async getPetSpecies() {
    return apiClient.get('/pets/species');
  }

  /**
   * 获取宠物可用食物
   * @returns {Promise<Array>} - 食物列表
   */
  async getPetFoods() {
    return apiClient.get('/pets/foods');
  }

  /**
   * 获取宠物可学习技能
   * @param {string} petId - 宠物ID
   * @returns {Promise<Array>} - 技能列表
   */
  async getPetSkills(petId) {
    return apiClient.get(`/pets/${petId}/available-skills`);
  }
}

// 导出虚拟宠物API服务单例
const virtualPetAPI = new VirtualPetAPI();
export default virtualPetAPI;