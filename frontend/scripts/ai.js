// AI functionality for AI Browser Pro

class AIEngine {
    constructor() {
        this.isActive = true;
        this.confidence = 0.94;
        this.currentTask = 'Ready to browse any domain worldwide';
        this.suggestions = ['Search with Google', 'Visit any .com domain', 'Explore international sites'];
        this.isProcessing = false;
        this.apiEndpoint = 'http://localhost:3001/api';
        
        this.initializeAI();
    }

    async initializeAI() {
        try {
            // Check if backend is available
            const response = await fetch(`${this.apiEndpoint}/health`);
            if (response.ok) {
                console.log('🤖 AI Backend connected successfully');
                this.updateStatus('AI systems online and ready');
            }
        } catch (error) {
            console.log('🤖 Running in offline mode');
            this.updateStatus('AI running in local mode');
        }
        
        this.startPerformanceMonitoring();
    }

    updateStatus(task, confidence = null) {
        this.currentTask = task;
        if (confidence !== null) {
            this.confidence = Math.max(0, Math.min(1, confidence));
        }
        
        // Update UI elements
        this.updateUIElements();
        
        // Trigger custom event
        window.dispatchEvent(new CustomEvent('aiStatusUpdate', {
            detail: {
                task: this.currentTask,
                confidence: this.confidence,
                isActive: this.isActive,
                isProcessing: this.isProcessing
            }
        }));
    }

    updateUIElements() {
        // Update AI confidence bar
        const confidenceBar = Utils.$('#ai-confidence-bar');
        if (confidenceBar) {
            confidenceBar.style.width = `${this.confidence * 100}%`;
        }

        // Update AI latency display
        const latencyDisplay = Utils.$('#ai-latency');
        if (latencyDisplay) {
            const latency = this.calculateLatency();
            latencyDisplay.textContent = `${latency}ms`;
        }

        // Update memory usage
        const memoryDisplay = Utils.$('#memory-usage');
        if (memoryDisplay) {
            const memory = this.calculateMemoryUsage();
            memoryDisplay.textContent = memory;
        }
    }

    calculateLatency() {
        // Simulate realistic AI processing latency
        const baseLatency = 85;
        const variation = Math.random() * 80;
        const networkFactor = Utils.getConnectionType() === '4g' ? 1 : 1.5;
        
        return Math.round((baseLatency + variation) * networkFactor);
    }

    calculateMemoryUsage() {
        // Simulate memory usage calculation
        const baseMemory = 1.8;
        const aiOverhead = 0.3;
        const tabOverhead = (window.TabManager?.tabs?.length || 1) * 0.1;
        
        const totalMemory = baseMemory + aiOverhead + tabOverhead;
        return `${totalMemory.toFixed(1)}GB`;
    }

    async analyzeUrl(url) {
        this.updateStatus('Analyzing URL...', 0.7);
        this.isProcessing = true;

        try {
            const response = await fetch(`${this.apiEndpoint}/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, type: 'summary' })
            });

            if (response.ok) {
                const analysis = await response.json();
                this.updateStatus(`Analysis complete: ${analysis.summary.substring(0, 50)}...`, analysis.confidence);
                return analysis;
            } else {
                throw new Error('Analysis failed');
            }
        } catch (error) {
            console.error('AI Analysis error:', error);
            return this.generateLocalAnalysis(url);
        } finally {
            this.isProcessing = false;
        }
    }

    generateLocalAnalysis(url) {
        // Fallback local analysis
        const domain = Utils.extractDomain(url);
        const analysis = {
            id: Utils.generateId(),
            url,
            type: 'summary',
            timestamp: new Date().toISOString(),
            confidence: Math.random() * 0.3 + 0.7,
            summary: `Local analysis of ${domain}. This website appears to be a ${this.categorizeWebsite(url)} with standard security practices.`,
            insights: [
                {
                    type: 'security',
                    title: 'Security Status',
                    description: url.startsWith('https://') ? 'Secure HTTPS connection' : 'Insecure HTTP connection',
                    score: url.startsWith('https://') ? 95 : 45
                },
                {
                    type: 'performance',
                    title: 'Load Performance',
                    description: 'Estimated load time based on domain',
                    score: Utils.randomBetween(70, 95)
                }
            ],
            security: {
                level: url.startsWith('https://') ? 'secure' : 'warning',
                threats: [],
                recommendations: url.startsWith('https://') ? [] : ['Use HTTPS for secure browsing']
            },
            metadata: {
                title: Utils.getDomainTitle(url),
                domain: domain,
                language: 'en',
                readingTime: Utils.randomBetween(2, 8)
            }
        };

        this.updateStatus(`Local analysis complete for ${domain}`, analysis.confidence);
        return analysis;
    }

    categorizeWebsite(url) {
        const domain = url.toLowerCase();
        
        if (domain.includes('google.com') || domain.includes('bing.com') || domain.includes('duckduckgo.com')) {
            return 'search engine';
        }
        if (domain.includes('youtube.com') || domain.includes('netflix.com') || domain.includes('spotify.com')) {
            return 'media platform';
        }
        if (domain.includes('github.com') || domain.includes('stackoverflow.com')) {
            return 'developer platform';
        }
        if (domain.includes('amazon.com') || domain.includes('ebay.com')) {
            return 'e-commerce site';
        }
        if (domain.includes('facebook.com') || domain.includes('twitter.com') || domain.includes('linkedin.com')) {
            return 'social media platform';
        }
        if (domain.includes('wikipedia.org') || domain.includes('.edu')) {
            return 'educational resource';
        }
        if (domain.includes('news') || domain.includes('bbc.') || domain.includes('cnn.')) {
            return 'news website';
        }
        
        return 'general website';
    }

    async generateSearchSuggestions(query) {
        if (!query || query.length < 2) return [];

        this.updateStatus('Generating smart suggestions...', 0.8);

        try {
            const response = await fetch(`${this.apiEndpoint}/search/suggestions?q=${encodeURIComponent(query)}`);
            if (response.ok) {
                const data = await response.json();
                this.updateStatus('Suggestions ready', 0.95);
                return data.suggestions;
            }
        } catch (error) {
            console.error('Suggestions error:', error);
        }

        // Fallback to local suggestions
        return this.generateLocalSuggestions(query);
    }

    generateLocalSuggestions(query) {
        const suggestions = [];
        const lowerQuery = query.toLowerCase();
        
        // Popular site suggestions
        const popularSites = [
            { domain: 'youtube.com', triggers: ['youtube', 'video', 'watch'] },
            { domain: 'github.com', triggers: ['github', 'git', 'code', 'repo'] },
            { domain: 'stackoverflow.com', triggers: ['stack', 'overflow', 'programming'] },
            { domain: 'reddit.com', triggers: ['reddit', 'r/', 'subreddit'] },
            { domain: 'twitter.com', triggers: ['twitter', 'tweet', 'x.com'] },
            { domain: 'linkedin.com', triggers: ['linkedin', 'professional', 'career'] },
            { domain: 'amazon.com', triggers: ['amazon', 'shop', 'buy'] },
            { domain: 'wikipedia.org', triggers: ['wiki', 'wikipedia', 'encyclopedia'] }
        ];

        popularSites.forEach(site => {
            if (site.triggers.some(trigger => lowerQuery.includes(trigger))) {
                suggestions.push({
                    id: Utils.generateId(),
                    text: site.domain,
                    type: 'url',
                    confidence: 0.9
                });
            }
        });

        // Domain completion suggestions
        if (lowerQuery.length > 2 && !lowerQuery.includes(' ')) {
            const commonTlds = ['com', 'org', 'net', 'edu', 'io', 'ai'];
            if (!query.includes('.')) {
                commonTlds.forEach(tld => {
                    suggestions.push({
                        id: Utils.generateId(),
                        text: `${query}.${tld}`,
                        type: 'url',
                        confidence: 0.7
                    });
                });
            }
        }

        // AI-powered suggestions
        if (lowerQuery.length > 3) {
            suggestions.push({
                id: Utils.generateId(),
                text: `AI Summary: ${query}`,
                type: 'ai-insight',
                confidence: 0.85
            });
        }

        // Search variations
        if (!Utils.isUrl(query)) {
            const variations = [
                `${query} tutorial`,
                `${query} guide`,
                `${query} examples`,
                `how to ${query}`
            ];
            
            variations.forEach(variation => {
                suggestions.push({
                    id: Utils.generateId(),
                    text: variation,
                    type: 'query',
                    confidence: 0.75
                });
            });
        }

        this.updateStatus('Local suggestions generated', 0.85);
        return suggestions.slice(0, 8);
    }

    async performSearch(query, options = {}) {
        this.updateStatus('Performing AI-enhanced search...', 0.8);
        this.isProcessing = true;

        try {
            const response = await fetch(`${this.apiEndpoint}/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    type: options.type || 'web',
                    limit: options.limit || 10,
                    filters: options.filters || {}
                })
            });

            if (response.ok) {
                const results = await response.json();
                this.updateStatus(`Found ${results.totalResults} results`, 0.95);
                return results;
            } else {
                throw new Error('Search failed');
            }
        } catch (error) {
            console.error('Search error:', error);
            return this.generateLocalSearchResults(query);
        } finally {
            this.isProcessing = false;
        }
    }

    generateLocalSearchResults(query) {
        // Fallback local search results
        const results = {
            query,
            type: 'web',
            timestamp: new Date().toISOString(),
            totalResults: 5,
            results: [
                {
                    id: '1',
                    title: `${query} - Comprehensive Guide`,
                    url: `https://example.com/guide/${encodeURIComponent(query)}`,
                    description: `Learn everything about ${query} with this comprehensive guide.`,
                    domain: 'example.com',
                    favicon: '📚',
                    type: 'article',
                    relevanceScore: 0.9
                },
                {
                    id: '2',
                    title: `Latest News: ${query}`,
                    url: `https://news.example.com/latest/${encodeURIComponent(query)}`,
                    description: `Stay updated with the latest news about ${query}.`,
                    domain: 'news.example.com',
                    favicon: '📰',
                    type: 'news',
                    relevanceScore: 0.85
                }
            ],
            suggestions: [],
            aiInsights: {
                summary: `Local search results for "${query}". Results are simulated for demonstration.`,
                confidence: 0.7,
                recommendations: ['Try refining your search terms', 'Check spelling and try again']
            }
        };

        this.updateStatus(`Local search complete for "${query}"`, 0.8);
        return results;
    }

    startPerformanceMonitoring() {
        // Monitor AI performance metrics
        setInterval(() => {
            this.updateUIElements();
            
            // Simulate AI processing variations
            if (!this.isProcessing) {
                const variation = (Math.random() - 0.5) * 0.1;
                this.confidence = Math.max(0.7, Math.min(0.99, this.confidence + variation));
            }
        }, 2000);

        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                const memInfo = performance.memory;
                console.log('Memory usage:', {
                    used: Math.round(memInfo.usedJSHeapSize / 1048576),
                    total: Math.round(memInfo.totalJSHeapSize / 1048576),
                    limit: Math.round(memInfo.jsHeapSizeLimit / 1048576)
                });
            }, 30000);
        }
    }

    // Public API methods
    setActive(active) {
        this.isActive = active;
        this.updateStatus(active ? 'AI systems activated' : 'AI systems paused');
    }

    getStatus() {
        return {
            isActive: this.isActive,
            confidence: this.confidence,
            currentTask: this.currentTask,
            suggestions: this.suggestions,
            isProcessing: this.isProcessing
        };
    }

    async processCommand(command) {
        this.updateStatus(`Processing command: ${command}`, 0.8);
        this.isProcessing = true;

        // Simulate command processing
        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = {
            command,
            result: `Command "${command}" processed successfully`,
            timestamp: new Date().toISOString(),
            confidence: Math.random() * 0.3 + 0.7
        };

        this.updateStatus('Command completed', response.confidence);
        this.isProcessing = false;

        return response;
    }
}

// Initialize AI Engine
window.AIEngine = new AIEngine();

// Export for use in other modules
window.AI = window.AIEngine;