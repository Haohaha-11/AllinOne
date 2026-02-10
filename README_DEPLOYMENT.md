# 全渠道内容收藏助手 - 部署版本

一个支持多平台内容收藏的Web应用，现在可以部署到互联网供手机访问！

## 🌟 功能特性

- ✅ 支持5大平台：微信、知乎、小红书、抖音、B站
- ✅ 智能提取标题、描述、封面图
- ✅ 文件夹分类管理
- ✅ 标签系统
- ✅ 全文搜索
- ✅ 优先级标记
- ✅ 已读/未读状态
- ✅ Markdown笔记
- ✅ 响应式设计（支持手机）

## 🚀 快速部署

### 方案1：免费部署到互联网（推荐）

使用 Vercel + Railway，完全免费开始：

1. **准备GitHub仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **部署后端到Railway**
   - 访问 https://railway.app
   - 创建PostgreSQL数据库
   - 部署GitHub仓库
   - 配置环境变量

3. **部署前端到Vercel**
   - 访问 https://vercel.com
   - 导入GitHub仓库
   - 配置环境变量
   - 一键部署

**详细步骤：** 查看 `QUICK_DEPLOY.md`

### 方案2：本地运行

```bash
# 启动数据库
docker-compose up -d

# 启动后端
cd backend
npm install
npm run dev

# 启动前端
cd frontend
npm install
npm run dev
```

访问：http://localhost:3000

## 📱 在手机上使用

### 部署后
1. 在手机浏览器打开你的Vercel URL
2. 正常使用所有功能
3. 可以添加到主屏幕（像原生应用）

### 本地开发
1. 确保手机和电脑在同一WiFi
2. 在手机浏览器打开：`http://你的电脑IP:3000`

## 📂 项目结构

```
.
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── config/         # 配置文件
│   │   ├── db/             # 数据库迁移
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # API路由
│   │   └── services/       # 业务逻辑
│   └── package.json
│
├── frontend/                # 前端应用
│   ├── src/
│   │   ├── components/     # React组件
│   │   ├── config.ts       # API配置
│   │   └── App.tsx         # 主应用
│   ├── .env.production     # 生产环境变量
│   └── package.json
│
├── docker-compose.yml       # Docker配置
├── vercel.json             # Vercel配置
├── railway.json            # Railway配置
│
└── 文档/
    ├── QUICK_DEPLOY.md           # 快速部署指南
    ├── DEPLOYMENT_GUIDE.md       # 详细部署指南
    ├── DEPLOYMENT_CHECKLIST.md   # 部署检查清单
    └── MOBILE_APP_OPTIONS.md     # 移动端方案对比
```

## 🔧 技术栈

### 前端
- React + TypeScript
- Vite
- CSS3 (响应式设计)

### 后端
- Node.js + Express
- TypeScript
- PostgreSQL
- Redis (可选)

### 部署
- Vercel (前端)
- Railway (后端 + 数据库)
- Docker (本地开发)

## 📖 文档

### 部署相关
- [快速部署指南](QUICK_DEPLOY.md) - 5分钟部署到互联网
- [详细部署指南](DEPLOYMENT_GUIDE.md) - 完整部署文档
- [部署检查清单](DEPLOYMENT_CHECKLIST.md) - 逐步检查清单
- [移动端方案](MOBILE_APP_OPTIONS.md) - 移动端选项对比

### 功能相关
- [完整实现指南](COMPLETE_IMPLEMENTATION_GUIDE.md)
- [状态和笔记功能](STATUS_AND_NOTES_IMPLEMENTATION.md)
- [标签管理](TAG_MANAGEMENT_AND_COVER_IMAGES.md)
- [搜索优化](SEARCH_PERFORMANCE_OPTIMIZATION.md)
- [图片显示修复](IMAGE_DISPLAY_FIX.md)

## 🌐 环境变量

### 前端 (frontend/.env.production)
```env
VITE_API_URL=https://your-backend-url.up.railway.app
```

### 后端 (Railway环境变量)
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=${{Postgres.DATABASE_URL}}
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

## 💰 成本

### 免费方案
- Vercel: 免费（个人项目）
- Railway: $5免费额度/月
- **总计：免费开始使用**

### 付费方案（如果需要）
- Railway Hobby: $5/月
- 或使用其他云服务商

## 🔒 安全性

- ✅ HTTPS自动配置
- ✅ CORS保护
- ✅ 环境变量隔离
- ✅ SQL注入防护
- ⚠️ 当前使用测试用户ID（生产环境需要添加认证）

## 🚧 待实现功能

- [ ] 用户认证系统
- [ ] 多用户支持
- [ ] 图片代理（解决CORS）
- [ ] PWA支持（离线访问）
- [ ] 推送通知
- [ ] 数据导出/导入

## 📝 更新日志

### v1.0.0 (2024-02-10)
- ✅ 基础功能完成
- ✅ 支持5大平台
- ✅ 文件夹和标签管理
- ✅ 搜索功能
- ✅ 状态和笔记功能
- ✅ 响应式设计
- ✅ 部署配置完成

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

感谢所有开源项目的贡献者！

---

## 快速开始

### 本地开发
```bash
# 1. 克隆仓库
git clone https://github.com/你的用户名/content-collector.git
cd content-collector

# 2. 启动数据库
docker-compose up -d

# 3. 启动后端
cd backend
npm install
npm run db:migrate
npm run dev

# 4. 启动前端
cd ../frontend
npm install
npm run dev
```

### 部署到互联网
```bash
# 1. 推送到GitHub
git push origin main

# 2. 在Railway部署后端
# 访问 https://railway.app

# 3. 在Vercel部署前端
# 访问 https://vercel.com
```

**详细步骤：** 查看 [QUICK_DEPLOY.md](QUICK_DEPLOY.md)

---

## 需要帮助？

- 📖 查看文档目录
- 🐛 提交Issue
- 💬 讨论区交流

**祝使用愉快！** 🎉
