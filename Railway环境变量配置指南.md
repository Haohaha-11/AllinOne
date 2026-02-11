# 🔧 Railway 环境变量配置指南

## 📍 在哪里配置环境变量

### 第1步：打开 Railway Dashboard

1. 访问：https://railway.app/
2. 登录你的账号
3. 找到你的项目（AllinOne）

---

### 第2步：进入 Backend 服务

1. 在项目页面，你会看到几个卡片（服务）
2. 找到 **backend** 卡片（可能显示为 "backend" 或你的服务名）
3. **点击这个卡片**

---

### 第3步：打开 Variables 标签

1. 在 backend 服务页面，顶部有几个标签：
   - Deployments
   - **Variables** ← 点击这个
   - Metrics
   - Settings
   - 等等

2. **点击 "Variables" 标签**

---

## ✅ 需要添加的环境变量

在 Variables 页面，你需要添加 **4 个环境变量**：

### 变量 1：NODE_ENV

```
Name:  NODE_ENV
Value: production
```

**作用**：告诉应用这是生产环境

---

### 变量 2：PORT

```
Name:  PORT
Value: 5000
```

**作用**：指定服务器运行的端口

---

### 变量 3：DATABASE_URL（最重要！）

```
Name:  DATABASE_URL
Value: ${{Postgres.DATABASE_URL}}
```

**重要**：
- Value 必须**完全一样**输入：`${{Postgres.DATABASE_URL}}`
- 这个特殊语法会自动引用 PostgreSQL 数据库的连接字符串
- **不要**输入实际的数据库 URL，就输入这个特殊值

**作用**：连接到 Railway 的 PostgreSQL 数据库

---

### 变量 4：CORS_ORIGIN

```
Name:  CORS_ORIGIN
Value: *
```

**作用**：允许所有来源访问 API（稍后会改成 Frontend URL）

---

## 📝 如何添加环境变量

### 方法：逐个添加

1. **在 Variables 页面**
2. **找到 "New Variable" 或 "Add Variable" 按钮**
3. **点击按钮**
4. **会出现两个输入框**：
   - **Name**（变量名）
   - **Value**（变量值）
5. **输入变量名和值**（参考上面的 4 个变量）
6. **点击 "Add" 或 "Save"**
7. **重复步骤 3-6**，添加所有 4 个变量

---

## 🔍 如何确认已添加

添加完成后，在 Variables 页面应该看到：

```
NODE_ENV          = production
PORT              = 5000
DATABASE_URL      = ${{Postgres.DATABASE_URL}}
CORS_ORIGIN       = *
```

---

## ⚠️ 常见问题

### Q1: 找不到 Variables 标签？

**可能的位置**：
- 顶部导航栏
- 左侧菜单
- Settings 里面

**如果还是找不到**：
- 确认你点击的是 backend 服务卡片
- 不是项目主页

---

### Q2: DATABASE_URL 应该输入什么？

**正确答案**：
```
${{Postgres.DATABASE_URL}}
```

**不要**：
- ❌ 输入实际的数据库 URL
- ❌ 从 Postgres 服务复制 URL
- ❌ 修改这个特殊语法

**为什么**：
- 这个特殊语法会自动引用 PostgreSQL 服务
- Railway 会自动替换成实际的数据库 URL
- 如果数据库 URL 改变，会自动更新

---

### Q3: 没有 PostgreSQL 服务怎么办？

**添加 PostgreSQL**：

1. 在项目主页
2. 点击 **"+ New"** 或 **"Add Service"**
3. 选择 **"Database"**
4. 选择 **"PostgreSQL"**
5. 点击 **"Add PostgreSQL"**
6. 等待创建完成

---

### Q4: 添加变量后会发生什么？

**自动重新部署**：
- Railway 会检测到环境变量变化
- 自动触发重新部署
- 等待 1-2 分钟
- 新的部署会使用这些环境变量

---

## 📊 添加后的预期结果

### 在 Deployments 标签查看日志

**成功标志**：
```
✓ PostgreSQL connection successful
✓ Redis connection successful (or skipped)
🚀 Server running on port 5000
```

**不应该看到**：
```
❌ connect ECONNREFUSED ::1:5432
❌ Database connection required
```

---

## 🎯 完整流程图

```
1. 打开 Railway Dashboard
   ↓
2. 点击 backend 服务卡片
   ↓
3. 点击 Variables 标签
   ↓
4. 点击 "New Variable"
   ↓
5. 添加 NODE_ENV = production
   ↓
6. 点击 "New Variable"
   ↓
7. 添加 PORT = 5000
   ↓
8. 点击 "New Variable"
   ↓
9. 添加 DATABASE_URL = ${{Postgres.DATABASE_URL}}
   ↓
10. 点击 "New Variable"
   ↓
11. 添加 CORS_ORIGIN = *
   ↓
12. 等待自动重新部署
   ↓
13. 检查 Deployments 日志
   ↓
14. ✅ 部署成功！
```

---

## 📱 截图说明（文字版）

### Variables 页面应该长这样：

```
┌─────────────────────────────────────────┐
│ Variables                               │
├─────────────────────────────────────────┤
│                                         │
│ [New Variable] 按钮                     │
│                                         │
│ NODE_ENV                                │
│ production                              │
│ [Edit] [Delete]                         │
│                                         │
│ PORT                                    │
│ 5000                                    │
│ [Edit] [Delete]                         │
│                                         │
│ DATABASE_URL                            │
│ ${{Postgres.DATABASE_URL}}              │
│ [Edit] [Delete]                         │
│                                         │
│ CORS_ORIGIN                             │
│ *                                       │
│ [Edit] [Delete]                         │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🚀 下一步

添加完环境变量后：

1. ✅ 等待重新部署（1-2 分钟）
2. ✅ 检查部署日志（应该成功）
3. ✅ 生成 Backend 域名
4. ✅ 部署 Frontend 到 Vercel
5. ✅ 更新 CORS_ORIGIN
6. ✅ 运行数据库迁移
7. ✅ 测试应用

---

**现在去 Railway 添加这 4 个环境变量吧！** 🔧

记住最重要的是：`DATABASE_URL = ${{Postgres.DATABASE_URL}}`
