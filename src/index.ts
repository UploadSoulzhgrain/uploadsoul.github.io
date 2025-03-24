import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import { errorHandler } from './middleware/errorHandler';

// 加载环境变量
dotenv.config();

// 创建Express应用
const app = express();

// 连接数据库
connectDB();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 