import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';
import { useAuth } from '../../hooks/useAuth';
import { TIER_FEATURES } from '../../types/subscription';
import { getSubscriptionData } from '../../context/subscriptionHelpers';
import '../../styles/progress-bar.css';

export const SubscriptionInfo: React.FC = () => {
  const { 
    tier, 
    isPremium, 
    formattedExpiryDate, 
    daysRemaining,
    openPaymentModal,
    subscriberEmail,
    isCurrentUserSubscriber,
    updateSubscription,
    // Usage tracking data
    usageData,
    usageLimits,
    remainingMonthlyResumes,
    remainingTotalResumes,
    planPeriod
  } = useSubscription();

  const { user } = useAuth();
  const [forceUpdate, setForceUpdate] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Get fresh subscription data from localStorage
      const freshData = getSubscriptionData();
      console.log('Refreshing subscription with data:', freshData);
      
      // Update the subscription context
      updateSubscription(freshData);
      
      // Force component re-render
      setForceUpdate(prev => prev + 1);
      
      // Show success message
      console.log('Subscription refreshed successfully');
    } catch (error) {
      console.error('Error refreshing subscription:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Force component refresh to sync with subscription changes
  useEffect(() => {
    const handleSubscriptionUpdate = () => {
      console.log('Subscription update event received');
      setForceUpdate(prev => prev + 1);
    };
    
    // Listen for subscription changes
    window.addEventListener('subscriptionUpdated', handleSubscriptionUpdate);
    
    // Also check periodically as fallback
    const interval = setInterval(() => {
      setForceUpdate(prev => prev + 1);
    }, 5000);

    return () => {
      window.removeEventListener('subscriptionUpdated', handleSubscriptionUpdate);
      clearInterval(interval);
    };
  }, []);
  // Debug function to test subscription
  const testSubscription = () => {
    if (!user?.email) {
      alert('Please login first');
      return;
    }

    const startDate = new Date();
    const expiryDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const testSubscriptionData = {
      tier: 'premium' as const,
      startDate: startDate.toISOString(),
      expiresAt: expiryDate.toISOString(),
      features: TIER_FEATURES.premium,
      subscriberEmail: user.email,
      planPeriod: 'monthly' as const,
      usageData: {
        resumeCount: 2,
        monthlyResumeCount: 2,
        lastResetDate: new Date().toISOString()
      }
    };

    console.log('Testing subscription with data:', testSubscriptionData);
    updateSubscription(testSubscriptionData);
  };

  // Format the last reset date for display
  const formatLastResetDate = (dateString?: string | null) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200" key={forceUpdate}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Your Subscription</h2>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 font-medium">Current Plan:</span>
          <span className={`font-bold ${isPremium ? 'text-indigo-600' : 'text-gray-800'}`}>
            {tier === 'premium' ? `Premium ${planPeriod === 'yearly' ? 'Yearly' : 'Monthly'}` : 'Free'}
          </span>
        </div>

        {/* Always show subscription email if available */}
        {subscriberEmail && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 font-medium">Subscription Email:</span>
            <span className="font-bold text-gray-800">{subscriberEmail}</span>
          </div>
        )}
        
        {isPremium && (
          <>
            <div className="flex items-center justify-between mb-2 bg-indigo-50 p-2 rounded-md">
              <span className="text-gray-700 font-medium">Expires On:</span>
              <span className="font-bold text-indigo-700">{formattedExpiryDate}</span>
            </div>
            
            {daysRemaining !== null && (
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 font-medium">Days Remaining:</span>
                <span className={`font-bold ${daysRemaining < 7 ? 'text-red-600' : 'text-gray-800'}`}>
                  {daysRemaining}
                </span>
              </div>
            )}

            {/* Resume Usage Statistics */}
            <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="text-md font-semibold text-blue-800 mb-3">Resume Analysis Usage</h3>
              
              <div className="space-y-3">
                {/* Monthly resume usage */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-blue-700">Monthly Usage:</span>
                    <span className="text-sm font-medium">
                      {usageData.monthlyResumeCount} / {usageLimits.monthlyResumeLimit} resumes
                    </span>
                  </div>                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className={`bg-blue-600 h-2 rounded-full progress-bar-${Math.min(100, Math.round((usageData.monthlyResumeCount / usageLimits.monthlyResumeLimit) * 100))}`}
                    />
                  </div>
                  <div className="text-xs text-blue-600 mt-1">
                    {remainingMonthlyResumes} resumes remaining this month
                  </div>
                </div>

                {/* Total resume usage (only show for yearly plans) */}
                {planPeriod === 'yearly' && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-blue-700">Total Yearly Usage:</span>
                      <span className="text-sm font-medium">
                        {usageData.resumeCount} / {usageLimits.totalResumeLimit} resumes
                      </span>
                    </div>                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className={`bg-blue-600 h-2 rounded-full progress-bar-${Math.min(100, Math.round((usageData.resumeCount / usageLimits.totalResumeLimit) * 100))}`}
                      />
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      {remainingTotalResumes} total resumes remaining in your plan
                    </div>
                  </div>
                )}
                
                <div className="text-xs text-gray-500">
                  Last reset: {formatLastResetDate(usageData.lastResetDate)}
                </div>
              </div>
            </div>

            {/* Display subscription owner information if different from current user */}
            {subscriberEmail && !isCurrentUserSubscriber && (
              <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-200">
                <p className="text-sm font-medium">
                  This premium subscription was purchased by: <span className="font-bold">{subscriberEmail}</span>
                </p>
                {user?.email && (
                  <p className="text-sm mt-1">
                    You are signed in as: <span className="font-bold">{user.email}</span>
                  </p>
                )}
                <p className="text-sm mt-2 font-medium">
                  To use this subscription, please sign in with the email address above.
                </p>
              </div>
            )}
            
            {daysRemaining !== null && daysRemaining < 7 && isCurrentUserSubscriber && (
              <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-200">
                <p className="text-sm font-medium">
                  Your premium subscription will expire soon. Renew now to avoid interruption.
                </p>
              </div>
            )}
          </>
        )}
      </div>
        <div className="flex flex-col space-y-3">
        {/* Debug section for development */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Debug Info</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Current User Email: {user?.email || 'Not logged in'}</div>
            <div>Subscription Email: {subscriberEmail || 'None'}</div>
            <div>Is Owner: {isCurrentUserSubscriber ? 'Yes' : 'No'}</div>
            <div>Tier: {tier}</div>
            <div>Plan: {planPeriod || 'N/A'}</div>
            <div>Expires: {formattedExpiryDate || 'N/A'}</div>
            <div>Monthly Resumes: {usageData.monthlyResumeCount} / {usageLimits.monthlyResumeLimit}</div>
            <div>Total Resumes: {usageData.resumeCount} / {usageLimits.totalResumeLimit}</div>
          </div>
          <button 
            onClick={testSubscription}
            className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          >
            Test Subscription (Debug)
          </button>
        </div>

        {isPremium ? (
          isCurrentUserSubscriber ? (
            <>
              <button 
                onClick={() => openPaymentModal('monthly')}
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
              >
                Extend Monthly Plan
              </button>
              <button 
                onClick={() => openPaymentModal('yearly')}
                className="w-full py-2 px-4 bg-indigo-700 hover:bg-indigo-800 text-white font-medium rounded-md transition-colors"
              >
                Upgrade to Yearly (Save 58%)
              </button>
            </>
          ) : (
            <div className="p-3 bg-gray-50 text-gray-600 rounded-md border border-gray-200">
              <p className="text-sm text-center">
                Only the subscription owner can extend or upgrade this plan.
              </p>
            </div>
          )
        ) : (
          <>
            <button 
              onClick={() => openPaymentModal('monthly')}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
            >
              Go Premium Monthly
            </button>
            <button 
              onClick={() => openPaymentModal('yearly')}
              className="w-full py-2 px-4 bg-indigo-700 hover:bg-indigo-800 text-white font-medium rounded-md transition-colors"
            >
              Go Premium Yearly (Save 58%)
            </button>
          </>
        )}
      </div>
    </div>
  );
};
