// src/core/api/apiClient.js
/**
 * API客户端
 * 处理所有API请求，包括错误处理和令牌管理
 */

class APIClient {
  constructor() {
    this.baseURL = 'http://localhost:3000/api';
    this.headers = {
      'Content-Type': 'application/json'
    };
  }

  /**
   * 设置认证令牌
   * @param {string} token - JWT令牌
   */
  setAuthToken(token) {
    if (token) {
      this.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.headers['Authorization'];
    }
  }

  /**
   * 设置刷新令牌
   * @param {string} token - 刷新令牌
   */
  setRefreshToken(token) {
    if (token) {
      localStorage.setItem('refreshToken', token);
    } else {
      localStorage.removeItem('refreshToken');
    }
  }

  /**
   * 发送GET请求
   * @param {string} url - 请求URL
   * @param {object} params - 查询参数
   * @returns {Promise<any>} - 响应数据
   */
  async get(url, params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const fullUrl = `${this.baseURL}${url}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * 发送POST请求
   * @param {string} url - 请求URL
   * @param {object} data - 请求数据
   * @returns {Promise<any>} - 响应数据
   */
  async post(url, data = {}) {
    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * 发送PUT请求
   * @param {string} url - 请求URL
   * @param {object} data - 请求数据
   * @returns {Promise<any>} - 响应数据
   */
  async put(url, data = {}) {
    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * 发送DELETE请求
   * @param {string} url - 请求URL
   * @returns {Promise<any>} - 响应数据
   */
  async delete(url) {
    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        method: 'DELETE',
        headers: this.headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
}

// 导出API客户端单例
export default new APIClient();