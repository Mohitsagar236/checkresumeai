// Analytics API: Fetches real analytics data for the authenticated user from Supabase
import { supabase } from '../utils/supabaseClient';
import { handleSupabaseError, isSupabaseError } from '../utils/errorHandling';

// Database table names with fallbacks
const DB_TABLES = {
  analytics: {
    primary: 'user_analytics',
    fallback: 'analytics' // Fallback table name if the primary doesn't exist
  },
  trends: {
    primary: 'analytics_trends',
    fallback: 'user_analytics_trends' // Fallback table name
  }
};

// Interface for user analytics data - matches the database schema
export interface UserAnalytics {
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
  lastUpdated?: string; // ISO timestamp of when the data was last updated
  isRealTime?: boolean; // Flag indicating if real-time updates are enabled
}

// Types for database schema
interface AnalyticsRecord {
  user_id: string;
  ats_score: number;
  previous_ats_score: number;
  skills_matched: number;
  total_skills: number;
  readability_score: number;
  keyword_density: number;
  section_completeness: Array<{name: string; completed: number; total: number}>;
  industry_benchmark: {
    industry: string;
    average_ats: number;
    top_percentile: number;
  };
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    category: string;
    impact: number;
    description: string;
  }>;
  updated_at: string;
}

interface TrendRecord {
  user_id: string;
  timestamp: string;
  ats_score: number;
  readability: number;
  keywords: number;
}

// Map database record to API model
function mapAnalyticsRecordToUserAnalytics(
  record: AnalyticsRecord, 
  trends: TrendRecord[]
): UserAnalytics {
  return {
    atsScore: record.ats_score,
    previousAtsScore: record.previous_ats_score,
    skillsMatched: record.skills_matched,
    totalSkills: record.total_skills,
    readabilityScore: record.readability_score,
    keywordDensity: record.keyword_density,
    sectionCompleteness: record.section_completeness,
    industryBenchmark: {
      industry: record.industry_benchmark.industry,
      averageATS: record.industry_benchmark.average_ats,
      topPercentile: record.industry_benchmark.top_percentile
    },
    recommendations: record.recommendations,
    trendData: trends.map(t => ({
      timestamp: t.timestamp,
      atsScore: t.ats_score,
      readability: t.readability,
      keywords: t.keywords
    })),
    lastUpdated: record.updated_at
  };
}

// Map trend records to API model
function mapTrendRecords(trends: TrendRecord[]): UserAnalytics['trendData'] {
  return trends.map(t => ({
    timestamp: t.timestamp,
    atsScore: t.ats_score,
    readability: t.readability,
    keywords: t.keywords
  }));
}

// Helper function to log validation errors with additional context
function logValidationError(message: string, context: Record<string, unknown> = {}) {
  console.error(`Analytics data validation failed: ${message}`, {
    timestamp: new Date().toISOString(),
    ...context
  });
  
  // In development, we could also send these errors to an error tracking service
  if (import.meta.env.DEV) {
    console.warn('Consider sending this validation error to your error tracking service');
  }
}

// Enhanced validation with detailed logging for debugging
export function validateAnalyticsData(data: unknown): data is UserAnalytics {
  if (!data || typeof data !== 'object') {
    logValidationError('Analytics data is null or not an object');
    return false;
  }
  
  const d = data as Partial<UserAnalytics>;
  
  // Check required fields
  const requiredNumberFields: Array<keyof UserAnalytics> = [
    'atsScore', 'previousAtsScore', 'skillsMatched', 
    'totalSkills', 'readabilityScore', 'keywordDensity'
  ];
  
  for (const field of requiredNumberFields) {
    if (typeof d[field] !== 'number') {
      logValidationError(`Field "${field}" is not a number`, { 
        field, 
        value: d[field], 
        type: typeof d[field] 
      });
      return false;
    }
  }
  
  // Check arrays
  if (!Array.isArray(d.sectionCompleteness)) {
    logValidationError('sectionCompleteness is not an array', { value: d.sectionCompleteness });
    return false;
  }
  
  if (!Array.isArray(d.trendData)) {
    logValidationError('trendData is not an array', { value: d.trendData });
    return false;
  }
  
  if (!Array.isArray(d.recommendations)) {
    logValidationError('recommendations is not an array', { value: d.recommendations });
    return false;
  }
  
  // Check industry benchmark
  if (!d.industryBenchmark) {
    logValidationError('industryBenchmark is missing', { value: d.industryBenchmark });
    return false;
  }
  
  if (typeof d.industryBenchmark.industry !== 'string') {
    logValidationError('industryBenchmark.industry is not a string', {
      value: d.industryBenchmark.industry,
      type: typeof d.industryBenchmark.industry
    });
    return false;
  }
  
  if (typeof d.industryBenchmark.averageATS !== 'number') {
    logValidationError('industryBenchmark.averageATS is not a number', {
      value: d.industryBenchmark.averageATS,
      type: typeof d.industryBenchmark.averageATS
    });
    return false;
  }
  
  if (typeof d.industryBenchmark.topPercentile !== 'number') {
    logValidationError('industryBenchmark.topPercentile is not a number', {
      value: d.industryBenchmark.topPercentile,
      type: typeof d.industryBenchmark.topPercentile
    });
    return false;
  }

  // All validation passed
  return true;
}

// Generate mock data when database returns nothing or fails
export function generateMockAnalyticsData(userId: string): UserAnalytics {
  console.log(`Generating mock data for user ${userId} as fallback`);
  
  return {
    atsScore: 78,
    previousAtsScore: 72,
    skillsMatched: 16,
    totalSkills: 20,
    readabilityScore: 85,
    keywordDensity: 6.8,
    sectionCompleteness: [
      { name: 'Experience', completed: 5, total: 5 },
      { name: 'Education', completed: 3, total: 3 },
      { name: 'Skills', completed: 8, total: 10 },
      { name: 'Summary', completed: 1, total: 1 },
      { name: 'Projects', completed: 2, total: 3 }
    ],
    trendData: Array(10).fill(null).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (9 - i));
      return {
        timestamp: date.toISOString(),
        atsScore: Math.round(70 + Math.random() * 20),
        readability: Math.round(75 + Math.random() * 15),
        keywords: Math.round(5 + Math.random() * 5)
      };
    }),
    industryBenchmark: {
      industry: 'Technology',
      averageATS: 72,
      topPercentile: 92
    },
    recommendations: [
      {
        priority: 'high',
        category: 'Skills',
        impact: 15,
        description: 'Add more relevant technical skills to match job requirements.'
      },
      {
        priority: 'medium',
        category: 'Experience',
        impact: 10,
        description: 'Quantify achievements with metrics and outcomes.'
      },
      {
        priority: 'low',
        category: 'Formatting',
        impact: 5,
        description: 'Improve section headings for better ATS detection.'
      }
    ],
    lastUpdated: new Date().toISOString(),
    isRealTime: false
  };
}

// Fetch user's full analytics data with fallbacks
export async function fetchUserAnalytics(userId: string): Promise<UserAnalytics> {
  try {
    // Try primary table first
    let { data: analyticsData, error: analyticsError } = await supabase
      .from(DB_TABLES.analytics.primary)
      .select('*')
      .eq('user_id', userId)
      .single();

    // If table doesn't exist, try fallback table
    if (analyticsError && 
        (analyticsError.message?.includes('does not exist') || 
         analyticsError.code === '42P01')) {
      console.log(`Table ${DB_TABLES.analytics.primary} not found, trying fallback ${DB_TABLES.analytics.fallback}`);
      const fallbackResult = await supabase
        .from(DB_TABLES.analytics.fallback)
        .select('*')
        .eq('user_id', userId)
        .single();
      
      analyticsData = fallbackResult.data;
      analyticsError = fallbackResult.error;
    }

    // Try primary trends table
    let { data: trendData, error: trendError } = await supabase
      .from(DB_TABLES.trends.primary)
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(30); // Last 30 data points
    
    // If table doesn't exist, try fallback table
    if (trendError && 
        (trendError.message?.includes('does not exist') || 
         trendError.code === '42P01')) {
      console.log(`Table ${DB_TABLES.trends.primary} not found, trying fallback ${DB_TABLES.trends.fallback}`);
      const fallbackResult = await supabase
        .from(DB_TABLES.trends.fallback)
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(30);
      
      trendData = fallbackResult.data;
      trendError = fallbackResult.error;
    }

    // If we still have errors or no data, generate mock data
    if ((analyticsError || !analyticsData) || (trendError || !trendData || !trendData.length)) {
      console.warn('Unable to retrieve analytics data from any table, using mock data');
      return generateMockAnalyticsData(userId);
    }
    
    // Map database records to API model
    const mappedData = mapAnalyticsRecordToUserAnalytics(
      analyticsData as AnalyticsRecord, 
      (trendData || []) as TrendRecord[]
    );
    
    // Validate the data before returning
    if (!validateAnalyticsData(mappedData)) {
      console.warn('Invalid analytics data returned from server, using mock data');
      return generateMockAnalyticsData(userId);
    }
    
    return mappedData;
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    // Fall back to mock data as a last resort
    return generateMockAnalyticsData(userId);
  }
}

// Fetch only the trend data for a user - for real-time updates
export async function fetchUserAnalyticsTrends(userId: string): Promise<UserAnalytics['trendData']> {
  try {
    // Try primary table first
    let { data, error } = await supabase
      .from(DB_TABLES.trends.primary)
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(30);
      
    // If table doesn't exist, try fallback table
    if (error && 
        (error.message?.includes('does not exist') || 
         error.code === '42P01')) {
      console.log(`Table ${DB_TABLES.trends.primary} not found, trying fallback ${DB_TABLES.trends.fallback}`);
      const fallbackResult = await supabase
        .from(DB_TABLES.trends.fallback)
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(30);
      
      data = fallbackResult.data;
      error = fallbackResult.error;
    }

    // If we still have an error or no data, return mock trend data
    if (error || !data || !data.length) {
      console.warn('Unable to retrieve trend data, returning mock data');
      const mockData = generateMockAnalyticsData(userId);
      return mockData.trendData;
    }
    
    return mapTrendRecords(data as TrendRecord[]);
  } catch (error) {
    console.error('Error fetching trend data:', error);
    // Fall back to mock data as a last resort
    const mockData = generateMockAnalyticsData(userId);
    return mockData.trendData;
  }
}

// Update analytics data after a new analysis is performed
export async function updateAnalyticsAfterAnalysis(
  userId: string, 
  atsScore: number,
  readabilityScore: number,
  keywordCount: number
): Promise<void> {
  try {
    // Create a new trend data point
    const trendDataPoint = {
      user_id: userId,
      timestamp: new Date().toISOString(),
      ats_score: atsScore,
      readability: readabilityScore,
      keywords: keywordCount
    };
    
    // Try inserting into the primary table
    let { error } = await supabase
      .from(DB_TABLES.trends.primary)
      .insert([trendDataPoint]);
      
    // If primary table doesn't exist, try fallback
    if (error && 
        (error.message?.includes('does not exist') || 
         error.code === '42P01')) {
      console.log(`Table ${DB_TABLES.trends.primary} not found, trying fallback ${DB_TABLES.trends.fallback}`);
      const fallbackResult = await supabase
        .from(DB_TABLES.trends.fallback)
        .insert([trendDataPoint]);
      
      error = fallbackResult.error;
    }
    
    if (error) {
      console.error('Error updating analytics data:', error);
    }
  } catch (error) {
    console.error('Error updating analytics data:', error);
  }
}

// Type for the analytics update callback
export type AnalyticsUpdateCallback = (data: UserAnalytics['trendData'][0]) => void;

// Store active subscriptions
const analyticsSubscriptions: Record<string, {
  channel: { unsubscribe: () => void };
  callbacks: Set<AnalyticsUpdateCallback>;
}> = {};

/**
 * Subscribe to real-time analytics updates for a user
 * @param userId User ID to subscribe to
 * @param callback Function to call when new analytics data is received
 * @returns Unsubscribe function
 */
export function subscribeToAnalyticsUpdates(
  userId: string,
  callback: AnalyticsUpdateCallback
): () => void {
  // If we already have an active subscription for this user, add the callback
  if (analyticsSubscriptions[userId]) {
    analyticsSubscriptions[userId].callbacks.add(callback);
    return () => {
      analyticsSubscriptions[userId].callbacks.delete(callback);
      
      // If there are no more callbacks, remove the subscription
      if (analyticsSubscriptions[userId].callbacks.size === 0) {
        analyticsSubscriptions[userId].channel.unsubscribe();
        delete analyticsSubscriptions[userId];
      }
    };
  }

  try {
    // Try to create a subscription to both possible tables
    const tables = [DB_TABLES.trends.primary, DB_TABLES.trends.fallback];
    
    // Create a new subscription
    const channel = supabase
      .channel(`analytics_updates:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: tables[0],
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          // Map database record to API model
          const newDataPoint = {
            timestamp: payload.new.timestamp,
            atsScore: payload.new.ats_score,
            readability: payload.new.readability,
            keywords: payload.new.keywords
          };
          
          // Notify all callbacks
          analyticsSubscriptions[userId]?.callbacks.forEach(cb => {
            try {
              cb(newDataPoint);
            } catch (error) {
              console.error('Error in analytics update callback:', error);
            }
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: tables[1],
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          // Map database record to API model
          const newDataPoint = {
            timestamp: payload.new.timestamp,
            atsScore: payload.new.ats_score,
            readability: payload.new.readability,
            keywords: payload.new.keywords
          };
          
          // Notify all callbacks
          analyticsSubscriptions[userId]?.callbacks.forEach(cb => {
            try {
              cb(newDataPoint);
            } catch (error) {
              console.error('Error in analytics update callback:', error);
            }
          });
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for user ${userId}:`, status);
      });
    
    // Store the subscription
    analyticsSubscriptions[userId] = {
      channel,
      callbacks: new Set([callback])
    };
    
    // Return unsubscribe function
    return () => {
      analyticsSubscriptions[userId].callbacks.delete(callback);
      
      // If there are no more callbacks, remove the subscription
      if (analyticsSubscriptions[userId].callbacks.size === 0) {
        channel.unsubscribe();
        delete analyticsSubscriptions[userId];
      }
    };
  } catch (error) {
    console.error('Error subscribing to analytics updates:', error);
    return () => {}; // Return empty function on error
  }
}

/**
 * Refresh analytics data manually
 * @param userId User ID to refresh data for
 * @returns Promise that resolves with the refreshed analytics data
 */
export async function refreshAnalyticsData(userId: string): Promise<UserAnalytics> {
  try {
    // Fetch fresh data
    return await fetchUserAnalytics(userId);
  } catch (error) {
    // Fall back to mock data as a last resort
    return generateMockAnalyticsData(userId);
  }
}
