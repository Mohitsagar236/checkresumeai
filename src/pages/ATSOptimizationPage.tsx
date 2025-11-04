import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Star, TrendingUp, Users, Clock } from 'lucide-react';

const ATSOptimizationPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>ATS Optimization Guide: Beat Applicant Tracking Systems in 2025 | CheckResumeAI</title>
        <meta name="description" content="Master ATS optimization with our comprehensive guide. Learn how to format your resume, choose keywords, and beat applicant tracking systems to land more interviews." />
        <meta name="keywords" content="ATS optimization, applicant tracking system, resume ATS, ATS friendly resume, ATS scanner, resume formatting, keyword optimization" />
        <link rel="canonical" href="https://checkresumeai.com/ats-optimization" />
        
        {/* Open Graph */}
        <meta property="og:title" content="ATS Optimization Guide: Beat Applicant Tracking Systems in 2025" />
        <meta property="og:description" content="Master ATS optimization with our comprehensive guide. Learn how to format your resume and beat applicant tracking systems." />
        <meta property="og:url" content="https://checkresumeai.com/ats-optimization" />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:title" content="ATS Optimization Guide: Beat Applicant Tracking Systems in 2025" />
        <meta name="twitter:description" content="Master ATS optimization with our comprehensive guide. Learn how to format your resume and beat applicant tracking systems." />
        
        {/* JSON-LD Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "ATS Optimization Guide",
            "description": "Comprehensive guide to optimizing resumes for Applicant Tracking Systems (ATS)",
            "url": "https://checkresumeai.com/ats-optimization",
            "mainEntity": {
              "@type": "HowTo",
              "name": "How to Optimize Your Resume for ATS",
              "description": "Step-by-step guide to making your resume ATS-friendly",
              "step": [
                {
                  "@type": "HowToStep",
                  "name": "Format Your Resume Properly",
                  "text": "Use standard fonts, clear headings, and simple formatting"
                },
                {
                  "@type": "HowToStep", 
                  "name": "Include Relevant Keywords",
                  "text": "Match keywords from job descriptions naturally throughout your resume"
                },
                {
                  "@type": "HowToStep",
                  "name": "Use Standard Section Headers",
                  "text": "Stick to conventional section names like Experience, Education, Skills"
                }
              ]
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 md:px-6">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <TrendingUp className="h-4 w-4" />
              Most Requested Guide
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Master ATS Optimization
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Beat Applicant Tracking Systems and get your resume in front of human recruiters. 
              Our proven strategies help 90% of users pass ATS screening.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link 
                to="/upload"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors text-lg"
              >
                Test Your Resume Now
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <Link 
                to="/blog/complete-guide-resume-analysis"
                className="inline-flex items-center gap-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Read Full Guide
              </Link>
            </div>
            
            {/* Social Proof */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                50,000+ Resumes Analyzed
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                4.9/5 User Rating
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Results in 30 Seconds
              </div>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                90% Pass Rate
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our optimized resumes have a 90% ATS pass rate, significantly higher than the industry average of 25%.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                3x More Interviews
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Users report getting 3x more interview requests after implementing our ATS optimization strategies.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center mb-4">
                <Star className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                AI-Powered Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI analyzes your resume against 100+ ATS criteria and provides specific improvement recommendations.
              </p>
            </div>
          </div>

          {/* ATS Optimization Checklist */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Essential ATS Optimization Checklist
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  ✅ Formatting Requirements
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    Use standard fonts (Arial, Times New Roman, Calibri)
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    Save as .docx or .pdf format
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    Use clear, standard section headers
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    Avoid images, graphics, and complex formatting
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    Use bullet points for easy scanning
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  ✅ Content Optimization
                </h3>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    Include exact keywords from job description
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    Use both acronyms and full terms
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    Include skills section with relevant technologies
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    Use industry-specific terminology
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    Quantify achievements with numbers
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Beat ATS Systems?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Get your personalized ATS optimization score and detailed feedback in seconds
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/upload"
                className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors text-lg"
              >
                Analyze My Resume
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <Link 
                to="/blog"
                className="inline-flex items-center gap-2 border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Read More Guides
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ATSOptimizationPage;
