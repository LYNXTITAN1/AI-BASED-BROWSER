import React from 'react';
import { motion } from 'framer-motion';
import { Minimize2, Maximize2, X, Settings, Shield, Cpu } from 'lucide-react';

const BrowserHeader: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white flex items-center justify-between px-4 py-2 select-none">
      {/* Left: App Info */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sm">AI Browser Pro</span>
        </div>
        
        {/* AI Status Indicator */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded-full"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-green-300">AI Active</span>
        </motion.div>

        {/* Privacy Indicator */}
        <div className="flex items-center space-x-1 bg-blue-500/20 px-2 py-1 rounded-full">
          <Shield className="w-3 h-3 text-blue-300" />
          <span className="text-xs text-blue-300">Local AI</span>
        </div>
      </div>

      {/* Center: Performance Stats */}
      <div className="flex items-center space-x-4 text-xs text-gray-400">
        <span>Memory: 2.1GB</span>
        <span>•</span>
        <span>AI Latency: 125ms</span>
        <span>•</span>
        <span>Security: Active</span>
      </div>

      {/* Right: Window Controls */}
      <div className="flex items-center space-x-2">
        <button className="p-1 hover:bg-gray-700 rounded">
          <Settings className="w-4 h-4" />
        </button>
        <button className="p-1 hover:bg-gray-700 rounded">
          <Minimize2 className="w-4 h-4" />
        </button>
        <button className="p-1 hover:bg-gray-700 rounded">
          <Maximize2 className="w-4 h-4" />
        </button>
        <button className="p-1 hover:bg-red-600 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default BrowserHeader;