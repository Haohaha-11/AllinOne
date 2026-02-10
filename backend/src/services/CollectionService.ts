import { ContentItemModel, CreateContentItemData } from '../models/ContentItem.js';
import { LinkParser } from './LinkParser.js';
import { MetadataExtractor } from './MetadataExtractor.js';
import { TagService } from './TagService.js';
import type { ContentItem } from '../types/index.js';

export interface CreateCollectionRequest {
  userId: string;
  url: string;
  folderId?: string;
  customTitle?: string;
  customDescription?: string;
  tags?: string[];
}

export interface UpdateCollectionRequest {
  title?: string;
  description?: string;
  coverImageUrl?: string;
  author?: string;
  folderId?: string;
}

export class CollectionService {
  /**
   * 创建收藏
   */
  static async create(data: CreateCollectionRequest): Promise<ContentItem> {
    // 1. 解析链接
    const parseResult = LinkParser.parse(data.url);
    
    if (!parseResult.isValid) {
      throw new Error(`Invalid URL: ${parseResult.error || 'Unsupported platform'}`);
    }

    // 2. 提取元数据
    let metadata;
    try {
      metadata = await MetadataExtractor.extract(parseResult.normalizedUrl, parseResult.platform);
    } catch (error) {
      console.error('Metadata extraction failed:', error);
      // 使用降级数据
      metadata = {
        title: data.customTitle || data.url,
        description: data.customDescription || '待完善',
        coverImage: '',
        author: '',
        contentType: 'article' as const,
        platform: parseResult.platform,
      };
    }

    // 3. 创建内容项
    const contentData: CreateContentItemData = {
      userId: data.userId,
      url: parseResult.normalizedUrl,
      title: data.customTitle || metadata.title,
      description: data.customDescription || metadata.description,
      coverImageUrl: metadata.coverImage,
      author: metadata.author,
      platform: metadata.platform,
      contentType: metadata.contentType,
      publishDate: metadata.publishDate,
      folderId: data.folderId,
    };

    const contentItem = await ContentItemModel.create(contentData);

    // 4. 处理标签
    if (data.tags && data.tags.length > 0) {
      const tagIds: string[] = [];
      
      for (const tagName of data.tags) {
        if (tagName.trim()) {
          try {
            // 尝试创建标签（如果已存在会返回现有标签）
            const tag = await TagService.create(tagName.trim(), data.userId);
            tagIds.push(tag.id);
          } catch (error: any) {
            // 如果标签已存在，查找它
            if (error.message === 'Tag already exists') {
              const existingTags = await TagService.getAll(data.userId);
              const existingTag = existingTags.find(t => t.name === tagName.trim());
              if (existingTag) {
                tagIds.push(existingTag.id);
              }
            }
          }
        }
      }

      // 将标签关联到内容
      if (tagIds.length > 0) {
        await TagService.addToContent(contentItem.id, tagIds);
      }
    }

    return contentItem;
  }

  /**
   * 更新收藏
   */
  static async update(id: string, data: UpdateCollectionRequest): Promise<ContentItem> {
    const existing = await ContentItemModel.findById(id);
    if (!existing) {
      throw new Error('Content item not found');
    }

    return await ContentItemModel.update(id, data);
  }

  /**
   * 删除收藏
   */
  static async delete(id: string): Promise<void> {
    const existing = await ContentItemModel.findById(id);
    if (!existing) {
      throw new Error('Content item not found');
    }

    await ContentItemModel.delete(id);
  }

  /**
   * 获取收藏详情
   */
  static async get(id: string): Promise<ContentItem> {
    const item = await ContentItemModel.findById(id);
    if (!item) {
      throw new Error('Content item not found');
    }

    return item;
  }

  /**
   * 移动到文件夹
   */
  static async moveToFolder(id: string, folderId: string | null): Promise<ContentItem> {
    const existing = await ContentItemModel.findById(id);
    if (!existing) {
      throw new Error('Content item not found');
    }

    return await ContentItemModel.moveToFolder(id, folderId);
  }

  /**
   * 获取用户的所有收藏
   */
  static async getUserCollections(
    userId: string,
    page: number = 1,
    pageSize: number = 50
  ): Promise<ContentItem[]> {
    const offset = (page - 1) * pageSize;
    return await ContentItemModel.findByUserId(userId, pageSize, offset);
  }

  /**
   * 获取未分类的收藏
   */
  static async getUncategorized(
    userId: string,
    page: number = 1,
    pageSize: number = 50
  ): Promise<ContentItem[]> {
    const offset = (page - 1) * pageSize;
    return await ContentItemModel.findUncategorized(userId, pageSize, offset);
  }

  /**
   * 获取文件夹中的收藏
   */
  static async getFolderCollections(
    folderId: string,
    page: number = 1,
    pageSize: number = 50
  ): Promise<ContentItem[]> {
    const offset = (page - 1) * pageSize;
    return await ContentItemModel.findByFolderId(folderId, pageSize, offset);
  }

  /**
   * 更新优先级
   */
  static async updatePriority(id: string, priority: number | null): Promise<ContentItem> {
    return await ContentItemModel.updatePriority(id, priority);
  }

  /**
   * 更新已读状态
   */
  static async updateReadStatus(id: string, isRead: boolean): Promise<ContentItem> {
    return await ContentItemModel.updateReadStatus(id, isRead);
  }

  /**
   * 更新笔记
   */
  static async updateNotes(id: string, notes: string): Promise<ContentItem> {
    return await ContentItemModel.updateNotes(id, notes);
  }
}
