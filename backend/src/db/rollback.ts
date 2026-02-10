import { pool } from '../config/database.js';

async function rollback() {
  try {
    console.log('Rolling back database...\n');
    
    // 删除所有表（按依赖顺序）
    await pool.query('DROP TABLE IF EXISTS content_tags CASCADE;');
    console.log('✓ Dropped table: content_tags');
    
    await pool.query('DROP TABLE IF EXISTS tags CASCADE;');
    console.log('✓ Dropped table: tags');
    
    await pool.query('DROP TABLE IF EXISTS content_items CASCADE;');
    console.log('✓ Dropped table: content_items');
    
    await pool.query('DROP TABLE IF EXISTS folders CASCADE;');
    console.log('✓ Dropped table: folders');
    
    await pool.query('DROP TABLE IF EXISTS users CASCADE;');
    console.log('✓ Dropped table: users');
    
    // 删除触发器函数
    await pool.query('DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;');
    console.log('✓ Dropped function: update_updated_at_column');
    
    console.log('\n✓ Rollback completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('✗ Rollback failed:', error);
    process.exit(1);
  }
}

rollback();
