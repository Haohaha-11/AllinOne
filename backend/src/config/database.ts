import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Support both DATABASE_URL and individual environment variables
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      // Query timeout: 10 seconds (increased for Railway)
      query_timeout: 10000,
      // Connection timeout: 10 seconds (increased for Railway)
      connectionTimeoutMillis: 10000,
      // Idle timeout: 30 seconds
      idleTimeoutMillis: 30000,
      // Max connections: 10 (Railway free tier limit)
      max: 10,
      // Min connections: 2
      min: 2,
      // Allow exit on idle
      allowExitOnIdle: false,
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'content_collector',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      // Query timeout: 10 seconds
      query_timeout: 10000,
      // Connection timeout: 10 seconds
      connectionTimeoutMillis: 10000,
      // Idle timeout: 30 seconds
      idleTimeoutMillis: 30000,
      max: 10,
      min: 2,
      allowExitOnIdle: false,
    };

export const pool = new Pool(poolConfig);

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected database pool error:', err);
});

export async function testConnection(retries = 3, delay = 2000): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      console.log('✓ PostgreSQL connected successfully');
      client.release();
      return true;
    } catch (error) {
      console.error(`✗ PostgreSQL connection attempt ${i + 1}/${retries} failed:`, error);
      
      if (i < retries - 1) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  return false;
}

