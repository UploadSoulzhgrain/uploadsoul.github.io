import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { z } from 'zod';
import { AppError } from '../middleware/errorHandler';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailService';
import { sendVerificationSMS } from '../utils/smsService';

// 验证模式
const registerSchema = z.object({
  username: z.string().min(3, '用户名至少需要3个字符').max(30, '用户名不能超过30个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  phoneNumber: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码'),
  password: z.string().min(6, '密码至少需要6个字符'),
});

const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string(),
});

const resetPasswordSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
});

const updatePasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6, '密码至少需要6个字符'),
});

const verifyPhoneSchema = z.object({
  phoneNumber: z.string().regex(/^1[3-9]\d{9}$/, '请输入有效的手机号码'),
  code: z.string().length(6, '验证码必须是6位数字'),
});

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, phoneNumber, password } = registerSchema.parse(req.body);

    // 检查用户是否已存在
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { phoneNumber }],
    });
    if (existingUser) {
      throw new AppError('用户名、邮箱或手机号已被使用', 400);
    }

    // 创建新用户
    const user = await User.create({
      username,
      email,
      phoneNumber,
      password,
    });

    // 生成验证令牌并发送验证邮件和短信
    await user.generateEmailVerificationToken();
    await user.generatePhoneVerificationToken();
    await Promise.all([
      sendVerificationEmail(email, user.emailVerificationToken!),
      sendVerificationSMS(phoneNumber, user.phoneVerificationToken!),
    ]);

    // 生成 JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      status: 'success',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError(error.errors[0].message, 400);
    }
    throw error;
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    // 查找用户
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('邮箱或密码错误', 401);
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('邮箱或密码错误', 401);
    }

    // 检查邮箱和手机是否已验证
    if (!user.isEmailVerified) {
      throw new AppError('请先验证您的邮箱', 401);
    }
    if (!user.isPhoneVerified) {
      throw new AppError('请先验证您的手机号', 401);
    }

    // 生成 JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      status: 'success',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError(error.errors[0].message, 400);
    }
    throw error;
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError('验证链接无效或已过期', 400);
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({
      status: 'success',
      message: '邮箱验证成功',
    });
  } catch (error) {
    throw error;
  }
};

export const verifyPhone = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, code } = verifyPhoneSchema.parse(req.body);

    const user = await User.findOne({
      phoneNumber,
      phoneVerificationToken: code,
      phoneVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError('验证码无效或已过期', 400);
    }

    user.isPhoneVerified = true;
    user.phoneVerificationToken = undefined;
    user.phoneVerificationExpires = undefined;
    await user.save();

    res.json({
      status: 'success',
      message: '手机号验证成功',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError(error.errors[0].message, 400);
    }
    throw error;
  }
};

export const resendVerificationCode = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = verifyPhoneSchema.pick({ phoneNumber: true }).parse(req.body);

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      throw new AppError('该手机号未注册', 404);
    }

    if (user.isPhoneVerified) {
      throw new AppError('该手机号已验证', 400);
    }

    await user.generatePhoneVerificationToken();
    await sendVerificationSMS(phoneNumber, user.phoneVerificationToken!);

    res.json({
      status: 'success',
      message: '验证码已重新发送',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError(error.errors[0].message, 400);
    }
    throw error;
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = resetPasswordSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('该邮箱未注册', 404);
    }

    await user.generatePasswordResetToken();
    await sendPasswordResetEmail(email, user.passwordResetToken!);

    res.json({
      status: 'success',
      message: '密码重置链接已发送到您的邮箱',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError(error.errors[0].message, 400);
    }
    throw error;
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = updatePasswordSchema.parse(req.body);

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
      throw new AppError('重置链接无效或已过期', 400);
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({
      status: 'success',
      message: '密码重置成功',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError(error.errors[0].message, 400);
    }
    throw error;
  }
}; 