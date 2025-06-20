import React from 'react';
import { useSubscription } from '../../hooks/useSubscription';
import { useAuth } from '../../hooks/useAuth';

export const SubscriptionInfo: React.FC = () => {
  const { 
    tier, 
    isPremium, 
    formattedExpiryDate, 
    daysRemaining,
    openPaymentModal,
    subscriberEmail,
    isCurrentUserSubscriber
  } = useSubscription();

  const { user } = useAuth();

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold mb-4">Your Subscription</h2>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600 font-medium">Current Plan:</span>
          <span className={`font-bold ${isPremium ? 'text-indigo-600' : 'text-gray-800'}`}>
            {tier === 'premium' ? 'Premium' : 'Free'}
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
