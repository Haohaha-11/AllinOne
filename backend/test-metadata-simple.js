// Simple test to verify metadata extraction
// Run with: node backend/test-metadata-simple.js

console.log('Metadata Extraction Test');
console.log('========================\n');

console.log('To test image extraction for Zhihu and WeChat:');
console.log('1. Paste a Zhihu or WeChat URL in the app');
console.log('2. Check the backend console logs for:');
console.log('   - [MetadataExtractor] Extracting metadata for...');
console.log('   - [Zhihu] or [WeChat] Extracted metadata...');
console.log('   - hasCoverImage: true/false');
console.log('   - coverImageUrl: ...\n');

console.log('3. Check the database to see if cover_image_url is saved:');
console.log('   docker exec -it allinone-postgres-1 psql -U postgres -d content_collector');
console.log('   SELECT id, title, cover_image_url FROM content_items ORDER BY created_at DESC LIMIT 5;\n');

console.log('4. If images are not showing:');
console.log('   - Check if cover_image_url is NULL in database');
console.log('   - Check browser console for CORS errors');
console.log('   - Check if image URLs are valid (not relative URLs)');
console.log('   - Try opening the image URL directly in browser\n');

console.log('Common issues:');
console.log('- Relative URLs: Images with src="/path/to/image.jpg" cannot be displayed');
console.log('- CORS: Some platforms block external access to images');
console.log('- Authentication: Some images require login to view');
console.log('- Lazy loading: Images might use data-src instead of src\n');
