import express from 'express';
import { LinkParser } from '../services/LinkParser.js';
import { MetadataExtractor } from '../services/MetadataExtractor.js';

const router = express.Router();

// POST /api/parse - 解析链接并提取元数据
router.post('/', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // 解析链接
    const parseResult = LinkParser.parse(url);

    if (!parseResult.isValid) {
      return res.status(400).json({
        error: parseResult.error || 'Invalid or unsupported URL',
        parseResult,
      });
    }

    // 提取元数据
    try {
      const metadata = await MetadataExtractor.extract(
        parseResult.normalizedUrl,
        parseResult.platform
      );

      res.json({
        parseResult,
        metadata,
      });
    } catch (error: any) {
      console.error('Metadata extraction error:', error);
      // 返回解析结果，但标记元数据提取失败
      res.json({
        parseResult,
        metadata: null,
        error: 'Failed to extract metadata',
      });
    }
  } catch (error: any) {
    console.error('Parse error:', error);
    res.status(500).json({ error: error.message || 'Parse failed' });
  }
});

export default router;
