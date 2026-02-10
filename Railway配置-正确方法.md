# 🎯 Railway配置 - 正确方法

## ⚠️ 重要说明

Railway **不需要** railway.json 或 railway.toml 配置文件！

这些文件会导致Railway从根目录构建，而我们需要它分别构建 backend 和 frontend。

---

## ✅ 正确的配置方法

### Railway会自动检测到两个服务

当你连接GitHub仓库后，Railway会自动检测到：
- **backend** 服务（因为有 backend/package.json）
- **frontend** 服务（因为有 frontend/package.json）

---

## 📋 配置步骤

### 第1步：在Railway Dashboard中

你应该看到两个服务卡片：
- 📦 **backend**
- 📦 **frontend**

如果只看到一个服务，点击 **"+ New Service"** 添加另一个。

---

### 第2步：配置Backend服务

#### 2.1 点击 backend 卡片

#### 2.2 进入 Settings 标签

#### 2.3 配置 Root Directory
找到 **Root Directory** 设置：
```
backend
```
**这是最重要的设置！** 告诉Railway在 backend 目录构建。

#### 2.4 配置环境变量
进入 **Variables** 标签，添加：

```
NODE_ENV=production
PORT=5000
DATABASE_URL=${{Postgres.DATABASE_URL}}
CORS_ORIGIN=*
```

#### 2.5 生成域名
回到 **Settings** → **Domains** → **Generate Domain**

记录Backend URL：`_______________________________`

---

### 第3步：配置Frontend服务

#### 3.1 点击 frontend 卡片

#### 3.2 进入 Settings 标签

#### 3.3 配置 Root Directory
找到 **Root Directory** 设置：
```
frontend
```

#### 3.4 配置环境变量
进入 **Variables** 标签，添加：

```
VITE_API_URL=你的Backend URL
```

#### 3.5 生成域名
回到 **Settings** → **Domains** → **Generate Domain**

记录Frontend URL：`_______________________________`

---

### 第4步：更新Backend CORS

回到 **backend** 卡片 → **Variables**

修改 `CORS_ORIGIN`：
```
你的Frontend URL
```

---

### 第5步：运行数据库迁移

#### 5.1 获取数据库URL
点击 **PostgreSQL** 卡片 → **Variables** → 复制 `DATABASE_URL`

#### 5.2 本地运行迁移
```bash
set DATABASE_URL=你的数据库URL
cd backend
npm run db:migrate
```

---

## 🔍 Railway如何构建

### Backend构建过程
```
1. 进入 backend 目录
2. 检测到 package.json
3. 运行 npm ci（使用 package-lock.json）
4. 运行 npm run build
5. 启动 npm start
```

### Frontend构建过程
```
1. 进入 frontend 目录
2. 检测到 package.json
3. 运行 npm ci（使用 package-lock.json）
4. 运行 npm run build
5. 启动静态文件服务器
```

---

## ⚠️ 常见错误

### ❌ 错误1：使用 railway.json
```json
{
  "build": {
    "buildCommand": "cd backend && npm install"
  }
}
```
**问题**：Railway会从根目录执行，导致路径混乱

**解决**：删除 railway.json，使用 Root Directory 设置

### ❌ 错误2：使用 workspace 命令
```bash
npm run build --workspace=backend
```
**问题**：需要根目录有 package.json 和 workspace 配置

**解决**：删除根目录的 package.json，让Railway分别构建

### ❌ 错误3：没有设置 Root Directory
**问题**：Railway不知道在哪个目录构建

**解决**：在每个服务的 Settings 中设置 Root Directory

---

## ✅ 检查清单

### Backend服务
- [ ] Root Directory: `backend`
- [ ] NODE_ENV: `production`
- [ ] PORT: `5000`
- [ ] DATABASE_URL: `${{Postgres.DATABASE_URL}}`
- [ ] CORS_ORIGIN: Frontend URL
- [ ] 已生成域名

### Frontend服务
- [ ] Root Directory: `frontend`
- [ ] VITE_API_URL: Backend URL
- [ ] 已生成域名

### 数据库
- [ ] PostgreSQL服务已创建
- [ ] 已运行迁移

---

## 📊 部署成功的标志

### Backend日志
```
✓ Detected Node.js project
✓ Using Node.js 18.20.5
✓ Running npm ci
✓ Installing from package-lock.json
✓ Running npm run build
✓ Build successful
✓ Starting server
🚀 Server listening on port 5000
```

### Frontend日志
```
✓ Detected Node.js project
✓ Using Node.js 18.20.5
✓ Running npm ci
✓ Installing from package-lock.json
✓ Running npm run build
✓ Build successful
✓ Starting static server
```

---

## 🎯 关键点

1. **不要使用配置文件**（railway.json, railway.toml）
2. **使用 Root Directory 设置**（在Railway Dashboard中）
3. **确保 package-lock.json 存在**（backend和frontend目录）
4. **删除根目录的 package.json**（避免混淆）

---

## 📱 配置完成后

你的应用就可以：
- ✅ Backend运行在Railway
- ✅ Frontend运行在Railway
- ✅ 通过HTTPS访问
- ✅ 在手机和电脑上使用

---

**现在去Railway Dashboard配置 Root Directory！** 🚀
