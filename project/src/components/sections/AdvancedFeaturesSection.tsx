import { ArrowUpRight, CheckCircle2, Code, FileBarChart2, FileSearch, Layers, LayoutGrid, MoveUpRight, ShieldCheck, Star } from "lucide-react";
import { cn } from "../../utils/cn";
import { useState } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  accentColor: string;
  index: number;
  learnMoreUrl?: string;
}

const FeatureCard = ({ title, description, icon, color, accentColor, index, learnMoreUrl = "#" }: FeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <a 
      href={learnMoreUrl}
      className={`group relative rounded-xl p-4 bg-white dark:bg-slate-800/90 backdrop-blur-sm shadow-card dark:shadow-card-dark border border-gray-100/80 dark:border-gray-700/80 transition-all duration-500 hover:shadow-card-hover dark:hover:shadow-card-dark-hover hover:-translate-y-1 overflow-hidden flex flex-col h-full block cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}      
      data-animation-delay={index * 100}
    >
      {/* Simplified gradient background element */}
      <div className={cn("absolute -right-8 -bottom-8 w-24 h-24 rounded-full opacity-10 transition-all duration-500 group-hover:opacity-20 group-hover:scale-125 blur-sm", color)}></div>
      
      {/* Main content */}
      <div className="relative z-10">
        {/* Icon with animated container */}
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 shadow-subtle dark:shadow-subtle-dark", color)}>
          <div className="relative">
            {icon}
            <div className={cn("absolute -inset-1 rounded-lg opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-sm", accentColor)}></div>
          </div>
        </div>
        
        {/* Card content */}
        <h3 className="text-lg font-semibold mb-1.5 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 transition-all duration-300 group-hover:text-gray-800 dark:group-hover:text-gray-200">{description}</p>
        
        {/* Interactive CTA button */}
        <div
          className={cn("flex items-center transition-all duration-300 relative cursor-pointer mt-auto", 
            isHovered ? "text-white" : "text-blue-600 dark:text-blue-400"
          )}
        >
          <div className={cn("absolute inset-0 -mx-2 -my-1.5 px-2 py-1.5 rounded-md opacity-0 transition-all duration-300", 
            isHovered ? "opacity-100 bg-blue-600 dark:bg-blue-500" : "",
            color.replace("bg-", "group-hover:bg-").replace("100", "50").replace("dark:bg-", "dark:group-hover:bg-")
          )}></div>
          <span className="relative font-medium text-sm">Learn more</span>
          <ArrowUpRight className={cn("ml-1.5 h-3.5 w-3.5 transition-all duration-300 relative", 
            isHovered ? "transform translate-x-0.5 -translate-y-0.5" : ""
          )} />
        </div>
      </div>
        
      {/* Decorative element */}
      <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-blue-500/30 dark:bg-blue-400/20 animate-ping"></div>
    </a>
  );
};

export function AdvancedFeaturesSection() {
  return (
    <section id="features" className="py-10 lg:py-16 relative overflow-hidden">
      {/* Enhanced decorative background elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300 dark:via-blue-700 to-transparent"></div>
      <div className="absolute inset-0 bg-white dark:bg-slate-900"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-subtle"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-subtle"></div>
      <div className="absolute top-1/3 left-1/6 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-1/4 right-1/6 w-64 h-64 bg-green-500/5 rounded-full blur-2xl"></div>
      <div className="absolute inset-0 bg-grid-gray-900/[0.02] dark:bg-grid-white/[0.02] mix-blend-overlay"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">        <div className="text-center mb-10">
          <div className="inline-flex items-center bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium mb-3 shadow-subtle dark:shadow-subtle-dark border border-blue-200/50 dark:border-blue-800/50">
            <div className="mr-1.5 size-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse"></div>
            Powerful Features
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 dark:from-blue-500 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent mb-4">
            Advanced Resume Analysis Tools
          </h2>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Leverage cutting-edge AI technology to transform your resume and maximize your chances of landing interviews
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 transition-all duration-500">          <FeatureCard
            title="ATS Compatibility Analysis"
            description="Ensure your resume passes through Applicant Tracking Systems with our advanced keyword optimization technology."
            icon={<FileSearch className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
            color="bg-blue-100 dark:bg-blue-900/40"
            accentColor="bg-blue-500 dark:bg-blue-400"
            index={0}
            learnMoreUrl="/features/ats-compatibility-analysis"
          />
          <FeatureCard
            title="Industry-Specific Insights"
            description="Get tailored recommendations based on industry standards and expectations for your specific field."
            icon={<Layers className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
            color="bg-purple-100 dark:bg-purple-900/40"
            accentColor="bg-purple-500 dark:bg-purple-400"
            index={1}
            learnMoreUrl="/features/industry-specific-insights"
          />
          <FeatureCard
            title="Skills Gap Analysis"
            description="Identify missing skills and qualifications needed for your target role with personalized recommendations."
            icon={<FileBarChart2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />}
            color="bg-indigo-100 dark:bg-indigo-900/40"
            accentColor="bg-indigo-500 dark:bg-indigo-400"
            index={2}
            learnMoreUrl="/features/skills-gap-analysis"
          />
          <FeatureCard
            title="Keyword Optimization"
            description="Enhance your resume with industry-specific keywords that match job descriptions and ATS requirements."
            icon={<LayoutGrid className="h-6 w-6 text-green-600 dark:text-green-400" />}
            color="bg-green-100 dark:bg-green-900/40"
            accentColor="bg-green-500 dark:bg-green-400"
            index={3}
            learnMoreUrl="/features/keyword-optimization"
          />
          <FeatureCard
            title="Format & Structure Review"
            description="Receive feedback on your resume's layout, organization, and visual hierarchy for maximum impact."
            icon={<Code className="h-6 w-6 text-amber-600 dark:text-amber-400" />}
            color="bg-amber-100 dark:bg-amber-900/40"
            accentColor="bg-amber-500 dark:bg-amber-400"
            index={4}
            learnMoreUrl="/features/format-structure-review"
          />
          <FeatureCard
            title="Privacy & Security"
            description="Your data is protected with enterprise-grade encryption and is never shared with third parties."
            icon={<ShieldCheck className="h-6 w-6 text-red-600 dark:text-red-400" />}
            color="bg-red-100 dark:bg-red-900/40"
            accentColor="bg-red-500 dark:bg-red-400"
            index={5}
            learnMoreUrl="/features/privacy-security"
          /></div>
          {/* Enhanced Premium feature spotlight */}        {/* Premium Feature Spotlight with Enhanced Conversion Focus */}
        <div className="mt-10 rounded-xl overflow-hidden relative group bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-800 shadow-xl dark:shadow-blue-900/50 border border-blue-400/20 dark:border-blue-700/50 transform transition-all duration-700 hover:scale-[1.01]">          {/* Simplified gradient background overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-700/15 via-transparent to-purple-700/15 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out"></div>
            {/* Interactive animated particles - more subtle */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-1/4 w-2 h-2 rounded-full bg-white/20 animate-float-slow"></div>
            <div className="absolute top-3/4 left-1/5 w-1.5 h-1.5 rounded-full bg-white/20 animate-float"></div>
            <div className="absolute bottom-1/3 right-1/4 w-2.5 h-2.5 rounded-full bg-white/15 animate-float-slow-offset"></div>
            <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 rounded-full bg-amber-400/20 animate-pulse-float"></div>
            <div className="absolute top-2/3 right-1/6 w-2 h-2 rounded-full bg-blue-400/20 animate-float-bounce"></div>
          </div>
            <div className="flex flex-col lg:flex-row">
            <div className="p-4 lg:p-6 lg:w-1/2 flex flex-col justify-center relative">
              {/* Compact premium badge */}
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/90 to-amber-400/90 backdrop-blur-sm text-white text-xs font-medium mb-3 w-fit border border-amber-300/40 shadow-[0_0_15px_rgba(251,191,36,0.5)] dark:shadow-[0_0_20px_rgba(251,191,36,0.4)] transition-all duration-500 group-hover:scale-105">
                <Star className="h-3.5 w-3.5 mr-1.5 text-white animate-pulse-subtle" fill="currentColor" />
                <span className="font-bold tracking-wide">PREMIUM FEATURE</span>
              </div>
              
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 group-hover:scale-[1.02] origin-left transition-transform duration-500">
                <span className="relative">
                  One-Click Job Match Analysis
                  <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-300/30 rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out"></div>
                </span>
              </h3>
              
              <p className="text-blue-50 mb-3 text-sm md:text-base">
                Upload your resume to instantly see how well you match job requirements, with AI-powered suggestions to improve your chances by up to <span className="font-bold text-amber-300">85%</span>.
              </p>
              
              {/* Compact feature list */}
              <ul className="space-y-1.5 mb-3 text-sm">
                {[
                  "Match score percentage with visual breakdown",
                  "Section-by-section improvement suggestions",
                  "Priority ranking of missing skills and keywords",
                  "Pre-written content suggestions tailored to the job"
                ].map((item, index) => (
                  <li key={index} className="flex items-start group/item py-1 rounded-lg hover:bg-blue-600/30 transition-all duration-300">
                    <CheckCircle2 className="h-4 w-4 text-amber-400 dark:text-amber-300 shrink-0 mt-0.5 mr-1.5" />
                    <span className="text-white text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="flex flex-wrap gap-2 mb-3 text-xs text-blue-100">
                <div className="flex items-center">
                  <div className="h-2 w-2 rounded-full bg-green-400 mr-1"></div>
                  <span>2,400+ users upgraded</span>
                </div>
                <div className="flex items-center ml-2">
                  <div className="h-2 w-2 rounded-full bg-amber-400 mr-1"></div>
                  <span>Limited time offer</span>
                </div>
              </div>
              
              {/* Limited time offer banner - more compact */}
              <div className="mb-3 bg-gradient-to-r from-amber-600/20 to-amber-500/20 backdrop-blur-sm rounded-lg border border-amber-400/30 p-2 flex items-center relative overflow-hidden">
                <div className="mr-2 bg-amber-500 text-white p-1.5 rounded-lg relative">
                  <Star className="h-3.5 w-3.5" fill="currentColor" />
                </div>
                
                <div className="flex-1 relative">
                  <p className="text-xs font-medium text-amber-400">Limited Time Offer: 50% off Premium</p>
                </div>
                
                <div className="text-right ml-2 relative">
                  <div className="text-amber-300 font-bold text-xs flex">
                    <div className="flex flex-col items-center justify-center w-6 h-6 bg-amber-950/30 rounded-md mx-0.5">
                      <span>2d</span>
                    </div>
                    <div className="flex flex-col items-center justify-center w-6 h-6 bg-amber-950/30 rounded-md mx-0.5">
                      <span>8h</span>
                    </div>
                    <div className="flex flex-col items-center justify-center w-6 h-6 bg-amber-950/30 rounded-md mx-0.5">
                      <span>45m</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* CTA button - more compact */}
              <div className="relative group/button">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-300 rounded-lg blur-md opacity-30 group-hover/button:opacity-100 transition duration-1000 group-hover/button:duration-200 animate-pulse-slow"></div>
                <a 
                  href="/features/job-match-analysis"
                  className="relative flex items-center justify-center px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 text-white font-bold text-sm rounded-lg transition-all duration-500 shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/40 w-full sm:w-auto"
                >
                  <span>Try Premium Match Analysis</span>
                  <MoveUpRight className="ml-1.5 h-4 w-4" />
                </a>
              </div>
              
              {/* Social proof - more compact */}
              <div className="mt-2 flex items-center text-xs text-blue-100">
                <div className="flex -space-x-1 mr-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-4 h-4 rounded-full border border-indigo-600 bg-gradient-to-br from-blue-500 to-indigo-600"></div>
                  ))}
                </div>
                <span>Join 10,000+ professionals boosting their careers</span>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative overflow-hidden">
              {/* Enhanced gradient overlay for better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-black/40 to-transparent z-10"></div>
              
              {/* Animated background image */}
              <img 
                src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Job Match Analysis" 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Compact floating UI element */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-xs w-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-3 rounded-lg shadow-lg border border-white/60 dark:border-gray-700/60 transition-all duration-500 group-hover:scale-105 z-20">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Real-Time Match Analysis</h4>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Just now</div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600 dark:text-gray-300">Job Position Match</span>
                    <div className="bg-blue-100 dark:bg-blue-900/40 px-1.5 py-0.5 rounded text-xs">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">Senior Developer</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-1.5">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Overall Match Score</h4>
                  <div className="flex items-center bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30 px-2 py-1 rounded">
                    <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">86%</span>
                  </div>
                </div>
                
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full mb-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full w-[86%] relative">
                    <div className="absolute inset-0 bg-[length:6px_6px] bg-gradient-to-r from-amber-400/20 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                
                <div className="space-y-1 mb-3">
                  {[
                    { name: "Keywords Match", value: "92%", color: "bg-green-500" },
                    { name: "Skills Coverage", value: "78%", color: "bg-amber-500" },
                    { name: "Experience Alignment", value: "88%", color: "bg-blue-500" }
                  ].map((metric, index) => (
                    <div key={index} className="flex justify-between items-center p-1.5 rounded bg-gray-50 dark:bg-slate-700/50 text-xs">
                      <div className="flex items-center">
                        <div className={`h-1.5 w-1.5 rounded-full ${metric.color} mr-1.5`}></div>
                        <span className="text-gray-700 dark:text-gray-300">{metric.name}</span>
                      </div>
                      <span className="text-gray-900 dark:text-white font-medium">{metric.value}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-1.5">
                  <button className="flex-1 px-2 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded transition-colors duration-300">
                    View Details
                  </button>
                  <button className="px-2 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs font-medium rounded transition-colors duration-300">
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
