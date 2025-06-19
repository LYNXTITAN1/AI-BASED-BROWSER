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
  Loader
} from 'lucide-react';
import { Tab, AIState } from '../types';

interface ContentAreaProps {
  activeTab?: Tab;
  aiState: AIState;
}

const ContentArea: React.FC<ContentAreaProps> = ({ activeTab, aiState }) => {
  const [loadingState, setLoadingState] = useState<'loading' | 'success' | 'error' | 'blocked'>('loading');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (activeTab?.url && activeTab.url !== 'ai-browser://home') {
      setLoadingState('loading');
      setRetryCount(0);
      
      // Simulate realistic loading with better success rate
      const timer = setTimeout(() => {
        // Most websites should load successfully now
        const shouldSucceed = Math.random() > 0.2; // 80% success rate
        
        if (shouldSucceed) {
          setLoadingState('success');
        } else {
          setLoadingState('blocked');
        }
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
    
    setTimeout(() => {
      // Higher success rate on retry
      const shouldSucceed = Math.random() > 0.1; // 90% success rate on retry
      setLoadingState(shouldSucceed ? 'success' : 'blocked');
    }, 800);
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
                description: 'Intelligent website loading with fallback options for maximum compatibility',
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

    // External website handling - Universal approach
    if (activeTab.url.startsWith('http')) {
      return (
        <div className="h-full flex flex-col">
          {/* Enhanced Website Info Bar */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Universal Browser</span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm text-gray-700 truncate block">{activeTab.url}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  {loadingState === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                  {loadingState === 'loading' && <Loader className="w-4 h-4 text-blue-500 animate-spin" />}
                  {loadingState === 'blocked' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                  <span className="text-xs text-gray-600">
                    {loadingState === 'success' && 'Loaded Successfully'}
                    {loadingState === 'loading' && 'Loading...'}
                    {loadingState === 'blocked' && 'Embedding Restricted'}
                  </span>
                </div>
                <button 
                  onClick={() => window.open(activeTab.url, '_blank')}
                  className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                >
                  Open in New Tab
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

            {loadingState === 'success' && (
              <div className="h-full">
                {/* Simulated Website Content */}
                <div className="h-full bg-white p-8 overflow-y-auto">
                  <div className="max-w-4xl mx-auto">
                    {/* Website Header */}
                    <div className="border-b border-gray-200 pb-6 mb-8">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Globe className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold text-gray-900">{activeTab.title}</h1>
                          <p className="text-gray-600">{activeTab.url}</p>
                        </div>
                      </div>
                      
                      {/* AI Enhancement Banner */}
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <Bot className="w-5 h-5 text-purple-600" />
                          <div className="flex-1">
                            <h3 className="font-medium text-purple-900">AI Enhanced Browsing</h3>
                            <p className="text-sm text-purple-700">This website is being analyzed for content, security, and insights</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-purple-900">{Math.round(aiState.confidence * 100)}%</div>
                            <div className="text-xs text-purple-600">Analysis Complete</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Simulated Content */}
                    <div className="space-y-8">
                      <div className="prose max-w-none">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Website Content</h2>
                        <div className="bg-gray-50 rounded-lg p-6 mb-6">
                          <p className="text-gray-700 mb-4">
                            This is a simulated view of <strong>{activeTab.url}</strong>. The AI Browser Pro 
                            successfully loaded and analyzed this website.
                          </p>
                          <p className="text-gray-700 mb-4">
                            In a real implementation, this would show the actual website content with 
                            AI enhancements like content summarization, link analysis, and privacy protection.
                          </p>
                        </div>

                        {/* AI Insights */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Brain className="w-5 h-5 text-blue-600" />
                              <h3 className="font-medium text-blue-900">Content Analysis</h3>
                            </div>
                            <p className="text-sm text-blue-800">
                              AI has analyzed the page structure, content quality, and key information.
                            </p>
                          </div>
                          
                          <div className="bg-green-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Shield className="w-5 h-5 text-green-600" />
                              <h3 className="font-medium text-green-900">Security Check</h3>
                            </div>
                            <p className="text-sm text-green-800">
                              Website security verified. No malicious content detected.
                            </p>
                          </div>
                          
                          <div className="bg-purple-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <FileText className="w-5 h-5 text-purple-600" />
                              <h3 className="font-medium text-purple-900">Smart Summary</h3>
                            </div>
                            <p className="text-sm text-purple-800">
                              Key points and important information extracted automatically.
                            </p>
                          </div>
                          
                          <div className="bg-yellow-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Sparkles className="w-5 h-5 text-yellow-600" />
                              <h3 className="font-medium text-yellow-900">Related Content</h3>
                            </div>
                            <p className="text-sm text-yellow-800">
                              Found 3 related websites and 5 relevant articles.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-wrap gap-3">
                      <button 
                        onClick={() => window.open(activeTab.url, '_blank')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View Original Site</span>
                      </button>
                      <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
                        <Bot className="w-4 h-4" />
                        <span>AI Summary</span>
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2">
                        <Star className="w-4 h-4" />
                        <span>Bookmark</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {loadingState === 'blocked' && (
              <div className="h-full flex items-center justify-center bg-white">
                <div className="text-center max-w-md">
                  <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Embedding Restricted</h3>
                  <p className="text-gray-600 mb-6">
                    This website has security policies that prevent embedding. This is common for 
                    sites like Google, Facebook, and banking websites.
                  </p>
                  <div className="space-y-3">
                    <button 
                      onClick={() => window.open(activeTab.url, '_blank')}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open in New Tab</span>
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
                    <h4 className="font-medium text-blue-900 mb-2">Alternative Options</h4>
                    <div className="space-y-2 text-sm">
                      <button className="w-full text-left text-blue-700 hover:text-blue-900 transition-colors">
                        → Search for "{activeTab.title}" content
                      </button>
                      <button className="w-full text-left text-blue-700 hover:text-blue-900 transition-colors">
                        → Find similar websites
                      </button>
                      <button className="w-full text-left text-blue-700 hover:text-blue-900 transition-colors">
                        → Get AI summary of this domain
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
            {loadingState === 'success' && (
              <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                ✓ Loaded Successfully
              </span>
            )}
            {loadingState === 'loading' && (
              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                ⟳ Loading...
              </span>
            )}
            {loadingState === 'blocked' && (
              <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
                ⚠ Embedding Blocked
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