import express from 'express';
import { SearchService } from '../services/SearchService.js';
import { Platform, ContentType } from '../types/index.js';

const router = express.Router();

// GET /api/search - 搜索和筛选内容
router.get('/', async (req, res) => {
  try {
    const {
      userId,
      query,
      keyword,
      platforms,
      tags,
      contentType,
      dateStart,
      dateEnd,
      sortBy,
      sortOrder,
      page = '1',
      pageSize = '50',
    } = req.query;

    // 构建搜索查询
    const searchQuery: any = {
      page: parseInt(page as string),
      pageSize: parseInt(pageSize as string),
    };

    // Support both 'query' and 'keyword' parameters
    const searchTerm = (query || keyword) as string;
    if (searchTerm) {
      searchQuery.keyword = searchTerm;
    }

    // Add userId if provided
    if (userId) {
      searchQuery.userId = userId as string;
    }

    if (platforms) {
      searchQuery.platforms = (platforms as string).split(',') as Platform[];
    }

    if (tags) {
      searchQuery.tags = (tags as string).split(',');
    }

    if (contentType) {
      searchQuery.contentType = contentType as ContentType;
    }

    if (dateStart && dateEnd) {
      searchQuery.dateRange = {
        start: new Date(dateStart as string),
        end: new Date(dateEnd as string),
      };
    }

    if (sortBy) {
      searchQuery.sortBy = sortBy as 'created_at' | 'title';
    }

    if (sortOrder) {
      searchQuery.sortOrder = sortOrder as 'asc' | 'desc';
    }

    const result = await SearchService.search(searchQuery);
    // Return just the items array for frontend compatibility
    res.json(result.items);
  } catch (error: any) {
    console.error('Search error:', error);
    
    // Handle query timeout specifically
    if (error.code === '57014') {
      res.status(408).json({ 
        error: 'Search timeout: Query took too long to execute. Please try a more specific search term.',
        code: 'QUERY_TIMEOUT'
      });
    } else {
      res.status(500).json({ 
        error: error.message || 'Search failed',
        code: error.code || 'SEARCH_ERROR'
      });
    }
  }
});

export default router;
