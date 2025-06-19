const express = require('express');
const axios = require('axios');
const config = require('../config');

const router = express.Router();

// Helper function to generate cache key
const getCacheKey = (engine, query, limit) => {
  return `search:${engine}:${query}:${limit}`;
};

// Helper function to format DuckDuckGo results
const formatDuckDuckGoResults = (data, query) => {
  const results = [];
  
  // Add instant answer if available
  if (data.AbstractText) {
    results.push({
      id: 'instant-answer',
      title: data.Heading || 'Instant Answer',
      url: data.AbstractURL || '#',
      description: data.AbstractText,
      domain: data.AbstractSource || 'DuckDuckGo',
      favicon: '🦆',
      type: 'instant',
      relevanceScore: 1.0,
      engine: 'duckduckgo'
    });
  }
  
  // Add related topics
  if (data.RelatedTopics && data.RelatedTopics.length > 0) {
    data.RelatedTopics.slice(0, 5).forEach((topic, index) => {
      if (topic.Text && topic.FirstURL) {
        results.push({
          id: `related-${index}`,
          title: topic.Text.split(' - ')[0] || topic.Text,
          url: topic.FirstURL,
          description: topic.Text,
          domain: new URL(topic.FirstURL).hostname,
          favicon: '🌐',
          type: 'web',
          relevanceScore: 0.8 - (index * 0.1),
          engine: 'duckduckgo'
        });
      }
    });
  }
  
  return results;
};

// Helper function to format Brave Search results
const formatBraveResults = (data) => {
  if (!data.web || !data.web.results) return [];
  
  return data.web.results.map((result, index) => ({
    id: `brave-${index}`,
    title: result.title,
    url: result.url,
    description: result.description,
    domain: new URL(result.url).hostname,
    favicon: '🦁',
    type: 'web',
    relevanceScore: 0.9 - (index * 0.05),
    engine: 'brave'
  }));
};

// Helper function to format Tavily results
const formatTavilyResults = (data) => {
  if (!data.results) return [];
  
  return data.results.map((result, index) => ({
    id: `tavily-${index}`,
    title: result.title,
    url: result.url,
    description: result.content,
    domain: new URL(result.url).hostname,
    favicon: '🤖',
    type: 'web',
    relevanceScore: result.score || (0.9 - (index * 0.05)),
    engine: 'tavily'
  }));
};

// Helper function to format Google Custom Search results
const formatGoogleResults = (data) => {
  if (!data.items) return [];
  
  return data.items.map((result, index) => ({
    id: `google-${index}`,
    title: result.title,
    url: result.link,
    description: result.snippet,
    domain: result.displayLink,
    favicon: '🔍',
    type: 'web',
    relevanceScore: 0.95 - (index * 0.05),
    engine: 'google'
  }));
};

// Helper function to generate free AI insights
const generateFreeInsights = (results, query) => {
  const domains = [...new Set(results.map(r => r.domain))];
  const avgRelevance = results.reduce((sum, r) => sum + r.relevanceScore, 0) / results.length;
  
  const insights = {
    summary: `Found ${results.length} results for "${query}" across ${domains.length} different domains.`,
    confidence: Math.min(avgRelevance, 0.95),
    recommendations: []
  };
  
  if (results.length > 5) {
    insights.recommendations.push('Consider refining your search query for more specific results');
  }
  
  if (domains.length < 3) {
    insights.recommendations.push('Try different search terms to get more diverse sources');
  }
  
  const instantAnswers = results.filter(r => r.type === 'instant');
  if (instantAnswers.length > 0) {
    insights.recommendations.push('Check the instant answer for quick information');
  }
  
  return insights;
};

// DuckDuckGo search endpoint (completely free)
router.post('/duckduckgo', async (req, res) => {
  try {
    const { query, limit = 10 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const cacheKey = getCacheKey('duckduckgo', query, limit);
    const cached = req.cache.get(cacheKey);
    
    if (cached) {
      return res.json({ ...cached, cached: true });
    }
    
    const response = await axios.get('https://api.duckduckgo.com/', {
      params: {
        q: query,
        format: 'json',
        no_html: '1',
        skip_disambig: '1'
      },
      timeout: 10000
    });
    
    const results = formatDuckDuckGoResults(response.data, query);
    const limitedResults = results.slice(0, limit);
    
    const searchResult = {
      query,
      type: 'web',
      timestamp: new Date().toISOString(),
      totalResults: limitedResults.length,
      results: limitedResults,
      engine: 'duckduckgo',
      cost: 'free',
      cached: false,
      aiInsights: generateFreeInsights(limitedResults, query)
    };
    
    req.cache.set(cacheKey, searchResult);
    res.json(searchResult);
    
  } catch (error) {
    console.error('DuckDuckGo search error:', error.message);
    res.status(500).json({ 
      error: 'Search failed', 
      message: 'DuckDuckGo search temporarily unavailable' 
    });
  }
});

// Brave Search endpoint (2,000 free queries/month)
router.post('/brave', async (req, res) => {
  try {
    const { query, limit = 10 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    if (!config.braveApiKey) {
      return res.status(400).json({ 
        error: 'Brave API key not configured',
        message: 'Add BRAVE_API_KEY to environment variables'
      });
    }
    
    const cacheKey = getCacheKey('brave', query, limit);
    const cached = req.cache.get(cacheKey);
    
    if (cached) {
      return res.json({ ...cached, cached: true });
    }
    
    const response = await axios.get('https://api.search.brave.com/res/v1/web/search', {
      params: {
        q: query,
        count: limit
      },
      headers: {
        'X-Subscription-Token': config.braveApiKey
      },
      timeout: 10000
    });
    
    const results = formatBraveResults(response.data);
    
    const searchResult = {
      query,
      type: 'web',
      timestamp: new Date().toISOString(),
      totalResults: results.length,
      results,
      engine: 'brave',
      cost: 'free',
      cached: false,
      aiInsights: generateFreeInsights(results, query)
    };
    
    req.cache.set(cacheKey, searchResult);
    res.json(searchResult);
    
  } catch (error) {
    console.error('Brave search error:', error.message);
    res.status(500).json({ 
      error: 'Search failed', 
      message: 'Brave search temporarily unavailable' 
    });
  }
});

// Tavily AI search endpoint (free tier available)
router.post('/tavily', async (req, res) => {
  try {
    const { query, limit = 10 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    if (!config.tavilyApiKey) {
      return res.status(400).json({ 
        error: 'Tavily API key not configured',
        message: 'Add TAVILY_API_KEY to environment variables'
      });
    }
    
    const cacheKey = getCacheKey('tavily', query, limit);
    const cached = req.cache.get(cacheKey);
    
    if (cached) {
      return res.json({ ...cached, cached: true });
    }
    
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: config.tavilyApiKey,
      query,
      search_depth: 'basic',
      include_answer: true,
      include_images: false,
      include_raw_content: false,
      max_results: limit
    }, {
      timeout: 10000
    });
    
    const results = formatTavilyResults(response.data);
    
    const searchResult = {
      query,
      type: 'web',
      timestamp: new Date().toISOString(),
      totalResults: results.length,
      results,
      engine: 'tavily',
      cost: 'free',
      cached: false,
      aiInsights: generateFreeInsights(results, query)
    };
    
    req.cache.set(cacheKey, searchResult);
    res.json(searchResult);
    
  } catch (error) {
    console.error('Tavily search error:', error.message);
    res.status(500).json({ 
      error: 'Search failed', 
      message: 'Tavily search temporarily unavailable' 
    });
  }
});

// Google Custom Search endpoint (100 free queries/day)
router.post('/google', async (req, res) => {
  try {
    const { query, limit = 10 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    if (!config.googleApiKey || !config.googleSearchEngineId) {
      return res.status(400).json({ 
        error: 'Google API credentials not configured',
        message: 'Add GOOGLE_API_KEY and GOOGLE_SEARCH_ENGINE_ID to environment variables'
      });
    }
    
    const cacheKey = getCacheKey('google', query, limit);
    const cached = req.cache.get(cacheKey);
    
    if (cached) {
      return res.json({ ...cached, cached: true });
    }
    
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: config.googleApiKey,
        cx: config.googleSearchEngineId,
        q: query,
        num: Math.min(limit, 10) // Google API max is 10
      },
      timeout: 10000
    });
    
    const results = formatGoogleResults(response.data);
    
    const searchResult = {
      query,
      type: 'web',
      timestamp: new Date().toISOString(),
      totalResults: results.length,
      results,
      engine: 'google',
      cost: 'free',
      cached: false,
      aiInsights: generateFreeInsights(results, query)
    };
    
    req.cache.set(cacheKey, searchResult);
    res.json(searchResult);
    
  } catch (error) {
    console.error('Google search error:', error.message);
    res.status(500).json({ 
      error: 'Search failed', 
      message: 'Google search temporarily unavailable' 
    });
  }
});

// Unified search endpoint (combines multiple engines)
router.post('/', async (req, res) => {
  try {
    const { query, engines = ['duckduckgo'], limit = 10 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    const searchPromises = engines.map(async (engine) => {
      try {
        const engineReq = { body: { query, limit: Math.ceil(limit / engines.length) } };
        engineReq.cache = req.cache;
        
        const mockRes = {
          json: (data) => data,
          status: () => mockRes
        };
        
        switch (engine) {
          case 'duckduckgo':
            return await new Promise((resolve) => {
              router.stack.find(layer => layer.route.path === '/duckduckgo').route.stack[0].handle(engineReq, mockRes, () => {});
              setTimeout(() => resolve(mockRes.data), 100);
            });
          case 'brave':
            if (config.braveApiKey) {
              return await new Promise((resolve) => {
                router.stack.find(layer => layer.route.path === '/brave').route.stack[0].handle(engineReq, mockRes, () => {});
                setTimeout(() => resolve(mockRes.data), 100);
              });
            }
            break;
          case 'tavily':
            if (config.tavilyApiKey) {
              return await new Promise((resolve) => {
                router.stack.find(layer => layer.route.path === '/tavily').route.stack[0].handle(engineReq, mockRes, () => {});
                setTimeout(() => resolve(mockRes.data), 100);
              });
            }
            break;
          case 'google':
            if (config.googleApiKey && config.googleSearchEngineId) {
              return await new Promise((resolve) => {
                router.stack.find(layer => layer.route.path === '/google').route.stack[0].handle(engineReq, mockRes, () => {});
                setTimeout(() => resolve(mockRes.data), 100);
              });
            }
            break;
        }
        return null;
      } catch (error) {
        console.error(`Error with ${engine}:`, error.message);
        return null;
      }
    });
    
    const results = await Promise.allSettled(searchPromises);
    const successfulResults = results
      .filter(result => result.status === 'fulfilled' && result.value)
      .map(result => result.value);
    
    if (successfulResults.length === 0) {
      return res.status(500).json({ error: 'All search engines failed' });
    }
    
    // Combine and deduplicate results
    const allResults = [];
    const seenUrls = new Set();
    
    successfulResults.forEach(searchResult => {
      if (searchResult.results) {
        searchResult.results.forEach(result => {
          if (!seenUrls.has(result.url)) {
            seenUrls.add(result.url);
            allResults.push(result);
          }
        });
      }
    });
    
    // Sort by relevance score and limit
    const sortedResults = allResults
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit);
    
    const combinedResult = {
      query,
      type: 'web',
      timestamp: new Date().toISOString(),
      totalResults: sortedResults.length,
      results: sortedResults,
      engines: engines,
      cost: 'free',
      cached: false,
      aiInsights: generateFreeInsights(sortedResults, query)
    };
    
    res.json(combinedResult);
    
  } catch (error) {
    console.error('Unified search error:', error.message);
    res.status(500).json({ 
      error: 'Search failed', 
      message: 'Unified search temporarily unavailable' 
    });
  }
});

// Search suggestions endpoint
router.get('/suggestions', async (req, res) => {
  try {
    const { q: query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    // Simple suggestion logic (can be enhanced with real APIs)
    const suggestions = [
      `${query} tutorial`,
      `${query} guide`,
      `${query} examples`,
      `${query} best practices`,
      `${query} 2024`
    ];
    
    res.json({ query, suggestions });
    
  } catch (error) {
    console.error('Suggestions error:', error.message);
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
});

// Trending searches endpoint
router.get('/trending', (req, res) => {
  try {
    const trending = [
      'AI technology trends',
      'Web development 2024',
      'Machine learning basics',
      'React best practices',
      'Node.js tutorials',
      'Python programming',
      'JavaScript frameworks',
      'Database design',
      'Cloud computing',
      'Cybersecurity tips'
    ];
    
    res.json({ trending });
    
  } catch (error) {
    console.error('Trending error:', error.message);
    res.status(500).json({ error: 'Failed to get trending searches' });
  }
});

module.exports = router;