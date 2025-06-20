import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Search, Eye, Target, Zap, ArrowRight, Upload, CheckCircle, AlertTriangle } from 'lucide-react';

const ResumeScannerPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>AI Resume Scanner - Scan & Optimize Your Resume | CheckResumeAI</title>
        <meta 
          name="description" 
          content="Advanced AI resume scanner that detects issues, optimizes keywords, and ensures ATS compatibility. Free resume scanning with instant results and improvement suggestions." 
        />
        <meta name="keywords" content="resume scanner, CV scanner, resume checker, ATS resume scanner, resume optimization scanner, keyword scanner" />
        <link rel="canonical" href="https://checkresumeai.com/resume-scanner" />
        
        {/* Open Graph */}
        <meta property="og:title" content="AI Resume Scanner - Scan & Optimize Your Resume | CheckResumeAI" />
        <meta property="og:description" content="Advanced AI resume scanner that detects issues, optimizes keywords, and ensures ATS compatibility." />
        <meta property="og:url" content="https://checkresumeai.com/resume-scanner" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://checkresumeai.com/images/og-image.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Resume Scanner - Scan & Optimize Your Resume" />
        <meta name="twitter:description" content="Advanced AI resume scanner that detects issues and optimizes keywords for ATS compatibility." />
        <meta name="twitter:image" content="https://checkresumeai.com/images/twitter-image.jpg" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                AI Resume <span className="text-orange-600">Scanner</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Comprehensive resume scanning that detects hidden issues, optimizes keywords, 
                and ensures your resume passes ATS systems with flying colors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/upload" 
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Scan Resume Now
                </Link>
                <Link 
                  to="/check" 
                  className="border border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
                >
                  View Scan Results
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>

            {/* Scanner Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-orange-600 mb-2">15+</div>
                <div className="text-gray-600">Issues Detected</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-orange-600 mb-2">500+</div>
                <div className="text-gray-600">Keywords Analyzed</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
                <div className="text-gray-600">ATS Pass Rate</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-orange-600 mb-2">&lt;10s</div>
                <div className="text-gray-600">Scan Time</div>
              </div>
            </div>
          </div>
        </section>

        {/* Scanning Features */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
              Comprehensive Resume Scanning
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              Our AI scanner examines every aspect of your resume to identify issues, 
              optimize content, and ensure maximum ATS compatibility.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Deep Content Scan</h3>
                <p className="text-gray-600">
                  Scans every word, phrase, and section to identify formatting issues, 
                  missing keywords, and content gaps.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Keyword Optimization</h3>
                <p className="text-gray-600">
                  Analyzes job-relevant keywords and suggests improvements to increase 
                  your resume's searchability.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">ATS Compatibility</h3>
                <p className="text-gray-600">
                  Ensures your resume format and structure are compatible with 
                  major ATS systems used by employers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Scan */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              What Our Scanner Detects
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold mb-6 text-red-600 flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-2" />
                  Critical Issues
                </h3>
                <ul className="space-y-3">
                  {[
                    "ATS incompatible formatting",
                    "Missing contact information", 
                    "Unparseable content sections",
                    "Poor keyword density",
                    "Inconsistent date formats",
                    "Overly complex layouts"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold mb-6 text-green-600 flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  Optimization Opportunities
                </h3>
                <ul className="space-y-3">
                  {[
                    "Keyword enhancement suggestions",
                    "Content structure improvements",
                    "Achievement quantification tips",
                    "Skills section optimization",
                    "Professional summary refinement",
                    "Section order recommendations"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Scan Process */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              How Our Resume Scanner Works
            </h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-3">Upload Resume</h3>
                <p className="text-gray-600 text-sm">
                  Upload your resume in any format - PDF, Word, or text.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-3">Deep Scan</h3>
                <p className="text-gray-600 text-sm">
                  AI performs comprehensive analysis of content, format, and structure.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-3">Issue Detection</h3>
                <p className="text-gray-600 text-sm">
                  Identifies problems and optimization opportunities.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h3 className="text-lg font-semibold mb-3">Get Results</h3>
                <p className="text-gray-600 text-sm">
                  Receive detailed scan report with actionable recommendations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Scan Results Preview */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Sample Scan Results
            </h2>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">Resume Scan Summary</h3>
                <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-semibold">
                  Score: 78/100
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="border-l-4 border-red-500 pl-6">
                  <h4 className="font-semibold text-red-600 mb-2">🚨 Critical Issues Found (2)</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Header contains tables that may not parse correctly in ATS</li>
                    <li>• Missing important keywords for your target role</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-yellow-500 pl-6">
                  <h4 className="font-semibold text-yellow-600 mb-2">⚠ Improvement Opportunities (5)</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Add more quantified achievements in work experience</li>
                    <li>• Optimize skills section with industry-specific keywords</li>
                    <li>• Consider adding a professional summary section</li>
                  </ul>
                </div>
                
                <div className="border-l-4 border-green-500 pl-6">
                  <h4 className="font-semibold text-green-600 mb-2">✅ Strengths Detected (4)</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Clean, professional formatting</li>
                    <li>• Proper use of bullet points and white space</li>
                    <li>• Consistent date formatting throughout</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-orange-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Scan Your Resume in Seconds
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Get instant insights into your resume's strengths and weaknesses with our advanced AI scanner.
            </p>
            <Link 
              to="/upload" 
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Start Free Scan Now
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default ResumeScannerPage;
