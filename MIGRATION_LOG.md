# 前后端分离迁移日志

## 2024-04-01 前后端代码分离操作记录

### 移动的文件
以下文件已从 `src/` 目录移动到 `temp_backend_backup/src/`:

1. 后端控制器
   - `src/controllers/` -> `temp_backend_backup/src/controllers/`

2. 中间件
   - `src/middleware/` -> `temp_backend_backup/src/middleware/`

3. 数据模型
   - `src/models/` -> `temp_backend_backup/src/models/`

4. 后端入口文件
   - `src/app.ts` -> `temp_backend_backup/src/app.ts`
   - `src/index.ts` -> `temp_backend_backup/src/index.ts`

### 保留的前端文件结构
```
src/
├── components/     # React组件
├── pages/         # 页面组件
├── routes/        # 路由配置
├── utils/         # 工具函数
├── services/      # API服务
├── i18n/          # 国际化配置
├── App.jsx        # 主应用组件
└── main.jsx       # 应用入口
```

### 注意事项
1. 所有移动的文件都已备份到 `temp_backend_backup` 目录
2. 前端代码结构保持不变
3. 前端路由和组件功能不受影响
4. 后端代码可以随时从备份目录恢复

### 后续计划
1. 将后端代码迁移到独立的仓库
2. 配置后端服务的独立部署
3. 更新前端 API 调用以适应新的后端服务地址

### 回滚方案
如需回滚，执行以下命令：
```bash
mv temp_backend_backup/src/* src/
``` 