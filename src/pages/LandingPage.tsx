import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FAQSchema, ReviewSchema, HowToSchema } from '../components/AdvancedSchema';

const LandingPage: React.FC = () => {
  const faqs = [
    {
      question: "How accurate is the AI resume analyzer?",
      answer: "Our AI resume analyzer uses advanced machine learning algorithms trained on thousands of successful resumes and ATS systems. It provides 95%+ accuracy in identifying optimization opportunities and ATS compatibility issues."
    },
    {
      question: "Is the resume analyzer really free?",
      answer: "Yes! Our basic resume analysis is completely free. You can analyze your resume, get an ATS compatibility score, and receive improvement suggestions without any cost. Premium features like detailed industry insights are available for advanced users."
    },
    {
      question: "What file formats does the resume analyzer support?",
      answer: "We support PDF, DOC, and DOCX file formats. PDF is recommended for best analysis accuracy as it preserves formatting that ATS systems typically see."
    },
    {
      question: "How long does the resume analysis take?",
      answer: "Most resume analyses complete within 30-60 seconds. Our AI processes your resume content, checks ATS compatibility, analyzes keyword optimization, and generates a comprehensive report almost instantly."
    },
    {
      question: "Can the tool help me beat Applicant Tracking Systems (ATS)?",
      answer: "Absolutely! Our analyzer specifically tests your resume against common ATS systems used by 88% of companies. We check format compatibility, keyword optimization, and section parsing to ensure your resume passes ATS screening."
    }
  ];

  const howToSteps = [
    {
      name: "Upload Your Resume",
      text: "Click the upload button and select your resume file (PDF, DOC, or DOCX). Our secure system processes your document safely."
    },
    {
      name: "AI Analysis Begins",
      text: "Our advanced AI analyzes your resume content, format, ATS compatibility, keyword density, and overall structure."
    },
    {
      name: "Get Instant Results",
      text: "Receive a comprehensive score and detailed feedback on how to improve your resume for better job application success."
    },
    {
      name: "Implement Improvements",
      text: "Follow our specific recommendations to optimize your resume for both ATS systems and human recruiters."
    }
  ];

  const reviews = [
    {
      author: "Sarah Johnson",
      rating: 5,
      text: "This tool completely transformed my resume! I went from getting zero responses to landing 3 interviews in my first week after optimization.",
      date: "2025-05-15"
    },
    {
      author: "Michael Chen",
      rating: 5,
      text: "The ATS compatibility check was a game-changer. I had no idea my resume wasn't being read by the systems. Fixed it and got hired within a month!",
      date: "2025-05-10"
    },
    {
      author: "Emily Rodriguez",
      rating: 4,
      text: "Great insights and actionable feedback. The keyword suggestions helped me tailor my resume for each application.",
      date: "2025-05-08"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Free AI Resume Analyzer & ATS Checker | CheckResumeAI - Optimize Your Resume for 2025</title>
        <meta name="description" content="Analyze your resume for free with AI-powered feedback. Check ATS compatibility, get instant scoring, and optimize for job applications. Used by 50,000+ job seekers." />
        <meta name="keywords" content="free resume analyzer, ATS checker, resume scanner, CV analyzer, resume optimization, job application tool, resume feedback, AI resume review" />
        <link rel="canonical" href="https://checkresumeai.com/" />
      </Helmet>

      <FAQSchema faqs={faqs} />
      <ReviewSchema rating={4.8} reviewCount={1247} reviews={reviews} />
      <HowToSchema 
        name="How to Analyze Your Resume with AI"
        description="Step-by-step guide to using our free AI resume analyzer for better job application results"
        steps={howToSteps}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <section className="pt-20 pb-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Free AI Resume Analyzer & 
              <span className="text-blue-600 dark:text-blue-400"> ATS Checker</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto">
              Get instant AI-powered feedback on your resume. Check ATS compatibility, optimize keywords, 
              and increase your interview chances by 300%+ with our free resume analyzer.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg">
                📄 Analyze My Resume Free
              </button>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No signup required • Instant results • 100% secure
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">50,000+</div>
                <div className="text-gray-600 dark:text-gray-400">Resumes Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">95%</div>
                <div className="text-gray-600 dark:text-gray-400">ATS Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">3x</div>
                <div className="text-gray-600 dark:text-gray-400">More Interviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">4.8★</div>
                <div className="text-gray-600 dark:text-gray-400">User Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
              Why 50,000+ Job Seekers Choose CheckResumeAI
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  AI-Powered Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Advanced machine learning algorithms analyze your resume like top recruiters and ATS systems
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  ATS Compatibility
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Test against real ATS systems used by 88% of companies to ensure your resume gets seen
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Instant Results
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get comprehensive analysis and actionable feedback in under 60 seconds
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
              How to Analyze Your Resume in 4 Simple Steps
            </h2>
            
            <div className="grid md:grid-cols-4 gap-8">
              {howToSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {step.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
              What Our Users Say
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {reviews.map((review, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {review.rating}.0
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    "{review.text}"
                  </p>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    — {review.author}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-8">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-blue-600 dark:bg-blue-800">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join 50,000+ successful job seekers who improved their resumes with our AI analyzer
            </p>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
              Analyze My Resume Now - It's Free!
            </button>
            <p className="text-blue-100 mt-4 text-sm">
              ✓ Instant analysis ✓ No email required ✓ 100% secure
            </p>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;
