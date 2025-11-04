// filepath: e:\Downloads\AI-Powered Resume Analyzer SaaS\project\src\components\sections\StatsSection.tsx
import { BarChart3, CheckCircle, FileText, Star, Users } from "lucide-react";
import { cn } from "../../utils/cn";

interface StatProps {
  value: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const Stat = ({ value, label, icon, color }: StatProps) => {
  return (
    <div className="flex flex-col items-center p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className={cn("mb-4 p-3 rounded-full", color)}>
        {icon}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-gray-500 dark:text-gray-400 text-center">{label}</div>
    </div>
  );
};

export function StatsSection() {
  return (
    <section className="py-16 lg:py-24 relative">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900"></div>
      <div className="absolute inset-0 bg-grid-gray-900/[0.02] dark:bg-grid-white/[0.02] mix-blend-overlay"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-1 rounded-full text-sm font-medium mb-4">
            Resume AI Impact
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Proven Results That Speak Volumes
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our AI-powered resume analyzer has transformed thousands of careers with measurable results
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <Stat 
            value="45,000+" 
            label="Resumes Optimized" 
            icon={<FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />} 
            color="bg-indigo-100 dark:bg-indigo-900/30"
          />
          <Stat 
            value="89%" 
            label="Interview Success Rate" 
            icon={<CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />} 
            color="bg-green-100 dark:bg-green-900/30"
          />
          <Stat 
            value="3.5x" 
            label="Callback Improvement" 
            icon={<BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />} 
            color="bg-blue-100 dark:bg-blue-900/30"
          />
          <Stat 
            value="4.9/5" 
            label="Customer Satisfaction" 
            icon={<Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />} 
            color="bg-yellow-100 dark:bg-yellow-900/30"
          />
        </div>
        
        {/* User counter */}
        <div className="mt-16 flex flex-col md:flex-row justify-between items-center p-6 md:p-8 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-lg rounded-2xl border border-blue-100/50 dark:border-blue-900/50 shadow-lg">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="relative">
              <div className="flex -space-x-3">
                <div className="h-12 w-12 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-800 relative z-30">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" alt="User" className="h-full w-full object-cover" />
                </div>
                <div className="h-12 w-12 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-800 relative z-20">
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" alt="User" className="h-full w-full object-cover" />
                </div>
                <div className="h-12 w-12 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-800 relative z-10">
                  <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e" alt="User" className="h-full w-full object-cover" />
                </div>
                <div className="h-12 w-12 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center bg-indigo-600 text-white font-medium relative z-0">
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Join 10,000+ professionals</h3>
              <p className="text-gray-600 dark:text-gray-300">Who have transformed their job search with Resume AI</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              Analyze My Resume
            </button>
            <button className="px-6 py-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-all duration-300">
              View Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
