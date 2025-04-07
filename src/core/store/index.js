// src/core/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';

/**
 * 应用的根Redux存储
 * 集成所有功能模块的reducer
 */
const store = configureStore({
  reducer: {
    user: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['user/login', 'user/updateUser'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.createdAt', 'payload.updatedAt'],
        // Ignore these paths in the state
        ignoredPaths: ['user.user.createdAt', 'user.user.updatedAt'],
      },
    })
});

// 导出类型定义 - 修改为JavaScript注释形式
// RootState = ReturnType<typeof store.getState>
// AppDispatch = typeof store.dispatch

export default store;