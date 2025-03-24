import { Request, Response } from 'express';
import { User } from '../models/User';
import { z } from 'zod';

const updateUserSchema = z.object({
  username: z.string().min(3, '用户名至少需要3个字符').max(30, '用户名不能超过30个字符').optional(),
  email: z.string().email('请输入有效的邮箱地址').optional(),
  password: z.string().min(6, '密码至少需要6个字符').optional(),
});

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: '获取用户信息失败' });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const updates = updateUserSchema.parse(req.body);
    
    // 如果更新邮箱，检查是否已被使用
    if (updates.email && updates.email !== req.user?.email) {
      const existingUser = await User.findOne({ email: updates.email });
      if (existingUser) {
        return res.status(400).json({ error: '该邮箱已被使用' });
      }
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 更新用户信息
    Object.assign(user, updates);
    await user.save();

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: '更新用户信息失败' });
  }
}; 