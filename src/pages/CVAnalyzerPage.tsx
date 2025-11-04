import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FileSearch, Globe, Award, TrendingUp, ArrowRight, Upload, CheckCircle, Users } from 'lucide-react';

const CVAnalyzerPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>AI CV Analyzer - Professional CV Analysis Tool | CheckResumeAI</title>
        <meta 
          name="description" 
          content="Professional AI CV analyzer for international job markets. Analyze your CV for European, UK, and global standards with expert feedback and optimization tips." 
        />
        <meta name="keywords" content="CV analyzer, curriculum vitae analyzer, CV checker, international CV analysis, European CV standards, UK CV analysis" />
        <link rel="canonical" href="https://checkresumeai.com/cv-analyzer" />
        
        {/* Open Graph */}
        <meta property="og:title" content="AI CV Analyzer - Professional CV Analysis Tool | CheckResumeAI" />
        <meta property="og:description" content="Professional AI CV analyzer for international job markets with expert feedback and optimization." />
        <meta property="og:url" content="https://checkresumeai.com/cv-analyzer" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://checkresumeai.com/images/og-image.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI CV Analyzer - Professional CV Analysis Tool" />
        <meta name="twitter:description" content="Professional AI CV analyzer for international job markets with expert feedback." />
        <meta name="twitter:image" content="https://checkresumeai.com/images/twitter-image.jpg" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Professional CV <span className="text-teal-600">Analyzer</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Comprehensive CV analysis for international job markets. Optimize your curriculum vitae 
                for European, UK, and global employment standards with AI-powered insights.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/upload" 
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Analyze Your CV
                </Link>
                <Link 
                  to="/check" 
                  className="border border-teal-600 text-teal-600 hover:bg-teal-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
                >
                  View Sample Analysis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>

            {/* Global Standards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Globe className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">European Standards</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Award className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">UK Formatting</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Users className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Global Markets</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <TrendingUp className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                <div className="text-sm text-gray-600">Career Optimization</div>
              </div>
            </div>
          </div>
        </section>

        {/* CV vs Resume */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
              CV Analysis for International Markets
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              Unlike resumes, CVs require different formatting, content structure, and cultural considerations 
              for different regions. Our AI understands these nuances.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Regional Standards</h3>
                <p className="text-gray-600">
                  Analysis tailored to European, UK, Australian, and other international 
                  CV formatting standards and expectations.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileSearch className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Comprehensive Review</h3>
                <p className="text-gray-600">
                  Detailed analysis of academic credentials, publications, research, 
                  and professional accomplishments formatting.
                </p>
              </div>
              
              <div className="text-center p-6">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Cultural Context</h3>
                <p className="text-gray-600">
                  Understands cultural differences in CV presentation, including 
                  photo inclusion, personal details, and reference formats.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CV Sections Analysis */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Comprehensive CV Section Analysis
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold mb-6 text-teal-600">Academic & Professional</h3>
                <ul className="space-y-3">
                  {[
                    "Educational background and qualifications",
                    "Professional experience and roles",
                    "Research experience and projects",
                    "Publications and academic work",
                    "Conference presentations",
                    "Professional memberships"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold mb-6 text-blue-600">Skills & Achievements</h3>
                <ul className="space-y-3">
                  {[
                    "Technical and language skills",
                    "Certifications and licenses",
                    "Awards and honors",
                    "Volunteer work and activities",
                    "International experience",
                    "References and recommendations"
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

        {/* Regional Differences */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              Regional CV Standards We Analyze
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-blue-800">European CVs</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Europass format compatibility</li>
                  <li>• Personal information standards</li>
                  <li>• Language proficiency levels</li>
                  <li>• Photo inclusion guidelines</li>
                  <li>• Date formatting (DD/MM/YYYY)</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-green-800">UK CVs</h3>
                <ul className="space-y-2 text-sm">
                  <li>• British spelling and terminology</li>
                  <li>• Personal statement structure</li>
                  <li>• A-level and GCSE formatting</li>
                  <li>• Reference contact details</li>
                  <li>• Professional body memberships</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-purple-800">Academic CVs</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Research experience prominence</li>
                  <li>• Publication formatting (APA/MLA)</li>
                  <li>• Conference presentation details</li>
                  <li>• Grant and funding history</li>
                  <li>• Teaching experience format</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CV Analysis Process */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              How Our CV Analyzer Works
            </h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-teal-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-3">Upload CV</h3>
                <p className="text-gray-600 text-sm">
                  Upload your CV in any format and select your target region/market.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-teal-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-3">Regional Analysis</h3>
                <p className="text-gray-600 text-sm">
                  AI analyzes your CV against regional standards and cultural expectations.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-teal-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-3">Detailed Review</h3>
                <p className="text-gray-600 text-sm">
                  Comprehensive analysis of content, structure, and formatting.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-teal-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  4
                </div>
                <h3 className="text-lg font-semibold mb-3">Optimization Report</h3>
                <p className="text-gray-600 text-sm">
                  Receive region-specific recommendations and improvement suggestions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              CV Analysis FAQ
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">What's the difference between CV and resume analysis?</h3>
                <p className="text-gray-600">
                  CVs are typically longer, more detailed documents used internationally and in academic settings. 
                  Our CV analyzer understands regional formatting differences, academic presentation standards, 
                  and cultural expectations that differ from US-style resumes.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Which countries' CV standards do you support?</h3>
                <p className="text-gray-600">
                  We support European Union (including Europass format), United Kingdom, Australia, Canada, 
                  and academic CV standards used globally. Our AI is trained on region-specific requirements 
                  and cultural preferences.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Do you analyze academic CVs differently?</h3>
                <p className="text-gray-600">
                  Yes! Academic CVs require different analysis focusing on research experience, publications, 
                  conference presentations, grants, and teaching experience. Our analyzer understands these 
                  specialized requirements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-teal-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Optimize Your CV for International Success
            </h2>
            <p className="text-xl text-teal-100 mb-8">
              Get expert analysis tailored to your target market and increase your chances of landing interviews abroad.
            </p>
            <Link 
              to="/upload" 
              className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center"
            >
              <Upload className="w-5 h-5 mr-2" />
              Analyze Your CV Now
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default CVAnalyzerPage;
