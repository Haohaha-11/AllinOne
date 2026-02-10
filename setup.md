# 项目设置指南

## 任务1完成状态

✅ 项目结构已创建
✅ 配置文件已生成
✅ 基础代码已编写

## 下一步：安装依赖

由于项目使用 npm workspaces，需要按以下步骤安装依赖：

### 方法1：自动安装（推荐）

在项目根目录运行：

```bash
npm install
```

这将自动安装根项目和所有子项目（frontend、backend）的依赖。

### 方法2：手动安装

如果自动安装失败，可以分别安装：

```bash
# 1. 安装根项目依赖
npm install --prefix .

# 2. 安装前端依赖
npm install --prefix frontend

# 3. 安装后端依赖
npm install --prefix backend
```

### 验证安装

安装完成后，检查以下目录是否存在：
- `node_modules/` (根目录)
- `frontend/node_modules/`
- `backend/node_modules/`

### 启动开发服务器

```bash
# 同时启动前后端
npm run dev

# 或分别启动
npm run dev:frontend  # http://localhost:3000
npm run dev:backend   # http://localhost:5000
```

## 数据库和Redis配置

在启动后端之前，需要：

1. **安装并启动 PostgreSQL**
   ```bash
   # 创建数据库
   createdb content_collector
   ```

2. **安装并启动 Redis**
   ```bash
   # Windows: 下载并运行 Redis
   # Linux/Mac: redis-server
   ```

3. **配置环境变量**
   ```bash
   cp backend/.env.example backend/.env
   # 编辑 backend/.env 文件，填入数据库和Redis配置
   ```

## 常见问题

### Q: npm install 失败
A: 确保 Node.js 版本 >= 18，尝试清除缓存：
```bash
npm cache clean --force
npm install
```

### Q: 端口被占用
A: 修改 `backend/.env` 中的 PORT 或 `frontend/vite.config.ts` 中的端口

### Q: 数据库连接失败
A: 检查 PostgreSQL 是否运行，以及 `backend/.env` 中的配置是否正确


## 使用独立的 Node.js 环境（可选）

### 选项1：使用 nvm（推荐）

如果你想在独立的 Node.js 版本中运行项目：

```bash
# 安装 nvm (如果还没安装)
# Windows: 下载 nvm-windows from https://github.com/coreybutler/nvm-windows

# 使用项目指定的 Node.js 版本
nvm install 18.19.0
nvm use 18.19.0

# 然后安装依赖
npm install
```

### 选项2：使用 Docker（完全隔离）

如果你想要完全隔离的环境，可以使用 Docker：

```bash
# 使用 Docker Compose 启动整个项目（包括数据库和 Redis）
docker-compose up
```

我可以为你创建 Docker 配置文件吗？

### 选项3：直接使用项目本地依赖（最简单）

Node.js 的 `node_modules` 已经提供了项目级别的隔离：
- 依赖安装在项目目录下
- 不会影响其他项目
- 不会污染全局环境

这是 Node.js 的标准做法，相当于 Python 的虚拟环境。
