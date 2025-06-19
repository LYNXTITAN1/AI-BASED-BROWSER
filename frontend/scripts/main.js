// Main application initialization for AI Browser Pro

class AIBrowserApp {
    constructor() {
        this.isInitialized = false;
        this.loadingScreen = Utils.$('#loading-screen');
        this.app = Utils.$('#app');
        
        this.initialize();
    }

    async initialize() {
        try {
            console.log('🚀 Initializing AI Browser Pro...');
            
            // Show loading screen
            this.showLoadingScreen();
            
            // Initialize core systems
            await this.initializeCoreComponents();
            
            // Setup global event listeners
            this.setupGlobalEventListeners();
            
            // Setup performance monitoring
            this.setupPerformanceMonitoring();
            
            // Setup error handling
            this.setupErrorHandling();
            
            // Initialize feature detection
            this.detectFeatures();
            
            // Setup accessibility
            this.setupAccessibility();
            
            // Hide loading screen and show app
            await this.showApplication();
            
            console.log('✅ AI Browser Pro initialized successfully');
            this.isInitialized = true;
            
            // Trigger initialization complete event
            window.dispatchEvent(new CustomEvent('appInitialized'));
            
        } catch (error) {
            console.error('❌ Failed to initialize AI Browser Pro:', error);
            this.showInitializationError(error);
        }
    }

    showLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.style.display = 'flex';
        }
        
        // Simulate loading progress
        this.simulateLoadingProgress();
    }

    simulateLoadingProgress() {
        const messages = [
            'Initializing AI systems...',
            'Loading neural networks...',
            'Connecting to knowledge base...',
            'Optimizing performance...',
            'Preparing user interface...',
            'Almost ready...'
        ];
        
        let messageIndex = 0;
        const messageElement = this.loadingScreen?.querySelector('p');
        
        const updateMessage = () => {
            if (messageElement && messageIndex < messages.length) {
                messageElement.textContent = messages[messageIndex];
                messageIndex++;
                setTimeout(updateMessage, 500);
            }
        };
        
        updateMessage();
    }

    async initializeCoreComponents() {
        // Core components are already initialized via their respective scripts
        // This method ensures they're properly connected
        
        // Verify AI Engine
        if (!window.AI) {
            throw new Error('AI Engine failed to initialize');
        }
        
        // Verify Search Engine
        if (!window.Search) {
            throw new Error('Search Engine failed to initialize');
        }
        
        // Verify Tab Manager
        if (!window.TabManager) {
            throw new Error('Tab Manager failed to initialize');
        }
        
        // Verify Navigation Manager
        if (!window.Navigation) {
            throw new Error('Navigation Manager failed to initialize');
        }
        
        // Connect components
        this.connectComponents();
        
        console.log('✅ Core components initialized');
    }

    connectComponents() {
        // Connect Search to Navigation for history tracking
        const originalPerformSearch = window.Search.performSearch.bind(window.Search);
        window.Search.performSearch = async (query) => {
            const result = await originalPerformSearch(query);
            
            // Add to navigation history if it's a URL
            if (Utils.isUrl(query)) {
                const url = Utils.formatUrl(query);
                const title = Utils.getDomainTitle(url);
                window.Navigation.addToHistory(url, title);
            }
            
            return result;
        };

        // Connect Tab Manager to Navigation for history tracking
        const originalNavigateActiveTab = window.TabManager.navigateActiveTab.bind(window.TabManager);
        window.TabManager.navigateActiveTab = (url, title, favicon, analysis) => {
            const result = originalNavigateActiveTab(url, title, favicon, analysis);
            
            // Add to navigation history
            window.Navigation.addToHistory(url, title || Utils.getDomainTitle(url));
            
            return result;
        };
    }

    setupGlobalEventListeners() {
        // Window events
        window.addEventListener('resize', Utils.throttle(() => {
            this.handleWindowResize();
        }, 250));

        window.addEventListener('beforeunload', () => {
            this.handleBeforeUnload();
        });

        window.addEventListener('online', () => {
            this.handleOnlineStatusChange(true);
        });

        window.addEventListener('offline', () => {
            this.handleOnlineStatusChange(false);
        });

        // Visibility change
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Custom events
        window.addEventListener('aiStatusUpdate', (event) => {
            this.handleAIStatusUpdate(event.detail);
        });

        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeyboard(e);
        });

        // Context menu prevention for production feel
        document.addEventListener('contextmenu', (e) => {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                e.preventDefault();
            }
        });

        console.log('✅ Global event listeners setup');
    }

    setupPerformanceMonitoring() {
        // Monitor performance metrics
        if ('performance' in window) {
            // Monitor navigation timing
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        console.log('📊 Performance Metrics:', {
                            loadTime: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
                            domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                            totalTime: Math.round(perfData.loadEventEnd - perfData.fetchStart)
                        });
                    }
                }, 0);
            });

            // Monitor memory usage
            if ('memory' in performance) {
                setInterval(() => {
                    const memInfo = performance.memory;
                    const memoryUsage = {
                        used: Math.round(memInfo.usedJSHeapSize / 1048576),
                        total: Math.round(memInfo.totalJSHeapSize / 1048576),
                        limit: Math.round(memInfo.jsHeapSizeLimit / 1048576)
                    };
                    
                    // Update memory display
                    const memoryDisplay = Utils.$('#memory-usage');
                    if (memoryDisplay) {
                        memoryDisplay.textContent = `${memoryUsage.used}MB`;
                    }
                }, 5000);
            }
        }

        // Monitor frame rate
        let frameCount = 0;
        let lastTime = performance.now();
        
        const countFrames = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round(frameCount * 1000 / (currentTime - lastTime));
                console.log(`🎯 FPS: ${fps}`);
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(countFrames);
        };
        
        requestAnimationFrame(countFrames);

        console.log('✅ Performance monitoring setup');
    }

    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.handleGlobalError(event.error, 'JavaScript Error');
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handleGlobalError(event.reason, 'Promise Rejection');
        });

        console.log('✅ Error handling setup');
    }

    detectFeatures() {
        const features = {
            webgl: Utils.supportsWebGL(),
            serviceWorker: Utils.supportsServiceWorker(),
            webAssembly: Utils.supportsWebAssembly(),
            speechRecognition: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
            geolocation: 'geolocation' in navigator,
            camera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
            notifications: 'Notification' in window,
            localStorage: 'localStorage' in window,
            indexedDB: 'indexedDB' in window
        };

        console.log('🔍 Feature Detection:', features);
        
        // Store features globally
        window.browserFeatures = features;
        
        // Disable features that aren't supported
        if (!features.speechRecognition) {
            const voiceBtn = Utils.$('#voice-btn');
            if (voiceBtn) {
                voiceBtn.disabled = true;
                voiceBtn.title = 'Voice search not supported in this browser';
            }
        }

        if (!features.camera) {
            const cameraBtn = Utils.$('#camera-btn');
            if (cameraBtn) {
                cameraBtn.disabled = true;
                cameraBtn.title = 'Camera access not supported in this browser';
            }
        }
    }

    setupAccessibility() {
        // Add skip link
        const skipLink = Utils.createElement('a', 
            'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50',
            'Skip to main content'
        );
        skipLink.href = '#content-area';
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add ARIA labels
        const searchInput = Utils.$('#search-input');
        if (searchInput) {
            searchInput.setAttribute('aria-label', 'Universal search and URL bar');
        }

        // Add keyboard navigation hints
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        console.log('✅ Accessibility features setup');
    }

    async showApplication() {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (this.loadingScreen) {
                    Utils.fadeOut(this.loadingScreen, 500);
                    setTimeout(() => {
                        this.loadingScreen.style.display = 'none';
                    }, 500);
                }
                
                if (this.app) {
                    this.app.classList.remove('hidden');
                    Utils.fadeIn(this.app, 500);
                }
                
                resolve();
            }, 1500); // Minimum loading time for smooth experience
        });
    }

    handleWindowResize() {
        // Update layout calculations
        const isMobile = window.innerWidth < 768;
        document.body.classList.toggle('mobile-layout', isMobile);
        
        // Adjust sidebar behavior on mobile
        if (isMobile && window.Navigation?.sidebarOpen) {
            window.Navigation.closeSidebar();
        }
    }

    handleBeforeUnload() {
        // Save application state
        if (window.TabManager) {
            window.TabManager.saveTabsToStorage();
        }
        
        if (window.Navigation) {
            window.Navigation.saveNavigationState();
        }
        
        console.log('💾 Application state saved');
    }

    handleOnlineStatusChange(isOnline) {
        const statusMessage = isOnline ? 'Back online' : 'You are offline';
        const statusType = isOnline ? 'success' : 'warning';
        
        if (window.Navigation) {
            window.Navigation.showNotification(statusMessage, statusType);
        }
        
        // Update AI status
        if (window.AI) {
            window.AI.updateStatus(
                isOnline ? 'Connected - Full AI capabilities' : 'Offline - Limited AI features',
                isOnline ? 0.95 : 0.6
            );
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            // Page is hidden - reduce activity
            console.log('📱 Page hidden - reducing activity');
        } else {
            // Page is visible - resume normal activity
            console.log('📱 Page visible - resuming activity');
            
            // Update AI status
            if (window.AI) {
                window.AI.updateStatus('Welcome back!', 0.95);
            }
        }
    }

    handleAIStatusUpdate(detail) {
        // Update UI elements based on AI status
        const confidenceBar = Utils.$('#ai-confidence-bar');
        if (confidenceBar) {
            confidenceBar.style.width = `${detail.confidence * 100}%`;
        }
    }

    handleGlobalKeyboard(e) {
        // Global keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case ',':
                    e.preventDefault();
                    this.openSettings();
                    break;
                case '/':
                    e.preventDefault();
                    this.showKeyboardShortcuts();
                    break;
            }
        }
        
        // Escape key actions
        if (e.key === 'Escape') {
            // Close any open modals or panels
            if (window.Navigation?.sidebarOpen) {
                window.Navigation.closeSidebar();
            }
            
            // Clear search suggestions
            const suggestions = Utils.$('#search-suggestions');
            if (suggestions && !suggestions.classList.contains('hidden')) {
                suggestions.classList.add('hidden');
            }
        }
    }

    handleGlobalError(error, context) {
        // Log error
        console.error(`Error in ${context}:`, error);
        
        // Show user-friendly error message
        if (window.Navigation) {
            window.Navigation.showNotification(
                'Something went wrong. Please try again.',
                'error'
            );
        }
        
        // In production, send error to monitoring service
        if (window.errorTracker) {
            window.errorTracker.captureException(error, { context });
        }
    }

    showInitializationError(error) {
        document.body.innerHTML = `
            <div class="min-h-screen bg-red-50 flex items-center justify-center">
                <div class="text-center p-8">
                    <div class="text-6xl mb-4">⚠️</div>
                    <h1 class="text-2xl font-bold text-red-900 mb-4">Initialization Failed</h1>
                    <p class="text-red-700 mb-6">AI Browser Pro failed to start properly.</p>
                    <button onclick="location.reload()" 
                            class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors">
                        Reload Application
                    </button>
                    <details class="mt-6 text-left">
                        <summary class="cursor-pointer text-red-600">Technical Details</summary>
                        <pre class="mt-2 p-4 bg-red-100 rounded text-sm overflow-auto">${error.stack || error.message}</pre>
                    </details>
                </div>
            </div>
        `;
    }

    openSettings() {
        // Placeholder for settings modal
        if (window.Navigation) {
            window.Navigation.showNotification('Settings panel coming soon!', 'info');
        }
    }

    showKeyboardShortcuts() {
        const shortcuts = [
            { key: 'Ctrl+K', description: 'Focus search bar' },
            { key: 'Ctrl+T', description: 'New tab' },
            { key: 'Ctrl+W', description: 'Close tab' },
            { key: 'Ctrl+R', description: 'Refresh page' },
            { key: 'Ctrl+D', description: 'Bookmark page' },
            { key: 'Alt+←', description: 'Go back' },
            { key: 'Alt+→', description: 'Go forward' },
            { key: 'Alt+Home', description: 'Go home' },
            { key: 'Esc', description: 'Close panels' }
        ];

        const modal = Utils.createElement('div', 
            'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
            `
                <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-lg font-semibold">Keyboard Shortcuts</h3>
                        <button class="text-gray-500 hover:text-gray-700" onclick="this.closest('.fixed').remove()">×</button>
                    </div>
                    <div class="space-y-2">
                        ${shortcuts.map(shortcut => `
                            <div class="flex justify-between items-center py-1">
                                <span class="text-sm text-gray-600">${shortcut.description}</span>
                                <kbd class="px-2 py-1 bg-gray-100 rounded text-xs font-mono">${shortcut.key}</kbd>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `
        );

        document.body.appendChild(modal);
        
        // Close on click outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Public API
    getStatus() {
        return {
            initialized: this.isInitialized,
            components: {
                ai: !!window.AI,
                search: !!window.Search,
                tabs: !!window.TabManager,
                navigation: !!window.Navigation
            },
            features: window.browserFeatures || {}
        };
    }

    restart() {
        location.reload();
    }
}

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.AIBrowserApp = new AIBrowserApp();
    });
} else {
    window.AIBrowserApp = new AIBrowserApp();
}

// Export for debugging
window.App = window.AIBrowserApp;