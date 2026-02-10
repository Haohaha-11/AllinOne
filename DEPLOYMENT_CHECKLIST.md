# 部署检查清单

## ✅ 准备工作

### 文件已创建
- [x] `frontend/.env.production` - 生产环境变量
- [x] `frontend/src/config.ts` - API配置文件
- [x] `vercel.json` - Vercel配置
- [x] `railway.json` - Railway配置
- [x] `.gitignore` - Git忽略文件
- [x] `DEPLOYMENT_GUIDE.md` - 详细部署指南
- [x] `QUICK_DEPLOY.md` - 快速部署指南

### 代码已更新
- [x] 前端使用 `API_URL` 配置
- [x] 所有API调用已更新
- [x] 后端CORS配置支持环境变量

---

## 📋 部署步骤

### 第1步：上传代码到GitHub
```bash
# 检查Git状态
git status

# 添加所有文件
git add .

# 提交
git commit -m "Ready for deployment"

# 推送到GitHub
git push origin main
```

**状态：** ⬜ 未完成

---

### 第2步：部署到Railway

#### 2.1 创建PostgreSQL数据库
1. 访问 https://railway.app
2. 登录GitHub账号
3. 创建新项目
4. 选择 "Provision PostgreSQL"

**状态：** ⬜ 未完成

#### 2.2 部署后端服务
1. 在同一项目中添加GitHub仓库
2. 配置根目录为 `backend`
3. 添加环境变量：
   - `NODE_ENV=production`
   - `PORT=5000`
   - `DATABASE_URL=${{Postgres.DATABASE_URL}}`
   - `CORS_ORIGIN=*` (临时设置)

**状态：** ⬜ 未完成

#### 2.3 运行数据库迁移
```bash
# 从Railway复制DATABASE_URL
set DATABASE_URL=postgresql://...

# 运行迁移
cd backend
npm run db:migrate
```

**状态：** ⬜ 未完成

#### 2.4 获取后端URL
- 在Railway生成域名
- 复制URL（例如：`https://xxx.up.railway.app`）
- **记录URL：** ___________________________

**状态：** ⬜ 未完成

---

### 第3步：部署到Vercel

#### 3.1 导入项目
1. 访问 https://vercel.com
2. 登录GitHub账号
3. 导入 `content-collector` 仓库

**状态：** ⬜ 未完成

#### 3.2 配置项目
- Framework: Vite
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

**状态：** ⬜ 未完成

#### 3.3 添加环境变量
- Name: `VITE_API_URL`
- Value: `你的Railway后端URL`

**状态：** ⬜ 未完成

#### 3.4 部署
点击 "Deploy" 并等待完成

**状态：** ⬜ 未完成

#### 3.5 获取前端URL
- 复制Vercel URL（例如：`https://xxx.vercel.app`）
- **记录URL：** ___________________________

**状态：** ⬜ 未完成

---

### 第4步：更新CORS配置

1. 回到Railway后端服务
2. 更新 `CORS_ORIGIN` 为Vercel URL
3. 保存并重新部署

**状态：** ⬜ 未完成

---

### 第5步：测试应用

#### 5.1 功能测试
- [ ] 打开Vercel URL
- [ ] 粘贴链接测试
- [ ] 创建文件夹
- [ ] 添加标签
- [ ] 搜索功能
- [ ] 优先级设置
- [ ] 已读/未读状态
- [ ] 笔记功能

**状态：** ⬜ 未完成

#### 5.2 手机测试
- [ ] 在手机浏览器打开
- [ ] 测试所有功能
- [ ] 添加到主屏幕

**状态：** ⬜ 未完成

---

## 🔧 故障排除

### 问题1：前端显示空白
**检查：**
- [ ] 浏览器控制台是否有错误
- [ ] Vercel环境变量是否正确
- [ ] 后端是否正常运行

### 问题2：无法连接后端
**检查：**
- [ ] Railway后端是否运行
- [ ] CORS配置是否正确
- [ ] API_URL是否正确

### 问题3：数据库错误
**检查：**
- [ ] 数据库迁移是否运行
- [ ] DATABASE_URL是否正确
- [ ] Railway数据库是否运行

---

## 📝 部署信息记录

### Railway
- **项目名称：** ___________________________
- **数据库URL：** ___________________________
- **后端URL：** ___________________________

### Vercel
- **项目名称：** ___________________________
- **前端URL：** ___________________________

### 环境变量
- **VITE_API_URL：** ___________________________
- **CORS_ORIGIN：** ___________________________
- **DATABASE_URL：** ___________________________

---

## ✨ 完成后

### 分享应用
你的应用URL：`https://___________________________`

### 自动部署
以后更新只需：
```bash
git add .
git commit -m "更新内容"
git push
```

### 监控
- Railway日志：https://railway.app
- Vercel日志：https://vercel.com

---

## 💰 成本

### 当前配置
- Vercel: 免费
- Railway: $5免费额度/月
- 总计：免费开始

### 如果超出
- Railway Hobby: $5/月
- 或迁移到其他平台

---

## 📚 相关文档

- `DEPLOYMENT_GUIDE.md` - 详细部署指南
- `QUICK_DEPLOY.md` - 快速部署步骤
- `MOBILE_APP_OPTIONS.md` - 移动端方案对比

---

## ✅ 部署完成

恭喜！你的应用现在已经在互联网上了！

**下一步：**
1. 在手机上测试
2. 分享给朋友
3. 开始使用

**需要帮助？**
查看故障排除部分或相关文档
