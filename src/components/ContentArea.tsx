import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Tablet
} from 'lucide-react';
import { Tab, AIState } from '../types';

interface ContentAreaProps {
  activeTab?: Tab;
  aiState: AIState;
}

const ContentArea: React.FC<ContentAreaProps> = ({ activeTab, aiState }) => {
  const [loadingState, setLoadingState] = useState<'loading' | 'success' | 'error' | 'blocked'>('loading');
  const [retryCount, setRetryCount] = useState(0);
  const [iframeError, setIframeError] = useState(false);

  useEffect(() => {
    if (activeTab?.url && activeTab.url !== 'ai-browser://home') {
      setLoadingState('loading');
      setRetryCount(0);
      setIframeError(false);
      
      // Simulate realistic loading
      const timer = setTimeout(() => {
        setLoadingState('success');
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [activeTab?.url]);

  if (!activeTab) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Tab</h3>
          <p className="text-gray-600">Open a new tab to start browsing</p>
        </div>
      </div>
    );
  }

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setLoadingState('loading');
    setIframeError(false);
    
    setTimeout(() => {
      setLoadingState('success');
    }, 800);
  };

  const handleIframeError = () => {
    setIframeError(true);
    setLoadingState('blocked');
  };

  // Render different content based on the active tab URL
  const renderContent = () => {
    // Home page
    if (activeTab.url === 'ai-browser://home') {
      return (
        <div className="max-w-6xl mx-auto p-8 space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Browser Pro
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Experience the future of web browsing with AI-powered search, universal domain access, and intelligent automation
              </p>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-4 mt-8"
            >
              <button 
                onClick={() => {
                  const searchInput = document.querySelector('input[placeholder*="Search Google"]') as HTMLInputElement;
                  if (searchInput) {
                    searchInput.focus();
                    searchInput.value = '';
                  }
                }}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors"
              >
                <Search className="w-5 h-5" />
                <span>Search Anything</span>
              </button>
              <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition-colors">
                <Bot className="w-5 h-5" />
                <span>AI Assistant</span>
              </button>
              <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-colors">
                <Globe className="w-5 h-5" />
                <span>Browse Any Domain</span>
              </button>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: 'Universal Access',
                description: 'Browse ANY domain worldwide - .com, .org, .net, country domains, and more',
                color: 'blue',
                badge: 'Global'
              },
              {
                icon: Shield,
                title: 'Smart Loading',
                description: 'Intelligent website loading with iframe embedding and fallback options',
                color: 'green',
                badge: 'Reliable'
              },
              {
                icon: Bot,
                title: 'AI Enhancement',
                description: 'Every website gets AI analysis, summaries, and intelligent insights',
                color: 'purple',
                badge: 'Smart'
              },
              {
                icon: Zap,
                title: 'Fast Navigation',
                description: 'Quick access to popular sites and smart URL suggestions',
                color: 'yellow',
                badge: 'Fast'
              },
              {
                icon: Search,
                title: 'Universal Search',
                description: 'Search across Google, Bing, DuckDuckGo, and specialized engines',
                color: 'indigo',
                badge: 'Comprehensive'
              },
              {
                icon: FileText,
                title: 'Content Analysis',
                description: 'AI-powered content extraction, summarization, and research tools',
                color: 'red',
                badge: 'Intelligent'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 bg-${feature.color}-100 rounded-xl group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 bg-${feature.color}-100 text-${feature.color}-700 rounded-full`}>
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick Links */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Try These Domains</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'Google', url: 'google.com', icon: '🔍' },
                { name: 'YouTube', url: 'youtube.com', icon: '📺' },
                { name: 'GitHub', url: 'github.com', icon: '🐙' },
                { name: 'Reddit', url: 'reddit.com', icon: '🤖' },
                { name: 'Wikipedia', url: 'wikipedia.org', icon: '📖' },
                { name: 'Stack Overflow', url: 'stackoverflow.com', icon: '📚' }
              ].map((link, index) => (
                <motion.button
                  key={link.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center space-y-2 p-4 bg-white rounded-xl hover:shadow-md transition-all"
                  onClick={() => {
                    const searchInput = document.querySelector('input[placeholder*="Search Google"]') as HTMLInputElement;
                    if (searchInput) {
                      searchInput.value = link.url;
                      searchInput.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
                    }
                  }}
                >
                  <span className="text-2xl">{link.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{link.name}</span>
                </motion.button>
              ))}
            </div>
            
            {/* Domain Examples */}
            <div className="mt-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Try Any Domain</h3>
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                {[
                  'example.com', 'news.bbc.co.uk', 'amazon.de', 'yahoo.co.jp', 
                  'medium.com', 'dev.to', 'hashnode.com', 'codepen.io'
                ].map((domain) => (
                  <button
                    key={domain}
                    onClick={() => {
                      const searchInput = document.querySelector('input[placeholder*="Search Google"]') as HTMLInputElement;
                      if (searchInput) {
                        searchInput.value = domain;
                        searchInput.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
                      }
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                  >
                    {domain}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // External website handling - Real iframe embedding
    if (activeTab.url.startsWith('http')) {
      return (
        <div className="h-full flex flex-col">
          {/* Enhanced Website Info Bar */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-200 p-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900 text-sm">Live Website</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs text-gray-700 truncate block">{activeTab.url}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  {loadingState === 'success' && !iframeError && <CheckCircle className="w-3 h-3 text-green-500" />}
                  {loadingState === 'loading' && <Loader className="w-3 h-3 text-blue-500 animate-spin" />}
                  {(loadingState === 'blocked' || iframeError) && <AlertTriangle className="w-3 h-3 text-yellow-500" />}
                  <span className="text-xs text-gray-600">
                    {loadingState === 'success' && !iframeError && 'Loaded'}
                    {loadingState === 'loading' && 'Loading...'}
                    {(loadingState === 'blocked' || iframeError) && 'Blocked'}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Monitor className="w-3 h-3 text-gray-500" />
                  <Smartphone className="w-3 h-3 text-gray-400" />
                  <Tablet className="w-3 h-3 text-gray-400" />
                </div>
                <button 
                  onClick={() => window.open(activeTab.url, '_blank')}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors"
                >
                  Open External
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 relative">
            {loadingState === 'loading' && (
              <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Loading Website</h3>
                  <p className="text-gray-600 mb-4">Connecting to {activeTab.url}</p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                    <Bot className="w-4 h-4 text-purple-500" />
                    <span>AI analysis in progress...</span>
                  </div>
                </div>
              </div>
            )}

            {loadingState === 'success' && !iframeError && (
              <div className="h-full relative">
                {/* Real iframe for website embedding */}
                <iframe
                  src={activeTab.url}
                  className="w-full h-full border-0"
                  title={activeTab.title}
                  onError={handleIframeError}
                  onLoad={() => setLoadingState('success')}
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                
                {/* AI Enhancement Overlay */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900">AI Enhanced</span>
                    <div className="text-xs text-gray-600">{Math.round(aiState.confidence * 100)}%</div>
                  </div>
                </div>
              </div>
            )}

            {(loadingState === 'blocked' || iframeError) && (
              <div className="h-full flex items-center justify-center bg-white">
                <div className="text-center max-w-md">
                  <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Website Protection Active</h3>
                  <p className="text-gray-600 mb-6">
                    This website has security policies that prevent embedding (X-Frame-Options). 
                    This is common for sites like Google, Facebook, and banking websites to prevent clickjacking attacks.
                  </p>
                  
                  {/* Website Preview Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-900">{activeTab.title}</h4>
                        <p className="text-sm text-gray-600">{activeTab.url}</p>
                      </div>
                    </div>
                    
                    {/* AI Analysis */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white/60 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span className="text-xs font-medium text-green-900">Security</span>
                        </div>
                        <p className="text-xs text-green-800">Protected</p>
                      </div>
                      <div className="bg-white/60 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <Brain className="w-4 h-4 text-purple-600" />
                          <span className="text-xs font-medium text-purple-900">AI Status</span>
                        </div>
                        <p className="text-xs text-purple-800">Analyzing</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={() => window.open(activeTab.url, '_blank')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open in New Window</span>
                    </button>
                    <button 
                      onClick={handleRetry}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Try Again {retryCount > 0 && `(${retryCount})`}</span>
                    </button>
                  </div>
                  
                  {/* Alternative Options */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">AI Alternatives</h4>
                    <div className="space-y-2 text-sm">
                      <button 
                        onClick={() => {
                          const searchInput = document.querySelector('input[placeholder*="Search Google"]') as HTMLInputElement;
                          if (searchInput) {
                            searchInput.value = `site:${new URL(activeTab.url).hostname} summary`;
                            searchInput.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
                          }
                        }}
                        className="w-full text-left text-blue-700 hover:text-blue-900 transition-colors p-2 hover:bg-blue-100 rounded"
                      >
                        → Get AI summary of this website
                      </button>
                      <button 
                        onClick={() => {
                          const searchInput = document.querySelector('input[placeholder*="Search Google"]') as HTMLInputElement;
                          if (searchInput) {
                            searchInput.value = `${activeTab.title} alternative websites`;
                            searchInput.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
                          }
                        }}
                        className="w-full text-left text-blue-700 hover:text-blue-900 transition-colors p-2 hover:bg-blue-100 rounded"
                      >
                        → Find similar websites
                      </button>
                      <button 
                        onClick={() => {
                          const searchInput = document.querySelector('input[placeholder*="Search Google"]') as HTMLInputElement;
                          if (searchInput) {
                            searchInput.value = `${new URL(activeTab.url).hostname} reviews`;
                            searchInput.dispatchEvent(new KeyboardEvent('keypress', { key: 'Enter' }));
                          }
                        }}
                        className="w-full text-left text-blue-700 hover:text-blue-900 transition-colors p-2 hover:bg-blue-100 rounded"
                      >
                        → Search for reviews and info
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Default fallback
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Browse</h3>
          <p className="text-gray-600">Enter any URL or search term to get started</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-white overflow-hidden">
      {/* Security Bar */}
      <div className={`px-4 py-2 text-sm ${
        activeTab.securityStatus === 'secure' 
          ? 'bg-green-50 text-green-800 border-b border-green-200'
          : activeTab.securityStatus === 'warning'
          ? 'bg-yellow-50 text-yellow-800 border-b border-yellow-200'
          : 'bg-red-50 text-red-800 border-b border-red-200'
      }`}>
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4" />
          <span>
            {activeTab.securityStatus === 'secure' ? 'Secure connection' : 'Security warning'}
          </span>
          <span className="text-xs opacity-75">• {activeTab.url}</span>
          <div className="ml-auto flex items-center space-x-2">
            {loadingState === 'success' && !iframeError && (
              <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                ✓ Live Website
              </span>
            )}
            {loadingState === 'loading' && (
              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                ⟳ Loading...
              </span>
            )}
            {(loadingState === 'blocked' || iframeError) && (
              <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
                🛡️ Protected
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="h-full overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default ContentArea;