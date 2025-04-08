// src/core/utils/storage.js
/**
 * 存储服务
 * 提供本地存储和安全存储功能
 */

// 存储键前缀，避免与其他应用冲突
const STORAGE_PREFIX = 'mgx_';

/**
 * 本地存储服务
 * 处理本地存储和会话存储的操作
 */
class StorageService {
  constructor(prefix = STORAGE_PREFIX) {
    this.prefix = prefix;
  }

  /**
   * 获取带前缀的键名
   * @param {string} key - 原始键名
   * @returns {string} 带前缀的键名
   */
  getKeyWithPrefix(key) {
    return `${this.prefix}${key}`;
  }

  /**
   * 设置存储项
   * @param {string} key - 键名
   * @param {any} value - 值
   * @param {boolean} [isSession=false] - 是否使用会话存储
   */
  static setItem(key, value, isSession = false) {
    try {
      const storage = isSession ? sessionStorage : localStorage;
      const serializedValue = JSON.stringify(value);
      storage.setItem(key, serializedValue);
    } catch (error) {
      console.error('StorageService.setItem error:', error);
    }
  }

  /**
   * 获取存储项
   * @param {string} key - 键名
   * @param {boolean} [isSession=false] - 是否使用会话存储
   * @returns {any} - 存储的值
   */
  static getItem(key, isSession = false) {
    try {
      const storage = isSession ? sessionStorage : localStorage;
      const value = storage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('StorageService.getItem error:', error);
      return null;
    }
  }

  /**
   * 移除存储项
   * @param {string} key - 键名
   * @param {boolean} [isSession=false] - 是否使用会话存储
   */
  static removeItem(key, isSession = false) {
    try {
      const storage = isSession ? sessionStorage : localStorage;
      storage.removeItem(key);
    } catch (error) {
      console.error('StorageService.removeItem error:', error);
    }
  }

  /**
   * 清除所有存储
   * @param {boolean} [isSession=false] - 是否清除会话存储
   */
  static clear(isSession = false) {
    try {
      const storage = isSession ? sessionStorage : localStorage;
      storage.clear();
    } catch (error) {
      console.error('StorageService.clear error:', error);
    }
  }

  /**
   * 设置认证令牌
   * @param {string} token - JWT令牌
   * @param {boolean} [isSession=false] - 是否使用会话存储
   */
  static setAuthToken(token, isSession = false) {
    this.setItem('authToken', token, isSession);
  }

  /**
   * 获取认证令牌
   * @param {boolean} [isSession=false] - 是否从会话存储获取
   * @returns {string|null} - JWT令牌
   */
  static getAuthToken(isSession = false) {
    return this.getItem('authToken', isSession);
  }

  /**
   * 设置刷新令牌
   * @param {string} token - 刷新令牌
   */
  static setRefreshToken(token) {
    this.setItem('refreshToken', token);
  }

  /**
   * 获取刷新令牌
   * @returns {string|null} - 刷新令牌
   */
  static getRefreshToken() {
    return this.getItem('refreshToken');
  }

  /**
   * 设置用户信息
   * @param {object} user - 用户信息
   * @param {boolean} [isSession=false] - 是否使用会话存储
   */
  static setUser(user, isSession = false) {
    this.setItem('user', user, isSession);
  }

  /**
   * 获取用户信息
   * @param {boolean} [isSession=false] - 是否从会话存储获取
   * @returns {object|null} - 用户信息
   */
  static getUser(isSession = false) {
    return this.getItem('user', isSession);
  }

  /**
   * 清除所有认证相关数据
   */
  static clearAuth() {
    this.removeItem('authToken');
    this.removeItem('refreshToken');
    this.removeItem('user');
  }
}

/**
 * 会话存储服务
 */
export class SessionStorageService extends StorageService {
  /**
   * 设置存储项到会话存储
   * @param {string} key - 键名
   * @param {any} value - 值
   */
  setItem(key, value) {
    try {
      const prefixedKey = this.getKeyWithPrefix(key);
      const serializedValue = JSON.stringify(value);
      sessionStorage.setItem(prefixedKey, serializedValue);
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }
  }

  /**
   * 从会话存储获取存储项
   * @param {string} key - 键名
   * @param {any} defaultValue - 默认值
   * @returns {any} 存储的值或默认值
   */
  getItem(key, defaultValue = null) {
    try {
      const prefixedKey = this.getKeyWithPrefix(key);
      const serializedValue = sessionStorage.getItem(prefixedKey);
      
      if (serializedValue === null) {
        return defaultValue;
      }
      
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return defaultValue;
    }
  }

  /**
   * 从会话存储移除存储项
   * @param {string} key - 键名
   */
  removeItem(key) {
    try {
      const prefixedKey = this.getKeyWithPrefix(key);
      sessionStorage.removeItem(prefixedKey);
    } catch (error) {
      console.error('Error removing from sessionStorage:', error);
    }
  }

  /**
   * 清除所有带前缀的会话存储项
   */
  clear() {
    try {
      // 仅清除带有当前前缀的项
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith(this.prefix)) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  }
}

/**
 * 安全存储服务
 * 提供简单的加密存储功能
 */
export class SecureStorageService extends StorageService {
  /**
   * @param {string} encryptionKey - 加密密钥
   * @param {StorageService} storage - 底层存储服务
   */
  constructor(encryptionKey, storage = new StorageService()) {
    super(storage.prefix);
    this.encryptionKey = encryptionKey;
    this.storage = storage;
  }

  /**
   * 简单加密
   * @param {string} text - 要加密的文本
   * @returns {string} 加密后的文本
   */
  encrypt(text) {
    // 简单的XOR加密，生产环境应使用更安全的加密方法
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
      result += String.fromCharCode(charCode);
    }
    // 使用Base64编码结果
    return btoa(result);
  }

  /**
   * 简单解密
   * @param {string} encryptedText - 加密的文本
   * @returns {string} 解密后的文本
   */
  decrypt(encryptedText) {
    try {
      // Base64解码
      const text = atob(encryptedText);
      // XOR解密
      let result = '';
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
        result += String.fromCharCode(charCode);
      }
      return result;
    } catch (error) {
      console.error('解密失败:', error);
      return '';
    }
  }

  /**
   * 安全设置存储项
   * @param {string} key - 键名
   * @param {any} value - 值
   */
  setItem(key, value) {
    const serializedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    const encryptedValue = this.encrypt(serializedValue);
    this.storage.setItem(key, encryptedValue);
  }

  /**
   * 安全获取存储项
   * @param {string} key - 键名
   * @param {any} defaultValue - 默认值
   * @returns {any} 存储的值或默认值
   */
  getItem(key, defaultValue = null) {
    const encryptedValue = this.storage.getItem(key);
    
    if (encryptedValue === null) {
      return defaultValue;
    }
    
    const decryptedValue = this.decrypt(encryptedValue);
    
    if (!decryptedValue) {
      return defaultValue;
    }
    
    // 尝试解析JSON
    try {
      return JSON.parse(decryptedValue);
    } catch {
      return decryptedValue;
    }
  }

  /**
   * 移除安全存储项
   * @param {string} key - 键名
   */
  removeItem(key) {
    this.storage.removeItem(key);
  }

  /**
   * 清除所有安全存储项
   */
  clear() {
    this.storage.clear();
  }
}

// 导出存储服务单例
export const localStorageService = new StorageService();
export const sessionStorageService = new SessionStorageService();
export const secureStorageService = new SecureStorageService('MGX_SECRET_KEY');

export { StorageService };