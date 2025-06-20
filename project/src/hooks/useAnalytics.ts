import { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';

interface AnalyticsData {
  dailyUploads: number[];
  weeklyScores: number[];
  popularJobRoles: { role: string; count: number }[];
  averageScore: number;
  totalUploads: number;
  dates: string[];
}

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData>({
    dailyUploads: [],
    weeklyScores: [],
    popularJobRoles: [],
    averageScore: 0,
    totalUploads: 0,
    dates: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Track data loading
    const startTime = performance.now();
    setIsLoading(true);
    
    // Use a more efficient approach to generate mock data
    const fetchAnalyticsData = async () => {
      try {
        // Simulate network delay - in a real app, this would be an API call
        // Using a shorter timeout for better UX
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Generate dates once and cache them
        const now = new Date();
        const dates = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          return format(date, 'MMM dd');
        }).reverse();
        
        // Generate data in a single pass where possible
        const dailyUploads = Array.from({ length: 7 }, () => 
          Math.floor(Math.random() * 50) + 10
        );
        
        const weeklyScores = Array.from({ length: 7 }, () => 
          Math.floor(Math.random() * 30) + 70
        );
        
        // Compute this once rather than sorting on each render
        const popularJobRoles = [
          { role: 'Software Engineer', count: Math.floor(Math.random() * 100) + 50 },
          { role: 'Data Scientist', count: Math.floor(Math.random() * 80) + 40 },
          { role: 'Product Manager', count: Math.floor(Math.random() * 60) + 30 },
          { role: 'UX Designer', count: Math.floor(Math.random() * 40) + 20 },
          { role: 'Marketing Manager', count: Math.floor(Math.random() * 30) + 10 },
        ].sort((a, b) => b.count - a.count);
        
        // Calculate these once
        const totalUploads = dailyUploads.reduce((acc, curr) => acc + curr, 0);
        const averageScore = Math.floor(
          weeklyScores.reduce((acc, curr) => acc + curr, 0) / weeklyScores.length
        );
        
        setData({
          dailyUploads,
          weeklyScores,
          popularJobRoles,
          averageScore,
          totalUploads,
          dates,
        });
        
        // Log performance
        const endTime = performance.now();
        console.log(`Analytics data generated in ${endTime - startTime}ms`);
      } catch (error) {
        console.error('Error generating analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalyticsData();
    
    // Reduced update frequency to improve performance
    // Only update data every 5 minutes instead of every minute
    const interval = setInterval(fetchAnalyticsData, 300000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Memoize derived data to prevent recalculation
  const derivedData = useMemo(() => {
    // Calculate any additional metrics here that depend on the base data
    const trendsPositive = data.weeklyScores[data.weeklyScores.length - 1] > 
                           data.weeklyScores[0];
    
    const topJobRole = data.popularJobRoles.length > 0 ? 
                      data.popularJobRoles[0].role : 
                      'None';
                      
    return {
      trendsPositive,
      topJobRole,
      // Additional metrics can be added here
    };
  }, [data.weeklyScores, data.popularJobRoles]);

  return {
    ...data,
    ...derivedData,
    isLoading
  };
}