import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Sparkles, 
  FileText, 
  Search, 
  Shield, 
  Zap,
  ChevronDown,
  Settings,
  Brain,
  Eye,
  Mic,
  Send
} from 'lucide-react';
import { AIState } from '../types';

interface AIAssistantProps {
  aiState: AIState;
  onUpdateState: (state: AIState) => void;
  searchQuery: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  aiState,
  onUpdateState,
  searchQuery
}) => {
  const [chatInput, setChatInput] = useState('');
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const aiFeatures = [
    {
      id: 'summarize',
      icon: FileText,
      title: 'Smart Summary',
      description: 'AI-powered page summarization',
      confidence: 0.96,
      active: true
    },
    {
      id: 'research',
      icon: Search,
      title: 'Deep Research',
      description: 'Multi-source analysis',
      confidence: 0.89,
      active: false
    },
    {
      id: 'security',
      icon: Shield,
      title: 'Privacy Guard',
      description: 'Real-time threat detection',
      confidence: 0.98,
      active: true
    },
    {
      id: 'automation',
      icon: Zap,
      title: 'Smart Actions',
      description: 'Automated task execution',
      confidence: 0.87,
      active: false
    }
  ];

  const recentInsights = [
    {
      id: '1',
      type: 'summary',
      title: 'Page Summary',
      content: 'This research paper discusses advanced AI architectures for browser automation...',
      timestamp: '2 minutes ago',
      relevance: 0.94
    },
    {
      id: '2',
      type: 'security',
      title: 'Privacy Check',
      content: 'No tracking scripts detected. Local AI processing active.',
      timestamp: '5 minutes ago',
      relevance: 0.98
    },
    {
      id: '3',
      type: 'suggestion',
      title: 'Smart Suggestion',
      content: 'Found 3 related papers that might interest you.',
      timestamp: '8 minutes ago',
      relevance: 0.85
    }
  ];

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    // Simulate AI processing
    onUpdateState({
      ...aiState,
      isProcessing: true,
      currentTask: `Processing: ${chatInput}`
    });

    setChatInput('');
    
    setTimeout(() => {
      onUpdateState({
        ...aiState,
        isProcessing: false,
        currentTask: 'Ready to assist',
        confidence: Math.random() * 0.3 + 0.7
      });
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: aiState.isProcessing ? 360 : 0 }}
            transition={{ duration: 1, repeat: aiState.isProcessing ? Infinity : 0 }}
            className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"
          >
            <Bot className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
            <p className="text-xs text-gray-500">{aiState.currentTask}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Settings className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* AI Status */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-2">
          <Brain className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">AI Engine Status</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${aiState.confidence * 100}%` }}
              className="h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
            />
          </div>
          <span className="text-xs text-gray-600">{Math.round(aiState.confidence * 100)}%</span>
        </div>
      </div>

      {/* AI Features */}
      <div className="p-4 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Active Features</h4>
        <div className="space-y-2">
          {aiFeatures.map((feature) => (
            <motion.div
              key={feature.id}
              whileHover={{ scale: 1.02 }}
              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                feature.active 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
              onClick={() => setActiveFeature(
                activeFeature === feature.id ? null : feature.id
              )}
            >
              <div className="flex items-center space-x-3">
                <feature.icon className={`w-4 h-4 ${
                  feature.active ? 'text-blue-600' : 'text-gray-600'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{feature.title}</p>
                  <p className="text-xs text-gray-500 truncate">{feature.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    {Math.round(feature.confidence * 100)}%
                  </span>
                  <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${
                    activeFeature === feature.id ? 'rotate-180' : ''
                  }`} />
                </div>
              </div>
              
              <AnimatePresence>
                {activeFeature === feature.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 pt-3 border-t border-gray-200"
                  >
                    <p className="text-xs text-gray-600">
                      Feature controls and settings would appear here.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Insights */}
      <div className="flex-1 overflow-y-auto p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Insights</h4>
        <div className="space-y-3">
          {recentInsights.map((insight) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-start space-x-3">
                <div className="p-1.5 bg-white rounded-lg">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{insight.content}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-xs text-gray-500">{insight.timestamp}</span>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {Math.round(insight.relevance * 100)}% relevant
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask AI assistant..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Mic className="w-4 h-4 text-gray-600" />
          </button>
          <button 
            onClick={handleSendMessage}
            disabled={!chatInput.trim()}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;