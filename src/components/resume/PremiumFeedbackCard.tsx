import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Star, TrendingUp, Target } from 'lucide-react';

interface FeedbackItem {
  id: string;
  type: 'success' | 'warning' | 'error';
  message: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
  impact?: string;
}

interface PremiumFeedbackCardProps {
  items: FeedbackItem[];
  title?: string;
  className?: string;
  showPriorityIndicator?: boolean;
  showImpactScore?: boolean;
}

const getStatusIcon = (type: 'success' | 'warning' | 'error') => {
  switch (type) {
    case 'success':
      return CheckCircle;
    case 'warning':
      return AlertTriangle;
    case 'error':
      return XCircle;
    default:
      return CheckCircle;
  }
};

const getStatusColors = (type: 'success' | 'warning' | 'error') => {
  switch (type) {
    case 'success':
      return {
        bg: 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20',
        border: 'border-l-emerald-500 dark:border-l-emerald-400',
        text: 'text-emerald-800 dark:text-emerald-300',
        icon: 'text-emerald-600 dark:text-emerald-400',
        shadow: 'shadow-emerald-100 dark:shadow-emerald-900/20',
        gradient: 'from-emerald-500 to-green-500'
      };
    case 'warning':
      return {
        bg: 'bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
        border: 'border-l-amber-500 dark:border-l-amber-400',
        text: 'text-amber-800 dark:text-amber-300',
        icon: 'text-amber-600 dark:text-amber-400',
        shadow: 'shadow-amber-100 dark:shadow-amber-900/20',
        gradient: 'from-amber-500 to-yellow-500'
      };
    case 'error':
      return {
        bg: 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20',
        border: 'border-l-red-500 dark:border-l-red-400',
        text: 'text-red-800 dark:text-red-300',
        icon: 'text-red-600 dark:text-red-400',
        shadow: 'shadow-red-100 dark:shadow-red-900/20',
        gradient: 'from-red-500 to-rose-500'
      };
    default:
      return {
        bg: 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20',
        border: 'border-l-gray-500 dark:border-l-gray-400',
        text: 'text-gray-800 dark:text-gray-300',
        icon: 'text-gray-600 dark:text-gray-400',
        shadow: 'shadow-gray-100 dark:shadow-gray-900/20',
        gradient: 'from-gray-500 to-slate-500'
      };
  }
};

const getPriorityColors = (priority: 'high' | 'medium' | 'low') => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
  }
};

export const PremiumFeedbackCard: React.FC<PremiumFeedbackCardProps> = ({
  items,
  title = "Resume Analysis Feedback",
  className = "",
  showPriorityIndicator = true,
  showImpactScore = true
}) => {
  // Calculate overall score based on feedback items
  const calculateOverallScore = () => {
    if (items.length === 0) return 0;
    
    const scores = items.map(item => {
      switch (item.type) {
        case 'success': return 100;
        case 'warning': return 70;
        case 'error': return 30;
        default: return 50;
      }
    });
    
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  const overallScore = calculateOverallScore();
  const scoreColor = overallScore >= 80 ? 'text-green-600' : overallScore >= 60 ? 'text-yellow-600' : 'text-red-600';

  return (    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-luxury-xl border border-gray-100 dark:border-slate-700 overflow-hidden w-full ${className}`}
    >      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center min-w-0">
            <Star className="w-6 h-6 text-yellow-300 mr-3 flex-shrink-0" fill="currentColor" />
            <h3 className="text-lg sm:text-xl font-luxury text-white truncate">{title}</h3>
          </div>
          {showImpactScore && (
            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full">
              <TrendingUp className="w-4 h-4 text-white mr-2" />
              <span className="text-white font-premium-display text-sm whitespace-nowrap">
                Score: <span className={`font-bold ${scoreColor}`}>{overallScore}%</span>
              </span>
            </div>
          )}
        </div>
      </div>      {/* Content */}
      <div className="p-4 sm:p-6 space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-luxury">
              No feedback items available
            </p>
          </div>
        ) : (
          items.map((item, index) => {
            const colors = getStatusColors(item.type);
            const Icon = getStatusIcon(item.type);
            
            return (              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}                className={`
                  relative p-4 sm:p-6 rounded-lg border-l-4 ${colors.border} ${colors.bg} 
                  shadow-luxury hover:shadow-luxury-lg transition-all duration-300
                  transform hover:-translate-y-1 premium-glass overflow-hidden
                  min-h-[120px] sm:min-h-[140px] w-full max-w-full
                  h-auto
                `}
              >
                {/* Priority Badge */}
                {showPriorityIndicator && item.priority && (
                  <div className="absolute top-2 right-2 z-10">
                    <span className={`
                      inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${getPriorityColors(item.priority)}
                    `}>
                      {item.priority}
                    </span>
                  </div>
                )}                {/* Main Content */}
                <div className="flex items-center gap-4 sm:gap-6 pr-12 sm:pr-16 h-full">
                  <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r ${colors.gradient} 
                    flex items-center justify-center shadow-lg`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>                  <div className="flex-1 min-w-0 flex flex-col justify-center h-full">
                    <div className="mb-2">
                      <p className={`font-luxury ${colors.text} leading-tight break-words text-base sm:text-lg font-bold mb-2`}>
                        {item.message}
                      </p>
                      
                      {item.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed break-words mb-3 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                    
                    {item.impact && (
                      <div className="mt-auto">
                        <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                          <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                          <span className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-300 break-words line-clamp-1">
                            Impact: {item.impact}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Decorative Shimmer Effect */}
                <div className="premium-shimmer absolute inset-0 rounded-lg pointer-events-none"></div>
              </motion.div>
            );
          })
        )}
        
        {/* Summary Footer */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-600"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">{items.length}</span> feedback items analyzed
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    {items.filter(item => item.type === 'success').length} positive
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    {items.filter(item => item.type === 'warning').length} warnings
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    {items.filter(item => item.type === 'error').length} critical
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PremiumFeedbackCard;
