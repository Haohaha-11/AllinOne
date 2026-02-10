import { pool } from '../config/database.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration(filename: string) {
  const filePath = path.join(__dirname, 'migrations', filename);
  const sql = await fs.readFile(filePath, 'utf-8');
  
  console.log(`Running migration: ${filename}`);
  await pool.query(sql);
  console.log(`✓ Migration completed: ${filename}`);
}

async function migrate() {
  try {
    console.log('Starting database migration...\n');
    
    // 运行初始Schema
    await runMigration('001_initial_schema.sql');
    
    // 可选：运行种子数据（仅开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.log('\nRunning seed data (development only)...');
      await runMigration('002_seed_data.sql');
    }
    
    console.log('\n✓ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
