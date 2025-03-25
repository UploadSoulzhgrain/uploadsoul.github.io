# 直接部署方案（Direct Deployment Solution）

## 概述（Overview）

由于使用GitHub和Vercel部署时出现功能无法正确显示的问题，这里提供一个直接部署到服务器的替代方案，确保所有本地开发的新功能都能正确部署。

## 前提条件（Prerequisites）

- 一台Linux服务器（Ubuntu/CentOS/Debian等）
- Node.js 18+ 和 PNPM 8.10+
- Nginx或其他Web服务器

## 部署步骤（Deployment Steps）

### 1. 准备服务器环境（Prepare Server Environment）

```bash
# 安装Node.js和npm（如果尚未安装）
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装PNPM
npm install -g pnpm@8.10.2

# 安装Nginx
sudo apt-get install -y nginx
```

### 2. 部署代码（Deploy Code）

```bash
# 创建部署目录
sudo mkdir -p /var/www/uploadsoul
sudo chown $(whoami):$(whoami) /var/www/uploadsoul

# 克隆代码（替换为您的仓库地址）
git clone https://github.com/your-username/uploadsoul.git /var/www/uploadsoul/repo
cd /var/www/uploadsoul/repo

# 安装依赖
pnpm install --no-frozen-lockfile

# 构建项目
pnpm run build

# 将构建结果复制到网站根目录
cp -r dist/* /var/www/uploadsoul/
```

### 3. 配置Nginx（Configure Nginx）

创建Nginx配置文件：

```bash
sudo nano /etc/nginx/sites-available/uploadsoul.conf
```

添加以下内容：

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /var/www/uploadsoul;
    index index.html;

    # 为SPA配置路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存设置
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

启用配置并重启Nginx：

```bash
sudo ln -s /etc/nginx/sites-available/uploadsoul.conf /etc/nginx/sites-enabled/
sudo nginx -t  # 验证配置
sudo systemctl restart nginx
```

### 4. 设置自动部署脚本（Set Up Automatic Deployment）

创建部署脚本：

```bash
nano /var/www/uploadsoul/deploy.sh
```

添加以下内容：

```bash
#!/bin/bash

set -e

ECHO_PREFIX="[UploadSoul Deploy]:"
DEPLOY_DIR="/var/www/uploadsoul"
REPO_DIR="$DEPLOY_DIR/repo"

echo "$ECHO_PREFIX Starting deployment at $(date)"

# Pull latest changes
cd $REPO_DIR
git pull

# Install dependencies
echo "$ECHO_PREFIX Installing dependencies..."
pnpm install --no-frozen-lockfile

# Build project
echo "$ECHO_PREFIX Building project..."
NODE_OPTIONS="--max-old-space-size=4096" pnpm run build

# Deploy
echo "$ECHO_PREFIX Deploying to $DEPLOY_DIR..."
rm -rf $DEPLOY_DIR/assets
cp -r dist/* $DEPLOY_DIR/

echo "$ECHO_PREFIX Deployment completed at $(date)"
```

设置脚本权限并运行：

```bash
chmod +x /var/www/uploadsoul/deploy.sh
./var/www/uploadsoul/deploy.sh
```

### 5. 配置SSL（可选）（Configure SSL - Optional）

使用Let's Encrypt：

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 常见问题排查（Troubleshooting）

1. **页面加载404错误**：确认Nginx配置中的try_files指令正确设置

2. **API请求失败**：检查是否需要设置API代理，可在Nginx中添加代理配置

3. **静态资源加载失败**：确保资源路径正确，检查网络请求

4. **内存不足错误**：增加NODE_OPTIONS中的内存限制

## 优势（Advantages）

1. **完全控制**：直接控制部署环境和流程
2. **简化流程**：消除Vercel/GitHub集成的复杂性
3. **快速调试**：可直接在服务器查看日志和调试问题
4. **自定义配置**：可根据需求自定义服务器配置

## 验证部署（Verify Deployment）

部署完成后，访问您的域名验证以下功能是否正常工作：

1. 网站基本页面加载
2. 页面路由和导航
3. 数字人功能和记忆集成
4. 多语言支持
5. 语音聊天功能
