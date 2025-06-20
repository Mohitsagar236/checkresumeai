import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, LayoutGrid, Search, Hash } from 'lucide-react';

export const KeywordOptimizationPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-8 text-gray-600 dark:text-gray-400">
        <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Keyword Optimization</span>
      </div>
      
      {/* Back button */}
      <Link to="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to home
      </Link>
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 mb-10">
        {/* Feature Header */}
        <div className="flex flex-col md:flex-row md:items-center mb-10 gap-6">
          <div className="bg-green-100 dark:bg-green-900/40 rounded-xl p-5 md:p-6 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center flex-shrink-0">
            <LayoutGrid className="h-10 w-10 md:h-12 md:w-12 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Keyword Optimization</h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl">
              Enhance your resume with industry-specific keywords that match job descriptions and ATS requirements.
            </p>
          </div>
        </div>
        
        {/* Main content */}
        <div className="space-y-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">The Power of Keywords</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              In today's job market, having the right keywords on your resume is essential for getting past Applicant Tracking Systems (ATS) and catching the attention of hiring managers. Up to 75% of qualified applicants are rejected by ATS systems before a human ever sees their resume, often due to missing critical keywords.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Our Keyword Optimization feature uses advanced AI to identify the most relevant keywords for your industry and target roles, ensuring your resume speaks the same language as the job descriptions you're applying to.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How Our Keyword Optimization Works</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 dark:bg-slate-700/30 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-3">
                  <div className="bg-green-100 dark:bg-green-900/40 rounded-lg p-2 mr-3">
                    <Search className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Keyword Detection</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  We analyze job descriptions and industry standards to identify high-value keywords that should appear in your resume.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-slate-700/30 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-3">
                  <div className="bg-green-100 dark:bg-green-900/40 rounded-lg p-2 mr-3">
                    <Hash className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Natural Integration</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  We provide suggestions for naturally integrating keywords into your resume in a way that sounds professional and authentic.
                </p>
              </div>
            </div>
            
            <div className="border border-green-100 dark:border-green-800/50 rounded-xl p-6 bg-green-50 dark:bg-green-900/20 mt-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Example Keyword Analysis</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Current Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Project Management", "Team Leadership", "Microsoft Office", "Customer Service", "Sales"].map((keyword, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md text-xs">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white dark:bg-slate-700/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Recommended Additions</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Agile Methodology", "Stakeholder Management", "KPI Tracking", "Salesforce", "Revenue Growth"].map((keyword, index) => (
                      <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 rounded-md text-xs flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-white dark:bg-slate-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Keyword Density Analysis</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Optimal keyword density: 2-5% of total resume content
                </p>                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                  <div className="bg-green-600 dark:bg-green-500 h-2.5 rounded-full w-[3.5%]"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>0%</span>
                  <span>Current: 3.5%</span>
                  <span>8%</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key Benefits</h3>
              <ul className="space-y-3">
                {[
                  "Increased ATS compatibility by adding relevant keywords that match job descriptions",
                  "Higher ranking in applicant sorting systems through strategic keyword placement",
                  "Industry-specific terminology suggestions that demonstrate your expertise",
                  "Balanced keyword density to avoid keyword stuffing while maximizing visibility",
                  "Synonyms and variations for common terms to ensure comprehensive coverage"
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
        <div className="bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-700 dark:to-teal-700 rounded-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Optimize your resume keywords now</h3>
          <p className="mb-6">Upload your resume and target job description to get personalized keyword recommendations.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/upload" className="inline-flex items-center justify-center bg-white text-green-600 font-semibold px-6 py-3 rounded-lg hover:bg-green-50 transition-colors">
              Analyze My Resume
            </Link>
            <Link to="/pricing" className="inline-flex items-center justify-center bg-green-800/20 hover:bg-green-800/30 text-white font-semibold px-6 py-3 rounded-lg border border-white/20 transition-colors">
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeywordOptimizationPage;
