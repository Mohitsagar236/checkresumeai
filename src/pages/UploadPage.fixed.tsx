import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FileUpload } from '../components/ui/FileUpload';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ProgressBar } from '../components/analysis/ProgressBar';
import { useToast } from '../context/ToastContext';
import { useNotification } from '../context/NotificationContext';
import { useOptimizedFormState } from '../hooks/useOptimizedState';
import { useRealtimeAnalysis } from '../hooks/useRealtimeAnalysis';
import { mockJobRoles } from '../data/mockData';
import { m, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, Zap, AlertTriangle } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
import { Badge } from '../components/ui/Badge';
import { RealTimeFeedbackViz } from '../components/premium/RealTimeFeedbackViz';
import ImprovedPdfViewer from '../components/pdf/ImprovedPdfViewer';
import { useAuth } from '../hooks/useAuth';
import { LoginModal } from '../components/auth/LoginModal';
import { SignUpModal } from '../components/auth/SignupModal';

export function UploadPage() {
  const { user } = useAuth();
  const { isPremium, openPaymentModal } = useSubscription();
  const { showToast } = useToast();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

  // Use optimized form state for better performance
  const { 
    formState, 
    updateField, 
    validateForm, 
    isValid,
    errors 
  } = useOptimizedFormState({
    file: null as File | null,
    jobRole: '',
    showLoginModal: false,
    showSignupModal: false
  }, {
    file: (value: File | null) => value ? true : 'Please upload a resume file',
    jobRole: (value: string) => value ? true : 'Please select a job role'
  });

  // Extract form values for easier access
  const { file, jobRole, showLoginModal, showSignupModal } = formState;

  // Get analysis states including new loading states
  const { 
    analysis, 
    isAnalyzing, 
    progress, 
    stages, 
    realTimeData, 
    isRealTimeActive,
    isLoadingPDF,
    pdfError
  } = useRealtimeAnalysis(file, jobRole, {
    isPremium,
    realTimeUpdates: true
  });

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (!user) {
      updateField('showLoginModal', true);
      return;
    }
    updateField('file', selectedFile);
    addNotification({
      type: 'success',
      title: 'Resume Uploaded',
      message: `Resume "${selectedFile.name}" uploaded successfully!`,
      duration: 3000
    });
    showToast(`Resume "${selectedFile.name}" uploaded successfully!`, 'success');
  }, [user, showToast, updateField, addNotification]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      updateField('showLoginModal', true);
      return;
    }

    // Validate form before submission
    if (!validateForm()) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields correctly.',
        duration: 4000
      });
      return;
    }

    if (!file || !jobRole) {
      showToast('Please upload a resume and select a job role.', 'error');
      return;
    }

    // Debug logs
    console.log('handleSubmit called with file:', file);
    console.log('jobRole:', jobRole);

    // Create a FileReader to read the file content
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target?.result as string;
      const base64Content = fileContent.split('base64,')[1] || '';
      
      const params = new URLSearchParams();
      params.set('jobRoleId', jobRole);
      params.set('fileName', file.name);
      params.set('resumeContent', base64Content);
      
      if (isPremium) {
        params.set('realtimeMode', 'true');
        
        if (realTimeData && realTimeData.keywordMatches) {
          const keywordsData = {
            matched: realTimeData.keywordMatches.matched || [],
            missing: realTimeData.keywordMatches.missing || []
          };
          params.set('keywordInsights', JSON.stringify(keywordsData));
        }
      }
      
      const url = `/results?${params.toString()}`;
      console.log('Navigating to:', url);
      navigate(url);
    };
    
    reader.readAsDataURL(file);
  }, [file, jobRole, navigate, isPremium, realTimeData, user, showToast, updateField, validateForm, addNotification]);

  // Handler for continuing with real-time feedback (for premium users)
  const handleContinueWithFeedback = useCallback(() => {
    if (!user) {
      updateField('showLoginModal', true);
      return;
    }

    if (!file || !jobRole || !isPremium) {
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target?.result as string;
      const base64Content = fileContent.split('base64,')[1] || '';
      
      const params = new URLSearchParams();
      params.set('jobRoleId', jobRole);
      params.set('fileName', file.name);
      params.set('resumeContent', base64Content);
      params.set('realtimeMode', 'true');
      
      if (realTimeData && realTimeData.keywordMatches) {
        const keywordsData = {
          matched: realTimeData.keywordMatches.matched || [],
          missing: realTimeData.keywordMatches.missing || []
        };
        params.set('keywordInsights', JSON.stringify(keywordsData));
      }

      navigate(`/results?${params.toString()}`);
    };
    
    reader.readAsDataURL(file);
  }, [file, jobRole, navigate, isPremium, realTimeData, user, updateField]);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50 text-gray-900 dark:bg-slate-900 dark:text-neutral-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Upload Form Content */}
          <Card className="border-0 shadow-lg dark:shadow-slate-900/50">
            <CardHeader>
              <CardTitle>Resume Analysis{isPremium && <span className="text-gradient-premium dark:text-gradient-gold ml-2">Premium</span>}</CardTitle>
              <CardDescription>
                {isPremium 
                  ? "Unlock our advanced real-time analysis with premium-exclusive insights" 
                  : "Watch as we analyze your resume and provide instant feedback"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* File Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Upload Resume *
                    </label>
                    <FileUpload 
                      onFileSelected={handleFileSelect}
                      accept=".pdf,.docx"
                      maxSize={5 * 1024 * 1024}
                      isLoading={isLoadingPDF}
                      loadingText="Processing PDF file..."
                    />
                    {pdfError && (
                      <div className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{pdfError}</span>
                      </div>
                    )}
                    {errors.file && (
                      <div className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{errors.file}</span>
                      </div>
                    )}
                    {isLoadingPDF && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <LoadingSpinner size="sm" />
                        <span>Processing PDF file...</span>
                      </div>
                    )}
                  </div>

                  {/* PDF Preview Section */}
                  {file && !pdfError && (
                    <div>
                      <div className="mt-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                          <h4 className="text-sm font-medium p-4 border-b dark:border-gray-700">
                            Resume Preview
                          </h4>
                          <ImprovedPdfViewer 
                            file={file}
                            height={400}
                            scale={1.0}
                            className="rounded shadow-inner"
                            onError={(err, errorCode) => {
                              console.error("PDF Error:", errorCode, err);
                              showToast(`Error loading PDF: ${err?.message || 'Unknown error'}. Try again.`, 'error');
                            }}
                            allowRetry={true}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Job Role Selection */}
                  <div>
                    <label htmlFor="jobRole" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Job Role *
                    </label>
                    <select
                      id="jobRole"
                      value={jobRole}
                      onChange={(e) => updateField('jobRole', e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                      required
                    >
                      <option value="">Select a job role</option>
                      {mockJobRoles.map((role) => (
                        <option key={role.id} value={role.id}>{role.title}</option>
                      ))}
                    </select>
                    {errors.jobRole && (
                      <div className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{errors.jobRole}</span>
                      </div>
                    )}
                  </div>

                  {/* Analysis Progress */}
                  <AnimatePresence mode="wait">
                    {isAnalyzing && (
                      <m.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/40 dark:to-indigo-800/40 border border-indigo-200 dark:border-indigo-700 p-4 rounded-lg"
                      >
                        <h3 className="flex items-center text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-3">
                          <Loader2 className="animate-spin mr-2" /> Analyzing Resume...
                        </h3>
                        <ProgressBar progress={progress} stages={stages} className="mt-2" />
                      </m.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {analysis && !isAnalyzing && (
                      <m.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50"
                      >
                        <CheckCircle className="h-5 w-5" />
                        <span>Analysis complete!</span>
                        <Button
                          size="sm"
                          className="ml-2 bg-white text-green-600 hover:bg-green-100"
                          onClick={() =>
                            navigate(
                              `/results?jobRoleId=${jobRole}&fileName=${encodeURIComponent(
                                file!.name
                              )}`
                            )
                          }
                        >
                          View Detailed Results
                        </Button>
                      </m.div>
                    )}
                  </AnimatePresence>

                  {/* Premium Real-time Analysis Section */}
                  {isPremium && isAnalyzing && (
                    <m.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4"
                    >
                      <RealTimeFeedbackViz 
                        isActive={isRealTimeActive}
                        liveFeedback={realTimeData?.liveFeedback}
                        atsScoreTrend={realTimeData?.atsScoreTrend}
                        recentKeywordMatches={realTimeData?.keywordMatches?.realtimeMatches}
                        jobDescriptionSimilarity={realTimeData?.jobDescriptionSimilarity}
                      />
                    </m.div>
                  )}

                  {/* Premium Upgrade Prompt */}
                  {!isPremium && isAnalyzing && (
                    <m.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-4 p-4 border border-dashed border-premium-300 dark:border-premium-700 rounded-lg bg-premium-50/30 dark:bg-premium-900/10"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <Zap className="w-4 h-4 text-premium-500 mr-2" />
                          <h3 className="text-sm font-medium text-premium-700 dark:text-premium-300">
                            Get Premium Real-Time Analysis
                          </h3>
                        </div>
                        <Badge variant="outline" className="text-xs text-premium-600 dark:text-premium-400 bg-premium-50 dark:bg-premium-900/30 border-premium-200 dark:border-premium-700">
                          Upgrade Required
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                        Premium users receive instant format checks, live keyword insights, and actionable suggestions in real-time.
                      </p>
                      <Button 
                        size="sm" 
                        variant="premium"
                        className="w-full"
                        onClick={() => openPaymentModal('monthly')}
                      >
                        Upgrade to Premium
                      </Button>
                    </m.div>
                  )}

                  <div className="flex justify-end items-center gap-3 mt-8">
                    {isPremium && realTimeData && realTimeData.liveFeedback && realTimeData.liveFeedback.length > 0 && (
                      <Button
                        type="button"
                        onClick={handleContinueWithFeedback}
                        disabled={isAnalyzing}
                        variant="outline"
                        className="border-premium-200 dark:border-premium-700 text-premium-600 dark:text-premium-400 hover:bg-premium-50 dark:hover:bg-premium-900/20"
                      >
                        <Zap className="mr-2 h-4 w-4" />
                        Continue with Feedback
                      </Button>
                    )}
                    <Button
                      type="submit"
                      disabled={!file || !jobRole || isAnalyzing || isLoadingPDF}
                      className={isPremium ? "" : "ml-auto"}
                      variant={isPremium ? "premium" : "default"}
                    >
                      {isAnalyzing ? 'Analyzing...' : 'View Detailed Analysis'}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal section */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => updateField('showLoginModal', false)}
        onSignUpClick={() => {
          updateField('showLoginModal', false);
          updateField('showSignupModal', true);
        }}
      />
      <SignUpModal
        isOpen={showSignupModal}
        onClose={() => updateField('showSignupModal', false)}
        onLoginClick={() => {
          updateField('showSignupModal', false);
          updateField('showLoginModal', true);
        }}
      />
    </div>
  );
}
