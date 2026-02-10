// Quick script to add description field to folders table
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'content_collector',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'JH1219QQ',
});

async function addDescriptionField() {
  try {
    console.log('Adding description field to folders table...');
    
    await pool.query('ALTER TABLE folders ADD COLUMN IF NOT EXISTS description TEXT');
    
    console.log('✓ Description field added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Failed to add description field:', error);
    process.exit(1);
  }
}

addDescriptionField();
