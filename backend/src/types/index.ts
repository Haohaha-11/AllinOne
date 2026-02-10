// Platform types
export enum Platform {
  WECHAT = 'wechat',
  ZHIHU = 'zhihu',
  XIAOHONGSHU = 'xiaohongshu',
  DOUYIN = 'douyin',
  BILIBILI = 'bilibili',
  UNKNOWN = 'unknown',
}

// Content types
export type ContentType = 'article' | 'video';

// Database models
export interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface Folder {
  id: string;
  user_id: string;
  parent_id?: string;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ContentItem {
  id: string;
  user_id: string;
  folder_id?: string;
  url: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  author?: string;
  platform: Platform;
  content_type: ContentType;
  publish_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  created_at: Date;
}

export interface ContentTag {
  content_id: string;
  tag_id: string;
  created_at: Date;
}
