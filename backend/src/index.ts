import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';
import { connectRedis } from './config/redis.js';

// Import routes
import collectionsRouter from './routes/collections.js';
import foldersRouter from './routes/folders.js';
import tagsRouter from './routes/tags.js';
import searchRouter from './routes/search.js';
import parseRouter from './routes/parse.js';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '全渠道内容收藏助手 API 运行中' });
});

// API routes
app.use('/api/collections', collectionsRouter);
app.use('/api/folders', foldersRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/search', searchRouter);
app.use('/api/parse', parseRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
async function startServer() {
  try {
    console.log('Starting server...');
    
    // Test database connection
    console.log('Testing database connection...');
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('\n❌ Database connection required! Please check your PostgreSQL configuration.');
      console.error('   See QUICKSTART.md for setup instructions.\n');
      process.exit(1);
    }
    
    // Try to connect to Redis (optional)
    console.log('Connecting to Redis...');
    await connectRedis();
    
    console.log('Starting HTTP server...');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n🚀 Server running on http://0.0.0.0:${PORT}`);
      console.log(`📝 Health check: http://0.0.0.0:${PORT}/health`);
      console.log(`\n📚 API Endpoints:`);
      console.log(`   POST   /api/parse - 解析链接`);
      console.log(`   POST   /api/collections - 创建收藏`);
      console.log(`   GET    /api/collections - 获取收藏列表`);
      console.log(`   GET    /api/search - 搜索内容`);
      console.log(`   GET    /api/folders/tree - 获取文件夹树`);
      console.log(`   GET    /api/tags - 获取标签列表\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('Error details:', error);
    process.exit(1);
  }
}

console.log('Initializing application...');
startServer().catch(err => {
  console.error('❌ Startup error:', err);
  process.exit(1);
});
