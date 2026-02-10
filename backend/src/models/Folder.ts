import { pool } from '../config/database.js';
import type { Folder } from '../types/index.js';

export class FolderModel {
  static async create(userId: string, name: string, parentId?: string, description?: string): Promise<Folder> {
    const result = await pool.query(
      'INSERT INTO folders (user_id, name, parent_id, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, name, parentId || null, description || null]
    );
    return result.rows[0];
  }

  static async findById(id: string): Promise<Folder | null> {
    const result = await pool.query('SELECT * FROM folders WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByUserId(userId: string): Promise<Folder[]> {
    const result = await pool.query(
      'SELECT * FROM folders WHERE user_id = $1 ORDER BY created_at ASC',
      [userId]
    );
    return result.rows;
  }

  static async findByParentId(parentId: string | null, userId: string): Promise<Folder[]> {
    const query = parentId
      ? 'SELECT * FROM folders WHERE parent_id = $1 AND user_id = $2 ORDER BY name ASC'
      : 'SELECT * FROM folders WHERE parent_id IS NULL AND user_id = $1 ORDER BY name ASC';
    
    const params = parentId ? [parentId, userId] : [userId];
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async update(id: string, name: string, description?: string): Promise<Folder> {
    const result = await pool.query(
      'UPDATE folders SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [name, description || null, id]
    );
    return result.rows[0];
  }

  static async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM folders WHERE id = $1', [id]);
  }

  static async getContentCount(folderId: string): Promise<number> {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM content_items WHERE folder_id = $1',
      [folderId]
    );
    return parseInt(result.rows[0].count);
  }
}
