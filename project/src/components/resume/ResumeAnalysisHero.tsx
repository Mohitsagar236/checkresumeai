import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { FileUpload } from '../ui/FileUpload';
import { Badge } from '../ui/Badge';
import { CheckCircle, AlertTriangle, X, Zap, ArrowRight, Loader2, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import FixedPdfViewer from '../pdf/FixedPdfViewer';
import { resumeProcessor, ProcessedResume } from '../../utils/pdf/pdfProcessor';
import { useResumeAnalysis } from '../../hooks/useResumeAnalysis';

interface ResumeAnalysisHeroProps {
  onResumeUpload?: (file: File, processedResume?: ProcessedResume) => void;
  onJobRoleSelect?: (jobRole: string) => void;
  onSubmit?: () => void;
  jobRoles?: Array<{id: string, title: string}>;
  isPremium?: boolean;
}

export const ResumeAnalysisHero = ({
  onResumeUpload,
  onJobRoleSelect,
  onSubmit,
  jobRoles = [],
  isPremium = false
}: ResumeAnalysisHeroProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [jobRole, setJobRole] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processedResume, setProcessedResume] = useState<ProcessedResume | null>(null);
  const navigate = useNavigate();
    const { analyzeResume, isAnalyzing } = useResumeAnalysis({
    onSuccess: (result) => {
      // Navigate to results page with analysis data
      navigate('/results', { 
        state: { 
          analysis: result,
          isPremium,
          fileName: file?.name
        } 
      });
    },
    onError: (err) => {
      setError(`Analysis failed: ${err.message}`);
    }
  });  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsProcessing(true);
    setError(null);
    
    console.log("Processing file:", selectedFile.name, selectedFile.type, selectedFile.size);

    // Small delay to ensure UI updates before processing begins
    setTimeout(async () => {
      try {
        const processed = await resumeProcessor.processResume(selectedFile);
        console.log("Resume processed successfully:", processed);
        
        // Store processed resume immediately
        setProcessedResume(processed);
        
        // Call the callback if provided
        if (onResumeUpload) {
          onResumeUpload(selectedFile, processed);
        }
        
        // Show preview
        setShowPreview(true);
      } catch (err) {
        console.error('Error processing resume:', err);
        setError('Failed to process resume. Please ensure the file is a valid PDF or try a different file.');
      } finally {
        setIsProcessing(false);
      }
    }, 100);
  };

  const handleJobRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setJobRole(e.target.value);
    if (onJobRoleSelect) {
      onJobRoleSelect(e.target.value);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submission triggered", { file, jobRole, processedResume });
    
    if (!file || !jobRole) {
      setError('Please upload a resume and select a job role.');
      return;
    }
    
    if (!processedResume) {
      // If we have a file but no processed resume, try processing it again
      if (file) {
        console.log("Attempting to process resume again");
        setIsProcessing(true);
        resumeProcessor.processResume(file)
          .then(processed => {
            setProcessedResume(processed);
            continueSubmission(processed);
          })
          .catch(err => {
            console.error("Error re-processing resume:", err);
            setError('Failed to process resume. Please try uploading again or use a different file.');
            setIsProcessing(false);
          });
        return;
      } else {
        setError('Resume processing failed. Please try uploading again.');
        return;
      }
    }
    
    continueSubmission(processedResume);
  };
  
  const continueSubmission = (processedData: ProcessedResume) => {
    // Call optional callback if provided
    if (onSubmit) {
      console.log("Calling onSubmit callback");
      onSubmit();
    }
    
    console.log("Analyzing resume with data:", { 
      resumeData: processedData, 
      jobRole: jobRoles.find(r => r.id === jobRole)?.title || jobRole 
    });
    
    // Analyze the resume with our Groq service
    analyzeResume({ 
      resumeData: processedData, 
      jobRole: jobRoles.find(r => r.id === jobRole)?.title || jobRole 
    });
  };

  // Feature lists for the cards
  const realTimeFeatures = [
    { id: 1, text: "Live ATS score monitoring during analysis", isPremium: true },
    { id: 2, text: "Real-time keyword match detection", isPremium: true },
    { id: 3, text: "Instant feedback as you edit your resume", isPremium: true },
    { id: 4, text: "Live coaching on improving resume sections", isPremium: true },
    { id: 5, text: "Continuous scoring trend visualization", isPremium: true }
  ];

  const premiumChecks = [
    { id: 1, text: "Missing key skills section", type: "error" },
    { id: 2, text: "Too many bullet points under one job role", type: "warning" },
    { id: 3, text: "Education section is complete", type: "success" }
  ];

  // Advanced analysis metrics extracted from processed resume
  const resumeScore = processedResume?.score ?? 0;
  const keywordMatch = processedResume?.keywordMatch ?? 0;
  const formattingScore = processedResume?.formattingScore ?? 0;
  const skillsGap = processedResume?.skillsGap || [];
  const atsCompatibility = processedResume?.atsCompatibility ?? 0;
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* Heading Section - Improved Hero area with enhanced typography and animation */}
      <motion.div 
        className="text-center mb-6 md:mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">
          Resume Analysis
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          AI-powered resume optimization to <span className="text-blue-600 dark:text-blue-400 font-medium">help you stand out</span> from other applicants
        </p>
        <div className="flex justify-center mt-5">
          <motion.div 
            className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            <span className="text-blue-800 dark:text-blue-300">ATS-optimized resume analysis</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Advanced Analysis Summary */}
      {processedResume && (
        <div className="mt-8 p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Advanced Analysis Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium">Resume Score</p>
              <progress className="w-full" value={resumeScore} max={100} />
              <span className="text-sm">{resumeScore}%</span>
            </div>
            <div>
              <p className="text-sm font-medium">Keyword Match</p>
              <progress className="w-full" value={keywordMatch} max={100} />
              <span className="text-sm">{keywordMatch}%</span>
            </div>
            <div>
              <p className="text-sm font-medium">Formatting Score</p>
              <progress className="w-full" value={formattingScore} max={100} />
              <span className="text-sm">{formattingScore}%</span>
            </div>
            {isPremium && (
              <>
                <div>
                  <p className="text-sm font-medium">ATS Compatibility</p>
                  <progress className="w-full" value={atsCompatibility} max={100} />
                  <span className="text-sm">{atsCompatibility}%</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Skills Gap Assessment</p>
                  <ul className="list-disc list-inside text-sm">
                    {skillsGap.map((skill, idx) => (
                      <li key={idx}>{skill}</li>
                    )) || <li>No major gaps detected.</li>}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {/* Upload Form Section */}
        <Card className="border-0 shadow-lg dark:shadow-slate-900/50 order-1 lg:order-none">
          <CardHeader className="space-y-1 sm:space-y-2 p-4 sm:p-6">
            <CardTitle className="flex items-center flex-wrap text-xl sm:text-2xl">
              <span>Upload Resume</span>
              {isPremium && (
                <motion.span 
                  className="text-gradient-premium dark:text-gradient-gold ml-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Premium
                </motion.span>
              )}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Get instant analysis and actionable recommendations to improve your resume
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* File Upload Section - Enhanced with better visual feedback */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Upload Resume *
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">PDF or DOCX format</span>
                </div>
                <motion.div
                  whileHover={{ boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <FileUpload 
                    onFileSelected={handleFileSelect}
                    accept=".pdf,.docx"
                    maxSize={5 * 1024 * 1024}
                    isLoading={isProcessing}
                  />
                </motion.div>
                
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-1 flex items-center bg-red-50 dark:bg-red-900/20 p-2 rounded-md"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
                
                {file && !isProcessing && !error && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-green-600 mt-1 flex items-center bg-green-50 dark:bg-green-900/20 p-2 rounded-md"
                  >
                    <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>File "{file.name}" successfully uploaded and processed</span>
                  </motion.div>
                )}
              </div>

              {/* PDF Preview - Enhanced with animation and better styling */}
              {showPreview && file && (
                <motion.div 
                  className="mt-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Document Preview</h4>
                    <button 
                      onClick={() => setShowPreview(false)}
                      className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      Hide preview
                    </button>
                  </div>
                  <div className="border rounded-lg dark:border-gray-700 overflow-hidden shadow-sm bg-white dark:bg-gray-800">
                    <FixedPdfViewer
                      file={file}
                      width="100%"
                      height={300}
                      scale={1.2}
                      className="w-full"
                    />
                  </div>
                </motion.div>
              )}

              {/* Job Role Selection - Enhanced with better styling and guidance */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="jobRole" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Target Job Role *
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">For best results, be specific</span>
                </div>
                
                <div className="relative">                  <select
                    id="jobRole"
                    value={jobRole}
                    onChange={handleJobRoleChange}
                    className="mt-1 block w-full px-4 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:border-gray-600 dark:text-gray-200 bg-white dark:bg-gray-800 appearance-none"
                    required
                  >
                    <option value="">Select the job you're applying for</option>
                    {jobRoles.map((role) => (
                      <option key={role.id} value={role.id}>{role.title}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
                
                {jobRole && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-blue-600 dark:text-blue-400 mt-1"
                  >
                    Analysis will be optimized for: <span className="font-medium">{jobRoles.find(r => r.id === jobRole)?.title}</span>
                  </motion.div>
                )}
              </div>

              {/* Enhanced Submit Button with better loading animation and visual feedback */}
              <motion.div 
                whileHover={{ scale: 1.01 }} 
                whileTap={{ scale: 0.99 }}
                className="relative"
              >                <Button 
                  type="submit" 
                  disabled={isAnalyzing} // Only disable during analysis, let form validation handle missing fields
                  className={`w-full py-3 sm:py-4 text-base font-medium shadow-md ${
                    !file || !jobRole ? 'opacity-90 hover:opacity-100' : 'opacity-100'
                  }`}
                  variant={isPremium ? "premium" : "default"}
                  onClick={() => {
                    // Extra click handler to ensure it's triggered
                    if (!file || !jobRole) {
                      setError('Please upload a resume and select a job role.');
                      return;
                    }
                  }}
                >
                  <span className="flex items-center justify-center gap-3">
                    {isAnalyzing ? (
                      <>
                        <span className="flex items-center justify-center w-5 h-5 relative">
                          <Loader2 className="h-5 w-5 animate-spin absolute" />
                          <span className="animate-ping absolute w-5 h-5 rounded-full bg-blue-200 dark:bg-blue-700 opacity-75"></span>
                        </span>
                        <span className="animate-pulse">Analyzing Your Resume...</span>
                      </>
                    ) : (
                      <>
                        <span>View Detailed Analysis</span>
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </span>
                </Button>
                
                {/* Visual indicator of required fields */}                {(!file || !jobRole) && !isAnalyzing && (
                  <motion.div 
                    className="absolute -bottom-10 left-0 right-0 text-sm bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-300 p-2 rounded-md text-center shadow-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      {!file ? 'Please upload your resume' : 'Please select a job role'}
                    </span>
                  </motion.div>
                )}
                
                {error && !isAnalyzing && (
                  <motion.div 
                    className="absolute -bottom-10 left-0 right-0 text-sm bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 p-2 rounded-md text-center shadow-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      {error}
                    </span>
                  </motion.div>
                )}
              </motion.div>
            </form>
          </CardContent>
        </Card>

        {/* Features Showcase - Responsive grid for features */}
        <div className="space-y-4 sm:space-y-6 md:space-y-8 order-2 lg:order-none">
          {/* Real-Time Features - Enhanced with visual hierarchy and interactivity */}
          <Card className="border-0 shadow-lg dark:shadow-slate-900/50 overflow-hidden">
            <CardHeader className="p-5 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center mb-1">
                <Zap className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-lg sm:text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400">
                  Real-Time Analysis Features
                </CardTitle>
              </div>
              <CardDescription className="text-sm sm:text-base">
                Premium real-time features enhance your resume optimization experience
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                {realTimeFeatures.map((feature, index) => (
                  <motion.div 
                    key={feature.id} 
                    className="flex justify-between items-center p-3 sm:p-4 rounded-lg hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all border border-transparent hover:border-blue-100 dark:hover:border-blue-800/30"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        {feature.id}
                      </div>
                      <span className="text-gray-800 dark:text-gray-200">{feature.text}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium px-2.5 py-1"
                    >
                      Real-time
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Premium Resume Check - Enhanced with modern design and animations */}
          <Card className="border-0 shadow-lg dark:shadow-slate-900/50 overflow-hidden">
            <CardHeader className="p-5 sm:p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-b border-amber-100 dark:border-amber-900/30">
              <div className="flex items-center mb-1">
                <Zap className="w-5 h-5 mr-2 text-amber-500 dark:text-amber-400" />
                <CardTitle className="text-lg sm:text-xl bg-clip-text text-transparent bg-gradient-to-r from-amber-700 to-orange-700 dark:from-amber-400 dark:to-orange-400">
                  Premium Resume Check
                </CardTitle>
              </div>
              <CardDescription className="text-sm sm:text-base">
                Identify critical issues before your resume gets rejected
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
              <div className="space-y-4">
                {premiumChecks.map((check, index) => (
                  <motion.div 
                    key={check.id} 
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-lg border",
                      check.type === 'error' ? 
                        "bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-300 border-red-200 dark:border-red-900/30" :
                      check.type === 'warning' ? 
                        "bg-amber-50 dark:bg-amber-900/10 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/30" :
                        "bg-green-50 dark:bg-green-900/10 text-green-800 dark:text-green-300 border-green-200 dark:border-green-900/30"
                    )}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.15 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {check.type === 'error' && (
                      <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    )}
                    {check.type === 'warning' && (
                      <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    )}
                    {check.type === 'success' && (
                      <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    )}
                    <span className="text-sm sm:text-base">{check.text}</span>
                  </motion.div>
                ))}
                
                <motion.div 
                  className="mt-8 sm:mt-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <div className="mb-5">
                    <h4 className="font-bold text-lg sm:text-xl text-gray-800 dark:text-gray-200 mb-2">
                      Unlock Premium Features
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get complete analysis and optimization recommendations
                    </p>
                  </div>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 p-4 rounded-lg border border-indigo-100 dark:border-indigo-900/30 mb-5">
                    <ul className="space-y-3">
                      {[
                        "Comprehensive Resume Score Analysis",
                        "Advanced ATS Compatibility Analysis",
                        "In-depth Skills Gap Assessment",
                        "Professional Formatting Guidelines",
                        "Industry-specific Keyword Optimization"
                      ].map((feature, index) => (
                        <li key={index}>
                          <motion.div 
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + (index * 0.1) }}
                          >
                            <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="text-gray-800 dark:text-gray-300">{feature}</span>
                          </motion.div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <motion.div 
                    className="relative group"
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-500"></div>
                    <Button 
                      type="button"
                      variant="premium"
                      className="relative w-full py-3 sm:py-4 text-base font-medium"
                      onClick={() => navigate('/pricing')}
                    >
                      <span className="flex items-center justify-center">
                        <Zap className="mr-2 h-5 w-5" />
                        Upgrade to Premium
                      </span>
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>  );
};
