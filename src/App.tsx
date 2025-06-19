import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BrowserHeader from './components/BrowserHeader';
import NavigationBar from './components/NavigationBar';
import TabManager from './components/TabManager';
import AIAssistant from './components/AIAssistant';
import ContentArea from './components/ContentArea';
import Sidebar from './components/Sidebar';
import { Tab, AIState, SecurityStatus } from './types';

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
    suggestions: ['Search with Google', 'Visit any .com domain', 'Explore international sites']
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
    
    // Update AI state for new tab
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
        // If no tabs left, create a new home tab
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
    // Enhanced favicon detection for worldwide domains
    const domain = url.toLowerCase();
    
    // Popular sites
    if (domain.includes('google.com')) return '🔍';
    if (domain.includes('youtube.com')) return '📺';
    if (domain.includes('github.com')) return '🐙';
    if (domain.includes('stackoverflow.com')) return '📚';
    if (domain.includes('reddit.com')) return '🤖';
    if (domain.includes('twitter.com') || domain.includes('x.com')) return '🐦';
    if (domain.includes('linkedin.com')) return '💼';
    if (domain.includes('facebook.com')) return '📘';
    if (domain.includes('instagram.com')) return '📷';
    if (domain.includes('tiktok.com')) return '🎵';
    if (domain.includes('netflix.com')) return '🎬';
    if (domain.includes('spotify.com')) return '🎧';
    if (domain.includes('amazon.com')) return '📦';
    if (domain.includes('ebay.com')) return '🛒';
    if (domain.includes('wikipedia.org')) return '📖';
    if (domain.includes('medium.com')) return '✍️';
    if (domain.includes('duckduckgo.com')) return '🦆';
    
    // Country-specific domains
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
    
    // TLD-based icons
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
    
    // Special cases
    if (domain.includes('ai-browser://home')) return '🏠';
    if (domain.includes('localhost')) return '🏠';
    if (/^\d+\.\d+\.\d+\.\d+/.test(domain)) return '🖥️';
    
    // Default based on TLD
    if (domain.includes('.com')) return '🌐';
    if (domain.includes('.net')) return '🌐';
    
    return '🔗';
  };

  const getDomainTitle = (url: string): string => {
    try {
      // Handle special cases
      if (url === 'ai-browser://home') return 'AI Browser Pro - Home';
      if (url.includes('google.com')) return 'Google Search';
      if (url.includes('youtube.com')) return 'YouTube';
      
      // Extract domain from URL
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      const hostname = urlObj.hostname;
      
      // Remove www. prefix
      const domain = hostname.replace(/^www\./, '');
      
      // Capitalize first letter and remove TLD for title
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

  // Update AI state based on current tab
  useEffect(() => {
    const activeTab = tabs.find(tab => tab.isActive);
    if (activeTab) {
      if (activeTab.url.includes('google.com')) {
        setAiState(prev => ({
          ...prev,
          currentTask: 'Google search active - AI enhanced results',
          confidence: 0.96,
          suggestions: [
            'Refine search with AI',
            'Get instant answers',
            'Find related topics',
            'Smart search suggestions'
          ]
        }));
      } else if (activeTab.url.includes('youtube.com')) {
        setAiState(prev => ({
          ...prev,
          currentTask: 'YouTube enhanced - AI video analysis active',
          confidence: 0.94,
          suggestions: [
            'Summarize video content',
            'Find related videos',
            'Extract key insights',
            'Privacy-protected viewing'
          ]
        }));
      } else if (activeTab.url.startsWith('https://')) {
        setAiState(prev => ({
          ...prev,
          currentTask: `Analyzing secure connection to ${getDomainTitle(activeTab.url)}`,
          confidence: 0.93,
          suggestions: [
            'Analyze page content',
            'Extract key insights',
            'Check domain reputation',
            'Monitor for threats'
          ]
        }));
      }
    }
  }, [tabs]);

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Browser Chrome */}
      <BrowserHeader />
      
      {/* Navigation and Tab Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <TabManager 
          tabs={tabs}
          onAddTab={addTab}
          onCloseTab={closeTab}
          onSetActiveTab={setActiveTab}
        />
        <NavigationBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          aiState={aiState}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onNavigateHome={handleNavigateHome}
          onNavigateToUrl={handleNavigateToUrl}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 320 }}
              exit={{ width: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="bg-white border-r border-gray-200 overflow-hidden"
            >
              <Sidebar 
                tabs={tabs}
                aiState={aiState}
                onClose={() => setSidebarOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content and AI Assistant */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 relative">
            <ContentArea 
              activeTab={tabs.find(tab => tab.isActive)}
              aiState={aiState}
            />
          </div>
          
          {/* AI Assistant Panel */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: aiState.isActive ? 360 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-white border-l border-gray-200 overflow-hidden"
          >
            <AIAssistant 
              aiState={aiState}
              onUpdateState={setAiState}
              searchQuery={searchQuery}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default App;