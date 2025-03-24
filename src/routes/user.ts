import express from 'express';
import { getProfile, updateProfile } from '../controllers/userController';
import { auth } from '../middleware/auth';

const router = express.Router();

// 所有路由都需要认证
router.use(auth);

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

export default router; 