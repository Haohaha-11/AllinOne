# 📖 Railway Root Directory 设置指南

## 🎯 目标

让 Railway 知道在哪个目录构建你的服务。

---

## 📍 在哪里设置

### Backend 服务

1. **打开 Railway Dashboard**
   - 访问：https://railway.app/
   - 找到你的项目

2. **点击 backend 服务卡片**
   - 应该在左边或中间

3. **点击 "Settings" 标签**
   - 在顶部导航栏

4. **向下滚动找到 "Root Directory"**
   - 在 "Service Settings" 或 "Build Settings" 部分
   - 可能显示为 "Root Directory" 或 "Source Directory"

5. **输入目录名**
   ```
   backend
   ```

6. **保存**
   - 按回车或点击保存按钮
   - Railway 会自动触发重新部署

---

### Frontend 服务

重复上面的步骤，但输入：
```
frontend
```

---

## 🔍 Root Directory 设置的样子

### 在 Settings 页面中

```
┌─────────────────────────────────────┐
│ Service Settings                    │
├─────────────────────────────────────┤
│                                     │
│ Service Name                        │
│ [backend                        ]   │
│                                     │
│ Root Directory                      │
│ [backend                        ]   │← 在这里输入
│                                     │
│ Build Command (optional)            │
│ [                               ]   │
│                                     │
│ Start Command (optional)            │
│ [                               ]   │
│                                     │
└─────────────────────────────────────┘
```

---

## ⚙️ 其他可选设置

### Build Command（可选）
通常不需要设置，Railway 会自动运行：
```bash
npm ci && npm run build
```

### Start Command（可选）
通常不需要设置，Railway 会自动运行：
```bash
npm start
```

---

## 🚨 常见问题

### Q1: 找不到 Root Directory 设置？

**可能的位置**：
- Settings → Service Settings → Root Directory
- Settings → Build Settings → Root Directory
- Settings → Source → Root Directory

**如果还是找不到**：
- 检查 Railway 版本（可能界面更新了）
- 尝试在 Settings 页面搜索 "root" 或 "directory"
- 查看 Railway 官方文档

---

### Q2: 设置后还是失败？

**检查**：
1. Root Directory 拼写是否正确（`backend` 不是 `Backend`）
2. 是否保存了设置
3. 是否触发了重新部署

**解决**：
1. 删除服务重新创建
2. 或者联系 Railway 支持

---

### Q3: 需要设置 Build Command 吗？

**不需要！** Railway 会自动检测：
1. 发现 `package.json`
2. 运行 `npm ci`（如果有 package-lock.json）
3. 运行 `npm run build`（如果有 build script）
4. 运行 `npm start`（如果有 start script）

---

### Q4: 两个服务都要设置吗？

**是的！** 每个服务都需要设置：
- Backend 服务 → Root Directory: `backend`
- Frontend 服务 → Root Directory: `frontend`

---

## ✅ 设置成功的标志

### 在部署日志中

#### Backend
```
Cloning repository...
✓ Repository cloned
Entering directory: /app/backend  ← 看到这个说明成功
✓ Detected package.json
✓ Running npm ci
...
```

#### Frontend
```
Cloning repository...
✓ Repository cloned
Entering directory: /app/frontend  ← 看到这个说明成功
✓ Detected package.json
✓ Running npm ci
...
```

---

## 🎯 设置完整流程

### Backend 服务

1. ✅ 点击 backend 卡片
2. ✅ Settings 标签
3. ✅ Root Directory: `backend`
4. ✅ 保存
5. ✅ 等待重新部署
6. ✅ 检查日志确认成功

### Frontend 服务

1. ✅ 点击 frontend 卡片
2. ✅ Settings 标签
3. ✅ Root Directory: `frontend`
4. ✅ 保存
5. ✅ 等待重新部署
6. ✅ 检查日志确认成功

---

## 📊 设置前后对比

### 设置前
```
Railway 工作目录: /app
执行命令: npm run build --workspace=backend
结果: ❌ 找不到 workspace 配置
```

### 设置后
```
Railway 工作目录: /app/backend
执行命令: npm ci && npm run build
结果: ✅ 构建成功
```

---

## 🔗 相关文档

- Railway 官方文档：https://docs.railway.app/
- Monorepo 支持：https://docs.railway.app/deploy/monorepo

---

## 💡 提示

### 如果 Railway 界面找不到 Root Directory

可以尝试使用 Railway CLI：

```bash
# 安装 Railway CLI
npm install -g @railway/cli

# 登录
railway login

# 链接项目
railway link

# 设置 Root Directory
railway service backend
railway variables set ROOT_DIRECTORY=backend

railway service frontend
railway variables set ROOT_DIRECTORY=frontend
```

---

## 🎉 设置完成后

你的服务就可以正确构建了！

接下来：
1. ✅ 添加环境变量
2. ✅ 生成域名
3. ✅ 运行数据库迁移
4. ✅ 测试应用

---

**现在去设置 Root Directory 吧！** 🚀
