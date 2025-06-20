import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  X, 
  Search, 
  Bot, 
  Sparkles, 
  Zap,
  Globe,
  Shield
} from 'lucide-react';

interface OnboardingTooltipsProps {
  onComplete: () => void;
  isDarkMode: boolean;
}

const OnboardingTooltips: React.FC<OnboardingTooltipsProps> = ({
  onComplete,
  isDarkMode
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'search',
      title: 'Intelligent Omnibox',
      description: 'Search with AI, visit any domain worldwide, or enter URLs. Our neural network provides smart suggestions as you type.',
      icon: Search,
      position: { top: '120px', left: '50%', transform: 'translateX(-50%)' },
      arrow: 'top'
    },
    {
      id: 'ai-button',
      title: 'Neural Assistant',
      description: 'Your AI companion for content analysis, research, and intelligent browsing. Click to access advanced AI features.',
      icon: Bot,
      position: { bottom: '100px', right: '100px' },
      arrow: 'bottom'
    },
    {
      id: 'features',
      title: 'Quantum Features',
      description: 'Experience 2025 web technologies: glassmorphism UI, 3D interactions, and real-time AI analysis.',
      icon: Sparkles,
      position: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
      arrow: 'center'
    }
  ];

  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 pointer-events-none"
      >
        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Spotlight Effect */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${
              currentStepData.position.left || '50%'
            } ${
              currentStepData.position.top || '50%'
            }, transparent 100px, rgba(0,0,0,0.3) 200px)`
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Tooltip */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          className={`absolute pointer-events-auto max-w-sm backdrop-blur-xl rounded-2xl border shadow-2xl p-6 ${
            isDarkMode 
              ? 'bg-gray-900/90 border-gray-700/50 text-white' 
              : 'bg-white/90 border-gray-200/50 text-gray-900'
          }`}
          style={currentStepData.position}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <motion.div
                className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl"
                whileHover={{ scale: 1.1, rotateY: 15 }}
              >
                <currentStepData.icon className="w-5 h-5 text-white" />
              </motion.div>
              <h3 className="font-bold text-lg">{currentStepData.title}</h3>
            </div>
            <button
              onClick={handleSkip}
              className={`p-1 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700/50 text-gray-400' 
                  : 'hover:bg-gray-200/50 text-gray-600'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <p className="text-sm opacity-80 mb-6 leading-relaxed">
            {currentStepData.description}
          </p>

          {/* Progress */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep 
                      ? 'bg-blue-400' 
                      : isDarkMode 
                        ? 'bg-gray-600' 
                        : 'bg-gray-300'
                  }`}
                  animate={{
                    scale: index === currentStep ? 1.2 : 1
                  }}
                />
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleSkip}
                className={`text-sm transition-colors ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-gray-300' 
                    : 'text-gray-600 hover:text-gray-700'
                }`}
              >
                Skip Tour
              </button>
              <motion.button
                onClick={handleNext}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Arrow */}
          {currentStepData.arrow === 'top' && (
            <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent ${
              isDarkMode ? 'border-b-gray-900/90' : 'border-b-white/90'
            }`} />
          )}
          {currentStepData.arrow === 'bottom' && (
            <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent ${
              isDarkMode ? 'border-t-gray-900/90' : 'border-t-white/90'
            }`} />
          )}
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0, 1, 0],
                scale: [0, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingTooltips;