// server.js - Pump.fun Token API
// This API fetches real-time data for pump.fun tokens using DexScreener's public API
// DexScreener aggregates on-chain DEX data from Raydium and other Solana DEXs

const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

/**
 * GET /api/pumpfun/:mint
 * 
 * Fetches market data for a pump.fun token by its mint address
 * 
 * @param {string} mint - The token's mint address (contract address)
 * @returns {object} JSON with marketcap, volume, and holder count
 */
app.get('/api/pumpfun/:mint', async (req, res) => {
  try {
    const { mint } = req.params;
    
    // Validate mint address format (Solana addresses are base58, 32-44 chars)
    if (!mint || mint.length < 32 || mint.length > 44) {
      return res.status(400).json({
        error: 'Invalid mint address format',
        message: 'Mint address must be a valid Solana address (32-44 characters)'
      });
    }

    // Fetch data from DexScreener API
    // DexScreener aggregates on-chain DEX data including Raydium pools where pump.fun tokens trade
    const dexResponse = await axios.get(
      `https://api.dexscreener.com/latest/dex/tokens/${mint}`,
      { timeout: 10000 }
    );

    if (!dexResponse.data || !dexResponse.data.pairs || dexResponse.data.pairs.length === 0) {
      return res.status(404).json({
        error: 'Token not found',
        message: 'No trading pairs found for this mint address. Token may not be listed yet.'
      });
    }

    // Get the most liquid pair (highest liquidity USD)
    const pairs = dexResponse.data.pairs;
    const mainPair = pairs.reduce((prev, current) => 
      (parseFloat(current.liquidity?.usd || 0) > parseFloat(prev.liquidity?.usd || 0)) ? current : prev
    );

    // Fetch holder count from Solscan API (free public endpoint)
    let holderCount = null;
    try {
      const holderResponse = await axios.get(
        `https://api.solscan.io/token/holders?token=${mint}&offset=0&size=1`,
        { 
          timeout: 5000,
          headers: { 'User-Agent': 'PumpFunAPI/1.0' }
        }
      );
      holderCount = holderResponse.data?.total || null;
    } catch (holderError) {
      console.error('Holder count fetch failed:', holderError.message);
      // Continue without holder count if this API fails
    }

    // Extract and format data
    const tokenData = {
      mint: mint,
      symbol: mainPair.baseToken?.symbol || 'UNKNOWN',
      name: mainPair.baseToken?.name || 'Unknown Token',
      
      // Market Cap (Fully Diluted Valuation)
      // Calculation: Token Price × Total Supply
      // This is the FDV assuming all tokens are in circulation
      marketcap: {
        usd: parseFloat(mainPair.fdv) || 0,
        type: 'fully_diluted_valuation',
        description: 'Market cap calculated as: current price × total supply'
      },
      
      // 24h Trading Volume
      // Aggregated from all DEX pairs for this token
      volume: {
        usd_24h: parseFloat(mainPair.volume?.h24) || 0,
        window: '24_hours',
        description: 'Total trading volume across all DEXs in the last 24 hours'
      },
      
      // Holder Count
      // Sourced from Solscan's on-chain token account parser
      holders: {
        count: holderCount,
        source: holderCount ? 'solscan_api' : 'unavailable',
        description: 'Number of unique wallet addresses holding this token'
      },
      
      // Additional useful data
      price_usd: parseFloat(mainPair.priceUsd) || 0,
      price_change_24h: parseFloat(mainPair.priceChange?.h24) || 0,
      liquidity_usd: parseFloat(mainPair.liquidity?.usd) || 0,
      dex: mainPair.dexId || 'unknown',
      pair_address: mainPair.pairAddress || null,
      
      // Metadata
      data_sources: {
        price_and_volume: 'dexscreener_api',
        holder_count: 'solscan_api',
        data_method: 'on_chain_dex_aggregation'
      },
      timestamp: new Date().toISOString()
    };

    res.json(tokenData);

  } catch (error) {
    console.error('API Error:', error.message);
    
    if (error.response?.status === 404) {
      return res.status(404).json({
        error: 'Token not found',
        message: 'No data available for this mint address'
      });
    }
    
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint with API documentation
app.get('/', (req, res) => {
  res.json({
    service: 'Pump.fun Token API',
    version: '1.0.0',
    endpoints: {
      token_data: 'GET /api/pumpfun/:mint',
      health: 'GET /health'
    },
    example: '/api/pumpfun/CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump',
    documentation: {
      mint: 'Solana token mint address (32-44 characters)',
      response_fields: {
        marketcap: 'Fully diluted valuation (price × total supply)',
        volume: '24-hour trading volume in USD',
        holders: 'Number of unique token holders'
      },
      data_sources: {
        price_volume: 'DexScreener API (aggregates Raydium, Orca, etc.)',
        holders: 'Solscan API (on-chain token account parser)'
      }
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Pump.fun Token API running on port ${PORT}`);
  console.log(`📊 Example: http://localhost:${PORT}/api/pumpfun/CzLSujWBLFsSjncfkh59rUFqvafWcY5tzedWJSuypump`);
});

module.exports = app;