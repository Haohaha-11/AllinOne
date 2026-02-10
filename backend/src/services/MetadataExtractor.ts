import axios from 'axios';
import * as cheerio from 'cheerio';
import { Platform, ContentType } from '../types/index.js';

export interface ContentMetadata {
  title: string;
  description: string;
  coverImage: string;
  author: string;
  publishDate?: Date;
  contentType: ContentType;
  platform: Platform;
}

export class MetadataExtractor {
  private static readonly TIMEOUT = 10000; // 10秒超时
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000; // 1秒

  /**
   * 从URL提取元数据
   */
  static async extract(url: string, platform: Platform): Promise<ContentMetadata> {
    let lastError: Error | null = null;

    console.log(`[MetadataExtractor] Extracting metadata for ${platform}:`, url);

    // 重试机制
    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        const html = await this.fetchHtml(url);
        const $ = cheerio.load(html);

        // 提取元数据
        const metadata = this.extractMetadata($, platform);

        // 验证必需字段
        if (!metadata.title) {
          throw new Error('Failed to extract title');
        }

        console.log(`[MetadataExtractor] Successfully extracted metadata:`, {
          title: metadata.title,
          hasCoverImage: !!metadata.coverImage,
          coverImageUrl: metadata.coverImage ? metadata.coverImage.substring(0, 100) + '...' : 'none',
        });

        return metadata;
      } catch (error) {
        lastError = error as Error;
        console.error(`Attempt ${attempt}/${this.MAX_RETRIES} failed:`, error);

        if (attempt < this.MAX_RETRIES) {
          await this.delay(this.RETRY_DELAY * attempt); // 指数退避
        }
      }
    }

    // 所有重试失败，返回降级数据
    console.warn('All extraction attempts failed, using fallback metadata');
    return this.getFallbackMetadata(url, platform, lastError);
  }

  /**
   * 获取HTML内容
   */
  private static async fetchHtml(url: string): Promise<string> {
    const response = await axios.get(url, {
      timeout: this.TIMEOUT,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
    });

    return response.data;
  }

  /**
   * 从HTML中提取元数据
   */
  private static extractMetadata($: cheerio.CheerioAPI, platform: Platform): ContentMetadata {
    // 小红书特殊处理
    if (platform === Platform.XIAOHONGSHU) {
      return this.extractXiaohongshuMetadata($);
    }

    // 知乎特殊处理
    if (platform === Platform.ZHIHU) {
      return this.extractZhihuMetadata($);
    }

    // 微信特殊处理
    if (platform === Platform.WECHAT) {
      return this.extractWechatMetadata($);
    }

    // 提取标题（优先级：og:title > meta title > h1 > title）
    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="title"]').attr('content') ||
      $('h1').first().text().trim() ||
      $('title').text().trim() ||
      '';

    // 提取描述
    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('meta[name="Description"]').attr('content') ||
      '';

    // 提取封面图（多种方式）
    let coverImage =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="image"]').attr('content') ||
      $('meta[property="twitter:image"]').attr('content') ||
      $('meta[itemprop="image"]').attr('content') ||
      $('link[rel="image_src"]').attr('href') ||
      '';

    // 如果还没找到图片，尝试从内容中提取第一张图片
    if (!coverImage) {
      const firstImg = $('article img, .content img, .post img, img').first();
      coverImage = 
        firstImg.attr('src') || 
        firstImg.attr('data-src') || 
        firstImg.attr('data-original') ||
        '';
    }

    // 清理和验证图片URL
    coverImage = this.cleanImageUrl(coverImage);

    // 提取作者
    const author =
      $('meta[property="og:author"]').attr('content') ||
      $('meta[name="author"]').attr('content') ||
      $('meta[property="article:author"]').attr('content') ||
      '';

    // 提取发布日期
    const publishDateStr =
      $('meta[property="article:published_time"]').attr('content') ||
      $('meta[name="publish_date"]').attr('content') ||
      '';

    const publishDate = publishDateStr ? new Date(publishDateStr) : undefined;

    // 判断内容类型（基于平台和元数据）
    const contentType = this.determineContentType($, platform);

    console.log('[Generic] Extracted metadata:', { title, coverImage: coverImage ? 'found' : 'not found' });

    return {
      title: title || '未命名内容',
      description: description || '',
      coverImage: coverImage || '',
      author: author || '',
      publishDate,
      contentType,
      platform,
    };
  }

  /**
   * 提取知乎元数据
   */
  private static extractZhihuMetadata($: cheerio.CheerioAPI): ContentMetadata {
    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('h1.QuestionHeader-title').text().trim() ||
      $('h1').first().text().trim() ||
      $('title').text().replace(' - 知乎', '').trim() ||
      '';

    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      '';

    // 知乎图片可能在多个位置
    let coverImage =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[itemprop="image"]').attr('content') ||
      '';

    // 尝试从内容中提取
    if (!coverImage) {
      const contentImg = $('.RichContent-inner img, .Post-RichTextContainer img, .ArticleItem-image img, img').first();
      coverImage = 
        contentImg.attr('src') || 
        contentImg.attr('data-original') || 
        contentImg.attr('data-actualsrc') ||
        contentImg.attr('data-src') ||
        '';
    }

    // 清理和验证图片URL
    coverImage = this.cleanImageUrl(coverImage);

    const author =
      $('meta[property="og:author"]').attr('content') ||
      $('meta[name="author"]').attr('content') ||
      $('.AuthorInfo-name').text().trim() ||
      '';

    console.log('[Zhihu] Extracted metadata:', { title, coverImage: coverImage ? 'found' : 'not found' });

    return {
      title: title || '知乎内容',
      description: description || '',
      coverImage: coverImage || '',
      author: author || '',
      contentType: 'article',
      platform: Platform.ZHIHU,
    };
  }

  /**
   * 提取微信元数据
   */
  private static extractWechatMetadata($: cheerio.CheerioAPI): ContentMetadata {
    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('#activity-name').text().trim() ||
      $('h1').first().text().trim() ||
      $('title').text().trim() ||
      '';

    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      '';

    // 微信文章图片
    let coverImage =
      $('meta[property="og:image"]').attr('content') ||
      $('#js_cover').attr('src') ||
      '';

    // 尝试从内容中提取第一张图片
    if (!coverImage) {
      const contentImg = $('#js_content img, .rich_media_content img, img').first();
      coverImage = 
        contentImg.attr('src') || 
        contentImg.attr('data-src') || 
        contentImg.attr('data-original') ||
        '';
    }

    // 清理和验证图片URL
    coverImage = this.cleanImageUrl(coverImage);

    const author =
      $('meta[name="author"]').attr('content') ||
      $('#js_name').text().trim() ||
      $('.rich_media_meta_text').text().trim() ||
      '';

    console.log('[WeChat] Extracted metadata:', { title, coverImage: coverImage ? 'found' : 'not found' });

    return {
      title: title || '微信文章',
      description: description || '',
      coverImage: coverImage || '',
      author: author || '',
      contentType: 'article',
      platform: Platform.WECHAT,
    };
  }

  /**
   * 提取小红书元数据
   */
  private static extractXiaohongshuMetadata($: cheerio.CheerioAPI): ContentMetadata {
    // 小红书使用特殊的meta标签
    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="og:title"]').attr('content') ||
      $('title').text().replace(' - 小红书', '').trim() ||
      '';

    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      '';

    const coverImage =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="og:image"]').attr('content') ||
      '';

    // 小红书作者信息可能在不同位置
    const author =
      $('meta[name="author"]').attr('content') ||
      $('meta[property="og:author"]').attr('content') ||
      '';

    return {
      title: title || '小红书笔记',
      description: description || '',
      coverImage: coverImage || '',
      author: author || '',
      contentType: 'article',
      platform: Platform.XIAOHONGSHU,
    };
  }

  /**
   * 判断内容类型
   */
  private static determineContentType($: cheerio.CheerioAPI, platform: Platform): ContentType {
    // 根据平台判断
    if (platform === Platform.DOUYIN || platform === Platform.BILIBILI) {
      return 'video';
    }

    // 检查meta标签
    const ogType = $('meta[property="og:type"]').attr('content');
    if (ogType === 'video' || ogType === 'video.other') {
      return 'video';
    }

    // 检查是否有video标签
    if ($('video').length > 0) {
      return 'video';
    }

    // 默认为文章
    return 'article';
  }

  /**
   * 获取降级元数据（当提取失败时）
   */
  private static getFallbackMetadata(
    url: string,
    platform: Platform,
    _error: Error | null
  ): ContentMetadata {
    return {
      title: url,
      description: '待完善',
      coverImage: '',
      author: '',
      contentType: 'article',
      platform,
    };
  }

  /**
   * 延迟函数
   */
  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 清理和验证图片URL
   * - 移除查询参数中的无用参数
   * - 确保URL是有效的HTTP/HTTPS链接
   * - 处理相对URL（如果可能）
   */
  private static cleanImageUrl(url: string): string {
    if (!url) return '';

    try {
      // 移除前后空格
      url = url.trim();

      // 如果是data URL，直接返回（虽然很少见）
      if (url.startsWith('data:')) {
        return url;
      }

      // 如果是相对URL，尝试转换为绝对URL（但这需要原始URL，这里先跳过）
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        // 如果是//开头，添加https:
        if (url.startsWith('//')) {
          url = 'https:' + url;
        } else {
          // 相对URL无法处理，返回空
          console.warn('[MetadataExtractor] Relative URL cannot be processed:', url);
          return '';
        }
      }

      // 解析URL并清理
      const parsedUrl = new URL(url);

      // 移除一些常见的追踪参数
      const paramsToRemove = ['utm_source', 'utm_medium', 'utm_campaign', 'from', 'share'];
      paramsToRemove.forEach((param) => {
        parsedUrl.searchParams.delete(param);
      });

      return parsedUrl.toString();
    } catch (error) {
      console.warn('[MetadataExtractor] Invalid image URL:', url, error);
      return '';
    }
  }
}
