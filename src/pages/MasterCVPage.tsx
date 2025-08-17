import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  FileText, Zap, Target, Star, ArrowRight, Crown, Sparkles, 
  BarChart3, Globe, Brain, Award, TrendingUp, Shield,
  RefreshCw, Users, CheckCircle
} from 'lucide-react';
import ResumeBuilder from '../components/ResumeBuilder';
import { PremiumBadge } from '../components/premium/PremiumBadge';
import { motion } from 'framer-motion';

const MasterCVPage: React.FC = () => {
  const [showBuilder, setShowBuilder] = useState(false);

  if (showBuilder) {
    return <ResumeBuilder />;
  }

  return (
    <>
      <Helmet>
        <title>Master CV Builder - Professional Resume Creation | CheckResumeAI</title>
        <meta 
          name="description" 
          content="Create a master CV with our professional CV builder. Build comprehensive resumes, track multiple versions, and optimize for different job applications." 
        />
        <meta name="keywords" content="master cv, cv builder, resume builder, professional cv, comprehensive resume, job applications" />
        <link rel="canonical" href="https://checkresumeai.com/master" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Master CV Builder - Professional Resume Creation | CheckResumeAI" />
        <meta property="og:description" content="Create a master CV with our professional CV builder. Build comprehensive resumes, track multiple versions, and optimize for different job applications." />
        <meta property="og:url" content="https://checkresumeai.com/master" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://checkresumeai.com/images/og-image.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Master CV Builder - Professional Resume Creation" />
        <meta name="twitter:description" content="Create a master CV with our professional CV builder. Build comprehensive resumes, track multiple versions, and optimize for different job applications." />
        <meta name="twitter:image" content="https://checkresumeai.com/images/twitter-image.jpg" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 pt-16 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700 opacity-20"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/20 rounded-full blur-3xl"></div>
        
        {/* Hero Section */}
        <section className="pt-6 pb-12 px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              {/* Premium Badge */}
              <motion.div 
                className="flex justify-center mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-premium backdrop-blur-sm border border-amber-300/50 hover:shadow-premium-lg transition-all duration-300">
                  <Crown className="w-5 h-5 mr-2 text-yellow-200" fill="currentColor" />
                  <span className="font-bold text-sm tracking-wide">PREMIUM MASTER CV BUILDER</span>
                  <Sparkles className="w-4 h-4 ml-2 text-yellow-200" />
                </div>
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Master <span className="text-gradient-brand">CV Builder</span>
                <div className="text-gradient-premium-multi text-3xl md:text-4xl mt-1 font-medium">
                  Premium Edition
                </div>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-6 max-w-4xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Create a comprehensive master CV with <span className="font-semibold text-blue-600 dark:text-blue-400">AI-powered insights</span>, 
                generate targeted resumes for different job applications, and track your career progression. 
                <span className="text-gradient-brand font-semibold block mt-2">Build once, customize infinitely.</span>
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <button 
                  className="btn-premium-luxury shadow-premium-lg hover:shadow-premium-xl transition-all duration-300 transform hover:-translate-y-1 px-8 py-4 rounded-lg font-semibold text-lg inline-flex items-center justify-center premium-shimmer hover:scale-105"
                  onClick={() => setShowBuilder(true)}
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Start Building Your Master CV
                  <Sparkles className="w-4 h-4 ml-2" />
                </button>
                <Link 
                  to="/pricing" 
                  className="border-2 border-gradient-luxury text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 inline-flex items-center justify-center hover:shadow-lg backdrop-blur-sm hover:transform hover:-translate-y-1"
                >
                  View Premium Features
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>

              {/* Enhanced Trust Indicators */}
              <motion.div 
                className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-gray-500 dark:text-gray-400 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <div className="flex items-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300">
                  <Star className="w-4 h-4 text-yellow-400 mr-2" fill="currentColor" />
                  <span className="font-semibold text-sm">4.9/5 Rating</span>
                </div>
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200/50 dark:border-gray-700/50 font-semibold text-sm hover:shadow-xl transition-all duration-300">
                  500,000+ CVs Created
                </div>
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200/50 dark:border-gray-700/50 font-semibold text-sm hover:shadow-xl transition-all duration-300">
                  Professional Templates
                </div>
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200/50 dark:border-gray-700/50 font-semibold text-sm hover:shadow-xl transition-all duration-300">
                  ATS Compatible
                </div>
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200/50 dark:border-gray-700/50 font-semibold text-sm flex items-center hover:shadow-xl transition-all duration-300">
                  <Award className="w-4 h-4 mr-2 text-blue-500" />
                  Award Winning
                </div>
              </motion.div>

              {/* Additional Value Proposition */}
              <motion.div 
                className="flex flex-wrap justify-center items-center gap-8 text-gray-600 dark:text-gray-400 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 text-blue-500 mr-2" />
                  <span>100% Secure & Private</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 text-purple-500 mr-2" />
                  <span>Instant Results</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Premium Features Section */}
        <section className="py-8 px-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm relative">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 mb-4">
                <Brain className="w-5 h-5 mr-2" />
                <span className="font-semibold">AI-Powered Intelligence</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-4">
                Why Choose Our <span className="text-gradient-brand">Premium Master CV</span>?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 text-center mb-12 max-w-4xl mx-auto">
                Our premium Master CV Builder combines AI intelligence with professional expertise to create 
                the most comprehensive career management solution available.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                className="text-center p-8 card-premium hover:transform hover:-translate-y-2 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Brain className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">AI-Powered Content</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Leverage advanced AI to generate compelling content, optimize keywords, and ensure 
                  your CV stands out. Our AI analyzes job market trends and industry requirements.
                </p>
                <ul className="text-left space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Smart content suggestions</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Keyword optimization</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Industry insights</li>
                </ul>
              </motion.div>
              
              <motion.div 
                className="text-center p-8 card-premium hover:transform hover:-translate-y-2 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-gradient-to-br from-green-100 to-green-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Target className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Smart Targeting System</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Create unlimited targeted resume versions from your master CV. Each version is 
                  automatically optimized for specific job roles, industries, and companies.
                </p>
                <ul className="text-left space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Unlimited versions</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Role-specific optimization</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Company research integration</li>
                </ul>
              </motion.div>
              
              <motion.div 
                className="text-center p-8 card-premium hover:transform hover:-translate-y-2 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <BarChart3 className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Advanced Analytics</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Track your application success rate, monitor CV performance, and get insights 
                  on how to improve your career trajectory with detailed analytics.
                </p>
                <ul className="text-left space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Performance tracking</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Success metrics</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Career insights</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Premium Workflow Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-800 dark:to-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 mb-4">
                <Zap className="w-5 h-5 mr-2" />
                <span className="font-semibold">Streamlined Workflow</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-12">
                Premium Master CV <span className="text-gradient-brand">Workflow</span>
              </h2>
            </motion.div>
            
            <div className="grid md:grid-cols-4 gap-8">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Build Your Master CV</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Create a comprehensive CV with AI assistance. Include all your experience, skills, 
                  education, projects, achievements, and career milestones.
                </p>
                <div className="mt-4 flex justify-center">
                  <div className="bg-blue-100 px-3 py-1 rounded-full text-xs font-medium text-blue-700">
                    AI-Powered Content
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Smart Analysis & Optimize</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our AI analyzes your content for gaps, suggests improvements, and optimizes 
                  for ATS compatibility and industry standards.
                </p>
                <div className="mt-4 flex justify-center">
                  <div className="bg-green-100 px-3 py-1 rounded-full text-xs font-medium text-green-700">
                    ATS Optimization
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Generate Targeted Versions</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Select relevant sections and experiences for each job application. AI customizes 
                  content to match specific job requirements and company culture.
                </p>
                <div className="mt-4 flex justify-center">
                  <div className="bg-purple-100 px-3 py-1 rounded-full text-xs font-medium text-purple-700">
                    Smart Targeting
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold shadow-lg">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Track & Improve</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Monitor application success rates, track CV performance, and receive insights 
                  on how to improve your career trajectory.
                </p>
                <div className="mt-4 flex justify-center">
                  <div className="bg-amber-100 px-3 py-1 rounded-full text-xs font-medium text-amber-700">
                    Analytics Dashboard
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Premium Features Grid */}
        <section className="py-16 px-4 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 dark:text-white mb-4">
                Premium <span className="text-gradient-premium-multi">Features</span> Included
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 text-center mb-12 max-w-3xl mx-auto">
                Unlock the full potential of your career with our comprehensive suite of premium tools
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Globe, title: "Multi-Format Export", desc: "Export in PDF, Word, HTML, and more with custom branding" },
                { icon: RefreshCw, title: "Version Control", desc: "Track changes, compare versions, and maintain history" },
                { icon: Users, title: "Team Collaboration", desc: "Share with mentors, get feedback, and collaborate" },
                { icon: Shield, title: "Privacy & Security", desc: "Enterprise-grade security with encrypted storage" },
                { icon: TrendingUp, title: "Career Insights", desc: "Market trends, salary data, and growth opportunities" },
                { icon: Award, title: "Professional Templates", desc: "Access to 50+ premium, industry-specific templates" }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:transform hover:-translate-y-1"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <feature.icon className="w-10 h-10 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive CV Builder Preview */}
        <section id="cv-builder-section" className="py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-slate-800">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Experience the <span className="text-gradient-brand">Builder</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                See how our premium CV builder works with real-time preview and intelligent suggestions
              </p>
            </motion.div>
            
            <motion.div 
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-luxury-xl p-8 border-2 border-gradient-luxury overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {/* Premium Badge Overlay */}
              <div className="absolute top-4 right-4">
                <PremiumBadge />
              </div>
              
              {/* Demo Interface */}
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Premium Builder Interface</h3>
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
                      <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">AI Content Suggestions</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Get intelligent recommendations as you type</div>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700">
                      <Target className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">Smart Section Management</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Drag, drop, and organize with ease</div>
                      </div>
                    </div>
                    <div className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
                      <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">Real-time Analytics</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">See your CV score improve in real-time</div>
                      </div>
                    </div>
                  </div>
                  
                  <motion.button 
                    className="mt-8 btn-premium-luxury w-full shadow-premium hover:shadow-premium-lg"
                    onClick={() => setShowBuilder(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Try the Premium Builder
                    <Sparkles className="w-4 h-4 ml-2" />
                  </motion.button>
                </div>
                
                <div className="relative">
                  {/* Mock CV Preview */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 min-h-[400px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30 dark:from-blue-900/30 dark:to-purple-900/30"></div>
                    <div className="relative z-10">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
                        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mx-auto mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-500 rounded w-1/2 mx-auto"></div>
                      </div>
                      <div className="space-y-4">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-500 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-500 rounded w-4/6"></div>
                      </div>
                      <div className="mt-6">
                        <div className="h-5 bg-blue-200 dark:bg-blue-700 rounded w-1/3 mb-3"></div>
                        <div className="space-y-2">
                          <div className="h-3 bg-gray-200 dark:bg-gray-500 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-500 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Animated Elements */}
                    <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-6 left-6 text-xs text-gray-500 dark:text-gray-400 flex items-center bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded-full backdrop-blur-sm shadow-sm">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Live Preview Active
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Premium CTA Section - 3D Enhanced */}
        <section className="py-20 px-4 relative overflow-hidden perspective-1000">
          {/* 3D Background Container */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 transform-gpu">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            {/* 3D Floating Elements */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse transform rotate-45"></div>
            <div className="absolute top-40 right-20 w-48 h-48 bg-yellow-400/20 rounded-full blur-3xl animate-bounce transform"></div>
            <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-400/15 rounded-full blur-3xl transform rotate-12"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl animate-pulse"></div>
            
            {/* Animated Grid Pattern */}
            <div className="absolute inset-0 bg-grid-white/5 opacity-30 animate-pulse"></div>
          </div>
          
          {/* 3D Container */}
          <div className="max-w-5xl mx-auto text-center relative z-10 transform-gpu">
            <motion.div
              initial={{ opacity: 0, y: 50, rotateX: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1, type: "spring", stiffness: 100 }}
              viewport={{ once: true }}
              className="transform-gpu"
            >
              {/* 3D Premium Badge */}
              <motion.div 
                className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-white/30 to-white/10 backdrop-blur-lg text-white mb-8 shadow-2xl border border-white/20"
                initial={{ rotateY: -15, scale: 0.8 }}
                whileInView={{ rotateY: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{ 
                  rotateY: 5, 
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                }}
              >
                <Crown className="w-6 h-6 mr-3 text-yellow-300 drop-shadow-lg" />
                <span className="font-bold text-lg tracking-wide">Premium Experience</span>
                <div className="ml-2 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
              </motion.div>
              
              {/* 3D Title */}
              <motion.h2 
                className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight"
                initial={{ rotateX: 20, opacity: 0 }}
                whileInView={{ rotateX: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={{ 
                  textShadow: "0 10px 30px rgba(0,0,0,0.5), 0 0 60px rgba(255,255,255,0.1)",
                  transform: "translateZ(20px)"
                }}
              >
                Ready to Build Your 
                <motion.div 
                  className="text-transparent bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 bg-clip-text mt-2"
                  initial={{ rotateY: 10 }}
                  whileInView={{ rotateY: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  Master CV?
                </motion.div>
              </motion.h2>
              
              {/* 3D Description */}
              <motion.p 
                className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed"
                initial={{ rotateX: 10, opacity: 0 }}
                whileInView={{ rotateX: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{ 
                  textShadow: "0 5px 15px rgba(0,0,0,0.3)",
                  transform: "translateZ(10px)"
                }}
              >
                Join over <span className="font-bold text-yellow-300">500,000 professionals</span> who have accelerated their careers with our premium 
                Master CV Builder. Start creating your comprehensive career foundation today.
              </motion.p>
              
              {/* 3D Button Container */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
                initial={{ rotateX: 20, opacity: 0 }}
                whileInView={{ rotateX: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.button 
                  onClick={() => setShowBuilder(true)}
                  className="relative bg-gradient-to-r from-white via-gray-50 to-white text-blue-600 hover:text-blue-700 px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 inline-flex items-center justify-center transform-gpu"
                  style={{
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.6)",
                    transform: "translateZ(30px)"
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateX: -5,
                    boxShadow: "0 30px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.2), inset 0 1px 0 rgba(255,255,255,0.8)"
                  }}
                  whileTap={{ scale: 0.95, rotateX: 5 }}
                >
                  <FileText className="w-6 h-6 mr-3" />
                  Start Building Now
                  <ArrowRight className="w-6 h-6 ml-3" />
                  
                  {/* Button Shine Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 transform skew-x-12"></div>
                </motion.button>
                
                <motion.div
                  whileHover={{ 
                    scale: 1.05, 
                    rotateX: -5,
                    boxShadow: "0 25px 50px rgba(255,255,255,0.1)"
                  }}
                  whileTap={{ scale: 0.95, rotateX: 5 }}
                >
                  <Link 
                    to="/pricing"
                    className="relative border-2 border-white/50 text-white hover:bg-white/10 px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 inline-flex items-center justify-center backdrop-blur-lg"
                    style={{
                      boxShadow: "0 15px 35px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2)",
                      transform: "translateZ(20px)"
                    }}
                  >
                    View All Premium Features
                    <Sparkles className="w-6 h-6 ml-3" />
                  </Link>
                </motion.div>
              </motion.div>
              
              {/* 3D Trust Indicators */}
              <motion.div 
                className="flex flex-wrap justify-center items-center gap-8 text-blue-100"
                initial={{ rotateX: 15, opacity: 0 }}
                whileInView={{ rotateX: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {[
                  { icon: CheckCircle, text: "30-Day Money Back Guarantee", color: "text-green-400" },
                  { icon: Shield, text: "Secure & Private", color: "text-blue-400" },
                  { icon: Users, text: "24/7 Support", color: "text-purple-400" }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center px-4 py-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20"
                    style={{
                      boxShadow: "0 10px 25px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                      transform: "translateZ(15px)"
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      rotateY: 5,
                      boxShadow: "0 15px 35px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)"
                    }}
                    initial={{ rotateY: -10, opacity: 0 }}
                    whileInView={{ rotateY: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  >
                    <item.icon className={`w-5 h-5 mr-3 ${item.color} drop-shadow-lg`} />
                    <span className="font-semibold">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
          
          {/* 3D Decorative Elements */}
          <div className="absolute top-1/4 left-0 w-1 h-32 bg-gradient-to-b from-yellow-400 to-transparent opacity-50 transform rotate-12"></div>
          <div className="absolute bottom-1/4 right-0 w-1 h-32 bg-gradient-to-t from-purple-400 to-transparent opacity-50 transform -rotate-12"></div>
        </section>
      </div>
    </>
  );
};

export default MasterCVPage;
