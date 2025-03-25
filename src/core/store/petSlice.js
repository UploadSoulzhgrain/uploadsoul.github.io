// src/core/store/petSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import virtualPetAPI from '../api/virtualPetAPI';

/**
 * 初始状态类型定义
 * @typedef {Object} PetState
 * @property {Array} pets - 宠物列表
 * @property {Object|null} selectedPet - 选中的宠物
 * @property {Array} petSpecies - 宠物物种
 * @property {Array} petFoods - 宠物食物
 * @property {string} status - 加载状态
 * @property {string|null} error - 错误信息
 */

/**
 * 虚拟宠物状态初始值
 */
const initialState = {
  pets: [],
  selectedPet: null,
  petSpecies: [],
  petFoods: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

/**
 * 获取宠物列表异步Action
 */
export const fetchPets = createAsyncThunk(
  'pet/fetchPets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await virtualPetAPI.getPets();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '获取宠物列表失败');
    }
  }
);

/**
 * 获取单个宠物详情异步Action
 */
export const fetchPetById = createAsyncThunk(
  'pet/fetchPetById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await virtualPetAPI.getPetById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '获取宠物详情失败');
    }
  }
);

/**
 * 创建宠物异步Action
 */
export const createPet = createAsyncThunk(
  'pet/createPet',
  async (petData, { rejectWithValue }) => {
    try {
      const response = await virtualPetAPI.createPet(petData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '创建宠物失败');
    }
  }
);

/**
 * 与宠物互动异步Action
 */
export const interactWithPet = createAsyncThunk(
  'pet/interactWithPet',
  async ({ petId, action }, { rejectWithValue }) => {
    try {
      const response = await virtualPetAPI.interact(petId, action);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '宠物互动失败');
    }
  }
);

/**
 * 喂养宠物异步Action
 */
export const feedPet = createAsyncThunk(
  'pet/feedPet',
  async ({ petId, foodId }, { rejectWithValue }) => {
    try {
      const response = await virtualPetAPI.feed(petId, foodId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '喂养宠物失败');
    }
  }
);

/**
 * 训练宠物异步Action
 */
export const trainPet = createAsyncThunk(
  'pet/trainPet',
  async ({ petId, skillId }, { rejectWithValue }) => {
    try {
      const response = await virtualPetAPI.train(petId, skillId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '训练宠物失败');
    }
  }
);

/**
 * 自定义宠物外观异步Action
 */
export const customizePet = createAsyncThunk(
  'pet/customizePet',
  async ({ petId, appearance }, { rejectWithValue }) => {
    try {
      const response = await virtualPetAPI.customize(petId, appearance);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '自定义宠物失败');
    }
  }
);

/**
 * 获取宠物物种异步Action
 */
export const fetchPetSpecies = createAsyncThunk(
  'pet/fetchPetSpecies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await virtualPetAPI.getPetSpecies();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '获取宠物物种失败');
    }
  }
);

/**
 * 获取宠物食物异步Action
 */
export const fetchPetFoods = createAsyncThunk(
  'pet/fetchPetFoods',
  async (_, { rejectWithValue }) => {
    try {
      const response = await virtualPetAPI.getPetFoods();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '获取宠物食物失败');
    }
  }
);

/**
 * 虚拟宠物Slice
 */
const petSlice = createSlice({
  name: 'pet',
  initialState,
  reducers: {
    // 选择宠物
    selectPet: (state, action) => {
      state.selectedPet = action.payload;
    },
    
    // 清除选择的宠物
    clearSelectedPet: (state) => {
      state.selectedPet = null;
    },
    
    // 清除错误信息
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // 处理获取宠物列表状态
    builder
      .addCase(fetchPets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pets = action.payload;
      })
      .addCase(fetchPets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理获取单个宠物详情状态
    builder
      .addCase(fetchPetById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPetById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedPet = action.payload;
        
        // 更新宠物列表中的数据
        const index = state.pets.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.pets[index] = action.payload;
        } else {
          state.pets.push(action.payload);
        }
      })
      .addCase(fetchPetById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理创建宠物状态
    builder
      .addCase(createPet.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createPet.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pets.push(action.payload);
        state.selectedPet = action.payload;
      })
      .addCase(createPet.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理与宠物互动状态
    builder
      .addCase(interactWithPet.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(interactWithPet.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        // 更新宠物状态
        if (state.selectedPet && state.selectedPet.id === action.payload.pet.id) {
          state.selectedPet = action.payload.pet;
        }
        
        const index = state.pets.findIndex(p => p.id === action.payload.pet.id);
        if (index !== -1) {
          state.pets[index] = action.payload.pet;
        }
      })
      .addCase(interactWithPet.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理喂养宠物状态
    builder
      .addCase(feedPet.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(feedPet.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        // 更新宠物状态
        if (state.selectedPet && state.selectedPet.id === action.payload.pet.id) {
          state.selectedPet = action.payload.pet;
        }
        
        const index = state.pets.findIndex(p => p.id === action.payload.pet.id);
        if (index !== -1) {
          state.pets[index] = action.payload.pet;
        }
      })
      .addCase(feedPet.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理训练宠物状态
    builder
      .addCase(trainPet.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(trainPet.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        // 更新宠物状态
        if (state.selectedPet && state.selectedPet.id === action.payload.pet.id) {
          state.selectedPet = action.payload.pet;
        }
        
        const index = state.pets.findIndex(p => p.id === action.payload.pet.id);
        if (index !== -1) {
          state.pets[index] = action.payload.pet;
        }
      })
      .addCase(trainPet.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理自定义宠物外观状态
    builder
      .addCase(customizePet.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(customizePet.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        // 更新宠物状态
        if (state.selectedPet && state.selectedPet.id === action.payload.id) {
          state.selectedPet = action.payload;
        }
        
        const index = state.pets.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.pets[index] = action.payload;
        }
      })
      .addCase(customizePet.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理获取宠物物种状态
    builder
      .addCase(fetchPetSpecies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPetSpecies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.petSpecies = action.payload;
      })
      .addCase(fetchPetSpecies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理获取宠物食物状态
    builder
      .addCase(fetchPetFoods.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPetFoods.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.petFoods = action.payload;
      })
      .addCase(fetchPetFoods.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

// 导出同步Action
export const { selectPet, clearSelectedPet, clearError } = petSlice.actions;

// 导出Reducer
export default petSlice.reducer;