// src/core/store/digitalHumanSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import digitalHumanAPI from '../api/digitalHumanAPI';

/**
 * 初始状态类型定义
 * @typedef {Object} DigitalHumanState
 * @property {Array} digitalHumans - 数字人列表
 * @property {Object|null} selectedDigitalHuman - 选中的数字人
 * @property {Object} trainingStatus - 训练状态，按数字人ID索引
 * @property {string} status - 加载状态
 * @property {string|null} error - 错误信息
 */

/**
 * 数字人状态初始值
 */
const initialState = {
  digitalHumans: [],
  selectedDigitalHuman: null,
  trainingStatus: {}, // 格式: { digitalHumanId: { status: 'training', progress: 0.5 } }
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

/**
 * 获取数字人列表异步Action
 */
export const fetchDigitalHumans = createAsyncThunk(
  'digitalHuman/fetchDigitalHumans',
  async (_, { rejectWithValue }) => {
    try {
      const response = await digitalHumanAPI.getDigitalHumans();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '获取数字人列表失败');
    }
  }
);

/**
 * 获取单个数字人详情异步Action
 */
export const fetchDigitalHumanById = createAsyncThunk(
  'digitalHuman/fetchDigitalHumanById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await digitalHumanAPI.getDigitalHumanById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '获取数字人详情失败');
    }
  }
);

/**
 * 创建数字人异步Action
 */
export const createDigitalHuman = createAsyncThunk(
  'digitalHuman/createDigitalHuman',
  async (digitalHumanData, { rejectWithValue }) => {
    try {
      const response = await digitalHumanAPI.createDigitalHuman(digitalHumanData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '创建数字人失败');
    }
  }
);

/**
 * 更新数字人异步Action
 */
export const updateDigitalHuman = createAsyncThunk(
  'digitalHuman/updateDigitalHuman',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await digitalHumanAPI.updateDigitalHuman(id, updates);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '更新数字人失败');
    }
  }
);

/**
 * 删除数字人异步Action
 */
export const deleteDigitalHuman = createAsyncThunk(
  'digitalHuman/deleteDigitalHuman',
  async (id, { rejectWithValue }) => {
    try {
      await digitalHumanAPI.deleteDigitalHuman(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || '删除数字人失败');
    }
  }
);

/**
 * 添加数字人记忆异步Action
 */
export const addMemory = createAsyncThunk(
  'digitalHuman/addMemory',
  async ({ digitalHumanId, memory }, { rejectWithValue }) => {
    try {
      const response = await digitalHumanAPI.addMemory(digitalHumanId, memory);
      return {
        digitalHumanId,
        memory: response
      };
    } catch (error) {
      return rejectWithValue(error.message || '添加记忆失败');
    }
  }
);

/**
 * 上传媒体文件异步Action
 */
export const uploadMedia = createAsyncThunk(
  'digitalHuman/uploadMedia',
  async ({ digitalHumanId, file }, { rejectWithValue }) => {
    try {
      const response = await digitalHumanAPI.uploadMedia(digitalHumanId, file);
      return {
        digitalHumanId,
        media: response
      };
    } catch (error) {
      return rejectWithValue(error.message || '上传媒体文件失败');
    }
  }
);

/**
 * 训练数字人异步Action
 */
export const trainFromMedia = createAsyncThunk(
  'digitalHuman/trainFromMedia',
  async ({ digitalHumanId, mediaIds }, { rejectWithValue }) => {
    try {
      const response = await digitalHumanAPI.trainFromMedia(digitalHumanId, mediaIds);
      return {
        digitalHumanId,
        progress: response.progress
      };
    } catch (error) {
      return rejectWithValue(error.message || '训练数字人失败');
    }
  }
);

/**
 * 获取训练状态异步Action
 */
export const getTrainingStatus = createAsyncThunk(
  'digitalHuman/getTrainingStatus',
  async (digitalHumanId, { rejectWithValue }) => {
    try {
      const response = await digitalHumanAPI.getTrainingStatus(digitalHumanId);
      return {
        digitalHumanId,
        status: response.status,
        progress: response.progress
      };
    } catch (error) {
      return rejectWithValue(error.message || '获取训练状态失败');
    }
  }
);

/**
 * 与数字人对话异步Action
 */
export const chatWithDigitalHuman = createAsyncThunk(
  'digitalHuman/chatWithDigitalHuman',
  async ({ digitalHumanId, message }, { rejectWithValue }) => {
    try {
      const response = await digitalHumanAPI.chatWithDigitalHuman(digitalHumanId, message);
      return {
        digitalHumanId,
        reply: response.reply
      };
    } catch (error) {
      return rejectWithValue(error.message || '与数字人对话失败');
    }
  }
);

/**
 * 数字人Slice
 */
const digitalHumanSlice = createSlice({
  name: 'digitalHuman',
  initialState,
  reducers: {
    // 选择数字人
    selectDigitalHuman: (state, action) => {
      state.selectedDigitalHuman = action.payload;
    },
    
    // 清除选择的数字人
    clearSelectedDigitalHuman: (state) => {
      state.selectedDigitalHuman = null;
    },
    
    // 清除错误信息
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // 处理获取数字人列表状态
    builder
      .addCase(fetchDigitalHumans.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDigitalHumans.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.digitalHumans = action.payload;
      })
      .addCase(fetchDigitalHumans.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理获取单个数字人详情状态
    builder
      .addCase(fetchDigitalHumanById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDigitalHumanById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedDigitalHuman = action.payload;
        
        // 更新数字人列表中的数据
        const index = state.digitalHumans.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.digitalHumans[index] = action.payload;
        } else {
          state.digitalHumans.push(action.payload);
        }
      })
      .addCase(fetchDigitalHumanById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理创建数字人状态
    builder
      .addCase(createDigitalHuman.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createDigitalHuman.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.digitalHumans.push(action.payload);
        state.selectedDigitalHuman = action.payload;
      })
      .addCase(createDigitalHuman.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理更新数字人状态
    builder
      .addCase(updateDigitalHuman.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateDigitalHuman.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        // 更新数字人详情
        if (state.selectedDigitalHuman && state.selectedDigitalHuman.id === action.payload.id) {
          state.selectedDigitalHuman = action.payload;
        }
        
        const index = state.digitalHumans.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.digitalHumans[index] = action.payload;
        }
      })
      .addCase(updateDigitalHuman.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理删除数字人状态
    builder
      .addCase(deleteDigitalHuman.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteDigitalHuman.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.digitalHumans = state.digitalHumans.filter(d => d.id !== action.payload);
        
        if (state.selectedDigitalHuman && state.selectedDigitalHuman.id === action.payload) {
          state.selectedDigitalHuman = null;
        }
      })
      .addCase(deleteDigitalHuman.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理训练状态
    builder
      .addCase(getTrainingStatus.fulfilled, (state, action) => {
        const { digitalHumanId, status, progress } = action.payload;
        state.trainingStatus[digitalHumanId] = { status, progress };
      })
      .addCase(trainFromMedia.fulfilled, (state, action) => {
        const { digitalHumanId, progress } = action.payload;
        state.trainingStatus[digitalHumanId] = { 
          status: progress < 1 ? 'training' : 'completed', 
          progress 
        };
      });
  }
});

// 导出同步Action
export const { selectDigitalHuman, clearSelectedDigitalHuman, clearError } = digitalHumanSlice.actions;

// 导出Reducer
export default digitalHumanSlice.reducer;