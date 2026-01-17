# Pump.fun Token API

A production-ready REST API for fetching real-time market data for pump.fun tokens on Solana. Returns market cap, 24h volume, and holder count for any token by mint address.

## 🚀 Features

- **Market Cap**: Fully diluted valuation (FDV) calculated as price × total supply
- **24h Volume**: Aggregated trading volume across all DEXs
- **Holder Count**: Number of unique wallet addresses holding the token
- **Real-time Data**: Sourced from on-chain DEX aggregation via DexScreener and Solscan
- **Production Ready**: Error handling, validation, and health checks included

## 📊 API Endpoint

```
GET /api/pumpfun/:mint
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `mint` | string | Yes | Token mint address (Solana contract address, 32-44 chars) |

### Example Request

```bash
curl http://localhost:3000/api/pumpfun/CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump
```

### Example Response

```json
{
  "mint": "CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump",
  "symbol": "GIGA",
  "name": "GIGA",
  "marketcap": {
    "usd": 142567890.45,
    "type": "fully_diluted_valuation",
    "description": "Market cap calculated as: current price × total supply"
  },
  "volume": {
    "usd_24h": 8934521.67,
    "window": "24_hours",
    "description": "Total trading volume across all DEXs in the last 24 hours"
  },
  "holders": {
    "count": 12543,
    "source": "solscan_api",
    "description": "Number of unique wallet addresses holding this token"
  },
  "price_usd": 0.1425,
  "price_change_24h": 15.67,
  "liquidity_usd": 456789.12,
  "dex": "raydium",
  "pair_address": "8Kag8CqNdCX6T9P4z9u3bqE5vXwqYMZqK3j2xL9YpVkC",
  "data_sources": {
    "price_and_volume": "dexscreener_api",
    "holder_count": "solscan_api",
    "data_method": "on_chain_dex_aggregation"
  },
  "timestamp": "2026-01-17T14:23:45.678Z"
}
```

## 🔧 Installation

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/pumpfun-token-api.git
cd pumpfun-token-api
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The API will be running at `http://localhost:3000`

### Development Mode

For auto-reload during development:
```bash
npm run dev
```

## 📖 Data Sources & Calculation Methods

### Market Cap (Fully Diluted Valuation)
- **Source**: DexScreener API
- **Calculation**: `Current Price × Total Supply`
- **Type**: FDV (assumes all tokens are in circulation)
- **Method**: Aggregated from on-chain DEX data (Raydium, Orca, etc.)

### 24h Volume
- **Source**: DexScreener API
- **Calculation**: Sum of all trading volume across DEX pairs in the last 24 hours
- **Method**: Real-time on-chain transaction parsing and aggregation
- **Includes**: All trades on Raydium, Orca, and other Solana DEXs

### Holder Count
- **Source**: Solscan API
- **Method**: Counts unique wallet addresses with non-zero token balance
- **Updates**: Near real-time from Solana blockchain state
- **Fallback**: Returns `null` if Solscan API is unavailable

## 🏗️ Architecture

```
User Request → Express Server → DexScreener API (price, volume, marketcap)
                              → Solscan API (holder count)
                              ↓
                         Response aggregation
                              ↓
                         JSON Response
```

### Why These Data Providers?

1. **DexScreener**: 
   - Aggregates data from all major Solana DEXs
   - Free public API with good uptime
   - Real-time on-chain data parsing
   - Widely trusted in the crypto community

2. **Solscan**:
   - Official Solana blockchain explorer
   - Accurate on-chain token account parsing
   - Free public API for holder counts

## 🧪 Testing

Test with a real pump.fun token:

```bash
# GIGA token (popular pump.fun token)
curl http://localhost:3000/api/pumpfun/CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump

# Health check
curl http://localhost:3000/health
```

## 🚨 Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid mint address format
- **404 Not Found**: Token not found or no trading pairs exist
- **500 Internal Server Error**: API provider issues or network errors

Example error response:
```json
{
  "error": "Token not found",
  "message": "No trading pairs found for this mint address. Token may not be listed yet."
}
```

## 🌐 Deployment

### Deploy to Heroku

```bash
heroku create your-app-name
git push heroku main
```

### Deploy to Railway

```bash
railway init
railway up
```

### Environment Variables

Optional configuration:
```bash
PORT=3000  # Server port (default: 3000)
```

## 📝 API Documentation Endpoint

Visit the root endpoint for interactive documentation:
```
GET http://localhost:3000/
```

## ⚠️ Rate Limits

- **DexScreener**: No official rate limit on public API (use responsibly)
- **Solscan**: ~5 requests/second recommended
- Consider implementing caching for production use

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [DexScreener API Docs](https://docs.dexscreener.com/)
- [Solscan API Docs](https://public-api.solscan.io/docs/)
- [Pump.fun Platform](https://pump.fun/)

## 💡 Example Use Cases

- Token portfolio tracking
- Trading bot integration
- Market analysis dashboards
- Token screening tools
- DeFi analytics platforms

## 📧 Support

For issues or questions, please open a GitHub issue or contact the maintainers.

---

**Note**: This API is for educational and informational purposes. Always verify data from multiple sources before making financial decisions.
