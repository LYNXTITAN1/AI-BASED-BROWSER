const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');
require('dotenv').config();

const config = require('./config');
const searchRoutes = require('./routes/search');

const app = express();
const cache = new NodeCache({ stdTTL: config.cacheTtlSeconds });

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Make cache available to routes
app.use((req, res, next) => {
  req.cache = cache;
  next();
});

// Routes
app.use('/api/search', searchRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  const cacheStats = cache.getStats();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    cache: {
      keys: cacheStats.keys,
      hits: cacheStats.hits,
      misses: cacheStats.misses,
      hitRate: cacheStats.hits / (cacheStats.hits + cacheStats.misses) || 0
    },
    engines: Object.keys(config.searchEngines).map(key => ({
      name: config.searchEngines[key].name,
      enabled: !config.searchEngines[key].requiresApiKey || 
               (key === 'brave' && config.braveApiKey) ||
               (key === 'tavily' && config.tavilyApiKey) ||
               (key === 'google' && config.googleApiKey && config.googleSearchEngineId) ||
               key === 'duckduckgo',
      free: config.searchEngines[key].free
    }))
  });
});

// Search engines status endpoint
app.get('/api/engines', (req, res) => {
  const engines = Object.keys(config.searchEngines).map(key => {
    const engine = config.searchEngines[key];
    return {
      id: key,
      name: engine.name,
      enabled: !engine.requiresApiKey || 
               (key === 'brave' && config.braveApiKey) ||
               (key === 'tavily' && config.tavilyApiKey) ||
               (key === 'google' && config.googleApiKey && config.googleSearchEngineId) ||
               key === 'duckduckgo',
      free: engine.free,
      unlimited: engine.unlimited || false,
      monthlyLimit: engine.monthlyLimit,
      dailyLimit: engine.dailyLimit,
      requiresApiKey: engine.requiresApiKey
    };
  });
  
  res.json({ engines });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: config.nodeEnv === 'development' ? err.message : 'Something went wrong'
  });
});

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 AI Browser Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Search engines: http://localhost:${PORT}/api/engines`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
});