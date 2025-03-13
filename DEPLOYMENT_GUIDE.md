# UploadSoul Deployment Guide

## 部署指南

本文档详细说明了如何将本地 UploadSoul 项目文件推送到 GitHub 并验证 Vercel 部署是否成功。

### 1. 推送本地文件到 GitHub

#### 准备工作

确保已安装 Git，并已配置 Git 凭据：



#### 配置本地仓库

1. 在项目目录下初始化 Git（如果尚未初始化）：
   

2. 添加 GitHub 远程仓库：
   
   
   如果远程仓库已添加但 URL 不正确，可以使用：
   

3. 拉取远程仓库（避免冲突）：
   
   
   注意：根据仓库设置，分支名可能是 main 或 master。

#### 提交并推送文件

1. 添加所有文件到暂存区：
   

2. 提交更改：
   

3. 使用 GitHub 令牌推送到 GitHub：
   

4. 如需使用令牌认证，可按以下格式输入：
   - 用户名：您的 GitHub 用户名
   - 密码：GitHub 个人访问令牌 (PAT)

#### 处理可能出现的问题

1. **认证失败**：
   - 确保使用正确的 GitHub 个人访问令牌
   - 令牌必须具有 `repo` 访问权限
   - 可以使用以下格式克隆仓库，直接在 URL 中包含令牌：
     

2. **推送冲突**：
   - 先尝试 `git pull origin main` 获取最新更改
   - 解决任何冲突后重新提交
   - 如果冲突无法解决，可以使用强制推送（谨慎使用）：
     

3. **大文件推送失败**：
   - 检查是否有超大文件（GitHub 单文件限制为 100MB）
   - 考虑使用 Git LFS 处理大文件

### 2. 验证部署成功

#### 监控 Vercel 部署进度

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择 UploadSoul 项目
3. 查看"Deployments"标签页，确认是否有新的部署正在进行
4. 等待部署完成，状态会变为"Ready"

#### 确认部署成功的检查点

1. 访问已部署的网站 [www.uploadsoul.com](https://www.uploadsoul.com)
2. 确认主页正常加载
3. 验证导航菜单是否显示"Games"选项
4. 点击导航到 Games 页面，确认游戏页面正常显示
5. 测试记忆游戏功能，确保可以正常启动和玩游戏
6. 检查游戏页面上的图片资源是否正确加载
7. 确认游戏统计数据正常显示和更新

#### 故障排除

如果部署后仍有问题：

1. **页面未更新**：
   - 清除浏览器缓存
   - 强制刷新页面 (Ctrl+F5)
   - 检查浏览器控制台是否有错误

2. **资源加载失败**：
   - 检查图片和其他资源的路径是否正确
   - 确认资源文件是否已成功推送到仓库

3. **路由问题**：
   - 确认 Vercel 配置正确处理 React Router
   - 可能需要添加重定向规则或配置 rewrites

### 3. 备选方案 - 直接从本地部署到 Vercel

如果 GitHub 部署有问题，可以尝试直接从本地部署：

1. 安装 Vercel CLI：
   

2. 登录 Vercel：
   

3. 在项目目录下运行部署命令：
   

4. 按照提示完成部署配置：
   - 确认项目目录
   - 选择或创建项目
   - 设置环境变量（如果需要）
   - 确认部署设置

5. 部署完成后，Vercel 会提供访问链接

6. 如需设置为生产环境，使用：
   

### 4. 持续集成/部署设置

为了避免未来出现类似问题，建议设置自动化部署流程：

1. 确保开发在正确的分支上进行
2. 设置 GitHub Actions 自动构建和测试
3. 配置 Vercel 自动部署设置，确保拉取所有必要文件
4. 考虑添加预部署检查，确保所有必要文件都被推送

### 附录：重要文件检查清单

确保以下关键文件已推送到 GitHub 仓库：

- `src/pages/HomePage.jsx`
- `src/pages/GamesPage.jsx`
- `src/pages/DigitalHumanPage.jsx`
- `src/pages/CompanionPage.jsx`
- `src/pages/FamilyTreePage.jsx`
- `src/pages/PetPage.jsx`
- `src/pages/ShopPage.jsx`
- `src/pages/VRPage.jsx`
- `src/components/games/MemoryGame.jsx`
- `src/services/gameService.js`
- `src/core/router.jsx`
- `src/App.jsx`
- `src/main.jsx`

同时确保相关资源文件也已正确推送：
- `public/assets/games/` 目录下的游戏资源
- `public/assets/memories/` 目录下的记忆卡片图片
- `public/assets/sounds/` 目录下的音效文件