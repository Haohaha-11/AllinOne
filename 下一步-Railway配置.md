# 🚀 下一步：配置Railway部署

## ✅ 已完成
- ✅ 代码已推送到GitHub
- ✅ Railway已绑定GitHub仓库

---

## 📋 Railway配置步骤

### 第1步：配置后端服务

#### 1.1 设置根目录
1. 在Railway中，点击你的后端服务
2. 进入 **Settings** 标签
3. 找到 **Root Directory**
4. 输入：`backend`
5. 点击保存

**为什么需要这个？** 因为你的后端代码在 `backend` 文件夹中。

---

#### 1.2 配置环境变量
1. 点击 **Variables** 标签
2. 点击 **New Variable**，添加以下变量：

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

**注意**：
- `DATABASE_URL` 使用 `${{Postgres.DATABASE_URL}}` 会自动引用PostgreSQL的连接字符串
- `CORS_ORIGIN` 先设置为 `*`，后面会改成Vercel的URL

3. 保存后，Railway会自动重新部署

---

#### 1.3 生成域名
1. 在 **Settings** 标签中
2. 找到 **Domains** 部分
3. 点击 **Generate Domain**
4. 复制生成的URL（例如：`https://allinone-production-xxxx.up.railway.app`）

**⚠️ 重要：记下这个URL！**

你的Railway后端URL：`_________________________________`

---

### 第2步：运行数据库迁移

#### 2.1 获取数据库连接字符串
1. 在Railway中，点击 **PostgreSQL** 服务
2. 进入 **Variables** 标签
3. 找到 `DATABASE_URL`
4. 点击复制按钮

#### 2.2 在本地运行迁移

打开终端，在项目目录执行：

```bash
# Windows
set DATABASE_URL=你复制的数据库URL

# 进入backend目录
cd backend

# 运行迁移
npm run db:migrate
```

**示例**：
```bash
set DATABASE_URL=postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway
cd backend
npm run db:migrate
```

你应该看到类似的输出：
```
Running migration: 001_initial_schema.sql
Running migration: 002_seed_data.sql
...
✓ All migrations completed successfully
```

---

### 第3步：验证后端部署

#### 3.1 检查部署状态
1. 在Railway后端服务中
2. 进入 **Deployments** 标签
3. 确认最新部署状态为 **Success**（绿色）

#### 3.2 测试后端API
在浏览器打开：
```
https://你的Railway后端URL/health
```

应该看到类似：
```json
{
  "status": "ok",
  "timestamp": "2024-02-10T..."
}
```

---

## 🎯 检查清单

完成以下配置：

- [ ] 设置Root Directory为 `backend`
- [ ] 添加环境变量：
  - [ ] NODE_ENV=production
  - [ ] PORT=5000
  - [ ] DATABASE_URL=${{Postgres.DATABASE_URL}}
  - [ ] CORS_ORIGIN=*
- [ ] 生成域名并记录URL
- [ ] 运行数据库迁移
- [ ] 验证部署成功
- [ ] 测试 /health 接口

---

## ❓ 常见问题

### Q1: 部署失败，显示"Build failed"

**检查：**
1. Root Directory是否设置为 `backend`
2. 查看部署日志（Deployments → 点击失败的部署 → View Logs）
3. 确认 `backend/package.json` 中有 `build` 和 `start` 脚本

### Q2: 数据库迁移失败

**检查：**
1. DATABASE_URL是否正确复制
2. 确认PostgreSQL服务正在运行
3. 检查网络连接

### Q3: /health 接口返回404

**检查：**
1. 后端是否部署成功
2. 域名是否正确生成
3. 查看部署日志

---

## 📝 记录信息

### Railway信息
- **项目名称**：_______________________
- **PostgreSQL URL**：_______________________
- **后端URL**：_______________________

---

## 🎉 完成后

后端部署完成！下一步：

**打开 `下一步-Vercel配置.md` 部署前端**

---

## 💡 提示

### 查看日志
如果遇到问题，查看Railway日志：
1. 点击服务
2. Deployments → 点击部署
3. View Logs

### 重新部署
如果需要重新部署：
1. 点击服务
2. Deployments
3. 点击最新部署右侧的 "..." 
4. 选择 "Redeploy"

---

**继续加油！** 🚀
