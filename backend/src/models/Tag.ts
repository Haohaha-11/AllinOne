import { pool } from '../config/database.js';
import type { Tag } from '../types/index.js';

export class TagModel {
  static async create(userId: string, name: string): Promise<Tag> {
    const result = await pool.query(
      'INSERT INTO tags (user_id, name) VALUES ($1, $2) RETURNING *',
      [userId, name]
    );
    return result.rows[0];
  }

  static async findById(id: string): Promise<Tag | null> {
    const result = await pool.query('SELECT * FROM tags WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByUserId(userId: string): Promise<Tag[]> {
    const result = await pool.query(
      'SELECT * FROM tags WHERE user_id = $1 ORDER BY name ASC',
      [userId]
    );
    return result.rows;
  }

  static async findByName(userId: string, name: string): Promise<Tag | null> {
    const result = await pool.query(
      'SELECT * FROM tags WHERE user_id = $1 AND name = $2',
      [userId, name]
    );
    return result.rows[0] || null;
  }

  static async update(id: string, name: string): Promise<Tag> {
    const result = await pool.query(
      'UPDATE tags SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    return result.rows[0];
  }

  static async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM tags WHERE id = $1', [id]);
  }

  static async addToContent(contentId: string, tagId: string): Promise<void> {
    await pool.query(
      'INSERT INTO content_tags (content_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [contentId, tagId]
    );
  }

  static async removeFromContent(contentId: string, tagId: string): Promise<void> {
    await pool.query(
      'DELETE FROM content_tags WHERE content_id = $1 AND tag_id = $2',
      [contentId, tagId]
    );
  }

  static async findByContentId(contentId: string): Promise<Tag[]> {
    const result = await pool.query(
      `SELECT t.* FROM tags t
       INNER JOIN content_tags ct ON t.id = ct.tag_id
       WHERE ct.content_id = $1
       ORDER BY t.name ASC`,
      [contentId]
    );
    return result.rows;
  }

  static async getContentCount(tagId: string): Promise<number> {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM content_tags WHERE tag_id = $1',
      [tagId]
    );
    return parseInt(result.rows[0].count);
  }

  static async getContentsByTag(tagId: string): Promise<any[]> {
    const result = await pool.query(
      `SELECT ci.*, 
        COALESCE(
          json_agg(
            json_build_object('id', t.id, 'name', t.name)
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) as tags
       FROM content_items ci
       INNER JOIN content_tags ct ON ci.id = ct.content_id
       LEFT JOIN content_tags ct2 ON ci.id = ct2.content_id
       LEFT JOIN tags t ON ct2.tag_id = t.id
       WHERE ct.tag_id = $1
       GROUP BY ci.id
       ORDER BY ci.created_at DESC`,
      [tagId]
    );
    return result.rows;
  }
}
