const axios = require('axios');
const cheerio = require('cheerio');

// Test URLs
const testUrls = {
  zhihu: 'https://zhuanlan.zhihu.com/p/123456789', // Replace with actual URL
  wechat: 'https://mp.weixin.qq.com/s/xxxxx' // Replace with actual URL
};

async function testImageExtraction(url, platform) {
  console.log(`\n=== Testing ${platform} ===`);
  console.log(`URL: ${url}`);
  
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
    });

    const $ = cheerio.load(response.data);
    
    console.log('\n--- Meta Tags ---');
    console.log('og:image:', $('meta[property="og:image"]').attr('content'));
    console.log('meta[name="image"]:', $('meta[name="image"]').attr('content'));
    console.log('twitter:image:', $('meta[property="twitter:image"]').attr('content'));
    console.log('itemprop="image":', $('meta[itemprop="image"]').attr('content'));
    
    if (platform === 'zhihu') {
      console.log('\n--- Zhihu Specific ---');
      console.log('RichContent img:', $('.RichContent-inner img').first().attr('src'));
      console.log('Post img:', $('.Post-RichTextContainer img').first().attr('src'));
      console.log('data-original:', $('.RichContent-inner img').first().attr('data-original'));
    }
    
    if (platform === 'wechat') {
      console.log('\n--- WeChat Specific ---');
      console.log('#js_cover:', $('#js_cover').attr('src'));
      console.log('#js_content img:', $('#js_content img').first().attr('src'));
      console.log('.rich_media_content img:', $('.rich_media_content img').first().attr('src'));
      console.log('data-src:', $('#js_content img').first().attr('data-src'));
    }
    
    console.log('\n--- Generic Content Images ---');
    const firstImg = $('article img, .content img, .post img, img').first();
    console.log('First img src:', firstImg.attr('src'));
    console.log('First img data-src:', firstImg.attr('data-src'));
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('Image Extraction Test');
  console.log('=====================');
  console.log('\nPlease replace the test URLs with actual Zhihu and WeChat URLs');
  console.log('Then run: node test-image-extraction.js\n');
  
  // Uncomment and add real URLs to test
  // await testImageExtraction(testUrls.zhihu, 'zhihu');
  // await testImageExtraction(testUrls.wechat, 'wechat');
}

runTests();
