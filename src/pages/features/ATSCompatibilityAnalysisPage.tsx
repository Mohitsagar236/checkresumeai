import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, FileSearch, BarChart2, LineChart } from 'lucide-react';

export const ATSCompatibilityAnalysisPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-8 text-gray-600 dark:text-gray-400">
        <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">ATS Compatibility Analysis</span>
      </div>
      
      {/* Back button */}
      <Link to="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to home
      </Link>
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 mb-10">
        {/* Feature Header */}
        <div className="flex flex-col md:flex-row md:items-center mb-10 gap-6">
          <div className="bg-blue-100 dark:bg-blue-900/40 rounded-xl p-5 md:p-6 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center flex-shrink-0">
            <FileSearch className="h-10 w-10 md:h-12 md:w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">ATS Compatibility Analysis</h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl">
              Ensure your resume passes through Applicant Tracking Systems with our advanced keyword optimization technology.
            </p>
          </div>
        </div>
        
        {/* Main content */}
        <div className="space-y-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What is an ATS?</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Applicant Tracking Systems (ATS) are software applications used by employers and recruiters to screen, sort, and rank job applications. 
              Over 95% of Fortune 500 companies and an increasing number of small to mid-sized businesses use ATS software to filter applicants before a human ever sees your resume.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              An ATS parses your resume content into a structured format, searches for specific keywords relevant to the job position, and assigns a ranking based on how well your qualifications match the job requirements.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How Our ATS Compatibility Analysis Works</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 dark:bg-slate-700/30 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-3">
                  <div className="bg-blue-100 dark:bg-blue-900/40 rounded-lg p-2 mr-3">
                    <BarChart2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Format Analysis</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  We analyze your resume's format, structure, and file type to ensure optimal compatibility with all major ATS software.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-slate-700/30 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-3">
                  <div className="bg-blue-100 dark:bg-blue-900/40 rounded-lg p-2 mr-3">
                    <LineChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Keyword Optimization</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Our AI identifies missing keywords from your resume based on job descriptions and industry standards, suggesting optimal placement.
                </p>
              </div>
            </div>
            
            <div className="border border-blue-100 dark:border-blue-800/50 rounded-xl p-6 bg-blue-50 dark:bg-blue-900/20">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key Benefits</h3>
              <ul className="space-y-3">
                {[
                  "Increased visibility to hiring managers by passing the initial ATS screening",
                  "Personalized recommendations for keyword optimization based on specific job descriptions",
                  "Higher resume ranking through strategic placement of relevant skills and qualifications",
                  "Detailed compatibility score with top ATS systems including Workday, Taleo, and Greenhouse",
                  "Format validation to prevent parsing errors that could disqualify your application"
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
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to optimize your resume for ATS?</h3>
          <p className="mb-6">Upload your resume now and get a detailed ATS compatibility analysis in minutes.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/upload" className="inline-flex items-center justify-center bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
              Analyze My Resume
            </Link>
            <Link to="/pricing" className="inline-flex items-center justify-center bg-blue-800/20 hover:bg-blue-800/30 text-white font-semibold px-6 py-3 rounded-lg border border-white/20 transition-colors">
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATSCompatibilityAnalysisPage;
