# Docker Setup Guide

This guide explains how to run the All in One Content Collector using Docker.

## Prerequisites

- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed (included with Docker Desktop)

## Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/AllinOne.git
cd AllinOne
```

2. **Start all services**
```bash
docker-compose up
```

3. **Access the application**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## Docker Compose Services

The `docker-compose.yml` file defines four services:

### PostgreSQL Database
- **Image**: postgres:15
- **Port**: 5432
- **Database**: content_collector
- **User**: postgres
- **Password**: JH1219QQ

### Redis Cache
- **Image**: redis:7-alpine
- **Port**: 6379
- Optional service for caching

### Backend API
- **Build**: ./backend
- **Port**: 5000
- **Environment**:
  - NODE_ENV=development
  - Database connection details

### Frontend Web App
- **Build**: ./frontend
- **Port**: 3000
- **Environment**:
  - VITE_API_URL=http://localhost:5000

## Common Commands

### Start services
```bash
docker-compose up
```

### Start in background
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### View logs
```bash
docker-compose logs -f
```

### Rebuild services
```bash
docker-compose up --build
```

### Stop and remove volumes
```bash
docker-compose down -v
```

## Development Workflow

### Making code changes

1. **Backend changes**:
   - Edit files in `backend/src/`
   - Restart backend service:
     ```bash
     docker-compose restart backend
     ```

2. **Frontend changes**:
   - Edit files in `frontend/src/`
   - Restart frontend service:
     ```bash
     docker-compose restart frontend
     ```

### Database migrations

Run migrations inside the backend container:
```bash
docker-compose exec backend npm run db:migrate
```

### Access database
```bash
docker-compose exec postgres psql -U postgres -d content_collector
```

### Access Redis CLI
```bash
docker-compose exec redis redis-cli
```

## Troubleshooting

### Port already in use
If ports 3000, 5000, 5432, or 6379 are already in use:

1. Stop the conflicting service
2. Or modify ports in `docker-compose.yml`

### Database connection errors
- Ensure PostgreSQL container is running:
  ```bash
  docker-compose ps
  ```
- Check logs:
  ```bash
  docker-compose logs postgres
  ```

### Frontend can't connect to backend
- Verify backend is running:
  ```bash
  curl http://localhost:5000/health
  ```
- Check `VITE_API_URL` in docker-compose.yml

### Rebuild from scratch
```bash
docker-compose down -v
docker-compose up --build
```

## Production Deployment

For production, use Railway or another cloud platform instead of Docker Compose. See [DEPLOYMENT.md](./DEPLOYMENT.md) for details.

## Environment Variables

### Backend
- `NODE_ENV`: development or production
- `PORT`: 5000
- `DB_HOST`: postgres
- `DB_PORT`: 5432
- `DB_NAME`: content_collector
- `DB_USER`: postgres
- `DB_PASSWORD`: JH1219QQ
- `REDIS_HOST`: redis
- `REDIS_PORT`: 6379

### Frontend
- `VITE_API_URL`: http://localhost:5000

## Data Persistence

Docker volumes are used to persist data:
- `postgres_data`: PostgreSQL database files
- `redis_data`: Redis cache files

To backup data:
```bash
docker-compose exec postgres pg_dump -U postgres content_collector > backup.sql
```

To restore data:
```bash
docker-compose exec -T postgres psql -U postgres content_collector < backup.sql
```

## Performance Tips

1. **Allocate more resources to Docker**
   - Docker Desktop → Settings → Resources
   - Increase CPU and Memory limits

2. **Use volumes for node_modules**
   - Already configured in docker-compose.yml
   - Improves build performance

3. **Enable BuildKit**
   ```bash
   export DOCKER_BUILDKIT=1
   docker-compose up --build
   ```

## Support

For issues with Docker setup:
1. Check Docker logs: `docker-compose logs`
2. Verify Docker is running: `docker ps`
3. Review this guide
4. Open an issue on GitHub
