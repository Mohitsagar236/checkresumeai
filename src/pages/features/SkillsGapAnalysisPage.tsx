import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, FileBarChart2, Target, BarChart } from 'lucide-react';

export const SkillsGapAnalysisPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-8 text-gray-600 dark:text-gray-400">
        <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Skills Gap Analysis</span>
      </div>
      
      {/* Back button */}
      <Link to="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to home
      </Link>
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 mb-10">
        {/* Feature Header */}
        <div className="flex flex-col md:flex-row md:items-center mb-10 gap-6">
          <div className="bg-indigo-100 dark:bg-indigo-900/40 rounded-xl p-5 md:p-6 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center flex-shrink-0">
            <FileBarChart2 className="h-10 w-10 md:h-12 md:w-12 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Skills Gap Analysis</h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl">
              Identify missing skills and qualifications needed for your target role with personalized recommendations.
            </p>
          </div>
        </div>
        
        {/* Main content */}
        <div className="space-y-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Bridge the Skills Gap</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              In today's competitive job market, having the right skills can make all the difference between getting an interview and being overlooked. Our Skills Gap Analysis helps you identify the specific skills and qualifications that are missing from your resume for your target roles.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              By comparing your current resume against thousands of job descriptions and successful candidates, we can pinpoint exactly what you need to add to make your application more competitive.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How Our Skills Gap Analysis Works</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 dark:bg-slate-700/30 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-3">
                  <div className="bg-indigo-100 dark:bg-indigo-900/40 rounded-lg p-2 mr-3">
                    <Target className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Job Requirements Analysis</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  We analyze job descriptions for your target role and identify the most frequently requested skills, qualifications, and experiences.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-slate-700/30 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-3">
                  <div className="bg-indigo-100 dark:bg-indigo-900/40 rounded-lg p-2 mr-3">
                    <BarChart className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Skill Prioritization</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  We prioritize missing skills based on their importance to employers and provide specific recommendations for skill development.
                </p>
              </div>
            </div>
            
            <div className="border border-indigo-100 dark:border-indigo-800/50 rounded-xl p-6 bg-indigo-50 dark:bg-indigo-900/20 mt-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Sample Skills Gap Analysis</h3>
              
              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Technical Skills Match</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">75%</span>
                </div>                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full w-[75%]"></div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Soft Skills Match</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">60%</span>
                </div>                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full w-[60%]"></div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Experience Match</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">80%</span>
                </div>                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div className="bg-indigo-600 dark:bg-indigo-500 h-2.5 rounded-full w-[80%]"></div>
                </div>
              </div>
              
              <div className="p-4 bg-white dark:bg-slate-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Recommended Skills to Add:</h4>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    TensorFlow (High Priority)
                  </li>
                  <li className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                    Agile Project Management (Medium Priority)
                  </li>
                  <li className="flex items-center">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Docker (Low Priority)
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key Benefits</h3>
              <ul className="space-y-3">
                {[
                  "Identify critical skills gaps that may be preventing you from landing interviews",
                  "Receive prioritized recommendations for skill development based on market demand",
                  "Understand how your skills compare to successful candidates in your target role",
                  "Get specific suggestions for certifications or courses to enhance your qualifications",
                  "Improve your resume's relevance for specific job descriptions"
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
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-700 dark:to-blue-700 rounded-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to identify your skills gaps?</h3>
          <p className="mb-6">Upload your resume now and get a personalized skills gap analysis to boost your job applications.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/upload" className="inline-flex items-center justify-center bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors">
              Analyze My Resume
            </Link>
            <Link to="/pricing" className="inline-flex items-center justify-center bg-indigo-800/20 hover:bg-indigo-800/30 text-white font-semibold px-6 py-3 rounded-lg border border-white/20 transition-colors">
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsGapAnalysisPage;
