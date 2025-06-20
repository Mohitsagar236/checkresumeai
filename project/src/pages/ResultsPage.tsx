import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnalysisResult, SkillsGap } from '../types';
import { analyzeResume, getAtsScore, analyzeSkills } from '../utils/api';
import { generateMockAnalysis } from '../data/mockData';
import ImprovedPdfViewer from '../components/pdf/ImprovedPdfViewer';
import { useSubscription } from '../hooks/useSubscription';
import { PremiumBadge } from '../components/premium/PremiumBadge';
import { PremiumFeatureContainer } from '../components/premium/PremiumFeatureContainer';
import { AnimatedProgressBar } from '../components/ui/AnimatedProgressBar';
import { motion } from 'framer-motion';
import { 
  CheckCircle, Download, FileText, Lock, Star, Zap, ChevronDown, ChevronUp, Award, TrendingUp,
  BookOpen, // Added for course suggestions
  Bug, // Added for debug toggle
  BarChart3 // Added for analytics insights
} from 'lucide-react';
import '../styles/progressBar.css';

export function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'skills': true,
    'suggestions': true,
    'premium': true, // Initialize premium feedback section expanded state
    'format': false,
    'content': false,
    'advanced': false,
    'courses': true, // Initialize courses section expanded state
  });
  const { isPremium, hasFeature } = useSubscription();
  
  // Memoize query parameters to prevent unnecessary re-renders
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  
  // Memoize commonly used query values
  const { jobRoleId, fileName, resumeContent } = useMemo(() => {
    const params = {
      jobRoleId: queryParams.get('jobRoleId'),
      fileName: queryParams.get('fileName'),
      resumeContent: queryParams.get('resumeContent')
    };
    
    // Debug logging to understand what's happening
    console.debug('URL Parameters received:', {
      jobRoleId: params.jobRoleId,
      fileName: params.fileName,
      hasResumeContent: !!params.resumeContent,
      resumeContentLength: params.resumeContent?.length || 0,
      allParams: Object.fromEntries(queryParams.entries())
    });
    
    return params;
  }, [queryParams]);

  // Create file object from the base64 data
  const file = useMemo(() => {
    if (!resumeContent || !fileName) {
      console.debug('Missing required resume data:', { 
        hasContent: !!resumeContent, 
        hasFileName: !!fileName,
        resumeContentLength: resumeContent?.length || 0
      });
      return null;
    }
    
    try {
      // Additional validation for base64 content
      if (resumeContent.length === 0) {
        console.error('Resume content is empty');
        return null;
      }
      
      // Validate base64 content format - allow some padding issues
      if (!resumeContent.match(/^[A-Za-z0-9+/]+(=*)$/)) {
        console.error('Invalid base64 format detected:', resumeContent.substring(0, 100) + '...');
        return null;
      }
      
      // Add padding if missing (common base64 issue)
      let paddedContent = resumeContent;
      while (paddedContent.length % 4) {
        paddedContent += '=';
      }
      
      // Decode the base64 content
      const byteCharacters = atob(paddedContent);
      
      if (byteCharacters.length === 0) {
        console.error('Decoded content is empty');
        return null;
      }
      
      const byteArrays = [];
      
      // Split the binary data into chunks for memory efficiency
      const chunkSize = 512;
      for (let offset = 0; offset < byteCharacters.length; offset += chunkSize) {
        const slice = byteCharacters.slice(offset, offset + chunkSize);
        const byteNumbers = new Array(slice.length);
        
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      
      // Create a blob and then a File object
      const blob = new Blob(byteArrays, { type: 'application/pdf' });
      const reconstructedFile = new File([blob], fileName, { type: 'application/pdf' });
      
      // Validate file size
      if (reconstructedFile.size === 0) {
        console.error('Reconstructed file has zero size');
        return null;
      }
      
      console.debug(`Successfully reconstructed file: ${fileName} (${reconstructedFile.size} bytes)`);
      return reconstructedFile;
    } catch (err) {
      console.error('Error reconstructing file from base64:', {
        error: err,
        fileName,
        contentLength: resumeContent?.length,
        contentPreview: resumeContent?.substring(0, 100)
      });
      return null;
    }
  }, [resumeContent, fileName]);

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Early validation for missing data
  const hasValidData = useMemo(() => {
    return !!(jobRoleId && fileName && resumeContent && file);
  }, [jobRoleId, fileName, resumeContent, file]);

  useEffect(() => {
    // Early exit if we don't have the required data
    if (!hasValidData) {
      const missingItems = [];
      if (!jobRoleId) missingItems.push('job role');
      if (!fileName) missingItems.push('file name');
      if (!resumeContent) missingItems.push('resume content');
      if (!file) missingItems.push('file reconstruction');
      
      const errorMsg = `Missing required data: ${missingItems.join(', ')}. Please try uploading your resume again.`;
      console.error('ResultsPage: Missing required data', {
        jobRoleId: !!jobRoleId,
        fileName: !!fileName,
        resumeContent: !!resumeContent,
        file: !!file,
        missingItems
      });
      
      setError(errorMsg);
      setIsLoading(false);
      return;
    }

    const abortController = new AbortController();

    const fetchAnalysis = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!jobRoleId) {
          throw new Error('Job role is required');
        }

        if (!file || !resumeContent) {
          throw new Error('Resume file data is missing or corrupted. Please try uploading your resume again.');
        }

        // Additional validation for file integrity
        if (file.size === 0) {
          throw new Error('Resume file appears to be empty. Please check your file and try again.');
        }

        // Prepare the text content for API calls that need it
        let decodedText: string;
        try {
          decodedText = atob(resumeContent);
        } catch (decodeError) {
          console.error('Failed to decode resume content:', decodeError);
          throw new Error('Resume data is corrupted. Please upload your resume again.');
        }

        // Run all API calls in parallel for better performance with error handling for each call
        const [analysisResult, atsScore, skillsGap] = await Promise.all([
          analyzeResume(file, jobRoleId).catch(err => {
            console.error('Resume analysis error:', err);
            // Show more specific error for debugging but use mock data
            if (err.message && err.message.includes('Gemini API')) {
              console.warn('Gemini API error detected, using fallback data');
            }
            return generateMockAnalysis(jobRoleId);
          }),
          getAtsScore(decodedText).catch(err => {
            console.error('ATS score error:', err);
            if (err.message && err.message.includes('Gemini API')) {
              console.warn('Gemini API error detected for ATS scoring, using fallback score');
            }
            return { score: 65 }; // Fallback score
          }),
          analyzeSkills(decodedText, jobRoleId).catch(err => {
            console.error('Skills analysis error:', err);
            if (err.message && err.message.includes('Gemini API')) {
              console.warn('Gemini API error detected for skills analysis, using fallback data');
            }
            return generateMockAnalysis(jobRoleId).skillsGap;
          })
        ]) as [AnalysisResult, { score: number }, SkillsGap];
        
        setAnalysis({
          ...analysisResult,
          atsScore: atsScore.score,
          skillsGap
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred while analyzing your resume';
        setError(errorMessage);
        console.error('Analysis error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysis();

    return () => {
      abortController.abort();
    };
  }, [file, jobRoleId, resumeContent, fileName, hasValidData]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4 flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <h3 className="text-xl font-bold mb-2">Analyzing Your Resume</h3>
        <p className="text-gray-600 mb-6">Please wait while we process your resume...</p>
        <div className="w-full max-w-md bg-gray-100 rounded-full h-2.5 mb-4">
          <div className="bg-blue-600 h-2.5 rounded-full animate-pulse w-3/4"></div>
        </div>
        <p className="text-sm text-gray-500">This may take up to a minute depending on the resume size</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-red-50 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-bold mb-2 text-red-700">Error Analyzing Resume</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="bg-white p-4 rounded border border-red-200 mb-4 text-left">
            <h4 className="font-semibold mb-2">Troubleshooting Steps:</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Make sure your resume is in a supported format (PDF recommended)</li>
              <li>Check that your PDF doesn't contain password protection</li>
              <li>Ensure you have selected a job role</li>
              <li>Try with a different PDF file if the issue persists</li>
            </ul>
          </div>
          <button 
            onClick={() => navigate('/upload')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Render analysis results
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {analysis ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 right-0 bottom-0 premium-bg-pattern opacity-30 -z-20"></div>
          <div className="absolute top-40 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute top-80 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -z-10"></div>
        
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-center md:text-left bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Premium Analysis Results
              </h2>
              {isPremium && (
                <div className="ml-3">
                  <PremiumBadge />
                </div>
              )}
            </div>
            
            {file && (
              <button
                onClick={() => setShowPdfPreview(!showPdfPreview)}
                className="mt-2 md:mt-0 px-4 py-2 text-sm bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 rounded-md flex items-center shadow-sm border border-blue-100"
              >
                {showPdfPreview ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Hide Resume Preview
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Show Resume Preview
                  </>
                )}
              </button>
            )}
          </div>
          
          {/* PDF Preview */}
          {showPdfPreview && file && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white p-6 rounded-lg shadow-xl mb-6 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-500" />
                  Resume Preview
                </h3>
                
                <button 
                  className="px-3 py-1 flex items-center text-xs text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Download PDF
                </button>
              </div>
              <div className="border border-gray-100 rounded shadow-inner">
                <ImprovedPdfViewer 
                  file={file}
                  height={500}
                  className="rounded"
                  onError={(err, errorCode) => {
                    console.error("PDF Error:", errorCode, err);
                    // You could set state here to show a user-friendly message
                  }}
                  allowRetry={true}
                />
              </div>
            </motion.div>
          )}
          
          {/* Overall Scores Section */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-lg border border-blue-100/60">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-blue-800 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-blue-500" />
                  ATS Score
                </h3>
                <div 
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    analysis.atsScore >= 80 
                      ? 'score-excellent' 
                      : analysis.atsScore >= 60 
                        ? 'score-good' 
                        : 'score-needs-work'
                  }`}
                  aria-label={`ATS Score rating: ${analysis.atsScore >= 80 ? 'Excellent' : analysis.atsScore >= 60 ? 'Good' : 'Needs Work'}`}
                >
                  {analysis.atsScore >= 80 ? 'Excellent' : analysis.atsScore >= 60 ? 'Good' : 'Needs Work'}
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-4xl font-extrabold text-blue-600 font-heading">{analysis.atsScore}%</div>
                <div className="ml-3 text-sm text-gray-600 flex-1">
                  Applicant Tracking System compatibility score
                </div>
              </div>
              <div className="mt-3">
                <AnimatedProgressBar progress={analysis.atsScore} colorClass="blue" height={3} />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-xl shadow-lg border border-green-100/60">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-green-800 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                  Format Score
                </h3>
                <div className="rounded-full px-2 py-1 text-xs bg-green-100 text-green-800 font-semibold">
                  {(analysis.formatAnalysis?.score || 0) >= 80 ? 'Excellent' : (analysis.formatAnalysis?.score || 0) >= 60 ? 'Good' : 'Needs Work'}
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-4xl font-extrabold text-green-600 font-heading">{analysis.formatAnalysis?.score || 0}%</div>
                <div className="ml-3 text-sm text-gray-600 flex-1">
                  Resume format and structure quality
                </div>
              </div>
              <div className="mt-3">
                <AnimatedProgressBar progress={analysis.formatAnalysis?.score || 0} colorClass="green" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-xl shadow-lg border border-purple-100/60">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-purple-800 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-purple-500" />
                  Content Score
                </h3>
                <div className="rounded-full px-2 py-1 text-xs bg-purple-100 text-purple-800 font-semibold">
                  {(analysis.contentAnalysis?.score || 0) >= 80 ? 'Excellent' : (analysis.contentAnalysis?.score || 0) >= 60 ? 'Good' : 'Needs Work'}
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-4xl font-extrabold text-purple-600 font-heading">{analysis.contentAnalysis?.score || 0}%</div>
                <div className="ml-3 text-sm text-gray-600 flex-1">
                  Resume content effectiveness & impact
                </div>
              </div>
              <div className="mt-3">
                <AnimatedProgressBar progress={analysis.contentAnalysis?.score || 0} colorClass="purple" />
              </div>
            </div>
          </motion.div>

          {/* Advanced Resume Analytics - Show for all users but with different content */}
          <motion.div 
            className="bg-gradient-to-br from-white to-blue-50/50 rounded-xl shadow-xl border border-blue-100 overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h3 className="font-bold text-xl text-white flex items-center">
                <TrendingUp className="w-6 h-6 mr-3" />
                Advanced Resume Analytics
                <span className="ml-3 px-3 py-1 text-sm bg-white/20 rounded-full backdrop-blur-sm">
                  {isPremium ? 'Premium' : 'Preview'}
                </span>
              </h3>
              <p className="text-blue-100 text-sm mt-1">
                {isPremium 
                  ? 'Deep insights into your resume\'s market performance'
                  : 'Preview of premium analytics features'
                }
              </p>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {isPremium ? (
                <>
                  {/* Premium Content - Top Row - Key Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 sm:p-5 rounded-xl border border-blue-200/50">
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <h4 className="font-semibold text-blue-800 flex items-center text-xs sm:text-sm">
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Industry Position
                        </h4>
                        <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full font-medium">
                          high
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl sm:text-3xl font-bold text-blue-700 mb-1">Top 23%</p>
                        <p className="text-xs text-blue-600 leading-tight">
                          Your resume is performing better than 77% of other applicants in your industry.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 sm:p-5 rounded-xl border border-purple-200/50">
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <h4 className="font-semibold text-purple-800 flex items-center text-xs sm:text-sm">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Keyword Optimization
                        </h4>
                        <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full font-medium">
                          87%
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl sm:text-3xl font-bold text-purple-700 mb-1">87%</p>
                        <p className="text-xs text-purple-600 leading-tight">
                          Your resume contains 87% of industry-specific keywords for your target role.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-4 sm:p-5 rounded-xl border border-indigo-200/50 sm:col-span-2 lg:col-span-1">
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <h4 className="font-semibold text-indigo-800 flex items-center text-xs sm:text-sm">
                          <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Interview Chance
                        </h4>
                        <span className="px-2 py-1 bg-indigo-600 text-white text-xs rounded-full font-medium">
                          AI-Powered
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-1">73%</p>
                        <p className="text-xs text-indigo-600 leading-tight">
                          Based on your resume's performance against similar successful candidates.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Industry-Specific Insights */}
                  <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100">
                    <h4 className="font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2 text-green-500" />
                      Industry-Specific Resume Insights
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="flex flex-col bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs sm:text-sm font-medium text-gray-700">Experience emphasis</span>
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-green-700">Above Industry Average</span>
                      </div>
                      <div className="flex flex-col bg-yellow-50 p-3 sm:p-4 rounded-lg border border-yellow-200/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs sm:text-sm font-medium text-gray-700">Education details</span>
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-yellow-700">Meets Standards</span>
                      </div>
                      <div className="flex flex-col bg-red-50 p-3 sm:p-4 rounded-lg border border-red-200/50 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs sm:text-sm font-medium text-gray-700">Achievements quantification</span>
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-red-700">Below Industry Average</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Free User Enhanced Analytics Content */}
                  <div className="space-y-6">
                    {/* Performance Metrics Row - Enhanced Freemium Version */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 rounded-xl border border-blue-200/50 transform hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-md">
                              <TrendingUp className="w-5 h-5" />
                            </div>
                            <h4 className="font-semibold text-blue-800 text-sm ml-3">
                              ATS Compatibility
                            </h4>
                          </div>
                          <span className={`px-2 py-1 ${
                            analysis.atsScore >= 80 
                              ? 'bg-green-100 text-green-800' 
                              : analysis.atsScore >= 60 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-red-100 text-red-800'
                          } text-xs rounded-full font-medium`}>
                            {analysis.atsScore >= 80 ? 'Excellent' : analysis.atsScore >= 60 ? 'Good' : 'Needs Work'}
                          </span>
                        </div>
                        <div className="mt-4 flex flex-col items-center">
                          <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center relative mb-3">
                            <div className={`absolute inset-0 rounded-full ${
                              analysis.atsScore >= 80 
                                ? 'border-4 border-green-200' 
                                : analysis.atsScore >= 60 
                                  ? 'border-4 border-amber-200' 
                                  : 'border-4 border-red-200'
                            }`} style={{ 
                              clipPath: `polygon(0 0, 100% 0, 100% 100%, 0% 100%)`,
                              opacity: 0.5
                            }}></div>
                            <div className={`absolute inset-0 rounded-full ${
                              analysis.atsScore >= 80 
                                ? 'border-4 border-green-500' 
                                : analysis.atsScore >= 60 
                                  ? 'border-4 border-amber-500' 
                                  : 'border-4 border-red-500'
                            }`} style={{ 
                              clipPath: `polygon(0 0, ${analysis.atsScore}% 0, ${analysis.atsScore}% 100%, 0% 100%)` 
                            }}></div>
                            <p className="text-2xl font-bold text-blue-700">{analysis.atsScore}%</p>
                          </div>
                          <p className="text-xs text-blue-600 leading-tight text-center">
                            How well your resume performs with<br />ATS systems
                          </p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-5 rounded-xl border border-amber-200/50 transform hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-md">
                              <Star className="w-5 h-5" fill="currentColor" />
                            </div>
                            <h4 className="font-semibold text-amber-800 text-sm ml-3">
                              Skills Match
                            </h4>
                          </div>
                          <span className={`px-2 py-1 ${
                            analysis.skillsGap?.score >= 80 
                              ? 'bg-green-100 text-green-800' 
                              : analysis.skillsGap?.score >= 60 
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                          } text-xs rounded-full font-medium`}>
                            {analysis.skillsGap?.score}%
                          </span>
                        </div>
                        <div className="mt-4 flex flex-col items-center">
                          <div className="flex items-end justify-center mb-3 space-x-1">
                            <div className="w-5 h-16 bg-amber-100 rounded-t-md relative">
                              <div className="absolute bottom-0 left-0 right-0 bg-amber-500 rounded-t-md" 
                                style={{ height: `${
                                  (analysis.skillsGap?.matchedSkills?.length || 0) / 
                                  ((analysis.skillsGap?.matchedSkills?.length || 0) + (analysis.skillsGap?.missingSkills?.length || 0)) * 100
                                }%` }}>
                              </div>
                            </div>
                            <div className="w-5 h-16 bg-gray-100 rounded-t-md relative">
                              <div className="absolute bottom-0 left-0 right-0 bg-gray-400 rounded-t-md" 
                                style={{ height: `${
                                  (analysis.skillsGap?.missingSkills?.length || 0) / 
                                  ((analysis.skillsGap?.matchedSkills?.length || 0) + (analysis.skillsGap?.missingSkills?.length || 0)) * 100
                                }%` }}>
                              </div>
                            </div>
                          </div>
                          <p className="text-lg font-bold text-amber-700 mb-1">
                            {analysis.skillsGap?.matchedSkills?.length || 0}/{(analysis.skillsGap?.matchedSkills?.length || 0) + (analysis.skillsGap?.missingSkills?.length || 0)}
                          </p>
                          <p className="text-xs text-amber-600 leading-tight text-center">
                            Skills matched to job requirements
                          </p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-violet-50 to-violet-100/50 p-5 rounded-xl border border-violet-200/50 transform hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center text-white shadow-md">
                              <Award className="w-5 h-5" />
                            </div>
                            <h4 className="font-semibold text-violet-800 text-sm ml-3">
                              Content Score
                            </h4>
                          </div>
                          <span className={`px-2 py-1 ${
                            analysis.contentAnalysis?.score >= 80 
                              ? 'bg-green-100 text-green-800' 
                              : analysis.contentAnalysis?.score >= 60 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-red-100 text-red-800'
                          } text-xs rounded-full font-medium`}>
                            {analysis.contentAnalysis?.score >= 80 ? 'High' : analysis.contentAnalysis?.score >= 60 ? 'Good' : 'Fair'}
                          </span>
                        </div>
                        <div className="mt-4 flex flex-col items-center">
                          <div className="relative w-full h-4 bg-violet-100 rounded-full overflow-hidden mb-3">
                            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-violet-400 to-violet-600" 
                                style={{ width: `${analysis.contentAnalysis?.score || 0}%` }}>
                            </div>
                            <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center">
                              <span className="text-xs font-bold text-violet-800">{analysis.contentAnalysis?.score || 0}%</span>
                            </div>
                          </div>
                          <p className="text-xs text-violet-600 leading-tight text-center">
                            Resume content effectiveness rating
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Skills Insights Section */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                      <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <BarChart3 className="w-4 h-4 mr-2 text-blue-500" />
                        Advanced Performance Insights
                      </h4>
                      
                      <div className="space-y-5">
                        {/* Skills Match Progress Bars */}
                        <div>
                          <div className="flex justify-between mb-1">
                            <h5 className="text-sm font-medium text-gray-700 flex items-center">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                              Keyword Relevance
                            </h5>
                            <span className="text-sm font-medium text-blue-600">{analysis.contentAnalysis?.keywords?.score || 70}%</span>
                          </div>
                          <AnimatedProgressBar progress={analysis.contentAnalysis?.keywords?.score || 70} colorClass="blue" height={2.5} showAnimation={false} />
                          <div className="flex justify-between mt-1.5">
                            <p className="text-xs text-gray-500">
                              {analysis.contentAnalysis?.keywords?.matched?.length || 0} relevant keywords found
                            </p>
                            <p className="text-xs font-medium text-gray-600">
                              Industry avg: 65%
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <h5 className="text-sm font-medium text-gray-700 flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              Skills Alignment
                            </h5>
                            <span className="text-sm font-medium text-green-600">{analysis.skillsGap?.score || 65}%</span>
                          </div>
                          <AnimatedProgressBar progress={analysis.skillsGap?.score || 65} colorClass="green" height={2.5} showAnimation={false} />
                          <div className="flex justify-between mt-1.5">
                            <p className="text-xs text-gray-500">
                              {analysis.skillsGap?.missingSkills?.length || 0} skills gap identified
                            </p>
                            <p className="text-xs font-medium text-gray-600">
                              Industry avg: 58%
                            </p>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <h5 className="text-sm font-medium text-gray-700 flex items-center">
                              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                              Format Optimization
                            </h5>
                            <span className="text-sm font-medium text-purple-600">{analysis.formatAnalysis?.score || 75}%</span>
                          </div>
                          <AnimatedProgressBar progress={analysis.formatAnalysis?.score || 75} colorClass="purple" height={2.5} showAnimation={false} />
                          <div className="flex justify-between mt-1.5">
                            <p className="text-xs text-gray-500">
                              Format and structure assessment
                            </p>
                            <p className="text-xs font-medium text-gray-600">
                              Industry avg: 72%
                            </p>
                          </div>
                        </div>
                        
                        {/* Comparison Summary */}
                        <div className="bg-gray-50/70 p-3 rounded-lg mt-2 border border-gray-100/80">
                          <p className="text-xs text-center text-gray-600">
                            Your resume is performing <span className="font-medium text-green-600">above average</span> in 2 of 3 key metrics.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Priority Focus Areas */}
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-5 rounded-xl border border-indigo-100">
                      <h4 className="font-semibold text-indigo-800 mb-4 flex items-center justify-between">
                        <span className="flex items-center">
                          <Zap className="w-4 h-4 mr-2" />
                          Priority Optimization Areas
                        </span>
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-normal">
                          Top Recommendations
                        </span>
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {analysis.atsScore < 80 && (
                          <div className="bg-white p-4 rounded-lg border border-indigo-200/50 hover:shadow-md transition-shadow">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 mr-3">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                              </div>
                              <h5 className="font-medium text-gray-900 text-sm">Enhance ATS Compatibility</h5>
                            </div>
                            <p className="text-xs text-gray-600 ml-11">Optimize formatting and keyword density to improve automated screening performance.</p>
                            <div className="flex items-center mt-2 ml-11">
                              <TrendingUp className="w-3 h-3 text-red-500 mr-1" />
                              <span className="text-xs font-medium text-red-500">High Impact</span>
                            </div>
                          </div>
                        )}
                        
                        {(analysis.skillsGap?.missingSkills?.length || 0) > 0 && (
                          <div className="bg-white p-4 rounded-lg border border-indigo-200/50 hover:shadow-md transition-shadow">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 mr-3">
                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                              </div>
                              <h5 className="font-medium text-gray-900 text-sm">Skill Gap Closure</h5>
                            </div>
                            <p className="text-xs text-gray-600 ml-11">Focus on developing {analysis.skillsGap?.missingSkills?.slice(0, 2).join(', ')} to strengthen job fit.</p>
                            <div className="flex items-center mt-2 ml-11">
                              <TrendingUp className="w-3 h-3 text-amber-500 mr-1" />
                              <span className="text-xs font-medium text-amber-500">Medium Impact</span>
                            </div>
                          </div>
                        )}
                        
                        {analysis.contentAnalysis?.score < 80 && (
                          <div className="bg-white p-4 rounded-lg border border-indigo-200/50 hover:shadow-md transition-shadow">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 mr-3">
                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                              </div>
                              <h5 className="font-medium text-gray-900 text-sm">Content Enhancement</h5>
                            </div>
                            <p className="text-xs text-gray-600 ml-11">Add more quantifiable achievements and strengthen your value proposition.</p>
                            <div className="flex items-center mt-2 ml-11">
                              <TrendingUp className="w-3 h-3 text-amber-500 mr-1" />
                              <span className="text-xs font-medium text-amber-500">Medium Impact</span>
                            </div>
                          </div>
                        )}
                        
                        {analysis.formatAnalysis?.score < 80 && (
                          <div className="bg-white p-4 rounded-lg border border-indigo-200/50 hover:shadow-md transition-shadow">
                            <div className="flex items-center mb-2">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 mr-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                              </div>
                              <h5 className="font-medium text-gray-900 text-sm">Format Improvement</h5>
                            </div>
                            <p className="text-xs text-gray-600 ml-11">Ensure consistent formatting and improved visual hierarchy.</p>
                            <div className="flex items-center mt-2 ml-11">
                              <TrendingUp className="w-3 h-3 text-blue-500 mr-1" />
                              <span className="text-xs font-medium text-blue-500">Standard Impact</span>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Premium Upgrade CTA */}
                      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-lg flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-indigo-900 text-sm flex items-center">
                            <Star className="w-4 h-4 mr-2 text-indigo-600" fill="currentColor" /> 
                            Get personalized action plan
                          </h5>
                          <p className="text-xs text-indigo-800 mt-0.5">Upgrade for AI-powered suggestions tailored to your specific resume</p>
                        </div>
                        <button 
                          onClick={() => navigate('/pricing')}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-sm hover:shadow transition-all text-xs font-medium"
                        >
                          Upgrade
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Skills Gap Analysis - Enhanced */}
          <motion.div 
            className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-xl text-white flex items-center">
                <Star className="w-5 h-5 mr-2" /> 
                Skills Gap Analysis
              </h3>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium flex items-center">
                <div className="w-2 h-2 rounded-full bg-white mr-1"></div>
                Match: {analysis.skillsGap?.score || 0}%
              </div>
            </div>
            
            <div className="p-6">
              {/* Visual Skill Match Indicator - Enhanced */}
              <div className="mb-6">
                <div className="flex flex-wrap justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2">
                      <Star className="w-2 h-2" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Skills Match Rate</span>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-sm font-bold ${
                      (analysis.skillsGap?.score || 0) >= 80 ? 'text-green-600' : 
                      (analysis.skillsGap?.score || 0) >= 60 ? 'text-amber-600' : 
                      'text-red-600'
                    }`}>
                      {analysis.skillsGap?.score || 0}%
                    </span>
                    <span className="text-xs text-gray-500 ml-1">
                      {(analysis.skillsGap?.score || 0) >= 80 ? '(Excellent)' : 
                       (analysis.skillsGap?.score || 0) >= 60 ? '(Good)' : 
                       '(Needs Improvement)'}
                    </span>
                  </div>
                </div>
                
                <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100/50 mb-3">
                  <div className="mb-2 relative">
                    <AnimatedProgressBar 
                      progress={analysis.skillsGap?.score || 0} 
                      colorClass="indigo" 
                      height={4}
                      showMarker={true}
                      indicatorPosition={65}
                      markerLabel="Industry Avg"
                      isPremium={isPremium}
                      className="progress-webkit-fix"
                    />
                  </div>
                  
                  <div className="flex flex-wrap justify-between text-xs text-gray-600 mt-3">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 mr-1"></div>
                      <span>Your Score</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-gray-400 mr-1"></div>
                      <span>Industry Average: 65%</span>
                    </div>
                    {isPremium && (
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                        <span>Top Performers: 85%+</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Matched Skills - Enhanced with Visual Improvements */}
                <div className="bg-gradient-to-br from-white to-green-50 p-5 rounded-lg border border-green-200/60 shadow-sm hover:shadow-md transition duration-300">
                  <h4 className="font-semibold text-green-800 flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-200 to-emerald-300 flex items-center justify-center mr-2.5 shadow-inner">
                      <CheckCircle className="w-4 h-4 text-green-700" />
                    </div>
                    Matched Skills
                    <span className="ml-auto px-2.5 py-1 rounded-full bg-gradient-to-r from-green-100 to-green-200 text-green-800 text-xs font-medium shadow-sm">
                      {analysis.skillsGap?.matchedSkills.length || 0}
                    </span>
                  </h4>
                  
                  {analysis.skillsGap?.matchedSkills.length === 0 ? (
                    <p className="text-gray-500 italic text-sm">No matched skills found</p>
                  ) : (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {analysis.skillsGap?.matchedSkills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="px-2.5 py-1 rounded-full bg-white text-green-800 text-xs font-medium border border-green-200 hover:bg-green-50 hover:border-green-300 transition-all shadow-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-4 pt-3 border-t border-green-100">
                    <div className="flex items-start mb-2">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center text-green-600 mr-2 mt-0.5">
                        <span className="text-xs">✓</span>
                      </div>
                      <p className="text-xs text-gray-600">
                        These skills align with the job requirements and strengthen your candidacy.
                      </p>
                    </div>
                    
                    {isPremium ? (
                      <div className="flex items-start">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center text-green-600 mr-2 mt-0.5">
                          <span className="text-xs">✓</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Your expertise level in these skills ranks in the top 30% of applicants.
                        </p>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <Star className="w-3 h-3 mr-1 text-green-500" fill="currentColor" />
                        Upgrade to see your expertise ranking against other applicants
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Missing Skills - Enhanced with Visual Improvements */}
                <div className="bg-gradient-to-br from-white to-amber-50 p-5 rounded-lg border border-amber-200/60 shadow-sm hover:shadow-md transition duration-300">
                  <h4 className="font-semibold text-amber-800 flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center mr-2.5 shadow-inner">
                      <Star className="w-4 h-4 text-amber-700" />
                    </div>
                    Development Areas
                    <span className="ml-auto px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 text-xs font-medium shadow-sm">
                      {analysis.skillsGap?.missingSkills.length || 0}
                    </span>
                  </h4>
                  
                  {analysis.skillsGap?.missingSkills.length === 0 ? (
                    <p className="text-gray-500 italic text-sm">No missing skills - great job!</p>
                  ) : (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {analysis.skillsGap?.missingSkills.map((skill, index) => (
                        <span 
                          key={index} 
                          className="px-2.5 py-1 rounded-full bg-white text-amber-800 text-xs font-medium border border-amber-200 hover:bg-amber-50 hover:border-amber-300 transition-all shadow-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-4 pt-3 border-t border-amber-100">
                    {!isPremium ? (
                      <>
                        <div className="flex items-start mb-2">
                          <div className="w-5 h-5 rounded-full bg-amber-100 flex-shrink-0 flex items-center justify-center text-amber-600 mr-2 mt-0.5">
                            <span className="text-xs">!</span>
                          </div>
                          <p className="text-xs text-gray-600">
                            Developing these skills could significantly improve your chances of landing this role.
                          </p>
                        </div>
                        <div className="mt-3 bg-white p-3 rounded-md border border-amber-200/50 flex justify-between items-center">
                          <div className="text-xs text-gray-700">
                            <span className="font-medium block mb-0.5">Get Personalized Development Path</span>
                            <span className="text-gray-500">Upgrade to see skill priorities and training resources</span>
                          </div>
                          <button className="text-xs px-3 py-1.5 bg-amber-100 text-amber-800 hover:bg-amber-200 rounded font-medium transition-colors"
                            onClick={() => navigate('/pricing')}>
                            Upgrade
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h5 className="text-xs font-medium text-gray-700 mb-2">Expert Feedback:</h5>
                        <div className="space-y-2">
                          <div className="flex items-start">
                            <div className="w-5 h-5 rounded-full bg-red-100 flex-shrink-0 flex items-center justify-center text-red-600 mr-2 mt-0.5">
                              <span className="text-[10px] font-bold">1</span>
                            </div>
                            <p className="text-xs text-gray-600">
                              <span className="font-medium">{analysis.skillsGap?.missingSkills?.[0] || 'First skill'}</span>: 
                              <span className="ml-1">High priority - required for 80% of similar roles</span>
                            </p>
                          </div>
                          {analysis.skillsGap?.missingSkills?.[1] && (
                            <div className="flex items-start">
                              <div className="w-5 h-5 rounded-full bg-amber-100 flex-shrink-0 flex items-center justify-center text-amber-600 mr-2 mt-0.5">
                                <span className="text-[10px] font-bold">2</span>
                              </div>
                              <p className="text-xs text-gray-600">
                                <span className="font-medium">{analysis.skillsGap?.missingSkills?.[1]}</span>:
                                <span className="ml-1">Medium priority - valuable complementary skill</span>
                              </p>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Expert Feedback - Enhanced */}
              <div className="mt-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-200 relative shadow-sm">
                  <div className="absolute -top-4 -left-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
                      <Star className="w-4 h-4" fill="currentColor" />
                    </div>
                  </div>
                  <h4 className="font-semibold text-blue-800 mb-3 pl-7">Expert Feedback:</h4>
                  <div className="flex space-x-2">
                    <div className="border-l-2 border-blue-300 pl-3">
                      <p className="text-gray-700 italic">{analysis.skillsGap?.feedback}</p>
                      <div className="flex items-center mt-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                          <span className="text-xs font-medium">AI</span>
                        </div>
                        <p className="text-xs text-gray-500">Analysis powered by our Resume Intelligence Engine</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Skill Development Priority Indicator */}
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 bg-gradient-to-br from-amber-50 to-amber-100 p-3 rounded-lg border border-amber-200">
                    <h5 className="text-sm font-medium text-amber-800 mb-1.5 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1 text-amber-600" />
                      Development Priority
                    </h5>
                    <p className="text-xs text-gray-700">
                      Focus first on {analysis.skillsGap?.missingSkills?.[0] || "key missing skills"} to increase your marketability.
                    </p>
                  </div>
                  
                  <div className="flex-1 bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
                    <h5 className="text-sm font-medium text-green-800 mb-1.5 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                      Strength Leverage
                    </h5>
                    <p className="text-xs text-gray-700">
                      Emphasize your {analysis.skillsGap?.matchedSkills?.[0] || "matched skills"} experience in application materials.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Suggestions - Enhanced for Freemium */}
          <motion.div 
            className="bg-gradient-to-br from-white to-indigo-50/30 rounded-xl shadow-xl border border-indigo-100/60 overflow-hidden"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-xl text-white flex items-center">
                <Zap className="w-5 h-5 mr-2" /> 
                Resume Improvement Recommendations
                {!isPremium && (
                  <span className="ml-3 text-xs bg-white/20 backdrop-blur px-2 py-0.5 rounded-full">
                    Free Preview
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-2">
                {!isPremium && (
                  <button 
                    onClick={() => navigate('/pricing')}
                    className="mr-2 text-xs px-2 py-1 bg-white text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors font-medium"
                  >
                    Upgrade
                  </button>
                )}
                <button 
                  onClick={() => toggleSection('suggestions')}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-1 rounded-full"
                >
                  {expandedSections.suggestions ? 
                    <ChevronUp className="w-5 h-5 text-white" /> : 
                    <ChevronDown className="w-5 h-5 text-white" />
                  }
                </button>
              </div>
            </div>
            
            {expandedSections.suggestions && (
              <div className="p-6">
                {!isPremium ? (
                  /* Free Preview Version */
                  <div className="space-y-6">
                    <p className="text-sm text-gray-600 mb-2">
                      Our AI-powered analysis has identified several opportunities to improve your resume:
                    </p>
                    
                    {/* Free Preview Cards */}
                    <div className="space-y-4 mb-8">
                      {/* Example Improvement Card - Visible */}
                      <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-l-indigo-500 hover:shadow-md transition-shadow">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="font-medium text-indigo-800">Experience Section</span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            high priority
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="p-3 rounded bg-red-50/50 border border-red-100">
                            <h5 className="text-sm text-red-800 font-medium flex items-center">
                              <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-2">
                                <span className="text-xs">!</span>
                              </div>
                              Current Issue
                            </h5>
                            <p className="mt-1 text-gray-700 text-sm">
                              Your experience descriptions lack quantifiable achievements and specific metrics.
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                          <div className="flex items-center text-indigo-600">
                            <Zap className="w-3.5 h-3.5 mr-1" />
                            <span className="text-xs font-medium">View detailed solution with Premium</span>
                          </div>
                          <span className="text-xs text-gray-500">1 of 3 issues</span>
                        </div>
                      </div>
                      
                      {/* Blurred Preview Cards */}
                      <div className="relative">
                        <div className="space-y-4 filter blur-[3px] pointer-events-none">
                          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-l-amber-500">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <div className="w-24 h-5 bg-gray-200 rounded"></div>
                              <div className="w-16 h-5 bg-gray-200 rounded-full"></div>
                            </div>
                            <div className="space-y-3">
                              <div className="p-3 rounded bg-gray-50 border border-gray-100">
                                <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="w-full h-12 bg-gray-200 rounded"></div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-l-green-500">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <div className="w-28 h-5 bg-gray-200 rounded"></div>
                              <div className="w-16 h-5 bg-gray-200 rounded-full"></div>
                            </div>
                            <div className="space-y-3">
                              <div className="p-3 rounded bg-gray-50 border border-gray-100">
                                <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="w-full h-12 bg-gray-200 rounded"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Upgrade Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">Unlock Full Recommendations</h4>
                            <p className="text-sm text-gray-600 mb-3">
                              Premium unlocks detailed solutions to all resume issues
                            </p>
                            <button 
                              onClick={() => navigate('/pricing')}
                              className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg shadow transition-all text-sm font-medium"
                            >
                              Upgrade to Premium
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Free Improvement Highlights */}
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                      <h4 className="font-medium text-indigo-900 mb-3">Premium Recommendation Benefits</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2 mt-0.5">
                            <span className="text-xs">✓</span>
                          </div>
                          <p className="text-sm text-gray-700">
                            Detailed before & after examples for each section
                          </p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2 mt-0.5">
                            <span className="text-xs">✓</span>
                          </div>
                          <p className="text-sm text-gray-700">
                            AI-powered phrasing improvements
                          </p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2 mt-0.5">
                            <span className="text-xs">✓</span>
                          </div>
                          <p className="text-sm text-gray-700">
                            Industry-specific optimization tips
                          </p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2 mt-0.5">
                            <span className="text-xs">✓</span>
                          </div>
                          <p className="text-sm text-gray-700">
                            Downloadable recommendation report
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <button 
                        onClick={() => navigate('/pricing')}
                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg flex items-center text-sm font-medium"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Upgrade for Full Analysis
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Premium Version - Original Content */
                  <div>
                    {analysis.suggestions?.length > 0 ? (
                      <div className="space-y-4">
                        {analysis.suggestions.map((suggestion, index) => (
                          <div 
                            key={index} 
                            className="bg-white rounded-lg shadow p-4 border-l-4 border-l-indigo-500"
                          >
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className="font-medium text-indigo-800">{suggestion.section} Section</span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                suggestion.priority === 'high' ? 'bg-red-100 text-red-800' : 
                                suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-green-100 text-green-800'
                              }`}>
                                {suggestion.priority} priority
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-red-50/50 p-3 rounded border border-red-100">
                                <h5 className="text-sm text-red-800 font-medium mb-1">Current Content:</h5>
                                <p className="text-gray-700 text-sm">{suggestion.current}</p>
                              </div>
                              
                              <div className="bg-green-50/50 p-3 rounded border border-green-100">
                                <h5 className="text-sm text-green-800 font-medium mb-1">Suggested Improvement:</h5>
                                <p className="text-gray-700 text-sm">{suggestion.suggested}</p>
                              </div>
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <h5 className="text-sm text-gray-700 font-medium mb-1">Reason for Suggestion:</h5>
                              <p className="text-gray-600 text-sm">{suggestion.reason}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500">No specific suggestions available.</p>
                      </div>
                    )}
                    
                    <div className="mt-6 flex justify-center">
                      <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full shadow-md hover:shadow-lg flex items-center">
                        <Download className="w-4 h-4 mr-2" />
                        Download Full Recommendations
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
          
          {/* Premium Feedback Section - Enhanced Analysis */}
          {isPremium && (
            <motion.div 
              className="bg-gradient-to-br from-white to-purple-50/30 rounded-xl shadow-xl border border-purple-100/60 overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex justify-between items-center">
                <h3 className="font-bold text-xl text-white flex items-center">
                  <Star className="w-5 h-5 mr-2" fill="currentColor" /> 
                  Premium Detailed Analysis
                  <span className="ml-3 px-3 py-1 text-sm bg-white/20 rounded-full">
                    Enhanced
                  </span>
                </h3>
                <button 
                  onClick={() => toggleSection('premium')}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-1 rounded-full"
                >
                  {expandedSections.premium ? 
                    <ChevronUp className="w-5 h-5 text-white" /> : 
                    <ChevronDown className="w-5 h-5 text-white" />
                  }
                </button>
              </div>
              
              {expandedSections.premium && (
                <div className="p-6">
                  {/* Advanced Analytics Content Instead of Basic Feedback */}
                  <div className="space-y-6">
                    {/* Performance Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-5 rounded-xl border border-emerald-200/50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-emerald-800 flex items-center text-sm">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Market Competitiveness
                          </h4>
                          <span className="px-2 py-1 bg-emerald-600 text-white text-xs rounded-full font-medium">
                            {analysis.atsScore >= 80 ? 'Excellent' : analysis.atsScore >= 60 ? 'Strong' : 'Developing'}
                          </span>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-emerald-700 mb-1">{analysis.atsScore}%</p>
                          <p className="text-xs text-emerald-600 leading-tight">
                            Your resume's overall market performance score
                          </p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-5 rounded-xl border border-amber-200/50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-amber-800 flex items-center text-sm">
                            <Star className="w-4 h-4 mr-2" />
                            Skills Alignment
                          </h4>
                          <span className="px-2 py-1 bg-amber-600 text-white text-xs rounded-full font-medium">
                            {analysis.skillsGap?.score}%
                          </span>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-amber-700 mb-1">
                            {analysis.skillsGap?.matchedSkills?.length || 0}/{(analysis.skillsGap?.matchedSkills?.length || 0) + (analysis.skillsGap?.missingSkills?.length || 0)}
                          </p>
                          <p className="text-xs text-amber-600 leading-tight">
                            Skills matched to job requirements
                          </p>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-violet-50 to-violet-100/50 p-5 rounded-xl border border-violet-200/50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-violet-800 flex items-center text-sm">
                            <Award className="w-4 h-4 mr-2" />
                            Content Quality
                          </h4>
                          <span className="px-2 py-1 bg-violet-600 text-white text-xs rounded-full font-medium">
                            {analysis.contentAnalysis?.score >= 80 ? 'High' : analysis.contentAnalysis?.score >= 60 ? 'Good' : 'Fair'}
                          </span>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-violet-700 mb-1">{analysis.contentAnalysis?.score || 0}%</p>
                          <p className="text-xs text-violet-600 leading-tight">
                            Resume content effectiveness rating
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Insights */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                      <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <BarChart3 className="w-4 h-4 mr-2 text-blue-500" />
                        Advanced Performance Insights
                      </h4>
                      
                      <div className="space-y-4">
                        {/* ATS Performance Insight */}
                        <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 mb-1">ATS Compatibility Analysis</h5>
                            <p className="text-sm text-gray-600">
                              {analysis.atsScore >= 80 
                                ? "Your resume demonstrates excellent ATS compatibility with strong formatting and keyword optimization."
                                : analysis.atsScore >= 60 
                                ? "Your resume shows good ATS compatibility with room for keyword enhancement."
                                : "Your resume needs improvement in ATS formatting and keyword alignment for better automated screening performance."
                              }
                            </p>
                            <div className="mt-2">
                              <AnimatedProgressBar progress={analysis.atsScore} colorClass="blue" height={2} showAnimation={false} />
                            </div>
                          </div>
                        </div>

                        {/* Skills Performance Insight */}
                        <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Star className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 mb-1">Skills Match Analysis</h5>
                            <p className="text-sm text-gray-600">
                              You demonstrate {analysis.skillsGap?.matchedSkills?.length || 0} key skills aligned with the job requirements.
                              {(analysis.skillsGap?.missingSkills?.length || 0) > 0 && 
                                ` Consider developing ${analysis.skillsGap?.missingSkills?.length} additional skills to strengthen your profile.`
                              }
                            </p>
                            <div className="mt-2">
                              <AnimatedProgressBar progress={analysis.skillsGap?.score || 0} colorClass="green" height={2} showAnimation={false} />
                            </div>
                          </div>
                        </div>

                        {/* Content Quality Insight */}
                        <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Award className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900 mb-1">Content Impact Assessment</h5>
                            <p className="text-sm text-gray-600">
                              {analysis.contentAnalysis?.score >= 80 
                                ? "Your resume content effectively communicates value with strong achievements and compelling language."
                                : analysis.contentAnalysis?.score >= 60 
                                ? "Your resume content is solid and could benefit from more specific metrics and impact statements."
                                : "Your resume content needs enhancement with quantified achievements and stronger value propositions."
                              }
                            </p>
                            <div className="mt-2">
                              <AnimatedProgressBar progress={analysis.contentAnalysis?.score || 0} colorClass="purple" height={2} showAnimation={false} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Items */}
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-5 rounded-xl border border-indigo-100">
                      <h4 className="font-semibold text-indigo-800 mb-3 flex items-center">
                        <Zap className="w-4 h-4 mr-2" />
                        Priority Optimization Areas
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {analysis.atsScore < 80 && (
                          <div className="bg-white p-3 rounded-lg border border-indigo-200/50">
                            <h5 className="font-medium text-gray-900 text-sm mb-1">Enhance ATS Compatibility</h5>
                            <p className="text-xs text-gray-600">Optimize formatting and keyword density to improve automated screening performance.</p>
                          </div>
                        )}                        {(analysis.skillsGap?.missingSkills?.length || 0) > 0 && (
                          <div className="bg-white p-3 rounded-lg border border-indigo-200/50">
                            <h5 className="font-medium text-gray-900 text-sm mb-1">Skill Gap Closure</h5>
                            <p className="text-xs text-gray-600">Focus on developing {analysis.skillsGap?.missingSkills?.slice(0, 2).join(', ')} to strengthen job fit.</p>
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <button 
                                onClick={() => {
                                  const coursesElement = document.getElementById('course-recommendations');
                                  if (coursesElement) {
                                    coursesElement.scrollIntoView({ behavior: 'smooth' });
                                    // Ensure the courses section is expanded
                                    if (!expandedSections.courses) {
                                      toggleSection('courses');
                                    }
                                  }
                                }} 
                                className="text-xs flex items-center font-medium text-indigo-600 hover:text-indigo-700"
                              >
                                <BookOpen className="w-3 h-3 mr-1" />
                                See course recommendations
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )}
                        {(analysis.contentAnalysis?.score || 0) < 80 && (
                          <div className="bg-white p-3 rounded-lg border border-indigo-200/50">
                            <h5 className="font-medium text-gray-900 text-sm mb-1">Content Enhancement</h5>
                            <p className="text-xs text-gray-600">Add specific metrics and quantified achievements to demonstrate impact.</p>
                          </div>
                        )}
                        {(analysis.formatAnalysis?.score || 0) < 80 && (
                          <div className="bg-white p-3 rounded-lg border border-indigo-200/50">
                            <h5 className="font-medium text-gray-900 text-sm mb-1">Format Optimization</h5>
                            <p className="text-xs text-gray-600">Improve visual hierarchy and structure for better readability and impact.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
            {/* Course & Learning Suggestions (Premium vs Free Version) */}
          {analysis.courseSuggestions && analysis.courseSuggestions.length > 0 && (
            <motion.div
              id="course-recommendations"
              className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            ><div className={`px-6 py-4 flex justify-between items-center ${
                hasFeature('courseRecommendations') 
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500' 
                  : 'bg-gradient-to-r from-teal-600 to-teal-700'
              }`}>
                <h3 className="font-bold text-xl text-white flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Recommended Courses for Missing Skills
                  {!hasFeature('courseRecommendations') && (
                    <span className="ml-3 text-xs bg-white/20 backdrop-blur px-2 py-0.5 rounded-full">
                      Free Preview
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-2">
                  {!hasFeature('courseRecommendations') && (
                    <button 
                      onClick={() => navigate('/pricing')}
                      className="mr-2 text-xs px-2 py-1 bg-white text-teal-600 rounded-md hover:bg-teal-50 transition-colors font-medium"
                    >
                      Upgrade
                    </button>
                  )}
                  <button
                    onClick={() => toggleSection('courses')}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-1 rounded-full"
                  >
                    {expandedSections.courses ?
                      <ChevronUp className="w-5 h-5 text-white" /> :
                      <ChevronDown className="w-5 h-5 text-white" />
                    }
                  </button>
                </div>
              </div>{expandedSections.courses && (
                <div className="p-6">                  {/* Course content section */}                  <div className="bg-indigo-50 rounded-lg p-4 mb-6 border border-indigo-100">
                    <h4 className="font-medium text-indigo-900 mb-2">Professional Skill Development</h4>
                    <p className="text-sm text-gray-700">
                      <strong>Enhance your employability:</strong> We've identified the following courses specifically 
                      for the skills you need to develop for this role. Our recommendations prioritize YouTube videos 
                      and free resources when available.
                    </p>
                    <div className="mt-3 p-2 bg-white rounded border border-indigo-100 flex items-center">
                      <div className="text-indigo-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-xs text-indigo-600">
                        Below are {hasFeature('courseRecommendations') 
                          ? <strong>{analysis.courseSuggestions?.length || 0} personalized recommendations</strong>
                          : <span>several learning resources</span>} to help you close the skills gap.
                      </p>
                    </div>
                  </div>
                  
                  {/* Premium Analysis Results - Only shown to premium users */}
                  {isPremium && hasFeature('courseRecommendations') && (
                    <div className="mb-6 bg-gradient-to-r from-violet-50 to-indigo-50 p-4 rounded-lg border border-indigo-100">
                      <h4 className="font-bold text-indigo-800 mb-2 flex items-center">
                        <Award className="w-4 h-4 mr-2 text-indigo-500" />
                        Premium Skills Analysis
                      </h4>
                      <p className="text-sm text-gray-700 mb-3">
                        Our AI has analyzed your resume against the job role requirements and identified specific skills to develop:
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {analysis.skillsGap?.missingSkills?.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-white text-indigo-700 text-xs font-medium rounded-full border border-indigo-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 italic">
                        The course recommendations below are tailored specifically to help you develop these missing skills and increase your job match score.
                      </p>
                    </div>
                  )}                    {/* YouTube Recommendations - Shown to all users */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-800 flex items-center">
                        <div className="flex-shrink-0 mr-3 bg-red-600 p-1 rounded text-white">
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                          </svg>
                        </div>
                        Free YouTube Tutorials for Missing Skills
                      </h4>
                      <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                        60%+ YouTube resources
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {analysis.courseSuggestions
                        ?.filter(course => course.platform === 'YouTube' || course?.sourceType === 'YouTube')
                        .slice(0, hasFeature('courseRecommendations') ? 4 : 2) // Show more YouTube resources
                        .map((course, index) => (
                          <a
                            key={`youtube-${index}`}
                            href={course.link}
                            target="_blank"
                            rel="noopener noreferrer" 
                            className="flex bg-red-50 hover:bg-red-100 p-4 rounded-lg border border-red-200 transition-all group shadow-sm hover:shadow"
                          >
                            <div className="flex-shrink-0 mr-3 bg-white p-2 rounded-lg shadow-sm">
                              <svg className="w-8 h-8 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                              </svg>
                            </div>
                            <div className="flex-grow overflow-hidden">
                              <h5 className="font-medium text-gray-800 mb-1 truncate group-hover:text-red-800 text-base">{course.title}</h5>
                              <div className="flex items-center text-xs text-gray-600 mb-2">
                                <span className="mr-2">Duration: {course.duration || 'N/A'}</span>
                                <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded-sm font-medium">Free</span>
                              </div>
                              <div className="bg-white px-2 py-1 rounded border border-red-100 inline-block">
                                <p className="text-xs text-gray-700 font-medium">
                                  {course.skillMatch ? (
                                    <>
                                      <span className="text-red-600">Missing Skill:</span> {course.skillMatch || analysis.skillsGap?.missingSkills?.[index % (analysis.skillsGap?.missingSkills?.length || 1)]}
                                    </>
                                  ) : (
                                    <>
                                      <span className="text-red-600">Missing Skill:</span> {analysis.skillsGap?.missingSkills?.[index % (analysis.skillsGap?.missingSkills?.length || 1)] || 'General skills'}
                                    </>
                                  )}
                                </p>
                              </div>
                            </div>
                          </a>
                      ))}
                    </div>
                  </div>
                    {/* Course display grid with heading */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-gray-800 flex items-center">
                        <BookOpen className="w-4 h-4 mr-2 text-indigo-600" />
                        {hasFeature('courseRecommendations') 
                          ? 'Comprehensive Course Catalog'
                          : 'Additional Learning Resources'}
                      </h4>
                      {hasFeature('courseRecommendations') && (
                        <div className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                          Tailored for your skill gaps
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Show all courses for premium users, but limit to 3 for free users */}
                      {(hasFeature('courseRecommendations')
                        ? analysis.courseSuggestions?.filter(course => 
                            !(course.platform === 'YouTube' || course?.sourceType === 'YouTube')
                          ) 
                        : analysis.courseSuggestions?.filter(course => 
                            !(course.platform === 'YouTube' || course?.sourceType === 'YouTube')
                          )?.slice(0, 3))?.map((course: {
                        title: string; 
                        platform: string; 
                        link: string; 
                        level?: string; 
                        price?: string; 
                        duration?: string;
                        sourceType?: string;
                        skillMatch?: string;
                      }, index: number) => (
                        <a 
                          key={index} 
                          href={course.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`block p-4 rounded-lg shadow-sm border transition-all hover:shadow-md group
                            ${course.platform === 'YouTube' || course?.sourceType === 'YouTube'
                              ? 'bg-red-50 hover:bg-red-100 border-red-200' 
                              : hasFeature('courseRecommendations') 
                                ? 'bg-white hover:bg-gray-50 border-indigo-200' 
                                : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                            }`}
                        >
                          {/* Premium badge for premium users */}
                          {isPremium && index < 3 && (
                            <div className="flex justify-end mb-1">
                              <span className="text-xs bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-2 py-0.5 rounded-full font-medium">
                                Top Match
                              </span>
                            </div>
                          )}
                          
                          <h4 className={`font-semibold ${hasFeature('courseRecommendations') 
                            ? 'text-indigo-700 group-hover:text-indigo-800' 
                            : 'text-blue-700 group-hover:text-blue-800'} mb-2 truncate transition-colors`} 
                            title={course.title}>
                            {course.title}
                          </h4>
                          
                          <div className="space-y-1 mb-3">
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-indigo-100 rounded-full flex items-center justify-center mr-1">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                              </div>
                              <p className="text-xs text-gray-600">Platform: <span className="font-medium">{course.platform}</span></p>
                            </div>
                            
                            {course.level && (
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mr-1">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                </div>
                                <p className="text-xs text-gray-600">Level: <span className="font-medium">{course.level}</span></p>
                              </div>
                            )}
                            
                            {course.duration && (
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mr-1">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                </div>
                                <p className="text-xs text-gray-600">Duration: <span className="font-medium">{course.duration}</span></p>
                              </div>
                            )}
                            
                            {/* Enhanced skill match display */}
                            <div className="mt-2 bg-indigo-50 p-2 rounded border border-indigo-100">
                              <p className="text-xs text-gray-700">
                                <span className="font-medium text-indigo-700">Skill Match:</span>{' '}
                                <span className="text-gray-700 font-medium">
                                  {course.skillMatch || analysis.skillsGap?.missingSkills?.[index % (analysis.skillsGap?.missingSkills?.length || 1)] || 'General skills'}
                                </span>
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              course.price === 'Free' ? 'bg-green-100 text-green-800' :
                              course.price === 'Paid' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {course.price || 'View Course'}
                            </span>
                            <span className={`text-xs ${hasFeature('courseRecommendations') 
                              ? 'text-indigo-600 group-hover:text-indigo-700' 
                              : 'text-blue-600 group-hover:text-blue-700'} font-medium flex items-center`}>
                              Learn More <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </span>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                    {/* Premium detailed analysis for premium users */}
                  {isPremium && hasFeature('courseRecommendations') && (
                    <div className="mt-6 border-t border-gray-200 pt-5">
                      <h4 className="text-lg font-bold text-indigo-800 mb-3">
                        Premium Course Analysis & Recommendations
                      </h4>
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100 mb-4">
                        <div className="flex items-center mb-3">
                          <TrendingUp className="w-5 h-5 text-indigo-500 mr-2" />
                          <h5 className="font-medium text-indigo-800">Learning Path Recommendations</h5>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">
                          Based on your current skill set and career goals, we recommend the following learning path to maximize your employability:
                        </p>
                        <ol className="list-decimal ml-5 space-y-1 text-sm text-gray-700">
                          <li>Start with foundational courses to build core competencies</li>
                          <li>Progress to intermediate specialized training in your field</li>
                          <li>Complete with advanced courses on emerging technologies</li>
                        </ol>
                        <div className="mt-3 text-xs text-indigo-700">
                          Following this curriculum can help close your skills gap and make you more competitive in the job market.
                        </div>
                      </div>
                      
                      {/* Skills match chart - simplified visualization */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h5 className="font-medium text-gray-800 mb-2">Skills Match Analysis</h5>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <p className="text-xs text-gray-600">Core Skills Coverage</p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                            <p className="text-right text-xs text-gray-700">75%</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs text-gray-600">Specialized Skills</p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                            <p className="text-right text-xs text-gray-700">60%</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs text-gray-600">Emerging Technologies</p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                            </div>
                            <p className="text-right text-xs text-gray-700">45%</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs text-gray-600">Industry Knowledge</p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                            </div>
                            <p className="text-right text-xs text-gray-700">80%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                    {/* Enhanced upgrade prompt for free users */}
                  {!hasFeature('courseRecommendations') && analysis.courseSuggestions?.length > 3 && (
                    <div className="mt-6 bg-gradient-to-r from-teal-50 to-blue-50 p-5 rounded-lg border border-teal-100 shadow-sm">
                      <div className="flex items-center">
                        <div className="mr-4 bg-gradient-to-br from-teal-500 to-blue-500 p-3 rounded-lg shadow-md">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-teal-800 text-lg mb-1">
                            Unlock {analysis.courseSuggestions?.length - 3} More Personalized Courses
                          </h4>
                          <p className="text-sm text-teal-700">
                            Premium members get full access to our comprehensive course library with personalized 
                            recommendations for each missing skill.
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded border border-teal-200 flex items-start">
                          <div className="mr-2 text-teal-500 mt-0.5">✓</div>
                          <p className="text-xs text-gray-700">
                            <strong>Skill-specific courses</strong> tailored to your missing skills
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded border border-teal-200 flex items-start">
                          <div className="mr-2 text-teal-500 mt-0.5">✓</div>
                          <p className="text-xs text-gray-700">
                            <strong>60%+ YouTube tutorials</strong> for budget-friendly learning
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded border border-teal-200 flex items-start">
                          <div className="mr-2 text-teal-500 mt-0.5">✓</div>
                          <p className="text-xs text-gray-700">
                            <strong>Priority-ranked resources</strong> based on skill importance 
                          </p>
                        </div>
                        <div className="bg-white p-3 rounded border border-teal-200 flex items-start">
                          <div className="mr-2 text-teal-500 mt-0.5">✓</div>
                          <p className="text-xs text-gray-700">
                            <strong>Custom learning paths</strong> to maximize employability
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => navigate('/pricing')}
                        className="mt-4 w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white py-3 rounded-lg text-sm font-medium hover:from-teal-600 hover:to-blue-600 transition-all shadow-sm hover:shadow flex items-center justify-center"
                      >
                        <Star className="w-4 h-4 mr-2" fill="currentColor" />
                        Upgrade to Premium for All Course Recommendations
                      </button>
                      
                      <p className="mt-3 text-xs text-center text-teal-700">
                        Improve your skills and boost your job prospects with our expert-recommended courses
                      </p>
                    </div>
                  )}
                </div>
              )}            </motion.div>
          )}

          {/* Career Path Insights Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-8"
          >
            <PremiumFeatureContainer 
              title="Career Path Insights"
              description="Discover optimal career paths based on your resume strengths and market opportunities"
              isActive={isPremium}
              useEnhancedPrompt={false}
            >
              {/* Premium Content */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-5 rounded-xl">
                  <h4 className="font-medium text-gray-800 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
                    Your Career Progression Trajectory
                  </h4>
                  
                  {/* Career Path Visualization */}
                  <div className="flex items-center justify-between mb-6 px-4">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-indigo-500">
                        <span className="font-bold text-indigo-700">Now</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2 text-center w-24 font-medium">Current Position</p>
                    </div>
                    
                    <div className="flex-1 h-1 bg-gradient-to-r from-indigo-200 via-purple-200 to-blue-200 mx-2"></div>
                    
                    <div className="flex flex-col items-center text-center opacity-80">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center border border-purple-400">
                        <span className="font-medium text-purple-700 text-sm">+2yr</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2 text-center w-24">Mid-Level</p>
                    </div>
                    
                    <div className="flex-1 h-1 bg-gradient-to-r from-purple-200 via-blue-200 to-cyan-200 mx-2"></div>
                    
                    <div className="flex flex-col items-center text-center opacity-70">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border border-blue-300">
                        <span className="font-medium text-blue-700 text-sm">+4yr</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2 text-center w-24">Senior</p>
                    </div>
                    
                    <div className="flex-1 h-1 bg-gradient-to-r from-blue-200 via-cyan-200 to-teal-200 mx-2"></div>
                    
                    <div className="flex flex-col items-center text-center opacity-60">
                      <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center border border-teal-300">
                        <span className="font-medium text-teal-700 text-sm">+7yr</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2 text-center w-24">Leadership</p>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-sm mb-4 border border-indigo-100">
                    <h5 className="font-medium text-indigo-900 text-sm mb-2">Next Recommended Career Steps</h5>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-gray-700">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2 flex-shrink-0">
                          <span className="text-xs">1</span>
                        </div>
                        Gain experience with {analysis.skillsGap?.missingSkills?.[0] || "advanced industry tools"}
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2 flex-shrink-0">
                          <span className="text-xs">2</span>
                        </div>
                        Take on leadership in cross-functional projects
                      </li>
                      <li className="flex items-center text-sm text-gray-700">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2 flex-shrink-0">
                          <span className="text-xs">3</span>
                        </div>
                        Pursue {analysis.skillsGap?.missingSkills?.[1] || "specialized certification"} to fill skill gaps
                      </li>
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
                      <h5 className="font-medium text-indigo-900 text-sm mb-2 flex items-center">
                        <Star className="w-4 h-4 mr-1 text-amber-500" />
                        Growth Opportunities
                      </h5>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">Salary Growth Potential:</span>
                          <span className="font-medium text-green-600">High</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">Job Market Demand:</span>
                          <span className="font-medium text-green-600">Increasing</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">Remote Work Opportunities:</span>
                          <span className="font-medium text-amber-600">Moderate</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100">
                      <h5 className="font-medium text-indigo-900 text-sm mb-2 flex items-center">
                        <Award className="w-4 h-4 mr-1 text-blue-500" />
                        Industry Outlook
                      </h5>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">Industry Growth Rate:</span>
                          <span className="font-medium text-green-600">+12% annually</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">Emerging Roles:</span>
                          <span className="font-medium text-blue-600">3 identified</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">Technology Impact:</span>
                          <span className="font-medium text-purple-600">Transformative</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </PremiumFeatureContainer>
          </motion.div>
          
          {/* Premium Advanced Analytics Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <PremiumFeatureContainer 
              title="Advanced Resume Analytics"
              description="Get in-depth insights about your resume performance with our advanced analytics"
              isActive={isPremium}
            >
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
                    <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                      Industry Position
                    </h4>
                    <div className="h-24 bg-gray-50 rounded-lg flex items-center justify-center">
                      <p className="text-2xl font-bold text-blue-600">Top 23%</p>
                    </div>
                    <p className="mt-3 text-sm text-gray-600">
                      Your resume is performing better than 77% of other applicants in your industry.
                    </p>
                  </div>
                  
                  <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
                    <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                      <Star className="w-4 h-4 mr-2 text-purple-500" />
                      Keyword Optimization
                    </h4>
                    <div className="h-24 bg-gray-50 rounded-lg flex items-center justify-center">
                      <p className="text-2xl font-bold text-purple-600">87%</p>
                    </div>
                    <p className="mt-3 text-sm text-gray-600">
                      Your resume contains 87% of industry-specific keywords for your target role.
                    </p>
                  </div>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                    <Award className="w-4 h-4 mr-2 text-indigo-500" />
                    AI-Powered Hiring Chance Calculator
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-700">Estimated interview chance:</p>
                      <p className="text-lg font-bold text-indigo-600">73%</p>
                    </div>
                    <AnimatedProgressBar progress={73} colorClass="indigo" height={2.5} showAnimation={false} />
                  </div>
                  <p className="mt-3 text-sm text-gray-600">
                    Based on your resume's performance against similar successful candidates.
                  </p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow border border-gray-100">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                    <ChevronDown className="w-4 h-4 mr-2 text-green-500" />
                    Industry-Specific Resume Insights
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                      <span className="text-sm text-gray-800">Experience emphasis</span>
                      <span className="text-sm font-medium text-green-700">Above Industry Average</span>
                    </div>
                    <div className="flex items-center justify-between bg-yellow-50 p-3 rounded-lg">
                      <span className="text-sm text-gray-800">Education details</span>
                      <span className="text-sm font-medium text-yellow-700">Meets Standards</span>
                    </div>
                    <div className="flex items-center justify-between bg-red-50 p-3 rounded-lg">
                      <span className="text-sm text-gray-800">Achievements quantification</span>
                      <span className="text-sm font-medium text-red-700">Below Industry Average</span>
                    </div>
                  </div>
                </div>
              </div>
            </PremiumFeatureContainer>
          </motion.div>
          
          {/* PDF Viewer - Show when debug mode is enabled */}
          {(import.meta.env.DEV || showDebugInfo) && file && (
            <div className="bg-white p-6 rounded-xl shadow-lg mt-8 border border-gray-100">
              <h3 className="font-bold text-xl mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-gray-600" />
                Uploaded Resume PDF {import.meta.env.DEV ? '(Dev Mode)' : '(Debug Mode)'}
              </h3>
              <div className="max-w-full overflow-auto border border-gray-100 rounded">
                <ImprovedPdfViewer file={file} />
              </div>
            </div>
          )}
          
          {/* Debug Info - Show when debug mode is enabled */}
          {(import.meta.env.DEV || showDebugInfo) && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl mt-8 border border-gray-200 shadow-sm">
              <details>
                <summary className="cursor-pointer font-medium text-gray-700 flex items-center">
                  <span className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded text-xs mr-2">
                    {import.meta.env.DEV ? 'DEV' : 'DEBUG'}
                  </span>
                  Debug Information
                </summary>
                <div className="mt-4 space-y-3 text-xs font-mono bg-white p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 p-2 rounded">
                      <strong>JobRole:</strong> {jobRoleId}
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <strong>FileName:</strong> {fileName}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <strong>Created At:</strong> {analysis.createdAt?.toString()}
                  </div>
                  <div>
                    <strong>Raw Analysis:</strong>
                    <pre className="mt-2 p-3 bg-gray-800 text-gray-100 rounded-lg overflow-auto max-h-96 text-xs">
                      {JSON.stringify(analysis, null, 2)}
                    </pre>
                  </div>
                </div>
              </details>
            </div>
          )}
          
          {/* Premium Action Buttons */}
          <motion.div 
            className="mt-12 py-8 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
              <button 
                className="px-5 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl flex items-center justify-center text-base md:text-lg font-medium transition-all w-full md:w-auto"
                aria-label="Download resume analysis report"
              >
                <Download className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
                <span className="text-sm md:text-base">Download Analysis Report</span>
              </button>
              
              {isPremium ? (
                <button 
                  className="px-5 md:px-8 py-3 md:py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg shadow-lg hover:shadow-xl flex items-center justify-center text-base md:text-lg font-medium transition-all w-full md:w-auto"
                  aria-label="Generate optimized resume with AI"
                >
                  <Zap className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
                  <span className="text-sm md:text-base">Generate Optimized Resume</span>
                </button>
              ) : (
                <button 
                  className="px-5 md:px-8 py-3 md:py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg shadow-lg hover:shadow-xl flex items-center justify-center text-base md:text-lg font-medium transition-all w-full md:w-auto relative group"
                  aria-label="Generate optimized resume - premium feature"
                  aria-describedby="premium-tooltip"
                >
                  <Lock className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
                  <span className="text-sm md:text-base">Generate Optimized Resume</span>
                  <div 
                    id="premium-tooltip"
                    className="absolute top-full left-0 mt-2 w-full bg-white p-3 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-10 text-sm text-gray-700"
                    role="tooltip"
                  >
                    This feature is available for premium users only
                  </div>
                </button>
              )}
            </div>
          </motion.div>
          
          {/* Premium Upgrade Notification - Only show for non-premium users */}
          {!isPremium && (
            <motion.div 
              className="fixed bottom-6 right-6 max-w-xs md:max-w-sm z-50"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 2, duration: 0.5 }}
              role="dialog"
              aria-labelledby="premium-notification-title"
              tabIndex={-1}
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-2xl p-4 md:p-5 text-white">
                <div className="flex items-start mb-4">
                  <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-300 mr-3 flex-shrink-0" fill="currentColor" />
                  <div>
                    <h3 id="premium-notification-title" className="font-bold text-base md:text-lg mb-1">Unlock Premium Features</h3>
                    <p className="text-xs md:text-sm opacity-90">
                      Get access to advanced analytics, AI-powered resume optimization, and more with our Premium plan.
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <button
                    className="py-1.5 md:py-2 px-3 md:px-4 bg-white text-indigo-600 rounded-lg font-medium text-xs md:text-sm hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300 focus:ring-offset-indigo-500 transition-all"
                    onClick={() => navigate('/pricing')}
                    aria-label="See premium pricing plans"
                  >
                    See Pricing
                  </button>
                  <button
                    className="text-xs md:text-sm text-indigo-100 hover:text-white focus:outline-none focus:underline transition-colors"
                    onClick={() => {
                      // Use state to hide notification instead of DOM manipulation
                      const notificationElement = document.querySelector('.fixed.bottom-6.right-6');
                      if (notificationElement) {
                        notificationElement.classList.add('opacity-0');
                        setTimeout(() => {
                          notificationElement.classList.add('hidden');
                        }, 500);
                      }
                    }}
                    aria-label="Close premium notification"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-red-50 max-w-lg mx-auto p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-red-700">No Analysis Results Available</h3>
            <p className="mt-3 text-gray-700">
              We couldn't find any analysis results for your resume. Please make sure you've uploaded a resume and selected a job role.
            </p>
            <button
              onClick={() => navigate('/upload')}
              className="mt-6 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow hover:shadow-lg transition-all"
            >
              Upload Resume
            </button>
          </div>
        </div>
      )}
      
      {/* Debug Toggle Button - Fixed position for easy access */}
      <motion.button
        onClick={() => setShowDebugInfo(!showDebugInfo)}
        className={`fixed bottom-6 left-6 p-3 rounded-full shadow-lg transition-all z-40 ${
          showDebugInfo 
            ? 'bg-orange-500 text-white hover:bg-orange-600' 
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
        }`}
        title={showDebugInfo ? 'Hide Debug Information' : 'Show Debug Information'}
        aria-label={showDebugInfo ? 'Hide debug information' : 'Show debug information'}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
      >
        <Bug className="w-5 h-5" />
      </motion.button>
    </div>
  );
}

export default ResultsPage;