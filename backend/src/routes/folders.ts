import express from 'express';
import { FolderService } from '../services/FolderService.js';

const router = express.Router();

// POST /api/folders - 创建文件夹
router.post('/', async (req, res) => {
  try {
    const { name, parentId, description } = req.body;
    const userId = req.body.userId || '550e8400-e29b-41d4-a716-446655440000'; // 默认测试用户

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const folder = await FolderService.create({ userId, name, parentId, description });
    res.status(201).json(folder);
  } catch (error: any) {
    console.error('Create folder error:', error);
    res.status(500).json({ error: error.message || 'Failed to create folder' });
  }
});

// PUT /api/folders/:id - 更新文件夹
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const folder = await FolderService.update(id, { name, description });
    res.json(folder);
  } catch (error: any) {
    console.error('Update folder error:', error);
    res.status(500).json({ error: error.message || 'Failed to update folder' });
  }
});

// DELETE /api/folders/:id - 删除文件夹
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteContents = req.query.deleteContents === 'true';

    await FolderService.delete(id, deleteContents);
    res.status(204).send();
  } catch (error: any) {
    console.error('Delete folder error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete folder' });
  }
});

// GET /api/folders/tree - 获取文件夹树
router.get('/tree', async (req, res) => {
  try {
    const userId = req.query.userId as string || '550e8400-e29b-41d4-a716-446655440000'; // 默认测试用户
    const tree = await FolderService.getTree(userId);
    res.json(tree);
  } catch (error: any) {
    console.error('Get folder tree error:', error);
    res.status(500).json({ error: error.message || 'Failed to get folder tree' });
  }
});

// GET /api/folders/:id/contents - 获取文件夹内容
router.get('/:id/contents', async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 50;

    const contents = await FolderService.getContents(id, page, pageSize);
    res.json(contents);
  } catch (error: any) {
    console.error('Get folder contents error:', error);
    res.status(500).json({ error: error.message || 'Failed to get folder contents' });
  }
});

export default router;
