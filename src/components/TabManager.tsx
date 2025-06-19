import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Shield, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Tab } from '../types';

interface TabManagerProps {
  tabs: Tab[];
  onAddTab: (url: string, title: string) => void;
  onCloseTab: (tabId: string) => void;
  onSetActiveTab: (tabId: string) => void;
}

const TabManager: React.FC<TabManagerProps> = ({
  tabs,
  onAddTab,
  onCloseTab,
  onSetActiveTab
}) => {
  const getSecurityIcon = (status: Tab['securityStatus']) => {
    switch (status) {
      case 'secure':
        return <Shield className="w-3 h-3 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-3 h-3 text-yellow-500" />;
      case 'danger':
        return <ShieldAlert className="w-3 h-3 text-red-500" />;
      case 'checking':
        return <div className="w-3 h-3 border border-gray-400 border-t-blue-500 rounded-full animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center bg-gray-50 border-b border-gray-200 px-2">
      {/* Tabs */}
      <div className="flex items-center flex-1 overflow-x-auto">
        <AnimatePresence>
          {tabs.map((tab) => (
            <motion.div
              key={tab.id}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center space-x-2 px-4 py-2 min-w-0 max-w-64 cursor-pointer group relative ${
                tab.isActive 
                  ? 'bg-white border-b-2 border-blue-500' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => onSetActiveTab(tab.id)}
            >
              {/* Security Status */}
              <div className="flex-shrink-0">
                {getSecurityIcon(tab.securityStatus)}
              </div>

              {/* Favicon */}
              <span className="text-sm flex-shrink-0">{tab.favicon}</span>

              {/* Title */}
              <span className={`text-sm truncate flex-1 ${
                tab.isActive ? 'text-gray-900 font-medium' : 'text-gray-600'
              }`}>
                {tab.title}
              </span>

              {/* AI Summary Indicator */}
              {tab.aiSummary && (
                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 opacity-60" />
              )}

              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className="flex-shrink-0 p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 rounded transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>

              {/* Active Tab Indicator */}
              {tab.isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* New Tab Button */}
      <button
        onClick={() => onAddTab('https://example.com', 'New Tab')}
        className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-md transition-colors"
      >
        <Plus className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
};

export default TabManager;