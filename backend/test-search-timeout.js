import fetch from 'node-fetch';

const userId = '550e8400-e29b-41d4-a716-446655440000';

async function testSearch(query) {
  console.log(`\nTesting search with query: "${query}"`);
  const startTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    
    const response = await fetch(
      `http://localhost:5000/api/search?userId=${userId}&query=${encodeURIComponent(query)}`,
      { signal: controller.signal }
    );
    
    clearTimeout(timeoutId);
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`Response time: ${duration}ms`);
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`Results: ${data.length} items found`);
    } else {
      const error = await response.json();
      console.log(`Error: ${error.error}`);
    }
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (error.name === 'AbortError') {
      console.log(`✗ TIMEOUT after ${duration}ms (4 second limit)`);
    } else {
      console.log(`✗ Error: ${error.message}`);
    }
  }
}

async function runTests() {
  console.log('=== Search Timeout Tests ===');
  console.log('Testing search with 4 second timeout...\n');
  
  // Test 1: Normal search (should be fast)
  await testSearch('test');
  
  // Test 2: Another search
  await testSearch('article');
  
  // Test 3: Single character (should not search)
  await testSearch('a');
  
  console.log('\n=== Tests Complete ===');
}

runTests();
