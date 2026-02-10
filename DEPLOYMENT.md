# 部署指南

## 🌐 让应用可以在手机和其他设备上访问

目前应用只能在本地访问，这里提供几种部署方案。

---

## 方案1: 局域网访问（免费，最简单）

### 适用场景
- 在家里或办公室内使用
- 你和朋友在同一个 WiFi 网络下
- 不需要从外网访问

### 步骤

#### 1. 修改前端配置

编辑 `frontend/vite.config.ts`：

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // 允许外部访问
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

#### 2. 修改后端配置

编辑 `backend/src/index.ts`，找到 `app.listen` 部分：

```typescript
app.listen(PORT, '0.0.0.0', () => {  // 添加 '0.0.0.0'
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
```

#### 3. 获取你的本地IP地址

**Windows:**
```bash
ipconfig
# 找到 "IPv4 地址"，例如: 192.168.1.100
```

**Mac/Linux:**
```bash
ifconfig
# 或
ip addr show
```

#### 4. 启动应用

```bash
npm run dev
```

#### 5. 在手机上访问

在手机浏览器中输入：
```
http://你的IP地址:3000
```

例如：`http://192.168.1.100:3000`

### 注意事项
- 确保电脑和手机在同一个 WiFi 网络
- 关闭防火墙或允许端口 3000 和 5000
- 电脑需要保持开机状态

---

## 方案2: 内网穿透（免费，可从外网访问）

### 适用场景
- 想从任何地方访问
- 不想购买服务器
- 临时分享给朋友

### 使用 ngrok

#### 1. 安装 ngrok

访问：https://ngrok.com/
注册并下载 ngrok

#### 2. 启动应用

```bash
npm run dev
```

#### 3. 启动 ngrok

```bash
# 为前端创建隧道
ngrok http 3000

# 在另一个终端为后端创建隧道
ngrok http 5000
```

#### 4. 获取公网地址

ngrok 会给你一个公网地址，例如：
- 前端: `https://abc123.ngrok.io`
- 后端: `https://def456.ngrok.io`

#### 5. 更新前端配置

修改 `frontend/vite.config.ts` 中的 proxy target 为后端的 ngrok 地址。

### 优点
- ✅ 免费
- ✅ 可以从任何地方访问
- ✅ 支持 HTTPS

### 缺点
- ⚠️ 每次重启 URL 会变化（免费版）
- ⚠️ 需要保持电脑开机
- ⚠️ 速度取决于你的网络

---

## 方案3: 云服务器部署（推荐，专业方案）

### 适用场景
- 想要稳定的服务
- 多人长期使用
- 不想保持电脑开机

### 推荐的云服务商

#### 国内
- **阿里云** - https://www.aliyun.com/
- **腾讯云** - https://cloud.tencent.com/
- **华为云** - https://www.huaweicloud.com/

#### 国外
- **Vercel** (前端) - https://vercel.com/ (免费)
- **Railway** (全栈) - https://railway.app/ (免费额度)
- **Render** (全栈) - https://render.com/ (免费)
- **DigitalOcean** - https://www.digitalocean.com/ ($5/月)

### 使用 Railway 部署（推荐，最简单）

#### 1. 注册 Railway

访问：https://railway.app/
使用 GitHub 账号登录

#### 2. 创建新项目

点击 "New Project" → "Deploy from GitHub repo"

#### 3. 连接 GitHub

将你的代码推送到 GitHub，然后在 Railway 中选择该仓库

#### 4. 添加服务

Railway 会自动检测到你的 `docker-compose.yml`，并创建：
- PostgreSQL 数据库
- Redis 缓存
- 后端服务
- 前端服务

#### 5. 配置环境变量

在 Railway 中设置环境变量（会自动从 docker-compose.yml 读取）

#### 6. 部署

点击 "Deploy"，等待几分钟

#### 7. 获取公网地址

Railway 会给你一个公网地址，例如：
```
https://your-app.railway.app
```

### 费用
- 免费额度：$5/月
- 足够个人使用
- 超出后按使用量计费

---

## 方案4: Vercel + Supabase（免费，适合小项目）

### 前端部署到 Vercel

#### 1. 注册 Vercel

访问：https://vercel.com/
使用 GitHub 登录

#### 2. 导入项目

点击 "New Project" → 选择你的 GitHub 仓库

#### 3. 配置构建

- Framework Preset: Vite
- Root Directory: frontend
- Build Command: `npm run build`
- Output Directory: `dist`

#### 4. 部署

点击 "Deploy"，几分钟后就能访问

### 后端部署到 Render

#### 1. 注册 Render

访问：https://render.com/

#### 2. 创建 Web Service

选择你的 GitHub 仓库

#### 3. 配置

- Environment: Node
- Build Command: `cd backend && npm install && npm run build`
- Start Command: `cd backend && npm start`

#### 4. 添加数据库

在 Render 中创建 PostgreSQL 数据库（免费）

#### 5. 配置环境变量

设置 `DATABASE_URL` 等环境变量

---

## 📱 移动端优化

### 响应式设计

当前应用已经支持响应式设计，但可以进一步优化：

#### 1. 添加 viewport meta 标签

编辑 `frontend/index.html`：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

#### 2. 添加 PWA 支持

让应用可以"安装"到手机主屏幕：

创建 `frontend/public/manifest.json`：

```json
{
  "name": "全渠道内容收藏助手",
  "short_name": "收藏助手",
  "description": "跨平台内容收藏工具",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1890ff",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

在 `frontend/index.html` 中引用：

```html
<link rel="manifest" href="/manifest.json">
```

#### 3. 添加 Service Worker

实现离线支持和更快的加载速度。

---

## 🔒 安全建议

### 部署到公网时必须做的事

1. **添加用户认证**
   - 实现登录/注册功能
   - 使用 JWT token
   - 每个用户只能看到自己的数据

2. **使用 HTTPS**
   - 所有云服务商都提供免费 SSL 证书
   - 保护用户数据传输安全

3. **设置环境变量**
   - 不要在代码中硬编码密码
   - 使用 `.env` 文件
   - 在云平台中设置环境变量

4. **限制请求频率**
   - 防止恶意攻击
   - 使用 rate limiting 中间件

5. **数据库备份**
   - 定期备份数据
   - 云服务商通常提供自动备份

---

## 💰 成本估算

### 免费方案
- **Vercel (前端)**: 免费
- **Render (后端)**: 免费（有限制）
- **Railway**: $5/月免费额度
- **总成本**: $0 - $5/月

### 付费方案
- **阿里云/腾讯云**: ¥50-100/月
- **DigitalOcean**: $5-10/月
- **Railway**: $5-20/月

### 推荐配置
- 个人使用：免费方案足够
- 小团队（<10人）：Railway $5/月
- 公开服务：阿里云/腾讯云 ¥100/月

---

## 🚀 快速部署步骤（Railway）

```bash
# 1. 安装 Railway CLI
npm install -g @railway/cli

# 2. 登录
railway login

# 3. 初始化项目
railway init

# 4. 部署
railway up

# 5. 添加数据库
railway add postgresql
railway add redis

# 6. 运行迁移
railway run npm run db:migrate

# 完成！获取你的公网地址
railway open
```

---

## 📞 需要帮助？

选择一个方案后，我可以帮你：
1. 修改配置文件
2. 创建部署脚本
3. 解决部署问题

告诉我你想用哪个方案！
