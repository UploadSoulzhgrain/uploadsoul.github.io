// src/core/utils/storage.js
/**
 * 存储服务
 * 提供本地存储和安全存储功能
 */

// 存储键前缀，避免与其他应用冲突
const STORAGE_PREFIX = 'mgx_';

/**
 * 基础存储服务
 */
export class StorageService {
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
   */
  setItem(key, value) {
    try {
      const prefixedKey = this.getKeyWithPrefix(key);
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      localStorage.setItem(prefixedKey, stringValue);
    } catch (error) {
      console.error('存储数据失败:', error);
    }
  }

  /**
   * 获取存储项
   * @param {string} key - 键名
   * @param {any} defaultValue - 默认值
   * @returns {any} 存储的值或默认值
   */
  getItem(key, defaultValue = null) {
    try {
      const prefixedKey = this.getKeyWithPrefix(key);
      const value = localStorage.getItem(prefixedKey);
      
      if (value === null) {
        return defaultValue;
      }
      
      // 尝试解析JSON
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error('获取存储数据失败:', error);
      return defaultValue;
    }
  }

  /**
   * 移除存储项
   * @param {string} key - 键名
   */
  removeItem(key) {
    try {
      const prefixedKey = this.getKeyWithPrefix(key);
      localStorage.removeItem(prefixedKey);
    } catch (error) {
      console.error('移除存储数据失败:', error);
    }
  }

  /**
   * 清除所有带前缀的存储项
   */
  clear() {
    try {
      // 仅清除带有当前前缀的项
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('清除存储数据失败:', error);
    }
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
      const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      sessionStorage.setItem(prefixedKey, stringValue);
    } catch (error) {
      console.error('存储会话数据失败:', error);
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
      const value = sessionStorage.getItem(prefixedKey);
      
      if (value === null) {
        return defaultValue;
      }
      
      // 尝试解析JSON
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    } catch (error) {
      console.error('获取会话存储数据失败:', error);
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
      console.error('移除会话存储数据失败:', error);
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
      console.error('清除会话存储数据失败:', error);
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
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
    const encryptedValue = this.encrypt(stringValue);
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

export default localStorageService;