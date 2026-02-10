# 部署指南 - 将应用发布到互联网

## 部署方案对比

### 方案1：Vercel + Railway (推荐，最简单)
**成本：** 免费（有限额）
**难度：** ⭐ 简单
**时间：** 30分钟
**优点：**
- ✅ 完全免费开始
- ✅ 自动HTTPS
- ✅ 全球CDN加速
- ✅ 自动部署（推送代码即部署）
- ✅ 无需服务器管理

**部署方式：**
- Frontend → Vercel (免费)
- Backend + Database → Railway (免费额度 $5/月)

---

### 方案2：云服务器 (阿里云/腾讯云)
**成本：** ¥50-100/月
**难度：** ⭐⭐⭐ 中等
**时间：** 2-3小时
**优点：**
- ✅ 完全控制
- ✅ 国内访问快
- ✅ 可以自定义域名

**缺点：**
- ❌ 需要配置服务器
- ❌ 需要备案（使用域名）
- ❌ 需要维护

---

### 方案3：Render (一站式)
**成本：** 免费（有限制）
**难度：** ⭐⭐ 简单
**时间：** 1小时
**优点：**
- ✅ 一个平台部署所有服务
- ✅ 自动HTTPS
- ✅ 简单配置

**缺点：**
- ❌ 免费版有休眠（15分钟无访问会休眠）
- ❌ 国内访问可能较慢

---

## 推荐方案详解：Vercel + Railway

### 为什么选择这个方案？
1. **完全免费开始** - Railway提供$5免费额度，足够个人使用
2. **最简单** - 几乎零配置，连接GitHub自动部署
3. **性能好** - Vercel的CDN全球加速
4. **自动HTTPS** - 自动配置SSL证书
5. **易维护** - 推送代码自动更新

---

## 详细部署步骤

### 准备工作

#### 1. 注册账号
- [GitHub](https://github.com) - 代码托管
- [Vercel](https://vercel.com) - 前端部署
- [Railway](https://railway.app) - 后端和数据库部署

#### 2. 上传代码到GitHub
```bash
# 在项目根目录执行
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

---

### 第一步：部署数据库到Railway

#### 1.1 登录Railway
- 访问 https://railway.app
- 使用GitHub账号登录

#### 1.2 创建新项目
- 点击 "New Project"
- 选择 "Provision PostgreSQL"
- 等待数据库创建完成

#### 1.3 获取数据库连接信息
- 点击PostgreSQL服务
- 进入 "Variables" 标签
- 复制以下信息：
  - `DATABASE_URL` (完整连接字符串)
  - 或单独的：`PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`

#### 1.4 运行数据库迁移
在本地连接Railway数据库运行迁移：
```bash
# 设置环境变量
export DATABASE_URL="你的Railway数据库URL"

# 运行迁移
cd backend
npm run db:migrate
```

---

### 第二步：部署后端到Railway

#### 2.1 在Railway项目中添加后端服务
- 在同一个Railway项目中
- 点击 "New" → "GitHub Repo"
- 选择你的仓库
- Railway会自动检测到Node.js项目

#### 2.2 配置后端环境变量
在Railway后端服务的 "Variables" 中添加：
```
NODE_ENV=production
PORT=5000
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=https://你的前端域名.vercel.app
```

#### 2.3 配置构建设置
在Railway中设置：
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

#### 2.4 获取后端URL
- 部署完成后，Railway会提供一个URL
- 格式类似：`https://你的应用名.up.railway.app`
- 记下这个URL，前端需要用到

---

### 第三步：部署前端到Vercel

#### 3.1 登录Vercel
- 访问 https://vercel.com
- 使用GitHub账号登录

#### 3.2 导入项目
- 点击 "Add New..." → "Project"
- 选择你的GitHub仓库
- 点击 "Import"

#### 3.3 配置项目设置
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

#### 3.4 配置环境变量
在Vercel项目设置中添加：
```
VITE_API_URL=https://你的Railway后端URL.up.railway.app
```

#### 3.5 部署
- 点击 "Deploy"
- 等待部署完成
- Vercel会提供一个URL，如：`https://你的项目名.vercel.app`

---

### 第四步：更新后端CORS配置

#### 4.1 回到Railway后端服务
更新 `CORS_ORIGIN` 环境变量为你的Vercel URL：
```
CORS_ORIGIN=https://你的项目名.vercel.app
```

#### 4.2 重新部署后端
Railway会自动重新部署

---

### 第五步：测试部署

#### 5.1 访问你的应用
在浏览器打开：`https://你的项目名.vercel.app`

#### 5.2 测试功能
- ✅ 粘贴链接
- ✅ 创建文件夹
- ✅ 添加标签
- ✅ 搜索功能

#### 5.3 在手机上测试
- 在手机浏览器打开同样的URL
- 测试所有功能

---

## 配置文件修改

### 1. 修改前端API配置

创建 `frontend/.env.production`:
```env
VITE_API_URL=https://你的Railway后端URL.up.railway.app
```

创建 `frontend/src/config.ts`:
```typescript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

### 2. 修改前端代码使用配置

在 `frontend/src/App.tsx` 中：
```typescript
import { API_URL } from './config';

// 替换所有 'http://localhost:5000' 为 API_URL
const response = await fetch(`${API_URL}/api/collections`, {
  // ...
});
```

### 3. 修改后端CORS配置

在 `backend/src/index.ts` 中：
```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```

---

## 自定义域名（可选）

### Vercel自定义域名
1. 在Vercel项目设置中
2. 进入 "Domains"
3. 添加你的域名
4. 按照提示配置DNS

### Railway自定义域名
1. 在Railway服务设置中
2. 进入 "Settings" → "Domains"
3. 添加自定义域名
4. 配置DNS记录

---

## 成本估算

### 免费方案
- **Vercel**: 免费（个人项目）
- **Railway**: $5免费额度/月
  - PostgreSQL: ~$2-3/月
  - Backend服务: ~$2-3/月
  - 总计：免费额度足够

### 如果超出免费额度
- Railway: $0.000231/GB-hour (约$5-10/月)
- 或升级到 Hobby Plan: $5/月

---

## 监控和维护

### 查看日志
- **Vercel**: 项目 → Deployments → 点击部署 → Logs
- **Railway**: 服务 → Deployments → 点击部署 → Logs

### 性能监控
- Vercel自带Analytics
- Railway提供资源使用监控

### 自动部署
- 推送到GitHub main分支自动部署
- 可以配置预览环境（PR自动部署）

---

## 常见问题

### Q1: 部署后无法访问后端API
**解决：**
- 检查Railway后端是否正常运行
- 检查CORS配置是否正确
- 检查前端环境变量是否设置

### Q2: 数据库连接失败
**解决：**
- 检查DATABASE_URL是否正确
- 确认数据库迁移已运行
- 查看Railway数据库日志

### Q3: 前端显示空白
**解决：**
- 检查浏览器控制台错误
- 检查API_URL配置
- 查看Vercel部署日志

### Q4: 手机访问很慢
**解决：**
- Vercel在国内可能较慢，考虑使用国内CDN
- 或使用阿里云/腾讯云部署

---

## 备选方案：使用Docker部署到云服务器

如果你有云服务器（阿里云/腾讯云），可以使用Docker一键部署：

### 1. 在服务器上安装Docker
```bash
curl -fsSL https://get.docker.com | sh
```

### 2. 克隆代码
```bash
git clone https://github.com/你的用户名/你的仓库名.git
cd 你的仓库名
```

### 3. 配置环境变量
```bash
cp backend/.env.example backend/.env
# 编辑 backend/.env 设置数据库密码等
```

### 4. 启动服务
```bash
docker-compose up -d
```

### 5. 配置Nginx反向代理
```nginx
server {
    listen 80;
    server_name 你的域名.com;

    location / {
        proxy_pass http://localhost:3000;
    }

    location /api {
        proxy_pass http://localhost:5000;
    }
}
```

---

## 下一步

我可以帮你：
1. ✅ 创建必要的配置文件
2. ✅ 修改代码以支持生产环境
3. ✅ 创建部署脚本
4. ✅ 提供详细的部署命令

需要我开始准备部署文件吗？
