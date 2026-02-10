import pg from 'pg';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'content_collector',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'JH1219QQ',
});

async function addIndexes() {
  try {
    console.log('Adding search indexes...\n');
    
    const filePath = path.join(__dirname, 'src', 'db', 'migrations', '004_add_search_indexes.sql');
    const sql = await fs.readFile(filePath, 'utf-8');
    
    await pool.query(sql);
    
    console.log('✓ Search indexes added successfully!');
    console.log('\nIndexes created:');
    console.log('  - idx_content_items_user_id');
    console.log('  - idx_content_items_title_lower');
    console.log('  - idx_content_items_description_lower');
    console.log('  - idx_content_items_created_at');
    console.log('  - idx_content_items_platform');
    console.log('  - idx_content_items_folder_id');
    console.log('  - idx_content_items_user_created');
    console.log('  - idx_content_tags_content_id');
    console.log('  - idx_content_tags_tag_id');
    console.log('  - idx_tags_name_lower');
    console.log('  - idx_tags_user_name');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('✗ Failed to add indexes:', error);
    await pool.end();
    process.exit(1);
  }
}

addIndexes();
