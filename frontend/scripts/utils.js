// Utility functions for AI Browser Pro

class Utils {
    // DOM manipulation utilities
    static $(selector) {
        return document.querySelector(selector);
    }

    static $$(selector) {
        return document.querySelectorAll(selector);
    }

    static createElement(tag, className = '', innerHTML = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    }

    // URL utilities
    static isValidUrl(string) {
        try {
            new URL(string.startsWith('http') ? string : `https://${string}`);
            return true;
        } catch {
            return false;
        }
    }

    static isUrl(text) {
        const trimmedText = text.trim().toLowerCase();
        
        // Direct URL patterns
        if (trimmedText.startsWith('http://') || trimmedText.startsWith('https://')) {
            return true;
        }
        
        // Popular domains without protocol
        const popularDomains = [
            'youtube.com', 'youtu.be', 'google.com', 'github.com', 'stackoverflow.com',
            'reddit.com', 'twitter.com', 'x.com', 'linkedin.com', 'facebook.com',
            'instagram.com', 'tiktok.com', 'netflix.com', 'spotify.com', 'amazon.com',
            'ebay.com', 'wikipedia.org', 'medium.com', 'gmail.com', 'drive.google.com'
        ];
        
        if (popularDomains.some(domain => trimmedText === domain || trimmedText.startsWith(domain + '/'))) {
            return true;
        }
        
        // Domain patterns
        const domainPatterns = [
            /^[\w\.-]+\.[\w]{2,}$/,
            /^[\w\.-]+\.[\w]{2,}\/.*$/,
            /^[\w\.-]+\.[\w\.-]+\.[\w]{2,}$/,
            /^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/,
            /^localhost(:\d+)?$/,
            /^[\w\.-]+\.(co\.uk|com\.au|co\.jp|co\.kr|com\.br|co\.in|com\.mx|co\.za)$/,
            /^[\w\.-]+\.(de|fr|it|es|nl|se|no|dk|fi|pl|cz|hu|ro|bg|hr|si|sk|lt|lv|ee)$/,
            /^[\w\.-]+\.(io|ai|app|dev|tech|blog|news|shop|store|online|site|website|cloud|digital)$/
        ];
        
        return domainPatterns.some(pattern => pattern.test(trimmedText));
    }

    static formatUrl(input) {
        const trimmed = input.trim();
        
        if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
            return trimmed;
        }
        
        if (trimmed.startsWith('localhost') || /^(\d{1,3}\.){3}\d{1,3}/.test(trimmed)) {
            return `http://${trimmed}`;
        }
        
        return `https://${trimmed}`;
    }

    static extractDomain(url) {
        try {
            return new URL(url).hostname.replace(/^www\./, '');
        } catch {
            return url;
        }
    }

    static getDomainTitle(url) {
        try {
            if (url === 'ai-browser://home') return 'AI Browser Pro - Home';
            if (url.includes('google.com')) return 'Google Search';
            if (url.includes('youtube.com')) return 'YouTube';
            
            const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
            const hostname = urlObj.hostname.replace(/^www\./, '');
            const domainParts = hostname.split('.');
            const mainDomain = domainParts[0];
            
            return mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1);
        } catch {
            return url;
        }
    }

    // Favicon utilities
    static getFaviconForDomain(url) {
        try {
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
            
            // Check for exact domain matches
            for (const [domainKey, favicon] of Object.entries(favicons)) {
                if (domain.includes(domainKey)) return favicon;
            }
            
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
            
            // Default
            if (domain.includes('.com') || domain.includes('.net')) return '🌐';
            
            return '🔗';
        } catch {
            return '🔗';
        }
    }

    // Animation utilities
    static fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const start = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress.toString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    }

    static fadeOut(element, duration = 300) {
        const start = performance.now();
        const startOpacity = parseFloat(element.style.opacity) || 1;
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = (startOpacity * (1 - progress)).toString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        }
        
        requestAnimationFrame(animate);
    }

    static slideIn(element, direction = 'left', duration = 300) {
        const transforms = {
            left: 'translateX(-100%)',
            right: 'translateX(100%)',
            up: 'translateY(-100%)',
            down: 'translateY(100%)'
        };
        
        element.style.transform = transforms[direction];
        element.style.display = 'block';
        
        const start = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOut = 1 - Math.pow(1 - progress, 3);
            element.style.transform = `${transforms[direction].replace('100%', `${100 * (1 - easeOut)}%`)}`;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.transform = '';
            }
        }
        
        requestAnimationFrame(animate);
    }

    // Local storage utilities
    static saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Failed to save to storage:', error);
            return false;
        }
    }

    static loadFromStorage(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Failed to load from storage:', error);
            return defaultValue;
        }
    }

    static removeFromStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Failed to remove from storage:', error);
            return false;
        }
    }

    // Debounce utility
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle utility
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Random utilities
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    static randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Time utilities
    static formatTimeAgo(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        
        return date.toLocaleDateString();
    }

    // Performance utilities
    static measurePerformance(name, func) {
        const start = performance.now();
        const result = func();
        const end = performance.now();
        console.log(`${name} took ${end - start} milliseconds`);
        return result;
    }

    // Error handling
    static handleError(error, context = 'Unknown') {
        console.error(`Error in ${context}:`, error);
        
        // In production, you might want to send this to an error tracking service
        if (window.errorTracker) {
            window.errorTracker.captureException(error, { context });
        }
    }

    // Feature detection
    static supportsWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
        } catch {
            return false;
        }
    }

    static supportsServiceWorker() {
        return 'serviceWorker' in navigator;
    }

    static supportsWebAssembly() {
        return typeof WebAssembly === 'object';
    }

    // Device detection
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    static isTablet() {
        return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
    }

    static isDesktop() {
        return !this.isMobile() && !this.isTablet();
    }

    // Network utilities
    static getConnectionType() {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        return connection ? connection.effectiveType : 'unknown';
    }

    static isOnline() {
        return navigator.onLine;
    }
}

// Export for use in other modules
window.Utils = Utils;