// test.js - Quick test script for the API
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000';

// Test tokens (popular pump.fun tokens)
const TEST_TOKENS = [
  {
    name: 'GIGA',
    mint: 'CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump'
  },
  {
    name: 'LOCKIN',
    mint: 'LocK1nWE7jNAQ1KwzxaMGfQ5u5GWWLJKwF19WwK9pump'
  }
];

async function testAPI() {
  console.log('🧪 Testing Pump.fun Token API\n');
  console.log(`API URL: ${API_URL}\n`);

  // Test 1: Health check
  try {
    console.log('Test 1: Health Check');
    const health = await axios.get(`${API_URL}/health`);
    console.log('✅ Health check passed:', health.data);
    console.log('');
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    console.log('Make sure the server is running on port 3000');
    process.exit(1);
  }

  // Test 2: Root documentation endpoint
  try {
    console.log('Test 2: Documentation Endpoint');
    const docs = await axios.get(`${API_URL}/`);
    console.log('✅ Documentation endpoint working');
    console.log('');
  } catch (error) {
    console.log('❌ Documentation endpoint failed:', error.message);
  }

  // Test 3: Test with real tokens
  for (const token of TEST_TOKENS) {
    try {
      console.log(`Test 3: Fetching data for ${token.name} (${token.mint})`);
      const response = await axios.get(`${API_URL}/api/pumpfun/${token.mint}`);
      const data = response.data;

      console.log('✅ Token data retrieved successfully:');
      console.log(`   Symbol: ${data.symbol}`);
      console.log(`   Market Cap: $${data.marketcap.usd.toLocaleString()}`);
      console.log(`   24h Volume: $${data.volume.usd_24h.toLocaleString()}`);
      console.log(`   Holders: ${data.holders.count ? data.holders.count.toLocaleString() : 'N/A'}`);
      console.log(`   Price: $${data.price_usd}`);
      console.log(`   24h Change: ${data.price_change_24h}%`);
      console.log('');
    } catch (error) {
      console.log(`❌ Failed to fetch ${token.name}:`, error.response?.data || error.message);
      console.log('');
    }
  }

  // Test 4: Invalid mint address
  try {
    console.log('Test 4: Invalid Mint Address');
    await axios.get(`${API_URL}/api/pumpfun/invalid`);
    console.log('❌ Should have returned 400 error');
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✅ Correctly rejected invalid mint address');
      console.log(`   Error: ${error.response.data.message}`);
    } else {
      console.log('❌ Unexpected error:', error.message);
    }
    console.log('');
  }

  console.log('🎉 All tests completed!\n');
}

// Run tests
testAPI().catch(console.error);