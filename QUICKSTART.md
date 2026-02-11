# Quick Start Guide

Get the All in One Content Collector running in 5 minutes!

## Option 1: Use Live Demo (Fastest)

Visit the deployed application: **[https://allinonehao.up.railway.app](https://allinonehao.up.railway.app)**

No installation required!

## Option 2: Docker (Recommended for Local Development)

### Prerequisites
- Docker and Docker Compose installed

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/Haohaha-11/AllinOne.git
cd AllinOne
```

2. **Start all services**
```bash
docker-compose up
```

3. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

That's it! The application is now running with PostgreSQL and Redis.

## Option 3: Local Installation

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 15+
- Redis (optional)

### Steps

1. **Clone and install dependencies**
```bash
git clone https://github.com/Haohaha-11/AllinOne.git
cd AllinOne
npm install
```

2. **Setup PostgreSQL**
```bash
# Create database
createdb content_collector

# Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your database credentials
```

3. **Run database migrations**
```bash
cd backend
npm run db:migrate
cd ..
```

4. **Start development servers**
```bash
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## First Steps

### 1. Create a Folder
- Click "➕ New Folder"
- Enter a name and description
- Click "Create"

### 2. Collect Content
- Click "📋 Paste Link"
- Paste a URL from:
  - WeChat (mp.weixin.qq.com)
  - Zhihu (zhihu.com)
  - Xiaohongshu (xiaohongshu.com)
  - Douyin (douyin.com)
  - Bilibili (bilibili.com)
- Edit title, description, and tags
- Select a folder (optional)
- Click "Save"

### 3. Organize with Tags
- Add tags when saving content
- Click tags at the bottom to filter
- Create new tags on-the-fly

### 4. Search Content
- Click "🔍 Search"
- Type at least 2 characters
- Results appear in real-time

### 5. Manage Status
- Set priority (Low/Medium/High)
- Mark as read/unread
- Add notes with markdown

## Common Issues

### Database connection failed
**Solution**: Check PostgreSQL is running and credentials in `backend/.env` are correct

### Frontend can't connect to backend
**Solution**: Verify `VITE_API_URL` in frontend matches your backend URL

### Port already in use
**Solution**: Stop other services using ports 3000, 5000, 5432, or 6379

### Search not working
**Solution**: Ensure database migrations ran successfully

## Next Steps

- **Deploy to production**: See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- **Docker setup**: See [docs/DOCKER.md](docs/DOCKER.md)
- **Full documentation**: See [README.md](README.md)

## Need Help?

- Check the [README](README.md) for detailed documentation
- Review [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for deployment issues
- Open an issue on [GitHub](https://github.com/Haohaha-11/AllinOne/issues)

## Default User ID

The application uses a default user ID for development:
```
550e8400-e29b-41d4-a716-446655440000
```

This is automatically configured and requires no action from you.

---

**Happy collecting!** 🚀
