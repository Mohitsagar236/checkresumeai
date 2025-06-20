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
import { CheckCircle, Loader2, Zap, AlertTriangle, FileText } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';
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
    errors 
  } = useOptimizedFormState({
    file: null as File | null,
    jobRole: '',
    showLoginModal: false,
    showSignupModal: false,
    hasPreviousAnalysis: false,
    continueIteration: false
  }, {
    file: (value: File | null) => value ? true : 'Please upload a resume file',
    jobRole: (value: string) => value ? true : 'Please select a job role'
  });

  // Extract form values for easier access
  const { file, jobRole, showLoginModal, showSignupModal, hasPreviousAnalysis, continueIteration } = formState;

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
      
      // Store basic analysis info in session storage for potential future iterations
      const analysisData = {
        fileName: file.name,
        jobRoleId: jobRole,
        timestamp: Date.now()
      };
      sessionStorage.setItem('previousAnalysis', JSON.stringify(analysisData));
      
      // Set state to indicate that there's a previous analysis available
      updateField('hasPreviousAnalysis', true);
      
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
  }, [file, jobRole, navigate, isPremium, realTimeData, user, updateField]);  // Use ref for one-time checks that won't trigger re-renders
  const didInitialCheck = React.useRef(false);
  
  // Separate effect to handle previous analysis detection - ONLY on first render
  React.useEffect(() => {
    if (didInitialCheck.current) return;
    didInitialCheck.current = true;
    
    const previousAnalysis = sessionStorage.getItem('previousAnalysis');
    if (previousAnalysis && !hasPreviousAnalysis) {
      // Set initial values directly in sessionStorage instead of state updates
      sessionStorage.setItem('hasPreviousAnalysisDetected', 'true');
      // Schedule the state update for the next tick to avoid update cycles
      setTimeout(() => {
        updateField('hasPreviousAnalysis', true);
      }, 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [/* empty deps array to run once */]);  // Handle continuing iteration on previous analysis
  // Avoid direct calls to updateField within the callback by using a ref
  const isProcessingAuth = React.useRef(false);
  
  const handleContinueIteration = useCallback(() => {
    // Prevent multiple state updates if already processing
    if (isProcessingAuth.current) return;
    
    // Handle authentication
    if (!user && !showLoginModal) {
      isProcessingAuth.current = true;
      // Defer state update to next tick to break update cycles
      setTimeout(() => {
        updateField('showLoginModal', true);
        isProcessingAuth.current = false;
      }, 0);
      return;
    }

    if (!file || !jobRole) {
      showToast('Please upload a resume and select a job role.', 'error');
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
      params.set('continueIteration', 'true');
      
      if (realTimeData && realTimeData.keywordMatches) {
        const keywordsData = {
          matched: realTimeData.keywordMatches.matched || [],
          missing: realTimeData.keywordMatches.missing || []
        };
        params.set('keywordInsights', JSON.stringify(keywordsData));
      }

      // Add previous analysis data from session storage
      const previousAnalysis = sessionStorage.getItem('previousAnalysis');
      if (previousAnalysis) {
        params.set('previousAnalysis', previousAnalysis);
      }

      navigate(`/results?${params.toString()}`);
    };
    
    reader.readAsDataURL(file);
  }, [file, jobRole, navigate, realTimeData, user, showToast, updateField]);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 text-gray-900 dark:text-neutral-100">
      {/* Premium background pattern */}
      <div className="absolute inset-0 bg-dot-pattern opacity-30 dark:opacity-10"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="max-w-4xl mx-auto">
          {/* Enhanced Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-premium-display font-bold mb-4">
              <span className="text-gradient-luxury">Upload Your Resume</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-luxury">
              {isPremium 
                ? "Experience our premium AI-powered analysis with real-time insights and advanced recommendations" 
                : "Get instant feedback and comprehensive analysis of your resume"}
            </p>
          </div>

          {/* Upload Form Content */}
          <Card className="card-premium shadow-luxury-xl border-gradient-luxury">
            <CardHeader className="bg-gradient-to-r from-blue-50/50 to-purple-50/30 dark:from-slate-800/50 dark:to-slate-700/30 border-b border-gray-100/50 dark:border-gray-700/50">
              <CardTitle className="text-2xl font-premium-display flex items-center">
                Resume Analysis
                {isPremium && (
                  <span className="ml-3 px-3 py-1 text-sm bg-gradient-luxury-purple text-white rounded-full shadow-luxury premium-shimmer">
                    Premium
                  </span>
                )}
              </CardTitle>
              <CardDescription className="text-lg">
                {isPremium 
                  ? "Experience advanced real-time analysis with premium-exclusive insights and actionable recommendations" 
                  : "Upload your resume to receive detailed analysis and improvement suggestions"}
              </CardDescription>
            </CardHeader>            <CardContent className="p-8">
              <form onSubmit={handleSubmit}>
                <div className="space-y-8">
                  {/* File Upload Section */}
                  <div className="space-y-4">
                    <label className="block text-lg font-luxury text-gray-700 dark:text-gray-300">
                      Upload Resume *
                    </label>
                    <div className="relative">
                      <FileUpload 
                        onFileSelected={handleFileSelect}
                        accept=".pdf,.docx"
                        maxSize={5 * 1024 * 1024}
                        isLoading={isLoadingPDF}
                        loadingText="Processing PDF file..."
                      />
                      {pdfError && (
                        <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
                          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                            <AlertTriangle className="w-5 h-5" />
                            <span className="font-medium">{pdfError}</span>
                          </div>
                        </div>
                      )}
                      {errors.file && (
                        <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
                          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                            <AlertTriangle className="w-5 h-5" />
                            <span className="font-medium">{errors.file}</span>
                          </div>
                        </div>
                      )}
                      {isLoadingPDF && (
                        <div className="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50">
                          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
                            <LoadingSpinner size="sm" />
                            <span className="font-medium">Processing PDF file...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>                  {/* PDF Preview Section */}
                  {file && !pdfError && (
                    <div className="space-y-4">
                      <div className="card-premium shadow-luxury rounded-xl overflow-hidden border-gradient-luxury">
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800/50 dark:to-slate-700/30 px-6 py-4 border-b border-gray-100/50 dark:border-gray-700/50">
                          <h4 className="text-lg font-luxury text-gray-900 dark:text-white flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                            Resume Preview
                          </h4>
                        </div>
                        <div className="p-1">
                          <ImprovedPdfViewer 
                            file={file}
                            height={400}
                            scale={1.0}
                            className="rounded-lg shadow-inner"
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
                  <div className="space-y-4">
                    <label htmlFor="jobRole" className="block text-lg font-luxury text-gray-700 dark:text-gray-300">
                      Target Job Role *
                    </label>
                    <select
                      id="jobRole"
                      value={jobRole}
                      onChange={(e) => updateField('jobRole', e.target.value)}
                      className="w-full px-4 py-3 text-lg rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-200 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600"
                      required
                    >
                      <option value="">Select a job role</option>
                      {mockJobRoles.map((role) => (
                        <option key={role.id} value={role.id}>{role.title}</option>
                      ))}
                    </select>
                    {errors.jobRole && (
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                          <AlertTriangle className="w-5 h-5" />
                          <span className="font-medium">{errors.jobRole}</span>
                        </div>
                      </div>
                    )}
                  </div>                  {/* Analysis Progress */}
                  <AnimatePresence mode="wait">
                    {isAnalyzing && (
                      <m.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="card-premium shadow-luxury-lg p-8 rounded-xl bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 border-gradient-luxury"
                      >
                        <h3 className="flex items-center text-2xl font-premium-display text-blue-600 dark:text-blue-400 mb-6">
                          <Loader2 className="animate-spin mr-3 w-6 h-6" /> 
                          <span className="text-gradient-premium-blue">Analyzing Resume...</span>
                        </h3>
                        <ProgressBar progress={progress} stages={stages} className="mt-4" />
                        
                        {/* Enhanced progress indicators */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Document Analysis</p>
                          </div>
                          <div className="text-center p-4 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                              <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Processing</p>
                          </div>
                          <div className="text-center p-4 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
                            <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Results Generation</p>
                          </div>
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>                  <AnimatePresence>
                    {analysis && !isAnalyzing && (
                      <m.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-6 right-6 card-premium bg-gradient-luxury-blue text-white px-6 py-4 rounded-xl shadow-luxury-xl flex items-center space-x-3 z-50 max-w-sm"
                      >
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <CheckCircle className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">Analysis Complete!</p>
                          <p className="text-sm opacity-90">Your results are ready</p>
                        </div>
                        <Button
                          size="sm"
                          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white"
                          onClick={() =>
                            navigate(
                              `/results?jobRoleId=${jobRole}&fileName=${encodeURIComponent(
                                file!.name
                              )}`
                            )
                          }
                        >
                          View Results
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
                  )}                  {/* Premium Upgrade Prompt */}
                  {!isPremium && isAnalyzing && (
                    <m.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="card-premium shadow-luxury-lg p-6 rounded-xl border-gradient-luxury"
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-luxury-purple flex items-center justify-center premium-shimmer">
                          <Zap className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-premium-display text-gradient-luxury mb-2">
                          Unlock Premium Real-Time Analysis
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                          Premium users receive instant format checks, live keyword insights, and actionable suggestions in real-time as the analysis progresses.
                        </p>
                        
                        {/* Premium features preview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 text-sm">
                          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50">
                            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              <span>Real-time keyword analysis</span>
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/50">
                            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                              <span>Instant format feedback</span>
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50">
                            <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span>Live ATS score updates</span>
                            </div>
                          </div>
                          <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50">
                            <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                              <span>Advanced recommendations</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          size="lg" 
                          className="btn-premium-luxury w-full md:w-auto"
                          onClick={() => openPaymentModal('monthly')}
                        >
                          <Zap className="mr-2 h-5 w-5" />
                          Upgrade to Premium
                        </Button>
                      </div>
                    </m.div>
                  )}                  <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-4 mt-12 pt-8 border-t border-gray-100/50 dark:border-gray-700/50">
                    {isPremium && realTimeData && realTimeData.liveFeedback && realTimeData.liveFeedback.length > 0 && (
                      <Button
                        type="button"
                        onClick={handleContinueWithFeedback}
                        disabled={isAnalyzing}
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto min-w-[200px] border-2 border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium"
                      >
                        <Zap className="mr-2 h-5 w-5" />
                        Continue with Live Feedback
                      </Button>
                    )}
                    
                    {hasPreviousAnalysis && !isAnalyzing && (
                      <Button
                        type="button"
                        onClick={handleContinueIteration}
                        disabled={!file || !jobRole || isLoadingPDF}
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto min-w-[200px] border-2 border-emerald-200 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 font-medium"
                      >
                        <CheckCircle className="mr-2 h-5 w-5" />
                        <span className="hidden sm:inline">Continue to Iterate</span>
                        <span className="sm:hidden">Iterate</span>
                      </Button>
                    )}
                    
                    <Button
                      type="submit"
                      disabled={!file || !jobRole || isAnalyzing || isLoadingPDF}
                      size="lg"
                      className={`w-full sm:w-auto min-w-[200px] px-6 py-3 ${isPremium ? "btn-premium-luxury" : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-luxury hover:shadow-luxury-lg transform hover:-translate-y-1 transition-all duration-300"} font-medium text-base`}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="animate-spin mr-2 h-5 w-5" />
                          <span className="hidden sm:inline">Analyzing Your Resume...</span>
                          <span className="sm:hidden">Analyzing...</span>
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2 h-5 w-5" />
                          {isPremium ? 'Premium Analysis' : 'Start Analysis'}
                        </>
                      )}
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

export default UploadPage;
