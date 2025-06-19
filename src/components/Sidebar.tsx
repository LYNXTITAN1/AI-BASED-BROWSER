import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  History, 
  Bookmark, 
  Download, 
  Settings, 
  Shield, 
  Bot,
  Clock,
  Star,
  FileText,
  Zap,
  Eye
} from 'lucide-react';
import { Tab, AIState } from '../types';

interface SidebarProps {
  tabs: Tab[];
  aiState: AIState;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ tabs, aiState, onClose }) => {
  const [activeSection, setActiveSection] = useState<'history' | 'bookmarks' | 'ai' | 'settings'>('ai');

  const sidebarSections = [
    { id: 'ai', label: 'AI Insights', icon: Bot },
    { id: 'history', label: 'History', icon: History },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderAIInsights = () => (
    <div className="space-y-4">
      {/* AI Status */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-blue-900">AI Engine</span>
        </div>
        <p className="text-sm text-blue-800 mb-3">{aiState.currentTask}</p>
        <div className="w-full bg-blue-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${aiState.confidence * 100}%` }}
            className="h-2 bg-blue-600 rounded-full"
          />
        </div>
        <p className="text-xs text-blue-700 mt-1">{Math.round(aiState.confidence * 100)}% confidence</p>
      </div>

      {/* Quick Actions */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
        <div className="space-y-2">
          {aiState.suggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Zap className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-900">{suggestion}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tab Summaries */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Tab Insights</h4>
        <div className="space-y-3">
          {tabs.map((tab) => (
            <div key={tab.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm">{tab.favicon}</span>
                <span className="text-sm font-medium text-gray-900 truncate flex-1">{tab.title}</span>
              </div>
              {tab.aiSummary && (
                <p className="text-xs text-gray-600">{tab.aiSummary}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-900">Recent History</h4>
      {[
        { title: 'AI Research Papers', url: 'research.ai', time: '2 min ago' },
        { title: 'Browser Security Guide', url: 'security.example.com', time: '15 min ago' },
        { title: 'Privacy Best Practices', url: 'privacy.guide', time: '1 hour ago' }
      ].map((item, index) => (
        <div key={index} className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
          <div className="flex items-center space-x-3">
            <Clock className="w-4 h-4 text-gray-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
              <p className="text-xs text-gray-500">{item.url} • {item.time}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderBookmarks = () => (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-900">Bookmarks</h4>
      {[
        { title: 'AI Tools Collection', url: 'ai-tools.com', folder: 'AI Resources' },
        { title: 'Privacy Guides', url: 'privacy.org', folder: 'Security' },
        { title: 'Research Papers', url: 'papers.arxiv.org', folder: 'Research' }
      ].map((item, index) => (
        <div key={index} className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
          <div className="flex items-center space-x-3">
            <Star className="w-4 h-4 text-yellow-500" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
              <p className="text-xs text-gray-500">{item.folder}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900">Browser Settings</h4>
      
      {/* Privacy Settings */}
      <div className="space-y-3">
        <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Privacy</h5>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-900">Local AI Processing</span>
            <div className="w-10 h-5 bg-green-500 rounded-full flex items-center justify-end pr-0.5">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-900">Block Trackers</span>
            <div className="w-10 h-5 bg-green-500 rounded-full flex items-center justify-end pr-0.5">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Settings */}
      <div className="space-y-3">
        <h5 className="text-xs font-medium text-gray-700 uppercase tracking-wide">AI Features</h5>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-900">Smart Summaries</span>
            <div className="w-10 h-5 bg-blue-500 rounded-full flex items-center justify-end pr-0.5">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-900">Auto Research</span>
            <div className="w-10 h-5 bg-gray-300 rounded-full flex items-center justify-start pl-0.5">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'ai':
        return renderAIInsights();
      case 'history':
        return renderHistory();
      case 'bookmarks':
        return renderBookmarks();
      case 'settings':
        return renderSettings();
      default:
        return renderAIInsights();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Browser Panel</h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex border-b border-gray-200">
        {sidebarSections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id as any)}
            className={`flex-1 flex items-center justify-center space-x-1 py-3 text-sm font-medium transition-colors ${
              activeSection === section.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <section.icon className="w-4 h-4" />
            <span className="hidden sm:block">{section.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Sidebar;