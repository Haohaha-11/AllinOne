# 🎯 Railway配置 - 当前步骤

## 当前状态

Railway已经检测到你的项目，显示了两个服务：
- ✅ **backend** (后端服务)
- ✅ **frontend** (前端服务)

现在需要配置这两个服务。

---

## 📋 配置步骤

### 第1步：先点击 "Apply 14 changes"

1. 点击紫色按钮 **"Apply 14 changes"**
2. 或者点击 **"Deploy"** 按钮
3. Railway会开始部署这两个服务

**等待部署完成**（约2-3分钟）

---

### 第2步：配置Backend服务

#### 2.1 点击Backend卡片
点击左边的 **backend** 卡片

#### 2.2 进入Settings
点击 **Settings** 标签

#### 2.3 设置Root Directory
1. 找到 **Root Directory**
2. 输入：`backend`
3. 保存

#### 2.4 配置环境变量
1. 点击 **Variables** 标签
2. 点击 **New Variable**，添加：

```
NODE_ENV=production
```

```
PORT=5000
```

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

```
CORS_ORIGIN=*
```

#### 2.5 生成域名
1. 回到 **Settings** 标签
2. 找到 **Domains** 部分
3. 点击 **Generate Domain**
4. 复制生成的URL

**记下Backend URL**：`_________________________________`

---

### 第3步：配置Frontend服务

#### 3.1 点击Frontend卡片
点击右边的 **frontend** 卡片

#### 3.2 进入Settings
点击 **Settings** 标签

#### 3.3 设置Root Directory
1. 找到 **Root Directory**
2. 输入：`frontend`
3. 保存

#### 3.4 配置环境变量
1. 点击 **Variables** 标签
2. 点击 **New Variable**，添加：

```
VITE_API_URL=你的Backend URL
```

**注意**：使用第2步记录的Backend URL

#### 3.5 生成域名
1. 回到 **Settings** 标签
2. 找到 **Domains** 部分
3. 点击 **Generate Domain**
4. 复制生成的URL

**记下Frontend URL**：`_________________________________`

---

### 第4步：更新Backend的CORS

#### 4.1 回到Backend服务
点击 **backend** 卡片

#### 4.2 更新CORS_ORIGIN
1. 进入 **Variables** 标签
2. 找到 `CORS_ORIGIN`
3. 修改为你的Frontend URL
4. 保存

---

### 第5步：运行数据库迁移

#### 5.1 获取数据库URL
1. 在Railway项目中，应该有一个 **PostgreSQL** 服务
2. 点击PostgreSQL卡片
3. 进入 **Variables** 标签
4. 复制 `DATABASE_URL`

#### 5.2 本地运行迁移
在终端执行：

```bash
# Windows
set DATABASE_URL=你复制的数据库URL

# 进入backend目录
cd backend

# 运行迁移
npm run db:migrate
```

---

## 🎯 配置检查清单

### Backend配置
- [ ] Root Directory: `backend`
- [ ] NODE_ENV: `production`
- [ ] PORT: `5000`
- [ ] DATABASE_URL: `${{Postgres.DATABASE_URL}}`
- [ ] CORS_ORIGIN: 你的Frontend URL
- [ ] 已生成域名

### Frontend配置
- [ ] Root Directory: `frontend`
- [ ] VITE_API_URL: 你的Backend URL
- [ ] 已生成域名

### 数据库
- [ ] 已运行迁移

---

## 📝 记录信息

### Railway URLs
- **Backend URL**: _______________________
- **Frontend URL**: _______________________
- **Database URL**: _______________________

---

## ⚠️ 重要提示

### 关于Root Directory
- Backend的Root Directory必须是 `backend`
- Frontend的Root Directory必须是 `frontend`
- 这样Railway才能找到正确的 `package.json`

### 关于环境变量
- `${{Postgres.DATABASE_URL}}` 会自动引用PostgreSQL的连接字符串
- VITE_API_URL必须是完整的HTTPS URL
- CORS_ORIGIN必须是Frontend的完整URL

### 关于部署顺序
1. 先配置Backend
2. 生成Backend域名
3. 再配置Frontend（使用Backend URL）
4. 最后更新Backend的CORS

---

## 🚀 下一步

配置完成后：
1. 等待两个服务都部署成功
2. 访问Frontend URL测试应用
3. 如果有问题，查看部署日志

---

## 💡 快速提示

### 查看部署状态
- 点击服务卡片
- 进入 **Deployments** 标签
- 查看最新部署状态

### 查看日志
- 在Deployments中点击部署
- 点击 **View Logs**
- 查看详细日志

### 重新部署
- 点击服务卡片
- Deployments → 点击 "..." → Redeploy

---

**现在开始配置吧！** 🚀
