import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { config } from './config.js';
import searchRoutes from './routes/search.js';

const app = express();

// Rate limiting
const rateLimiter = new RateLimiterMemory({
  keyGenerator: (req) => req.ip,
  points: config.rateLimiting.max,
  duration: config.rateLimiting.windowMs / 1000,
});

const rateLimiterMiddleware = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.round(rejRes.msBeforeNext / 1000) || 1,
    });
  }
};

// Security middleware
app.use(helmet({
  contentSecurityPolicy: config.security.contentSecurityPolicy,
  crossOriginEmbedderPolicy: false,
}));

// CORS
app.use(cors(config.cors));

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(rateLimiterMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: config.nodeEnv,
  });
});

// API routes
app.use('/api/search', searchRoutes);

// AI Analysis endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { url, content, type = 'summary' } = req.body;

    if (!url && !content) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Either URL or content is required',
      });
    }

    // Simulate AI analysis (in production, this would call actual AI services)
    const analysis = {
      id: `analysis_${Date.now()}`,
      url,
      type,
      timestamp: new Date().toISOString(),
      confidence: Math.random() * 0.3 + 0.7, // 70-100%
      summary: generateMockSummary(url, type),
      insights: generateMockInsights(url, type),
      security: {
        level: 'secure',
        threats: [],
        recommendations: ['Enable HTTPS', 'Check privacy policy'],
      },
      metadata: {
        title: extractTitleFromUrl(url),
        domain: url ? new URL(url).hostname : 'unknown',
        language: 'en',
        readingTime: Math.floor(Math.random() * 10) + 1,
      },
    };

    res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to analyze content',
    });
  }
});

// Website metadata endpoint
app.get('/api/metadata', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'URL parameter is required',
      });
    }

    // Simulate metadata extraction
    const metadata = {
      url,
      title: extractTitleFromUrl(url),
      description: `Explore ${new URL(url).hostname} with AI-powered insights`,
      favicon: getFaviconForDomain(url),
      domain: new URL(url).hostname,
      isSecure: url.startsWith('https://'),
      timestamp: new Date().toISOString(),
    };

    res.json(metadata);
  } catch (error) {
    console.error('Metadata error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to extract metadata',
    });
  }
});

// Proxy endpoint for CORS-restricted sites
app.get('/api/proxy', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'URL parameter is required',
      });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Invalid URL format',
      });
    }

    // In production, implement proper proxy logic with security checks
    res.json({
      message: 'Proxy functionality would be implemented here',
      url,
      note: 'This is a mock response for development',
    });
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Proxy request failed',
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: config.nodeEnv === 'development' ? err.message : 'Something went wrong',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested endpoint does not exist',
  });
});

// Helper functions
function generateMockSummary(url, type) {
  const summaries = {
    summary: `This website provides comprehensive information about ${new URL(url).hostname}. The content is well-structured and offers valuable insights for users interested in this domain.`,
    security: `Security analysis shows this website follows standard security practices. HTTPS encryption is enabled and no major vulnerabilities detected.`,
    content: `The page contains high-quality content with good readability. Key topics include technology, innovation, and user experience.`,
  };
  return summaries[type] || summaries.summary;
}

function generateMockInsights(url, type) {
  return [
    {
      type: 'performance',
      title: 'Page Performance',
      description: 'Website loads efficiently with optimized resources',
      score: Math.floor(Math.random() * 30) + 70,
    },
    {
      type: 'accessibility',
      title: 'Accessibility',
      description: 'Good accessibility practices implemented',
      score: Math.floor(Math.random() * 25) + 75,
    },
    {
      type: 'seo',
      title: 'SEO Optimization',
      description: 'Well-optimized for search engines',
      score: Math.floor(Math.random() * 20) + 80,
    },
  ];
}

function extractTitleFromUrl(url) {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    return domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
  } catch {
    return 'Unknown Site';
  }
}

function getFaviconForDomain(url) {
  try {
    const domain = new URL(url).hostname.toLowerCase();
    
    // Popular site favicons
    const favicons = {
      'google.com': '🔍',
      'youtube.com': '📺',
      'github.com': '🐙',
      'stackoverflow.com': '📚',
      'reddit.com': '🤖',
      'twitter.com': '🐦',
      'linkedin.com': '💼',
      'facebook.com': '📘',
      'instagram.com': '📷',
      'netflix.com': '🎬',
      'spotify.com': '🎧',
      'amazon.com': '📦',
      'wikipedia.org': '📖',
    };
    
    return favicons[domain] || '🌐';
  } catch {
    return '🔗';
  }
}

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 AI Browser Pro Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`🔒 Security: Enabled`);
  console.log(`⚡ Rate Limiting: ${config.rateLimiting.max} requests per ${config.rateLimiting.windowMs / 1000}s`);
});

export default app;