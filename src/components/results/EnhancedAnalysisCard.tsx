import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, TrendingUp, TrendingDown, Minus, Lightbulb, Target } from 'lucide-react';
import { AnimatedProgressBar } from '../ui/AnimatedProgressBar';

interface EnhancedAnalysisCardProps {
  title: string;
  score: number;
  details?: string;
  insights?: string[];
  strengths?: string[];
  improvements?: string[];
  icon?: React.ReactNode;
  colorScheme?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  delay?: number;
}

const colorSchemes = {
  blue: {
    gradient: 'from-blue-50 to-blue-100/50',
    border: 'border-blue-200/50',
    text: 'text-blue-800',
    iconColor: 'text-blue-500',
    badge: 'bg-blue-600',
    progress: 'blue'
  },
  green: {
    gradient: 'from-green-50 to-green-100/50',
    border: 'border-green-200/50',
    text: 'text-green-800',
    iconColor: 'text-green-500',
    badge: 'bg-green-600',
    progress: 'green'
  },
  purple: {
    gradient: 'from-purple-50 to-purple-100/50',
    border: 'border-purple-200/50',
    text: 'text-purple-800',
    iconColor: 'text-purple-500',
    badge: 'bg-purple-600',
    progress: 'purple'
  },
  orange: {
    gradient: 'from-orange-50 to-orange-100/50',
    border: 'border-orange-200/50',
    text: 'text-orange-800',
    iconColor: 'text-orange-500',
    badge: 'bg-orange-600',
    progress: 'orange'
  },
  red: {
    gradient: 'from-red-50 to-red-100/50',
    border: 'border-red-200/50',
    text: 'text-red-800',
    iconColor: 'text-red-500',
    badge: 'bg-red-600',
    progress: 'red'
  }
};

const getScoreLabel = (score: number): string => {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Needs Improvement';
};

const getScoreTrend = (score: number): React.ReactNode => {
  if (score >= 80) return <TrendingUp className="w-4 h-4 text-green-500" />;
  if (score >= 60) return <Minus className="w-4 h-4 text-yellow-500" />;
  return <TrendingDown className="w-4 h-4 text-red-500" />;
};

export function EnhancedAnalysisCard({
  title,
  score,
  details,
  insights = [],
  strengths = [],
  improvements = [],
  icon,
  colorScheme = 'blue',
  delay = 0
}: EnhancedAnalysisCardProps) {
  const colors = colorSchemes[colorScheme];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`bg-gradient-to-br ${colors.gradient} rounded-xl shadow-lg border ${colors.border} p-6 hover:shadow-xl transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className={`${colors.iconColor}`}>
            {icon || <Target className="w-6 h-6" />}
          </div>
          <div className="flex-1">
            <h3 className={`font-bold text-lg ${colors.text}`}>{title}</h3>
            {details && <p className="text-sm text-gray-600 mt-1">{details}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getScoreTrend(score)}
          <span className={`px-3 py-1 text-xs ${colors.badge} text-white rounded-full font-semibold`}>
            {getScoreLabel(score)}
          </span>
        </div>
      </div>

      {/* Score Display */}
      <div className="flex items-end gap-3 mb-4">
        <div className={`text-5xl font-bold ${colors.text}`}>{score}%</div>
        <div className="flex-1 pb-2">
          <AnimatedProgressBar 
            progress={score} 
            colorClass={colors.progress as any} 
            height={4}
          />
        </div>
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="mb-4 bg-white/50 rounded-lg p-4 border border-gray-200/50">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-500" />
            <h4 className="font-semibold text-sm text-gray-700">AI Insights</h4>
          </div>
          <ul className="space-y-2">
            {insights.map((insight, idx) => (
              <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Strengths and Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        {strengths.length > 0 && (
          <div className="bg-green-50/50 rounded-lg p-3 border border-green-200/30">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <h4 className="font-semibold text-sm text-green-800">Strengths</h4>
            </div>
            <ul className="space-y-1">
              {strengths.slice(0, 3).map((strength, idx) => (
                <li key={idx} className="text-xs text-green-700 flex items-start gap-1">
                  <span className="text-green-500">•</span>
                  <span className="flex-1">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Improvements */}
        {improvements.length > 0 && (
          <div className="bg-orange-50/50 rounded-lg p-3 border border-orange-200/30">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-orange-600" />
              <h4 className="font-semibold text-sm text-orange-800">Improvements</h4>
            </div>
            <ul className="space-y-1">
              {improvements.slice(0, 3).map((improvement, idx) => (
                <li key={idx} className="text-xs text-orange-700 flex items-start gap-1">
                  <span className="text-orange-500">•</span>
                  <span className="flex-1">{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}
