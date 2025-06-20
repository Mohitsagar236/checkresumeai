// filepath: e:\Downloads\AI-Powered Resume Analyzer SaaS\project\src\components\sections\EnhancedCTASection.tsx
import { ArrowRight, CheckCircle, ChevronRight, Clock, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/Button";

export function EnhancedCTASection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800"></div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full mix-blend-overlay blur-3xl"></div>
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.05] mix-blend-overlay"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white/20 rounded-full"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          ></div>
        ))}
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <div className="inline-flex items-center px-4 py-1 rounded-full bg-white/20 text-white text-sm font-medium backdrop-blur-sm mb-6">
            <Zap className="h-4 w-4 mr-2" />
            Boost Your Career Opportunities Today
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Transform Your Resume and <span className="relative inline-block">
              Land Your Dream Job
              <svg className="absolute -bottom-2 left-0 w-full text-blue-400/50" viewBox="0 0 400 15" height="15">
                <path fill="currentColor" d="M0,12 C100,8 200,4 300,8 C400,12 500,12 600,8 L600,0 L0,0 Z"></path>
              </svg>
            </span>
          </h2>
          
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Don't let ATS systems reject your resume before a human ever sees it. Our premium analysis tools help you stand out and get noticed by hiring managers.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link to="/upload" className="group">
              <Button size="lg" className="w-full sm:w-auto text-gray-900 dark:text-white bg-white dark:bg-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500 border-0 shadow-lg hover:shadow-xl transition-all duration-300 py-6 px-8 text-lg h-auto">
                <div className="flex items-center">
                  <span>Analyze My Resume Now</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </Button>
            </Link>
            
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/30 hover:bg-white/10 text-white py-6 px-8 text-lg h-auto">
                View Premium Features
              </Button>
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-white">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-blue-300" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-300" />
              <span>2-minute analysis</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-blue-300" />
              <span>100% secure & private</span>
            </div>
          </div>
        </div>
        
        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                <Zap className="h-5 w-5 text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold text-white">Instant Analysis</h3>
            </div>
            <p className="text-blue-100">Get detailed feedback on your resume in less than 2 minutes with our AI-powered analysis tools.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                <CheckCircle className="h-5 w-5 text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold text-white">ATS Optimization</h3>
            </div>
            <p className="text-blue-100">Ensure your resume passes through Applicant Tracking Systems with our keyword optimization tools.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                <Clock className="h-5 w-5 text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold text-white">Skills Matching</h3>
            </div>
            <p className="text-blue-100">Identify missing skills and qualifications for your target roles with our comprehensive gap analysis.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
