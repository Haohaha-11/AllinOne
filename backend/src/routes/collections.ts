import express from 'express';
import { CollectionService } from '../services/CollectionService.js';

const router = express.Router();

// POST /api/collections - 创建收藏
router.post('/', async (req, res) => {
  try {
    const { url, folderId, customTitle, customDescription, tags } = req.body;
    const userId = req.body.userId || '550e8400-e29b-41d4-a716-446655440000'; // 默认测试用户

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const item = await CollectionService.create({
      userId,
      url,
      folderId,
      customTitle,
      customDescription,
      tags,
    });

    res.status(201).json(item);
  } catch (error: any) {
    console.error('Create collection error:', error);
    res.status(500).json({ error: error.message || 'Failed to create collection' });
  }
});

// PUT /api/collections/:id - 更新收藏
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, coverImageUrl, author, folderId } = req.body;

    const item = await CollectionService.update(id, {
      title,
      description,
      coverImageUrl,
      author,
      folderId,
    });

    res.json(item);
  } catch (error: any) {
    console.error('Update collection error:', error);
    res.status(500).json({ error: error.message || 'Failed to update collection' });
  }
});

// DELETE /api/collections/:id - 删除收藏
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await CollectionService.delete(id);
    res.status(204).send();
  } catch (error: any) {
    console.error('Delete collection error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete collection' });
  }
});

// GET /api/collections/:id - 获取收藏详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await CollectionService.get(id);
    res.json(item);
  } catch (error: any) {
    console.error('Get collection error:', error);
    res.status(404).json({ error: error.message || 'Collection not found' });
  }
});

// POST /api/collections/:id/move - 移动到文件夹
router.post('/:id/move', async (req, res) => {
  try {
    const { id } = req.params;
    const { folderId } = req.body;

    const item = await CollectionService.moveToFolder(id, folderId || null);
    res.json(item);
  } catch (error: any) {
    console.error('Move collection error:', error);
    res.status(500).json({ error: error.message || 'Failed to move collection' });
  }
});

// GET /api/collections - 获取用户的所有收藏
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId as string || '550e8400-e29b-41d4-a716-446655440000'; // 默认测试用户
    const uncategorized = req.query.uncategorized === 'true';
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 50;

    let items;
    if (uncategorized) {
      const offset = (page - 1) * pageSize;
      items = await CollectionService.getUncategorized(userId, page, pageSize);
    } else {
      items = await CollectionService.getUserCollections(userId, page, pageSize);
    }
    
    res.json(items);
  } catch (error: any) {
    console.error('Get collections error:', error);
    res.status(500).json({ error: error.message || 'Failed to get collections' });
  }
});

// PATCH /api/collections/:id/priority - 更新优先级
router.patch('/:id/priority', async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    if (priority !== null && ![1, 2, 3].includes(priority)) {
      return res.status(400).json({ error: 'Priority must be 1, 2, 3, or null' });
    }

    const item = await CollectionService.updatePriority(id, priority);
    res.json(item);
  } catch (error: any) {
    console.error('Update priority error:', error);
    res.status(500).json({ error: error.message || 'Failed to update priority' });
  }
});

// PATCH /api/collections/:id/read-status - 更新已读状态
router.patch('/:id/read-status', async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;

    const item = await CollectionService.updateReadStatus(id, isRead);
    res.json(item);
  } catch (error: any) {
    console.error('Update read status error:', error);
    res.status(500).json({ error: error.message || 'Failed to update read status' });
  }
});

// PATCH /api/collections/:id/notes - 更新笔记
router.patch('/:id/notes', async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const item = await CollectionService.updateNotes(id, notes);
    res.json(item);
  } catch (error: any) {
    console.error('Update notes error:', error);
    res.status(500).json({ error: error.message || 'Failed to update notes' });
  }
});

export default router;
