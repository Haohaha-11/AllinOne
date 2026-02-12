# 快速部署指南

## 5分钟快速部署到互联网

### 步骤1：准备GitHub仓库（2分钟）

```bash
# 1. 初始化Git（如果还没有）
git init

# 2. 添加所有文件
git add .

# 3. 提交
git commit -m "Ready for deployment"

# 4. 连接到你的GitHub仓库
git remote add origin https://github.com/Haohaha-11/AllinOne.git
git branch -M main

# 5. 推送代码
git push -u origin main
```

---

### 步骤2：部署后端到Railway（2分钟）

#### 2.1 创建Railway账号
1. 访问 https://railway.app
2. 点击 "Login" → "Login with GitHub"
3. 授权Railway访问GitHub

#### 2.2 创建数据库
1. 点击 "New Project"
2. 选择 "Provision PostgreSQL"
3. 等待创建完成（约30秒）

#### 2.3 部署后端
1. 在同一项目中，点击 "New" → "GitHub Repo"
2. 选择你的仓库 `Haohaha-11/AllinOne`
3. Railway会自动检测并开始部署

#### 2.4 配置环境变量
1. 点击后端服务
2. 进入 "Variables" 标签
3. 添加以下变量：
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   CORS_ORIGIN=*
   ```
4. 点击 "Deploy" 重新部署

#### 2.5 配置根目录
1. 进入 "Settings" 标签
2. 找到 "Root Directory"
3. 设置为：`backend`
4. 保存

#### 2.6 获取后端URL
1. 进入 "Settings" 标签
2. 点击 "Generate Domain"
3. 复制生成的URL（例如：`https://xxx.up.railway.app`）
4. **保存这个URL，下一步需要用**

#### 2.7 运行数据库迁移
在本地终端执行：
```bash
# 设置Railway数据库URL（从Railway复制）
set DATABASE_URL=postgresql://postgres:xxx@xxx.railway.app:5432/railway

# 运行迁移
cd backend
npm run db:migrate
```

---

### 步骤3：部署前端到Vercel（1分钟）

#### 3.1 创建Vercel账号
1. 访问 https://vercel.com
2. 点击 "Sign Up" → "Continue with GitHub"
3. 授权Vercel访问GitHub

#### 3.2 导入项目
1. 点击 "Add New..." → "Project"
2. 找到并选择 `Haohaha-11/AllinOne` 仓库
3. 点击 "Import"

#### 3.3 配置项目
1. **Framework Preset**: 选择 "Vite"
2. **Root Directory**: 点击 "Edit"，输入 `frontend`
3. **Environment Variables**: 添加一个变量
   - Name: `VITE_API_URL`
   - Value: `你的Railway后端URL`（步骤2.6复制的）
4. 点击 "Deploy"

#### 3.4 等待部署完成
- 大约1-2分钟
- 完成后会显示 "Congratulations!"
- 点击 "Visit" 或复制URL

---

### 步骤4：更新CORS配置

#### 4.1 获取Vercel URL
复制你的Vercel应用URL（例如：`https://content-collector.vercel.app`）

#### 4.2 更新Railway CORS
1. 回到Railway后端服务
2. 进入 "Variables"
3. 修改 `CORS_ORIGIN` 为你的Vercel URL：
   ```
   CORS_ORIGIN=https://content-collector.vercel.app
   ```
4. 保存后自动重新部署

---

### 步骤5：测试应用

#### 5.1 在电脑上测试
1. 打开你的Vercel URL
2. 测试粘贴链接功能
3. 测试创建文件夹
4. 测试搜索功能

#### 5.2 在手机上测试
1. 在手机浏览器打开同样的URL
2. 测试所有功能
3. 可以添加到主屏幕方便访问

---

## 完成！🎉

你的应用现在已经在互联网上了！

**你的应用地址：**
- 前端：`https://你的项目名.vercel.app`
- 后端：`https://你的项目名.up.railway.app`

**分享给朋友：**
直接发送Vercel URL即可

---

## 后续更新

### 自动部署
以后只需要：
```bash
git add .
git commit -m "更新内容"
git push
```

Vercel和Railway会自动检测并部署新版本！

---

## 常见问题

### Q: 部署后打开是空白页面
**A:** 检查浏览器控制台（F12），看是否有API连接错误

### Q: 无法连接后端
**A:** 
1. 检查Railway后端是否正常运行
2. 检查Vercel环境变量 `VITE_API_URL` 是否正确
3. 检查Railway的 `CORS_ORIGIN` 是否设置为Vercel URL

### Q: 数据库连接失败
**A:**
1. 确认已运行数据库迁移
2. 检查Railway数据库是否正常运行
3. 查看Railway后端日志

### Q: Railway显示"Out of credits"
**A:**
- Railway免费提供$5额度
- 如果用完，需要添加支付方式
- 或等待下月重置

---

## 成本

### 免费方案
- ✅ Vercel: 完全免费（个人项目）
- ✅ Railway: $5免费额度/月
- ✅ 总计：免费开始使用

### 如果需要更多资源
- Railway Hobby Plan: $5/月
- 或使用其他云服务商

---

## 需要帮助？

如果遇到问题：
1. 查看Railway和Vercel的部署日志
2. 检查浏览器控制台错误
3. 参考 `DEPLOYMENT_GUIDE.md` 详细文档
