import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'content_collector',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  // Query timeout: 3 seconds (before frontend 4s timeout)
  query_timeout: 3000,
  // Connection timeout: 5 seconds
  connectionTimeoutMillis: 5000,
  // Idle timeout: 30 seconds
  idleTimeoutMillis: 30000,
});

export async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✓ PostgreSQL connected successfully');
    client.release();
    return true;
  } catch (error) {
    console.error('✗ PostgreSQL connection failed:', error);
    return false;
  }
}
