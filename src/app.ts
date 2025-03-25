import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/auth';
import fileRoutes from './routes/file';
import healthRoutes from './routes/health';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// 中间件
app.use(cors({
  origin: ['https://www.uploadsoul.com', 'https://uploadsoul-github-io.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 路由
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);

// 错误处理
app.use(errorHandler);

export default app; 