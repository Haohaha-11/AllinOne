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

async function addFields() {
  try {
    console.log('Adding status and notes fields...\n');
    
    const filePath = path.join(__dirname, 'src', 'db', 'migrations', '005_add_status_and_notes.sql');
    const sql = await fs.readFile(filePath, 'utf-8');
    
    await pool.query(sql);
    
    console.log('✓ Fields added successfully!');
    console.log('\nNew fields:');
    console.log('  - priority (INTEGER): 1=low, 2=medium, 3=high');
    console.log('  - is_read (BOOLEAN): read status');
    console.log('  - notes (TEXT): markdown notes');
    console.log('  - notes_updated_at (TIMESTAMP): last note update time');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('✗ Failed to add fields:', error);
    await pool.end();
    process.exit(1);
  }
}

addFields();
