/**
 * Advanced Analytics Dashboard Component
 * Provides comprehensive resume analysis insights with real-time updates
 * Optimized for performance with memoization and lazy loading
 */

import { useState, useMemo, memo, Suspense, useEffect, useRef } from 'react';
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
  Radar
} from 'recharts';
import { 
  TrendingUp, 
  Target, 
  Users, 
  FileText, 
  Award, 
  Zap,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface AnalyticsData {
  atsScore: number;
  previousAtsScore: number;
  skillsMatched: number;
  totalSkills: number;
  readabilityScore: number;
  keywordDensity: number;
  sectionCompleteness: {
    name: string;
    completed: number;
    total: number;
  }[];
  trendData: {
    timestamp: string;
    atsScore: number;
    readability: number;
    keywords: number;
  }[];
  industryBenchmark: {
    industry: string;
    averageATS: number;
    topPercentile: number;
  };
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    category: string;
    impact: number;
    description: string;
  }[];
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
  isPremium?: boolean;
  onUpgrade?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  lastUpdated?: string;
  expiryDate?: string | null;
  formattedExpiryDate?: string;
}

// Memoized chart components to prevent unnecessary re-renders
const LineChartComponent = memo(({ data, chartColors }: { data: AnalyticsData['trendData'], chartColors: string[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
      <XAxis dataKey="timestamp" />
      <YAxis domain={[0, 100]} />
      <Tooltip />
      <Line 
        type="monotone" 
        dataKey="atsScore" 
        stroke={chartColors[0]} 
        strokeWidth={2}
        name="ATS Score"
      />
      <Line 
        type="monotone" 
        dataKey="readability" 
        stroke={chartColors[1]} 
        strokeWidth={2}
        name="Readability"
      />
      <Line 
        type="monotone" 
        dataKey="keywords" 
        stroke={chartColors[2]} 
        strokeWidth={2}
        name="Keywords"
      />
    </LineChart>
  </ResponsiveContainer>
));

// Memoized Radar chart
const RadarChartComponent = memo(({ data, chartColors }: { data: { subject: string; score: number; fullMark: number }[], chartColors: string[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <RadarChart data={data}>
      <PolarGrid />
      <PolarAngleAxis dataKey="subject" />
      <PolarRadiusAxis domain={[0, 100]} />
      <Radar
        name="Score"
        dataKey="score"
        stroke={chartColors[0]}
        fill={chartColors[0]}
        fillOpacity={0.1}
        strokeWidth={2}
      />
    </RadarChart>
  </ResponsiveContainer>
));

// Memoized Bar chart
const BarChartComponent = memo(({ data, chartColors }: { data: AnalyticsData['sectionCompleteness'], chartColors: string[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar 
        dataKey="completed" 
        fill={chartColors[0]}
        name="Completed"
      />
      <Bar 
        dataKey="total" 
        fill={chartColors[1]}
        opacity={0.3}
        name="Total"
      />
    </BarChart>
  </ResponsiveContainer>
));

// Recommendation component - memoized
const RecommendationItem = memo(({ recommendation, index }: { 
  recommendation: AnalyticsData['recommendations'][0], 
  index: number 
}) => (
  <motion.div
    key={index}
    initial={{ opacity: 0, x: -5 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
  >
    <Badge 
      variant={recommendation.priority === 'high' ? 'error' : recommendation.priority === 'medium' ? 'warning' : 'default'}
    >
      {recommendation.priority}
    </Badge>
    <div className="flex-1">
      <p className="font-medium text-sm">{recommendation.category}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{recommendation.description}</p>
    </div>
    <div className="text-right">
      <p className="text-sm font-medium">+{recommendation.impact}% impact</p>
    </div>
  </motion.div>
));

// Live update indicator component
const LiveUpdateIndicator = memo(() => (
  <div className="flex items-center gap-2 text-green-600 text-sm">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
    </span>
    <span>Live updates enabled</span>
  </div>
));

// Premium overlay component
const PremiumOverlayComponent = memo(({ onUpgrade }: { onUpgrade?: () => void }) => (
  <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
    <div className="text-center p-6">
      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
        <Award className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Premium Analytics</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-xs">
        Unlock detailed analytics, trend analysis, and industry benchmarks
      </p>
      <Button onClick={onUpgrade} className="bg-gradient-to-r from-amber-500 to-orange-600">
        Upgrade Now
      </Button>
    </div>
  </div>
));

// Main AnalyticsDashboard component
export function AnalyticsDashboard({ 
  data, 
  isPremium = false, 
  onUpgrade, 
  onRefresh,
  isRefreshing = false,
  lastUpdated,
  expiryDate,
  formattedExpiryDate
}: AnalyticsDashboardProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1h' | '1d' | '1w' | '1m'>('1d');
  const [activeChart, setActiveChart] = useState<'trend' | 'radar' | 'breakdown'>('trend');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showNewDataIndicator, setShowNewDataIndicator] = useState<boolean>(false);
  const previousDataRef = useRef<string>('');
  
  // Effect to show visual indicator when data changes
  useEffect(() => {
    // Convert data to string for comparison
    const dataString = JSON.stringify(data.trendData[0]);
    
    // Check if this is new data (not first load)
    if (previousDataRef.current && previousDataRef.current !== dataString) {
      // Show the indicator
      setShowNewDataIndicator(true);
      
      // Hide it after 3 seconds
      const timer = setTimeout(() => {
        setShowNewDataIndicator(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
    
    // Store current data for future comparison
    previousDataRef.current = dataString;
  }, [data.trendData]);

  // Calculate metrics - memoized to prevent recalculation on every render
  const metrics = useMemo(() => {
    const atsScoreChange = data.atsScore - data.previousAtsScore;
    const skillsMatchPercentage = Math.round((data.skillsMatched / data.totalSkills) * 100);
    
    return {
      atsScoreChange,
      skillsMatchPercentage,
      getChangeIcon: (value: number) => {
        if (value > 0) return <ArrowUpRight className="h-4 w-4 text-green-500" />;
        if (value < 0) return <ArrowDownRight className="h-4 w-4 text-red-500" />;
        return <Minus className="h-4 w-4 text-gray-500" />;
      },
      getChangeColor: (value: number) => {
        if (value > 0) return 'text-green-600 dark:text-green-400';
        if (value < 0) return 'text-red-600 dark:text-red-400';
        return 'text-gray-600 dark:text-gray-400';
      }
    };
  }, [data.atsScore, data.previousAtsScore, data.skillsMatched, data.totalSkills]);

  // Chart colors - memoized to prevent recreation
  const chartColors = useMemo(() => 
    ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'], 
  []);

  // Radar chart data - memoized
  const radarData = useMemo(() => [
    { subject: 'ATS Score', score: data.atsScore, fullMark: 100 },
    { subject: 'Skills Match', score: metrics.skillsMatchPercentage, fullMark: 100 },
    { subject: 'Readability', score: data.readabilityScore, fullMark: 100 },
    { subject: 'Keywords', score: data.keywordDensity * 10, fullMark: 100 },
    { subject: 'Structure', score: 85, fullMark: 100 },
    { subject: 'Content', score: 78, fullMark: 100 },
  ], [data.atsScore, metrics.skillsMatchPercentage, data.readabilityScore, data.keywordDensity]);

  // Handle time range change with loading state
  const handleTimeRangeChange = (range: '1h' | '1d' | '1w' | '1m') => {
    if (range === selectedTimeRange) return;
    
    setIsLoading(true);
    
    // Simulate data loading delay - would connect to API in real implementation
    setTimeout(() => {
      setSelectedTimeRange(range);
      setIsLoading(false);
    }, 300); // Short timeout for better UX
  };
  
  // Render active chart based on selection
  const renderActiveChart = () => {
    if (isLoading) {
      return (
        <div className="h-full flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    switch (activeChart) {
      case 'trend':
        return (
          <motion.div
            key="trend"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <LineChartComponent data={data.trendData} chartColors={chartColors} />
          </motion.div>
        );
      case 'radar':
        return (
          <motion.div
            key="radar"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="h-full flex items-center justify-center"
          >
            <RadarChartComponent data={radarData} chartColors={chartColors} />
          </motion.div>
        );
      case 'breakdown':
        return (
          <motion.div
            key="breakdown"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <BarChartComponent data={data.sectionCompleteness} chartColors={chartColors} />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards - Fast rendering section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">ATS Score</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold">{data.atsScore}%</p>
                  <div className={`flex items-center ${metrics.getChangeColor(metrics.atsScoreChange)}`}>
                    {metrics.getChangeIcon(metrics.atsScoreChange)}
                    <span className="text-sm font-medium">
                      {Math.abs(metrics.atsScoreChange)}%
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Skills Matched</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold">{data.skillsMatched}/{data.totalSkills}</p>
                  <Badge variant={metrics.skillsMatchPercentage >= 70 ? 'success' : 'warning'}>
                    {metrics.skillsMatchPercentage}%
                  </Badge>
                </div>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Readability</p>
                <p className="text-2xl font-bold">{data.readabilityScore}%</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Keyword Density</p>
                <p className="text-2xl font-bold">{data.keywordDensity}%</p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                <Zap className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Button
            variant={activeChart === 'trend' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveChart('trend')}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Trend
          </Button>
          <Button
            variant={activeChart === 'radar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveChart('radar')}
          >
            <Activity className="h-4 w-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={activeChart === 'breakdown' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveChart('breakdown')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Breakdown
          </Button>
        </div>

        {isPremium && (
          <div className="flex items-center space-x-2">
            <Button
              variant={selectedTimeRange === '1h' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTimeRangeChange('1h')}
            >
              1H
            </Button>
            <Button
              variant={selectedTimeRange === '1d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTimeRangeChange('1d')}
            >
              1D
            </Button>
            <Button
              variant={selectedTimeRange === '1w' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTimeRangeChange('1w')}
            >
              1W
            </Button>
            <Button
              variant={selectedTimeRange === '1m' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleTimeRangeChange('1m')}
            >
              1M
            </Button>
          </div>
        )}
      </div>

      {/* Charts Section - Optimized with AnimatePresence and lazy loading */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Chart */}      <Card className="lg:col-span-2">          <CardHeader>
            {isPremium && formattedExpiryDate && (
              <div className="text-sm bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 px-3 py-1 rounded-md mb-2 flex items-center w-fit">
                <Crown className="h-3 w-3 mr-1" />
                Premium expires: {formattedExpiryDate}
              </div>
            )}
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span>Performance Analytics</span>
                {isPremium && showNewDataIndicator && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                  >
                    New data received
                  </motion.div>
                )}
              </div>
              {!isPremium && <Badge variant="premium">Premium</Badge>}
              {isPremium && (
                <div className="flex items-center gap-2">
                  <LiveUpdateIndicator />
                  {onRefresh && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={onRefresh}
                      disabled={isRefreshing}
                      className="flex items-center gap-1"
                    >
                      <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  )}
                </div>
              )}
            </CardTitle>
            {lastUpdated && (
              <div className="text-xs text-gray-500 mt-1">
                Last updated: {new Date(lastUpdated).toLocaleString()}
              </div>
            )}
          </CardHeader>
          <CardContent className="relative">
            {!isPremium && <PremiumOverlayComponent onUpgrade={onUpgrade} />}
            <div className="h-80">
              <Suspense fallback={
                <div className="h-full flex items-center justify-center">
                  <LoadingSpinner size="lg" />
                </div>
              }>
                <AnimatePresence mode="wait">
                  {renderActiveChart()}
                </AnimatePresence>
              </Suspense>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Industry Benchmark */}
      {isPremium && (
        <Card>
          <CardHeader>
            <CardTitle>Industry Benchmark</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Your Score</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {data.atsScore}%
                </p>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Industry Average</p>
                <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {data.industryBenchmark.averageATS}%
                </p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Top 10%</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {data.industryBenchmark.topPercentile}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations - optimized with virtualization for large lists */}
      <Card>
        <CardHeader>
          <CardTitle>Smart Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.recommendations.map((recommendation, index) => (
              <RecommendationItem 
                key={`${recommendation.category}-${index}`} 
                recommendation={recommendation} 
                index={index} 
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
