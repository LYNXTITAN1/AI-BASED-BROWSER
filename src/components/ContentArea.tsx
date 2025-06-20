import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  Brain, 
  FileText, 
  Users, 
  TrendingUp,
  Lock,
  Globe,
  Clock,
  Star,
  Search,
  Bot,
  ExternalLink,
  Sparkles,
  Play,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  Loader,
  Monitor,
  Smartphone,
  Tablet,
  Cpu,
  Eye,
  Lightbulb,
  Info
} from 'lucide-react';
import { Tab, AIState } from '../types';

interface ContentAreaProps {
  activeTab?: Tab;
  aiState: AIState;
  isDarkMode: boolean;
}

const ContentArea: React.FC<ContentAreaProps> = ({ activeTab, aiState, isDarkMode }) => {
  const [loadingState, setLoadingState] = useState<'loading' | 'success' | 'error' | 'blocked'>('loading');
  const [retryCount, setRetryCount] = useState(0);
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // List of domains that typically block iframe embedding
  const blockedDomains = [
    'youtube.com', 'youtu.be', 'google.com', 'facebook.com', 'twitter.com', 'x.com',
    'instagram.com', 'linkedin.com', 'github.com', 'stackoverflow.com', 'reddit.com',
    'netflix.com', 'amazon.com', 'ebay.com', 'paypal.com', 'apple.com', 'microsoft.com',
    'zoom.us', 'teams.microsoft.com', 'meet.google.com', 'discord.com', 'slack.com'
  ];

  const isLikelyBlocked = (url: string) => {
    try {
      const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.toLowerCase();
      return blockedDomains.some(blocked => domain.includes(blocked));
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (activeTab?.url && activeTab.url !== 'ai-browser://home') {
      setLoadingState('loading');
      setRetryCount(0);
      setIframeError(false);
      setIframeLoaded(false);
      
      // If it's a known blocked domain, show blocked state immediately
      if (isLikelyBlocked(activeTab.url)) {
        setTimeout(() => {
          setLoadingState('blocked');
          setIframeError(true);
        }, 800);
      } else {
        // For other domains, try loading and set a timeout
        const timer = setTimeout(() => {
          if (!iframeLoaded) {
            setLoadingState('blocked');
            setIframeError(true);
          }
        }, 5000); // 5 second timeout

        return () => clearTimeout(timer);
      }
    }
  }, [activeTab?.url, iframeLoaded]);

  if (!activeTab) {
    return (
      <div className={`flex-1 flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50/50'
      }`}>
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Globe className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg font-medium mb-2">No Active Tab</h3>
          <p className="opacity-70">Open a new tab to start browsing</p>
        </motion.div>
      </div>
    );
  }

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setLoadingState('loading');
    setIframeError(false);
    setIframeLoaded(false);
    
    setTimeout(() => {
      if (!iframeLoaded) {
        setLoadingState('blocked');
        setIframeError(true);
      }
    }, 3000);
  };

  const handleIframeLoad = () => {
    setIframeLoaded(true);
    setLoadingState('success');
    setIframeError(false);
  };

  const handleIframeError = () => {
    setIframeError(true);
    setLoadingState('blocked');
  };

  const handleSearchAction = (searchTerm: string) => {
    const searchInput = document.querySelector('input[placeholder*="Search with AI"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = searchTerm;
      searchInput.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
    }
  };

  const renderContent = () => {
    if (activeTab.url === 'ai-browser://home') {
      return (
        <div className="max-w-7xl mx-auto p-8 space-y-16">
          {/* Hero Section with 3D Elements */}
          <motion.div 
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-6">
              <motion.h1 
                className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent"
                style={{ fontVariationSettings: '"wght" 800' }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                AI Browser Pro
              </motion.h1>
              <motion.div
                className="text-2xl font-medium opacity-80"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  2025 Edition
                </span>
              </motion.div>
              <p className="text-xl opacity-70 max-w-3xl mx-auto leading-relaxed">
                Experience the future of web browsing with quantum AI, neural networks, 
                and cutting-edge 2025 technologies
              </p>
            </div>

            {/* Floating Action Buttons */}
            <motion.div
              className="flex flex-wrap justify-center gap-6 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {[
                { icon: Search, label: 'Neural Search', color: 'blue', action: () => handleSearchAction('') },
                { icon: Bot, label: 'AI Assistant', color: 'purple', action: () => {} },
                { icon: Globe, label: 'Universal Access', color: 'green', action: () => {} },
                { icon: Brain, label: 'Quantum Analysis', color: 'cyan', action: () => {} }
              ].map((button, index) => (
                <motion.button
                  key={button.label}
                  onClick={button.action}
                  className={`group relative flex items-center space-x-3 px-8 py-4 rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/70' 
                      : 'bg-white/50 border-gray-200/50 hover:bg-white/80'
                  }`}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    boxShadow: isDarkMode 
                      ? '0 20px 60px rgba(59, 130, 246, 0.3)' 
                      : '0 20px 60px rgba(0, 0, 0, 0.1)'
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <motion.div
                    className={`p-3 rounded-xl bg-gradient-to-br from-${button.color}-500 to-${button.color}-600`}
                    whileHover={{ rotateY: 15, scale: 1.1 }}
                  >
                    <button.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <span className="font-semibold text-lg">{button.label}</span>
                  
                  {/* Hover Glow */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)`
                    }}
                  />
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Features Grid with Masonry Layout */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[
              {
                icon: Globe,
                title: 'Universal Web Access',
                description: 'Browse ANY domain worldwide - .com, .org, international domains. Smart iframe embedding with fallback options.',
                color: 'blue',
                badge: 'Global',
                height: 'h-64'
              },
              {
                icon: Shield,
                title: 'Smart Security',
                description: 'Intelligent handling of X-Frame-Options and CSP headers. Secure browsing with external window fallbacks.',
                color: 'green',
                badge: 'Secure',
                height: 'h-72'
              },
              {
                icon: Bot,
                title: 'AI Enhancement',
                description: 'Every website gets AI analysis, summaries, and intelligent insights - even when iframe embedding is blocked.',
                color: 'purple',
                badge: 'Smart',
                height: 'h-80'
              },
              {
                icon: Zap,
                title: 'Fast Navigation',
                description: 'Instant detection of embedding restrictions with seamless fallback to external windows.',
                color: 'yellow',
                badge: 'Fast',
                height: 'h-68'
              },
              {
                icon: Search,
                title: 'Universal Search',
                description: 'Search across Google, Bing, DuckDuckGo, and specialized engines with smart domain detection.',
                color: 'indigo',
                badge: 'Comprehensive',
                height: 'h-76'
              },
              {
                icon: FileText,
                title: 'Content Analysis',
                description: 'AI-powered content extraction, summarization, and research tools that work regardless of embedding restrictions.',
                color: 'red',
                badge: 'Intelligent',
                height: 'h-72'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ 
                  y: -10, 
                  rotateY: 5,
                  boxShadow: isDarkMode 
                    ? '0 25px 80px rgba(59, 130, 246, 0.3)' 
                    : '0 25px 80px rgba(0, 0, 0, 0.1)'
                }}
                className={`${feature.height} backdrop-blur-xl rounded-3xl border p-8 group cursor-pointer transition-all duration-500 relative overflow-hidden ${
                  isDarkMode 
                    ? 'bg-gray-800/30 border-gray-700/30 hover:border-gray-600/50' 
                    : 'bg-white/30 border-gray-200/30 hover:border-gray-300/50'
                }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Background Gradient */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)`
                  }}
                />

                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <motion.div
                      className={`p-4 bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 rounded-2xl shadow-lg`}
                      whileHover={{ 
                        scale: 1.2, 
                        rotateY: 15,
                        rotateX: 15
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <motion.span 
                      className={`text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm ${
                        isDarkMode 
                          ? `bg-${feature.color}-900/30 text-${feature.color}-300 border border-${feature.color}-400/30` 
                          : `bg-${feature.color}-100/80 text-${feature.color}-700 border border-${feature.color}-300/50`
                      }`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {feature.badge}
                    </motion.span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {feature.title}
                    </h3>
                    <p className="opacity-80 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </div>

                  {/* Floating Particles */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-blue-400/50 rounded-full"
                        animate={{
                          x: [0, Math.random() * 100],
                          y: [0, Math.random() * 100],
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          delay: i * 1.5,
                          ease: "easeInOut"
                        }}
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Links with Parallax Effect */}
          <motion.div 
            className={`backdrop-blur-xl rounded-3xl border p-12 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700/30' 
                : 'bg-gradient-to-br from-white/30 to-gray-50/30 border-gray-200/30'
            }`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Try These Popular Sites
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                { name: 'Google', url: 'google.com', icon: '🔍', note: 'Search Engine' },
                { name: 'YouTube', url: 'youtube.com', icon: '📺', note: 'Opens Externally' },
                { name: 'GitHub', url: 'github.com', icon: '🐙', note: 'Opens Externally' },
                { name: 'Wikipedia', url: 'wikipedia.org', icon: '📖', note: 'Embeddable' },
                { name: 'Example', url: 'example.com', icon: '🌐', note: 'Test Site' },
                { name: 'MDN Docs', url: 'developer.mozilla.org', icon: '📚', note: 'Embeddable' }
              ].map((link, index) => (
                <motion.button
                  key={link.name}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  className={`group flex flex-col items-center space-y-3 p-6 backdrop-blur-sm rounded-2xl border transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-800/30 border-gray-700/30 hover:bg-gray-700/50' 
                      : 'bg-white/30 border-gray-200/30 hover:bg-white/60'
                  }`}
                  onClick={() => handleSearchAction(link.url)}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    rotateY: 10
                  }}
                  whileTap={{ scale: 0.95 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <motion.div
                    className="text-4xl group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotateZ: 10 }}
                  >
                    {link.icon}
                  </motion.div>
                  <div className="text-center">
                    <span className="text-sm font-semibold block">{link.name}</span>
                    <span className="text-xs opacity-60">{link.note}</span>
                  </div>
                  
                  {/* Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)`
                    }}
                  />
                </motion.button>
              ))}
            </div>
            
            {/* Info Box */}
            <motion.div 
              className={`mt-8 p-4 rounded-2xl border ${
                isDarkMode 
                  ? 'bg-blue-900/20 border-blue-400/30' 
                  : 'bg-blue-50/80 border-blue-300/50'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-400 mb-1">Smart Embedding Detection</h4>
                  <p className="text-sm opacity-80">
                    Some sites like YouTube, Google, and GitHub prevent iframe embedding for security. 
                    We automatically detect this and offer to open them in new windows while providing AI analysis.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      );
    }

    // External website handling
    if (activeTab.url.startsWith('http')) {
      return (
        <div className="h-full flex flex-col">
          {/* Enhanced Website Info Bar */}
          <motion.div 
            className={`backdrop-blur-xl border-b p-4 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-blue-900/20 to-green-900/20 border-gray-700/50' 
                : 'bg-gradient-to-r from-blue-50/80 to-green-50/80 border-gray-200/50'
            }`}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Globe className="w-5 h-5 text-blue-400" />
                </motion.div>
                <span className="font-semibold text-blue-400">Web Portal</span>
              </div>
              
              <div className="flex-1 min-w-0">
                <span className="text-sm opacity-70 truncate block">{activeTab.url}</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {loadingState === 'success' && !iframeError && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center space-x-1"
                    >
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">Embedded Successfully</span>
                    </motion.div>
                  )}
                  {loadingState === 'loading' && (
                    <motion.div
                      className="flex items-center space-x-1"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Loader className="w-4 h-4 text-blue-400 animate-spin" />
                      <span className="text-sm text-blue-400">Loading...</span>
                    </motion.div>
                  )}
                  {(loadingState === 'blocked' || iframeError) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center space-x-1"
                    >
                      <Shield className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-yellow-400">Embedding Blocked</span>
                    </motion.div>
                  )}
                </div>
                
                <motion.button 
                  onClick={() => window.open(activeTab.url, '_blank')}
                  className={`text-sm px-3 py-1 rounded-full backdrop-blur-sm border transition-all duration-200 ${
                    isDarkMode 
                      ? 'bg-blue-900/30 text-blue-300 border-blue-400/30 hover:bg-blue-800/50' 
                      : 'bg-blue-100/80 text-blue-700 border-blue-300/50 hover:bg-blue-200/80'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Open External
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Content Area */}
          <div className="flex-1 relative">
            <AnimatePresence mode="wait">
              {loadingState === 'loading' && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`absolute inset-0 flex items-center justify-center ${
                    isDarkMode ? 'bg-gray-900/50' : 'bg-white/50'
                  } backdrop-blur-sm z-10`}
                >
                  <div className="text-center">
                    <motion.div
                      className="relative w-24 h-24 mx-auto mb-8"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      <div className="absolute inset-0 border-4 border-blue-400/30 rounded-full"></div>
                      <motion.div
                        className="absolute inset-2 border-4 border-purple-500/50 rounded-full"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      />
                      <motion.div
                        className="absolute inset-4 border-4 border-cyan-400/70 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      <div className="absolute inset-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Cpu className="w-6 h-6 text-white" />
                      </div>
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Loading Website
                    </h3>
                    <p className="opacity-70 mb-6">Attempting to embed {activeTab.url}</p>
                    
                    <div className="flex items-center justify-center space-x-3 text-sm">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Brain className="w-5 h-5 text-purple-400" />
                      </motion.div>
                      <span className="opacity-80">Checking embedding permissions...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {loadingState === 'success' && !iframeError && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full relative"
                >
                  <iframe
                    src={activeTab.url}
                    className="w-full h-full border-0"
                    title={activeTab.title}
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  
                  {/* AI Enhancement Overlay */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className={`absolute top-6 right-6 backdrop-blur-xl rounded-2xl border p-4 shadow-2xl ${
                      isDarkMode 
                        ? 'bg-gray-900/90 border-gray-700/50' 
                        : 'bg-white/90 border-gray-200/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      >
                        <Bot className="w-5 h-5 text-purple-400" />
                      </motion.div>
                      <div>
                        <span className="font-semibold text-sm">AI Enhanced</span>
                        <div className="text-xs opacity-70">{Math.round(aiState.confidence * 100)}% Analysis</div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {(loadingState === 'blocked' || iframeError) && (
                <motion.div
                  key="blocked"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`h-full flex items-center justify-center p-8 ${
                    isDarkMode ? 'bg-gray-900/50' : 'bg-white/50'
                  }`}
                >
                  <div className="text-center max-w-2xl">
                    <motion.div
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Shield className="w-20 h-20 text-blue-400 mx-auto mb-6" />
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold mb-4">Website Security Protection</h3>
                    <p className="opacity-80 mb-8 leading-relaxed">
                      <strong>{new URL(activeTab.url).hostname}</strong> prevents iframe embedding using X-Frame-Options headers. 
                      This is a security feature to protect against clickjacking attacks and is common for major websites.
                    </p>
                    
                    {/* Website Preview Card */}
                    <motion.div 
                      className={`backdrop-blur-xl rounded-2xl border p-8 mb-8 ${
                        isDarkMode 
                          ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-gray-700/50' 
                          : 'bg-gradient-to-br from-blue-50/80 to-purple-50/80 border-gray-200/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center space-x-4 mb-6">
                        <motion.div
                          className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center"
                          whileHover={{ rotateY: 15, scale: 1.1 }}
                        >
                          <Globe className="w-8 h-8 text-white" />
                        </motion.div>
                        <div className="text-left">
                          <h4 className="font-bold text-lg">{activeTab.title}</h4>
                          <p className="opacity-70">{activeTab.url}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { icon: Shield, label: 'Security', value: 'Protected', color: 'green' },
                          { icon: Brain, label: 'AI Ready', value: 'Available', color: 'purple' },
                          { icon: ExternalLink, label: 'Access', value: 'External', color: 'blue' }
                        ].map((stat) => (
                          <motion.div
                            key={stat.label}
                            className={`backdrop-blur-sm rounded-xl p-4 ${
                              isDarkMode ? 'bg-white/10' : 'bg-white/60'
                            }`}
                            whileHover={{ scale: 1.05 }}
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
                              <span className="text-xs font-medium opacity-70">{stat.label}</span>
                            </div>
                            <p className={`text-sm font-bold text-${stat.color}-400`}>{stat.value}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                    
                    <div className="space-y-4">
                      <motion.button 
                        onClick={() => window.open(activeTab.url, '_blank')}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 font-semibold"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ExternalLink className="w-5 h-5" />
                        <span>Open in New Window</span>
                      </motion.button>
                      
                      <motion.button 
                        onClick={handleRetry}
                        className={`w-full backdrop-blur-sm border px-8 py-4 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 font-semibold ${
                          isDarkMode 
                            ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/70' 
                            : 'bg-white/50 border-gray-200/50 hover:bg-white/80'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <RefreshCw className="w-5 h-5" />
                        <span>Try Again {retryCount > 0 && `(${retryCount})`}</span>
                      </motion.button>
                    </div>
                    
                    {/* AI Alternatives */}
                    <motion.div 
                      className={`mt-8 p-6 backdrop-blur-sm rounded-2xl border ${
                        isDarkMode 
                          ? 'bg-blue-900/20 border-blue-400/30' 
                          : 'bg-blue-50/80 border-blue-300/50'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h4 className="font-bold text-blue-400 mb-4 flex items-center space-x-2">
                        <Lightbulb className="w-5 h-5" />
                        <span>AI Alternatives</span>
                      </h4>
                      <div className="space-y-3">
                        {[
                          { label: 'Get AI summary of this website', action: () => handleSearchAction(`site:${new URL(activeTab.url).hostname} summary`) },
                          { label: 'Find similar embeddable websites', action: () => handleSearchAction(`${activeTab.title} alternative websites`) },
                          { label: 'Search for reviews and information', action: () => handleSearchAction(`${new URL(activeTab.url).hostname} reviews`) }
                        ].map((option, index) => (
                          <motion.button
                            key={index}
                            onClick={option.action}
                            className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                              isDarkMode 
                                ? 'hover:bg-blue-800/30 text-blue-300' 
                                : 'hover:bg-blue-100/80 text-blue-700'
                            }`}
                            whileHover={{ x: 4, scale: 1.02 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                          >
                            → {option.label}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      );
    }

    return (
      <div className={`flex-1 flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50/50'
      }`}>
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Globe className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg font-medium mb-2">Ready to Browse</h3>
          <p className="opacity-70">Enter any URL or search term to begin</p>
        </motion.div>
      </div>
    );
  };

  return (
    <motion.div 
      className={`flex-1 overflow-hidden ${
        isDarkMode ? 'bg-gray-900/30' : 'bg-white/30'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Security Bar */}
      <motion.div 
        className={`px-6 py-3 text-sm backdrop-blur-xl border-b ${
          activeTab.securityStatus === 'secure' 
            ? isDarkMode
              ? 'bg-green-900/20 text-green-300 border-green-400/30'
              : 'bg-green-50/80 text-green-800 border-green-200/50'
            : activeTab.securityStatus === 'warning'
            ? isDarkMode
              ? 'bg-yellow-900/20 text-yellow-300 border-yellow-400/30'
              : 'bg-yellow-50/80 text-yellow-800 border-yellow-200/50'
            : isDarkMode
              ? 'bg-red-900/20 text-red-300 border-red-400/30'
              : 'bg-red-50/80 text-red-800 border-red-200/50'
        }`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Shield className="w-4 h-4" />
          </motion.div>
          <span>
            {activeTab.securityStatus === 'secure' ? 'Secure connection' : 'Security notice'}
          </span>
          <span className="opacity-60">• {activeTab.url}</span>
          <div className="ml-auto flex items-center space-x-3">
            {loadingState === 'success' && !iframeError && (
              <motion.span 
                className={`text-xs px-3 py-1 rounded-full backdrop-blur-sm ${
                  isDarkMode 
                    ? 'bg-green-900/30 text-green-300 border border-green-400/30' 
                    : 'bg-green-100/80 text-green-800 border border-green-300/50'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                ✓ Embedded
              </motion.span>
            )}
            {loadingState === 'loading' && (
              <motion.span 
                className={`text-xs px-3 py-1 rounded-full backdrop-blur-sm ${
                  isDarkMode 
                    ? 'bg-blue-900/30 text-blue-300 border border-blue-400/30' 
                    : 'bg-blue-100/80 text-blue-800 border border-blue-300/50'
                }`}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ⟳ Loading...
              </motion.span>
            )}
            {(loadingState === 'blocked' || iframeError) && (
              <motion.span 
                className={`text-xs px-3 py-1 rounded-full backdrop-blur-sm ${
                  isDarkMode 
                    ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-400/30' 
                    : 'bg-yellow-100/80 text-yellow-800 border border-yellow-300/50'
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                🛡️ Protected
              </motion.span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="h-full overflow-hidden">
        {renderContent()}
      </main>
    </motion.div>
  );
};

export default ContentArea;