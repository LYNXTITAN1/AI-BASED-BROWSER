import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Zap,
  Sparkles,
  Brain,
  Eye
} from 'lucide-react';
import { AIState } from '../types';

interface NavigationBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  aiState: AIState;
  onToggleAISidebar: () => void;
  onNavigateHome: () => void;
  onNavigateToUrl: (url: string) => void;
  isDarkMode: boolean;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  searchQuery,
  onSearchChange,
  aiState,
  onToggleAISidebar,
  onNavigateHome,
  onNavigateToUrl,
  isDarkMode
}) => {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isUrl = (text: string) => {
    const trimmedText = text.trim().toLowerCase();
    
    if (trimmedText.startsWith('http://') || trimmedText.startsWith('https://')) {
      return true;
    }
    
    const popularDomains = [
      'youtube.com', 'youtu.be', 'google.com', 'github.com', 'stackoverflow.com',
      'reddit.com', 'twitter.com', 'x.com', 'linkedin.com', 'facebook.com',
      'instagram.com', 'tiktok.com', 'netflix.com', 'spotify.com', 'amazon.com',
      'ebay.com', 'wikipedia.org', 'medium.com', 'gmail.com', 'drive.google.com',
      'news.ycombinator.com', 'dev.to', 'hashnode.com', 'codepen.io', 'codesandbox.io'
    ];
    
    if (popularDomains.some(domain => trimmedText === domain || trimmedText.startsWith(domain + '/'))) {
      return true;
    }
    
    const domainPatterns = [
      /^[\w\.-]+\.[\w]{2,}$/,
      /^[\w\.-]+\.[\w]{2,}\/.*$/,
      /^[\w\.-]+\.[\w\.-]+\.[\w]{2,}$/,
      /^[\w\.-]+\.[\w\.-]+\.[\w]{2,}\/.*$/,
      /^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/,
      /^(\d{1,3}\.){3}\d{1,3}(:\d+)?\/.*$/,
      /^localhost(:\d+)?$/,
      /^localhost(:\d+)?\/.*$/,
      /^youtu\.be\/[\w-]+$/,
      /^(www\.)?youtube\.com\/.*$/,
      /^[\w\.-]+\.(co\.uk|com\.au|co\.jp|co\.kr|com\.br|co\.in|com\.mx|co\.za)$/,
      /^[\w\.-]+\.(de|fr|it|es|nl|se|no|dk|fi|pl|cz|hu|ro|bg|hr|si|sk|lt|lv|ee)$/,
      /^[\w\.-]+\.(io|ai|app|dev|tech|blog|news|shop|store|online|site|website|cloud|digital)$/
    ];
    
    return domainPatterns.some(pattern => pattern.test(trimmedText));
  };

  const formatUrl = (input: string) => {
    const trimmed = input.trim();
    
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    
    if (trimmed.startsWith('localhost') || /^(\d{1,3}\.){3}\d{1,3}/.test(trimmed)) {
      return `http://${trimmed}`;
    }
    
    return `https://${trimmed}`;
  };

  const handleSearch = (query: string = searchQuery) => {
    if (!query.trim()) return;

    if (isUrl(query)) {
      const url = formatUrl(query);
      onNavigateToUrl(url);
    } else {
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

    popularSites.forEach(site => {
      if (site.trigger.some(trigger => lowerValue.includes(trigger))) {
        suggestions.push(site.domain);
      }
    });

    if (lowerValue.length > 2 && !lowerValue.includes(' ')) {
      const commonTlds = ['com', 'org', 'net', 'edu', 'gov', 'io', 'ai', 'co', 'app', 'dev'];
      const internationalTlds = ['co.uk', 'com.au', 'de', 'fr', 'jp', 'cn', 'in', 'br'];
      
      if (!value.includes('.')) {
        commonTlds.forEach(tld => {
          suggestions.push(`${value}.${tld}`);
        });
        internationalTlds.slice(0, 3).forEach(tld => {
          suggestions.push(`${value}.${tld}`);
        });
      }
    }

    if (lowerValue.length > 3) {
      suggestions.push(`AI Summary: ${value}`);
      suggestions.push(`Research: ${value}`);
    }

    if (!isUrl(value)) {
      suggestions.push(`${value} tutorial`);
      suggestions.push(`${value} reviews`);
      suggestions.push(`${value} latest news`);
      suggestions.push(`${value} site:reddit.com`);
    }

    return [...new Set(suggestions)].slice(0, 8);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearchChange(value);
    setIsTyping(true);
    
    if (value.length > 1) {
      const smartSuggestions = generateSmartSuggestions(value);
      setSuggestions(smartSuggestions);
    } else {
      setSuggestions([]);
    }

    setTimeout(() => setIsTyping(false), 500);
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
    if (suggestion.startsWith('Research:')) return <Brain className="w-4 h-4 text-purple-500" />;
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
    <motion.div
      className="flex items-center space-x-4 px-6 py-4"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      {/* Navigation Controls with 3D Effects */}
      <div className="flex items-center space-x-1">
        {[
          { icon: ArrowLeft, action: () => window.history.back() },
          { icon: ArrowRight, action: () => window.history.forward() },
          { icon: RotateCcw, action: () => window.location.reload() },
          { icon: Home, action: onNavigateHome }
        ].map((button, index) => (
          <motion.button
            key={index}
            whileHover={{ 
              scale: 1.1, 
              rotateY: 10,
              boxShadow: isDarkMode 
                ? '0 8px 32px rgba(59, 130, 246, 0.3)' 
                : '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={button.action}
            className={`p-3 rounded-xl transition-all duration-200 backdrop-blur-sm ${
              isDarkMode 
                ? 'bg-gray-800/50 hover:bg-gray-700/70 border border-gray-700/50' 
                : 'bg-white/50 hover:bg-white/80 border border-gray-200/50'
            }`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <button.icon className="w-4 h-4" />
          </motion.button>
        ))}
      </div>

      {/* Intelligent Omnibox with Advanced Glassmorphism */}
      <div className="flex-1 relative">
        <motion.div
          animate={{
            scale: searchFocused ? 1.02 : 1,
            boxShadow: searchFocused 
              ? isDarkMode
                ? '0 20px 60px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.5)'
                : '0 20px 60px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.3)'
              : isDarkMode
                ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                : '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
          className={`relative backdrop-blur-xl rounded-2xl border overflow-hidden ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-700/50' 
              : 'bg-white/70 border-gray-200/50'
          }`}
        >
          {/* AI Status Indicators with Floating Animation */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-3">
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Shield className="w-4 h-4 text-green-400" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            >
              <Globe className="w-4 h-4 text-blue-400" />
            </motion.div>
            {aiState.isActive && (
              <motion.div
                animate={{ 
                  rotate: 360,
                  y: [0, -2, 0]
                }}
                transition={{ 
                  rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
                  y: { duration: 2, repeat: Infinity, delay: 0.6 }
                }}
              >
                <Bot className="w-4 h-4 text-purple-400" />
              </motion.div>
            )}
          </div>

          {/* Search Input with Variable Typography */}
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
            placeholder="Search with AI, visit any domain, or enter URL..."
            className={`w-full pl-28 pr-24 py-4 bg-transparent text-lg font-medium placeholder-opacity-60 focus:outline-none transition-all duration-300 ${
              isDarkMode 
                ? 'text-white placeholder-gray-400' 
                : 'text-gray-900 placeholder-gray-500'
            } ${searchFocused ? 'text-xl' : ''}`}
            style={{
              fontVariationSettings: searchFocused ? '"wght" 500' : '"wght" 400'
            }}
          />

          {/* Search Actions with Micro-interactions */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            <motion.button 
              whileHover={{ scale: 1.1, rotateZ: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsVoiceActive(!isVoiceActive)}
              className={`p-2 rounded-xl transition-all duration-200 ${
                isVoiceActive 
                  ? 'bg-red-500/20 text-red-400 border border-red-400/30' 
                  : isDarkMode
                    ? 'hover:bg-gray-700/50 text-gray-400'
                    : 'hover:bg-gray-200/50 text-gray-600'
              }`}
            >
              <Mic className="w-4 h-4" />
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.1, rotateZ: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-xl transition-all duration-200 ${
                isDarkMode 
                  ? 'hover:bg-gray-700/50 text-gray-400' 
                  : 'hover:bg-gray-200/50 text-gray-600'
              }`}
            >
              <Camera className="w-4 h-4" />
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSearch()}
              className={`p-2 rounded-xl transition-all duration-200 ${
                isDarkMode 
                  ? 'hover:bg-blue-600/20 text-blue-400 border border-blue-400/30' 
                  : 'hover:bg-blue-100/80 text-blue-600 border border-blue-300/50'
              }`}
            >
              <Search className="w-4 h-4" />
            </motion.button>
          </div>

          {/* AI Confidence Indicator with Gradient Animation */}
          {aiState.confidence > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200/20 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${aiState.confidence * 100}%` }}
                className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-green-400"
                style={{
                  backgroundSize: '200% 100%',
                }}
              />
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </div>
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-2 right-2"
            >
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ 
                      duration: 0.6, 
                      repeat: Infinity, 
                      delay: i * 0.1 
                    }}
                    className="w-1 h-1 bg-blue-400 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Enhanced Search Suggestions with Card-based Interface */}
        <AnimatePresence>
          {searchFocused && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`absolute top-full left-0 right-0 mt-3 backdrop-blur-xl rounded-2xl border shadow-2xl p-3 z-50 max-h-96 overflow-y-auto ${
                isDarkMode 
                  ? 'bg-gray-800/90 border-gray-700/50' 
                  : 'bg-white/90 border-gray-200/50'
              }`}
            >
              <div className="space-y-2">
                <div className={`px-4 py-2 text-xs font-medium uppercase tracking-wide border-b ${
                  isDarkMode 
                    ? 'text-gray-400 border-gray-700/50' 
                    : 'text-gray-500 border-gray-200/50'
                }`}>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-3 h-3" />
                    <span>AI-Powered Suggestions</span>
                  </div>
                </div>
                {suggestions.map((suggestion, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`flex items-center space-x-3 p-4 rounded-xl cursor-pointer group transition-all duration-200 ${
                      isDarkMode 
                        ? 'hover:bg-gray-700/50 border border-transparent hover:border-gray-600/50' 
                        : 'hover:bg-gray-50/80 border border-transparent hover:border-gray-300/50'
                    }`}
                    whileHover={{ scale: 1.02, x: 4 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotateZ: 5 }}
                    >
                      {getSuggestionIcon(suggestion)}
                    </motion.div>
                    <span className="text-sm flex-1 group-hover:font-medium transition-all">
                      {suggestion}
                    </span>
                    <div className="flex items-center space-x-2">
                      {getSuggestionBadge(suggestion) && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isDarkMode 
                            ? 'bg-gray-700/50 text-gray-300' 
                            : 'bg-gray-100/80 text-gray-600'
                        }`}>
                          {getSuggestionBadge(suggestion)}
                        </span>
                      )}
                      {isUrl(suggestion) && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Zap className="w-3 h-3 text-green-400" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons with 3D Hover Effects */}
      <div className="flex items-center space-x-2">
        <motion.button 
          whileHover={{ 
            scale: 1.1, 
            rotateY: 10,
            boxShadow: isDarkMode 
              ? '0 8px 32px rgba(251, 191, 36, 0.3)' 
              : '0 8px 32px rgba(251, 191, 36, 0.2)'
          }}
          whileTap={{ scale: 0.95 }}
          className={`p-3 rounded-xl transition-all duration-200 backdrop-blur-sm ${
            isDarkMode 
              ? 'bg-gray-800/50 hover:bg-yellow-500/20 border border-gray-700/50 hover:border-yellow-400/30' 
              : 'bg-white/50 hover:bg-yellow-100/80 border border-gray-200/50 hover:border-yellow-300/50'
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <Star className="w-4 h-4 text-yellow-400" />
        </motion.button>
        
        <motion.button 
          whileHover={{ 
            scale: 1.1, 
            rotateY: -10,
            boxShadow: isDarkMode 
              ? '0 8px 32px rgba(139, 92, 246, 0.3)' 
              : '0 8px 32px rgba(139, 92, 246, 0.2)'
          }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleAISidebar}
          className={`p-3 rounded-xl transition-all duration-200 backdrop-blur-sm ${
            isDarkMode 
              ? 'bg-gray-800/50 hover:bg-purple-500/20 border border-gray-700/50 hover:border-purple-400/30' 
              : 'bg-white/50 hover:bg-purple-100/80 border border-gray-200/50 hover:border-purple-300/50'
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <Menu className="w-4 h-4 text-purple-400" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default NavigationBar;