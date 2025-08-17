import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Card } from '../components/ui/Card';
import { useToast } from '../context/ToastContext';
import { History, FileText, Settings, LogOut, User, Trash2, Download, Clock, FileSearch } from 'lucide-react';
import { profileApi, type AnalysisHistory, type Resume } from '../api/profile';
import { SubscriptionInfo } from '../components/premium';

export function ProfilePage() {
  const { user, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('ProfilePage rendered, user:', user);
  console.log('isLoading:', isLoading);
  console.log('activeTab:', activeTab);

  useEffect(() => {
    const loadAnalysisHistoryLocal = async () => {
      try {
        setLoading(true);
        const history = await profileApi.getAnalysisHistory();
        setAnalysisHistory(history);
      } catch (error) {
        console.error('Failed to load analysis history:', error);
        showToast('Failed to load analysis history', 'error');
      } finally {
        setLoading(false);
      }
    };

    const loadResumesLocal = async () => {
      try {
        setLoading(true);
        const savedResumes = await profileApi.getSavedResumes();
        setResumes(savedResumes);
      } catch (error) {
        console.error('Failed to load resumes:', error);
        showToast('Failed to load resumes', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'history') {
      loadAnalysisHistoryLocal();
    } else if (activeTab === 'resumes') {
      loadResumesLocal();
    }
  }, [activeTab, showToast]);

  const loadAnalysisHistory = async () => {
    try {
      setLoading(true);
      const history = await profileApi.getAnalysisHistory();
      setAnalysisHistory(history);
    } catch (error) {
      console.error('Failed to load analysis history:', error);
      showToast('Failed to load analysis history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadResumes = async () => {
    try {
      setLoading(true);
      const savedResumes = await profileApi.getSavedResumes();
      setResumes(savedResumes);
    } catch (error) {
      console.error('Failed to load resumes:', error);
      showToast('Failed to load resumes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    try {
      await profileApi.deleteResume(resumeId);
      showToast('Resume deleted successfully', 'success');
      loadResumes();
    } catch (error) {
      console.error('Failed to delete resume:', error);
      showToast('Failed to delete resume', 'error');
    }
  };

  const handleDeleteHistory = async (historyId: string) => {
    try {
      await profileApi.deleteAnalysisHistory(historyId);
      showToast('Analysis history deleted successfully', 'success');
      loadAnalysisHistory();
    } catch (error) {
      console.error('Failed to delete analysis history:', error);
      showToast('Failed to delete analysis history', 'error');
    }
  };

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

  // Show loading spinner while auth state is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Let ProtectedRoute handle the redirect if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-premium-display font-bold text-gradient-luxury mb-4">
              My Account
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 font-luxury">
              Manage your profile, view analysis history, and access premium features
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 card-premium shadow-luxury-lg bg-white dark:bg-slate-800 border-gradient-premium p-2 rounded-xl">
              <TabsTrigger 
                value="profile" 
                className="flex items-center gap-2 font-luxury data-[state=active]:bg-gradient-luxury-blue data-[state=active]:text-white data-[state=active]:shadow-luxury transition-all duration-300 rounded-lg py-3"
              >
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="flex items-center gap-2 font-luxury data-[state=active]:bg-gradient-luxury-blue data-[state=active]:text-white data-[state=active]:shadow-luxury transition-all duration-300 rounded-lg py-3"
              >
                <History className="h-4 w-4" />
                Analysis History
              </TabsTrigger>
            <TabsTrigger 
              value="resumes" 
              className="flex items-center gap-2 font-luxury data-[state=active]:bg-gradient-luxury-blue data-[state=active]:text-white data-[state=active]:shadow-luxury transition-all duration-300 rounded-lg py-3"
            >
              <FileText className="h-4 w-4" />
              My Resumes
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-2 font-luxury data-[state=active]:bg-gradient-luxury-blue data-[state=active]:text-white data-[state=active]:shadow-luxury transition-all duration-300 rounded-lg py-3"
            >
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="card-premium shadow-luxury-xl border-gradient-luxury p-8">
              <h2 className="text-3xl font-premium-display font-bold mb-6 text-gradient-luxury">Profile Information</h2>
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-600 p-6 rounded-xl border border-blue-100 dark:border-slate-600">
                  <label className="block text-sm font-luxury font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                  <p className="text-lg font-luxury text-gray-900 dark:text-gray-100">{user.email}</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-slate-700 dark:to-slate-600 p-6 rounded-xl border border-green-100 dark:border-slate-600">
                  <label className="block text-sm font-luxury font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                  <p className="text-lg font-luxury text-gray-900 dark:text-gray-100">{user.user_metadata?.full_name || 'Not set'}</p>
                </div>
                <div className="mb-8">
                  <SubscriptionInfo />
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-700 dark:to-slate-600 p-6 rounded-xl border border-purple-100 dark:border-slate-600">
                  <label className="block text-sm font-luxury font-medium text-gray-700 dark:text-gray-300 mb-2">Account Type</label>
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-luxury text-gray-900 dark:text-gray-100">
                      {user.user_metadata?.is_premium ? 'Premium' : 'Free'}
                    </p>
                    {user.user_metadata?.is_premium && (
                      <span className="px-3 py-1 bg-gradient-luxury-purple text-white text-sm font-luxury rounded-full shadow-luxury premium-shimmer">
                        Premium
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="card-premium shadow-luxury-xl border-gradient-luxury p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-premium-display font-bold text-gradient-luxury">Analysis History</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadAnalysisHistory}
                  className="flex items-center gap-2 font-luxury shadow-luxury hover:shadow-luxury-md transition-all duration-300 border-gradient-premium"
                >
                  <Clock className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
              <div className="space-y-4">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300 font-luxury">Loading your analysis history...</p>
                  </div>
                ) : analysisHistory.length === 0 ? (
                  <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-700 dark:to-slate-600 rounded-xl border border-gray-100 dark:border-slate-600">
                    <FileSearch className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-luxury text-gray-500 dark:text-gray-400 mb-2">No analysis history found</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 font-luxury">
                      Your resume analysis history will appear here after you upload and analyze resumes.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analysisHistory.map((history) => (
                      <div
                        key={history.id}
                        className="flex items-center justify-between p-6 bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-xl border border-blue-100 dark:border-slate-600 hover:shadow-luxury-lg transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-luxury font-semibold text-gray-900 dark:text-gray-100">
                              {history.analysis_type}
                            </h3>
                            <span className="px-3 py-1 text-xs rounded-full bg-gradient-luxury-blue text-white font-luxury shadow-luxury">
                              {new Date(history.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 font-luxury space-y-1">
                            <p>Resume ID: <span className="font-semibold">{history.resume_id}</span></p>
                            <p className="flex items-center gap-2">
                              Confidence Score: 
                              <span className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-md font-semibold">
                                {Math.round(history.analysis_result.confidence_score * 100)}%
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/results/${history.id}`)}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-luxury border border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 shadow-luxury hover:shadow-luxury-md transition-all duration-300"
                          >
                            View Details
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteHistory(history.id)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-luxury border border-red-200 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 shadow-luxury hover:shadow-luxury-md transition-all duration-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="resumes">
            <Card className="card-premium shadow-luxury-xl border-gradient-luxury p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-premium-display font-bold text-gradient-luxury">My Resumes</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadResumes}
                  className="flex items-center gap-2 font-luxury shadow-luxury hover:shadow-luxury-md transition-all duration-300 border-gradient-premium"
                >
                  <FileText className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
              <div className="space-y-4">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-300 font-luxury">Loading your resumes...</p>
                  </div>
                ) : resumes.length === 0 ? (
                  <div className="text-center py-12 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-700 dark:to-slate-600 rounded-xl border border-purple-100 dark:border-slate-600">
                    <FileText className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                    <p className="text-lg font-luxury text-gray-700 dark:text-gray-300 mb-2">No resumes found</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-luxury">
                      Upload your first resume to get started with our premium analysis tools.
                    </p>
                    <Button
                      onClick={() => navigate('/')}
                      className="mt-4 btn-premium-luxury"
                    >
                      Upload Resume
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {resumes.map((resume) => (
                      <div
                        key={resume.id}
                        className="flex items-center justify-between p-6 bg-gradient-to-r from-white to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-xl border border-purple-100 dark:border-slate-600 hover:shadow-luxury-lg transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-luxury-purple rounded-lg flex items-center justify-center shadow-luxury">
                              <FileText className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-luxury font-semibold text-gray-900 dark:text-gray-100">
                                {resume.file_name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300 font-luxury">
                                Uploaded on {new Date(resume.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(resume.file_url, '_blank')}
                            className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-luxury border border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30 shadow-luxury hover:shadow-luxury-md transition-all duration-300"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteResume(resume.id)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-luxury border border-red-200 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 shadow-luxury hover:shadow-luxury-md transition-all duration-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="card-premium shadow-luxury-xl border-gradient-luxury p-8">
              <h2 className="text-3xl font-premium-display font-bold mb-6 text-gradient-luxury">Account Settings</h2>
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-slate-700 dark:to-slate-600 p-6 rounded-xl border border-blue-100 dark:border-slate-600">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-luxury-blue rounded-lg flex items-center justify-center shadow-luxury">
                      <Settings className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-luxury font-semibold text-gray-900 dark:text-gray-100">Subscription</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 font-luxury">
                    {user.user_metadata?.is_premium 
                      ? 'You are currently on a premium plan with access to all advanced features.'
                      : 'Upgrade to premium for advanced analysis features, unlimited uploads, and priority support.'}
                  </p>
                  {!user.user_metadata?.is_premium && (
                    <Button 
                      onClick={() => navigate('/pricing')}
                      className="btn-premium-luxury"
                    >
                      Upgrade to Premium
                    </Button>
                  )}
                  {user.user_metadata?.is_premium && (
                    <div className="flex items-center gap-3">
                      <span className="px-4 py-2 bg-gradient-luxury-purple text-white font-luxury rounded-full shadow-luxury premium-shimmer">
                        Premium Active
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-300 font-luxury">
                        Enjoy unlimited access to all features
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-slate-700 dark:to-slate-600 p-6 rounded-xl border border-red-100 dark:border-slate-600">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center shadow-luxury">
                      <LogOut className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-xl font-luxury font-semibold text-gray-900 dark:text-gray-100">Account Actions</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 font-luxury">
                    Sign out of your account. You can always sign back in later to access your data.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={handleSignOut}
                    className="flex items-center gap-2 font-luxury bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-none shadow-luxury hover:shadow-luxury-md transition-all duration-300"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </div>
  );
}

export default ProfilePage;