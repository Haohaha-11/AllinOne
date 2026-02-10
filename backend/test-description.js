// Test script to verify description field exists
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'content_collector',
  user: 'postgres',
  password: 'JH1219QQ',
});

async function testDescription() {
  try {
    console.log('Testing description field...\n');
    
    // Check if column exists
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'folders' AND column_name = 'description'
    `);
    
    if (result.rows.length > 0) {
      console.log('✓ Description field exists!');
      console.log('  Column:', result.rows[0].column_name);
      console.log('  Type:', result.rows[0].data_type);
    } else {
      console.log('✗ Description field not found');
    }
    
    // Show all folders with their descriptions
    const folders = await pool.query('SELECT id, name, description, created_at FROM folders LIMIT 5');
    console.log('\nExisting folders:');
    folders.rows.forEach(folder => {
      console.log(`  - ${folder.name}: ${folder.description || '(no description)'}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Test failed:', error.message);
    process.exit(1);
  }
}

testDescription();
