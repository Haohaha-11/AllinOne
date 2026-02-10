// 测试链接解析
import { LinkParser } from './src/services/LinkParser.js';

const testUrls = [
  'https://www.xiaohongshu.com/discovery/item/69847a7000000000220328a2?source=webshare&xhsshare=pc_web&xsec_token=CB7rsX7skFvbZ-d5-8fcBPZ1Z4_Wdjpmd_Ua_AwNZyzPE=&xsec_source=pc_share',
  'https://www.xiaohongshu.com/explore/63f8a9b0000000001303b0a1',
  'https://mp.weixin.qq.com/s/abc123',
  'https://zhuanlan.zhihu.com/p/123456',
];

console.log('🧪 测试链接解析\n');

testUrls.forEach((url, index) => {
  console.log(`\n测试 ${index + 1}: ${url.substring(0, 80)}...`);
  const result = LinkParser.parse(url);
  console.log('结果:', {
    平台: result.platform,
    内容ID: result.contentId,
    是否有效: result.isValid,
    标准化URL: result.normalizedUrl.substring(0, 100) + '...',
    错误: result.error || '无',
  });
});

console.log('\n\n✅ 测试完成');
