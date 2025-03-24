# MGX AI Platform Backend

这是 MGX AI Platform 的后端服务，使用 Node.js、Express、TypeScript 和 MongoDB 构建。

## 功能特性

- 用户认证（注册/登录）
- JWT 令牌认证
- 用户信息管理
- 错误处理中间件
- 数据验证

## 技术栈

- Node.js
- Express
- TypeScript
- MongoDB
- JWT
- Zod (数据验证)

## 开始使用

### 前置要求

- Node.js (v14 或更高版本)
- MongoDB (v4.4 或更高版本)
- npm 或 yarn

### 安装

1. 克隆仓库：
```bash
git clone <repository-url>
cd mgx-ai-platform/backend
```

2. 安装依赖：
```bash
npm install
```

3. 创建环境变量文件：
```bash
cp .env.example .env
```

4. 配置环境变量：
编辑 `.env` 文件，设置必要的环境变量：
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/mgx-ai-platform
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 运行

开发环境：
```bash
npm run dev
```

生产环境：
```bash
npm run build
npm start
```

## API 端点

### 认证

- POST `/api/auth/register` - 用户注册
- POST `/api/auth/login` - 用户登录

### 用户

- GET `/api/users/profile` - 获取用户信息
- PATCH `/api/users/profile` - 更新用户信息

## 开发

### 构建

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

## 许可证

MIT 