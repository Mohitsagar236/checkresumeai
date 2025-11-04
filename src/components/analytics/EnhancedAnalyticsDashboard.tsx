/**
 * Enhanced Analytics Dashboard with Advanced AI Insights
 * Provides predictive analytics, job success scoring, and comprehensive visualizations
 */

import React, { useState, useMemo, memo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  Legend,
  ScatterChart,
  Scatter,
  ReferenceLine
} from 'recharts';
import {
  Brain,
  TrendingUp,
  Target,
  Award,
  Zap,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
  Star,
  Crown,
  RefreshCw,
  Eye,
  Download,
  Share2,
  Filter,
  Settings,
  Bookmark
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { generateMockAdvancedAnalyticsData, AdvancedAnalyticsData } from '../../utils/mockAdvancedAnalyticsData';

// Enhanced analytics data structures
interface PredictiveInsights {
  jobSuccessScore: number;
  confidenceLevel: number;
  interviewProbability: number;
  salaryPrediction: {
    min: number;
    max: number;
    median: number;
    currency: string;
    confidenceLevel: number;
  };
  careerAdvancement: {
    nextRole: string;
    timeframe: string;
    requiredSkills: string[];
    probability: number;
    actionPlan: string[];
  };
  marketDemand: {
    skillDemand: number;
    industryGrowth: number;
    competitionLevel: 'low' | 'medium' | 'high';
    trendingSkills: string[];
    emergingOpportunities: string[];
  };
  performanceMetrics: {
    applicationSuccessRate: number;
    interviewToOfferRatio: number;
    profileViewsGrowth: number;
    networkingEffectiveness: number;
  };
}

interface SkillAnalysis {
  name: string;
  category: string;
  currentLevel: number;
  marketDemand: number;
  improvementPotential: number;
  salaryImpact: number;
  learningTime: string;
  resources: string[];
  learningResources: {
    type: 'course' | 'certification' | 'project';
    title: string;
    provider: string;
    duration: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    url: string;
  }[];
}

interface CompetitiveAnalysis {
  industryRanking: number;
  percentile: number;
  strongerThan: number;
  competitiveAdvantages: string[];
  improvementAreas: string[];
  marketPositioning: 'entry-level' | 'mid-level' | 'senior' | 'executive';
}

interface AdvancedAnalyticsData {
  // Existing data
  atsScore: number;
  previousAtsScore: number;
  skillsMatched: number;
  totalSkills: number;
  readabilityScore: number;
  keywordDensity: number;
  
  // Enhanced data
  predictiveInsights: PredictiveInsights;
  skillAnalysis: SkillAnalysis[];
  competitiveAnalysis: CompetitiveAnalysis;
  industryBenchmarks: {
    industry: string;
    averageATS: number;
    topPercentile: number;
    yourRanking: number;
    totalProfiles: number;
    salaryBenchmarks: {
      entry: number;
      mid: number;
      senior: number;
      executive: number;
    };
  };
  
  // Trend and historical data
  performanceTrends: {
    timestamp: string;
    atsScore: number;
    readability: number;
    keywords: number;
    profileViews: number;
    applicationSuccess: number;
  }[];
    // AI-powered recommendations
  aiRecommendations: {
    id: string;
    category: 'content' | 'skills' | 'format' | 'strategy';
    priority: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    description: string;
    expectedImpact: number;
    impact: number;
    effort: 'easy' | 'moderate' | 'challenging';
    timeToImplement: string;
    estimatedTime: string;
    actionSteps: string[];
    relatedSkills?: string[];
  }[];
    // Goal tracking
  careerGoals: {
    targetRole: string;
    targetSalary: number;
    timeframe: string;
    progress: number;
    milestones: {
      title: string;
      completed: boolean;
      dueDate: string;
      priority: 'high' | 'medium' | 'low';
    }[];
  };
  
  // Timeline and progression data
  progressTimeline: {
    date: string;
    atsScore: number;
    skillsAdded: number;
    improvements: string[];
    milestone?: string;
  }[];
  
  // Heat map data for resume sections
  resumeSectionHeatMap: {
    section: string;
    attention: number;
    optimization: number;
    priority: 'high' | 'medium' | 'low';
  }[];
  
  // Performance metrics
  performanceMetrics: {
    applicationsSubmitted: number;
    interviewsReceived: number;
    responseRate: number;
    avgResponseTime: number;
    topPerformingKeywords: string[];
    improvementVelocity: number;
  };
}

interface EnhancedAnalyticsDashboardProps {
  data?: AdvancedAnalyticsData;
  isPremium?: boolean;
  onUpgrade?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  lastUpdated?: string;
  expiryDate?: string | null;
  formattedExpiryDate?: string;
}

// Enhanced chart colors with better accessibility
const CHART_COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  danger: '#EF4444',
  info: '#8B5CF6',
  success: '#059669',
  warning: '#D97706'
};

// Predictive Insights Card Component
const PredictiveInsightsCard = memo(({ insights, isPremium }: { 
  insights: PredictiveInsights; 
  isPremium: boolean;
}) => {
  if (!isPremium) {
    return (
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-600/10 backdrop-blur-sm" />
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-violet-600" />
            AI Predictive Insights
            <Crown className="h-4 w-4 text-yellow-500" />
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-center py-8">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-violet-100 rounded-full flex items-center justify-center">
                <Brain className="h-8 w-8 text-violet-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">Unlock AI Predictions</h3>
            <p className="text-gray-600 mb-4">
              Get job success probability, salary predictions, and career advancement insights
            </p>
            <Button className="bg-violet-600 hover:bg-violet-700">
              Upgrade to Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-violet-600" />
          AI Predictive Insights
          <Badge variant="success" className="ml-auto">Live</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Success Score */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Job Success Score</span>
              <Badge 
                variant={insights.jobSuccessScore >= 80 ? 'success' : 
                        insights.jobSuccessScore >= 60 ? 'warning' : 'error'}
              >
                {insights.jobSuccessScore}%
              </Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-violet-500 to-purple-600 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${insights.jobSuccessScore}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-gray-600">
              Confidence: {insights.confidenceLevel}% | Interview Probability: {insights.interviewProbability}%
            </p>
          </div>

          {/* Salary Prediction */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Predicted Salary Range</span>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {insights.salaryPrediction.currency}{insights.salaryPrediction.min.toLocaleString()} - {insights.salaryPrediction.currency}{insights.salaryPrediction.max.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                Median: {insights.salaryPrediction.currency}{insights.salaryPrediction.median.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Career Advancement */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Career Advancement Path</span>
            </div>
            <div className="bg-white rounded-lg p-4 border">
              <p className="font-medium text-blue-600">{insights.careerAdvancement.nextRole}</p>
              <p className="text-sm text-gray-600 mb-2">
                Expected timeframe: {insights.careerAdvancement.timeframe} 
                ({insights.careerAdvancement.probability}% probability)
              </p>
              <div className="flex flex-wrap gap-1">
                {insights.careerAdvancement.requiredSkills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// Enhanced Skills Analysis Component
const SkillsAnalysisCard = memo(({ skills, isPremium }: {
  skills: AdvancedAnalyticsData['skillAnalysis'];
  isPremium: boolean;
}) => {
  const [selectedSkill, setSelectedSkill] = useState<typeof skills[0] | null>(null);
  
  const chartData = skills.map(skill => ({
    name: skill.name,
    current: skill.currentLevel,
    demand: skill.marketDemand,
    impact: skill.salaryImpact
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-600" />
          Advanced Skills Analysis
          {isPremium && <Badge variant="success">Premium</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skills Radar Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData.slice(0, 6)}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" className="text-xs" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar
                  name="Current Level"
                  dataKey="current"
                  stroke={CHART_COLORS.primary}
                  fill={CHART_COLORS.primary}
                  fillOpacity={0.3}
                />
                <Radar
                  name="Market Demand"
                  dataKey="demand"
                  stroke={CHART_COLORS.secondary}
                  fill={CHART_COLORS.secondary}
                  fillOpacity={0.2}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Skills List with Details */}
          <div className="space-y-3">
            <h4 className="font-semibold">Skills Breakdown</h4>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => setSelectedSkill(skill)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{skill.name}</span>
                    <div className="flex gap-2">
                      <Badge variant={skill.currentLevel >= 80 ? 'success' : 'warning'}>
                        {skill.currentLevel}%
                      </Badge>
                      <Badge variant="outline">
                        +${skill.salaryImpact}k
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Market Demand: {skill.marketDemand}%</span>
                    <span>Learn in: {skill.learningTime}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Skill Detail Modal */}
        <AnimatePresence>
          {selectedSkill && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              onClick={() => setSelectedSkill(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-bold mb-4">{selectedSkill.name}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Current Level:</span>
                    <Badge>{selectedSkill.currentLevel}%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Market Demand:</span>
                    <Badge variant="secondary">{selectedSkill.marketDemand}%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Salary Impact:</span>
                    <Badge variant="success">+${selectedSkill.salaryImpact}k</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Learning Time:</span>
                    <span className="text-sm">{selectedSkill.learningTime}</span>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Learning Resources:</p>
                    <ul className="text-sm space-y-1">
                      {selectedSkill.resources.map((resource, index) => (
                        <li key={index} className="text-blue-600">• {resource}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <Button
                  className="w-full mt-4"
                  onClick={() => setSelectedSkill(null)}
                >
                  Close
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
});

// Main Enhanced Analytics Dashboard Component
export const EnhancedAnalyticsDashboard: React.FC<EnhancedAnalyticsDashboardProps> = ({
  data: providedData,
  isPremium = false,
  onUpgrade,
  onRefresh,
  isRefreshing = false,
  lastUpdated
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'skills' | 'predictions' | 'recommendations'>('overview');

  // Use provided data or generate mock data for demonstration
  const data = useMemo(() => {
    return providedData || generateMockAdvancedAnalyticsData();
  }, [providedData]);

  const viewOptions = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'skills', label: 'Skills Analysis', icon: Target },
    { id: 'predictions', label: 'AI Predictions', icon: Brain, premium: true },
    { id: 'recommendations', label: 'Smart Tips', icon: Lightbulb }
  ];

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">ATS Score</p>
                      <p className="text-2xl font-bold">{data.atsScore}%</p>
                    </div>
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Skills Match</p>
                      <p className="text-2xl font-bold">{data.skillsMatched}/{data.totalSkills}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Response Rate</p>
                      <p className="text-2xl font-bold">{data.performanceMetrics.responseRate}%</p>
                    </div>
                    <Activity className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Industry Rank</p>
                      <p className="text-2xl font-bold">#{data.industryBenchmarks.yourRanking}</p>
                    </div>
                    <Award className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Progress Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.progressTimeline}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="atsScore"
                        stroke={CHART_COLORS.primary}
                        fill={CHART_COLORS.primary}
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case 'skills':
        return (
          <SkillsAnalysisCard skills={data.skillAnalysis} isPremium={isPremium} />
        );
        
      case 'predictions':
        return (
          <PredictiveInsightsCard insights={data.predictiveInsights} isPremium={isPremium} />
        );
        
      case 'recommendations':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                AI-Powered Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.aiRecommendations.slice(0, 5).map((rec, index) => (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border rounded-lg hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{rec.title}</h4>
                      <div className="flex gap-2">
                        <Badge variant={rec.priority === 'critical' ? 'error' : 
                                      rec.priority === 'high' ? 'warning' : 'default'}>
                          {rec.priority}
                        </Badge>
                        <Badge variant="outline">+{rec.impact}%</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Effort: {rec.effort} • Time: {rec.estimatedTime}
                      </span>
                      <Button size="sm" variant="outline">
                        Apply Fix
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with View Selection */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Advanced Resume Analytics</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {lastUpdated && (
            <span className="text-xs text-gray-500 self-center">
              Updated: {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* View Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2 flex-wrap">
            {viewOptions.map((option) => (
              <Button
                key={option.id}
                variant={activeView === option.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  if (option.premium && !isPremium) {
                    onUpgrade?.();
                  } else {
                    setActiveView(option.id as any);
                  }
                }}
                className="flex items-center gap-2"
              >
                <option.icon className="h-4 w-4" />
                {option.label}
                {option.premium && !isPremium && (
                  <Crown className="h-3 w-3 text-yellow-500" />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active View Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderActiveView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default EnhancedAnalyticsDashboard;
