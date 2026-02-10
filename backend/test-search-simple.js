import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'content_collector',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'JH1219QQ',
  query_timeout: 3000,
});

const userId = '550e8400-e29b-41d4-a716-446655440000';

async function testSimpleQuery() {
  console.log('Testing simple query...\n');
  
  try {
    // Test 1: Count total items
    console.log('1. Counting total items for user...');
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM content_items WHERE user_id = $1',
      [userId]
    );
    console.log(`   Total items: ${countResult.rows[0].count}\n`);
    
    // Test 2: Get all items (no search)
    console.log('2. Getting all items (limit 5)...');
    const allResult = await pool.query(
      'SELECT id, title, platform, created_at FROM content_items WHERE user_id = $1 ORDER BY created_at DESC LIMIT 5',
      [userId]
    );
    console.log(`   Found ${allResult.rows.length} items:`);
    allResult.rows.forEach(item => {
      console.log(`   - ${item.title} (${item.platform})`);
    });
    console.log('');
    
    // Test 3: Simple search by title
    console.log('3. Searching for "test" in title...');
    const searchResult = await pool.query(
      `SELECT id, title, platform FROM content_items 
       WHERE user_id = $1 AND LOWER(title) LIKE $2 
       LIMIT 5`,
      [userId, '%test%']
    );
    console.log(`   Found ${searchResult.rows.length} items:`);
    searchResult.rows.forEach(item => {
      console.log(`   - ${item.title} (${item.platform})`);
    });
    console.log('');
    
    // Test 4: Search with tags
    console.log('4. Getting items with tags...');
    const tagsResult = await pool.query(
      `SELECT 
        ci.id, 
        ci.title,
        COALESCE(
          (
            SELECT json_agg(json_build_object('id', t.id, 'name', t.name))
            FROM content_tags ct
            JOIN tags t ON ct.tag_id = t.id
            WHERE ct.content_id = ci.id
          ),
          '[]'
        ) as tags
       FROM content_items ci
       WHERE ci.user_id = $1
       LIMIT 3`,
      [userId]
    );
    console.log(`   Found ${tagsResult.rows.length} items:`);
    tagsResult.rows.forEach(item => {
      console.log(`   - ${item.title}`);
      console.log(`     Tags: ${JSON.stringify(item.tags)}`);
    });
    
    console.log('\n✓ All tests passed!');
    
  } catch (error) {
    console.error('✗ Test failed:', error.message);
    console.error('Error details:', error);
  } finally {
    await pool.end();
  }
}

testSimpleQuery();
