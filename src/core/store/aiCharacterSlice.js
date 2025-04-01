// src/core/store/aiCharacterSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import aiInteractionAPI from '../api/aiInteractionAPI';

/**
 * 初始状态类型定义
 * @typedef {Object} AICharacterState
 * @property {Array} characters - AI角色列表
 * @property {Object|null} selectedCharacter - 选中的AI角色
 * @property {Object} conversations - 按角色ID索引的对话历史
 * @property {string} status - 加载状态
 * @property {string|null} error - 错误信息
 */

/**
 * AI角色状态初始值
 */
const initialState = {
  characters: [],
  selectedCharacter: null,
  conversations: {}, // 格式: { characterId: [messages] }
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

/**
 * 获取AI角色列表异步Action
 */
export const fetchCharacters = createAsyncThunk(
  'aiCharacter/fetchCharacters',
  async (_, { rejectWithValue }) => {
    try {
      const response = await aiInteractionAPI.getCharacters();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '获取AI角色列表失败');
    }
  }
);

/**
 * 获取单个AI角色详情异步Action
 */
export const fetchCharacterById = createAsyncThunk(
  'aiCharacter/fetchCharacterById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await aiInteractionAPI.getCharacterById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '获取AI角色详情失败');
    }
  }
);

/**
 * 创建AI角色异步Action
 */
export const createCharacter = createAsyncThunk(
  'aiCharacter/createCharacter',
  async (characterData, { rejectWithValue }) => {
    try {
      const response = await aiInteractionAPI.createCharacter(characterData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '创建AI角色失败');
    }
  }
);

/**
 * 发送消息异步Action
 */
export const sendMessage = createAsyncThunk(
  'aiCharacter/sendMessage',
  async ({ characterId, message }, { rejectWithValue }) => {
    try {
      const response = await aiInteractionAPI.sendMessage(characterId, message);
      return {
        characterId,
        userMessage: message,
        aiResponse: response
      };
    } catch (error) {
      return rejectWithValue(error.message || '发送消息失败');
    }
  }
);

/**
 * 获取对话历史异步Action
 */
export const fetchConversationHistory = createAsyncThunk(
  'aiCharacter/fetchConversationHistory',
  async (characterId, { rejectWithValue }) => {
    try {
      const response = await aiInteractionAPI.getConversationHistory(characterId);
      return {
        characterId,
        history: response
      };
    } catch (error) {
      return rejectWithValue(error.message || '获取对话历史失败');
    }
  }
);

/**
 * 清除对话异步Action
 */
export const clearConversation = createAsyncThunk(
  'aiCharacter/clearConversation',
  async (characterId, { rejectWithValue }) => {
    try {
      await aiInteractionAPI.clearConversation(characterId);
      return characterId;
    } catch (error) {
      return rejectWithValue(error.message || '清除对话失败');
    }
  }
);

/**
 * AI角色Slice
 */
const aiCharacterSlice = createSlice({
  name: 'aiCharacter',
  initialState,
  reducers: {
    // 选择角色
    selectCharacter: (state, action) => {
      state.selectedCharacter = action.payload;
    },
    
    // 清除选择的角色
    clearSelectedCharacter: (state) => {
      state.selectedCharacter = null;
    },
    
    // 清除错误信息
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // 处理获取角色列表状态
    builder
      .addCase(fetchCharacters.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.characters = action.payload;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理获取单个角色详情状态
    builder
      .addCase(fetchCharacterById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCharacterById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedCharacter = action.payload;
        
        // 更新角色列表中的数据
        const index = state.characters.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.characters[index] = action.payload;
        } else {
          state.characters.push(action.payload);
        }
      })
      .addCase(fetchCharacterById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理创建角色状态
    builder
      .addCase(createCharacter.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createCharacter.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.characters.push(action.payload);
        state.selectedCharacter = action.payload;
      })
      .addCase(createCharacter.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理发送消息状态
    builder
      .addCase(sendMessage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { characterId, userMessage, aiResponse } = action.payload;
        
        // 如果没有该角色的对话记录，创建一个空数组
        if (!state.conversations[characterId]) {
          state.conversations[characterId] = [];
        }
        
        // 添加用户消息和AI回复
        state.conversations[characterId].push(
          { role: 'user', content: userMessage, timestamp: new Date().toISOString() },
          { role: 'assistant', content: aiResponse.reply, emotions: aiResponse.emotions || [], timestamp: new Date().toISOString() }
        );
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理获取对话历史状态
    builder
      .addCase(fetchConversationHistory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchConversationHistory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { characterId, history } = action.payload;
        state.conversations[characterId] = history;
      })
      .addCase(fetchConversationHistory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理清除对话状态
    builder
      .addCase(clearConversation.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(clearConversation.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const characterId = action.payload;
        state.conversations[characterId] = [];
      })
      .addCase(clearConversation.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

// 导出同步Action
export const { selectCharacter, clearSelectedCharacter, clearError } = aiCharacterSlice.actions;

// 导出Reducer
export default aiCharacterSlice.reducer;