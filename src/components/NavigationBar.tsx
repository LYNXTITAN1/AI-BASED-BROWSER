import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Home, 
  Search, 
  Mic, 
  Camera,
  Bot,
  Shield,
  Menu,
  Star,
  Globe,
  Zap
} from 'lucide-react';
import { AIState } from '../types';

interface NavigationBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  aiState: AIState;
  onToggleSidebar: () => void;
  onNavigateHome: () => void;
  onNavigateToUrl: (url: string) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  searchQuery,
  onSearchChange,
  aiState,
  onToggleSidebar,
  onNavigateHome,
  onNavigateToUrl
}) => {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleVoiceSearch = () => {
    setIsVoiceActive(!isVoiceActive);
    // Voice search logic would go here
  };

  const isUrl = (text: string) => {
    const trimmedText = text.trim().toLowerCase();
    
    // Direct URL patterns
    if (trimmedText.startsWith('http://') || trimmedText.startsWith('https://')) {
      return true;
    }
    
    // Popular domains without protocol
    const popularDomains = [
      'youtube.com', 'youtu.be', 'google.com', 'github.com', 'stackoverflow.com',
      'reddit.com', 'twitter.com', 'x.com', 'linkedin.com', 'facebook.com',
      'instagram.com', 'tiktok.com', 'netflix.com', 'spotify.com', 'amazon.com',
      'ebay.com', 'wikipedia.org', 'medium.com', 'gmail.com', 'drive.google.com',
      'news.ycombinator.com', 'dev.to', 'hashnode.com', 'codepen.io', 'codesandbox.io'
    ];
    
    // Check if it's a popular domain
    if (popularDomains.some(domain => trimmedText === domain || trimmedText.startsWith(domain + '/'))) {
      return true;
    }
    
    // Enhanced domain patterns - supports ALL TLDs and subdomains
    const domainPatterns = [
      // Standard domains
      /^[\w\.-]+\.[\w]{2,}$/,
      /^[\w\.-]+\.[\w]{2,}\/.*$/,
      // Subdomains
      /^[\w\.-]+\.[\w\.-]+\.[\w]{2,}$/,
      /^[\w\.-]+\.[\w\.-]+\.[\w]{2,}\/.*$/,
      // IP addresses
      /^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/,
      /^(\d{1,3}\.){3}\d{1,3}(:\d+)?\/.*$/,
      // Localhost
      /^localhost(:\d+)?$/,
      /^localhost(:\d+)?\/.*$/,
      // Special cases
      /^youtu\.be\/[\w-]+$/,
      /^(www\.)?youtube\.com\/.*$/,
      // International domains
      /^[\w\.-]+\.(co\.uk|com\.au|co\.jp|co\.kr|com\.br|co\.in|com\.mx|co\.za)$/,
      /^[\w\.-]+\.(de|fr|it|es|nl|se|no|dk|fi|pl|cz|hu|ro|bg|hr|si|sk|lt|lv|ee)$/,
      // New TLDs
      /^[\w\.-]+\.(io|ai|app|dev|tech|blog|news|shop|store|online|site|website|cloud|digital)$/
    ];
    
    return domainPatterns.some(pattern => pattern.test(trimmedText));
  };

  const formatUrl = (input: string) => {
    const trimmed = input.trim();
    
    // If already has protocol, return as is
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    
    // For localhost or IP addresses, use http
    if (trimmed.startsWith('localhost') || /^(\d{1,3}\.){3}\d{1,3}/.test(trimmed)) {
      return `http://${trimmed}`;
    }
    
    // For all other domains, use https
    return `https://${trimmed}`;
  };

  const handleSearch = (query: string = searchQuery) => {
    if (!query.trim()) return;

    if (isUrl(query)) {
      // Handle direct URL navigation
      const url = formatUrl(query);
      onNavigateToUrl(url);
    } else {
      // Use Google search
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      onNavigateToUrl(searchUrl);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
      setSearchFocused(false);
      setSuggestions([]);
    }
  };

  const generateSmartSuggestions = (value: string) => {
    const suggestions = [];
    const lowerValue = value.toLowerCase();
    
    // Direct domain suggestions for popular sites
    const popularSites = [
      { domain: 'youtube.com', trigger: ['youtube', 'video', 'watch'] },
      { domain: 'github.com', trigger: ['github', 'git', 'code', 'repo'] },
      { domain: 'stackoverflow.com', trigger: ['stack', 'overflow', 'programming'] },
      { domain: 'reddit.com', trigger: ['reddit', 'r/', 'subreddit'] },
      { domain: 'twitter.com', trigger: ['twitter', 'tweet', 'x.com'] },
      { domain: 'linkedin.com', trigger: ['linkedin', 'professional', 'career'] },
      { domain: 'facebook.com', trigger: ['facebook', 'fb', 'social'] },
      { domain: 'instagram.com', trigger: ['instagram', 'insta', 'photo'] },
      { domain: 'netflix.com', trigger: ['netflix', 'movie', 'series'] },
      { domain: 'spotify.com', trigger: ['spotify', 'music', 'playlist'] },
      { domain: 'amazon.com', trigger: ['amazon', 'shop', 'buy'] },
      { domain: 'wikipedia.org', trigger: ['wiki', 'wikipedia', 'encyclopedia'] },
      { domain: 'medium.com', trigger: ['medium', 'article', 'blog'] },
      { domain: 'dev.to', trigger: ['dev.to', 'developer', 'programming'] },
      { domain: 'codepen.io', trigger: ['codepen', 'code', 'demo'] },
      { domain: 'news.ycombinator.com', trigger: ['hacker news', 'hn', 'tech news'] }
    ];

    // Check for popular site matches
    popularSites.forEach(site => {
      if (site.trigger.some(trigger => lowerValue.includes(trigger))) {
        suggestions.push(site.domain);
      }
    });

    // If it looks like a partial domain, suggest completions
    if (lowerValue.length > 2 && !lowerValue.includes(' ')) {
      const commonTlds = ['com', 'org', 'net', 'edu', 'gov', 'io', 'ai', 'co', 'app', 'dev'];
      const internationalTlds = ['co.uk', 'com.au', 'de', 'fr', 'jp', 'cn', 'in', 'br'];
      
      if (!value.includes('.')) {
        // Suggest adding TLDs
        commonTlds.forEach(tld => {
          suggestions.push(`${value}.${tld}`);
        });
        internationalTlds.slice(0, 3).forEach(tld => {
          suggestions.push(`${value}.${tld}`);
        });
      }
    }

    // AI-powered suggestions
    if (lowerValue.length > 3) {
      suggestions.push(`AI Summary: ${value}`);
      suggestions.push(`Research: ${value}`);
    }

    // Search variations
    if (!isUrl(value)) {
      suggestions.push(`${value} tutorial`);
      suggestions.push(`${value} reviews`);
      suggestions.push(`${value} latest news`);
      suggestions.push(`${value} site:reddit.com`);
    }

    // Remove duplicates and limit
    return [...new Set(suggestions)].slice(0, 8);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearchChange(value);
    
    if (value.length > 1) {
      const smartSuggestions = generateSmartSuggestions(value);
      setSuggestions(smartSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion.startsWith('AI Summary:')) {
      const query = suggestion.replace('AI Summary: ', '');
      onSearchChange(query);
      handleSearch(`${query} AI summary analysis`);
    } else if (suggestion.startsWith('Research:')) {
      const query = suggestion.replace('Research: ', '');
      onSearchChange(query);
      handleSearch(`${query} research papers academic`);
    } else {
      onSearchChange(suggestion);
      handleSearch(suggestion);
    }
    setSearchFocused(false);
    setSuggestions([]);
  };

  const getSuggestionIcon = (suggestion: string) => {
    if (suggestion.startsWith('AI Summary:')) return <Bot className="w-4 h-4 text-blue-500" />;
    if (suggestion.startsWith('Research:')) return <Bot className="w-4 h-4 text-purple-500" />;
    if (suggestion.includes('youtube.com') || suggestion.includes('youtu.be')) return <span className="text-sm">📺</span>;
    if (suggestion.includes('google.com') || suggestion.includes('gmail.com')) return <span className="text-sm">🔍</span>;
    if (suggestion.includes('github.com')) return <span className="text-sm">🐙</span>;
    if (suggestion.includes('stackoverflow.com')) return <span className="text-sm">📚</span>;
    if (suggestion.includes('reddit.com')) return <span className="text-sm">🤖</span>;
    if (suggestion.includes('twitter.com')) return <span className="text-sm">🐦</span>;
    if (suggestion.includes('linkedin.com')) return <span className="text-sm">💼</span>;
    if (suggestion.includes('netflix.com')) return <span className="text-sm">🎬</span>;
    if (suggestion.includes('spotify.com')) return <span className="text-sm">🎧</span>;
    if (suggestion.includes('amazon.com')) return <span className="text-sm">📦</span>;
    if (suggestion.includes('wikipedia.org')) return <span className="text-sm">📖</span>;
    if (suggestion.includes('.')) return <Globe className="w-4 h-4 text-green-500" />;
    return <Search className="w-4 h-4 text-gray-400" />;
  };

  const getSuggestionBadge = (suggestion: string) => {
    if (suggestion.startsWith('AI')) return 'AI Enhanced';
    if (suggestion.includes('youtube.com') || suggestion.includes('youtu.be')) return 'Video';
    if (suggestion.includes('google.com') || suggestion.includes('gmail.com')) return 'Google';
    if (suggestion.includes('github.com')) return 'Code';
    if (suggestion.includes('stackoverflow.com')) return 'Q&A';
    if (suggestion.includes('reddit.com')) return 'Community';
    if (suggestion.includes('netflix.com')) return 'Streaming';
    if (suggestion.includes('spotify.com')) return 'Music';
    if (suggestion.includes('amazon.com')) return 'Shopping';
    if (suggestion.includes('wikipedia.org')) return 'Knowledge';
    if (suggestion.includes('.com')) return 'Website';
    if (suggestion.includes('.org')) return 'Organization';
    if (suggestion.includes('.edu')) return 'Educational';
    if (suggestion.includes('.gov')) return 'Government';
    if (suggestion.includes('.io') || suggestion.includes('.ai') || suggestion.includes('.dev')) return 'Tech';
    if (suggestion.includes('site:')) return 'Site Search';
    if (suggestion.includes('tutorial')) return 'Learning';
    if (suggestion.includes('reviews')) return 'Reviews';
    if (suggestion.includes('news')) return 'News';
    return null;
  };

  return (
    <div className="flex items-center space-x-3 px-4 py-3 bg-white">
      {/* Navigation Controls */}
      <div className="flex items-center space-x-1">
        <button 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => window.history.forward()}
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <button 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => window.location.reload()}
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={onNavigateHome}
        >
          <Home className="w-4 h-4" />
        </button>
      </div>

      {/* Universal Search Bar */}
      <div className="flex-1 relative">
        <motion.div
          animate={{
            scale: searchFocused ? 1.02 : 1,
            boxShadow: searchFocused 
              ? '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
          }}
          className="relative bg-gray-50 rounded-xl border border-gray-200 overflow-hidden"
        >
          {/* AI Status Indicator */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            <Shield className="w-4 h-4 text-green-500" />
            <Globe className="w-4 h-4 text-blue-500" />
            {aiState.isActive && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <Bot className="w-4 h-4 text-purple-500" />
              </motion.div>
            )}
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            placeholder="Search Google, visit any domain, or enter URL..."
            className="w-full pl-24 pr-20 py-3 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none"
          />

          {/* Search Actions */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            <button 
              onClick={handleVoiceSearch}
              className={`p-1.5 rounded-lg transition-colors ${
                isVoiceActive 
                  ? 'bg-red-100 text-red-600' 
                  : 'hover:bg-gray-200 text-gray-600'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-600">
              <Camera className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleSearch()}
              className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* AI Confidence Indicator */}
          {aiState.confidence > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${aiState.confidence * 100}%` }}
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"
              />
            </div>
          )}
        </motion.div>

        {/* Enhanced Search Suggestions */}
        {searchFocused && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-2 z-50 max-h-96 overflow-y-auto"
          >
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                Smart Suggestions
              </div>
              {suggestions.map((suggestion, index) => (
                <div 
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer group"
                >
                  {getSuggestionIcon(suggestion)}
                  <span className="text-sm flex-1 group-hover:text-gray-900">{suggestion}</span>
                  {getSuggestionBadge(suggestion) && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {getSuggestionBadge(suggestion)}
                    </span>
                  )}
                  {isUrl(suggestion) && (
                    <Zap className="w-3 h-3 text-green-500" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Star className="w-4 h-4" />
        </button>
        <button 
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NavigationBar;