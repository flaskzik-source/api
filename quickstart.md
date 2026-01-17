# Quick Start Guide

## 🚀 Get Running in 60 Seconds

### Step 1: Clone and Install
```bash
git clone https://github.com/yourusername/pumpfun-token-api.git
cd pumpfun-token-api
npm install
```

### Step 2: Start the Server
```bash
npm start
```

You should see:
```
🚀 Pump.fun Token API running on port 3000
📊 Example: http://localhost:3000/api/pumpfun/CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump
```

### Step 3: Test It!

Open a new terminal and try these commands:

#### Get GIGA token data:
```bash
curl http://localhost:3000/api/pumpfun/CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump
```

#### Or use the test script:
```bash
npm test
```

## 📊 Example Response

You'll get JSON like this:

```json
{
  "mint": "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump",
  "symbol": "GIGA",
  "marketcap": {
    "usd": 142567890.45,
    "type": "fully_diluted_valuation"
  },
  "volume": {
    "usd_24h": 8934521.67,
    "window": "24_hours"
  },
  "holders": {
    "count": 12543,
    "source": "solscan_api"
  },
  "price_usd": 0.1425,
  "price_change_24h": 15.67
}
```

## 🔍 How to Find Token Mint Addresses

1. **From pump.fun**: 
   - Go to any token page on pump.fun
   - The mint address is in the URL or token details

2. **From Solscan**:
   - Search for the token on solscan.io
   - Copy the contract address

3. **From DexScreener**:
   - Search the token on dexscreener.com
   - Look for "Contract" or "Token Address"

## 🛠️ Common Issues

### Port 3000 already in use?
```bash
# Use a different port
PORT=8080 npm start
```

### Module not found?
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### API returns 404?
- Make sure the token has trading pairs on Raydium/DEXs
- Verify the mint address is correct (32-44 characters)
- Some very new tokens might not be indexed yet

## 🌐 Use in Your Code

### JavaScript/Node.js
```javascript
const axios = require('axios');

async function getTokenData(mint) {
  const response = await axios.get(`http://localhost:3000/api/pumpfun/${mint}`);
  return response.data;
}

const data = await getTokenData('CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump');
console.log(`Market Cap: $${data.marketcap.usd}`);
```

### Python
```python
import requests

def get_token_data(mint):
    response = requests.get(f'http://localhost:3000/api/pumpfun/{mint}')
    return response.json()

data = get_token_data('CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump')
print(f"Market Cap: ${data['marketcap']['usd']}")
```

### cURL (Command Line)
```bash
curl http://localhost:3000/api/pumpfun/YOUR_MINT_ADDRESS | jq
```

## 📚 Next Steps

1. Read the full [README.md](README.md) for deployment options
2. Check out the API documentation at http://localhost:3000/
3. Deploy to Heroku, Railway, or your preferred platform
4. Add caching for production use

## 💬 Need Help?

- Open an issue on GitHub
- Check the README.md for more details
- Verify your Node.js version (needs 16+)

Happy coding! 🎉