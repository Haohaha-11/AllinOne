# All in One - Universal Content Collector

A cross-platform content collection and knowledge management tool designed to solve the pain point of scattered content across multiple platforms (WeChat, Zhihu, Xiaohongshu, Douyin, Bilibili) in the era of fragmented reading.

[中文文档](README_CN.md) | [Live Demo](https://allinonehao.up.railway.app)

## ✨ Key Features

### 📋 Content Management
- **Smart Link Recognition** - Automatically detects and parses links from 5 major platforms
- **Auto Metadata Extraction** - Extracts title, cover image, author, and description
- **Multi-level Folder Organization** - Unlimited nested folder structure
- **Flexible Tag System** - Multi-dimensional content indexing across folders
- **Uncategorized View** - Quick access to items without folders

### 🎯 Content Status & Notes
- **Priority Levels** - Mark items as Low (🟢), Medium (🟠), or High (🔴) priority
- **Read Status** - Track read/unread status for each item
- **Rich Notes** - Add markdown-formatted notes to any content
- **Notes Timestamps** - Automatic tracking of when notes were last updated

### 🔍 Advanced Search
- **Full-Text Search** - PostgreSQL-powered search across titles, descriptions, and tags
- **Auto-Search** - Real-time search with 200ms debounce
- **Categorized Results** - Results grouped by match type (title, description, tags)
- **Fast Performance** - Optimized queries with 40-50ms response time

### 🏷️ Tag Management
- **Multi-Tag Support** - Assign multiple tags to each content item
- **Tag-based Filtering** - Click tags to view all related content
- **Tag Statistics** - See item count for each tag
- **Create & Manage** - Create new tags on-the-fly or manage existing ones
- **Tag Editing** - Rename or delete tags with automatic reference updates

### 🎨 User Interface
- **Beautiful Bookshelf Layout** - Card-based grid display with custom background
- **Responsive Design** - Left sidebar for folders, right panel for uncategorized items
- **Visual Statistics** - Quick overview of folders, items, and platforms
- **Card Transparency** - Semi-transparent cards (0.3 opacity) for elegant look
- **Platform Icons** - Visual indicators for content source

## 🚀 Live Demo

Visit the deployed application: [https://allinonehao.up.railway.app](https://allinonehao.up.railway.app)

## 📋 Supported Platforms

| Platform | Status | Example URL |
|----------|--------|-------------|
| WeChat Official Account | ✅ | mp.weixin.qq.com |
| Zhihu | ✅ | zhihu.com |
| Xiaohongshu (Little Red Book) | ✅ | xiaohongshu.com |
| Douyin (TikTok China) | ✅ | douyin.com |
| Bilibili | ✅ | bilibili.com |

## 🎯 How to Use

### 1. Collect Content
- Click "📋 Paste Link" button
- Paste a URL from supported platforms
- Edit title, description, and tags
- Select a folder (optional)
- Click "Save" to collect

### 2. Organize with Folders
- Click "➕ New Folder" to create folders
- Folders support unlimited nesting
- Drag items between folders
- Add descriptions to folders

### 3. Tag Your Content
- Add multiple tags when saving content
- Create new tags on-the-fly
- Click tags at the bottom to filter content
- Rename or delete tags as needed

### 4. Search & Filter
- Click "🔍 Search" button
- Type at least 2 characters to search
- Results appear in real-time
- Results grouped by match type

### 5. Manage Status & Notes
- Set priority level (Low/Medium/High)
- Mark as read/unread
- Add detailed notes with markdown support
- View notes timestamp

## 🛠️ Technology Stack

### Frontend
- **React 18** + TypeScript
- **Vite** - Build tool
- **Axios** - HTTP client
- **CSS3** - Custom styling with backdrop filters

### Backend
- **Node.js** + Express + TypeScript
- **PostgreSQL** - Database with full-text search
- **Redis** - Optional caching layer
- **Cheerio** - HTML parsing for metadata extraction

### Deployment
- **Railway** - Cloud platform for both frontend and backend
- **Docker** - Containerization support
- **GitHub Actions** - CI/CD ready

## 📁 Project Structure

```
.
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── config.ts     # API configuration
│   │   └── App.tsx       # Main application
│   ├── public/           # Static assets
│   └── server.js         # Production server
│
├── backend/              # Node.js backend
│   ├── src/
│   │   ├── config/      # Database & Redis config
│   │   ├── db/          # Migrations
│   │   ├── models/      # Data models
│   │   ├── routes/      # API routes
│   │   └── services/    # Business logic
│   └── package.json
│
├── docker-compose.yml    # Docker configuration
└── README.md
```

## 🚀 Quick Start

### Option 1: Use Live Demo (Recommended)
Visit [https://allinonehao.up.railway.app](https://allinonehao.up.railway.app)

### Option 2: Docker (Zero Configuration)

```bash
# 1. Start all services
docker-compose up

# 2. Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Option 3: Local Development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your database credentials

# 3. Create database
createdb content_collector

# 4. Run migrations
cd backend && npm run db:migrate && cd ..

# 5. Start development servers
npm run dev
```

See [QUICKSTART.md](QUICKSTART.md) for detailed instructions.

## 🔧 Available Commands

```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only

# Database
npm run db:migrate       # Run migrations
npm run db:rollback      # Rollback database

# Build
npm run build            # Build both frontend and backend
npm run build:frontend   # Build frontend only
npm run build:backend    # Build backend only

# Testing
npm test                 # Run tests
npm run lint             # Lint code
```

## 📚 API Documentation

### Parse Link
```bash
POST /api/parse
Content-Type: application/json

{
  "url": "https://zhuanlan.zhihu.com/p/123456",
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Create Collection
```bash
POST /api/collections
Content-Type: application/json

{
  "url": "https://zhuanlan.zhihu.com/p/123456",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "folderId": "folder-uuid",
  "tags": ["React", "Tutorial"]
}
```

### Search Content
```bash
GET /api/search?userId=user-id&query=React&pageSize=50
```

### Get Folder Tree
```bash
GET /api/folders/tree?userId=user-id
```

### Get Tags
```bash
GET /api/tags?userId=user-id
```

### Update Priority
```bash
PATCH /api/collections/:id/priority
Content-Type: application/json

{
  "priority": 2  // 1=Low, 2=Medium, 3=High
}
```

### Update Read Status
```bash
PATCH /api/collections/:id/read-status
Content-Type: application/json

{
  "isRead": true
}
```

### Update Notes
```bash
PATCH /api/collections/:id/notes
Content-Type: application/json

{
  "notes": "# My Notes\n\nThis is a great article!"
}
```

## 🌐 Deployment

### Deploy to Railway

1. Fork this repository
2. Create a new project on [Railway](https://railway.app)
3. Add PostgreSQL database
4. Create two services: Backend and Frontend
5. Set environment variables:
   - Backend: `DATABASE_URL`, `NODE_ENV=production`, `CORS_ORIGIN`
   - Frontend: `VITE_API_URL`
6. Deploy!

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📖 Documentation

- [Quick Start Guide](QUICKSTART.md) - Get started in 5 minutes
- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Deploy to Railway
- [Docker Setup](DOCKER_SETUP.md) - Docker usage guide
- [API Documentation](FINAL_SUMMARY.md) - Complete API reference
- [Requirements](.kiro/specs/universal-content-collector/requirements.md)
- [Design Document](.kiro/specs/universal-content-collector/design.md)

## 🎨 Features in Detail

### Folder Management
- Create unlimited nested folders
- Add descriptions to folders
- View item count per folder
- Rename and delete folders
- Move items between folders

### Tag System
- Create tags on-the-fly
- Multi-tag support per item
- Tag-based filtering
- Tag statistics with item counts
- Rename and delete tags

### Content Cards
- Cover image display
- Title and description
- Platform indicator
- Priority level indicator (colored dots)
- Read/unread status toggle
- Notes button with indicator
- Tag chips
- Creation date
- Quick actions (edit, move, delete)

### Search Features
- Real-time auto-search (200ms debounce)
- Minimum 2 characters to trigger
- Results grouped by match type
- Search across titles, descriptions, and tags
- Fast performance (40-50ms)

## 🔜 Roadmap

- [ ] User authentication system
- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] Offline support
- [ ] Batch operations
- [ ] Data import/export
- [ ] More platform support
- [ ] AI-powered content summarization
- [ ] Collaborative collections

## 🐛 Troubleshooting

### Common Issues

**Database connection failed**
- Check PostgreSQL is running
- Verify credentials in `.env`
- Ensure database exists

**Frontend can't connect to backend**
- Check `VITE_API_URL` in frontend
- Verify backend is running
- Check CORS configuration

**Search not working**
- Ensure PostgreSQL full-text search is enabled
- Check database indexes are created
- Verify search query length (min 2 characters)

See [QUICKSTART.md](QUICKSTART.md) for more troubleshooting tips.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- React Team for the amazing framework
- PostgreSQL for powerful full-text search
- Railway for easy deployment
- All open-source contributors

## 👨‍💻 Author

Created with ❤️ by Haohaha

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

---

**Start collecting your amazing content today!** 🚀
