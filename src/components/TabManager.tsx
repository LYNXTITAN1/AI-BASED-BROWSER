import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Shield, AlertTriangle, ShieldAlert, Loader } from 'lucide-react';
import { Tab } from '../types';

interface TabManagerProps {
  tabs: Tab[];
  onAddTab: (url: string, title: string) => void;
  onCloseTab: (tabId: string) => void;
  onSetActiveTab: (tabId: string) => void;
  isDarkMode: boolean;
}

const TabManager: React.FC<TabManagerProps> = ({
  tabs,
  onAddTab,
  onCloseTab,
  onSetActiveTab,
  isDarkMode
}) => {
  const getSecurityIcon = (status: Tab['securityStatus']) => {
    switch (status) {
      case 'secure':
        return (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Shield className="w-3 h-3 text-green-400" />
          </motion.div>
        );
      case 'warning':
        return (
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <AlertTriangle className="w-3 h-3 text-yellow-400" />
          </motion.div>
        );
      case 'danger':
        return (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <ShieldAlert className="w-3 h-3 text-red-400" />
          </motion.div>
        );
      case 'checking':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader className="w-3 h-3 text-blue-400" />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`flex items-center backdrop-blur-xl border-b px-3 ${
        isDarkMode 
          ? 'bg-gray-900/50 border-gray-700/50' 
          : 'bg-white/50 border-gray-200/50'
      }`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      {/* Tabs with Advanced Animations */}
      <div className="flex items-center flex-1 overflow-x-auto scrollbar-hide">
        <AnimatePresence mode="popLayout">
          {tabs.map((tab, index) => (
            <motion.div
              key={tab.id}
              layout
              initial={{ width: 0, opacity: 0, scale: 0.8 }}
              animate={{ width: 'auto', opacity: 1, scale: 1 }}
              exit={{ width: 0, opacity: 0, scale: 0.8 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                layout: { duration: 0.3 }
              }}
              className={`flex items-center space-x-3 px-4 py-3 min-w-0 max-w-64 cursor-pointer group relative transition-all duration-300 ${
                tab.isActive 
                  ? isDarkMode
                    ? 'bg-gray-800/80 backdrop-blur-xl' 
                    : 'bg-white/80 backdrop-blur-xl'
                  : isDarkMode
                    ? 'hover:bg-gray-800/40'
                    : 'hover:bg-white/40'
              }`}
              onClick={() => onSetActiveTab(tab.id)}
              whileHover={{ 
                y: -2,
                boxShadow: isDarkMode 
                  ? '0 8px 32px rgba(0, 0, 0, 0.3)' 
                  : '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
              style={{
                borderRadius: '12px 12px 0 0',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Security Status with Floating Animation */}
              <motion.div
                className="flex-shrink-0"
                animate={{ y: [0, -1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
              >
                {getSecurityIcon(tab.securityStatus)}
              </motion.div>

              {/* Favicon with 3D Hover */}
              <motion.span 
                className="text-sm flex-shrink-0"
                whileHover={{ scale: 1.2, rotateY: 15 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {tab.favicon}
              </motion.span>

              {/* Title with Variable Typography */}
              <motion.span 
                className={`text-sm truncate flex-1 transition-all duration-300 ${
                  tab.isActive 
                    ? isDarkMode
                      ? 'text-white font-semibold' 
                      : 'text-gray-900 font-semibold'
                    : isDarkMode
                      ? 'text-gray-300 font-medium'
                      : 'text-gray-600 font-medium'
                }`}
                style={{
                  fontVariationSettings: tab.isActive ? '"wght" 600' : '"wght" 400'
                }}
                animate={{
                  color: tab.isActive 
                    ? isDarkMode ? '#ffffff' : '#111827'
                    : isDarkMode ? '#d1d5db' : '#6b7280'
                }}
              >
                {tab.title}
              </motion.span>

              {/* AI Summary Indicator with Pulse */}
              {tab.aiSummary && (
                <motion.div 
                  className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex-shrink-0"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              {/* Close Button with Micro-interaction */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className={`flex-shrink-0 p-1.5 opacity-0 group-hover:opacity-100 rounded-lg transition-all duration-200 ${
                  isDarkMode 
                    ? 'hover:bg-red-500/20 hover:text-red-400' 
                    : 'hover:bg-red-100/80 hover:text-red-600'
                }`}
                whileHover={{ 
                  scale: 1.2, 
                  rotate: 90,
                  backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)'
                }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-3 h-3" />
              </motion.button>

              {/* Active Tab Indicator with Gradient */}
              {tab.isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 rounded-t-lg"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Hover Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: isDarkMode 
                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)'
                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)'
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* New Tab Button with 3D Effect */}
      <motion.button
        onClick={() => onAddTab('https://example.com', 'New Tab')}
        className={`flex-shrink-0 p-3 rounded-xl transition-all duration-200 backdrop-blur-sm ${
          isDarkMode 
            ? 'bg-gray-800/50 hover:bg-gray-700/70 border border-gray-700/50' 
            : 'bg-white/50 hover:bg-white/80 border border-gray-200/50'
        }`}
        whileHover={{ 
          scale: 1.1, 
          rotateZ: 90,
          boxShadow: isDarkMode 
            ? '0 8px 32px rgba(59, 130, 246, 0.3)' 
            : '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
        whileTap={{ scale: 0.95 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <Plus className="w-4 h-4 text-blue-400" />
      </motion.button>
    </motion.div>
  );
};

export default TabManager;