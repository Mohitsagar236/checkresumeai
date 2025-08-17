import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area 
} from 'recharts';
import { Zap, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { PremiumBadge } from './PremiumBadge';

// Types for real-time feedback visualization
interface RealtimeFeedback {
  id: string;
  message: string;
  type: 'suggestion' | 'warning' | 'improvement';
  timestamp: number;
}

interface ATSScoreData {
  timestamp: number;
  score: number;
}

interface RealTimeFeedbackProps {
  isActive: boolean;
  liveFeedback?: RealtimeFeedback[];
  atsScoreTrend?: ATSScoreData[];
  jobDescriptionSimilarity?: number;
  recentKeywordMatches?: Array<{
    keyword: string;
    matched: boolean;
    timestamp: number;
  }>;
}

/**
 * Visualize real-time feedback data from resume analysis
 */
export function RealTimeFeedbackViz({
  isActive = false,
  liveFeedback = [],
  atsScoreTrend = [],
  jobDescriptionSimilarity = 0,
  recentKeywordMatches = []
}: RealTimeFeedbackProps) {
  const [liveData, setLiveData] = useState({
    liveFeedback,
    atsScoreTrend,
    jobDescriptionSimilarity,
    recentKeywordMatches
  });

  // Update component when props change
  useEffect(() => {
    setLiveData({
      liveFeedback,
      atsScoreTrend,
      jobDescriptionSimilarity,
      recentKeywordMatches
    });
  }, [liveFeedback, atsScoreTrend, jobDescriptionSimilarity, recentKeywordMatches]);

  // Format the timestamp for the chart tooltip
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Show an inactive state if no real-time data is available
  if (!isActive) {
    return (
      <div className="relative p-6 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-800/50 text-center">
        <div className="absolute -top-3 left-4 px-2 bg-gray-50 dark:bg-slate-800">
          <PremiumBadge />
        </div>
        <div className="flex flex-col items-center justify-center gap-2 py-6 opacity-50">
          <Zap className="h-12 w-12 text-premium-500 dark:text-premium-400" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Real-Time Analysis</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
            Upgrade to premium to unlock real-time feedback and improvements as you edit your resume.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 real-time-feedback-container">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <h3 className="text-lg font-semibold text-gradient-premium dark:text-gradient-gold">
            Real-Time Analysis
          </h3>
        </div>
        <Badge variant="premium">Premium Feature</Badge>
      </div>

      {/* ATS Score Trend Chart */}
      <Card className="p-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-premium dark:shadow-premium-dark">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ATS Score Trend</h4>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={liveData.atsScoreTrend.slice(-15)} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatTimestamp} 
                tick={{ fontSize: 10 }} 
                stroke="#9CA3AF"
              />
              <YAxis 
                domain={[0, 100]} 
                tick={{ fontSize: 10 }} 
                stroke="#9CA3AF" 
              />
              <Tooltip 
                labelFormatter={formatTimestamp}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px',
                  borderColor: '#E5E7EB',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value) => [`${value}%`, 'ATS Score']}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#4F46E5" 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#scoreGradient)" 
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Live Feedback Messages */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Live Feedback</h4>
        <div className="space-y-2">
          <AnimatePresence>
            {liveData.liveFeedback.map((feedback) => {
              // Different styling based on feedback type
              const getTypeStyles = (type: string) => {
                switch(type) {
                  case 'warning':
                    return {
                      bgClass: 'bg-amber-50 dark:bg-amber-900/20',
                      borderClass: 'border-amber-200 dark:border-amber-800/30',
                      iconBgClass: 'bg-amber-100 dark:bg-amber-800/40',
                      iconColor: 'text-amber-600 dark:text-amber-400',
                      Icon: AlertCircle
                    };
                  case 'suggestion':
                    return {
                      bgClass: 'bg-blue-50 dark:bg-blue-900/20',
                      borderClass: 'border-blue-200 dark:border-blue-800/30',
                      iconBgClass: 'bg-blue-100 dark:bg-blue-800/40',
                      iconColor: 'text-blue-600 dark:text-blue-400',
                      Icon: Info
                    };
                  case 'improvement':
                    return {
                      bgClass: 'bg-green-50 dark:bg-green-900/20',
                      borderClass: 'border-green-200 dark:border-green-800/30',
                      iconBgClass: 'bg-green-100 dark:bg-green-800/40',
                      iconColor: 'text-green-600 dark:text-green-400',
                      Icon: CheckCircle
                    };
                  default:
                    return {
                      bgClass: 'bg-gray-50 dark:bg-gray-900/30',
                      borderClass: 'border-gray-200 dark:border-gray-800/30',
                      iconBgClass: 'bg-gray-100 dark:bg-gray-800/40',
                      iconColor: 'text-gray-600 dark:text-gray-400',
                      Icon: Info
                    };
                }
              };

              const { bgClass, borderClass, iconBgClass, iconColor, Icon } = getTypeStyles(feedback.type);
              
              return (
                <motion.div
                  key={feedback.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className={`p-4 rounded-lg border shadow-sm ${bgClass} ${borderClass} flex items-center gap-3`}
                >
                  <div className={`flex-shrink-0 ${iconBgClass} p-1.5 rounded-full`}>
                    <Icon className={`h-4 w-4 ${iconColor}`} />
                  </div>
                  <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                    {feedback.message}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {new Date(feedback.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {liveData.liveFeedback.length === 0 && (
            <div className="p-4 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
              Waiting for real-time feedback...
            </div>
          )}
        </div>
      </div>

      {/* Recently Matched/Missing Keywords */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent Keyword Analysis</h4>
        <div className="flex flex-wrap gap-2">
          {liveData.recentKeywordMatches.map((item, index) => (
            <motion.div
              key={`${item.keyword}-${index}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Badge
                variant={item.matched ? "success" : "error"}
                className="flex items-center gap-1.5 animate-pulse-once"
              >
                {item.keyword}
                {item.matched ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <AlertCircle className="h-3 w-3" />
                )}
              </Badge>
            </motion.div>
          ))}

          {liveData.recentKeywordMatches.length === 0 && (
            <div className="p-4 rounded-lg border border-dashed border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400 w-full">
              No keyword matches detected yet...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
