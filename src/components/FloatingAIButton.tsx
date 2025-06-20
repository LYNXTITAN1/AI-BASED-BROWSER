import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, Zap, Brain } from 'lucide-react';
import { AIState } from '../types';

interface FloatingAIButtonProps {
  onClick: () => void;
  isActive: boolean;
  aiState: AIState;
  isDarkMode: boolean;
}

const FloatingAIButton: React.FC<FloatingAIButtonProps> = ({
  onClick,
  isActive,
  aiState,
  isDarkMode
}) => {
  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        delay: 0.5 
      }}
    >
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            animate={{
              x: [0, Math.cos(i * 60 * Math.PI / 180) * 40],
              y: [0, Math.sin(i * 60 * Math.PI / 180) * 40],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </div>

      {/* Main Button */}
      <motion.button
        onClick={onClick}
        className={`relative w-16 h-16 rounded-2xl backdrop-blur-xl border shadow-2xl transition-all duration-300 overflow-hidden ${
          isActive
            ? isDarkMode
              ? 'bg-gradient-to-br from-blue-600 to-purple-700 border-blue-400/50'
              : 'bg-gradient-to-br from-blue-500 to-purple-600 border-blue-300/50'
            : isDarkMode
              ? 'bg-gray-800/80 border-gray-700/50 hover:bg-gray-700/80'
              : 'bg-white/80 border-gray-200/50 hover:bg-white/90'
        }`}
        whileHover={{ 
          scale: 1.1,
          rotateY: 15,
          boxShadow: isDarkMode 
            ? '0 20px 60px rgba(59, 130, 246, 0.4)' 
            : '0 20px 60px rgba(59, 130, 246, 0.3)'
        }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isActive 
            ? isDarkMode
              ? '0 20px 60px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.3)'
              : '0 20px 60px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.2)'
            : isDarkMode
              ? '0 8px 32px rgba(0, 0, 0, 0.3)'
              : '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Background Gradient Animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-500/20 to-cyan-400/20"
          animate={{
            background: [
              'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 50%, rgba(34, 211, 238, 0.2) 100%)',
              'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(34, 211, 238, 0.2) 50%, rgba(59, 130, 246, 0.2) 100%)',
              'linear-gradient(135deg, rgba(34, 211, 238, 0.2) 0%, rgba(59, 130, 246, 0.2) 50%, rgba(139, 92, 246, 0.2) 100%)'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Main Icon */}
        <motion.div
          className="relative z-10 flex items-center justify-center w-full h-full"
          animate={{ 
            rotate: isActive ? 360 : 0,
            scale: aiState.isProcessing ? [1, 1.2, 1] : 1
          }}
          transition={{ 
            rotate: { duration: 0.5 },
            scale: { duration: 0.5, repeat: aiState.isProcessing ? Infinity : 0 }
          }}
        >
          <Bot className={`w-8 h-8 ${
            isActive 
              ? 'text-white' 
              : isDarkMode 
                ? 'text-blue-400' 
                : 'text-blue-600'
          }`} />
        </motion.div>

        {/* Pulse Ring */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-blue-400/50"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Shimmer Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          animate={{ x: ['-100%', '100%'] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 1
          }}
        />
      </motion.button>

      {/* Status Indicator */}
      <motion.div
        className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 backdrop-blur-sm ${
          aiState.isActive
            ? isDarkMode
              ? 'bg-green-500 border-green-400'
              : 'bg-green-400 border-green-300'
            : isDarkMode
              ? 'bg-gray-600 border-gray-500'
              : 'bg-gray-400 border-gray-300'
        }`}
        animate={{
          scale: aiState.isActive ? [1, 1.2, 1] : 1,
          boxShadow: aiState.isActive 
            ? ['0 0 0 0 rgba(34, 197, 94, 0.7)', '0 0 0 10px rgba(34, 197, 94, 0)', '0 0 0 0 rgba(34, 197, 94, 0)']
            : '0 0 0 0 rgba(34, 197, 94, 0)'
        }}
        transition={{
          scale: { duration: 1, repeat: Infinity },
          boxShadow: { duration: 1.5, repeat: Infinity }
        }}
      >
        <motion.div
          className="w-full h-full rounded-full flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-3 h-3 text-white" />
        </motion.div>
      </motion.div>

      {/* Confidence Indicator */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className={`absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full backdrop-blur-xl border text-xs font-medium whitespace-nowrap ${
              isDarkMode 
                ? 'bg-gray-800/90 border-gray-700/50 text-white' 
                : 'bg-white/90 border-gray-200/50 text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-1">
              <Brain className="w-3 h-3 text-purple-400" />
              <span>{Math.round(aiState.confidence * 100)}% Neural</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tooltip */}
      <AnimatePresence>
        {!isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 10 }}
            className={`absolute right-20 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-xl backdrop-blur-xl border text-sm font-medium whitespace-nowrap ${
              isDarkMode 
                ? 'bg-gray-800/90 border-gray-700/50 text-white' 
                : 'bg-white/90 border-gray-200/50 text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-400" />
              <span>Neural Assistant</span>
            </div>
            {/* Arrow */}
            <div className={`absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-t-4 border-b-4 border-t-transparent border-b-transparent ${
              isDarkMode ? 'border-l-gray-800/90' : 'border-l-white/90'
            }`} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FloatingAIButton;