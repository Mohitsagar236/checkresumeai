/**
 * Chart Component Optimization
 * Implements optimized chart components using lazy loading and memoization
 */
import React, { lazy, Suspense, memo } from 'react';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

// Types for chart data
interface ChartData {
  trendData: {
    timestamp: string;
    atsScore: number;
    readability: number;
    keywords: number;
  }[];
  radarData: {
    subject: string;
    score: number;
    fullMark: number;
  }[];
  sectionData: {
    name: string;
    completed: number;
    total: number;
  }[];
}

// Create optimized lazy loaded chart components
export const OptimizedCharts = {
  // Lazy load LineChart component
  LineChart: lazy(() => 
    import('recharts').then(({ LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer }) => ({
      default: memo(({ data, chartColors }: { 
        data: ChartData['trendData']; 
        chartColors: string[] 
      }) => (
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
      ))
    })),

  // Lazy load RadarChart component
  RadarChart: lazy(() => 
    import('recharts').then(({ 
      RadarChart, 
      PolarGrid, 
      PolarAngleAxis, 
      PolarRadiusAxis, 
      Radar, 
      ResponsiveContainer 
    }) => ({
      default: memo(({ 
        data, 
        chartColors 
      }: { 
        data: ChartData['radarData']; 
        chartColors: string[] 
      }) => (
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
      ))
    })),

  // Lazy load BarChart component
  BarChart: lazy(() => 
    import('recharts').then(({ 
      BarChart, 
      Bar, 
      XAxis, 
      YAxis, 
      CartesianGrid, 
      Tooltip, 
      ResponsiveContainer 
    }) => ({
      default: memo(({ 
        data, 
        chartColors 
      }: { 
        data: ChartData['sectionData']; 
        chartColors: string[] 
      }) => (
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
      ))
    }))
};

// Loading component for charts
export const ChartLoadingFallback = () => (
  <div className="h-full flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>
);

// Chart container with error boundary and suspense
export const ChartContainer = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<ChartLoadingFallback />}>
    {children}
  </Suspense>
);

// Create radar data from analytics data
export const createRadarData = (
  atsScore: number, 
  skillsMatchPercentage: number, 
  readabilityScore: number, 
  keywordDensity: number
): ChartData['radarData'] => [
  { subject: 'ATS Score', score: atsScore, fullMark: 100 },
  { subject: 'Skills Match', score: skillsMatchPercentage, fullMark: 100 },
  { subject: 'Readability', score: readabilityScore, fullMark: 100 },
  { subject: 'Keywords', score: keywordDensity * 10, fullMark: 100 },
  { subject: 'Structure', score: 85, fullMark: 100 },
  { subject: 'Content', score: 78, fullMark: 100 }
];

// Performance optimization utilities
export const chartPerformance = {
  // Default chart colors
  defaultColors: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'],
  
  // Utility to get icon for change indicators
  getChangeIcon: (value: number) => {
    if (value > 0) return 'positive';
    if (value < 0) return 'negative';
    return 'neutral';
  },
  
  // Utility to get color for change indicators
  getChangeColor: (value: number) => {
    if (value > 0) return 'text-green-600 dark:text-green-400';
    if (value < 0) return 'text-red-600 dark:text-red-400';
    return 'text-gray-600 dark:text-gray-400';
  }
};
