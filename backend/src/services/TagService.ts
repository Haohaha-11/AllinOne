import { TagModel } from '../models/Tag.js';
import type { Tag } from '../types/index.js';

export interface TagWithCount extends Tag {
  contentCount: number;
}

export class TagService {
  /**
   * 创建标签
   */
  static async create(name: string, userId: string): Promise<Tag> {
    // 检查标签是否已存在
    const existing = await TagModel.findByName(userId, name);
    if (existing) {
      throw new Error('Tag already exists');
    }

    return await TagModel.create(userId, name);
  }

  /**
   * 重命名标签
   */
  static async rename(id: string, newName: string): Promise<Tag> {
    const existing = await TagModel.findById(id);
    if (!existing) {
      throw new Error('Tag not found');
    }

    // 检查新名称是否已被使用
    const duplicate = await TagModel.findByName(existing.user_id, newName);
    if (duplicate && duplicate.id !== id) {
      throw new Error('Tag name already in use');
    }

    return await TagModel.update(id, newName);
  }

  /**
   * 删除标签
   */
  static async delete(id: string): Promise<void> {
    const existing = await TagModel.findById(id);
    if (!existing) {
      throw new Error('Tag not found');
    }

    await TagModel.delete(id);
  }

  /**
   * 获取所有标签（带内容数量）
   */
  static async getAll(userId: string): Promise<TagWithCount[]> {
    const tags = await TagModel.findByUserId(userId);

    const tagsWithCount = await Promise.all(
      tags.map(async (tag) => {
        const contentCount = await TagModel.getContentCount(tag.id);
        return {
          ...tag,
          contentCount,
        };
      })
    );

    return tagsWithCount;
  }

  /**
   * 为内容添加标签
   */
  static async addToContent(contentId: string, tagIds: string[]): Promise<void> {
    for (const tagId of tagIds) {
      await TagModel.addToContent(contentId, tagId);
    }
  }

  /**
   * 从内容移除标签
   */
  static async removeFromContent(contentId: string, tagIds: string[]): Promise<void> {
    for (const tagId of tagIds) {
      await TagModel.removeFromContent(contentId, tagId);
    }
  }

  /**
   * 获取标签的内容数量
   */
  static async getContentCount(tagId: string): Promise<number> {
    return await TagModel.getContentCount(tagId);
  }

  /**
   * 获取内容的所有标签
   */
  static async getContentTags(contentId: string): Promise<Tag[]> {
    return await TagModel.findByContentId(contentId);
  }

  /**
   * 获取标签下的所有内容
   */
  static async getContentsByTag(tagId: string): Promise<any[]> {
    return await TagModel.getContentsByTag(tagId);
  }
}
