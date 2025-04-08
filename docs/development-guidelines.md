# UploadSoul 开发指南和经验教训

## 路由配置
- 使用 `HashRouter` 时：
  - 不要使用 `<base href="/" />` 标签
  - 在 `vite.config.js` 中设置 `base: './'`
  - 添加 `historyApiFallback: true` 支持 SPA 路由

## 文件命名规范
- React 组件文件使用 PascalCase（如 `HomePage.jsx`）
- 避免仅大小写不同的文件名
- 文件名应与组件名保持一致

## 第三方库配置
- 使用 `react-helmet-async` 时：
  - 必须在 `main.jsx` 中添加 `HelmetProvider`
  - 确保 Provider 包裹整个应用

## i18n 配置
- 统一翻译文件目录结构
- 避免重复的翻译文件
- 确保所有引用的翻译文件都存在
- 使用 `zh-CN` 而不是 `zh` 作为中文语言代码

## 开发环境配置
- `vite.config.js` 配置：
  ```javascript
  {
    base: './',
    server: {
      port: 5173,
      host: 'localhost',
      historyApiFallback: true
    }
  }
  ```

## SEO 优化
- 确保所有页面都有：
  - 正确的 meta 标签
  - 语义化的 HTML 结构
  - 适当的标题和描述
  - 规范的 URL 结构

## 性能优化
- 使用代码分割
- 优化图片资源
- 使用适当的缓存策略
- 减少不必要的重渲染

## 错误处理
- 添加全局错误边界
- 实现适当的错误提示
- 记录关键错误信息

## 测试
- 编写单元测试
- 进行性能测试
- 进行 SEO 测试
- 进行跨浏览器测试

## 部署
- 确保构建配置正确
- 验证所有路由正常工作
- 检查所有资源加载正常
- 验证 SEO 元数据正确 