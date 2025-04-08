// src/core/api/authAPI.js
/**
 * 认证API服务
 * 处理用户认证相关的API请求，包括登录、注册、密码重置等
 */

import apiClient from './apiClient';
import { StorageService } from '../utils/storage';

class AuthAPI {
  /**
   * 用户注册
   * @param {string} email - 用户邮箱
   * @param {string} password - 用户密码
   * @param {string} name - 用户姓名
   * @returns {Promise<{user: object, token: string}>} - 用户数据和认证令牌
   */
  async register(email, password, name) {
    // 模拟成功响应
    const response = {
      user: {
        id: '1',
        email,
        name,
        createdAt: new Date().toISOString()
      },
      token: 'mock-token',
      refreshToken: 'mock-refresh-token'
    };
    
    // 存储认证信息
    StorageService.setAuthToken(response.token);
    StorageService.setRefreshToken(response.refreshToken);
    StorageService.setUser(response.user);
    
    return response;
  }

  /**
   * 手机号注册
   * @param {string} phone - 手机号
   * @param {string} verificationCode - 验证码
   * @param {string} password - 用户密码
   * @param {string} name - 用户姓名
   * @returns {Promise<{user: object, token: string}>} - 用户数据和认证令牌
   */
  async registerWithPhone(phone, verificationCode, password, name) {
    // 模拟成功响应
    const response = {
      user: {
        id: '2',
        phone,
        name,
        createdAt: new Date().toISOString()
      },
      token: 'mock-token-phone',
      refreshToken: 'mock-refresh-token-phone'
    };
    
    // 存储认证信息
    StorageService.setAuthToken(response.token);
    StorageService.setRefreshToken(response.refreshToken);
    StorageService.setUser(response.user);
    
    return response;
  }

  /**
   * 邮箱密码登录
   * @param {string} email - 用户邮箱
   * @param {string} password - 用户密码
   * @returns {Promise<{user: object, token: string}>} - 用户数据和认证令牌
   */
  async login(email, password) {
    // 模拟成功响应
    const response = {
      user: {
        id: '1',
        email,
        name: 'Test User',
        createdAt: new Date().toISOString()
      },
      token: 'mock-token',
      refreshToken: 'mock-refresh-token'
    };
    
    // 存储认证信息
    StorageService.setAuthToken(response.token);
    StorageService.setRefreshToken(response.refreshToken);
    StorageService.setUser(response.user);
    
    return response;
  }

  /**
   * 手机号验证码登录
   * @param {string} phone - 手机号
   * @param {string} verificationCode - 验证码
   * @returns {Promise<{user: object, token: string}>} - 用户数据和认证令牌
   */
  async loginWithPhone(phone, verificationCode) {
    // 模拟成功响应
    const response = {
      user: {
        id: '2',
        phone,
        name: 'Phone User',
        createdAt: new Date().toISOString()
      },
      token: 'mock-token-phone',
      refreshToken: 'mock-refresh-token-phone'
    };
    
    // 存储认证信息
    StorageService.setAuthToken(response.token);
    StorageService.setRefreshToken(response.refreshToken);
    StorageService.setUser(response.user);
    
    return response;
  }

  /**
   * 发送手机验证码
   * @param {string} phone - 手机号
   * @returns {Promise<{message: string}>} - 发送结果
   */
  async sendPhoneVerification(phone) {
    // 模拟成功响应
    return {
      message: '验证码已发送',
      code: '123456' // 仅用于测试
    };
  }

  /**
   * 用户登出
   * @returns {Promise<void>}
   */
  async logout() {
    // 清除认证信息
    StorageService.clearAuth();
    return Promise.resolve();
  }

  /**
   * 刷新访问令牌
   * @param {string} refreshToken - 刷新令牌
   * @returns {Promise<{token: string}>} - 新的访问令牌
   */
  async refreshToken(refreshToken) {
    // 模拟成功响应
    const response = {
      token: 'new-mock-token',
      refreshToken: 'new-mock-refresh-token'
    };
    
    // 更新认证信息
    StorageService.setAuthToken(response.token);
    StorageService.setRefreshToken(response.refreshToken);
    
    return response;
  }

  /**
   * 获取当前用户信息
   * @returns {Promise<object>} - 用户信息
   */
  async getCurrentUser() {
    // 从存储中获取用户信息
    const user = StorageService.getUser();
    if (!user) {
      throw new Error('用户未登录');
    }
    return user;
  }

  /**
   * 更新用户密码
   * @param {string} currentPassword - 当前密码
   * @param {string} newPassword - 新密码
   * @returns {Promise<void>}
   */
  async updatePassword(currentPassword, newPassword) {
    // 模拟成功响应
    return Promise.resolve();
  }

  /**
   * 请求密码重置
   * @param {string} email - 用户邮箱
   * @returns {Promise<void>}
   */
  async requestPasswordReset(email) {
    // 模拟成功响应
    return Promise.resolve();
  }

  /**
   * 重置密码
   * @param {string} token - 重置令牌
   * @param {string} password - 新密码
   * @returns {Promise<void>}
   */
  async resetPassword(token, password) {
    // 模拟成功响应
    return Promise.resolve();
  }
}

// 导出认证API服务单例
export default new AuthAPI();