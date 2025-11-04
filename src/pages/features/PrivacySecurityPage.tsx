import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ShieldCheck, Lock, ShieldAlert } from 'lucide-react';

export const PrivacySecurityPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-8 text-gray-600 dark:text-gray-400">
        <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">Privacy & Security</span>
      </div>
      
      {/* Back button */}
      <Link to="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to home
      </Link>
      
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 mb-10">
        {/* Feature Header */}
        <div className="flex flex-col md:flex-row md:items-center mb-10 gap-6">
          <div className="bg-red-100 dark:bg-red-900/40 rounded-xl p-5 md:p-6 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="h-10 w-10 md:h-12 md:w-12 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Privacy & Security</h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl">
              Your data is protected with enterprise-grade encryption and is never shared with third parties.
            </p>
          </div>
        </div>
        
        {/* Main content */}
        <div className="space-y-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Data, Your Control</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Your resume contains sensitive personal information, and you deserve to know that it's being handled with the utmost care and security. At Resume Analyzer, we've built our platform with privacy and security as fundamental principles.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              We use industry-leading security practices and encryption to ensure your data is protected at all times, and we provide you with complete control over how your information is stored and used.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Security Infrastructure</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 dark:bg-slate-700/30 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-3">
                  <div className="bg-red-100 dark:bg-red-900/40 rounded-lg p-2 mr-3">
                    <Lock className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">End-to-End Encryption</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  All your data is encrypted in transit and at rest using AES-256 encryption, the same standard used by banks and government institutions.
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-slate-700/30 p-6 rounded-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center mb-3">
                  <div className="bg-red-100 dark:bg-red-900/40 rounded-lg p-2 mr-3">
                    <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Strict Access Controls</h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Our systems enforce strict access controls and authentication protocols to ensure only you can access your personal data.
                </p>
              </div>
            </div>
            
            <div className="border border-red-100 dark:border-red-800/50 rounded-xl p-6 bg-red-50 dark:bg-red-900/20 mt-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Our Privacy Commitments</h3>
              
              <div className="space-y-5">
                <div className="flex items-start">
                  <div className="bg-white dark:bg-slate-700 rounded-full p-1.5 mr-3 mt-1">
                    <svg className="h-5 w-5 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg">No Third-Party Data Sharing</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      We never sell or share your data with third parties. Your personal information, resume content, and analysis results are strictly confidential.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white dark:bg-slate-700 rounded-full p-1.5 mr-3 mt-1">
                    <svg className="h-5 w-5 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Data Retention Control</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      You decide how long we keep your data. Delete your resume and personal information at any time with our one-click permanent deletion feature.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white dark:bg-slate-700 rounded-full p-1.5 mr-3 mt-1">
                    <svg className="h-5 w-5 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg">Transparent Privacy Policy</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      Our privacy policy is written in clear, straightforward language, so you know exactly how your data is used and protected.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-gray-50 dark:bg-slate-700/30 rounded-xl border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Security Certifications & Compliance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="w-12 h-12 flex items-center justify-center mb-3 text-gray-800 dark:text-gray-200">
                    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white text-center">GDPR Compliant</span>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="w-12 h-12 flex items-center justify-center mb-3 text-gray-800 dark:text-gray-200">
                    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white text-center">SOC 2 Type II</span>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="w-12 h-12 flex items-center justify-center mb-3 text-gray-800 dark:text-gray-200">
                    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white text-center">CCPA Compliant</span>
                </div>
                
                <div className="flex flex-col items-center p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="w-12 h-12 flex items-center justify-center mb-3 text-gray-800 dark:text-gray-200">
                    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white text-center">ISO 27001</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key Security Features</h3>
              <ul className="space-y-3">
                {[
                  "Enterprise-grade encryption for all personal data and resume content",
                  "Secure cloud storage with regular security audits and penetration testing",
                  "Complete control over your data with one-click permanent deletion",
                  "Transparent data usage policies with no hidden clauses",
                  "Regular security updates and continuous monitoring for threats"
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
        <div className="bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-700 dark:to-rose-700 rounded-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Experience secure resume analysis</h3>
          <p className="mb-6">Upload your resume with confidence, knowing your data is protected by industry-leading security measures.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/upload" className="inline-flex items-center justify-center bg-white text-red-600 font-semibold px-6 py-3 rounded-lg hover:bg-red-50 transition-colors">
              Analyze My Resume Securely
            </Link>
            <Link to="/privacy-policy" className="inline-flex items-center justify-center bg-red-800/20 hover:bg-red-800/30 text-white font-semibold px-6 py-3 rounded-lg border border-white/20 transition-colors">
              View Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySecurityPage;
