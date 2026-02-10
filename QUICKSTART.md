# 🚀 快速启动指南

## 5分钟快速开始

### 步骤 1: 安装依赖 ✅

依赖已安装完成！

### 步骤 2: 配置数据库

#### 选项 A: 使用 Docker（推荐，最简单）

```bash
# 一键启动所有服务（包括数据库）
docker-compose up
```

然后跳到步骤 4。

#### 选项 B: 本地安装

**安装 PostgreSQL:**
- Windows: https://www.postgresql.org/download/windows/
- Mac: `brew install postgresql`
- Linux: `sudo apt install postgresql`

**安装 Redis:**
- Windows: https://github.com/microsoftarchive/redis/releases
- Mac: `brew install redis`
- Linux: `sudo apt install redis`

**启动服务:**
```bash
# PostgreSQL (通常自动启动)
# Windows: 在服务中启动
# Mac/Linux: 
brew services start postgresql  # Mac
sudo service postgresql start   # Linux

# Redis
redis-server
```

### 步骤 3: 创建数据库

```bash
# 方法1: 使用 createdb 命令
createdb content_collector

# 方法2: 使用 psql
psql -U postgres
CREATE DATABASE content_collector;
\q
```

### 步骤 4: 配置环境变量

```bash
# 复制环境变量模板
cp backend/.env.example backend/.env
```

编辑 `backend/.env`（如果使用默认配置可以跳过）：
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=content_collector
DB_USER=postgres
DB_PASSWORD=postgres  # 改成你的密码

REDIS_HOST=localhost
REDIS_PORT=6379
```

### 步骤 5: 运行数据库迁移

```bash
cd backend
npm run db:migrate
cd ..
```

你应该看到：
```
✓ Migration completed: 001_initial_schema.sql
✓ Migration completed: 002_seed_data.sql
✓ All migrations completed successfully!
```

### 步骤 6: 启动应用

```bash
npm run dev
```

你应该看到：
```
🚀 Server running on http://localhost:5000
📝 Health check: http://localhost:5000/health

📚 API Endpoints:
   POST   /api/parse - 解析链接
   POST   /api/collections - 创建收藏
   ...
```

### 步骤 7: 测试应用

打开浏览器访问：http://localhost:3000

**测试收藏功能：**
1. 复制这个测试链接：`https://zhuanlan.zhihu.com/p/123456`
2. 粘贴到页面上（Ctrl+V 或 Cmd+V）
3. 应该会弹出收藏对话框
4. 点击"确认收藏"

## 🎯 验证安装

### 检查后端

```bash
curl http://localhost:5000/health
```

应该返回：
```json
{"status":"ok","message":"全渠道内容收藏助手 API 运行中"}
```

### 检查数据库

```bash
psql -U postgres -d content_collector -c "\dt"
```

应该看到 5 个表：
- users
- folders
- content_items
- tags
- content_tags

### 测试 API

```bash
# 测试链接解析
curl -X POST http://localhost:5000/api/parse \
  -H "Content-Type: application/json" \
  -d '{"url": "https://zhuanlan.zhihu.com/p/123456"}'
```

## ❓ 常见问题

### Q: 数据库连接失败

**错误**: `PostgreSQL connection failed`

**解决**:
1. 检查 PostgreSQL 是否运行：`pg_isready`
2. 检查密码是否正确：`backend/.env`
3. 尝试手动连接：`psql -U postgres`

### Q: Redis 连接失败

**错误**: `Redis Client Error`

**解决**:
1. 检查 Redis 是否运行：`redis-cli ping`（应返回 PONG）
2. 启动 Redis：`redis-server`
3. 如果不需要缓存，可以暂时忽略此错误

### Q: 端口被占用

**错误**: `Port 5000 is already in use`

**解决**:
修改端口：
- 后端：编辑 `backend/.env`，设置 `PORT=5001`
- 前端：编辑 `frontend/vite.config.ts`，设置 `port: 3001`

### Q: npm install 失败

**解决**:
```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules
rm -rf node_modules frontend/node_modules backend/node_modules

# 重新安装
npm install
```

### Q: 迁移失败

**错误**: `Migration failed`

**解决**:
```bash
# 回滚数据库
cd backend
npm run db:rollback

# 重新运行迁移
npm run db:migrate
```

## 🐳 使用 Docker（零配置）

如果上面的步骤太复杂，使用 Docker 一键启动：

```bash
# 1. 安装 Docker Desktop
# https://www.docker.com/products/docker-desktop

# 2. 启动所有服务
docker-compose up

# 3. 访问应用
# 前端: http://localhost:3000
# 后端: http://localhost:5000
```

就这么简单！

## 📞 需要帮助？

如果遇到问题：

1. 查看日志：
   ```bash
   # 后端日志
   cd backend && npm run dev
   
   # 前端日志
   cd frontend && npm run dev
   ```

2. 检查配置：
   ```bash
   cat backend/.env
   ```

3. 查看详细文档：
   - [完整文档](FINAL_SUMMARY.md)
   - [Docker 设置](DOCKER_SETUP.md)
   - [需求文档](.kiro/specs/universal-content-collector/requirements.md)

## ✅ 下一步

应用运行后，你可以：

1. **测试收藏功能** - 复制支持平台的链接
2. **浏览 API** - 访问 http://localhost:5000/health
3. **查看数据库** - 使用 psql 或 pgAdmin
4. **开发新功能** - 查看 tasks.md 了解待开发功能

**开始享受你的内容收藏之旅吧！** 🎉
