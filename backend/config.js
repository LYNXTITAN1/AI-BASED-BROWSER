const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // API Keys (optional - fallback to free services)
  braveApiKey: process.env.BRAVE_API_KEY,
  tavilyApiKey: process.env.TAVILY_API_KEY,
  googleApiKey: process.env.GOOGLE_API_KEY,
  googleSearchEngineId: process.env.GOOGLE_SEARCH_ENGINE_ID,
  
  // Rate limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  
  // Cache settings
  cacheTtlSeconds: parseInt(process.env.CACHE_TTL_SECONDS) || 300, // 5 minutes
  
  // Search engines configuration
  searchEngines: {
    duckduckgo: {
      name: 'DuckDuckGo',
      baseUrl: 'https://api.duckduckgo.com',
      free: true,
      unlimited: true,
      requiresApiKey: false
    },
    brave: {
      name: 'Brave Search',
      baseUrl: 'https://api.search.brave.com/res/v1/web/search',
      free: true,
      monthlyLimit: 2000,
      requiresApiKey: true
    },
    tavily: {
      name: 'Tavily AI',
      baseUrl: 'https://api.tavily.com/search',
      free: true,
      requiresApiKey: true
    },
    google: {
      name: 'Google Custom Search',
      baseUrl: 'https://www.googleapis.com/customsearch/v1',
      free: true,
      dailyLimit: 100,
      requiresApiKey: true
    }
  }
};

module.exports = config;