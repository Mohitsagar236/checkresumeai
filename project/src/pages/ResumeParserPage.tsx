import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FileText, Database, Zap, Shield, ArrowRight, Upload, CheckCircle, Code } from 'lucide-react';

const ResumeParserPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>AI Resume Parser - Extract Data from Resumes | CheckResumeAI</title>
        <meta 
          name="description" 
          content="Advanced AI resume parser that extracts structured data from resumes. Parse contact info, skills, experience, and education with 99% accuracy. Free resume parsing API." 
        />
        <meta name="keywords" content="resume parser, CV parser, resume data extraction, AI resume parsing, resume API, structured data extraction" />
        <link rel="canonical" href="https://checkresumeai.com/resume-parser" />
        
        {/* Open Graph */}
        <meta property="og:title" content="AI Resume Parser - Extract Data from Resumes | CheckResumeAI" />
        <meta property="og:description" content="Advanced AI resume parser that extracts structured data from resumes with 99% accuracy." />
        <meta property="og:url" content="https://checkresumeai.com/resume-parser" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://checkresumeai.com/images/og-image.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Resume Parser - Extract Data from Resumes" />
        <meta name="twitter:description" content="Advanced AI resume parser that extracts structured data from resumes with 99% accuracy." />
        <meta name="twitter:image" content="https://checkresumeai.com/images/twitter-image.jpg" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                AI Resume <span className="text-purple-600">Parser</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Extract structured data from resumes with 99% accuracy using advanced AI. 
                Parse contact information, skills, experience, and education instantly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/upload" 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Parse Resume Now
                </Link>
                <Link 
                  to="/check" 
                  className="border border-purple-600 text-purple-600 hover:bg-purple-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
                >
                  View Sample Output
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-purple-600 mb-2">99%</div>
                <div className="text-gray-600">Parsing Accuracy</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-purple-600 mb-2">&lt;2s</div>
                <div className="text-gray-600">Processing Time</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
                <div className="text-gray-600">Data Fields</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
                <div className="text-gray-600">Secure & Private</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
              Advanced Resume Parsing Capabilities
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              Our AI-powered resume parser extracts comprehensive data from any resume format, 
              providing structured output for seamless integration into your systems.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
                <p className="text-gray-600">
                  Process resumes in under 2 seconds with our optimized AI algorithms 
                  and cloud infrastructure.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Structured Output</h3>
                <p className="text-gray-600">
                  Get clean, structured JSON data that's ready for database storage 
                  and application integration.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Enterprise Security</h3>
                <p className="text-gray-600">
                  Bank-level security with data encryption, GDPR compliance, 
                  and automatic data deletion.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Extraction */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Comprehensive Data Extraction
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-purple-600">Personal Information</h3>
                <ul className="space-y-2">
                  {[
                    "Full name & contact details",
                    "Email & phone number",
                    "LinkedIn & social profiles",
                    "Location & address",
                    "Professional title"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-blue-600">Work Experience</h3>
                <ul className="space-y-2">
                  {[
                    "Job titles & companies",
                    "Employment dates",
                    "Job descriptions",
                    "Key achievements",
                    "Responsibilities"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4 text-green-600">Skills & Education</h3>
                <ul className="space-y-2">
                  {[
                    "Technical skills",
                    "Soft skills",
                    "Certifications",
                    "Degrees & institutions",
                    "Languages"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* API Integration */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Easy API Integration
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Integrate our resume parser into your application with just a few lines of code. 
                  RESTful API with comprehensive documentation and SDKs.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Code className="w-5 h-5 text-purple-600 mr-3" />
                    <span>RESTful API endpoints</span>
                  </div>
                  <div className="flex items-center">
                    <Code className="w-5 h-5 text-purple-600 mr-3" />
                    <span>JSON response format</span>
                  </div>
                  <div className="flex items-center">
                    <Code className="w-5 h-5 text-purple-600 mr-3" />
                    <span>SDKs for popular languages</span>
                  </div>
                  <div className="flex items-center">
                    <Code className="w-5 h-5 text-purple-600 mr-3" />
                    <span>Webhook notifications</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 p-6 rounded-lg">
                <div className="text-green-400 text-sm mb-2">// Sample API Response</div>
                <pre className="text-gray-300 text-sm overflow-x-auto">
{`{
  "name": "John Doe",
  "email": "checkresmueai@gmail.com",
  "phone": "+1-555-0123",
  "experience": [
    {
      "title": "Software Engineer",
      "company": "Tech Corp",
      "dates": "2020-2023",
      "description": "..."
    }
  ],
  "skills": ["JavaScript", "React", "Node.js"],
  "education": [
    {
      "degree": "Computer Science",
      "institution": "MIT",
      "year": "2020"
    }
  ]
}`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Perfect for Multiple Use Cases
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <FileText className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">ATS Systems</h3>
                <p className="text-gray-600 text-sm">
                  Automatically extract candidate data for applicant tracking systems.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <Database className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">HR Platforms</h3>
                <p className="text-gray-600 text-sm">
                  Populate candidate databases and talent management systems.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Recruitment</h3>
                <p className="text-gray-600 text-sm">
                  Streamline candidate screening and matching processes.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <Code className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Job Boards</h3>
                <p className="text-gray-600 text-sm">
                  Auto-populate user profiles from uploaded resumes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Start Parsing Resumes Today
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Try our resume parser free and see the structured data extraction in action.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/upload" 
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center"
              >
                <Upload className="w-5 h-5 mr-2" />
                Try Free Parser
              </Link>
              <Link 
                to="/pricing" 
                className="border border-white text-white hover:bg-purple-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center"
              >
                View API Pricing
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ResumeParserPage;
