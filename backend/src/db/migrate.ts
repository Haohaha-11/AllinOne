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

export async function runMigrations() {
  console.log('Starting database migration...\n');
  
  // 按顺序运行所有迁移
  const migrations = [
    '001_initial_schema.sql',
    '003_add_folder_description.sql',
    '004_add_search_indexes.sql',
    '005_add_status_and_notes.sql'
  ];
  
  for (const migration of migrations) {
    try {
      await runMigration(migration);
    } catch (error: any) {
      // 如果表已存在，跳过错误
      if (error.code === '42P07' || error.message?.includes('already exists')) {
        console.log(`⚠ Skipping ${migration} (already applied)`);
      } else {
        throw error;
      }
    }
  }
  
  console.log('✓ All migrations completed successfully!');
}

async function migrate() {
  try {
    await runMigrations();
    
    // 可选：运行种子数据（仅开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.log('\nRunning seed data (development only)...');
      try {
        await runMigration('002_seed_data.sql');
      } catch (error: any) {
        console.log('⚠ Seed data already exists or failed:', error.message);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:', error);
    process.exit(1);
  }
}

// Only run migrate() when this file is executed directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  migrate();
}
