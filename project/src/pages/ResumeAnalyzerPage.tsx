import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { CheckCircle, Zap, Target, Star, ArrowRight, Upload } from 'lucide-react';

const ResumeAnalyzerPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>AI Resume Analyzer - Free Resume Analysis Tool | CheckResumeAI</title>
        <meta 
          name="description" 
          content="Free AI-powered resume analyzer that provides instant feedback, ATS compatibility score, and expert recommendations. Analyze your resume in seconds and land more interviews." 
        />
        <meta name="keywords" content="resume analyzer, AI resume analysis, free resume checker, resume feedback, ATS optimization, resume scanner" />
        <link rel="canonical" href="https://checkresumeai.com/resume-analyzer" />
        
        {/* Open Graph */}
        <meta property="og:title" content="AI Resume Analyzer - Free Resume Analysis Tool | CheckResumeAI" />
        <meta property="og:description" content="Free AI-powered resume analyzer that provides instant feedback, ATS compatibility score, and expert recommendations. Analyze your resume in seconds and land more interviews." />
        <meta property="og:url" content="https://checkresumeai.com/resume-analyzer" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://checkresumeai.com/images/og-image.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Resume Analyzer - Free Resume Analysis Tool" />
        <meta name="twitter:description" content="Free AI-powered resume analyzer that provides instant feedback, ATS compatibility score, and expert recommendations." />
        <meta name="twitter:image" content="https://checkresumeai.com/images/twitter-image.jpg" />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "CheckResumeAI Resume Analyzer",
            "description": "Free AI-powered resume analyzer that provides instant feedback, ATS compatibility score, and expert recommendations.",
            "url": "https://checkresumeai.com/resume-analyzer",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "INR"
            },
            "featureList": [
              "AI-powered resume analysis",
              "ATS compatibility checking",
              "Instant feedback and recommendations",
              "Free resume scoring"
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="pt-36 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                AI Resume <span className="text-blue-600">Analyzer</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Get instant AI-powered analysis of your resume with ATS compatibility scores, 
                personalized feedback, and expert recommendations to land more interviews.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/upload" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Analyze Your Resume Free
                </Link>
                <Link 
                  to="/check" 
                  className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
                >
                  View Sample Analysis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 mb-16">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span>4.9/5 Rating</span>
              </div>
              <div>500,000+ Resumes Analyzed</div>
              <div>100% Free Analysis</div>
              <div>ATS Compatible</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
              Why Choose Our Resume Analyzer?
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              Our AI-powered resume analyzer provides comprehensive insights that help you optimize 
              your resume for both ATS systems and human recruiters.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Instant Analysis</h3>
                <p className="text-gray-600">
                  Get your resume analyzed in under 30 seconds with our advanced AI algorithms 
                  that scan every section of your resume.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">ATS Optimization</h3>
                <p className="text-gray-600">
                  Ensure your resume passes through Applicant Tracking Systems with our 
                  ATS compatibility checker and optimization tips.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Expert Feedback</h3>
                <p className="text-gray-600">
                  Receive actionable recommendations from our AI trained on thousands of 
                  successful resumes and hiring manager preferences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              How Our Resume Analyzer Works
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">Upload Your Resume</h3>
                <p className="text-gray-600">
                  Simply upload your resume in PDF, Word, or text format. Our system supports all major file types.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
                <p className="text-gray-600">
                  Our AI analyzes your resume for format, content, keywords, ATS compatibility, and more.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">Get Recommendations</h3>
                <p className="text-gray-600">
                  Receive a detailed report with your score, specific feedback, and actionable improvement suggestions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Analysis Features */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Comprehensive Resume Analysis Features
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                "ATS Compatibility Score",
                "Keyword Optimization",
                "Format & Structure Analysis",
                "Content Quality Review",
                "Skills Gap Identification",
                "Industry-Specific Feedback",
                "Grammar & Spelling Check",
                "Achievement Impact Analysis"
              ].map((feature, index) => (
                <div key={index} className="flex items-center p-4 border border-gray-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Is the resume analyzer really free?</h3>
                <p className="text-gray-600">
                  Yes! Our basic resume analysis is completely free. You can upload your resume and get instant feedback, 
                  ATS compatibility scores, and improvement recommendations without any cost.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">What file formats do you support?</h3>
                <p className="text-gray-600">
                  We support PDF, Word (.doc, .docx), and plain text files. PDF is recommended for the most accurate analysis.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">How accurate is the ATS compatibility check?</h3>
                <p className="text-gray-600">
                  Our ATS compatibility checker is trained on real ATS systems used by major companies. It provides 
                  highly accurate assessments of how well your resume will perform in automated screening processes.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">Is my resume data secure and private?</h3>
                <p className="text-gray-600">
                  Absolutely. We use enterprise-grade security to protect your data. Your resume is analyzed securely 
                  and we never share your personal information with third parties.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-blue-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Optimize Your Resume?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join over 500,000 job seekers who have improved their resumes with our AI analyzer.
            </p>
            <Link 
              to="/upload" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center"
            >
              <Upload className="w-5 h-5 mr-2" />
              Start Free Analysis Now
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default ResumeAnalyzerPage;
