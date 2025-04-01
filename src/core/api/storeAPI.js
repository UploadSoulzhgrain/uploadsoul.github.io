// src/core/api/storeAPI.js
/**
 * 商城API服务
 * 处理商品和订单相关的API请求
 */

import apiClient from './apiClient';

class StoreAPI {
  /**
   * 获取商品列表
   * @param {string} category - 商品类别
   * @returns {Promise<Array>} - 商品列表
   */
  async getProducts(category) {
    const params = category ? { category } : {};
    return apiClient.get('/store/products', params);
  }

  /**
   * 获取单个商品详情
   * @param {string} id - 商品ID
   * @returns {Promise<object>} - 商品详情
   */
  async getProductById(id) {
    return apiClient.get(`/store/products/${id}`);
  }

  /**
   * 购买商品
   * @param {string} productId - 商品ID
   * @returns {Promise<object>} - 订单信息
   */
  async purchaseProduct(productId) {
    return apiClient.post('/store/orders', { productId });
  }

  /**
   * 获取用户订单
   * @returns {Promise<Array>} - 订单列表
   */
  async getUserOrders() {
    return apiClient.get('/store/orders');
  }

  /**
   * 获取订单详情
   * @param {string} id - 订单ID
   * @returns {Promise<object>} - 订单详情
   */
  async getOrderById(id) {
    return apiClient.get(`/store/orders/${id}`);
  }

  /**
   * 应用已购商品
   * @param {string} productId - 商品ID
   * @param {string} entityType - 实体类型 (character/pet/digitalHuman)
   * @param {string} entityId - 实体ID
   * @returns {Promise<void>}
   */
  async applyProductToEntity(productId, entityType, entityId) {
    return apiClient.post('/store/apply', {
      productId,
      entityType,
      entityId
    });
  }

  /**
   * 创建购物车
   * @returns {Promise<object>} - 购物车信息
   */
  async createCart() {
    return apiClient.post('/store/cart');
  }

  /**
   * 获取购物车
   * @returns {Promise<object>} - 购物车信息
   */
  async getCart() {
    return apiClient.get('/store/cart');
  }

  /**
   * 添加商品到购物车
   * @param {string} productId - 商品ID
   * @param {number} quantity - 数量
   * @returns {Promise<object>} - 更新后的购物车
   */
  async addToCart(productId, quantity) {
    return apiClient.post('/store/cart/items', {
      productId,
      quantity
    });
  }

  /**
   * 从购物车移除商品
   * @param {string} productId - 商品ID
   * @returns {Promise<object>} - 更新后的购物车
   */
  async removeFromCart(productId) {
    return apiClient.delete(`/store/cart/items/${productId}`);
  }

  /**
   * 更新购物车商品数量
   * @param {string} productId - 商品ID
   * @param {number} quantity - 新数量
   * @returns {Promise<object>} - 更新后的购物车
   */
  async updateCartItem(productId, quantity) {
    return apiClient.put(`/store/cart/items/${productId}`, { quantity });
  }

  /**
   * 结算购物车
   * @returns {Promise<object>} - 订单信息
   */
  async checkout() {
    return apiClient.post('/store/checkout');
  }

  /**
   * 获取商品类别
   * @returns {Promise<Array>} - 类别列表
   */
  async getCategories() {
    return apiClient.get('/store/categories');
  }
}

// 导出商城API服务单例
const storeAPI = new StoreAPI();
export default storeAPI;