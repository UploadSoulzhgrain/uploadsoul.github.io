/**
 * 数据库配置
 * 提供数据库连接和模型定义
 */

import mongoose from 'mongoose';

// 数据库连接配置
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/uploadsoul';

// 连接选项
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};

// 连接数据库
export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, options);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// 用户模型
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationCode: {
    code: String,
    expiresAt: Date
  },
  resetPasswordToken: {
    token: String,
    expiresAt: Date
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 创建索引
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ 'verificationCode.expiresAt': 1 }, { expireAfterSeconds: 0 });
userSchema.index({ 'resetPasswordToken.expiresAt': 1 }, { expireAfterSeconds: 0 });

// 导出模型
export const User = mongoose.model('User', userSchema); 