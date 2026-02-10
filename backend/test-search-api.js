async function testSearchAPI() {
  const userId = '550e8400-e29b-41d4-a716-446655440000';
  
  console.log('Testing Search API...\n');
  
  try {
    console.log('1. Testing search with "test"...');
    const startTime = Date.now();
    
    const response = await fetch(
      `http://localhost:5000/api/search?userId=${userId}&query=test`
    );
    
    const duration = Date.now() - startTime;
    console.log(`   Response time: ${duration}ms`);
    console.log(`   Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   Results: ${data.length} items`);
      data.forEach(item => {
        console.log(`   - ${item.title} (${item.platform})`);
      });
    } else {
      const error = await response.text();
      console.log(`   Error: ${error}`);
    }
    
    console.log('\n✓ Test complete!');
    
  } catch (error) {
    console.error('✗ Test failed:', error.message);
  }
}

testSearchAPI();
