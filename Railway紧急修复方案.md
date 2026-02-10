# 🚨 Railway紧急修复方案

## 问题

Railway仍在使用Node.js 18，导致undici报错：`File is not defined`

## ✅ 立即执行的修复方案

### 方案1：在Railway中手动设置Node版本（最快）

#### Backend服务
1. 在Railway中点击 **backend** 服务
2. 进入 **Variables** 标签
3. 点击 **New Variable**
4. 添加：
   ```
   Name: NODE_VERSION
   Value: 20.18.1
   ```
5. 保存

#### Frontend服务
1. 在Railway中点击 **frontend** 服务
2. 进入 **Variables** 标签
3. 点击 **New Variable**
4. 添加：
   ```
   Name: NODE_VERSION
   Value: 20.18.1
   ```
5. 保存

### 方案2：降级依赖包（备选）

如果方案1不行，降级axios和cheerio到兼容Node 18的版本。

---

## 🎯 执行步骤

### 立即操作

1. **打开Railway项目**
2. **Backend服务**：
   - Variables → New Variable
   - `NODE_VERSION` = `20.18.1`
   - 保存
3. **Frontend服务**：
   - Variables → New Variable
   - `NODE_VERSION` = `20.18.1`
   - 保存
4. **等待自动重新部署**（2-3分钟）

---

## 📋 验证

部署成功后，日志应该显示：
```
Using Node.js 20.18.1
```

而不是：
```
Node.js v18.20.5
```

---

## 💡 为什么.node-version没生效？

Railway的构建系统可能：
1. 优先使用环境变量 `NODE_VERSION`
2. 缓存了旧的Node版本
3. nixpacks配置被覆盖

直接在Variables中设置是最可靠的方法。

---

## 🚀 下一步

设置完成后：
1. 等待Railway自动重新部署
2. 查看部署日志确认Node版本
3. 验证服务正常运行

---

**现在立即在Railway中添加NODE_VERSION环境变量！** 🚨
