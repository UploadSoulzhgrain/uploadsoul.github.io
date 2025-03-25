// src/core/store/storeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import storeAPI from '../api/storeAPI';

/**
 * 初始状态类型定义
 * @typedef {Object} StoreState
 * @property {Array} products - 商品列表
 * @property {Object|null} selectedProduct - 选中的商品
 * @property {Array} cart - 购物车商品
 * @property {Array} orders - 订单列表
 * @property {Array} categories - 商品类别
 * @property {string} status - 加载状态
 * @property {string|null} error - 错误信息
 */

/**
 * 商城状态初始值
 */
const initialState = {
  products: [],
  selectedProduct: null,
  cart: [],
  orders: [],
  categories: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

/**
 * 获取商品列表异步Action
 */
export const fetchProducts = createAsyncThunk(
  'store/fetchProducts',
  async (category, { rejectWithValue }) => {
    try {
      const response = await storeAPI.getProducts(category);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '获取商品列表失败');
    }
  }
);

/**
 * 获取单个商品详情异步Action
 */
export const fetchProductById = createAsyncThunk(
  'store/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await storeAPI.getProductById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '获取商品详情失败');
    }
  }
);

/**
 * 获取购物车异步Action
 */
export const fetchCart = createAsyncThunk(
  'store/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await storeAPI.getCart();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '获取购物车失败');
    }
  }
);

/**
 * 添加商品到购物车异步Action
 */
export const addToCart = createAsyncThunk(
  'store/addToCart',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await storeAPI.addToCart(productId, quantity);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '添加商品到购物车失败');
    }
  }
);

/**
 * 从购物车移除商品异步Action
 */
export const removeFromCart = createAsyncThunk(
  'store/removeFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await storeAPI.removeFromCart(productId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '从购物车移除商品失败');
    }
  }
);

/**
 * 更新购物车商品数量异步Action
 */
export const updateCartItem = createAsyncThunk(
  'store/updateCartItem',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await storeAPI.updateCartItem(productId, quantity);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '更新购物车商品数量失败');
    }
  }
);

/**
 * 结算购物车异步Action
 */
export const checkout = createAsyncThunk(
  'store/checkout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await storeAPI.checkout();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '结算购物车失败');
    }
  }
);

/**
 * 获取用户订单异步Action
 */
export const fetchOrders = createAsyncThunk(
  'store/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await storeAPI.getUserOrders();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '获取订单列表失败');
    }
  }
);

/**
 * 获取单个订单详情异步Action
 */
export const fetchOrderById = createAsyncThunk(
  'store/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await storeAPI.getOrderById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '获取订单详情失败');
    }
  }
);

/**
 * 获取商品类别异步Action
 */
export const fetchCategories = createAsyncThunk(
  'store/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await storeAPI.getCategories();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || '获取商品类别失败');
    }
  }
);

/**
 * 应用商品异步Action
 */
export const applyProduct = createAsyncThunk(
  'store/applyProduct',
  async ({ productId, entityType, entityId }, { rejectWithValue }) => {
    try {
      const response = await storeAPI.applyProductToEntity(productId, entityType, entityId);
      return {
        productId,
        entityType,
        entityId,
        result: response
      };
    } catch (error) {
      return rejectWithValue(error.message || '应用商品失败');
    }
  }
);

/**
 * 商城Slice
 */
const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    // 选择商品
    selectProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    
    // 清除选择的商品
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    
    // 清除错误信息
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // 处理获取商品列表状态
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理获取单个商品详情状态
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedProduct = action.payload;
        
        // 更新商品列表中的数据
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        } else {
          state.products.push(action.payload);
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理获取购物车状态
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart = action.payload.items || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理添加商品到购物车状态
    builder
      .addCase(addToCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart = action.payload.items || [];
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理从购物车移除商品状态
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart = action.payload.items || [];
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理更新购物车商品数量状态
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart = action.payload.items || [];
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理结算购物车状态
    builder
      .addCase(checkout.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkout.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cart = []; // 清空购物车
        state.orders.unshift(action.payload); // 添加新订单到订单列表开头
      })
      .addCase(checkout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理获取用户订单状态
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // 处理获取商品类别状态
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

// 导出同步Action
export const { selectProduct, clearSelectedProduct, clearError } = storeSlice.actions;

// 导出Reducer
export default storeSlice.reducer;