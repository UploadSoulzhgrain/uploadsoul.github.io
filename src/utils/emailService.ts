import nodemailer from 'nodemailer';
import { AppError } from '../middleware/errorHandler';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: '验证您的邮箱',
    html: `
      <h1>验证您的邮箱</h1>
      <p>请点击下面的链接验证您的邮箱：</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>如果您没有注册账号，请忽略此邮件。</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new AppError('发送验证邮件失败', 500);
  }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: '重置密码',
    html: `
      <h1>重置密码</h1>
      <p>请点击下面的链接重置您的密码：</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>如果您没有请求重置密码，请忽略此邮件。</p>
      <p>此链接将在1小时后失效。</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new AppError('发送重置密码邮件失败', 500);
  }
}; 