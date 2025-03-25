// src/core/store/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authAPI from '../api/authAPI';
import { localStorageService } from '../utils/storage';

/**
 * 初始状态类型定义
 * @typedef {Object} UserState
 * @property {object|null} currentUser - 当前登录用户信息
 * @property {boolean} isAuthenticated - 是否已登录
 * @property {object} preferences - 用户偏好设置
 * @property {string} status - 加载状态
 * @property {string|null} error - 错误信息
 */

/**
 * 用户状态初始值
 */
const initialState = {
  currentUser: null,
  isAuthenticated: false,
  preferences: {
    language: localStorageService.getItem('language', 'zh'),
    theme: localStorageService.getItem('theme', 'auto')
  },
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

/**
 * 登录异步Action
 */
export const login = createAsyncThunk(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(email, password);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '登录失败');
    }
  }
);

/**
 * 手机号登录异步Action
 */
export const loginWithPhone = createAsyncThunk(
  'user/loginWithPhone',
  async ({ phone, verificationCode }, { rejectWithValue }) => {
    try {
      const response = await authAPI.loginWithPhone(phone, verificationCode);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '登录失败');
    }
  }
);

/**
 * 注册异步Action
 */
export const register = createAsyncThunk(
  'user/register',
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(email, password, name);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '注册失败');
    }
  }
);

/**
 * 获取当前用户信息异步Action
 */
export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getCurrentUser();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '获取用户信息失败');
    }
  }
);

/**
 * 退出登录异步Action
 */
export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      return true;
    } catch (error) {
      return rejectWithValue(error.message || '退出登录失败');
    }
  }
);

/**
 * 用户状态Slice
 */
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 同步操作 - 设置语言
    setLanguage: (state, action) => {
      state.preferences.language = action.payload;
      localStorageService.setItem('language', action.payload);
    },
    // 同步操作 - 设置主题
    setTheme: (state, action) => {
      state.preferences.theme = action.payload;
      localStorageService.setItem('theme', action.payload);
    },
    // 清除错误信息
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // 处理登录状态
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.currentUser = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理手机号登录状态
    builder
      .addCase(loginWithPhone.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginWithPhone.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.currentUser = action.payload.user;
      })
      .addCase(loginWithPhone.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理注册状态
    builder
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.currentUser = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理获取用户信息状态
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isAuthenticated = false;
        state.currentUser = null;
      });

    // 处理退出登录状态
    builder
      .addCase(logout.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'succeeded';
        state.isAuthenticated = false;
        state.currentUser = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

// 导出同步Action
export const { setLanguage, setTheme, clearError } = userSlice.actions;

// 导出Reducer
export default userSlice.reducer;