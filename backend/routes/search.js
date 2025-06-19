import express from 'express';
import axios from 'axios';
import { config } from '../config.js';

const router = express.Router();

// DuckDuckGo search (completely free, unlimited)
router.post('/duckduckgo', async (req, res) => {
  try {
    const { query, type = 'web', limit = 10 } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Search query is required',
      });
    }

    // Check cache first
    const cacheKey = `ddg:${query}:${type}:${limit}`;
    const cachedResult = req.cache.get(cacheKey);
    if (cachedResult) {
      return res.json({ ...cachedResult, cached: true });
    }

    // Call DuckDuckGo Instant Answer API (completely free)
    const response = await axios.get(config.searchEngines.duckduckgo, {
      params: {
        q: query,
        format: 'json',
        no_html: 1,
        skip_disambig: 1
      },
      timeout: config.search.timeout,
      headers: {
        'User-Agent': config.search.userAgent
      }
    });

    const results = formatDuckDuckGoResults(response.data, query, limit);
    
    // Cache the results
    req.cache.set(cacheKey, results);

    res.json(results);
  } catch (error) {
    console.error('DuckDuckGo search error:', error);
    res.status(500).json({
      error: 'Search Failed',
      message: 'DuckDuckGo search request failed',
      engine: 'duckduckgo'
    });
  }
});

// Brave Search API (2,000 free queries/month)
router.post('/brave', async (req, res) => {
  try {
    const { query, type = 'web', limit = 10 } = req.body;

    if (!config.braveApiKey) {
      return res.status(503).json({
        error: 'Service Unavailable',
        message: 'Brave Search API key not configured',
        howToFix: 'Get a free API key from https://brave.com/search/api/ (2,000 queries/month free)'
      });
    }

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Search query is required',
      });
    }

    // Check cache first
    const cacheKey = `brave:${query}:${type}:${limit}`;
    const cachedResult = req.cache.get(cacheKey);
    if (cachedResult) {
      return res.json({ ...cachedResult, cached: true });
    }

    const response = await axios.get(config.searchEngines.brave, {
      params: {
        q: query,
        count: limit,
        search_lang: 'en',
        country: 'US',
        safesearch: 'moderate'
      },
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': config.braveApiKey,
        'User-Agent': config.search.userAgent
      },
      timeout: config.search.timeout
    });

    const results = formatBraveResults(response.data, query);
    
    // Cache the results
    req.cache.set(cacheKey, results);

    res.json(results);
  } catch (error) {
    console.error('Brave search error:', error);
    
    if (error.response?.status === 401) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid Brave Search API key',
        howToFix: 'Check your API key at https://brave.com/search/api/'
      });
    }
    
    if (error.response?.status === 429) {
      return res.status(429).json({
        error: 'Rate Limit Exceeded',
        message: 'Brave Search monthly quota exceeded',
        limit: '2,000 queries/month'
      });
    }

    res.status(500).json({
      error: 'Search Failed',
      message: 'Brave search request failed',
      engine: 'brave'
    });
  }
});

// Tavily AI Search (AI-optimized, free tier available)
router.post('/tavily', async (req, res) => {
  try {
    const { query, type = 'web', limit = 10 } = req.body;

    if (!config.tavilyApiKey) {
      return res.status(503).json({
        error: 'Service Unavailable',
        message: 'Tavily AI API key not configured',
        howToFix: 'Get a free API key from https://tavily.com/ for AI-optimized search'
      });
    }

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Search query is required',
      });
    }

    // Check cache first
    const cacheKey = `tavily:${query}:${type}:${limit}`;
    const cachedResult = req.cache.get(cacheKey);
    if (cachedResult) {
      return res.json({ ...cachedResult, cached: true });
    }

    const response = await axios.post(config.searchEngines.tavily, {
      api_key: config.tavilyApiKey,
      query: query,
      search_depth: "basic",
      include_answer: true,
      include_images: false,
      include_raw_content: false,
      max_results: limit
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': config.search.userAgent
      },
      timeout: config.search.timeout
    });

    const results = formatTavilyResults(response.data, query);
    
    // Cache the results
    req.cache.set(cacheKey, results);

    res.json(results);
  } catch (error) {
    console.error('Tavily search error:', error);
    
    if (error.response?.status === 401) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid Tavily API key',
        howToFix: 'Check your API key at https://tavily.com/'
      });
    }

    res.status(500).json({
      error: 'Search Failed',
      message: 'Tavily AI search request failed',
      engine: 'tavily'
    });
  }
});

// Google Custom Search (100 free queries/day)
router.post('/google', async (req, res) => {
  try {
    const { query, type = 'web', limit = 10 } = req.body;

    if (!config.googleApiKey || !config.googleSearchEngineId) {
      return res.status(503).json({
        error: 'Service Unavailable',
        message: 'Google Custom Search not configured',
        howToFix: 'Get free API key and Search Engine ID from Google Cloud Console (100 queries/day free)'
      });
    }

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Search query is required',
      });
    }

    // Check cache first
    const cacheKey = `google:${query}:${type}:${limit}`;
    const cachedResult = req.cache.get(cacheKey);
    if (cachedResult) {
      return res.json({ ...cachedResult, cached: true });
    }

    const response = await axios.get(config.searchEngines.google, {
      params: {
        key: config.googleApiKey,
        cx: config.googleSearchEngineId,
        q: query,
        num: Math.min(limit, 10), // Google allows max 10 per request
        safe: 'medium'
      },
      timeout: config.search.timeout
    });

    const results = formatGoogleResults(response.data, query);
    
    // Cache the results
    req.cache.set(cacheKey, results);

    res.json(results);
  } catch (error) {
    console.error('Google search error:', error);
    
    if (error.response?.status === 403) {
      return res.status(403).json({
        error: 'Quota Exceeded',
        message: 'Google Custom Search daily quota exceeded',
        limit: '100 queries/day'
      });
    }

    res.status(500).json({
      error: 'Search Failed',
      message: 'Google Custom Search request failed',
      engine: 'google'
    });
  }
});

// Unified search endpoint (queries multiple free engines)
router.post('/', async (req, res) => {
  try {
    const { query, type = 'web', limit = 10, engines = ['duckduckgo'] } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Search query is required',
      });
    }

    // Check cache first
    const cacheKey = `unified:${query}:${type}:${limit}:${engines.join(',')}`;
    const cachedResult = req.cache.get(cacheKey);
    if (cachedResult) {
      return res.json({ ...cachedResult, cached: true });
    }

    const searchPromises = [];
    const availableEngines = [];

    // Always include DuckDuckGo (free and unlimited)
    if (engines.includes('duckduckgo')) {
      searchPromises.push(
        axios.get(config.searchEngines.duckduckgo, {
          params: { q: query, format: 'json', no_html: 1, skip_disambig: 1 },
          timeout: config.search.timeout
        }).then(response => ({ engine: 'duckduckgo', data: response.data }))
        .catch(error => ({ engine: 'duckduckgo', error: error.message }))
      );
      availableEngines.push('duckduckgo');
    }

    // Add other engines if configured
    if (engines.includes('brave') && config.braveApiKey) {
      searchPromises.push(
        axios.get(config.searchEngines.brave, {
          params: { q: query, count: limit },
          headers: { 'X-Subscription-Token': config.braveApiKey },
          timeout: config.search.timeout
        }).then(response => ({ engine: 'brave', data: response.data }))
        .catch(error => ({ engine: 'brave', error: error.message }))
      );
      availableEngines.push('brave');
    }

    const searchResults = await Promise.allSettled(searchPromises);
    const combinedResults = combineSearchResults(searchResults, query, limit);
    
    // Cache the results
    req.cache.set(cacheKey, combinedResults);

    res.json(combinedResults);
  } catch (error) {
    console.error('Unified search error:', error);
    res.status(500).json({
      error: 'Search Failed',
      message: 'Unified search request failed',
    });
  }
});

// Search suggestions endpoint (free)
router.get('/suggestions', async (req, res) => {
  try {
    const { q: query } = req.query;

    if (!query || query.length < 2) {
      return res.json({ suggestions: [] });
    }

    // Check cache first
    const cacheKey = `suggestions:${query}`;
    const cachedResult = req.cache.get(cacheKey);
    if (cachedResult) {
      return res.json({ ...cachedResult, cached: true });
    }

    const suggestions = generateFreeSuggestions(query);
    const result = {
      query,
      suggestions,
      timestamp: new Date().toISOString(),
      engine: 'free-local-suggestions'
    };
    
    // Cache the suggestions
    req.cache.set(cacheKey, result);
    
    res.json(result);
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to generate suggestions',
    });
  }
});

// Trending searches endpoint (free mock data)
router.get('/trending', async (req, res) => {
  try {
    // Check cache first
    const cacheKey = 'trending:global';
    const cachedResult = req.cache.get(cacheKey);
    if (cachedResult) {
      return res.json({ ...cachedResult, cached: true });
    }

    const trending = [
      { query: 'AI technology trends 2024', category: 'Technology', volume: 15420, engine: 'free' },
      { query: 'Climate change solutions', category: 'Environment', volume: 12350, engine: 'free' },
      { query: 'Web development best practices', category: 'Programming', volume: 9870, engine: 'free' },
      { query: 'Machine learning tutorials', category: 'Education', volume: 8640, engine: 'free' },
      { query: 'Cybersecurity news', category: 'Security', volume: 7530, engine: 'free' },
      { query: 'Remote work tools', category: 'Business', volume: 6420, engine: 'free' },
      { query: 'Sustainable technology', category: 'Environment', volume: 5310, engine: 'free' },
      { query: 'Digital privacy guide', category: 'Privacy', volume: 4890, engine: 'free' },
    ];

    const result = {
      trending,
      timestamp: new Date().toISOString(),
      period: '24h',
      source: 'free-trending-data'
    };
    
    // Cache trending data for longer (1 hour)
    req.cache.set(cacheKey, result, 3600);

    res.json(result);
  } catch (error) {
    console.error('Trending error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch trending searches',
    });
  }
});

// Helper functions for formatting results
function formatDuckDuckGoResults(data, query, limit) {
  const results = [];
  
  // Add abstract if available
  if (data.Abstract) {
    results.push({
      id: 'ddg-abstract',
      title: data.Heading || `${query} - Overview`,
      url: data.AbstractURL || '#',
      description: data.Abstract,
      domain: data.AbstractSource || 'duckduckgo.com',
      favicon: '🦆',
      type: 'abstract',
      relevanceScore: 0.95,
      engine: 'duckduckgo'
    });
  }

  // Add related topics
  if (data.RelatedTopics) {
    data.RelatedTopics.slice(0, limit - results.length).forEach((topic, index) => {
      if (topic.Result) {
        results.push({
          id: `ddg-${index}`,
          title: topic.Text?.split(' - ')[0] || `Related: ${query}`,
          url: topic.FirstURL || '#',
          description: topic.Text || 'Related information',
          domain: topic.FirstURL ? new URL(topic.FirstURL).hostname : 'duckduckgo.com',
          favicon: '🔍',
          type: 'related',
          relevanceScore: 0.8 - (index * 0.1),
          engine: 'duckduckgo'
        });
      }
    });
  }

  return {
    query,
    type: 'web',
    timestamp: new Date().toISOString(),
    totalResults: results.length,
    results,
    engine: 'duckduckgo',
    cost: 'free',
    aiInsights: {
      summary: `DuckDuckGo search results for "${query}". Privacy-focused search with ${results.length} results.`,
      confidence: 0.85,
      recommendations: ['DuckDuckGo provides privacy-focused search results', 'No user tracking or data collection']
    }
  };
}

function formatBraveResults(data, query) {
  const results = data.web?.results?.map((result, index) => ({
    id: `brave-${index}`,
    title: result.title,
    url: result.url,
    description: result.description,
    domain: new URL(result.url).hostname,
    favicon: '🦁',
    type: 'web',
    relevanceScore: 0.9 - (index * 0.05),
    engine: 'brave'
  })) || [];

  return {
    query,
    type: 'web',
    timestamp: new Date().toISOString(),
    totalResults: results.length,
    results,
    engine: 'brave',
    cost: 'freemium',
    limit: '2,000/month',
    aiInsights: {
      summary: `Brave Search results for "${query}". Ad-free, privacy-focused search with ${results.length} results.`,
      confidence: 0.92,
      recommendations: ['Brave Search provides ad-free results', 'Privacy-focused with comprehensive coverage']
    }
  };
}

function formatTavilyResults(data, query) {
  const results = data.results?.map((result, index) => ({
    id: `tavily-${index}`,
    title: result.title,
    url: result.url,
    description: result.content,
    domain: new URL(result.url).hostname,
    favicon: '🤖',
    type: 'ai-optimized',
    relevanceScore: result.score || (0.9 - (index * 0.05)),
    engine: 'tavily'
  })) || [];

  return {
    query,
    type: 'web',
    timestamp: new Date().toISOString(),
    totalResults: results.length,
    results,
    answer: data.answer,
    engine: 'tavily',
    cost: 'freemium',
    aiInsights: {
      summary: `Tavily AI search results for "${query}". AI-optimized search with ${results.length} results.`,
      confidence: 0.94,
      recommendations: ['Tavily provides AI-optimized results', 'Perfect for RAG and LLM applications']
    }
  };
}

function formatGoogleResults(data, query) {
  const results = data.items?.map((item, index) => ({
    id: `google-${index}`,
    title: item.title,
    url: item.link,
    description: item.snippet,
    domain: item.displayLink,
    favicon: '🔍',
    type: 'web',
    relevanceScore: 0.95 - (index * 0.05),
    engine: 'google'
  })) || [];

  return {
    query,
    type: 'web',
    timestamp: new Date().toISOString(),
    totalResults: parseInt(data.searchInformation?.totalResults) || results.length,
    results,
    engine: 'google',
    cost: 'freemium',
    limit: '100/day',
    aiInsights: {
      summary: `Google Custom Search results for "${query}". Comprehensive search with ${results.length} results.`,
      confidence: 0.96,
      recommendations: ['Google provides comprehensive search coverage', 'Reliable and well-indexed results']
    }
  };
}

function combineSearchResults(searchResults, query, limit) {
  const allResults = [];
  const engines = [];
  
  searchResults.forEach(result => {
    if (result.status === 'fulfilled' && result.value.data) {
      const engineData = result.value;
      engines.push(engineData.engine);
      
      if (engineData.engine === 'duckduckgo') {
        const formatted = formatDuckDuckGoResults(engineData.data, query, limit);
        allResults.push(...formatted.results);
      } else if (engineData.engine === 'brave') {
        const formatted = formatBraveResults(engineData.data, query);
        allResults.push(...formatted.results);
      }
    }
  });

  // Remove duplicates and sort by relevance
  const uniqueResults = allResults
    .filter((result, index, self) => 
      index === self.findIndex(r => r.url === result.url)
    )
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);

  return {
    query,
    type: 'web',
    timestamp: new Date().toISOString(),
    totalResults: uniqueResults.length,
    results: uniqueResults,
    engines,
    cost: 'free',
    aiInsights: {
      summary: `Combined search results from ${engines.join(', ')} for "${query}". ${uniqueResults.length} unique results.`,
      confidence: 0.9,
      recommendations: ['Results combined from multiple free search engines', 'Duplicates removed and sorted by relevance']
    }
  };
}

function generateFreeSuggestions(query) {
  const suggestions = [];
  const lowerQuery = query.toLowerCase();
  
  // Popular site suggestions
  const popularSites = [
    { domain: 'youtube.com', triggers: ['youtube', 'video', 'watch'] },
    { domain: 'github.com', triggers: ['github', 'git', 'code', 'repo'] },
    { domain: 'stackoverflow.com', triggers: ['stack', 'overflow', 'programming'] },
    { domain: 'reddit.com', triggers: ['reddit', 'r/', 'subreddit'] },
    { domain: 'twitter.com', triggers: ['twitter', 'tweet', 'x.com'] },
    { domain: 'linkedin.com', triggers: ['linkedin', 'professional', 'career'] },
    { domain: 'amazon.com', triggers: ['amazon', 'shop', 'buy'] },
    { domain: 'wikipedia.org', triggers: ['wiki', 'wikipedia', 'encyclopedia'] }
  ];

  popularSites.forEach(site => {
    if (site.triggers.some(trigger => lowerQuery.includes(trigger))) {
      suggestions.push({
        id: `site-${site.domain}`,
        text: site.domain,
        type: 'url',
        confidence: 0.9,
        engine: 'free'
      });
    }
  });

  // Search variations
  const variations = [
    `${query} tutorial`,
    `${query} guide`,
    `${query} examples`,
    `${query} best practices`,
    `${query} 2024`,
    `how to ${query}`,
    `${query} vs alternatives`,
    `${query} reviews`
  ];
  
  variations.forEach((variation, index) => {
    suggestions.push({
      id: `var-${index}`,
      text: variation,
      type: 'query',
      confidence: 0.75 - (index * 0.05),
      engine: 'free'
    });
  });

  return suggestions.slice(0, 8);
}

export default router;