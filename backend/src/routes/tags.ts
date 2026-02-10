import express from 'express';
import { TagService } from '../services/TagService.js';

const router = express.Router();

// POST /api/tags - 创建标签
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.body.userId || '550e8400-e29b-41d4-a716-446655440000'; // 默认测试用户

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const tag = await TagService.create(name, userId);
    res.status(201).json(tag);
  } catch (error: any) {
    console.error('Create tag error:', error);
    res.status(500).json({ error: error.message || 'Failed to create tag' });
  }
});

// PUT /api/tags/:id - 重命名标签
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const tag = await TagService.rename(id, name);
    res.json(tag);
  } catch (error: any) {
    console.error('Rename tag error:', error);
    res.status(500).json({ error: error.message || 'Failed to rename tag' });
  }
});

// DELETE /api/tags/:id - 删除标签
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await TagService.delete(id);
    res.status(204).send();
  } catch (error: any) {
    console.error('Delete tag error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete tag' });
  }
});

// GET /api/tags - 获取所有标签
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId as string || '550e8400-e29b-41d4-a716-446655440000'; // 默认测试用户
    const tags = await TagService.getAll(userId);
    res.json(tags);
  } catch (error: any) {
    console.error('Get tags error:', error);
    res.status(500).json({ error: error.message || 'Failed to get tags' });
  }
});

// GET /api/tags/:id/contents - 获取标签下的所有内容
router.get('/:id/contents', async (req, res) => {
  try {
    const { id } = req.params;
    const contents = await TagService.getContentsByTag(id);
    res.json(contents);
  } catch (error: any) {
    console.error('Get tag contents error:', error);
    res.status(500).json({ error: error.message || 'Failed to get tag contents' });
  }
});

// POST /api/contents/:id/tags - 为内容添加标签
router.post('/contents/:id/tags', async (req, res) => {
  try {
    const { id } = req.params;
    const { tagIds } = req.body;

    if (!tagIds || !Array.isArray(tagIds)) {
      return res.status(400).json({ error: 'tagIds array is required' });
    }

    await TagService.addToContent(id, tagIds);
    res.status(204).send();
  } catch (error: any) {
    console.error('Add tags to content error:', error);
    res.status(500).json({ error: error.message || 'Failed to add tags' });
  }
});

// DELETE /api/contents/:id/tags - 从内容移除标签
router.delete('/contents/:id/tags', async (req, res) => {
  try {
    const { id } = req.params;
    const { tagIds } = req.body;

    if (!tagIds || !Array.isArray(tagIds)) {
      return res.status(400).json({ error: 'tagIds array is required' });
    }

    await TagService.removeFromContent(id, tagIds);
    res.status(204).send();
  } catch (error: any) {
    console.error('Remove tags from content error:', error);
    res.status(500).json({ error: error.message || 'Failed to remove tags' });
  }
});

export default router;
