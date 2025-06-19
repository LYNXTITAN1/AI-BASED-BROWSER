// Tab management for AI Browser Pro

class TabManager {
    constructor() {
        this.tabs = [];
        this.activeTabId = null;
        this.tabsContainer = Utils.$('#tabs-container');
        this.newTabBtn = Utils.$('#new-tab-btn');
        this.contentArea = Utils.$('#content-area');
        
        this.initializeTabs();
    }

    initializeTabs() {
        this.setupEventListeners();
        this.createHomeTab();
        this.loadTabsFromStorage();
    }

    setupEventListeners() {
        // New tab button
        this.newTabBtn.addEventListener('click', () => {
            this.createNewTab();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 't':
                        e.preventDefault();
                        this.createNewTab();
                        break;
                    case 'w':
                        e.preventDefault();
                        this.closeActiveTab();
                        break;
                    case 'Tab':
                        e.preventDefault();
                        this.switchToNextTab();
                        break;
                }
            }
        });

        // Handle tab switching with numbers
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '9') {
                e.preventDefault();
                const tabIndex = parseInt(e.key) - 1;
                if (this.tabs[tabIndex]) {
                    this.setActiveTab(this.tabs[tabIndex].id);
                }
            }
        });
    }

    createHomeTab() {
        const homeTab = {
            id: Utils.generateId(),
            title: 'AI Browser Pro - Home',
            url: 'ai-browser://home',
            favicon: '🏠',
            isActive: true,
            aiSummary: 'Your AI-powered browser homepage with intelligent features',
            securityStatus: 'secure',
            createdAt: new Date().toISOString(),
            lastVisited: new Date().toISOString()
        };

        this.tabs.push(homeTab);
        this.activeTabId = homeTab.id;
        this.renderTabs();
        this.renderActiveTabContent();
    }

    createNewTab(url = 'ai-browser://home', title = 'New Tab') {
        const newTab = {
            id: Utils.generateId(),
            title,
            url,
            favicon: Utils.getFaviconForDomain(url),
            isActive: false,
            securityStatus: 'checking',
            createdAt: new Date().toISOString(),
            lastVisited: new Date().toISOString()
        };

        this.tabs.push(newTab);
        this.setActiveTab(newTab.id);
        this.saveTabsToStorage();

        // Analyze new tab with AI
        if (url !== 'ai-browser://home') {
            this.analyzeTabWithAI(newTab.id);
        }

        return newTab;
    }

    closeTab(tabId) {
        const tabIndex = this.tabs.findIndex(tab => tab.id === tabId);
        if (tabIndex === -1) return;

        const wasActive = this.tabs[tabIndex].isActive;
        this.tabs.splice(tabIndex, 1);

        // If no tabs left, create a new home tab
        if (this.tabs.length === 0) {
            this.createHomeTab();
            return;
        }

        // If closed tab was active, activate another tab
        if (wasActive) {
            const newActiveIndex = Math.min(tabIndex, this.tabs.length - 1);
            this.setActiveTab(this.tabs[newActiveIndex].id);
        }

        this.renderTabs();
        this.saveTabsToStorage();
    }

    closeActiveTab() {
        if (this.activeTabId) {
            this.closeTab(this.activeTabId);
        }
    }

    setActiveTab(tabId) {
        // Deactivate all tabs
        this.tabs.forEach(tab => {
            tab.isActive = false;
        });

        // Activate selected tab
        const activeTab = this.tabs.find(tab => tab.id === tabId);
        if (activeTab) {
            activeTab.isActive = true;
            activeTab.lastVisited = new Date().toISOString();
            this.activeTabId = tabId;

            // Update search input with current URL
            const searchInput = Utils.$('#search-input');
            if (searchInput) {
                searchInput.value = activeTab.url === 'ai-browser://home' ? '' : activeTab.url;
            }

            // Update AI state
            window.AI.updateStatus(`Analyzing: ${activeTab.title}`, 0.92);

            this.renderTabs();
            this.renderActiveTabContent();
            this.saveTabsToStorage();
        }
    }

    switchToNextTab() {
        const currentIndex = this.tabs.findIndex(tab => tab.id === this.activeTabId);
        const nextIndex = (currentIndex + 1) % this.tabs.length;
        this.setActiveTab(this.tabs[nextIndex].id);
    }

    navigateActiveTab(url, title = null, favicon = null, analysis = null) {
        const activeTab = this.getActiveTab();
        if (!activeTab) return;

        // Update tab properties
        activeTab.url = url;
        activeTab.title = title || Utils.getDomainTitle(url);
        activeTab.favicon = favicon || Utils.getFaviconForDomain(url);
        activeTab.lastVisited = new Date().toISOString();
        activeTab.securityStatus = url.startsWith('https://') || url === 'ai-browser://home' ? 'secure' : 'warning';

        // Add AI analysis if available
        if (analysis) {
            activeTab.aiSummary = analysis.summary;
            activeTab.aiAnalysis = analysis;
        }

        this.renderTabs();
        this.renderActiveTabContent();
        this.saveTabsToStorage();
    }

    async analyzeTabWithAI(tabId) {
        const tab = this.tabs.find(t => t.id === tabId);
        if (!tab || tab.url === 'ai-browser://home') return;

        try {
            tab.securityStatus = 'checking';
            this.renderTabs();

            const analysis = await window.AI.analyzeUrl(tab.url);
            
            tab.aiSummary = analysis.summary;
            tab.aiAnalysis = analysis;
            tab.securityStatus = analysis.security.level;

            this.renderTabs();
            this.saveTabsToStorage();
        } catch (error) {
            console.error('Tab analysis error:', error);
            tab.securityStatus = 'warning';
            this.renderTabs();
        }
    }

    renderTabs() {
        if (!this.tabsContainer) return;

        const tabsHTML = this.tabs.map(tab => {
            const securityIcon = this.getSecurityIcon(tab.securityStatus);
            
            return `
                <div class="tab-item flex items-center space-x-2 px-4 py-2 min-w-0 max-w-64 cursor-pointer group relative ${
                    tab.isActive 
                        ? 'bg-white border-b-2 border-blue-500' 
                        : 'hover:bg-gray-100'
                }" 
                data-tab-id="${tab.id}">
                    
                    <!-- Security Status -->
                    <div class="flex-shrink-0">
                        ${securityIcon}
                    </div>

                    <!-- Favicon -->
                    <span class="text-sm flex-shrink-0">${tab.favicon}</span>

                    <!-- Title -->
                    <span class="text-sm truncate flex-1 ${
                        tab.isActive ? 'text-gray-900 font-medium' : 'text-gray-600'
                    }" title="${tab.title}">
                        ${tab.title}
                    </span>

                    <!-- AI Summary Indicator -->
                    ${tab.aiSummary ? '<div class="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 opacity-60"></div>' : ''}

                    <!-- Close Button -->
                    <button class="close-tab-btn flex-shrink-0 p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded transition-opacity" 
                            data-tab-id="${tab.id}">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>

                    <!-- Active Tab Indicator -->
                    ${tab.isActive ? '<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"></div>' : ''}
                </div>
            `;
        }).join('');

        this.tabsContainer.innerHTML = tabsHTML;

        // Add event listeners
        this.tabsContainer.querySelectorAll('.tab-item').forEach(tabElement => {
            const tabId = tabElement.dataset.tabId;
            
            tabElement.addEventListener('click', (e) => {
                if (!e.target.closest('.close-tab-btn')) {
                    this.setActiveTab(tabId);
                }
            });
        });

        this.tabsContainer.querySelectorAll('.close-tab-btn').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const tabId = closeBtn.dataset.tabId;
                this.closeTab(tabId);
            });
        });
    }

    getSecurityIcon(status) {
        switch (status) {
            case 'secure':
                return '<div class="w-3 h-3 text-green-500">🛡️</div>';
            case 'warning':
                return '<div class="w-3 h-3 text-yellow-500">⚠️</div>';
            case 'danger':
                return '<div class="w-3 h-3 text-red-500">🚨</div>';
            case 'checking':
                return '<div class="w-3 h-3 border border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>';
            default:
                return '<div class="w-3 h-3 text-gray-400">❓</div>';
        }
    }

    renderActiveTabContent() {
        const activeTab = this.getActiveTab();
        if (!activeTab || !this.contentArea) return;

        if (activeTab.url === 'ai-browser://home') {
            this.renderHomePage();
        } else {
            this.renderWebsitePage(activeTab);
        }
    }

    renderHomePage() {
        this.contentArea.innerHTML = `
            <div class="h-full overflow-y-auto bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div class="max-w-6xl mx-auto p-8 space-y-12">
                    <!-- Hero Section -->
                    <div class="text-center space-y-6 content-fade-in">
                        <div class="space-y-4">
                            <h1 class="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                AI Browser Pro
                            </h1>
                            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                                Experience the future of web browsing with AI-powered search, universal domain access, and intelligent automation
                            </p>
                        </div>

                        <!-- Quick Actions -->
                        <div class="flex flex-wrap justify-center gap-4 mt-8">
                            <button class="quick-action-btn flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors btn-hover-lift" 
                                    data-action="search">
                                <span>🔍</span>
                                <span>Search Anything</span>
                            </button>
                            <button class="quick-action-btn flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition-colors btn-hover-lift" 
                                    data-action="ai">
                                <span>🤖</span>
                                <span>AI Assistant</span>
                            </button>
                            <button class="quick-action-btn flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-colors btn-hover-lift" 
                                    data-action="browse">
                                <span>🌐</span>
                                <span>Browse Any Domain</span>
                            </button>
                        </div>
                    </div>

                    <!-- Features Grid -->
                    <div class="feature-grid">
                        ${this.generateFeatureCards()}
                    </div>

                    <!-- Quick Links -->
                    <div class="website-card">
                        <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Try These Domains</h2>
                        <div class="quick-links">
                            ${this.generateQuickLinks()}
                        </div>
                        
                        <!-- Domain Examples -->
                        <div class="mt-8 text-center">
                            <h3 class="text-lg font-semibold text-gray-900 mb-4">Try Any Domain</h3>
                            <div class="flex flex-wrap justify-center gap-2 text-sm">
                                ${this.generateDomainExamples()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupHomePageEventListeners();
    }

    generateFeatureCards() {
        const features = [
            {
                icon: '🌐',
                title: 'Universal Access',
                description: 'Browse ANY domain worldwide - .com, .org, .net, country domains, and more',
                color: 'blue',
                badge: 'Global'
            },
            {
                icon: '🛡️',
                title: 'Smart Loading',
                description: 'Intelligent website loading with iframe embedding and fallback options',
                color: 'green',
                badge: 'Reliable'
            },
            {
                icon: '🤖',
                title: 'AI Enhancement',
                description: 'Every website gets AI analysis, summaries, and intelligent insights',
                color: 'purple',
                badge: 'Smart'
            },
            {
                icon: '⚡',
                title: 'Fast Navigation',
                description: 'Quick access to popular sites and smart URL suggestions',
                color: 'yellow',
                badge: 'Fast'
            },
            {
                icon: '🔍',
                title: 'Universal Search',
                description: 'Search across Google, Bing, DuckDuckGo, and specialized engines',
                color: 'indigo',
                badge: 'Comprehensive'
            },
            {
                icon: '📄',
                title: 'Content Analysis',
                description: 'AI-powered content extraction, summarization, and research tools',
                color: 'red',
                badge: 'Intelligent'
            }
        ];

        return features.map((feature, index) => `
            <div class="feature-card gpu-accelerated" style="animation-delay: ${index * 0.1}s">
                <div class="flex items-start justify-between mb-4">
                    <div class="p-3 bg-${feature.color}-100 rounded-xl group-hover:scale-110 transition-transform">
                        <span class="text-2xl">${feature.icon}</span>
                    </div>
                    <span class="text-xs font-medium px-2 py-1 bg-${feature.color}-100 text-${feature.color}-700 rounded-full">
                        ${feature.badge}
                    </span>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">${feature.title}</h3>
                <p class="text-gray-600 text-sm leading-relaxed">${feature.description}</p>
            </div>
        `).join('');
    }

    generateQuickLinks() {
        const links = [
            { name: 'Google', url: 'google.com', icon: '🔍' },
            { name: 'YouTube', url: 'youtube.com', icon: '📺' },
            { name: 'GitHub', url: 'github.com', icon: '🐙' },
            { name: 'Reddit', url: 'reddit.com', icon: '🤖' },
            { name: 'Wikipedia', url: 'wikipedia.org', icon: '📖' },
            { name: 'Stack Overflow', url: 'stackoverflow.com', icon: '📚' }
        ];

        return links.map((link, index) => `
            <div class="quick-link gpu-accelerated" data-url="${link.url}" style="animation-delay: ${index * 0.1}s">
                <span class="text-2xl mb-2 block">${link.icon}</span>
                <span class="text-sm font-medium text-gray-700">${link.name}</span>
            </div>
        `).join('');
    }

    generateDomainExamples() {
        const domains = [
            'example.com', 'news.bbc.co.uk', 'amazon.de', 'yahoo.co.jp',
            'medium.com', 'dev.to', 'hashnode.com', 'codepen.io'
        ];

        return domains.map(domain => `
            <button class="domain-example bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors" 
                    data-url="${domain}">
                ${domain}
            </button>
        `).join('');
    }

    setupHomePageEventListeners() {
        // Quick action buttons
        this.contentArea.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                switch (action) {
                    case 'search':
                        Utils.$('#search-input').focus();
                        break;
                    case 'ai':
                        Utils.$('#sidebar-btn').click();
                        break;
                    case 'browse':
                        Utils.$('#search-input').focus();
                        Utils.$('#search-input').value = 'example.com';
                        break;
                }
            });
        });

        // Quick links
        this.contentArea.querySelectorAll('.quick-link').forEach(link => {
            link.addEventListener('click', () => {
                const url = link.dataset.url;
                Utils.$('#search-input').value = url;
                window.Search.performSearch(url);
            });
        });

        // Domain examples
        this.contentArea.querySelectorAll('.domain-example').forEach(example => {
            example.addEventListener('click', () => {
                const url = example.dataset.url;
                Utils.$('#search-input').value = url;
                window.Search.performSearch(url);
            });
        });
    }

    renderWebsitePage(tab) {
        const loadingStates = ['loading', 'success', 'blocked'];
        const currentState = tab.loadingState || 'success';

        if (currentState === 'loading') {
            this.renderLoadingPage(tab);
        } else if (currentState === 'blocked') {
            this.renderBlockedPage(tab);
        } else {
            this.renderIframePage(tab);
        }
    }

    renderLoadingPage(tab) {
        this.contentArea.innerHTML = `
            <div class="h-full flex items-center justify-center bg-white">
                <div class="text-center">
                    <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
                    <h3 class="text-xl font-medium text-gray-900 mb-2">Loading Website</h3>
                    <p class="text-gray-600 mb-4">Connecting to ${tab.url}</p>
                    <div class="flex items-center justify-center space-x-2 text-sm text-gray-500">
                        <span>🤖</span>
                        <span>AI analysis in progress...</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderBlockedPage(tab) {
        this.contentArea.innerHTML = `
            <div class="h-full flex items-center justify-center bg-white p-8">
                <div class="text-center max-w-md">
                    <div class="text-6xl mb-4">⚠️</div>
                    <h3 class="text-xl font-medium text-gray-900 mb-2">Website Protection Active</h3>
                    <p class="text-gray-600 mb-6">
                        This website has security policies that prevent embedding. This is common for sites like Google, Facebook, and banking websites.
                    </p>
                    
                    <div class="website-card mb-6">
                        <div class="flex items-center space-x-3 mb-4">
                            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span class="text-white text-xl">🌐</span>
                            </div>
                            <div class="text-left">
                                <h4 class="font-semibold text-gray-900">${tab.title}</h4>
                                <p class="text-sm text-gray-600">${tab.url}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="space-y-3">
                        <button class="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors btn-hover-lift" 
                                onclick="window.open('${tab.url}', '_blank')">
                            <span>🔗</span>
                            <span>Open in New Window</span>
                        </button>
                        <button class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors" 
                                onclick="location.reload()">
                            <span>🔄</span>
                            <span>Try Again</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderIframePage(tab) {
        this.contentArea.innerHTML = `
            <div class="h-full flex flex-col">
                <!-- Website Info Bar -->
                <div class="bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-200 p-3">
                    <div class="flex items-center space-x-3">
                        <div class="flex items-center space-x-2">
                            <span>🌐</span>
                            <span class="font-medium text-blue-900 text-sm">Live Website</span>
                        </div>
                        <div class="flex-1 min-w-0">
                            <span class="text-xs text-gray-700 truncate block">${tab.url}</span>
                        </div>
                        <div class="flex items-center space-x-3">
                            <span class="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                                ✓ Loaded
                            </span>
                            <button onclick="window.open('${tab.url}', '_blank')" 
                                    class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full hover:bg-blue-200 transition-colors">
                                Open External
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Iframe Container -->
                <div class="flex-1 relative">
                    <iframe
                        src="${tab.url}"
                        class="w-full h-full border-0"
                        title="${tab.title}"
                        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
                        referrerpolicy="no-referrer-when-downgrade"
                        onload="this.style.opacity = '1'"
                        onerror="this.parentElement.innerHTML = '<div class=\\'h-full flex items-center justify-center\\'>Failed to load website</div>'"
                        style="opacity: 0; transition: opacity 0.3s ease;">
                    </iframe>
                    
                    <!-- AI Enhancement Overlay -->
                    <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
                        <div class="flex items-center space-x-2">
                            <span>🤖</span>
                            <span class="text-sm font-medium text-gray-900">AI Enhanced</span>
                            <div class="text-xs text-gray-600">${Math.round(window.AI.confidence * 100)}%</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getActiveTab() {
        return this.tabs.find(tab => tab.isActive);
    }

    getAllTabs() {
        return this.tabs;
    }

    getTabById(tabId) {
        return this.tabs.find(tab => tab.id === tabId);
    }

    saveTabsToStorage() {
        const tabsData = this.tabs.map(tab => ({
            id: tab.id,
            title: tab.title,
            url: tab.url,
            favicon: tab.favicon,
            isActive: tab.isActive,
            securityStatus: tab.securityStatus,
            createdAt: tab.createdAt,
            lastVisited: tab.lastVisited
        }));

        Utils.saveToStorage('browserTabs', tabsData);
    }

    loadTabsFromStorage() {
        const savedTabs = Utils.loadFromStorage('browserTabs', []);
        
        if (savedTabs.length > 0 && this.tabs.length === 1) {
            // Replace the default home tab with saved tabs
            this.tabs = savedTabs.map(tabData => ({
                ...tabData,
                isActive: false // Will be set correctly below
            }));

            // Ensure at least one tab is active
            const activeTab = this.tabs.find(tab => tab.isActive);
            if (!activeTab && this.tabs.length > 0) {
                this.tabs[0].isActive = true;
                this.activeTabId = this.tabs[0].id;
            } else if (activeTab) {
                this.activeTabId = activeTab.id;
            }

            this.renderTabs();
            this.renderActiveTabContent();
        }
    }
}

// Initialize Tab Manager
window.TabManager = new TabManager();

// Export for use in other modules
window.Tabs = window.TabManager;