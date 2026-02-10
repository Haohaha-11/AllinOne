import { pool } from '../config/database.js';
import type { ContentItem, Platform, ContentType } from '../types/index.js';

export interface CreateContentItemData {
  userId: string;
  url: string;
  title: string;
  platform: Platform;
  contentType: ContentType;
  description?: string;
  coverImageUrl?: string;
  author?: string;
  publishDate?: Date;
  folderId?: string;
}

export class ContentItemModel {
  static async create(data: CreateContentItemData): Promise<ContentItem> {
    const result = await pool.query(
      `INSERT INTO content_items 
       (user_id, url, title, platform, content_type, description, cover_image_url, author, publish_date, folder_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        data.userId,
        data.url,
        data.title,
        data.platform,
        data.contentType,
        data.description || null,
        data.coverImageUrl || null,
        data.author || null,
        data.publishDate || null,
        data.folderId || null,
      ]
    );
    return result.rows[0];
  }

  static async findById(id: string): Promise<ContentItem | null> {
    const result = await pool.query('SELECT * FROM content_items WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async findByUserId(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<ContentItem[]> {
    const result = await pool.query(
      `SELECT ci.*, 
        COALESCE(
          json_agg(
            json_build_object('id', t.id, 'name', t.name)
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) as tags
       FROM content_items ci
       LEFT JOIN content_tags ct ON ci.id = ct.content_id
       LEFT JOIN tags t ON ct.tag_id = t.id
       WHERE ci.user_id = $1
       GROUP BY ci.id
       ORDER BY ci.created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  }

  static async findByFolderId(
    folderId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<ContentItem[]> {
    const result = await pool.query(
      `SELECT ci.*, 
        COALESCE(
          json_agg(
            json_build_object('id', t.id, 'name', t.name)
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) as tags
       FROM content_items ci
       LEFT JOIN content_tags ct ON ci.id = ct.content_id
       LEFT JOIN tags t ON ct.tag_id = t.id
       WHERE ci.folder_id = $1
       GROUP BY ci.id
       ORDER BY ci.created_at DESC 
       LIMIT $2 OFFSET $3`,
      [folderId, limit, offset]
    );
    return result.rows;
  }

  static async findUncategorized(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<ContentItem[]> {
    const result = await pool.query(
      `SELECT ci.*, 
        COALESCE(
          json_agg(
            json_build_object('id', t.id, 'name', t.name)
          ) FILTER (WHERE t.id IS NOT NULL),
          '[]'
        ) as tags
       FROM content_items ci
       LEFT JOIN content_tags ct ON ci.id = ct.content_id
       LEFT JOIN tags t ON ct.tag_id = t.id
       WHERE ci.user_id = $1 AND ci.folder_id IS NULL
       GROUP BY ci.id
       ORDER BY ci.created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );
    return result.rows;
  }

  static async update(id: string, data: Partial<CreateContentItemData>): Promise<ContentItem> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.title !== undefined) {
      fields.push(`title = $${paramIndex++}`);
      values.push(data.title);
    }
    if (data.description !== undefined) {
      fields.push(`description = $${paramIndex++}`);
      values.push(data.description);
    }
    if (data.coverImageUrl !== undefined) {
      fields.push(`cover_image_url = $${paramIndex++}`);
      values.push(data.coverImageUrl);
    }
    if (data.author !== undefined) {
      fields.push(`author = $${paramIndex++}`);
      values.push(data.author);
    }
    if (data.folderId !== undefined) {
      fields.push(`folder_id = $${paramIndex++}`);
      values.push(data.folderId);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE content_items SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async delete(id: string): Promise<void> {
    await pool.query('DELETE FROM content_items WHERE id = $1', [id]);
  }

  static async moveToFolder(id: string, folderId: string | null): Promise<ContentItem> {
    const result = await pool.query(
      'UPDATE content_items SET folder_id = $1 WHERE id = $2 RETURNING *',
      [folderId, id]
    );
    return result.rows[0];
  }

  /**
   * 更新优先级
   */
  static async updatePriority(id: string, priority: number | null): Promise<ContentItem> {
    const query = `
      UPDATE content_items
      SET priority = $1
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [priority, id]);
    return result.rows[0];
  }

  /**
   * 更新已读状态
   */
  static async updateReadStatus(id: string, isRead: boolean): Promise<ContentItem> {
    const query = `
      UPDATE content_items
      SET is_read = $1
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [isRead, id]);
    return result.rows[0];
  }

  /**
   * 更新笔记
   */
  static async updateNotes(id: string, notes: string): Promise<ContentItem> {
    const query = `
      UPDATE content_items
      SET notes = $1, notes_updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [notes, id]);
    return result.rows[0];
  }
}
