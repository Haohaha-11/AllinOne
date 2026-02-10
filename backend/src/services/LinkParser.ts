import { Platform } from '../types/index.js';

export interface ParseResult {
  platform: Platform;
  contentId: string;
  isValid: boolean;
  normalizedUrl: string;
  error?: string;
}

export class LinkParser {
  private static platformPatterns: Record<Platform, RegExp[]> = {
    [Platform.WECHAT]: [
      /mp\.weixin\.qq\.com\/s/i,
      /mp\.weixin\.qq\.com\/s\?/i,
    ],
    [Platform.ZHIHU]: [
      /zhuanlan\.zhihu\.com\/p\/(\d+)/i,
      /zhihu\.com\/question\/(\d+)/i,
      /zhihu\.com\/answer\/(\d+)/i,
    ],
    [Platform.XIAOHONGSHU]: [
      /xiaohongshu\.com\/explore\/([a-zA-Z0-9]+)/i,
      /xiaohongshu\.com\/discovery\/item\/([a-zA-Z0-9]+)/i,
      /xhslink\.com\/([a-zA-Z0-9]+)/i,
      /xiaohongshu\.com/i, // 通用匹配
    ],
    [Platform.DOUYIN]: [
      /douyin\.com\/video\/(\d+)/i,
      /v\.douyin\.com/i,
      /iesdouyin\.com/i,
    ],
    [Platform.BILIBILI]: [
      /bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/i,
      /bilibili\.com\/video\/(av\d+)/i,
      /b23\.tv/i,
    ],
    [Platform.UNKNOWN]: [],
  };

  /**
   * 解析链接并识别平台
   */
  static parse(url: string): ParseResult {
    // 验证URL格式
    if (!url || typeof url !== 'string') {
      return {
        platform: Platform.UNKNOWN,
        contentId: '',
        isValid: false,
        normalizedUrl: '',
        error: 'Invalid URL: URL must be a non-empty string',
      };
    }

    // 清理URL（去除空格）
    let cleanUrl = url.trim();

    // 从文本中提取URL（处理小红书分享格式）
    cleanUrl = this.extractUrlFromText(cleanUrl);

    // 验证URL格式
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(cleanUrl);
    } catch (error) {
      return {
        platform: Platform.UNKNOWN,
        contentId: '',
        isValid: false,
        normalizedUrl: cleanUrl,
        error: 'Invalid URL format',
      };
    }

    // 识别平台
    for (const [platform, patterns] of Object.entries(this.platformPatterns)) {
      if (platform === Platform.UNKNOWN) continue;

      for (const pattern of patterns) {
        if (pattern.test(cleanUrl)) {
          const contentId = this.extractContentId(cleanUrl, pattern);
          return {
            platform: platform as Platform,
            contentId,
            isValid: true,
            normalizedUrl: this.normalizeUrl(cleanUrl, platform as Platform),
          };
        }
      }
    }

    // 未识别的平台
    return {
      platform: Platform.UNKNOWN,
      contentId: '',
      isValid: false,
      normalizedUrl: cleanUrl,
      error: 'Unsupported platform',
    };
  }

  /**
   * 从文本中提取URL
   * 处理小红书等平台的分享格式：
   * "94 【标题】 😆 code 😆 https://url"
   */
  private static extractUrlFromText(text: string): string {
    // 如果已经是有效URL，直接返回
    if (text.startsWith('http://') || text.startsWith('https://')) {
      return text;
    }

    // 使用正则提取URL
    const urlPattern = /(https?:\/\/[^\s]+)/i;
    const match = text.match(urlPattern);
    
    if (match && match[1]) {
      return match[1];
    }

    // 如果没有找到URL，返回原文本
    return text;
  }

  /**
   * 提取内容ID
   */
  private static extractContentId(url: string, pattern: RegExp): string {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
    
    // 特殊处理：从URL路径中提取ID
    try {
      const parsedUrl = new URL(url);
      
      // 小红书特殊处理：从 /discovery/item/ID 或 /explore/ID 中提取
      if (url.includes('xiaohongshu.com')) {
        const pathMatch = parsedUrl.pathname.match(/\/(discovery\/item|explore)\/([a-zA-Z0-9]+)/);
        if (pathMatch && pathMatch[2]) {
          return pathMatch[2];
        }
      }
      
      // 通用处理：使用路径的最后一部分
      const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
      return pathParts[pathParts.length - 1] || '';
    } catch {
      return '';
    }
  }

  /**
   * 标准化URL（移除追踪参数等）
   */
  private static normalizeUrl(url: string, platform: Platform): string {
    try {
      const parsedUrl = new URL(url);

      // 小红书需要保留某些参数（如xsec_token）
      if (platform === Platform.XIAOHONGSHU) {
        // 只移除明确的追踪参数
        const paramsToRemove = ['utm_source', 'utm_medium', 'utm_campaign', 'from'];
        paramsToRemove.forEach((param) => {
          parsedUrl.searchParams.delete(param);
        });
        return parsedUrl.toString();
      }

      // 其他平台移除所有追踪参数
      const paramsToRemove = ['utm_source', 'utm_medium', 'utm_campaign', 'from', 'share'];
      paramsToRemove.forEach((param) => {
        parsedUrl.searchParams.delete(param);
      });

      return parsedUrl.toString();
    } catch {
      return url;
    }
  }

  /**
   * 检查URL是否属于支持的平台
   */
  static isSupportedPlatform(url: string): boolean {
    const result = this.parse(url);
    return result.isValid && result.platform !== Platform.UNKNOWN;
  }

  /**
   * 获取所有支持的平台列表
   */
  static getSupportedPlatforms(): Platform[] {
    return Object.keys(this.platformPatterns).filter(
      (p) => p !== Platform.UNKNOWN
    ) as Platform[];
  }
}
