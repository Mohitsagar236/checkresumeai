import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Code, Columns, Layout } from 'lucide-react';

export const FormatStructureReviewPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-8 text-gray-600 dark:text-gray-400">
        <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Format & Structure Review</span>
      </div>
      
      {/* Back button */}
      <Link to="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to home
      </Link>
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 mb-10">
        {/* Feature Header */}
        <div className="flex flex-col md:flex-row md:items-center mb-10 gap-6">
          <div className="bg-amber-100 dark:bg-amber-900/40 rounded-xl p-5 md:p-6 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center flex-shrink-0">
            <Code className="h-10 w-10 md:h-12 md:w-12 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Format & Structure Review</h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl">
              Receive feedback on your resume's layout, organization, and visual hierarchy for maximum impact.
            </p>
          </div>
        </div>
        
        {/* Main content */}
        <div className="space-y-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">First Impressions Matter</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Recruiters typically spend just 6-7 seconds scanning a resume before deciding whether to give it more attention. In that brief window, the format and structure of your resume can make or break your chances.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Our Format & Structure Review feature analyzes the visual hierarchy, spacing, organization, and overall layout of your resume to ensure it creates a strong first impression and makes critical information easy to find.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How Our Format & Structure Review Works</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 dark:bg-slate-700/30 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-3">
                  <div className="bg-amber-100 dark:bg-amber-900/40 rounded-lg p-2 mr-3">
                    <Layout className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Visual Hierarchy</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  We analyze how effectively your resume's visual elements guide the reader's eye to the most important information.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-slate-700/30 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-3">
                  <div className="bg-amber-100 dark:bg-amber-900/40 rounded-lg p-2 mr-3">
                    <Columns className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Section Organization</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  We review the ordering and flow of your resume sections to ensure they highlight your strengths effectively.
                </p>
              </div>
            </div>
            
            <div className="border border-amber-100 dark:border-amber-800/50 rounded-xl p-6 bg-amber-50 dark:bg-amber-900/20 mt-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">What We Analyze</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Visual Elements</h4>
                  <ul className="space-y-2">
                    {[
                      "Font choices and readability",
                      "Spacing and margins",
                      "Alignment consistency",
                      "Use of bullets vs. paragraphs",
                      "Color usage and emphasis"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-amber-500 dark:text-amber-400 mr-2 mt-0.5 shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Structural Elements</h4>
                  <ul className="space-y-2">
                    {[
                      "Section order optimization",
                      "Content prioritization",
                      "Information density",
                      "ATS-friendly formatting",
                      "Length appropriateness"
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-amber-500 dark:text-amber-400 mr-2 mt-0.5 shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-5 bg-white dark:bg-slate-700/50 rounded-lg border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <h4 className="font-semibold text-red-600 dark:text-red-400 mb-3">Common Issues We Identify</h4>
                  <ul className="space-y-2">
                    {[
                      "Inconsistent formatting across sections",
                      "Poor use of white space creating visual clutter",
                      "Critical information buried or hard to find",
                      "Ineffective section ordering",
                      "Formatting that breaks in ATS systems"
                    ].map((issue, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-4 h-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-xs flex items-center justify-center mr-2 mt-0.5 font-bold">✕</span>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="md:w-1/2">
                  <h4 className="font-semibold text-green-600 dark:text-green-400 mb-3">Our Improvement Recommendations</h4>
                  <ul className="space-y-2">
                    {[
                      "Optimized section ordering for your experience level",
                      "Balanced white space for improved readability",
                      "Consistent formatting across all sections",
                      "Strategic emphasis of key achievements",
                      "ATS-compatible formatting suggestions"
                    ].map((recommendation, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-4 h-4 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-xs flex items-center justify-center mr-2 mt-0.5 font-bold">✓</span>
                        <span className="text-gray-700 dark:text-gray-300 text-sm">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key Benefits</h3>
              <ul className="space-y-3">
                {[
                  "Improved readability that helps recruiters quickly find key information",
                  "Professional presentation that creates a strong first impression",
                  "Strategic organization that highlights your most relevant qualifications",
                  "ATS-compatible formatting that ensures your resume gets through automated screenings",
                  "Balanced visual design that appears polished without being overly decorated"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mr-3 mt-0.5 shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-700 dark:to-orange-700 rounded-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Ready for a professional resume makeover?</h3>
          <p className="mb-6">Upload your resume now to receive detailed format and structure recommendations that will make your resume stand out.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/upload" className="inline-flex items-center justify-center bg-white text-amber-600 font-semibold px-6 py-3 rounded-lg hover:bg-amber-50 transition-colors">
              Analyze My Resume
            </Link>
            <Link to="/pricing" className="inline-flex items-center justify-center bg-amber-800/20 hover:bg-amber-800/30 text-white font-semibold px-6 py-3 rounded-lg border border-white/20 transition-colors">
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormatStructureReviewPage;
