// src/core/api/apiClient.js
/**
 * API客户端
 * 处理所有与后端API的通信，包括请求拦截、响应处理、错误处理等
 */

class APIClient {
  constructor() {
    // Use window.location to determine environment instead of process.env
    this.baseURL = window.location.hostname === 'production.mgx-ai.com'
      ? 'https://api.mgx-ai.com/v1'
      : 'http://localhost:3000/api';
    this.authToken = null;
    this.refreshToken = null;
  }

  /**
   * 设置认证令牌
   * @param {string} token - JWT认证令牌
   */
  setAuthToken(token) {
    this.authToken = token;
  }

  /**
   * 设置刷新令牌
   * @param {string} token - 刷新令牌
   */
  setRefreshToken(token) {
    this.refreshToken = token;
  }

  /**
   * 通用请求方法
   * @param {string} method - HTTP方法
   * @param {string} endpoint - API端点
   * @param {object} data - 请求数据
   * @returns {Promise<any>} - 响应数据
   */
  async request(method, endpoint, data = null) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    const options = {
      method,
      headers,
      credentials: 'include',
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);

      // 处理401未授权错误，尝试刷新令牌
      if (response.status === 401 && this.refreshToken) {
        const refreshed = await this.refreshAuthToken();
        if (refreshed) {
          return this.request(method, endpoint, data);
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API请求失败: ${response.status}`);
      }

      // 检查响应是否包含JSON数据
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      }

      return response.text();
    } catch (error) {
      console.error('API请求错误:', error);
      throw error;
    }
  }

  /**
   * 刷新认证令牌
   * @returns {Promise<boolean>} - 刷新是否成功
   */
  async refreshAuthToken() {
    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('刷新令牌失败');
      }

      const data = await response.json();
      this.setAuthToken(data.token);
      return true;
    } catch (error) {
      console.error('刷新令牌错误:', error);
      return false;
    }
  }

  /**
   * GET请求
   * @param {string} endpoint - API端点
   * @param {object} params - URL参数
   * @returns {Promise<any>} - 响应数据
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request('GET', url);
  }

  /**
   * POST请求
   * @param {string} endpoint - API端点
   * @param {object} data - 请求数据
   * @returns {Promise<any>} - 响应数据
   */
  async post(endpoint, data) {
    return this.request('POST', endpoint, data);
  }

  /**
   * PUT请求
   * @param {string} endpoint - API端点
   * @param {object} data - 请求数据
   * @returns {Promise<any>} - 响应数据
   */
  async put(endpoint, data) {
    return this.request('PUT', endpoint, data);
  }

  /**
   * DELETE请求
   * @param {string} endpoint - API端点
   * @returns {Promise<any>} - 响应数据
   */
  async delete(endpoint) {
    return this.request('DELETE', endpoint);
  }

  /**
   * 上传文件请求
   * @param {string} endpoint - API端点
   * @param {FormData} formData - 表单数据
   * @returns {Promise<any>} - 响应数据
   */
  async uploadFile(endpoint, formData) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {};

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `文件上传失败: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('文件上传错误:', error);
      throw error;
    }
  }
}

// 导出API客户端单例
const apiClient = new APIClient();
export default apiClient;