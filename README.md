# 全渠道内容收藏助手

一款跨平台的聚合收藏与知识库管理工具，旨在解决碎片化阅读时代内容分散在各平台（小红书、微信、知乎、抖音等）难以统一检索和复习的痛点。

## ✨ 核心特性

- 🔗 **智能链接识别** - 自动识别5大平台链接（微信、知乎、小红书、抖音、B站）
- 📝 **自动元数据提取** - 自动提取标题、封面图、作者、摘要
- 📁 **多级文件夹管理** - 支持无限层级的文件夹组织
- 🏷️ **灵活标签系统** - 跨文件夹的多维度内容索引
- 🔍 **强大全文搜索** - 基于 PostgreSQL 的全文搜索
- ⚡ **3秒极速收藏** - 从复制链接到完成收藏不超过3秒
- 🎨 **统一美观界面** - 消除不同平台排版混乱

## 🚀 快速开始

### 方式1: 使用 Docker（推荐，零配置）

```bash
# 1. 启动所有服务
docker-compose up

# 2. 访问应用
# 前端: http://localhost:3000
# 后端: http://localhost:5000
```

### 方式2: 本地安装

```bash
# 1. 安装依赖（已完成）
npm install

# 2. 配置环境变量
cp backend/.env.example backend/.env
# 编辑 backend/.env 填入数据库配置

# 3. 创建数据库
createdb content_collector

# 4. 运行数据库迁移
cd backend && npm run db:migrate && cd ..

# 5. 启动服务
npm run dev
```

详细步骤请查看 [快速启动指南](QUICKSTART.md)

## 📋 支持的平台

| 平台 | 状态 | 示例链接 |
|------|------|----------|
| 微信公众号 | ✅ | mp.weixin.qq.com |
| 知乎 | ✅ | zhihu.com |
| 小红书 | ✅ | xiaohongshu.com |
| 抖音 | ✅ | douyin.com |
| B站 | ✅ | bilibili.com |

## 🎯 使用方法

1. **收藏内容**
   - 复制支持平台的链接
   - 自动弹出收藏对话框
   - 编辑信息并确认

2. **浏览内容**
   - 卡片式展示所有收藏
   - 点击卡片打开原链接

3. **搜索内容**
   - 关键词搜索
   - 平台筛选
   - 标签筛选

## 🛠️ 技术栈

### 前端
- React 18 + TypeScript
- Vite (构建工具)
- Jest + Testing Library (测试)

### 后端
- Node.js + Express + TypeScript
- PostgreSQL (数据库 + 全文搜索)
- Redis (缓存)
- Jest + fast-check (测试)

## 📁 项目结构

```
.
├── frontend/          # React 前端
├── backend/           # Node.js 后端
├── .kiro/specs/       # 规格文档
├── docker-compose.yml # Docker 配置
└── README.md
```

## 🔧 可用命令

```bash
# 开发
npm run dev              # 启动前后端
npm run dev:frontend     # 仅启动前端
npm run dev:backend      # 仅启动后端

# 数据库
npm run db:migrate       # 运行迁移
npm run db:rollback      # 回滚数据库

# 测试和代码质量
npm test                 # 运行测试
npm run lint             # 代码检查
npm run format           # 代码格式化
```

## 📚 API 文档

### 解析链接
```bash
POST /api/parse
{
  "url": "https://zhuanlan.zhihu.com/p/123456"
}
```

### 创建收藏
```bash
POST /api/collections
{
  "url": "https://zhuanlan.zhihu.com/p/123456",
  "userId": "user-id"
}
```

### 搜索内容
```bash
GET /api/search?keyword=React&platforms=zhihu&page=1
```

完整 API 文档请查看 [FINAL_SUMMARY.md](FINAL_SUMMARY.md)

## 📖 文档

- [快速启动指南](QUICKSTART.md) - 5分钟快速开始
- [完整功能文档](FINAL_SUMMARY.md) - 详细功能说明
- [Docker 设置指南](DOCKER_SETUP.md) - Docker 使用说明
- [需求文档](.kiro/specs/universal-content-collector/requirements.md)
- [设计文档](.kiro/specs/universal-content-collector/design.md)
- [任务列表](.kiro/specs/universal-content-collector/tasks.md)

## 🎨 截图

（待添加实际截图）

## 🔜 路线图

- [ ] 用户认证系统
- [ ] 移动端适配
- [ ] 离线支持
- [ ] 批量操作
- [ ] 数据导入导出
- [ ] 更多平台支持

## 🐛 故障排除

遇到问题？查看 [快速启动指南](QUICKSTART.md) 的常见问题部分。

## 📄 许可证

MIT

## 🙏 致谢

感谢所有开源项目的贡献者！

---

**开始收藏你的精彩内容吧！** 🚀
