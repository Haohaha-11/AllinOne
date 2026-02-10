# Image Display Fix - Summary

## What Was Fixed

Enhanced the metadata extraction service to properly extract and display cover images from Zhihu (知乎) and WeChat (微信) articles.

## Changes Made

### 1. Enhanced Image Extraction (`backend/src/services/MetadataExtractor.ts`)

#### For Zhihu:
- Added checks for multiple image attributes: `src`, `data-src`, `data-original`, `data-actualsrc`
- Expanded content selectors: `.RichContent-inner img`, `.Post-RichTextContainer img`, `.ArticleItem-image img`
- Added logging to track extraction success

#### For WeChat:
- Added checks for multiple image attributes: `src`, `data-src`, `data-original`
- Expanded content selectors: `#js_content img`, `.rich_media_content img`
- Added logging to track extraction success

#### For All Platforms:
- Added `cleanImageUrl()` method to:
  - Convert `//` URLs to `https://` URLs
  - Remove tracking parameters
  - Validate URL format
  - Filter out invalid relative URLs
- Added comprehensive logging for debugging

### 2. Better Logging
Added console logs at key points:
```
[MetadataExtractor] Extracting metadata for zhihu: https://...
[Zhihu] Extracted metadata: { title: '...', coverImage: 'found' }
[MetadataExtractor] Successfully extracted metadata: { hasCoverImage: true, ... }
```

## How to Test

### 1. Paste a Zhihu or WeChat URL
The backend server is already running with hot reload, so changes are active.

### 2. Check Backend Logs
Look for the extraction logs in the backend console to see if images are being found.

### 3. Check the Card
The image should now display on the content card if extraction was successful.

### 4. Debug if Needed
If images still don't show:

**Check Database:**
```bash
docker exec -it allinone-postgres-1 psql -U postgres -d content_collector
SELECT id, title, cover_image_url FROM content_items ORDER BY created_at DESC LIMIT 5;
```

**Check Browser Console:**
- Open DevTools (F12)
- Look for CORS errors or failed image requests
- Try opening the image URL directly

## Known Limitations

### 1. CORS Restrictions
Some platforms block external access to images. This is a server-side restriction that cannot be bypassed without a proxy.

**Solution Options:**
- Set up an image proxy server
- Download and re-host images
- Accept that some images won't display

### 2. Authentication Required
Some images require login to view (especially WeChat).

**Solution Options:**
- Use authenticated requests (complex)
- Accept limitation for private content

### 3. Dynamic Content
Some pages load images via JavaScript after initial page load.

**Solution Options:**
- Use headless browser (Puppeteer/Playwright)
- More complex but handles dynamic content

### 4. Relative URLs
Images with relative paths (e.g., `/images/photo.jpg`) cannot be converted without the original page URL context.

**Current Behavior:** These are filtered out and won't display.

## Testing Examples

Try pasting these types of URLs:

1. **Zhihu Article**: `https://zhuanlan.zhihu.com/p/[article-id]`
2. **Zhihu Question**: `https://www.zhihu.com/question/[question-id]`
3. **WeChat Article**: `https://mp.weixin.qq.com/s/[article-id]`

## Expected Results

### Success Case:
- Backend logs show: `hasCoverImage: true`
- Database has valid URL in `cover_image_url`
- Image displays on content card

### Partial Success:
- Backend logs show: `hasCoverImage: true`
- Database has URL but image doesn't display
- **Reason**: CORS restriction or authentication required
- **Check**: Try opening the URL directly in browser

### Failure Case:
- Backend logs show: `hasCoverImage: false` or `coverImage: 'not found'`
- Database has NULL in `cover_image_url`
- **Reason**: Page structure doesn't match our selectors
- **Solution**: Need to inspect the actual page HTML and add more selectors

## Next Steps

1. **Test with real URLs** from Zhihu and WeChat
2. **Check backend logs** to see if images are being extracted
3. **Report results**:
   - If images display: ✅ Fixed!
   - If images don't display: Share the backend logs and we'll debug further

## Files Modified

- ✅ `backend/src/services/MetadataExtractor.ts` - Enhanced extraction
- ✅ `frontend/src/components/ContentCard.tsx` - Already handles both field names (no changes needed)

## Server Status

- ✅ Backend server is running with hot reload (`tsx watch`)
- ✅ Changes are automatically applied
- ✅ No restart needed

## Additional Resources

- `IMAGE_DISPLAY_FIX.md` - Detailed technical documentation
- `backend/test-metadata-simple.js` - Testing guide
- `backend/test-image-extraction.js` - Advanced debugging tool
