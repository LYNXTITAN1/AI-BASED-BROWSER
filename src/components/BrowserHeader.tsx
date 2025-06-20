import React from 'react';
import { motion } from 'framer-motion';
import { 
  Minimize2, 
  Maximize2, 
  X, 
  Settings, 
  Shield, 
  Cpu,
  Moon,
  Sun,
  Zap
} from 'lucide-react';

interface BrowserHeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const BrowserHeader: React.FC<BrowserHeaderProps> = ({ isDarkMode, onToggleTheme }) => {
  return (
    <motion.div
      className={`backdrop-blur-xl border-b select-none ${
        isDarkMode 
          ? 'bg-gray-900/80 text-white border-gray-700/50' 
          : 'bg-white/80 text-gray-900 border-gray-200/50'
      }`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: App Info with 3D Effect */}
        <div className="flex items-center space-x-4">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <motion.div
              className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg"
              whileHover={{ 
                rotateY: 15,
                rotateX: 15,
                scale: 1.1
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Cpu className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Browser Pro
              </h1>
              <p className="text-xs opacity-70">2025 Edition</p>
            </div>
          </motion.div>
          
          {/* AI Status Indicators with Kinetic Typography */}
          <div className="flex items-center space-x-3">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full backdrop-blur-sm ${
                isDarkMode 
                  ? 'bg-green-500/20 border border-green-400/30' 
                  : 'bg-green-100/80 border border-green-300/50'
              }`}
            >
              <motion.div 
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs font-medium text-green-400">AI Active</span>
            </motion.div>

            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full backdrop-blur-sm ${
                isDarkMode 
                  ? 'bg-blue-500/20 border border-blue-400/30' 
                  : 'bg-blue-100/80 border border-blue-300/50'
              }`}
            >
              <Shield className="w-3 h-3 text-blue-400" />
              <span className="text-xs font-medium text-blue-400">Quantum Secure</span>
            </motion.div>
          </div>
        </div>

        {/* Center: Performance Stats with Metal Shader Effect */}
        <motion.div 
          className={`flex items-center space-x-6 text-xs px-4 py-2 rounded-full backdrop-blur-sm ${
            isDarkMode 
              ? 'bg-gray-800/50 border border-gray-700/50' 
              : 'bg-gray-100/50 border border-gray-300/50'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-1">
            <Zap className="w-3 h-3 text-yellow-400" />
            <span className="opacity-80">Memory: 2.1GB</span>
          </div>
          <span className="opacity-50">•</span>
          <div className="flex items-center space-x-1">
            <motion.div
              className="w-2 h-2 bg-blue-400 rounded-full"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="opacity-80">AI Latency: 125ms</span>
          </div>
          <span className="opacity-50">•</span>
          <span className="text-green-400 font-medium">Security: Active</span>
        </motion.div>

        {/* Right: Window Controls with Hover Effects */}
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.1, rotateZ: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700/50' 
                : 'hover:bg-gray-200/50'
            }`}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-yellow-400" />
            ) : (
              <Moon className="w-4 h-4 text-blue-600" />
            )}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1, rotateZ: 5 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700/50' 
                : 'hover:bg-gray-200/50'
            }`}
          >
            <Settings className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700/50' 
                : 'hover:bg-gray-200/50'
            }`}
          >
            <Minimize2 className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`p-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700/50' 
                : 'hover:bg-gray-200/50'
            }`}
          >
            <Maximize2 className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'rgb(239 68 68)' }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg transition-colors hover:text-white"
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default BrowserHeader;