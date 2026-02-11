# All in One - Universal Content Collector

> A cross-platform content collection and knowledge management tool for WeChat, Zhihu, Xiaohongshu, Douyin, and Bilibili.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://allinonehao.up.railway.app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Live Demo](https://allinonehao.up.railway.app) | [Quick Start](QUICKSTART.md) | [Deployment Guide](docs/DEPLOYMENT.md)

## ✨ Features

### 📋 Content Management
- **Smart Link Recognition** - Automatically detects and parses links from 5 major Chinese platforms
- **Auto Metadata Extraction** - Extracts title, cover image, author, and description
- **Multi-level Folders** - Unlimited nested folder structure for organization
- **Flexible Tags** - Multi-dimensional content indexing across folders

### 🎯 Status & Notes
- **Priority Levels** - Mark items as Low 🟢, Medium 🟠, or High 🔴 priority
- **Read Tracking** - Track read/unread status for each item
- **Rich Notes** - Add markdown-formatted notes to any content
- **Timestamps** - Automatic tracking of when notes were last updated

### 🔍 Advanced Search
- **Full-Text Search** - PostgreSQL-powered search across titles, descriptions, and tags
- **Real-time Results** - Auto-search with 200ms debounce
- **Categorized Results** - Results grouped by match type (title, description, tags)
- **Fast Performance** - Optimized queries with 40-50ms response time

### 🎨 Beautiful UI
- **Bookshelf Layout** - Card-based grid display with custom background
- **Responsive Design** - Works on desktop and mobile
- **Visual Statistics** - Quick overview of folders, items, and platforms
- **Semi-transparent Cards** - Elegant design with backdrop filters

## 🚀 Quick Start

### Option 1: Live Demo (Fastest)
Visit **[https://allinonehao.up.railway.app](https://allinonehao.up.railway.app)**

### Option 2: Docker (Recommended)
```bash
git clone https://github.com/Haohaha-11/AllinOne.git
cd AllinOne
docker-compose up
```
Access at http://localhost:3000

### Option 3: Local Development
```bash
git clone https://github.com/Haohaha-11/AllinOne.git
cd AllinOne
npm install
npm run dev
```

See [QUICKSTART.md](QUICKSTART.md) for detailed instructions.

## 📋 Supported Platforms

| Platform | Status | Example URL |
|----------|--------|-------------|
| WeChat Official Account | ✅ | mp.weixin.qq.com |
| Zhihu | ✅ | zhihu.com |
| Xiaohongshu | ✅ | xiaohongshu.com |
| Douyin | ✅ | douyin.com |
| Bilibili | ✅ | bilibili.com |

## 🛠️ Technology Stack

**Frontend**
- React 18 + TypeScript
- Vite
- Axios

**Backend**
- Node.js + Express + TypeScript
- PostgreSQL (with full-text search)
- Redis (optional caching)

**Deployment**
- Railway (cloud platform)
- Docker support

## 📁 Project Structure

```
.
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── config.ts     # API configuration
│   │   └── App.tsx       # Main application
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
├── docs/                 # Documentation
│   ├── DEPLOYMENT.md    # Deployment guide
│   └── DOCKER.md        # Docker setup
│
├── docker-compose.yml    # Docker configuration
├── QUICKSTART.md        # Quick start guide
└── README.md            # This file
```

## 📚 Documentation

- **[Quick Start Guide](QUICKSTART.md)** - Get started in 5 minutes
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Deploy to Railway
- **[Docker Setup](docs/DOCKER.md)** - Run with Docker

## 🎯 Usage

### Collect Content
1. Click "📋 Paste Link"
2. Paste a URL from supported platforms
3. Edit metadata and add tags
4. Select a folder (optional)
5. Click "Save"

### Organize
- Create folders with descriptions
- Add multiple tags to items
- Set priority levels
- Mark items as read/unread

### Search & Filter
- Use the search bar (min 2 characters)
- Click tags to filter by tag
- Click folders to view contents

### Add Notes
- Click the notes button on any card
- Write markdown-formatted notes
- Notes are automatically timestamped

## 📚 API Documentation

### Parse Link
```http
POST /api/parse
Content-Type: application/json

{
  "url": "https://zhuanlan.zhihu.com/p/123456",
  "userId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Create Collection
```http
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
```http
GET /api/search?userId=user-id&query=React&pageSize=50
```

### Update Priority
```http
PATCH /api/collections/:id/priority
Content-Type: application/json

{
  "priority": 2  // 1=Low, 2=Medium, 3=High
}
```

### Update Notes
```http
PATCH /api/collections/:id/notes
Content-Type: application/json

{
  "notes": "# My Notes\n\nThis is a great article!"
}
```

See the code for complete API documentation.

## 🌐 Deployment

Deploy to Railway in minutes:

1. Push code to GitHub
2. Create Railway project
3. Add PostgreSQL database
4. Create backend and frontend services
5. Configure environment variables
6. Deploy!

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

## 🔧 Development

### Install dependencies
```bash
npm install
```

### Start development servers
```bash
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only
```

### Database migrations
```bash
cd backend
npm run db:migrate       # Run migrations
npm run db:rollback      # Rollback database
```

### Build for production
```bash
npm run build            # Build both
npm run build:frontend   # Build frontend only
npm run build:backend    # Build backend only
```

## 🔜 Roadmap

- [ ] User authentication system
- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] Batch operations
- [ ] Data import/export
- [ ] More platform support
- [ ] AI-powered summarization
- [ ] Collaborative collections

## 🐛 Troubleshooting

**Database connection failed**
- Check PostgreSQL is running
- Verify credentials in `.env`

**Frontend can't connect to backend**
- Check `VITE_API_URL` environment variable
- Verify backend is running
- Check CORS configuration

**Search not working**
- Ensure database migrations ran
- Check PostgreSQL full-text search is enabled
- Verify search query length (min 2 characters)

See [QUICKSTART.md](QUICKSTART.md) for more troubleshooting tips.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React Team for the amazing framework
- PostgreSQL for powerful full-text search
- Railway for easy deployment
- All open-source contributors

## 👨‍💻 Author

Created with ❤️ by [Haohaha](https://github.com/Haohaha-11)

## 🌟 Support

If you find this project useful, please consider:
- Giving it a star ⭐
- Sharing it with others
- Contributing to the code
- Reporting bugs and suggesting features

---

**Start collecting your amazing content today!** 🚀

[Get Started](QUICKSTART.md) | [Live Demo](https://allinonehao.up.railway.app) | [Documentation](docs/)
