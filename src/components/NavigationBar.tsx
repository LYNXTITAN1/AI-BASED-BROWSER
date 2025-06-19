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
  Globe
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
      'ebay.com', 'wikipedia.org', 'medium.com', 'gmail.com', 'drive.google.com'
    ];
    
    // Check if it's a popular domain
    if (popularDomains.some(domain => trimmedText === domain || trimmedText.startsWith(domain + '/'))) {
      return true;
    }
    
    // Domain patterns - supports ALL TLDs
    const domainPatterns = [
      /^[\w\.-]+\.[\w]{2,}$/,
      /^[\w\.-]+\.[\w]{2,}\/.*$/,
      /^[\w\.-]+\.[\w\.-]+\.[\w]{2,}$/,
      /^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/,
      /^localhost(:\d+)?$/,
      /^youtu\.be\/[\w-]+$/,
      /^(www\.)?youtube\.com\/.*$/
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
      // Handle direct URL navigation - navigate within the browser
      const url = formatUrl(query);
      onNavigateToUrl(url);
    } else {
      // Use Google search - navigate within the browser
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      onNavigateToUrl(searchUrl);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const generateSmartSuggestions = (value: string) => {
    const suggestions = [];
    const lowerValue = value.toLowerCase();
    
    // YouTube-specific suggestions
    if (lowerValue.includes('youtube') || lowerValue.includes('video')) {
      suggestions.push('youtube.com');
      suggestions.push('youtu.be');
      suggestions.push(`${value} site:youtube.com`);
    }
    
    // Google-specific suggestions
    if (lowerValue.includes('google')) {
      suggestions.push('google.com');
      suggestions.push('gmail.com');
      suggestions.push('drive.google.com');
    }
    
    // Popular domain suggestions based on input
    const domainSuggestions = [];
    if (lowerValue.includes('github')) domainSuggestions.push('github.com');
    if (lowerValue.includes('reddit')) domainSuggestions.push('reddit.com');
    if (lowerValue.includes('twitter')) domainSuggestions.push('twitter.com');
    if (lowerValue.includes('facebook')) domainSuggestions.push('facebook.com');
    if (lowerValue.includes('instagram')) domainSuggestions.push('instagram.com');
    if (lowerValue.includes('linkedin')) domainSuggestions.push('linkedin.com');
    if (lowerValue.includes('netflix')) domainSuggestions.push('netflix.com');
    if (lowerValue.includes('spotify')) domainSuggestions.push('spotify.com');
    if (lowerValue.includes('amazon')) domainSuggestions.push('amazon.com');
    
    suggestions.push(...domainSuggestions);
    
    // AI-powered suggestions
    suggestions.push(`AI Summary: ${value}`);
    suggestions.push(`Research: ${value}`);
    
    // Domain suggestions for popular TLDs
    const popularTlds = ['com', 'org', 'net', 'edu', 'gov', 'io', 'ai', 'co', 'app', 'dev'];
    popularTlds.forEach(tld => {
      if (!value.includes('.') && !domainSuggestions.length) {
        suggestions.push(`${value}.${tld}`);
      }
    });
    
    // Search variations with Google
    suggestions.push(`${value} site:reddit.com`);
    suggestions.push(`${value} latest news`);
    suggestions.push(`${value} tutorial`);
    suggestions.push(`${value} reviews`);
    
    // International domains
    const internationalTlds = ['co.uk', 'com.au', 'de', 'fr', 'jp', 'cn', 'in', 'br'];
    internationalTlds.forEach(tld => {
      if (!value.includes('.') && !domainSuggestions.length) {
        suggestions.push(`${value}.${tld}`);
      }
    });
    
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
    if (suggestion.includes('.')) return <Globe className="w-4 h-4 text-green-500" />;
    return <Search className="w-4 h-4 text-gray-400" />;
  };

  const getSuggestionBadge = (suggestion: string) => {
    if (suggestion.startsWith('AI')) return 'AI Enhanced';
    if (suggestion.includes('youtube.com') || suggestion.includes('youtu.be')) return 'Video';
    if (suggestion.includes('google.com') || suggestion.includes('gmail.com')) return 'Google';
    if (suggestion.includes('.com')) return 'Popular';
    if (suggestion.includes('.org')) return 'Organization';
    if (suggestion.includes('.edu')) return 'Educational';
    if (suggestion.includes('.gov')) return 'Government';
    if (suggestion.includes('.io') || suggestion.includes('.ai') || suggestion.includes('.dev')) return 'Tech';
    if (suggestion.includes('site:')) return 'Site Search';
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
            placeholder="Search Google, visit YouTube, or any domain worldwide..."
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