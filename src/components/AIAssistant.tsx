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
  Send,
  X,
  MessageSquare,
  Lightbulb,
  TrendingUp,
  Globe,
  Lock,
  Cpu
} from 'lucide-react';
import { AIState } from '../types';

interface AIAssistantProps {
  aiState: AIState;
  onUpdateState: (state: AIState) => void;
  searchQuery: string;
  onClose: () => void;
  isDarkMode: boolean;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  aiState,
  onUpdateState,
  searchQuery,
  onClose,
  isDarkMode
}) => {
  const [chatInput, setChatInput] = useState('');
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const aiFeatures = [
    {
      id: 'summarize',
      icon: FileText,
      title: 'Neural Summary',
      description: 'Quantum-powered content analysis',
      confidence: 0.96,
      active: true,
      color: 'blue'
    },
    {
      id: 'research',
      icon: Search,
      title: 'Deep Research',
      description: 'Multi-dimensional data mining',
      confidence: 0.89,
      active: false,
      color: 'purple'
    },
    {
      id: 'security',
      icon: Shield,
      title: 'Quantum Guard',
      description: 'Real-time threat neutralization',
      confidence: 0.98,
      active: true,
      color: 'green'
    },
    {
      id: 'automation',
      icon: Zap,
      title: 'Smart Actions',
      description: 'Predictive task execution',
      confidence: 0.87,
      active: false,
      color: 'yellow'
    }
  ];

  const recentInsights = [
    {
      id: '1',
      type: 'summary',
      title: 'Quantum Analysis Complete',
      content: 'Advanced neural networks detected 47 key insights across 12 data dimensions...',
      timestamp: '2 minutes ago',
      relevance: 0.94,
      icon: Brain
    },
    {
      id: '2',
      type: 'security',
      title: 'Threat Vector Neutralized',
      content: 'Quantum encryption protocols successfully blocked 3 potential security breaches.',
      timestamp: '5 minutes ago',
      relevance: 0.98,
      icon: Shield
    },
    {
      id: '3',
      type: 'suggestion',
      title: 'Neural Recommendation',
      content: 'AI discovered 7 related research papers with 94% relevance correlation.',
      timestamp: '8 minutes ago',
      relevance: 0.85,
      icon: Lightbulb
    }
  ];

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    setIsProcessing(true);
    onUpdateState({
      ...aiState,
      isProcessing: true,
      currentTask: `Processing neural query: ${chatInput}`
    });

    setChatInput('');
    
    setTimeout(() => {
      setIsProcessing(false);
      onUpdateState({
        ...aiState,
        isProcessing: false,
        currentTask: 'Neural networks ready for next query',
        confidence: Math.random() * 0.3 + 0.7
      });
    }, 2000);
  };

  return (
    <motion.div
      className={`h-full flex flex-col backdrop-blur-xl ${
        isDarkMode 
          ? 'bg-gray-900/90 text-white' 
          : 'bg-white/90 text-gray-900'
      }`}
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
    >
      {/* Header with Glassmorphism */}
      <motion.div 
        className={`flex items-center justify-between p-6 border-b backdrop-blur-sm ${
          isDarkMode 
            ? 'border-gray-700/50 bg-gray-800/30' 
            : 'border-gray-200/50 bg-white/30'
        }`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex items-center space-x-4">
          <motion.div
            animate={{ 
              rotate: isProcessing ? 360 : 0,
              scale: isProcessing ? [1, 1.1, 1] : 1
            }}
            transition={{ 
              rotate: { duration: 1, repeat: isProcessing ? Infinity : 0 },
              scale: { duration: 0.5, repeat: isProcessing ? Infinity : 0 }
            }}
            className="p-3 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 rounded-2xl shadow-lg"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Bot className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Neural Assistant
            </h3>
            <motion.p 
              className="text-sm opacity-70"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {aiState.currentTask}
            </motion.p>
          </div>
        </div>
        <motion.button 
          onClick={onClose}
          className={`p-2 rounded-xl transition-all duration-200 ${
            isDarkMode 
              ? 'hover:bg-gray-700/50' 
              : 'hover:bg-gray-200/50'
          }`}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
        >
          <X className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* AI Status with 3D Visualization */}
      <motion.div 
        className={`p-6 bg-gradient-to-br backdrop-blur-sm border-b ${
          isDarkMode 
            ? 'from-blue-900/20 to-purple-900/20 border-gray-700/50' 
            : 'from-blue-50/80 to-purple-50/80 border-gray-200/50'
        }`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          >
            <Cpu className="w-5 h-5 text-blue-400" />
          </motion.div>
          <span className="font-semibold text-blue-400">Quantum Neural Engine</span>
        </div>
        
        <div className="relative">
          <div className={`flex-1 h-3 rounded-full overflow-hidden ${
            isDarkMode ? 'bg-gray-700/50' : 'bg-gray-200/50'
          }`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${aiState.confidence * 100}%` }}
              className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 relative overflow-hidden"
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </motion.div>
          </div>
          <motion.p 
            className="text-sm mt-2 font-medium"
            animate={{ color: isDarkMode ? '#60a5fa' : '#2563eb' }}
          >
            Neural Confidence: {Math.round(aiState.confidence * 100)}%
          </motion.p>
        </div>
      </motion.div>

      {/* AI Features with Card-based Interface */}
      <div className="p-6 border-b border-gray-700/50">
        <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span>Neural Modules</span>
        </h4>
        <div className="space-y-3">
          {aiFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 backdrop-blur-sm ${
                feature.active 
                  ? isDarkMode
                    ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-400/30' 
                    : 'bg-gradient-to-r from-blue-50/80 to-purple-50/80 border-blue-300/50'
                  : isDarkMode
                    ? 'bg-gray-800/30 border-gray-700/30 hover:border-gray-600/50'
                    : 'bg-gray-50/50 border-gray-200/50 hover:border-gray-300/50'
              }`}
              onClick={() => setActiveFeature(
                activeFeature === feature.id ? null : feature.id
              )}
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.2, rotateY: 15 }}
                  className={`p-2 rounded-xl ${
                    feature.active 
                      ? `bg-${feature.color}-500/20` 
                      : isDarkMode ? 'bg-gray-700/50' : 'bg-gray-200/50'
                  }`}
                >
                  <feature.icon className={`w-5 h-5 ${
                    feature.active 
                      ? `text-${feature.color}-400` 
                      : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{feature.title}</p>
                  <p className="text-sm opacity-70 truncate">{feature.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium">
                    {Math.round(feature.confidence * 100)}%
                  </span>
                  <motion.div
                    animate={{ rotate: activeFeature === feature.id ? 180 : 0 }}
                  >
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  </motion.div>
                </div>
              </div>
              
              <AnimatePresence>
                {activeFeature === feature.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 pt-4 border-t border-gray-700/30"
                  >
                    <p className="text-sm opacity-80">
                      Advanced neural controls and quantum parameters for {feature.title.toLowerCase()}.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Insights with Timeline Layout */}
      <div className="flex-1 overflow-y-auto p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          <span>Neural Insights</span>
        </h4>
        <div className="space-y-4">
          {recentInsights.map((insight, index) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
                isDarkMode 
                  ? 'bg-gray-800/30 border-gray-700/30 hover:border-gray-600/50' 
                  : 'bg-gray-50/50 border-gray-200/50 hover:border-gray-300/50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <motion.div 
                  className={`p-2 rounded-xl ${
                    isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100/80'
                  }`}
                  whileHover={{ scale: 1.1, rotateZ: 5 }}
                >
                  <insight.icon className="w-4 h-4 text-purple-400" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold mb-1">{insight.title}</p>
                  <p className="text-sm opacity-80 mb-3">{insight.content}</p>
                  <div className="flex items-center space-x-3 text-xs">
                    <span className="opacity-60">{insight.timestamp}</span>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3 opacity-60" />
                      <span className="opacity-60">
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

      {/* Chat Input with Advanced Styling */}
      <motion.div 
        className={`p-6 border-t backdrop-blur-sm ${
          isDarkMode 
            ? 'border-gray-700/50 bg-gray-800/30' 
            : 'border-gray-200/50 bg-white/30'
        }`}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Query the neural network..."
              className={`w-full px-4 py-3 rounded-2xl border backdrop-blur-sm text-sm focus:outline-none transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:border-blue-400/50' 
                  : 'bg-white/50 border-gray-200/50 text-gray-900 placeholder-gray-500 focus:border-blue-400/50'
              }`}
            />
            {isProcessing && (
              <motion.div
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Brain className="w-4 h-4 text-blue-400" />
              </motion.div>
            )}
          </div>
          <motion.button 
            className={`p-3 rounded-2xl transition-all duration-200 ${
              isDarkMode 
                ? 'hover:bg-gray-700/50 text-gray-400' 
                : 'hover:bg-gray-200/50 text-gray-600'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mic className="w-4 h-4" />
          </motion.button>
          <motion.button 
            onClick={handleSendMessage}
            disabled={!chatInput.trim() || isProcessing}
            className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 rounded-2xl transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Send className="w-4 h-4 text-white" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AIAssistant;