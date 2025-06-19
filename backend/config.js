import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Free API Keys
  braveApiKey: process.env.BRAVE_API_KEY,
  tavilyApiKey: process.env.TAVILY_API_KEY,
  googleApiKey: process.env.GOOGLE_API_KEY,
  googleSearchEngineId: process.env.GOOGLE_SEARCH_ENGINE_ID,
  
  // Rate limiting
  rateLimiting: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },
  
  // CORS settings
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.CORS_ORIGIN?.split(',') || ['https://yourdomain.com']
      : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:8000'],
    credentials: true,
  },
  
  // Cache settings
  cache: {
    ttl: parseInt(process.env.CACHE_TTL_SECONDS) || 300, // 5 minutes
    checkPeriod: 60, // Check for expired keys every 60 seconds
  },
  
  // Search engine endpoints
  searchEngines: {
    duckduckgo: 'https://api.duckduckgo.com/',
    brave: 'https://api.search.brave.com/res/v1/web/search',
    tavily: 'https://api.tavily.com/search',
    google: 'https://www.googleapis.com/customsearch/v1',
  },
  
  // AI processing settings
  ai: {
    maxTokens: 1000,
    temperature: 0.7,
    model: 'gpt-3.5-turbo',
  },
  
  // Search settings
  search: {
    maxResults: 10,
    timeout: 5000,
    userAgent: 'AI-Browser-Pro/1.0 (Free Search Engine)',
  },
};