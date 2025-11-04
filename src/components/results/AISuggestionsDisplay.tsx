import { motion } from 'framer-motion';
import { Sparkles, Target, Lightbulb, ArrowRight, TrendingUp } from 'lucide-react';

interface Suggestion {
  section: string;
  priority: 'high' | 'medium' | 'low';
  current: string;
  suggested: string;
  reason: string;
  impact?: string;
}

interface AISuggestionsDisplayProps {
  suggestions: Suggestion[];
  title?: string;
}

const priorityColors = {
  high: {
    bg: 'bg-red-50',
    border: 'border-red-300',
    badge: 'bg-red-600',
    text: 'text-red-900'
  },
  medium: {
    bg: 'bg-orange-50',
    border: 'border-orange-300',
    badge: 'bg-orange-600',
    text: 'text-orange-900'
  },
  low: {
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    badge: 'bg-blue-600',
    text: 'text-blue-900'
  }
};

export function AISuggestionsDisplay({ 
  suggestions, 
  title = "AI-Powered Improvement Suggestions" 
}: AISuggestionsDisplayProps) {
  // Sort by priority
  const sortedSuggestions = [...suggestions].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-xl">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600">Personalized recommendations based on AI analysis</p>
        </div>
      </div>

      {/* Suggestions Grid */}
      <div className="grid gap-4">
        {sortedSuggestions.map((suggestion, idx) => {
          const colors = priorityColors[suggestion.priority];
          
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className={`${colors.bg} rounded-xl border ${colors.border} overflow-hidden hover:shadow-lg transition-all duration-300`}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200/50 bg-white/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-gray-900 capitalize">{suggestion.section}</span>
                  </div>
                  <span className={`${colors.badge} text-white px-3 py-1 rounded-full text-xs font-semibold uppercase`}>
                    {suggestion.priority} Priority
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Current vs Suggested */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Current */}
                  <div className="bg-white/60 rounded-lg p-4 border border-gray-200/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <span className="text-xs font-semibold text-gray-600 uppercase">Current</span>
                    </div>
                    <p className="text-sm text-gray-700">{suggestion.current}</p>
                  </div>

                  {/* Suggested */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-green-600"></div>
                      <span className="text-xs font-semibold text-green-700 uppercase">Suggested</span>
                    </div>
                    <p className="text-sm text-green-900 font-medium">{suggestion.suggested}</p>
                  </div>
                </div>

                {/* Reason */}
                <div className="bg-white/60 rounded-lg p-4 border border-gray-200/50">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Why This Matters</h4>
                      <p className="text-sm text-gray-700">{suggestion.reason}</p>
                    </div>
                  </div>
                </div>

                {/* Impact (if provided) */}
                {suggestion.impact && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200/50">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900 mb-1">Expected Impact</h4>
                        <p className="text-sm text-blue-800">{suggestion.impact}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="px-6 py-3 bg-white/40 border-t border-gray-200/50">
                <button className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2 transition-colors">
                  Apply This Suggestion
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: sortedSuggestions.length * 0.1 + 0.2 }}
        className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 border border-purple-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-gray-900 mb-1">Implementation Summary</h4>
            <p className="text-sm text-gray-700">
              Implementing these {suggestions.length} suggestions could significantly improve your resume's performance.
            </p>
          </div>
          <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2">
            Download Full Report
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
