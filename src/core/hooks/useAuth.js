// src/core/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login, loginWithPhone, register, logout, fetchCurrentUser } from '../store/userSlice';

/**
 * 认证Hook
 * 提供用户认证相关功能
 * @returns {Object} 认证相关方法和状态
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const { currentUser, isAuthenticated, status, error } = useSelector((state) => state.user);
  
  // 定义本地loading状态，避免多次调用API
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * 使用邮箱密码登录
   * @param {string} email - 用户邮箱
   * @param {string} password - 用户密码
   * @returns {Promise<Object>} 登录结果
   */
  const handleLogin = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const result = await dispatch(login({ email, password })).unwrap();
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, [dispatch]);
  
  /**
   * 使用手机号验证码登录
   * @param {string} phone - 用户手机号
   * @param {string} verificationCode - 验证码
   * @returns {Promise<Object>} 登录结果
   */
  const handlePhoneLogin = useCallback(async (phone, verificationCode) => {
    setIsLoading(true);
    try {
      const result = await dispatch(loginWithPhone({ phone, verificationCode })).unwrap();
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, [dispatch]);
  
  /**
   * 注册新用户
   * @param {string} email - 用户邮箱
   * @param {string} password - 用户密码
   * @param {string} name - 用户姓名
   * @returns {Promise<Object>} 注册结果
   */
  const handleRegister = useCallback(async (email, password, name) => {
    setIsLoading(true);
    try {
      const result = await dispatch(register({ email, password, name })).unwrap();
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, [dispatch]);
  
  /**
   * 退出登录
   * @returns {Promise<void>}
   */
  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    try {
      await dispatch(logout()).unwrap();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, [dispatch]);
  
  /**
   * 检查登录状态
   * @returns {Promise<boolean>} 是否已登录
   */
  const checkAuth = useCallback(async () => {
    if (isAuthenticated) return true;
    
    try {
      await dispatch(fetchCurrentUser()).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  }, [dispatch, isAuthenticated]);
  
  // 组件挂载时检查登录状态
  useEffect(() => {
    if (!isAuthenticated && status === 'idle') {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isAuthenticated, status]);
  
  return {
    user: currentUser,
    isAuthenticated,
    isLoading: isLoading || status === 'loading',
    error,
    login: handleLogin,
    loginWithPhone: handlePhoneLogin,
    register: handleRegister,
    logout: handleLogout,
    checkAuth
  };
};

export default useAuth;