// Search functionality for AI Browser Pro

class SearchEngine {
    constructor() {
        this.searchInput = Utils.$('#search-input');
        this.searchBtn = Utils.$('#search-btn');
        this.voiceBtn = Utils.$('#voice-btn');
        this.cameraBtn = Utils.$('#camera-btn');
        this.suggestionsContainer = Utils.$('#search-suggestions');
        
        this.isVoiceActive = false;
        this.currentSuggestions = [];
        this.searchHistory = Utils.loadFromStorage('searchHistory', []);
        
        this.initializeSearch();
    }

    initializeSearch() {
        this.setupEventListeners();
        this.loadSearchHistory();
    }

    setupEventListeners() {
        // Search input events
        this.searchInput.addEventListener('input', Utils.debounce((e) => {
            this.handleSearchInput(e.target.value);
        }, 300));

        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(e.target.value);
            }
        });

        this.searchInput.addEventListener('focus', () => {
            this.showSuggestions();
        });

        this.searchInput.addEventListener('blur', () => {
            // Delay hiding suggestions to allow clicking
            setTimeout(() => this.hideSuggestions(), 200);
        });

        // Search button
        this.searchBtn.addEventListener('click', () => {
            this.performSearch(this.searchInput.value);
        });

        // Voice search
        this.voiceBtn.addEventListener('click', () => {
            this.toggleVoiceSearch();
        });

        // Camera search
        this.cameraBtn.addEventListener('click', () => {
            this.openCameraSearch();
        });

        // Global search shortcut
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.focusSearch();
            }
        });
    }

    async handleSearchInput(query) {
        if (!query || query.length < 2) {
            this.hideSuggestions();
            return;
        }

        try {
            const suggestions = await window.AI.generateSearchSuggestions(query);
            this.currentSuggestions = suggestions;
            this.renderSuggestions(suggestions);
            this.showSuggestions();
        } catch (error) {
            console.error('Error generating suggestions:', error);
        }
    }

    renderSuggestions(suggestions) {
        if (!suggestions || suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        const suggestionsHTML = suggestions.map(suggestion => {
            const icon = this.getSuggestionIcon(suggestion);
            const badge = this.getSuggestionBadge(suggestion);
            
            return `
                <div class="suggestion-item flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer group ${suggestion.type === 'ai-insight' ? 'ai-enhanced' : ''}" 
                     data-suggestion="${suggestion.text}" 
                     data-type="${suggestion.type}">
                    <div class="flex-shrink-0">${icon}</div>
                    <span class="text-sm flex-1 group-hover:text-gray-900">${suggestion.text}</span>
                    ${badge ? `<span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">${badge}</span>` : ''}
                    <div class="flex items-center space-x-1">
                        <span class="text-xs text-gray-400">${Math.round(suggestion.confidence * 100)}%</span>
                        ${Utils.isUrl(suggestion.text) ? '<div class="w-3 h-3 text-green-500">⚡</div>' : ''}
                    </div>
                </div>
            `;
        }).join('');

        this.suggestionsContainer.innerHTML = `
            <div class="space-y-1">
                <div class="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    Smart Suggestions
                </div>
                ${suggestionsHTML}
            </div>
        `;

        // Add click listeners to suggestions
        this.suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const suggestion = item.dataset.suggestion;
                const type = item.dataset.type;
                this.selectSuggestion(suggestion, type);
            });
        });
    }

    getSuggestionIcon(suggestion) {
        if (suggestion.type === 'ai-insight') {
            return '<div class="w-4 h-4 text-blue-500">🤖</div>';
        }
        
        const text = suggestion.text.toLowerCase();
        
        // Website-specific icons
        if (text.includes('youtube.com')) return '<span class="text-sm">📺</span>';
        if (text.includes('google.com')) return '<span class="text-sm">🔍</span>';
        if (text.includes('github.com')) return '<span class="text-sm">🐙</span>';
        if (text.includes('stackoverflow.com')) return '<span class="text-sm">📚</span>';
        if (text.includes('reddit.com')) return '<span class="text-sm">🤖</span>';
        if (text.includes('twitter.com')) return '<span class="text-sm">🐦</span>';
        if (text.includes('linkedin.com')) return '<span class="text-sm">💼</span>';
        if (text.includes('netflix.com')) return '<span class="text-sm">🎬</span>';
        if (text.includes('spotify.com')) return '<span class="text-sm">🎧</span>';
        if (text.includes('amazon.com')) return '<span class="text-sm">📦</span>';
        if (text.includes('wikipedia.org')) return '<span class="text-sm">📖</span>';
        
        // Generic icons
        if (suggestion.type === 'url' || text.includes('.')) {
            return '<div class="w-4 h-4 text-green-500">🌐</div>';
        }
        
        return '<div class="w-4 h-4 text-gray-400">🔍</div>';
    }

    getSuggestionBadge(suggestion) {
        const text = suggestion.text.toLowerCase();
        
        if (suggestion.type === 'ai-insight') return 'AI Enhanced';
        if (text.includes('youtube.com')) return 'Video';
        if (text.includes('google.com')) return 'Search';
        if (text.includes('github.com')) return 'Code';
        if (text.includes('stackoverflow.com')) return 'Q&A';
        if (text.includes('reddit.com')) return 'Community';
        if (text.includes('netflix.com')) return 'Streaming';
        if (text.includes('spotify.com')) return 'Music';
        if (text.includes('amazon.com')) return 'Shopping';
        if (text.includes('wikipedia.org')) return 'Knowledge';
        if (text.includes('.com')) return 'Website';
        if (text.includes('.org')) return 'Organization';
        if (text.includes('.edu')) return 'Educational';
        if (text.includes('.gov')) return 'Government';
        if (text.includes('tutorial')) return 'Learning';
        if (text.includes('news')) return 'News';
        
        return null;
    }

    selectSuggestion(suggestion, type) {
        this.searchInput.value = suggestion;
        this.hideSuggestions();
        
        if (type === 'ai-insight') {
            const query = suggestion.replace('AI Summary: ', '');
            this.performSearch(`${query} AI summary analysis`);
        } else {
            this.performSearch(suggestion);
        }
    }

    async performSearch(query) {
        if (!query || !query.trim()) return;

        const trimmedQuery = query.trim();
        this.addToSearchHistory(trimmedQuery);
        this.hideSuggestions();

        // Update search input
        this.searchInput.value = trimmedQuery;

        try {
            if (Utils.isUrl(trimmedQuery)) {
                // Direct URL navigation
                const url = Utils.formatUrl(trimmedQuery);
                await this.navigateToUrl(url);
            } else {
                // Search query
                await this.performWebSearch(trimmedQuery);
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showSearchError(error.message);
        }
    }

    async navigateToUrl(url) {
        try {
            // Analyze URL with AI
            const analysis = await window.AI.analyzeUrl(url);
            
            // Create or update tab
            const title = Utils.getDomainTitle(url);
            const favicon = Utils.getFaviconForDomain(url);
            
            if (window.TabManager) {
                window.TabManager.navigateActiveTab(url, title, favicon, analysis);
            }
            
            // Update security status
            this.updateSecurityStatus(url, analysis);
            
        } catch (error) {
            console.error('Navigation error:', error);
            throw error;
        }
    }

    async performWebSearch(query) {
        try {
            // Use Google search as default
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            await this.navigateToUrl(searchUrl);
            
            // Optionally, get AI-enhanced search results
            const searchResults = await window.AI.performSearch(query);
            console.log('AI Search Results:', searchResults);
            
        } catch (error) {
            console.error('Web search error:', error);
            throw error;
        }
    }

    updateSecurityStatus(url, analysis) {
        const securityBar = Utils.$('#security-bar');
        if (!securityBar) return;

        const isSecure = url.startsWith('https://') || url === 'ai-browser://home';
        const securityLevel = analysis?.security?.level || (isSecure ? 'secure' : 'warning');
        
        // Update security bar styling
        securityBar.className = `px-4 py-2 text-sm border-b ${
            securityLevel === 'secure' 
                ? 'bg-green-50 text-green-800 border-green-200'
                : securityLevel === 'warning'
                ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                : 'bg-red-50 text-red-800 border-red-200'
        }`;

        // Update security bar content
        securityBar.innerHTML = `
            <div class="flex items-center space-x-2">
                <span>${isSecure ? '🛡️' : '⚠️'}</span>
                <span>${isSecure ? 'Secure connection' : 'Security warning'}</span>
                <span class="text-xs opacity-75">• ${url}</span>
                <div class="ml-auto flex items-center space-x-2">
                    <span class="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                        ✓ AI Enhanced
                    </span>
                </div>
            </div>
        `;
    }

    toggleVoiceSearch() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Voice search is not supported in your browser');
            return;
        }

        if (this.isVoiceActive) {
            this.stopVoiceSearch();
        } else {
            this.startVoiceSearch();
        }
    }

    startVoiceSearch() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            this.isVoiceActive = true;
            this.voiceBtn.classList.add('bg-red-100', 'text-red-600');
            this.searchInput.placeholder = 'Listening...';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.searchInput.value = transcript;
            this.performSearch(transcript);
        };

        recognition.onerror = (event) => {
            console.error('Voice recognition error:', event.error);
            this.stopVoiceSearch();
        };

        recognition.onend = () => {
            this.stopVoiceSearch();
        };

        recognition.start();
        this.recognition = recognition;
    }

    stopVoiceSearch() {
        if (this.recognition) {
            this.recognition.stop();
        }
        
        this.isVoiceActive = false;
        this.voiceBtn.classList.remove('bg-red-100', 'text-red-600');
        this.searchInput.placeholder = 'Search Google, visit any domain, or enter URL...';
    }

    openCameraSearch() {
        // Placeholder for camera search functionality
        alert('Camera search feature coming soon! This would allow you to search using images.');
    }

    showSuggestions() {
        if (this.currentSuggestions.length > 0) {
            this.suggestionsContainer.classList.remove('hidden');
            Utils.fadeIn(this.suggestionsContainer, 200);
        }
    }

    hideSuggestions() {
        this.suggestionsContainer.classList.add('hidden');
    }

    focusSearch() {
        this.searchInput.focus();
        this.searchInput.select();
    }

    addToSearchHistory(query) {
        // Remove if already exists
        this.searchHistory = this.searchHistory.filter(item => item.query !== query);
        
        // Add to beginning
        this.searchHistory.unshift({
            query,
            timestamp: new Date().toISOString(),
            type: Utils.isUrl(query) ? 'url' : 'search'
        });

        // Keep only last 100 items
        this.searchHistory = this.searchHistory.slice(0, 100);
        
        // Save to storage
        Utils.saveToStorage('searchHistory', this.searchHistory);
    }

    loadSearchHistory() {
        this.searchHistory = Utils.loadFromStorage('searchHistory', []);
    }

    getSearchHistory() {
        return this.searchHistory;
    }

    clearSearchHistory() {
        this.searchHistory = [];
        Utils.removeFromStorage('searchHistory');
    }

    showSearchError(message) {
        // Create error notification
        const errorDiv = Utils.createElement('div', 
            'fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50',
            `
                <div class="flex items-center space-x-2">
                    <span>⚠️</span>
                    <span>Search Error: ${message}</span>
                    <button class="ml-2 text-red-500 hover:text-red-700" onclick="this.parentElement.parentElement.remove()">×</button>
                </div>
            `
        );
        
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    }
}

// Initialize Search Engine
window.SearchEngine = new SearchEngine();

// Export for use in other modules
window.Search = window.SearchEngine;