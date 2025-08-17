import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp, FileBarChart2, FileSearch, LucideIcon, MoveUpRight, PieChart, Star, Upload } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function JobMatchAnalysisPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'how-it-works' | 'faq'>('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <>
      <Helmet>
        <title>Premium Job Match Analysis | AI Resume Analyzer</title>
        <meta name="description" content="Get instant insights into how well your resume matches a specific job description with our AI-powered Job Match Analysis tool." />
      </Helmet>

      <div className="bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-900 min-h-screen">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 pt-8 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</Link>
          <span>/</span>
          <span className="text-blue-600 dark:text-blue-400 font-medium">Job Match Analysis</span>
        </div>

        {/* Hero section */}
        <section className="container mx-auto px-4 py-10 md:py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/80 to-amber-400/80 backdrop-blur-sm text-white text-sm font-medium mb-6 w-fit border border-amber-300/30 shadow-lg shadow-amber-500/20">
                <Star className="h-4 w-4 mr-2 text-white" fill="currentColor" />
                <span className="font-semibold tracking-wide">PREMIUM FEATURE</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 dark:from-blue-500 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent mb-6">
                Job Match Analysis
              </h1>
              
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                Maximize your chances of landing interviews with our AI-powered job match analysis. 
                Upload your resume and paste a job description to instantly see how well you match and get personalized improvement recommendations.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <a 
                  href="/resume-check" 
                  className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 flex items-center justify-center"
                >
                  <span>Try Premium Match Analysis</span>
                  <MoveUpRight className="ml-2 h-5 w-5" />
                </a>
                
                <a 
                  href="#how-it-works" 
                  className="px-6 py-3.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-xl transition-all duration-300 flex items-center justify-center"
                >
                  <span>See How It Works</span>
                  <ChevronDown className="ml-2 h-5 w-5" />
                </a>
              </div>
              
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-700 dark:text-gray-300">86% average match improvement</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-gray-700 dark:text-gray-300">50,000+ successful applications</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                  <span className="text-gray-700 dark:text-gray-300">AI-powered recommendations</span>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 relative">
              {/* Main image with floating UI cards */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Job Match Analysis in action" 
                  className="w-full h-auto rounded-2xl"
                />
                
                {/* Floating UI elements */}
                <div className="absolute top-10 -right-20 w-64 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg transform rotate-6 animate-float-slow">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Match Score</h4>
                    <div className="bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                      <span className="text-green-600 dark:text-green-400 font-bold">86%</span>
                    </div>
                  </div>
                  
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full mb-3">
                    <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full w-[86%]"></div>
                  </div>
                </div>
                
                <div className="absolute -bottom-10 -left-10 w-72 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg transform -rotate-3 animate-float">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Missing Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {["project management", "agile", "stakeholder", "KPIs"].map((kw) => (
                      <div key={kw} className="bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded text-xs text-amber-700 dark:text-amber-400">
                        {kw}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Tabbed content section */}
        <section id="details" className="py-12 md:py-16 bg-white dark:bg-gray-800/50">
          <div className="container mx-auto px-4">
            <div className="flex justify-center mb-12">
              <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 p-1">
                {(['overview', 'how-it-works', 'faq'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2.5 rounded-md transition-all duration-200 ${
                      activeTab === tab 
                        ? "bg-blue-600 text-white" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    {tab === 'overview' ? 'Overview' : tab === 'how-it-works' ? 'How It Works' : 'FAQ'}
                  </button>
                ))}
              </div>
            </div>
          
            {/* Tab content */}
            <div className="pb-12">
              {activeTab === 'overview' && (
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    Supercharge Your Job Applications
                  </h2>
                  
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-12 text-center">
                    Our premium job match analysis helps you tailor your resume to each job application, 
                    significantly increasing your chances of getting past ATS systems and impressing hiring managers.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                      {
                        icon: FileSearch,
                        title: "ATS Optimization",
                        description: "Get detailed insights on how to optimize your resume for Applicant Tracking Systems to ensure your application gets seen.",
                        color: "bg-blue-100 dark:bg-blue-900/40",
                        iconColor: "text-blue-600 dark:text-blue-400"
                      },
                      {
                        icon: FileBarChart2,
                        title: "Skills Gap Analysis",
                        description: "Identify missing skills and qualifications needed for your target role with personalized recommendations.",
                        color: "bg-purple-100 dark:bg-purple-900/40",
                        iconColor: "text-purple-600 dark:text-purple-400"
                      },
                      {
                        icon: PieChart,
                        title: "Visual Match Breakdowns",
                        description: "See detailed visual breakdowns of how well your resume matches each section of the job requirements.",
                        color: "bg-green-100 dark:bg-green-900/40",
                        iconColor: "text-green-600 dark:text-green-400"
                      },
                    ].map((feature, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                          <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                        <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-16">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      Why Use Job Match Analysis?
                    </h3>
                    
                    <ul className="space-y-4">
                      {[
                        "Applicant Tracking Systems (ATS) filter out 75% of resumes before they reach human eyes",
                        "Most applicants use generic resumes for multiple job applications, reducing their chances",
                        "Hiring managers spend an average of just 7 seconds reviewing a resume",
                        "Tailored resumes are 3x more likely to get an interview than generic ones",
                        "Our AI analyzes thousands of successful resumes to provide data-driven recommendations"
                      ].map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-1 mr-3 shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {activeTab === 'how-it-works' && (
                <div id="how-it-works" className="max-w-4xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    How Job Match Analysis Works
                  </h2>
                  
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-12 text-center">
                    Our advanced AI technology analyzes your resume against job descriptions to provide actionable insights in seconds.
                  </p>
                  
                  <div className="space-y-12 mb-12">
                    {[
                      {
                        step: 1,
                        title: "Upload Your Resume",
                        description: "Start by uploading your current resume in PDF, DOCX, or TXT format. Our system will parse and analyze your document.",
                        icon: Upload
                      },
                      {
                        step: 2,
                        title: "Paste Job Description",
                        description: "Copy and paste the job description you're interested in. The more detailed the description, the better our analysis will be.",
                        icon: FileSearch
                      },
                      {
                        step: 3,
                        title: "Review Match Analysis",
                        description: "Get instant insights into how well your resume matches the job requirements, with a detailed percentage breakdown and visualization.",
                        icon: PieChart
                      },
                      {
                        step: 4,
                        title: "Apply Recommendations",
                        description: "Follow our AI-powered recommendations to optimize your resume for the specific job, including keyword suggestions and content improvements.",
                        icon: CheckCircle2
                      }
                    ].map((step) => (
                      <div key={step.step} className="flex items-start md:items-center">
                        <div className="mr-6 shrink-0">
                          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                            {step.step}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                          <p className="text-gray-700 dark:text-gray-300">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 border border-blue-100 dark:border-blue-900/20">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Behind The Technology
                    </h3>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Our job match analysis is powered by advanced natural language processing and machine learning algorithms 
                      that understand the context and relevance of your resume content against job requirements.
                    </p>
                    
                    <p className="text-gray-700 dark:text-gray-300">
                      The system has been trained on millions of successful resumes and job descriptions to identify patterns 
                      that lead to successful job applications across different industries and job roles.
                    </p>
                  </div>
                </div>
              )}
              
              {activeTab === 'faq' && (
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    Frequently Asked Questions
                  </h2>
                  
                  <div className="space-y-4 mt-8">
                    {[
                      {
                        question: "How accurate is the job match analysis?",
                        answer: "Our match analysis is highly accurate, with a precision rate of over 95%. The system has been trained on millions of successful resumes and job applications across various industries to ensure reliable recommendations."
                      },
                      {
                        question: "How many job descriptions can I analyze with the premium plan?",
                        answer: "With our premium plan, you can analyze up to 25 job descriptions per month against your resume. This allows you to apply for multiple positions with tailored resumes that significantly increase your chances of getting interviews."
                      },
                      {
                        question: "Can I analyze different versions of my resume against the same job?",
                        answer: "Yes! Our premium plan allows you to upload multiple versions of your resume and compare how each performs against a specific job description. This is particularly useful when you want to test different formats or content emphasis."
                      },
                      {
                        question: "How long does the analysis take?",
                        answer: "The job match analysis typically takes 15-30 seconds to complete, depending on the length and complexity of your resume and the job description. You'll receive instant actionable recommendations as soon as the analysis is complete."
                      },
                      {
                        question: "What file formats do you support for resume uploads?",
                        answer: "We support PDF, DOCX, DOC, RTF, and TXT formats for resume uploads. For best results, we recommend using PDF or DOCX formats as they preserve formatting that may be important for the analysis."
                      },
                    ].map((faq, index) => (
                      <div 
                        key={index} 
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden"
                      >
                        <button 
                          className="w-full px-6 py-4 text-left flex justify-between items-center"
                          onClick={() => toggleFaq(index)}
                        >
                          <span className="font-semibold text-gray-900 dark:text-white">{faq.question}</span>
                          {expandedFaq === index ? 
                            <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" /> : 
                            <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                          }
                        </button>
                        
                        {expandedFaq === index && (
                          <div className="px-6 pb-4">
                            <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* CTA Section */}
            <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-800 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
              {/* Background particle effects */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 left-1/4 w-3 h-3 rounded-full bg-white/20 animate-float-slow"></div>
                <div className="absolute top-3/4 left-1/5 w-2 h-2 rounded-full bg-white/20 animate-float"></div>
                <div className="absolute bottom-1/3 right-1/4 w-4 h-4 rounded-full bg-white/10 animate-float-slow-offset"></div>
              </div>
              
              <div className="relative z-10 max-w-3xl mx-auto text-center">
                <Star className="h-8 w-8 text-amber-400 mx-auto mb-4" fill="currentColor" />
                
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready to Maximize Your Job Application Success?
                </h2>
                
                <p className="text-lg text-blue-100 mb-8">
                  Get instant job match analysis and personalized recommendations to improve your resume and land more interviews.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/resume-check" 
                    className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40"
                  >
                    Try Premium Match Analysis
                  </a>
                  
                  <a 
                    href="/pricing" 
                    className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/20 backdrop-blur-sm transition-all duration-300"
                  >
                    View Pricing Plans
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
