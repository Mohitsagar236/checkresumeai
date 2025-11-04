import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Layers, Building, Award } from 'lucide-react';

export const IndustrySpecificInsightsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-8 text-gray-600 dark:text-gray-400">
        <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Industry-Specific Insights</span>
      </div>
      
      {/* Back button */}
      <Link to="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to home
      </Link>
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 mb-10">
        {/* Feature Header */}
        <div className="flex flex-col md:flex-row md:items-center mb-10 gap-6">
          <div className="bg-purple-100 dark:bg-purple-900/40 rounded-xl p-5 md:p-6 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center flex-shrink-0">
            <Layers className="h-10 w-10 md:h-12 md:w-12 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Industry-Specific Insights</h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl">
              Get tailored recommendations based on industry standards and expectations for your specific field.
            </p>
          </div>
        </div>
        
        {/* Main content */}
        <div className="space-y-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why Industry Context Matters</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Different industries have vastly different expectations when it comes to resumes. What works perfectly in tech might be inappropriate for finance, and what's standard in healthcare could be insufficient for marketing roles.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Our Industry-Specific Insights feature leverages data from thousands of successful resumes across dozens of industries to provide you with tailored recommendations that match the expectations in your field.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How Our Industry Insights Work</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 dark:bg-slate-700/30 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-3">
                  <div className="bg-purple-100 dark:bg-purple-900/40 rounded-lg p-2 mr-3">
                    <Building className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Industry Benchmarking</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  We analyze your resume against successful candidates in your specific industry, identifying gaps and opportunities for improvement.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-slate-700/30 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-3">
                  <div className="bg-purple-100 dark:bg-purple-900/40 rounded-lg p-2 mr-3">
                    <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Specialized Terminology</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  We suggest industry-specific terminology, certifications, and achievements that are valued by recruiters in your field.
                </p>
              </div>
            </div>
            
            <div className="border border-purple-100 dark:border-purple-800/50 rounded-xl p-6 bg-purple-50 dark:bg-purple-900/20">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Supported Industries</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "Technology & Software",
                  "Finance & Banking",
                  "Healthcare & Life Sciences",
                  "Marketing & Advertising",
                  "Education & Research",
                  "Engineering & Manufacturing",
                  "Legal & Compliance",
                  "Retail & E-commerce",
                  "Creative & Design",
                  "Sales & Business Development",
                  "Human Resources",
                  "Consulting"
                ].map((industry, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 shrink-0" />
                    <span className="text-gray-800 dark:text-gray-200 text-sm">{industry}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key Benefits</h3>
              <ul className="space-y-3">
                {[
                  "Tailored content recommendations specific to your industry's expectations",
                  "Insights on industry-specific skills that hiring managers are looking for",
                  "Format suggestions that match the standards in your field",
                  "Recommendations on certifications and credentials to highlight",
                  "Industry-specific achievement metrics that demonstrate your value"
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
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 rounded-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Get industry-specific recommendations today</h3>
          <p className="mb-6">Upload your resume and select your industry to receive tailored insights in minutes.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/upload" className="inline-flex items-center justify-center bg-white text-purple-600 font-semibold px-6 py-3 rounded-lg hover:bg-purple-50 transition-colors">
              Analyze My Resume
            </Link>
            <Link to="/pricing" className="inline-flex items-center justify-center bg-purple-800/20 hover:bg-purple-800/30 text-white font-semibold px-6 py-3 rounded-lg border border-white/20 transition-colors">
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustrySpecificInsightsPage;
