// src/core/api/aiInteractionAPI.js
/**
 * AI交互API服务
 * 处理AI角色相关的API请求，包括对话、记忆管理等
 */

import apiClient from './apiClient';

class AIInteractionAPI {
  /**
   * 发送文本消息
   * @param {string} characterId - AI角色ID
   * @param {string} message - 用户消息
   * @returns {Promise<{reply: string, emotions: Array}>} - AI回复和情感分析
   */
  async sendMessage(characterId, message) {
    return apiClient.post('/ai/message', {
      characterId,
      message
    });
  }

  /**
   * 开始语音对话
   * @param {string} characterId - AI角色ID
   * @returns {Promise<{sessionId: string}>} - 语音会话ID
   */
  async startVoiceChat(characterId) {
    return apiClient.post('/ai/voice/start', {
      characterId
    });
  }

  /**
   * 发送语音消息
   * @param {string} sessionId - 语音会话ID
   * @param {Blob} audioBlob - 音频数据
   * @returns {Promise<{reply: string, audioUrl: string}>} - AI回复和音频URL
   */
  async sendVoiceMessage(sessionId, audioBlob) {
    const formData = new FormData();
    formData.append('sessionId', sessionId);
    formData.append('audio', audioBlob);
    
    return apiClient.uploadFile('/ai/voice/message', formData);
  }

  /**
   * 结束语音对话
   * @param {string} sessionId - 语音会话ID
   * @returns {Promise<void>}
   */
  async endVoiceChat(sessionId) {
    return apiClient.post('/ai/voice/end', { sessionId });
  }

  /**
   * 获取AI角色记忆
   * @param {string} characterId - AI角色ID
   * @returns {Promise<object>} - 记忆数据
   */
  async getMemory(characterId) {
    return apiClient.get(`/ai/memory/${characterId}`);
  }

  /**
   * 更新AI角色记忆
   * @param {string} characterId - AI角色ID
   * @param {object} customAttributes - 自定义属性
   * @returns {Promise<object>} - 更新后的记忆数据
   */
  async updateMemory(characterId, customAttributes) {
    return apiClient.put(`/ai/memory/${characterId}`, {
      customAttributes
    });
  }

  /**
   * 清除对话历史
   * @param {string} characterId - AI角色ID
   * @returns {Promise<void>}
   */
  async clearConversation(characterId) {
    return apiClient.delete(`/ai/conversations/${characterId}`);
  }

  /**
   * 获取可用AI角色列表
   * @returns {Promise<Array>} - AI角色列表
   */
  async getCharacters() {
    return apiClient.get('/ai/characters');
  }

  /**
   * 获取单个AI角色详情
   * @param {string} id - AI角色ID
   * @returns {Promise<object>} - AI角色详情
   */
  async getCharacterById(id) {
    return apiClient.get(`/ai/characters/${id}`);
  }

  /**
   * 创建自定义AI角色
   * @param {object} character - AI角色数据
   * @returns {Promise<object>} - 创建的AI角色
   */
  async createCharacter(character) {
    return apiClient.post('/ai/characters', character);
  }

  /**
   * 更新AI角色
   * @param {string} id - AI角色ID
   * @param {object} updates - 更新数据
   * @returns {Promise<object>} - 更新后的AI角色
   */
  async updateCharacter(id, updates) {
    return apiClient.put(`/ai/characters/${id}`, updates);
  }

  /**
   * 删除AI角色
   * @param {string} id - AI角色ID
   * @returns {Promise<void>}
   */
  async deleteCharacter(id) {
    return apiClient.delete(`/ai/characters/${id}`);
  }

  /**
   * 上传AI角色头像
   * @param {string} characterId - AI角色ID
   * @param {File} imageFile - 图片文件
   * @returns {Promise<{avatarUrl: string}>} - 上传后的头像URL
   */
  async uploadCharacterAvatar(characterId, imageFile) {
    const formData = new FormData();
    formData.append('avatar', imageFile);
    
    return apiClient.uploadFile(`/ai/characters/${characterId}/avatar`, formData);
  }

  /**
   * 获取对话历史
   * @param {string} characterId - AI角色ID
   * @param {object} params - 查询参数
   * @returns {Promise<Array>} - 对话历史
   */
  async getConversationHistory(characterId, params = { limit: 50, offset: 0 }) {
    return apiClient.get(`/ai/conversations/${characterId}`, params);
  }
}

// 导出AI交互API服务单例
const aiInteractionAPI = new AIInteractionAPI();
export default aiInteractionAPI;