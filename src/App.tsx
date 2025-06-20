import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BrowserHeader from './components/BrowserHeader';
import NavigationBar from './components/NavigationBar';
import TabManager from './components/TabManager';
import AIAssistant from './components/AIAssistant';
import ContentArea from './components/ContentArea';
import FloatingAIButton from './components/FloatingAIButton';
import OnboardingTooltips from './components/OnboardingTooltips';
import { Tab, AIState } from './types';

function App() {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: '1',
      title: 'AI Browser Pro - Home',
      url: 'ai-browser://home',
      favicon: '🏠',
      isActive: true,
      aiSummary: 'Your AI-powered browser homepage with intelligent features',
      securityStatus: 'secure'
    }
  ]);

  const [aiState, setAiState] = useState<AIState>({
    isActive: true,
    currentTask: 'Ready to browse any domain worldwide',
    confidence: 0.94,
    suggestions: ['Search with AI', 'Analyze content', 'Smart bookmarks', 'Voice commands']
  });

  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Dynamic theming based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    const isNightTime = hour < 6 || hour > 18;
    setIsDarkMode(isNightTime);
  }, []);

  const addTab = (url: string, title: string) => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title,
      url,
      favicon: getTabFavicon(url),
      isActive: false,
      securityStatus: 'checking'
    };
    
    setTabs(prev => prev.map(tab => ({ ...tab, isActive: false })).concat({ ...newTab, isActive: true }));
    
    setAiState(prev => ({
      ...prev,
      currentTask: `Analyzing new page: ${title}`,
      confidence: 0.85
    }));
  };

  const closeTab = (tabId: string) => {
    setTabs(prev => {
      const filtered = prev.filter(tab => tab.id !== tabId);
      if (filtered.length === 0) {
        return [{
          id: Date.now().toString(),
          title: 'AI Browser Pro - Home',
          url: 'ai-browser://home',
          favicon: '🏠',
          isActive: true,
          aiSummary: 'Your AI-powered browser homepage',
          securityStatus: 'secure'
        }];
      }
      if (filtered.length > 0 && prev.find(tab => tab.id === tabId)?.isActive) {
        filtered[0].isActive = true;
      }
      return filtered;
    });
  };

  const setActiveTab = (tabId: string) => {
    setTabs(prev => prev.map(tab => ({ ...tab, isActive: tab.id === tabId })));
    
    const activeTab = tabs.find(tab => tab.id === tabId);
    if (activeTab) {
      setSearchQuery(activeTab.url === 'ai-browser://home' ? '' : activeTab.url);
      setAiState(prev => ({
        ...prev,
        currentTask: `Analyzing: ${activeTab.title}`,
        confidence: 0.92
      }));
    }
  };

  const getTabFavicon = (url: string): string => {
    const domain = url.toLowerCase();
    
    const favicons = {
      'google.com': '🔍',
      'youtube.com': '📺',
      'github.com': '🐙',
      'stackoverflow.com': '📚',
      'reddit.com': '🤖',
      'twitter.com': '🐦',
      'x.com': '🐦',
      'linkedin.com': '💼',
      'facebook.com': '📘',
      'instagram.com': '📷',
      'tiktok.com': '🎵',
      'netflix.com': '🎬',
      'spotify.com': '🎧',
      'amazon.com': '📦',
      'ebay.com': '🛒',
      'wikipedia.org': '📖',
      'medium.com': '✍️',
      'duckduckgo.com': '🦆',
      'gmail.com': '📧',
      'drive.google.com': '💾'
    };
    
    for (const [domainKey, favicon] of Object.entries(favicons)) {
      if (domain.includes(domainKey)) return favicon;
    }
    
    if (domain.includes('.co.uk')) return '🇬🇧';
    if (domain.includes('.de')) return '🇩🇪';
    if (domain.includes('.fr')) return '🇫🇷';
    if (domain.includes('.jp')) return '🇯🇵';
    if (domain.includes('.cn')) return '🇨🇳';
    if (domain.includes('.in')) return '🇮🇳';
    if (domain.includes('.br')) return '🇧🇷';
    if (domain.includes('.au')) return '🇦🇺';
    if (domain.includes('.ca')) return '🇨🇦';
    if (domain.includes('.ru')) return '🇷🇺';
    if (domain.includes('.kr')) return '🇰🇷';
    if (domain.includes('.mx')) return '🇲🇽';
    if (domain.includes('.es')) return '🇪🇸';
    if (domain.includes('.it')) return '🇮🇹';
    if (domain.includes('.nl')) return '🇳🇱';
    
    if (domain.includes('.edu')) return '🎓';
    if (domain.includes('.gov')) return '🏛️';
    if (domain.includes('.org')) return '🌍';
    if (domain.includes('.mil')) return '🪖';
    if (domain.includes('.io')) return '💻';
    if (domain.includes('.ai')) return '🤖';
    if (domain.includes('.tech')) return '⚡';
    if (domain.includes('.app')) return '📱';
    if (domain.includes('.dev')) return '👨‍💻';
    if (domain.includes('.blog')) return '📝';
    if (domain.includes('.news')) return '📰';
    if (domain.includes('.shop')) return '🛍️';
    if (domain.includes('.store')) return '🏪';
    
    if (domain.includes('ai-browser://home')) return '🏠';
    if (domain.includes('localhost')) return '🏠';
    if (/^\d+\.\d+\.\d+\.\d+/.test(domain)) return '🖥️';
    
    if (domain.includes('.com') || domain.includes('.net')) return '🌐';
    
    return '🔗';
  };

  const getDomainTitle = (url: string): string => {
    try {
      if (url === 'ai-browser://home') return 'AI Browser Pro - Home';
      if (url.includes('google.com')) return 'Google Search';
      if (url.includes('youtube.com')) return 'YouTube';
      
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      const hostname = urlObj.hostname;
      const domain = hostname.replace(/^www\./, '');
      const domainParts = domain.split('.');
      const mainDomain = domainParts[0];
      
      return mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1);
    } catch {
      return url;
    }
  };

  const handleNavigateHome = () => {
    const activeTab = tabs.find(tab => tab.isActive);
    if (activeTab) {
      setTabs(prev => prev.map(tab => 
        tab.id === activeTab.id 
          ? { ...tab, url: 'ai-browser://home', title: 'AI Browser Pro - Home', favicon: '🏠' }
          : tab
      ));
      setSearchQuery('');
      setAiState(prev => ({
        ...prev,
        currentTask: 'Welcome to AI Browser Pro',
        confidence: 0.98
      }));
    }
  };

  const handleNavigateToUrl = (url: string) => {
    const activeTab = tabs.find(tab => tab.isActive);
    if (activeTab) {
      const title = getDomainTitle(url);
      const favicon = getTabFavicon(url);
      const isSecure = url.startsWith('https://') || url === 'ai-browser://home';

      setTabs(prev => prev.map(tab => 
        tab.id === activeTab.id 
          ? { 
              ...tab, 
              url, 
              title, 
              favicon,
              securityStatus: isSecure ? 'secure' : 'warning'
            }
          : tab
      ));
      
      setSearchQuery(url);
      setAiState(prev => ({
        ...prev,
        currentTask: `Loading and analyzing: ${title}`,
        confidence: 0.88,
        suggestions: [
          'Summarize this page',
          'Find related content',
          'Extract key information',
          'Check for privacy concerns'
        ]
      }));
    }
  };

  return (
    <div className={`h-screen flex flex-col overflow-hidden transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-black' 
        : 'bg-gradient-to-br from-gray-50 via-white to-blue-50'
    }`}>
      {/* Glassmorphism Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Browser Chrome with Glassmorphism */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10"
      >
        <BrowserHeader isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} />
      </motion.div>
      
      {/* Navigation and Tab Bar with Progressive Blur */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={`relative z-10 backdrop-blur-xl border-b ${
          isDarkMode 
            ? 'bg-gray-900/80 border-gray-700/50' 
            : 'bg-white/80 border-gray-200/50'
        }`}
      >
        <TabManager 
          tabs={tabs}
          onAddTab={addTab}
          onCloseTab={closeTab}
          onSetActiveTab={setActiveTab}
          isDarkMode={isDarkMode}
        />
        <NavigationBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          aiState={aiState}
          onToggleAISidebar={() => setAiSidebarOpen(!aiSidebarOpen)}
          onNavigateHome={handleNavigateHome}
          onNavigateToUrl={handleNavigateToUrl}
          isDarkMode={isDarkMode}
        />
      </motion.div>

      {/* Main Content Area with 3D Transform */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Content Area */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 relative"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          <ContentArea 
            activeTab={tabs.find(tab => tab.isActive)}
            aiState={aiState}
            isDarkMode={isDarkMode}
          />
        </motion.div>
        
        {/* AI Assistant Sidebar with Slide Animation */}
        <AnimatePresence>
          {aiSidebarOpen && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
              }}
              className={`w-96 backdrop-blur-xl border-l ${
                isDarkMode 
                  ? 'bg-gray-900/90 border-gray-700/50' 
                  : 'bg-white/90 border-gray-200/50'
              }`}
            >
              <AIAssistant 
                aiState={aiState}
                onUpdateState={setAiState}
                searchQuery={searchQuery}
                onClose={() => setAiSidebarOpen(false)}
                isDarkMode={isDarkMode}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating AI Button */}
      <FloatingAIButton 
        onClick={() => setAiSidebarOpen(!aiSidebarOpen)}
        isActive={aiSidebarOpen}
        aiState={aiState}
        isDarkMode={isDarkMode}
      />

      {/* Onboarding Tooltips */}
      {showOnboarding && (
        <OnboardingTooltips 
          onComplete={() => setShowOnboarding(false)}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}

export default App;