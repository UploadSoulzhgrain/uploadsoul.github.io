// src/core/api/digitalHumanAPI.js
/**
 * 数字永生API服务
 * 处理数字人相关的API请求
 */

import apiClient from './apiClient';

class DigitalHumanAPI {
  /**
   * 获取用户的数字人列表
   * @returns {Promise<Array>} - 数字人列表
   */
  async getDigitalHumans() {
    return apiClient.get('/digital-humans');
  }

  /**
   * 获取单个数字人详情
   * @param {string} id - 数字人ID
   * @returns {Promise<object>} - 数字人详情
   */
  async getDigitalHumanById(id) {
    return apiClient.get(`/digital-humans/${id}`);
  }

  /**
   * 创建新数字人
   * @param {object} digitalHuman - 数字人数据
   * @returns {Promise<object>} - 创建的数字人
   */
  async createDigitalHuman(digitalHuman) {
    return apiClient.post('/digital-humans', digitalHuman);
  }

  /**
   * 更新数字人
   * @param {string} id - 数字人ID
   * @param {object} updates - 更新数据
   * @returns {Promise<object>} - 更新后的数字人
   */
  async updateDigitalHuman(id, updates) {
    return apiClient.put(`/digital-humans/${id}`, updates);
  }

  /**
   * 删除数字人
   * @param {string} id - 数字人ID
   * @returns {Promise<void>}
   */
  async deleteDigitalHuman(id) {
    return apiClient.delete(`/digital-humans/${id}`);
  }

  /**
   * 添加记忆
   * @param {string} digitalHumanId - 数字人ID
   * @param {object} memory - 记忆数据
   * @returns {Promise<object>} - 创建的记忆
   */
  async addMemory(digitalHumanId, memory) {
    return apiClient.post(`/digital-humans/${digitalHumanId}/memories`, memory);
  }

  /**
   * 上传媒体文件
   * @param {string} digitalHumanId - 数字人ID
   * @param {File} file - 媒体文件
   * @returns {Promise<object>} - 上传的媒体文件
   */
  async uploadMedia(digitalHumanId, file) {
    const formData = new FormData();
    formData.append('file', file);
    
    return apiClient.uploadFile(`/digital-humans/${digitalHumanId}/media`, formData);
  }

  /**
   * 从媒体训练数字人
   * @param {string} digitalHumanId - 数字人ID
   * @param {Array} mediaIds - 媒体ID列表
   * @returns {Promise<{progress: number}>} - 训练进度
   */
  async trainFromMedia(digitalHumanId, mediaIds) {
    return apiClient.post(`/digital-humans/${digitalHumanId}/train`, { mediaIds });
  }

  /**
   * 更新家族树
   * @param {string} digitalHumanId - 数字人ID
   * @param {object} familyTree - 家族树数据
   * @returns {Promise<object>} - 更新后的家族树
   */
  async updateFamilyTree(digitalHumanId, familyTree) {
    return apiClient.put(`/digital-humans/${digitalHumanId}/family-tree`, familyTree);
  }

  /**
   * 获取训练状态
   * @param {string} digitalHumanId - 数字人ID
   * @returns {Promise<{status: string, progress: number}>} - 训练状态
   */
  async getTrainingStatus(digitalHumanId) {
    return apiClient.get(`/digital-humans/${digitalHumanId}/training-status`);
  }

  /**
   * 与数字人对话
   * @param {string} digitalHumanId - 数字人ID
   * @param {string} message - 用户消息
   * @returns {Promise<{reply: string}>} - 数字人回复
   */
  async chatWithDigitalHuman(digitalHumanId, message) {
    return apiClient.post(`/digital-humans/${digitalHumanId}/chat`, { message });
  }

  /**
   * 获取数字人记忆列表
   * @param {string} digitalHumanId - 数字人ID
   * @param {object} params - 查询参数
   * @returns {Promise<Array>} - 记忆列表
   */
  async getMemories(digitalHumanId, params = { limit: 20, offset: 0 }) {
    return apiClient.get(`/digital-humans/${digitalHumanId}/memories`, params);
  }
}

// 导出数字永生API服务单例
const digitalHumanAPI = new DigitalHumanAPI();
export default digitalHumanAPI;