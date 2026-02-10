# Docker 环境设置指南

## 使用 Docker 的优势

✅ **完全隔离**：在独立的容器中运行，不影响你的 base 环境
✅ **一键启动**：自动配置 Node.js、PostgreSQL、Redis
✅ **环境一致**：开发环境与生产环境完全一致
✅ **无需手动安装**：不需要在本地安装 Node.js、PostgreSQL、Redis

## 前置要求

只需要安装 Docker Desktop：
- Windows: https://www.docker.com/products/docker-desktop
- Mac: https://www.docker.com/products/docker-desktop
- Linux: `sudo apt install docker.io docker-compose`

## 快速启动

### 1. 启动所有服务（推荐）

在项目根目录运行：

```bash
docker-compose up
```

这将启动：
- ✅ PostgreSQL 数据库（端口 5432）
- ✅ Redis 缓存（端口 6379）
- ✅ 后端 API（端口 5000）
- ✅ 前端应用（端口 3000）

### 2. 后台运行

```bash
docker-compose up -d
```

### 3. 查看日志

```bash
# 查看所有服务日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 4. 停止服务

```bash
docker-compose down
```

### 5. 完全清理（包括数据）

```bash
docker-compose down -v
```

## 访问应用

启动成功后：
- 前端：http://localhost:3000
- 后端 API：http://localhost:5000
- 健康检查：http://localhost:5000/health

## 开发工作流

### 代码热重载

Docker 配置了卷挂载，修改代码会自动重载：
- 修改 `frontend/src/` 下的文件 → 前端自动刷新
- 修改 `backend/src/` 下的文件 → 后端自动重启

### 进入容器

```bash
# 进入后端容器
docker-compose exec backend sh

# 进入前端容器
docker-compose exec frontend sh

# 进入数据库
docker-compose exec postgres psql -U postgres -d content_collector
```

### 运行测试

```bash
# 后端测试
docker-compose exec backend npm test

# 前端测试
docker-compose exec frontend npm test
```

### 安装新依赖

```bash
# 后端安装依赖
docker-compose exec backend npm install <package-name>

# 前端安装依赖
docker-compose exec frontend npm install <package-name>

# 重新构建容器
docker-compose up --build
```

## 数据库管理

### 连接数据库

```bash
docker-compose exec postgres psql -U postgres -d content_collector
```

### 备份数据库

```bash
docker-compose exec postgres pg_dump -U postgres content_collector > backup.sql
```

### 恢复数据库

```bash
cat backup.sql | docker-compose exec -T postgres psql -U postgres -d content_collector
```

## 常见问题

### Q: 端口被占用
A: 修改 `docker-compose.yml` 中的端口映射，例如：
```yaml
ports:
  - "3001:3000"  # 将前端改为 3001
```

### Q: 容器启动失败
A: 查看日志找出原因：
```bash
docker-compose logs backend
```

### Q: 需要重新构建
A: 当修改了 Dockerfile 或 package.json：
```bash
docker-compose up --build
```

### Q: 清理所有 Docker 资源
A: 
```bash
docker-compose down -v
docker system prune -a
```

## 对比：Docker vs 本地安装

| 特性 | Docker | 本地安装 |
|------|--------|----------|
| 环境隔离 | ✅ 完全隔离 | ⚠️ 共享环境 |
| 安装复杂度 | ✅ 一键启动 | ⚠️ 需要多个软件 |
| 数据库/Redis | ✅ 自动配置 | ⚠️ 手动安装配置 |
| 环境一致性 | ✅ 完全一致 | ⚠️ 可能不同 |
| 性能 | ⚠️ 略有损耗 | ✅ 原生性能 |

## 推荐使用场景

**使用 Docker（推荐）**：
- ✅ 不想污染本地环境
- ✅ 需要快速开始开发
- ✅ 团队协作，保证环境一致
- ✅ 不想手动安装 PostgreSQL 和 Redis

**使用本地安装**：
- 已经有 Node.js、PostgreSQL、Redis
- 需要最佳性能
- 熟悉本地开发环境
