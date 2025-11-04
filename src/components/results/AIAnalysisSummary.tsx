import { motion } from 'framer-motion';
import { Brain, Zap, TrendingUp, Award, Target, CheckCircle } from 'lucide-react';
import { AnimatedProgressBar } from '../ui/AnimatedProgressBar';

interface AIAnalysisSummaryProps {
  overallScore: number;
  atsScore: number;
  formatScore: number;
  contentScore: number;
  skillsScore: number;
  aiInsights: string[];
  strengths: number;
  improvements: number;
}

export function AIAnalysisSummary({
  overallScore,
  atsScore,
  formatScore,
  contentScore,
  skillsScore,
  aiInsights,
  strengths,
  improvements
}: AIAnalysisSummaryProps) {
  const getOverallGrade = (score: number): { grade: string; color: string; label: string } => {
    if (score >= 90) return { grade: 'A+', color: 'text-green-600', label: 'Outstanding' };
    if (score >= 85) return { grade: 'A', color: 'text-green-600', label: 'Excellent' };
    if (score >= 80) return { grade: 'A-', color: 'text-green-500', label: 'Very Good' };
    if (score >= 75) return { grade: 'B+', color: 'text-blue-600', label: 'Good' };
    if (score >= 70) return { grade: 'B', color: 'text-blue-500', label: 'Above Average' };
    if (score >= 65) return { grade: 'B-', color: 'text-yellow-600', label: 'Average' };
    if (score >= 60) return { grade: 'C+', color: 'text-orange-500', label: 'Below Average' };
    return { grade: 'C', color: 'text-red-500', label: 'Needs Improvement' };
  };

  const gradeInfo = getOverallGrade(overallScore);

  return (
    <div className="space-y-6">
      {/* Hero Section - Overall Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Score Display */}
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">AI Analysis Complete</h2>
                  <p className="text-blue-100 text-sm md:text-base">Powered by Advanced AI</p>
                </div>
              </div>
              
              <div className="flex items-end gap-6">
                <div>
                  <div className={`text-7xl md:text-8xl font-black ${gradeInfo.color} bg-white px-6 py-2 rounded-xl shadow-lg`}>
                    {gradeInfo.grade}
                  </div>
                  <p className="text-white font-semibold mt-2 text-lg">{gradeInfo.label}</p>
                </div>
                <div className="text-left pb-4">
                  <div className="text-5xl md:text-6xl font-bold text-white">{overallScore}%</div>
                  <p className="text-blue-100 text-sm">Overall Score</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="text-white text-sm font-semibold">Strengths</span>
                </div>
                <div className="text-3xl font-bold text-white">{strengths}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-orange-300" />
                  <span className="text-white text-sm font-semibold">To Improve</span>
                </div>
                <div className="text-3xl font-bold text-white">{improvements}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Score Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-500" />
          Detailed Score Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ATS Compatibility */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700 text-sm">ATS Compatibility</span>
              <span className="font-bold text-blue-600">{atsScore}%</span>
            </div>
            <AnimatedProgressBar progress={atsScore} colorClass="blue" height={2} />
          </div>

          {/* Format Quality */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700 text-sm">Format Quality</span>
              <span className="font-bold text-green-600">{formatScore}%</span>
            </div>
            <AnimatedProgressBar progress={formatScore} colorClass="green" height={2} />
          </div>

          {/* Content Quality */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700 text-sm">Content Quality</span>
              <span className="font-bold text-purple-600">{contentScore}%</span>
            </div>
            <AnimatedProgressBar progress={contentScore} colorClass="purple" height={2} />
          </div>

          {/* Skills Match */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700 text-sm">Skills Match</span>
              <span className="font-bold text-amber-600">{skillsScore}%</span>
            </div>
            <AnimatedProgressBar progress={skillsScore} colorClass="amber" height={2} />
          </div>
        </div>
      </motion.div>

      {/* AI Insights */}
      {aiInsights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg border border-purple-200 p-6"
        >
          <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-600" />
            Key AI Insights
          </h3>
          <div className="grid gap-3">
            {aiInsights.map((insight, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="bg-white/60 rounded-lg p-4 border border-purple-200/50 flex items-start gap-3"
              >
                <div className="bg-purple-100 p-2 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-sm text-gray-700 flex-1">{insight}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
