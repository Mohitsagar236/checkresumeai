import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { MessageSquare, TrendingUp, Award, Users, ArrowRight, Upload, CheckCircle } from 'lucide-react';

const ResumeFeedbackPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>AI Resume Feedback - Get Expert Resume Reviews | CheckResumeAI</title>
        <meta 
          name="description" 
          content="Get instant AI-powered resume feedback with detailed reviews, improvement suggestions, and personalized recommendations. Free resume feedback from expert AI technology." 
        />
        <meta name="keywords" content="resume feedback, resume review, resume critique, AI resume feedback, free resume feedback, resume improvement" />
        <link rel="canonical" href="https://checkresumeai.com/resume-feedback" />
        
        {/* Open Graph */}
        <meta property="og:title" content="AI Resume Feedback - Get Expert Resume Reviews | CheckResumeAI" />
        <meta property="og:description" content="Get instant AI-powered resume feedback with detailed reviews, improvement suggestions, and personalized recommendations." />
        <meta property="og:url" content="https://checkresumeai.com/resume-feedback" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://checkresumeai.com/images/og-image.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Resume Feedback - Get Expert Resume Reviews" />
        <meta name="twitter:description" content="Get instant AI-powered resume feedback with detailed reviews and improvement suggestions." />
        <meta name="twitter:image" content="https://checkresumeai.com/images/twitter-image.jpg" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        {/* Hero Section */}
        <section className="pt-36 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Expert Resume <span className="text-green-600">Feedback</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Get detailed, actionable feedback on your resume from our AI expert trained on 
                successful hiring practices and recruiter preferences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/upload" 
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Get Free Resume Feedback
                </Link>
                <Link 
                  to="/check" 
                  className="border border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
                >
                  See Sample Feedback
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
              Why Get Resume Feedback?
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              Professional resume feedback can increase your interview rate by up to 40%. 
              Our AI provides the same quality feedback as professional resume writers.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Increase Interview Rate</h3>
                <p className="text-gray-600">
                  Get 40% more interviews with optimized resume content and structure.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Detailed Reviews</h3>
                <p className="text-gray-600">
                  Receive comprehensive feedback on every section of your resume.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Expert Quality</h3>
                <p className="text-gray-600">
                  AI trained on thousands of successful resumes and hiring patterns.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Recruiter Insights</h3>
                <p className="text-gray-600">
                  Feedback based on what recruiters and hiring managers actually want.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feedback Types */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Comprehensive Feedback Categories
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold mb-4 text-green-600">Content & Structure</h3>
                <ul className="space-y-3">
                  {[
                    "Professional summary optimization",
                    "Work experience impact statements",
                    "Skills section relevance",
                    "Education placement and formatting",
                    "Achievement quantification",
                    "Industry-specific keywords"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold mb-4 text-blue-600">Format & Design</h3>
                <ul className="space-y-3">
                  {[
                    "ATS-friendly formatting",
                    "Visual hierarchy and readability",
                    "White space optimization",
                    "Font and style consistency",
                    "Section organization",
                    "Length and conciseness"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              How Our Resume Feedback Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">Upload & Analyze</h3>
                <p className="text-gray-600">
                  Upload your resume and our AI immediately begins comprehensive analysis of content, 
                  structure, and formatting.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">Expert Review</h3>
                <p className="text-gray-600">
                  Our AI applies hiring best practices and recruiter insights to provide detailed, 
                  section-by-section feedback.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">Actionable Report</h3>
                <p className="text-gray-600">
                  Receive a detailed feedback report with specific suggestions, examples, 
                  and prioritized improvements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sample Feedback */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Sample Feedback Report
            </h2>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="border-l-4 border-green-500 pl-6 mb-6">
                <h3 className="text-lg font-semibold text-green-600 mb-2">✓ Strong Points</h3>
                <p className="text-gray-700">
                  "Your professional summary effectively highlights 5+ years of experience and includes 
                  relevant industry keywords. The quantified achievements in your work experience 
                  demonstrate clear value proposition."
                </p>
              </div>
              
              <div className="border-l-4 border-yellow-500 pl-6 mb-6">
                <h3 className="text-lg font-semibold text-yellow-600 mb-2">⚠ Areas for Improvement</h3>
                <p className="text-gray-700">
                  "Consider adding more specific metrics to your achievements. Instead of 'improved sales,' 
                  try 'increased sales by 25% over 6 months.' Also, your skills section could benefit 
                  from industry-specific technical skills."
                </p>
              </div>
              
              <div className="border-l-4 border-red-500 pl-6">
                <h3 className="text-lg font-semibold text-red-600 mb-2">🚨 Critical Issues</h3>
                <p className="text-gray-700">
                  "Your resume format may not be ATS-compatible. Consider using standard section headers 
                  and avoiding complex formatting that could cause parsing errors."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-green-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready for Expert Resume Feedback?
            </h2>
            <p className="text-xl text-green-100 mb-8">
              Join thousands of job seekers who've improved their resumes with our detailed feedback.
            </p>
            <Link 
              to="/upload" 
              className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center"
            >
              <Upload className="w-5 h-5 mr-2" />
              Get Your Free Feedback Now
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default ResumeFeedbackPage;
