# 上传代码与网站更新指南

## 1. 项目已成功构建

项目已在本地环境中成功构建，所有最新修改（包括记忆集成修复）已包含在构建输出中。

## 2. 部署文件

部署需要上传以下文件和目录：

- `dist/` 目录（包含编译后的前端代码）
- 服务器配置文件（如果有）

## 3. 上传步骤

### 方法一：直接部署到服务器

1. 将整个 `dist` 目录上传到您的服务器 `/var/www/uploadsoul` 或您指定的网站目录：

   ```bash
   # 在服务器上
   mkdir -p /var/www/uploadsoul
   chmod 755 /var/www/uploadsoul
   ```

   然后使用SFTP或其他文件传输工具上传文件。

2. 配置Nginx（假设您使用Nginx作为Web服务器）：

   ```nginx
   server {
       listen 80;
       server_name uploadsoul.com www.uploadsoul.com;
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

3. 确保环境变量正确配置（如有需要）：

   API密钥和其他敏感信息应通过环境变量或服务器配置提供。

### 方法二：部署到现有的GitHub Pages或其他托管服务

1. 将dist目录中的所有内容上传到GitHub仓库：

   ```bash
   git clone https://github.com/UploadSoulzhgrain/uploadsoul.github.io.git
   cd uploadsoul.github.io
   
   # 确保清空旧内容（保留.git目录）
   rm -rf assets css js index.html
   
   # 复制新构建的内容
   cp -r /path/to/workspace/uploadsoul/dist/* .
   
   # 提交并推送
   git add .
   git commit -m "Update website with latest features and fixes"
   git push origin main
   ```

## 4. 验证部署

部署完成后访问 www.uploadsoul.com 并确认：

1. 网站基本页面加载正常
2. 数字人功能可见且正常工作
3. 记忆集成功能正常工作
4. 多语言支持正常工作

## 5. 已修复的问题

本次部署包含以下修复：

1. 修复了MemoryAdapter.js中的函数名不一致问题
   - 将所有 `useInMemoryFallback()` 更改为 `setupInMemoryFallback()`

2. 修复了digitalAvatarAdapter.js中的异步函数调用问题
   - 在调用 `getConversationContext()` 时添加了缺少的 `await` 关键字

3. 所有ESLint检查现在都通过，没有错误

## 6. 注意事项

- 确保服务器环境中已安装Node.js 18+（如果需要在服务器上构建）
- 确保所有API密钥和环境变量已正确配置
- 如部署后出现问题，请检查浏览器控制台和服务器日志以获取错误信息