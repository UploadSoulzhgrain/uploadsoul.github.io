import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IUser extends Document {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpires?: Date;
  phoneVerificationToken?: string;
  phoneVerificationExpires?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateEmailVerificationToken(): Promise<void>;
  generatePhoneVerificationToken(): Promise<void>;
  generatePasswordResetToken(): Promise<void>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, '用户名是必需的'],
      unique: true,
      trim: true,
      minlength: [3, '用户名至少需要3个字符'],
      maxlength: [30, '用户名不能超过30个字符'],
    },
    email: {
      type: String,
      required: [true, '邮箱是必需的'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, '请输入有效的邮箱地址'],
    },
    phoneNumber: {
      type: String,
      required: [true, '电话号码是必需的'],
      unique: true,
      trim: true,
      match: [/^1[3-9]\d{9}$/, '请输入有效的手机号码'],
    },
    password: {
      type: String,
      required: [true, '密码是必需的'],
      minlength: [6, '密码至少需要6个字符'],
      select: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    phoneVerificationToken: String,
    phoneVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

// 密码加密中间件
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// 密码比较方法
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// 生成邮箱验证令牌
userSchema.methods.generateEmailVerificationToken = async function (): Promise<void> {
  const token = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = token;
  this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24小时后过期
  await this.save();
};

// 生成手机验证令牌
userSchema.methods.generatePhoneVerificationToken = async function (): Promise<void> {
  const token = Math.floor(100000 + Math.random() * 900000).toString(); // 生成6位数字验证码
  this.phoneVerificationToken = token;
  this.phoneVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10分钟后过期
  await this.save();
};

// 生成密码重置令牌
userSchema.methods.generatePasswordResetToken = async function (): Promise<void> {
  const token = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = token;
  this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1小时后过期
  await this.save();
};

export const User = mongoose.model<IUser>('User', userSchema); 