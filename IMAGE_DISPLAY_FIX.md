# Image Display Fix for Zhihu and WeChat

## Problem
Images from Zhihu (知乎) and WeChat (微信) articles were not displaying on content cards.

## Root Causes

### 1. Insufficient Image Extraction
The metadata extractor was not checking all possible image sources:
- Missing `data-src`, `data-original`, `data-actualsrc` attributes (used for lazy loading)
- Not checking enough content selectors
- Not handling relative URLs properly

### 2. URL Validation Issues
- Relative URLs (e.g., `/path/to/image.jpg`) cannot be displayed
- URLs starting with `//` need `https:` prefix
- Some URLs contain tracking parameters that should be cleaned

### 3. Platform-Specific Challenges

#### Zhihu (知乎)
- Images may be in: `og:image`, `.RichContent-inner img`, `.Post-RichTextContainer img`, `.ArticleItem-image img`
- Attributes: `src`, `data-original`, `data-actualsrc`, `data-src`
- Images might be lazy-loaded

#### WeChat (微信)
- Images may be in: `og:image`, `#js_cover`, `#js_content img`, `.rich_media_content img`
- Attributes: `src`, `data-src`, `data-original`
- Some images require authentication

## Solution Implemented

### 1. Enhanced Image Extraction
Updated `MetadataExtractor.ts` to:
- Check multiple image attributes: `src`, `data-src`, `data-original`, `data-actualsrc`
- Search more content selectors
- Add platform-specific extraction methods for Zhihu and WeChat

### 2. URL Cleaning and Validation
Added `cleanImageUrl()` method to:
- Convert `//` URLs to `https://` URLs
- Remove tracking parameters
- Validate URL format
- Filter out invalid relative URLs

### 3. Better Logging
Added console logs to track:
- Metadata extraction process
- Whether cover image was found
- Image URL (truncated for readability)

## Testing

### 1. Check Backend Logs
When pasting a URL, look for:
```
[MetadataExtractor] Extracting metadata for zhihu: https://...
[Zhihu] Extracted metadata: { title: '...', coverImage: 'found' }
[MetadataExtractor] Successfully extracted metadata: { hasCoverImage: true, ... }
```

### 2. Check Database
```sql
docker exec -it allinone-postgres-1 psql -U postgres -d content_collector
SELECT id, title, cover_image_url FROM content_items ORDER BY created_at DESC LIMIT 5;
```

### 3. Check Frontend
- Open browser DevTools Console
- Look for image loading errors
- Check Network tab for failed image requests

## Known Limitations

### 1. CORS Restrictions
Some platforms block external access to images. Solutions:
- Use a proxy server to fetch images
- Download and re-host images
- Accept that some images won't display

### 2. Authentication Required
Some images require login to view. Solutions:
- Use authenticated requests (complex)
- Accept limitation for private content

### 3. Dynamic Content
Some pages load images via JavaScript after page load. Solutions:
- Use headless browser (Puppeteer/Playwright) instead of axios
- More complex but handles dynamic content

### 4. Relative URLs
Images with relative paths cannot be converted without the original page URL. Current implementation filters these out.

## Future Improvements

1. **Image Proxy**: Set up a proxy server to handle CORS and authentication
2. **Headless Browser**: Use Puppeteer for JavaScript-heavy pages
3. **Image Caching**: Download and cache images locally
4. **Fallback Images**: Use platform-specific default images when extraction fails
5. **URL Context**: Pass original URL to `cleanImageUrl()` to convert relative URLs

## Files Modified

- `backend/src/services/MetadataExtractor.ts` - Enhanced image extraction
- `frontend/src/components/ContentCard.tsx` - Already handles both field names

## How to Use

1. Restart the backend server to apply changes
2. Paste a Zhihu or WeChat URL
3. Check if the image displays on the card
4. If not, check backend logs and database to debug

## Debugging Steps

If images still don't display:

1. **Check if URL was extracted**:
   - Look at backend logs for "hasCoverImage: true"
   - Query database for cover_image_url value

2. **Check if URL is valid**:
   - Copy the cover_image_url from database
   - Try opening it directly in browser
   - If it doesn't open, the URL is invalid or requires auth

3. **Check for CORS errors**:
   - Open browser DevTools Console
   - Look for CORS-related errors
   - This means the image server blocks external access

4. **Check image attributes**:
   - Use the test script: `node backend/test-image-extraction.js`
   - Add actual URLs to test
   - See what attributes are available

## Example Test

```javascript
// Test with actual URLs
const testUrls = {
  zhihu: 'https://zhuanlan.zhihu.com/p/123456789',
  wechat: 'https://mp.weixin.qq.com/s/xxxxx'
};

// Paste these in the app and check:
// 1. Backend logs
// 2. Database cover_image_url field
// 3. Frontend card display
```
