import React, { lazy, Suspense, useEffect, useState, useRef, useCallback } from 'react';
import { PremiumUpgradeCard } from '../components/premium/PremiumUpgradeCard';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TrendingUp, BarChart3, PieChart, Activity, Crown, Lock, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { 
  fetchUserAnalytics, 
  UserAnalytics, 
  refreshAnalyticsData,
  subscribeToAnalyticsUpdates,
  AnalyticsUpdateCallback
} from '../api/analytics';

// Lazy load the analytics dashboard component to improve initial load time
const AnalyticsDashboard = lazy(() => 
  import('../components/analytics/AnalyticsDashboard').then(module => ({
    default: module.AnalyticsDashboard
  }))
);

// Lazy load the enhanced analytics dashboard for premium users
const EnhancedAnalyticsDashboard = lazy(() => 
  import('../components/analytics/EnhancedAnalyticsDashboard').then(module => ({
    default: module.EnhancedAnalyticsDashboard
  }))
);

interface DebugInfo {
  timestamp: string;
  user: { id: string; email?: string } | null;
  isPremium: boolean;
  location: string;
  userAgent: string;
  localStorage: {
    hasAuthToken: boolean;
    authKeys: string[];
  };
}

export function AnalyticsPage() {  const { user, isLoading: authLoading } = useAuth();
  const { isPremium, formattedExpiryDate, expiryDate } = useSubscription();
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<UserAnalytics | null>(null);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Refresh analytics data manually
  const refreshData = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsRefreshing(true);
      const freshData = await refreshAnalyticsData(user.id);
      setAnalyticsData(freshData);
      setAnalyticsError(null);
    } catch (err) {
      const error = err as Error;
      setAnalyticsError(error.message || 'Failed to refresh analytics data.');
    } finally {
      setIsRefreshing(false);
    }
  }, [user]);

  // Handle real-time analytics updates
  const handleAnalyticsUpdate = useCallback<AnalyticsUpdateCallback>(
    (newDataPoint) => {
      setAnalyticsData((currentData) => {
        if (!currentData) return null;
        
        // Add the new data point to the trend data
        const updatedTrendData = [
          newDataPoint,
          ...currentData.trendData.slice(0, 29) // Keep only the latest 30 data points
        ];
        
        return {
          ...currentData,
          trendData: updatedTrendData,
          lastUpdated: new Date().toISOString()
        };
      });
    },
    []
  );

  // Fetch analytics data from backend
  useEffect(() => {
    if (!user) return;
    
    // Clean up previous subscription if it exists
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
    
    setDashboardLoading(true);
    setAnalyticsError(null);
    
    fetchUserAnalytics(user.id)
      .then((data) => {
        setAnalyticsData(data);
        setDashboardLoading(false);
        
        // Subscribe to real-time updates for premium users
        if (isPremium) {
          unsubscribeRef.current = subscribeToAnalyticsUpdates(user.id, handleAnalyticsUpdate);
        }
      })
      .catch((err) => {
        setAnalyticsError(err.message || 'Failed to load analytics data.');
        setDashboardLoading(false);
      });
      
    // Clean up subscription when component unmounts or user changes
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [user, isPremium, handleAnalyticsUpdate]);

  // Preload the AnalyticsDashboard component when the page loads
  useEffect(() => {
    // Start loading dashboard component
    const preloadDashboard = async () => {
      try {
        await import('../components/analytics/AnalyticsDashboard');
      } catch (error) {
        console.error('Failed to preload dashboard:', error);
      }
    };
    preloadDashboard();
  }, []);

  // Enhanced debug logging for production troubleshooting
  useEffect(() => {
    const debug: DebugInfo = {
      timestamp: new Date().toISOString(),
      user: user ? { id: user.id, email: user.email } : null,
      isPremium,
      location: window.location.href,
      userAgent: navigator.userAgent,
      localStorage: {
        hasAuthToken: !!localStorage.getItem('supabase.auth.token'),
        authKeys: Object.keys(localStorage).filter(key => key.includes('auth'))
      }
    };
    
    console.log('🔍 AnalyticsPage Debug Info:', debug);
    setDebugInfo(debug);

    // Auto-show debug if there are issues or debug param is present
    if (window.location.search.includes('debug=true') || (!user && !authLoading)) {
      setShowDebug(true);
    }
  }, [user, isPremium, authLoading]);

  // Simulate dashboard loading completion
  useEffect(() => {
    if (user && isPremium) {
      const timer = setTimeout(() => {
        setDashboardLoading(false);
      }, 600);
      
      return () => clearTimeout(timer);
    }
  }, [user, isPremium]);

  // Show loading state
  if (authLoading || dashboardLoading) {
    console.log('⏳ Loading authentication data...');
    return (
      <div className="min-h-screen pt-36 pb-16 bg-gray-50 text-gray-900 dark:bg-slate-900 dark:text-neutral-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="border-0 shadow-lg dark:shadow-slate-900/50">
              <CardContent className="p-8">
                <div className="flex justify-center mb-6">
                  <LoadingSpinner size="lg" />
                </div>
                <h2 className="text-xl font-semibold mb-4">Loading Analytics...</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Please wait while we load your analytics dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (analyticsError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-lg mx-auto">
          <CardTitle>Error Loading Analytics</CardTitle>
          <CardContent>
            <p className="text-red-600 mb-4">{analyticsError}</p>
            <Button onClick={() => user && fetchUserAnalytics(user.id).then(setAnalyticsData).catch(e => setAnalyticsError(e.message))}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Debug component for production troubleshooting
  if (showDebug && debugInfo) {
    return (
      <div className="min-h-screen pt-36 pb-16 bg-gray-50 text-gray-900 dark:bg-slate-900 dark:text-neutral-100">
        <div className="container mx-auto px-4 md:px-6">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔧 Analytics Debug Information
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowDebug(false)}
                >
                  Hide Debug
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Authentication Status</h3>
                  <p>User: {debugInfo.user ? '✅ Authenticated' : '❌ Not authenticated'}</p>
                  <p>Premium: {debugInfo.isPremium ? '✅ Premium user' : '❌ Free user'}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Raw Debug Data</h3>
                  <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto max-h-64">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    onClick={() => window.location.href = '/analytics'}
                  >
                    Reload Analytics
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                  >
                    Clear Cache & Reload
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = '/login'}
                  >
                    Go to Login
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );  
  }

  // Not authenticated - show login prompt
  if (!user) {
    console.log('User not authenticated, showing login prompt');
    return (
      <div className="min-h-screen pt-36 pb-16 bg-gray-50 text-gray-900 dark:bg-slate-900 dark:text-neutral-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Card className="border-0 shadow-lg dark:shadow-slate-900/50">
              <CardContent className="p-8">
                <div className="flex justify-center mb-6">
                  <BarChart3 className="w-16 h-16 text-blue-500" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Analytics Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Sign in to access your personalized analytics and resume performance insights.
                </p>
                <div className="space-y-4">
                  <Button onClick={() => window.location.href = '/login'}>
                    Sign In to View Analytics
                  </Button>
                  <div className="text-sm">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowDebug(true)}
                    >
                      Debug Info
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // User authenticated but not premium
  if (!isPremium) {
    console.log('User is not premium, showing upgrade screen');
    return (
      <div className="min-h-screen pt-36 pb-16 bg-gray-50 text-gray-900 dark:bg-slate-900 dark:text-neutral-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Premium Analytics Header */}
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Premium Analytics Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Unlock comprehensive career insights and performance tracking
              </p>
            </motion.div>

            {/* Preview of Premium Features */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Performance Tracking</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Track your resume performance over time with detailed analytics
                  </p>
                  <div className="bg-blue-200 h-20 rounded opacity-50"></div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Industry Insights</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Compare your performance against industry benchmarks
                  </p>
                  <div className="bg-purple-200 h-20 rounded opacity-50"></div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <PieChart className="w-8 h-8 text-green-600" />
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Skills Analysis</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Deep dive into skill gaps and market trends
                  </p>
                  <div className="bg-green-200 h-20 rounded opacity-50"></div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Premium Upgrade Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <PremiumUpgradeCard variant="full" showComparison={true} />
            </motion.div>

            {/* What You'll Get Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Crown className="w-6 h-6 mr-2 text-yellow-500" />
                    What You'll Get with Premium Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Activity className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Real-time Performance Tracking</h4>
                          <p className="text-gray-600 text-sm">Monitor your resume's performance across different platforms and job applications</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Historical Data & Trends</h4>
                          <p className="text-gray-600 text-sm">View your improvement over time with detailed historical analytics</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <BarChart3 className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Industry Benchmarking</h4>
                          <p className="text-gray-600 text-sm">See how you rank against other professionals in your field</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-orange-100 p-2 rounded-lg">
                          <PieChart className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Skills Gap Analysis</h4>
                          <p className="text-gray-600 text-sm">Identify which skills to develop based on market demands</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                          <Activity className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Predictive Insights</h4>
                          <p className="text-gray-600 text-sm">AI-powered predictions for your career trajectory and opportunities</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-red-100 p-2 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Custom Reports</h4>
                          <p className="text-gray-600 text-sm">Generate detailed reports for your career development</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }
  // Premium users get the full dashboard
  return (
    <div className="min-h-screen pt-36 pb-16 bg-gray-50 text-gray-900 dark:bg-slate-900 dark:text-neutral-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <Button 
              variant="outline" 
              size="sm"
              onClick={refreshData}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </div>
          
          {/* Show last updated timestamp if available */}
          {analyticsData?.lastUpdated && (
            <p className="text-sm text-gray-500 mb-4">
              Last updated: {new Date(analyticsData.lastUpdated).toLocaleString()}
              {isPremium && (
                <span className="ml-2 text-green-600">
                  (Real-time updates enabled)
                </span>
              )}
            </p>
          )}          <div className="mt-8">
            <Suspense fallback={<LoadingSpinner size="lg" />}>
              {analyticsData && (
                <>
                  {isPremium ? (
                    <EnhancedAnalyticsDashboard 
                      data={analyticsData} 
                      isPremium={isPremium}
                      onRefresh={refreshData}
                      isRefreshing={isRefreshing}
                      lastUpdated={analyticsData.lastUpdated}
                      expiryDate={analyticsData.subscriptionInfo?.expiryDate || expiryDate}
                      formattedExpiryDate={formattedExpiryDate}
                    />
                  ) : (
                    <AnalyticsDashboard 
                      data={analyticsData} 
                      isPremium={isPremium}
                      onRefresh={refreshData}
                      isRefreshing={isRefreshing}
                      lastUpdated={analyticsData.lastUpdated}
                      expiryDate={analyticsData.subscriptionInfo?.expiryDate || expiryDate}
                      formattedExpiryDate={formattedExpiryDate}
                    />
                  )}
                </>
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
