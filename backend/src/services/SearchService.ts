import { pool } from '../config/database.js';
import { redisClient } from '../config/redis.js';
import type { ContentItem, Platform, ContentType } from '../types/index.js';

export interface SearchQuery {
  userId?: string;
  keyword?: string;
  platforms?: Platform[];
  tags?: string[];
  folderId?: string;
  contentType?: ContentType;
  dateRange?: { start: Date; end: Date };
  sortBy?: 'created_at' | 'title';
  sortOrder?: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

export interface SearchResult {
  items: ContentItem[];
  total: number;
  page: number;
  pageSize: number;
}

export class SearchService {
  private static readonly CACHE_TTL = 300; // 5分钟

  /**
   * 搜索内容
   */
  static async search(query: SearchQuery): Promise<SearchResult> {
    console.log('Search called with query:', query);
    
    // 暂时完全禁用缓存
    // const cacheKey = this.getCacheKey(query);
    // const cached = await this.getFromCache(cacheKey);
    // if (cached) {
    //   console.log('Search result from cache');
    //   return cached;
    // }

    // 构建SQL查询
    const { sql, params } = this.buildSearchQuery(query);
    
    console.log('Search SQL:', sql);
    console.log('Search params:', params);

    // 执行查询
    console.log('Executing query...');
    const result = await pool.query(sql, params);
    console.log('Query executed, rows:', result.rows.length);
    const items = result.rows;

    // 获取总数
    const total = items.length > 0 ? parseInt(items[0].total_count || '0') : 0;

    const searchResult: SearchResult = {
      items,
      total,
      page: query.page,
      pageSize: query.pageSize,
    };

    // 暂时禁用缓存
    // await this.saveToCache(cacheKey, searchResult);

    console.log('Returning search result');
    return searchResult;
  }

  /**
   * 构建搜索SQL查询 - Simplified and fixed
   */
  private static buildSearchQuery(query: SearchQuery): { sql: string; params: any[] } {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // User ID filter (required)
    if (query.userId) {
      conditions.push(`ci.user_id = $${paramIndex}`);
      params.push(query.userId);
      paramIndex++;
    }

    // 关键词搜索 - Search in title, description, and tags
    if (query.keyword) {
      const searchPattern = `%${query.keyword.toLowerCase()}%`;
      conditions.push(`(
        LOWER(ci.title) LIKE $${paramIndex} OR 
        LOWER(ci.description) LIKE $${paramIndex} OR
        EXISTS (
          SELECT 1 FROM content_tags ct
          JOIN tags t ON ct.tag_id = t.id
          WHERE ct.content_id = ci.id 
          AND LOWER(t.name) LIKE $${paramIndex}
        )
      )`);
      params.push(searchPattern);
      paramIndex++;
    }

    // 平台筛选
    if (query.platforms && query.platforms.length > 0) {
      conditions.push(`ci.platform = ANY($${paramIndex})`);
      params.push(query.platforms);
      paramIndex++;
    }

    // 内容类型筛选
    if (query.contentType) {
      conditions.push(`ci.content_type = $${paramIndex}`);
      params.push(query.contentType);
      paramIndex++;
    }

    // 文件夹筛选
    if (query.folderId) {
      conditions.push(`ci.folder_id = $${paramIndex}`);
      params.push(query.folderId);
      paramIndex++;
    }

    // 时间范围筛选
    if (query.dateRange) {
      conditions.push(`ci.created_at >= $${paramIndex}`);
      params.push(query.dateRange.start);
      paramIndex++;

      conditions.push(`ci.created_at <= $${paramIndex}`);
      params.push(query.dateRange.end);
      paramIndex++;
    }

    // 标签筛选
    if (query.tags && query.tags.length > 0) {
      conditions.push(`
        ci.id IN (
          SELECT content_id FROM content_tags
          WHERE tag_id = ANY($${paramIndex})
        )
      `);
      params.push(query.tags);
      paramIndex++;
    }

    // 排序
    const sortBy = query.sortBy || 'created_at';
    const sortOrder = query.sortOrder || 'desc';

    // 分页
    const offset = (query.page - 1) * query.pageSize;
    const limitParam = paramIndex;
    const offsetParam = paramIndex + 1;
    params.push(query.pageSize, offset);

    // 构建完整SQL - Simplified without CTE for now
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
      SELECT 
        ci.*,
        COUNT(*) OVER() as total_count,
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
      ${whereClause}
      ORDER BY ci.${sortBy} ${sortOrder.toUpperCase()}
      LIMIT $${limitParam} OFFSET $${offsetParam}
    `;

    return { sql, params };
  }

  /**
   * 生成缓存键
   */
  private static getCacheKey(query: SearchQuery): string {
    return `search:${JSON.stringify(query)}`;
  }

  /**
   * 从缓存获取
   */
  private static async getFromCache(key: string): Promise<SearchResult | null> {
    try {
      if (!redisClient.isOpen) {
        return null;
      }
      const cached = await redisClient.get(key);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      // 静默处理缓存错误
    }
    return null;
  }

  /**
   * 保存到缓存
   */
  private static async saveToCache(key: string, data: SearchResult): Promise<void> {
    try {
      if (!redisClient.isOpen) {
        return;
      }
      await redisClient.setEx(key, this.CACHE_TTL, JSON.stringify(data));
    } catch (error) {
      // 静默处理缓存错误
    }
  }
}
