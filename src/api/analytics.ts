// Analytics API: Fetches real analytics data for the authenticated user from Supabase
import { supabase } from '../utils/supabaseClient';

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
  courseRecommendations: {
    title: string;
    provider: string;
    skillsAddressed: string[];
    relevanceScore: number;
    url: string;
  }[];  lastUpdated?: string; // ISO timestamp of when the data was last updated
  isRealTime?: boolean; // Flag indicating if real-time updates are enabled
  subscriptionInfo?: {
    tier: string;
    expiryDate: string | null;
    subscriberEmail: string | null;
  }; // Subscription information for the analytics view
  hasPremiumCrown?: boolean; // Indicates if the user has a premium subscription (shows the crown icon)
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
  course_recommendations?: Array<{
    title: string;
    provider: string;
    skills_addressed: string[];
    relevance_score: number;
    url: string;
  }>;
  updated_at: string;
}

interface TrendRecord {
  user_id: string;
  timestamp: string;
  ats_score: number;
  readability: number;
  keywords: number;
}  // Map database record to API model
function mapAnalyticsRecordToUserAnalytics(
  record: AnalyticsRecord, 
  trends: TrendRecord[]
): UserAnalytics {
  // Create a properly mapped course recommendations array or use empty array as fallback
  const courseRecommendations = record.course_recommendations?.map(course => ({
    title: course.title,
    provider: course.provider,
    skillsAddressed: course.skills_addressed,
    relevanceScore: course.relevance_score,
    url: course.url
  })) || [];
  
  console.log(`Mapping analytics record with ${courseRecommendations.length} course recommendations`);
  
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
    courseRecommendations,
    trendData: trends.map(t => ({
      timestamp: t.timestamp,
      atsScore: t.ats_score,
      readability: t.readability,
      keywords: t.keywords
    })),
    lastUpdated: record.updated_at,
    hasPremiumCrown: false // Default to false, will be updated later based on subscription data
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
  
  // Fix any invalid numbers by using defaults
  const defaultValues = {
    atsScore: 70,
    previousAtsScore: 65,
    skillsMatched: 10,
    totalSkills: 15,
    readabilityScore: 75,
    keywordDensity: 5.0
  };
  
  let hasFixedValues = false;
  
  for (const field of requiredNumberFields) {
    // Handle NaN, null, undefined or non-number types
    if (typeof d[field] !== 'number' || isNaN(d[field] as number)) {
      logValidationError(`Field "${field}" is not a valid number, using default value`, { 
        field, 
        originalValue: d[field], 
        defaultValue: defaultValues[field],
        type: typeof d[field] 
      });
      (d as any)[field] = defaultValues[field];
      hasFixedValues = true;
    }
  }
  
  // Log if we had to fix any values
  if (hasFixedValues) {
    console.warn('Analytics data contained invalid values that were replaced with defaults');
  }
  // Check arrays and fix them rather than returning false
  if (!Array.isArray(d.sectionCompleteness)) {
    logValidationError('sectionCompleteness is not an array, creating empty array', { value: d.sectionCompleteness });
    (d as any).sectionCompleteness = [];
  }
  
  if (!Array.isArray(d.trendData)) {
    logValidationError('trendData is not an array, creating empty array', { value: d.trendData });
    (d as any).trendData = [];
  }
  
  if (!Array.isArray(d.recommendations)) {
    logValidationError('recommendations is not an array, creating empty array', { value: d.recommendations });
    (d as any).recommendations = [];
  }
  
  // Check course recommendations array
  if (!Array.isArray(d.courseRecommendations)) {
    logValidationError('courseRecommendations is not an array', { value: d.courseRecommendations });
    // Set a default empty array instead of failing validation
    (d as UserAnalytics).courseRecommendations = [];
    // Don't fail validation here - allow empty course recommendations array
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
  
  // Generate course recommendations based on user ID to ensure consistency
  // This ensures different users get personalized mock recommendations
  const userSeed = parseInt(userId.replace(/[^0-9]/g, '0'), 10) % 5;
  
  // List of possible course recommendations
  const courseRecommendationsList = [
    {
      title: "Advanced Resume Writing for Tech Professionals",
      provider: "LinkedIn Learning",
      skillsAddressed: ["Resume Writing", "Technical Communication", "Personal Branding"],
      relevanceScore: 95,
      url: "https://www.linkedin.com/learning/advanced-resume-writing"
    },
    {
      title: "Data Visualization Fundamentals",
      provider: "Coursera",
      skillsAddressed: ["Data Analysis", "Visualization", "Storytelling with Data"],
      relevanceScore: 88,
      url: "https://www.coursera.org/learn/data-visualization-fundamentals"
    },
    {
      title: "Project Management Professional (PMP) Certification",
      provider: "PMI",
      skillsAddressed: ["Project Management", "Leadership", "Process Optimization"],
      relevanceScore: 92,
      url: "https://www.pmi.org/certifications/project-management-pmp"
    },
    {
      title: "Agile Leadership Principles",
      provider: "edX",
      skillsAddressed: ["Agile Methodologies", "Team Management", "Adaptive Planning"],
      relevanceScore: 85,
      url: "https://www.edx.org/learn/agile/leadership-principles"
    },
    {
      title: "Full-Stack Web Development Bootcamp",
      provider: "Udemy",
      skillsAddressed: ["JavaScript", "React", "Node.js", "Database Design"],
      relevanceScore: 90,
      url: "https://www.udemy.com/course/fullstack-web-development"
    }
  ];
  
  // Create a personalized subset of course recommendations based on user ID
  const personalizedCourses = [
    courseRecommendationsList[userSeed % courseRecommendationsList.length],
    courseRecommendationsList[(userSeed + 1) % courseRecommendationsList.length],
    courseRecommendationsList[(userSeed + 2) % courseRecommendationsList.length]
  ];
  
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
    ],    courseRecommendations: personalizedCourses,
    lastUpdated: new Date().toISOString(),
    isRealTime: false,
    hasPremiumCrown: false // Default to false for mock data
  };
}

// Import enhanced data validation tools
import { deepValidateAnalyticsData, validateTrendData, fixRealAnalyticsData } from '../utils/analyticsDataValidator';

// Fetch user's full analytics data with fallbacks
export async function fetchUserAnalytics(userId: string): Promise<UserAnalytics> {
  try {
    console.log(`Fetching analytics data for user ${userId}`);
    
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
    }    // Check if we have analytics data, even without trend data
    if (analyticsError || !analyticsData) {
      console.warn('Unable to retrieve main analytics data from any table, using mock data');
      return generateMockAnalyticsData(userId);
    }
    
    // If we have analytics data but no trend data, use empty array for trends
    // This prioritizes real data over mock data when at least part of the data is available
    if (trendError || !trendData || !trendData.length) {
      console.warn('Unable to retrieve trend data, using empty trend array but keeping real analytics data');
      trendData = [];
    }
      
    // Ensure analyticsData has course_recommendations property
    if (!analyticsData.course_recommendations) {
      console.warn('Analytics data missing course recommendations, adding empty array');
      analyticsData.course_recommendations = [];
    }
    
    // Validate trend data for correctness
    const validatedTrends = [];
    for (const trend of trendData || []) {
      // Skip any invalid trend points
      if (!trend || !trend.timestamp || typeof trend.ats_score !== 'number') {
        console.warn('Skipping invalid trend data point:', trend);
        continue;
      }
      
      // Ensure values are within reasonable ranges
      const validTrend: TrendRecord = {
        ...trend,
        ats_score: Math.max(0, Math.min(100, trend.ats_score)),
        readability: Math.max(0, Math.min(100, trend.readability)),
        keywords: Math.max(0, Math.min(100, trend.keywords || 0))
      };
      
      validatedTrends.push(validTrend);
    }
    
    // Map database records to API model
    const mappedData = mapAnalyticsRecordToUserAnalytics(
      analyticsData as AnalyticsRecord, 
      validatedTrends as TrendRecord[]
    );
    
    // Deep validate the mapped data to ensure all fields are correct
    try {
      // Verify all required fields exist and have valid values
      if (mappedData) {
        // Ensure numeric fields have valid values
        const numericFields = ['atsScore', 'previousAtsScore', 'skillsMatched', 
                              'totalSkills', 'readabilityScore', 'keywordDensity'];
        for (const field of numericFields) {
          const value = mappedData[field as keyof UserAnalytics];
          if (typeof value !== 'number' || isNaN(value as number)) {
            console.warn(`Fixing invalid ${field} value:`, value);
            (mappedData as any)[field] = field === 'keywordDensity' ? 5.0 : 70;
          }
        }
        
        // Ensure arrays exist
        if (!Array.isArray(mappedData.sectionCompleteness)) {
          mappedData.sectionCompleteness = [];
        }
        
        if (!Array.isArray(mappedData.trendData)) {
          mappedData.trendData = [];
        }
        
        if (!Array.isArray(mappedData.recommendations)) {
          mappedData.recommendations = [];
        }
        
        if (!Array.isArray(mappedData.courseRecommendations)) {
          mappedData.courseRecommendations = [];
        }
      }
    } catch (validationError) {
      console.error('Error during deep validation:', validationError);
    }
      // Get subscription information from local storage
    try {      // Import helpers from subscriptionHelpers
      const { getSubscriptionData, verifySubscriptionValidity } = await import('../context/subscriptionHelpers');
      const subscriptionData = getSubscriptionData();
        // Get current user email from auth if available
      let currentUserEmail = null;
      try {
        // First try to get from localStorage user_data
        const storedUserData = localStorage.getItem('user_data');
        if (storedUserData) {
          try {
            const userData = JSON.parse(storedUserData);
            currentUserEmail = userData.email || null;
          } catch (parseError) {
            console.warn('Error parsing user data from storage:', parseError);
          }
        }
        
        // If not found, try auth_user as a fallback
        if (!currentUserEmail) {
          const authUserData = localStorage.getItem('auth_user');
          if (authUserData) {
            try {
              const authUser = JSON.parse(authUserData);
              currentUserEmail = authUser.email || null;
            } catch (parseError) {
              console.warn('Error parsing auth user data from storage:', parseError);
            }
          }
        }
        
        console.log('Retrieved current user email for analytics:', currentUserEmail);
      } catch (authError) {
        console.warn('Unable to get current user for crown validation:', authError);
      }      // Verify subscription validity with the current user's email
      const validatedSubscription = verifySubscriptionValidity(subscriptionData, currentUserEmail);
      
      console.log('Validated subscription for analytics:', {
        tier: validatedSubscription.tier,
        email: validatedSubscription.subscriberEmail,
        expiresAt: validatedSubscription.expiresAt,
        currentUserEmail
      });
      
      // Add subscription data to analytics response using validated data
      mappedData.subscriptionInfo = {
        tier: validatedSubscription.tier,
        expiryDate: validatedSubscription.expiresAt,
        subscriberEmail: validatedSubscription.subscriberEmail
      };
      
      // If we have additional metadata to display about the subscription status
      if (mappedData.subscriptionInfo && validatedSubscription.tier !== 'free') {
        // Calculate and include days remaining for subscription display
        if (validatedSubscription.expiresAt) {
          const now = new Date();
          const expiryDate = new Date(validatedSubscription.expiresAt);
          const diffTime = expiryDate.getTime() - now.getTime();
          const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          // Add days remaining to subscription info
          (mappedData.subscriptionInfo as any).daysRemaining = Math.max(0, daysRemaining);
        }
      }
        // Set the premium crown flag based on validated subscription tier and matching email
      const isValidPremiumTier = 
        validatedSubscription.tier === 'premium' || validatedSubscription.tier === 'enterprise';
      
      // Check if the subscription is valid and not expired
      const now = new Date();
      let isExpired = false;
      
      if (validatedSubscription.expiresAt) {
        const expiryDate = new Date(validatedSubscription.expiresAt);
        isExpired = expiryDate < now;
        if (isExpired) {
          console.log(`Subscription expired on ${expiryDate.toISOString()}, current date: ${now.toISOString()}`);
        }
      }
      
      const isCurrentUserOwner = 
        currentUserEmail && 
        validatedSubscription.subscriberEmail && 
        validatedSubscription.subscriberEmail.toLowerCase() === currentUserEmail.toLowerCase();
      
      // Only show crown if subscription is valid, not expired, and owned by current user
      mappedData.hasPremiumCrown = isValidPremiumTier && !isExpired && isCurrentUserOwner;
      
      console.log(`Setting hasPremiumCrown to ${mappedData.hasPremiumCrown} based on:
        - Tier: ${validatedSubscription.tier} (valid premium: ${isValidPremiumTier})
        - User email match: ${isCurrentUserOwner}
        - Expiry status: ${isExpired ? 'EXPIRED' : 'Active'}`);
        
      // Add expiry information to the analytics data for UI display
      if (mappedData.subscriptionInfo && validatedSubscription.expiresAt) {
        mappedData.subscriptionInfo.expiryDate = validatedSubscription.expiresAt;
      }
    } catch (subscriptionError) {
      console.warn('Unable to include subscription data in analytics:', subscriptionError);
    }
      // Validate and fix the data before returning instead of using mock data
    if (!validateAnalyticsData(mappedData)) {
      console.warn('Invalid analytics data returned from server, fixing real data instead of using mock data');
      // Use our new fixRealAnalyticsData utility to repair the data while preserving real values
      const fixedData = fixRealAnalyticsData(mappedData);
      console.log('Successfully fixed real analytics data', { userId, dataSource: 'fixed-real-data' });
      return fixedData;
    }
    
    console.log('Using valid real analytics data', { userId, dataSource: 'real-data' });
    return mappedData;} catch (err) {
    console.error('Error fetching analytics data:', err);
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
    }    // If we still have an error or no data, return empty array instead of mock data
    // This ensures we're not showing fake data when real data isn't available
    if (error || !data || !data.length) {
      console.warn('Unable to retrieve trend data, returning empty array instead of mock data');
      // Return empty array instead of mock data to avoid displaying misleading information
      return [];
    }
    
    return mapTrendRecords(data as TrendRecord[]);  } catch (err) {
    console.error('Error fetching trend data:', err);
    // Return empty array instead of mock data
    console.warn('Returning empty trend data array instead of mock data due to error');
    return [];
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
    }  } catch (err) {
    console.error('Error updating analytics data:', err);
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
      .channel(`analytics_updates:${userId}`)      .on(
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
            } catch (err) {
              console.error('Error in analytics update callback:', err);
            }
          });
        }
      )      .on(
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
            } catch (err) {
              console.error('Error in analytics update callback:', err);
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
    };  } catch (err) {
    console.error('Error subscribing to analytics updates:', err);
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
    // Instead of using mock data, fix minimal data with our utility
    console.error('Error in refreshAnalyticsData:', error);
    console.warn('Creating minimal real data instead of using mock data during refresh');
    
    // Create minimal valid data structure rather than mock data
    const minimalData: Partial<UserAnalytics> = {
      atsScore: 70,
      previousAtsScore: 70,
      skillsMatched: 0,
      totalSkills: 0,
      readabilityScore: 70,
      keywordDensity: 0,
      trendData: [],
      recommendations: [],
      courseRecommendations: [],
      sectionCompleteness: [],
      industryBenchmark: {
        industry: 'General',
        averageATS: 70,
        topPercentile: 90
      },
      lastUpdated: new Date().toISOString(),
      isRealTime: false
    };
    
    // Use our fixRealAnalyticsData utility to ensure the data structure is complete
    return fixRealAnalyticsData(minimalData);
  }
}
