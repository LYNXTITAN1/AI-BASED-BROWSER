// Navigation functionality for AI Browser Pro

class NavigationManager {
    constructor() {
        this.backBtn = Utils.$('#back-btn');
        this.forwardBtn = Utils.$('#forward-btn');
        this.refreshBtn = Utils.$('#refresh-btn');
        this.homeBtn = Utils.$('#home-btn');
        this.bookmarkBtn = Utils.$('#bookmark-btn');
        this.sidebarBtn = Utils.$('#sidebar-btn');
        this.sidebar = Utils.$('#sidebar');
        this.closeSidebarBtn = Utils.$('#close-sidebar-btn');
        
        this.history = [];
        this.historyIndex = -1;
        this.bookmarks = Utils.loadFromStorage('bookmarks', []);
        this.sidebarOpen = false;
        
        this.initializeNavigation();
    }

    initializeNavigation() {
        this.setupEventListeners();
        this.loadNavigationState();
        this.updateNavigationButtons();
    }

    setupEventListeners() {
        // Navigation buttons
        this.backBtn.addEventListener('click', () => {
            this.goBack();
        });

        this.forwardBtn.addEventListener('click', () => {
            this.goForward();
        });

        this.refreshBtn.addEventListener('click', () => {
            this.refresh();
        });

        this.homeBtn.addEventListener('click', () => {
            this.goHome();
        });

        // Bookmark button
        this.bookmarkBtn.addEventListener('click', () => {
            this.toggleBookmark();
        });

        // Sidebar controls
        this.sidebarBtn.addEventListener('click', () => {
            this.toggleSidebar();
        });

        if (this.closeSidebarBtn) {
            this.closeSidebarBtn.addEventListener('click', () => {
                this.closeSidebar();
            });
        }

        // Listen for tab changes to update navigation
        window.addEventListener('aiStatusUpdate', () => {
            this.updateNavigationButtons();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.altKey) {
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.goBack();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.goForward();
                        break;
                    case 'Home':
                        e.preventDefault();
                        this.goHome();
                        break;
                }
            }
            
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                this.toggleBookmark();
            }
            
            if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
                e.preventDefault();
                this.refresh();
            }
        });
    }

    addToHistory(url, title) {
        // Remove any forward history when navigating to a new page
        this.history = this.history.slice(0, this.historyIndex + 1);
        
        // Add new entry
        this.history.push({
            url,
            title,
            timestamp: new Date().toISOString(),
            favicon: Utils.getFaviconForDomain(url)
        });
        
        this.historyIndex = this.history.length - 1;
        
        // Limit history size
        if (this.history.length > 100) {
            this.history = this.history.slice(-100);
            this.historyIndex = this.history.length - 1;
        }
        
        this.updateNavigationButtons();
        this.saveNavigationState();
    }

    goBack() {
        if (this.canGoBack()) {
            this.historyIndex--;
            const historyEntry = this.history[this.historyIndex];
            this.navigateToHistoryEntry(historyEntry);
        }
    }

    goForward() {
        if (this.canGoForward()) {
            this.historyIndex++;
            const historyEntry = this.history[this.historyIndex];
            this.navigateToHistoryEntry(historyEntry);
        }
    }

    navigateToHistoryEntry(entry) {
        if (window.TabManager) {
            window.TabManager.navigateActiveTab(entry.url, entry.title, entry.favicon);
        }
        
        // Update search input
        const searchInput = Utils.$('#search-input');
        if (searchInput) {
            searchInput.value = entry.url === 'ai-browser://home' ? '' : entry.url;
        }
        
        this.updateNavigationButtons();
    }

    refresh() {
        const activeTab = window.TabManager?.getActiveTab();
        if (!activeTab) return;

        // Add loading animation to refresh button
        this.refreshBtn.classList.add('animate-spin');
        
        if (activeTab.url === 'ai-browser://home') {
            // Refresh home page
            window.TabManager.renderActiveTabContent();
        } else {
            // Refresh current page
            const iframe = Utils.$('#content-area iframe');
            if (iframe) {
                iframe.src = iframe.src;
            } else {
                // Re-navigate to current URL
                window.Search.performSearch(activeTab.url);
            }
        }

        // Remove loading animation after delay
        setTimeout(() => {
            this.refreshBtn.classList.remove('animate-spin');
        }, 1000);

        // Update AI status
        window.AI.updateStatus(`Refreshing ${activeTab.title}`, 0.85);
    }

    goHome() {
        if (window.TabManager) {
            window.TabManager.navigateActiveTab('ai-browser://home', 'AI Browser Pro - Home', '🏠');
        }
        
        // Clear search input
        const searchInput = Utils.$('#search-input');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // Update AI status
        window.AI.updateStatus('Welcome to AI Browser Pro', 0.98);
        
        // Add to history
        this.addToHistory('ai-browser://home', 'AI Browser Pro - Home');
    }

    canGoBack() {
        return this.historyIndex > 0;
    }

    canGoForward() {
        return this.historyIndex < this.history.length - 1;
    }

    updateNavigationButtons() {
        // Update back button
        if (this.canGoBack()) {
            this.backBtn.disabled = false;
            this.backBtn.classList.remove('opacity-50');
        } else {
            this.backBtn.disabled = true;
            this.backBtn.classList.add('opacity-50');
        }

        // Update forward button
        if (this.canGoForward()) {
            this.forwardBtn.disabled = false;
            this.forwardBtn.classList.remove('opacity-50');
        } else {
            this.forwardBtn.disabled = true;
            this.forwardBtn.classList.add('opacity-50');
        }

        // Update bookmark button
        const activeTab = window.TabManager?.getActiveTab();
        if (activeTab && this.isBookmarked(activeTab.url)) {
            this.bookmarkBtn.classList.add('text-yellow-500');
        } else {
            this.bookmarkBtn.classList.remove('text-yellow-500');
        }
    }

    toggleBookmark() {
        const activeTab = window.TabManager?.getActiveTab();
        if (!activeTab || activeTab.url === 'ai-browser://home') return;

        if (this.isBookmarked(activeTab.url)) {
            this.removeBookmark(activeTab.url);
            this.showNotification('Bookmark removed', 'info');
        } else {
            this.addBookmark(activeTab);
            this.showNotification('Bookmark added', 'success');
        }

        this.updateNavigationButtons();
    }

    addBookmark(tab) {
        const bookmark = {
            id: Utils.generateId(),
            title: tab.title,
            url: tab.url,
            favicon: tab.favicon,
            createdAt: new Date().toISOString(),
            folder: 'General'
        };

        this.bookmarks.unshift(bookmark);
        this.saveBookmarks();
    }

    removeBookmark(url) {
        this.bookmarks = this.bookmarks.filter(bookmark => bookmark.url !== url);
        this.saveBookmarks();
    }

    isBookmarked(url) {
        return this.bookmarks.some(bookmark => bookmark.url === url);
    }

    toggleSidebar() {
        if (this.sidebarOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    openSidebar() {
        if (!this.sidebar) return;

        this.sidebarOpen = true;
        this.sidebar.classList.remove('hidden');
        this.sidebar.classList.add('sidebar-slide-in');
        
        // Render sidebar content
        this.renderSidebarContent();
        
        // Update button state
        this.sidebarBtn.classList.add('bg-gray-200');
    }

    closeSidebar() {
        if (!this.sidebar) return;

        this.sidebarOpen = false;
        this.sidebar.classList.add('sidebar-slide-out');
        
        setTimeout(() => {
            this.sidebar.classList.add('hidden');
            this.sidebar.classList.remove('sidebar-slide-in', 'sidebar-slide-out');
        }, 300);
        
        // Update button state
        this.sidebarBtn.classList.remove('bg-gray-200');
    }

    renderSidebarContent() {
        const sidebarContent = Utils.$('#sidebar-content');
        if (!sidebarContent) return;

        const aiStatus = window.AI.getStatus();
        const activeTab = window.TabManager?.getActiveTab();
        const recentHistory = this.history.slice(-10).reverse();

        sidebarContent.innerHTML = `
            <!-- AI Status -->
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
                <div class="flex items-center space-x-2 mb-2">
                    <span class="text-xl">🤖</span>
                    <span class="font-medium text-blue-900">AI Engine</span>
                </div>
                <p class="text-sm text-blue-800 mb-3">${aiStatus.currentTask}</p>
                <div class="w-full bg-blue-200 rounded-full h-2">
                    <div class="h-2 bg-blue-600 rounded-full transition-all duration-300" style="width: ${aiStatus.confidence * 100}%"></div>
                </div>
                <p class="text-xs text-blue-700 mt-1">${Math.round(aiStatus.confidence * 100)}% confidence</p>
            </div>

            <!-- Quick Actions -->
            <div class="mb-6">
                <h4 class="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
                <div class="space-y-2">
                    ${aiStatus.suggestions.map(suggestion => `
                        <button class="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                            <div class="flex items-center space-x-3">
                                <span>⚡</span>
                                <span class="text-sm text-gray-900">${suggestion}</span>
                            </div>
                        </button>
                    `).join('')}
                </div>
            </div>

            <!-- Recent History -->
            <div class="mb-6">
                <h4 class="text-sm font-medium text-gray-900 mb-3">Recent History</h4>
                <div class="space-y-2">
                    ${recentHistory.length > 0 ? recentHistory.map(entry => `
                        <div class="p-3 hover:bg-gray-50 rounded-lg cursor-pointer history-item" data-url="${entry.url}">
                            <div class="flex items-center space-x-3">
                                <span class="text-sm">${entry.favicon}</span>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-gray-900 truncate">${entry.title}</p>
                                    <p class="text-xs text-gray-500">${Utils.formatTimeAgo(new Date(entry.timestamp))}</p>
                                </div>
                            </div>
                        </div>
                    `).join('') : '<p class="text-sm text-gray-500">No recent history</p>'}
                </div>
            </div>

            <!-- Bookmarks -->
            <div class="mb-6">
                <h4 class="text-sm font-medium text-gray-900 mb-3">Bookmarks</h4>
                <div class="space-y-2">
                    ${this.bookmarks.length > 0 ? this.bookmarks.slice(0, 10).map(bookmark => `
                        <div class="p-3 hover:bg-gray-50 rounded-lg cursor-pointer bookmark-item" data-url="${bookmark.url}">
                            <div class="flex items-center space-x-3">
                                <span class="text-sm">${bookmark.favicon}</span>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-gray-900 truncate">${bookmark.title}</p>
                                    <p class="text-xs text-gray-500">${bookmark.folder}</p>
                                </div>
                            </div>
                        </div>
                    `).join('') : '<p class="text-sm text-gray-500">No bookmarks yet</p>'}
                </div>
            </div>

            <!-- Browser Settings -->
            <div>
                <h4 class="text-sm font-medium text-gray-900 mb-3">Settings</h4>
                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-900">AI Processing</span>
                        <div class="w-10 h-5 bg-green-500 rounded-full flex items-center justify-end pr-0.5">
                            <div class="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-900">Privacy Mode</span>
                        <div class="w-10 h-5 bg-green-500 rounded-full flex items-center justify-end pr-0.5">
                            <div class="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-900">Auto-Analysis</span>
                        <div class="w-10 h-5 bg-blue-500 rounded-full flex items-center justify-end pr-0.5">
                            <div class="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners for sidebar items
        sidebarContent.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const url = item.dataset.url;
                window.Search.performSearch(url);
                this.closeSidebar();
            });
        });

        sidebarContent.querySelectorAll('.bookmark-item').forEach(item => {
            item.addEventListener('click', () => {
                const url = item.dataset.url;
                window.Search.performSearch(url);
                this.closeSidebar();
            });
        });
    }

    showNotification(message, type = 'info') {
        const notification = Utils.createElement('div', 
            `fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 ${
                type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
                type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
                'bg-blue-100 text-blue-800 border border-blue-200'
            }`,
            `
                <div class="flex items-center space-x-2">
                    <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
                    <span>${message}</span>
                    <button class="ml-2 text-gray-500 hover:text-gray-700" onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
            `
        );
        
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                Utils.fadeOut(notification, 300);
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }

    saveNavigationState() {
        Utils.saveToStorage('navigationHistory', {
            history: this.history,
            historyIndex: this.historyIndex
        });
    }

    loadNavigationState() {
        const savedState = Utils.loadFromStorage('navigationHistory', null);
        if (savedState) {
            this.history = savedState.history || [];
            this.historyIndex = savedState.historyIndex || -1;
        }
    }

    saveBookmarks() {
        Utils.saveToStorage('bookmarks', this.bookmarks);
    }

    getHistory() {
        return this.history;
    }

    getBookmarks() {
        return this.bookmarks;
    }

    clearHistory() {
        this.history = [];
        this.historyIndex = -1;
        this.saveNavigationState();
        this.updateNavigationButtons();
    }

    clearBookmarks() {
        this.bookmarks = [];
        this.saveBookmarks();
        this.updateNavigationButtons();
    }
}

// Initialize Navigation Manager
window.NavigationManager = new NavigationManager();

// Export for use in other modules
window.Navigation = window.NavigationManager;