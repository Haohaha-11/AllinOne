async function testTagSearch() {
  const userId = '550e8400-e29b-41d4-a716-446655440000';
  
  console.log('Testing Tag Search...\n');
  
  try {
    // First, let's see what tags exist
    console.log('1. Getting all tags...');
    const tagsResponse = await fetch(`http://localhost:5000/api/tags?userId=${userId}`);
    if (tagsResponse.ok) {
      const tags = await tagsResponse.json();
      console.log(`   Found ${tags.length} tags:`);
      tags.forEach(tag => {
        console.log(`   - ${tag.name} (${tag.contentCount || 0} items)`);
      });
    }
    
    console.log('\n2. Testing search with tag "111"...');
    const startTime = Date.now();
    
    const response = await fetch(
      `http://localhost:5000/api/search?userId=${userId}&query=111`
    );
    
    const duration = Date.now() - startTime;
    console.log(`   Response time: ${duration}ms`);
    console.log(`   Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   Results: ${data.length} items`);
      data.forEach(item => {
        console.log(`   - ${item.title} (${item.platform})`);
        console.log(`     Tags: ${JSON.stringify(item.tags)}`);
      });
    } else {
      const error = await response.text();
      console.log(`   Error: ${error}`);
    }
    
    console.log('\n3. Testing search with "test" (should match title)...');
    const testResponse = await fetch(
      `http://localhost:5000/api/search?userId=${userId}&query=test`
    );
    
    if (testResponse.ok) {
      const data = await testResponse.json();
      console.log(`   Results: ${data.length} items`);
      data.forEach(item => {
        console.log(`   - ${item.title}`);
      });
    }
    
    console.log('\n✓ Test complete!');
    
  } catch (error) {
    console.error('✗ Test failed:', error.message);
  }
}

testTagSearch();
