// src/core/api/authAPI.js
/**
 * 认证API服务
 * 处理用户认证相关的API请求，包括登录、注册、密码重置等
 */

import apiClient from './apiClient';

class AuthAPI {
  /**
   * 用户注册
   * @param {string} email - 用户邮箱
   * @param {string} password - 用户密码
   * @param {string} name - 用户姓名
   * @returns {Promise<{user: object, token: string}>} - 用户数据和认证令牌
   */
  async register(email, password, name) {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      name
    });
    
    if (response.token) {
      apiClient.setAuthToken(response.token);
      
      if (response.refreshToken) {
        apiClient.setRefreshToken(response.refreshToken);
      }
    }
    
    return response;
  }

  /**
   * 邮箱密码登录
   * @param {string} email - 用户邮箱
   * @param {string} password - 用户密码
   * @returns {Promise<{user: object, token: string}>} - 用户数据和认证令牌
   */
  async login(email, password) {
    const response = await apiClient.post('/auth/login', {
      email,
      password
    });
    
    if (response.token) {
      apiClient.setAuthToken(response.token);
      
      if (response.refreshToken) {
        apiClient.setRefreshToken(response.refreshToken);
      }
    }
    
    return response;
  }

  /**
   * 手机号验证码登录
   * @param {string} phone - 手机号
   * @param {string} verificationCode - 验证码
   * @returns {Promise<{user: object, token: string}>} - 用户数据和认证令牌
   */
  async loginWithPhone(phone, verificationCode) {
    const response = await apiClient.post('/auth/login/phone', {
      phone,
      verificationCode
    });
    
    if (response.token) {
      apiClient.setAuthToken(response.token);
      
      if (response.refreshToken) {
        apiClient.setRefreshToken(response.refreshToken);
      }
    }
    
    return response;
  }

  /**
   * 刷新认证令牌
   * @param {string} refreshToken - 刷新令牌
   * @returns {Promise<{token: string}>} - 新的认证令牌
   */
  async refreshToken(refreshToken) {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    
    if (response.token) {
      apiClient.setAuthToken(response.token);
    }
    
    return response;
  }

  /**
   * 登出
   * @returns {Promise<void>}
   */
  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // 无论请求是否成功，都清除本地令牌
      apiClient.setAuthToken(null);
      apiClient.setRefreshToken(null);
    }
  }

  /**
   * 发送密码重置邮件
   * @param {string} email - 用户邮箱
   * @returns {Promise<void>}
   */
  async resetPassword(email) {
    return apiClient.post('/auth/reset-password', { email });
  }

  /**
   * 更新密码
   * @param {string} oldPassword - 旧密码
   * @param {string} newPassword - 新密码
   * @returns {Promise<void>}
   */
  async updatePassword(oldPassword, newPassword) {
    return apiClient.post('/auth/update-password', {
      oldPassword,
      newPassword
    });
  }

  /**
   * 验证重置密码令牌
   * @param {string} token - 重置密码令牌
   * @param {string} newPassword - 新密码
   * @returns {Promise<void>}
   */
  async verifyResetToken(token, newPassword) {
    return apiClient.post('/auth/verify-reset', {
      token,
      newPassword
    });
  }

  /**
   * 发送手机验证码
   * @param {string} phone - 手机号
   * @returns {Promise<{message: string}>} - 发送结果
   */
  async sendPhoneVerification(phone) {
    return apiClient.post('/auth/send-verification', { phone });
  }

  /**
   * 获取当前用户信息
   * @returns {Promise<object>} - 用户数据
   */
  async getCurrentUser() {
    return apiClient.get('/auth/me');
  }
}

// 导出认证API服务单例
const authAPI = new AuthAPI();
export default authAPI;