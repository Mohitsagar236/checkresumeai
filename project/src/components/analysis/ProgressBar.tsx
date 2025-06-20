import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, AlertCircle, TrendingUp, Clock, Loader2 } from 'lucide-react';
import '../../styles/progressBar.css';
import { cn } from '../../utils/cn';

interface Stage {
  id: string;
  name: string;
  progress: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

interface ProgressBarProps {
  progress: number;
  showPercentage?: boolean;
  className?: string;
  stages?: Stage[];
}

export function ProgressBar({ 
  progress, 
  showPercentage = true, 
  className = '',
  stages 
}: ProgressBarProps) {
  const getStageIcon = (status: Stage['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-400" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500 mr-2" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {stages ? (
        <div className="space-y-4">
          {stages.map((stage) => (
            <div key={stage.id} className="relative">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  {getStageIcon(stage.status)}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{stage.name}</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{stage.status === 'error' ? 'Failed' : `${stage.progress}%`}</span>
              </div>
              <div className="h-3 bg-gray-100 dark:bg-gray-800/80 rounded-full overflow-hidden shadow-inner-light dark:shadow-inner-dark backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                <motion.div
                  className={`h-full ${
                    stage.status === 'completed' 
                      ? 'bg-gradient-to-r from-green-400 to-green-500 shadow-lg shadow-green-500/20' 
                      : stage.status === 'processing' 
                        ? 'bg-gradient-brand shadow-lg shadow-brand-500/20 premium-shimmer' 
                        : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${stage.progress}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="progress-bar relative">
          <div className="h-4 bg-gray-100 dark:bg-gray-800/80 rounded-full overflow-hidden shadow-inner-light dark:shadow-inner-dark backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            <motion.div
              className="h-full bg-gradient-brand premium-shimmer shadow-lg shadow-brand-500/20"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ 
                duration: 0.8, 
                ease: [0.34, 1.56, 0.64, 1], // Custom spring-like easing
                delay: 0.1 
              }}
            />
            <motion.div 
              className="absolute top-0 left-0 h-full pointer-events-none"
              style={{ width: `${progress}%` }}
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              <div className="absolute right-0 top-0 h-4 w-1.5 cursor-indicator progress-indicator"></div>
            </motion.div>
          </div>
          {showPercentage && (
            <div className="mt-1.5 flex justify-between items-center">
              <div className="progress-label flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                <span className="text-xs text-gray-800 font-semibold">
                  {progress < 30 ? 'Needs Improvement' : progress < 70 ? 'Good Progress' : 'Excellent'}
                </span>
              </div>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{Math.round(progress)}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}