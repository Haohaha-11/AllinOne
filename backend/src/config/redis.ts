import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

export const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
  password: process.env.REDIS_PASSWORD || undefined,
});

let isConnected = false;
let hasWarned = false; // 只警告一次

redisClient.on('error', (err) => {
  // 静默处理 Redis 错误，不影响应用运行
  if (!isConnected && !hasWarned) {
    console.warn('⚠️  Redis not available (optional, app will work without it)');
    hasWarned = true;
  }
});

redisClient.on('connect', () => {
  console.log('✓ Redis connected successfully');
  isConnected = true;
});

export async function connectRedis() {
  try {
    if (redisClient.isOpen) {
      return true; // 已经连接
    }
    await Promise.race([
      redisClient.connect(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
    ]);
    isConnected = true;
    return true;
  } catch (error) {
    if (!hasWarned) {
      console.warn('⚠️  Redis connection failed (optional, app will work without it)');
      hasWarned = true;
    }
    isConnected = false;
    return false;
  }
}

export function isRedisConnected() {
  return isConnected;
}
