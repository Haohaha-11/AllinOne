import { FolderModel } from '../models/Folder.js';
import { ContentItemModel } from '../models/ContentItem.js';
import type { Folder, ContentItem } from '../types/index.js';

export interface CreateFolderRequest {
  userId: string;
  name: string;
  parentId?: string;
  description?: string;
}

export interface UpdateFolderRequest {
  name: string;
  description?: string;
}

export interface FolderTree extends Folder {
  children: FolderTree[];
  contentCount: number;
}

export class FolderService {
  /**
   * 创建文件夹
   */
  static async create(data: CreateFolderRequest): Promise<Folder> {
    // 验证父文件夹存在（如果指定了）
    if (data.parentId) {
      const parent = await FolderModel.findById(data.parentId);
      if (!parent) {
        throw new Error('Parent folder not found');
      }
      if (parent.user_id !== data.userId) {
        throw new Error('Parent folder does not belong to user');
      }
    }

    return await FolderModel.create(data.userId, data.name, data.parentId, data.description);
  }

  /**
   * 更新文件夹
   */
  static async update(id: string, data: UpdateFolderRequest): Promise<Folder> {
    const existing = await FolderModel.findById(id);
    if (!existing) {
      throw new Error('Folder not found');
    }

    return await FolderModel.update(id, data.name, data.description);
  }

  /**
   * 删除文件夹
   */
  static async delete(id: string, deleteContents: boolean = false): Promise<void> {
    const existing = await FolderModel.findById(id);
    if (!existing) {
      throw new Error('Folder not found');
    }

    // 检查是否有内容
    const contentCount = await FolderModel.getContentCount(id);
    if (contentCount > 0 && !deleteContents) {
      throw new Error(
        `Folder contains ${contentCount} items. Set deleteContents=true to delete anyway.`
      );
    }

    // 如果不删除内容，将内容移到未分类
    if (!deleteContents && contentCount > 0) {
      // 这里应该将内容移到"未分类"文件夹
      // 暂时简化处理
    }

    await FolderModel.delete(id);
  }

  /**
   * 获取文件夹树
   */
  static async getTree(userId: string): Promise<FolderTree[]> {
    const allFolders = await FolderModel.findByUserId(userId);

    // 构建树形结构
    const folderMap = new Map<string, FolderTree>();
    const rootFolders: FolderTree[] = [];

    // 初始化所有文件夹
    for (const folder of allFolders) {
      const contentCount = await FolderModel.getContentCount(folder.id);
      folderMap.set(folder.id, {
        ...folder,
        children: [],
        contentCount,
      });
    }

    // 构建树
    for (const folder of allFolders) {
      const treeNode = folderMap.get(folder.id)!;
      if (folder.parent_id) {
        const parent = folderMap.get(folder.parent_id);
        if (parent) {
          parent.children.push(treeNode);
        }
      } else {
        rootFolders.push(treeNode);
      }
    }

    return rootFolders;
  }

  /**
   * 获取文件夹内容
   */
  static async getContents(
    id: string,
    page: number = 1,
    pageSize: number = 50
  ): Promise<ContentItem[]> {
    const folder = await FolderModel.findById(id);
    if (!folder) {
      throw new Error('Folder not found');
    }

    const offset = (page - 1) * pageSize;
    return await ContentItemModel.findByFolderId(id, pageSize, offset);
  }

  /**
   * 创建默认"未分类"文件夹
   */
  static async createDefaultFolder(userId: string): Promise<Folder> {
    return await FolderModel.create(userId, '未分类');
  }
}
