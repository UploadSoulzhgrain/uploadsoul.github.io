import express from 'express';
import {
  register,
  login,
  verifyEmail,
  verifyPhone,
  resendVerificationCode,
  requestPasswordReset,
  resetPassword,
} from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/verify-phone', verifyPhone);
router.post('/resend-verification-code', resendVerificationCode);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router; 