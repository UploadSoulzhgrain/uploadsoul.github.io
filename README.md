# AI Platform Backend

这是 AI Platform 的后端服务，提供用户认证、文件上传等功能。

## 功能特性

- 用户认证 (注册、登录、密码重置)
- 文件上传和管理
- 邮件验证
- 短信验证
- AWS S3 文件存储

## 技术栈

- Node.js
- Express
- TypeScript
- MongoDB
- AWS S3
- JWT 认证

## 开发环境设置

1. 安装依赖:
```bash
npm install
```

2. 配置环境变量:
```bash
cp .env.example .env
```

3. 启动开发服务器:
```bash
npm run dev
```

## API 文档

### 认证相关

- POST /api/auth/register - 用户注册
- POST /api/auth/login - 用户登录
- POST /api/auth/verify-email - 验证邮箱
- POST /api/auth/verify-phone - 验证手机号
- POST /api/auth/reset-password - 重置密码

### 文件相关

- POST /api/files/upload - 上传文件
- GET /api/files - 获取文件列表
- GET /api/files/:id - 获取单个文件
- DELETE /api/files/:id - 删除文件

## 部署

项目同时部署在 Vercel 和 Railway 平台上，使用 MongoDB Atlas 作为数据库服务，AWS S3 作为文件存储。

## 许可证

MIT 
