// src/core/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import aiCharacterReducer from './aiCharacterSlice';
import petReducer from './petSlice';
import digitalHumanReducer from './digitalHumanSlice';
import storeReducer from './storeSlice';

/**
 * 应用的根Redux存储
 * 集成所有功能模块的reducer
 */
const store = configureStore({
  reducer: {
    user: userReducer,
    aiCharacter: aiCharacterReducer,
    pet: petReducer,
    digitalHuman: digitalHumanReducer,
    store: storeReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false // 允许在Redux中存储非序列化数据
    })
});

// 导出类型定义 - 修改为JavaScript注释形式
// RootState = ReturnType<typeof store.getState>
// AppDispatch = typeof store.dispatch

export default store;