import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../hooks/useSubscription';
import { Button } from '../components/ui/Button';
import { useToast } from '../context/ToastContext';
import { 
  User, 
  Mail, 
  Calendar, 
  Crown, 
  Settings, 
  LogOut, 
  Edit3, 
  Save,
  X,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Trash2
} from 'lucide-react';

export function ProfilePageImproved() {
  const { user, signOut, isLoading } = useAuth();
  const { 
    tier, 
    isPremium, 
    formattedExpiryDate, 
    daysRemaining,
    openPaymentModal,
    subscriberEmail,
    isCurrentUserSubscriber
  } = useSubscription();
  
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  // State for profile editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    displayName: user?.user_metadata?.display_name || '',
  });
  
  // State for preferences
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    marketingEmails: false,
    darkMode: false,
    showEmail: true,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.user_metadata?.full_name || '',
        displayName: user.user_metadata?.display_name || '',
      });
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      showToast('Successfully signed out', 'success');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      showToast('Error signing out', 'error');
    }
  };

  const handleSaveProfile = async () => {
    try {
      // In a real app, you'd call an API to update the profile
      console.log('Saving profile data:', profileData);
      showToast('Profile updated successfully', 'success');
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Error updating profile', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // In a real app, you'd call an API to delete the account
        console.log('Deleting account...');
        showToast('Account deletion initiated', 'info');
      } catch (error) {
        console.error('Error deleting account:', error);
        showToast('Error deleting account', 'error');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full text-white text-2xl font-bold mb-4 shadow-lg">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {profileData.fullName || user.email?.split('@')[0]}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Manage your account settings and subscription
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Profile Information
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                  >
                    {isEditingProfile ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <Mail className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-900 dark:text-white">{user.email}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                        className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <span className="text-gray-900 dark:text-white">
                          {profileData.fullName || 'Not set'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Member Since
                    </label>
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-900 dark:text-white">
                        {new Date(user.created_at || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {isEditingProfile && (
                    <div className="flex space-x-3 pt-4">
                      <Button onClick={handleSaveProfile} size="sm" className="flex-1">
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditingProfile(false)} 
                        size="sm"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Bell className="h-4 w-4 mr-2" />
                    Notification Settings
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Shield className="h-4 w-4 mr-2" />
                    Privacy Settings
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" 
                    size="sm"
                    onClick={handleDeleteAccount}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Column - Subscription & Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Subscription Status */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                    <Crown className="h-5 w-5 mr-2" />
                    Subscription Status
                  </h2>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isPremium 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
                  }`}>
                    {isPremium ? '✨ Premium' : 'Free Plan'}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Current Plan
                      </label>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {tier === 'premium' ? 'Premium' : 'Free'}
                      </div>
                    </div>

                    {isPremium && subscriberEmail && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Subscription Email
                        </label>
                        <div className="text-gray-900 dark:text-white">
                          {subscriberEmail}
                        </div>
                        {!isCurrentUserSubscriber && (
                          <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm">
                            ⚠️ This subscription belongs to a different email address
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {isPremium && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Expires On
                        </label>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {formattedExpiryDate}
                        </div>
                      </div>

                      {daysRemaining !== null && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Days Remaining
                          </label>
                          <div className={`text-lg font-semibold ${
                            daysRemaining < 7 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {daysRemaining} days
                          </div>
                          {daysRemaining < 7 && (
                            <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg text-sm">
                              ⏰ Your subscription expires soon!
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Subscription Action Buttons */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-600">
                  <div className="flex flex-wrap gap-3">
                    {isPremium ? (
                      isCurrentUserSubscriber ? (
                        <>
                          <Button 
                            onClick={() => openPaymentModal('monthly')}
                            variant="outline"
                            className="flex-1"
                          >
                            Extend Monthly (₹99)
                          </Button>
                          <Button 
                            onClick={() => openPaymentModal('yearly')}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            Upgrade to Yearly (₹499) - Save 58%
                          </Button>
                        </>
                      ) : (
                        <div className="w-full p-4 bg-gray-50 dark:bg-slate-700 rounded-lg text-center text-gray-600 dark:text-gray-300">
                          Only the subscription owner can manage this plan
                        </div>
                      )
                    ) : (
                      <>
                        <Button 
                          onClick={() => openPaymentModal('monthly')}
                          variant="outline"
                          className="flex-1"
                        >
                          Go Premium Monthly (₹99)
                        </Button>
                        <Button 
                          onClick={() => openPaymentModal('yearly')}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          Go Premium Yearly (₹499) - Save 58%
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Preferences
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Email Notifications</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Receive analysis completion emails</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreferences({...preferences, emailNotifications: !preferences.emailNotifications})}
                      className={preferences.emailNotifications ? 'text-green-600' : 'text-gray-400'}
                    >
                      {preferences.emailNotifications ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Marketing Emails</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Receive tips and feature updates</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreferences({...preferences, marketingEmails: !preferences.marketingEmails})}
                      className={preferences.marketingEmails ? 'text-green-600' : 'text-gray-400'}
                    >
                      {preferences.marketingEmails ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">Public Email</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Show email in public profile</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreferences({...preferences, showEmail: !preferences.showEmail})}
                      className={preferences.showEmail ? 'text-green-600' : 'text-gray-400'}
                    >
                      {preferences.showEmail ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sign Out */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sign Out</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Sign out of your account on this device</p>
                  </div>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePageImproved;
