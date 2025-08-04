import React from 'react';
import { ArrowRight, Zap, Star, Shield, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Animated Particles Component matching exact homepage theme  
const AnimatedParticles: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Floating particles matching homepage theme with varying sizes, positions and animations */}
      <div className="absolute bg-white/20 rounded-full w-3.5 h-3.5 top-[57%] left-[95%] animate-float" />
      <div className="absolute bg-white/20 rounded-full w-1.5 h-3 top-[5%] left-[94%] animate-float-particle" />
      <div className="absolute bg-white/20 rounded-full w-1.5 h-3.5 top-[63%] left-[35%] animate-float-slow" />
      <div className="absolute bg-white/20 rounded-full w-3.5 h-1.5 top-[74%] left-[30%] animate-float" />
      <div className="absolute bg-white/20 rounded-full w-3 h-3 top-[68%] left-[96%] animate-float-particle" />
      <div className="absolute bg-white/20 rounded-full w-2 h-3 top-[64%] left-[25%] animate-float-slow" />
      <div className="absolute bg-white/20 rounded-full w-3.5 h-3.5 top-[32%] left-[61%] animate-float" />
      <div className="absolute bg-white/20 rounded-full w-4 h-2 top-[79%] left-[91%] animate-float-particle" />
      <div className="absolute bg-white/20 rounded-full w-1.5 h-1.5 top-[99%] left-[54%] animate-float-slow" />
      <div className="absolute bg-white/20 rounded-full w-3.5 h-2 top-[77%] left-[44%] animate-float" />
      <div className="absolute bg-white/20 rounded-full w-2 h-1.5 top-[42%] left-[51%] animate-float-particle" />
      <div className="absolute bg-white/20 rounded-full w-2.5 h-2 top-[63%] left-[72%] animate-float-slow" />
      <div className="absolute bg-white/20 rounded-full w-1.5 h-2.5 top-[49%] left-[20%] animate-float" />
      <div className="absolute bg-white/20 rounded-full w-1.5 h-1.5 top-[11%] left-[71%] animate-float-particle" />
      <div className="absolute bg-white/20 rounded-full w-3 h-2 top-[30%] left-[74%] animate-float-slow" />
      <div className="absolute bg-white/20 rounded-full w-3 h-3.5 top-[14%] left-[71%] animate-float" />
      <div className="absolute bg-white/20 rounded-full w-2.5 h-1.5 top-[15%] left-[12%] animate-float-particle" />
      <div className="absolute bg-white/20 rounded-full w-3.5 h-3 top-[93%] left-[92%] animate-float-slow" />
      <div className="absolute bg-white/20 rounded-full w-1.5 h-1.5 top-[1%] left-[5%] animate-float" />
      <div className="absolute bg-white/20 rounded-full w-2.5 h-2 top-[28%] left-[70%] animate-float-particle" />
    </div>
  );
};

const AdvancedFeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Zap className="h-7 w-7 text-blue-600 dark:text-blue-400" />,
      title: "Instant Analysis",
      description: "Get detailed feedback on your resume in less than 2 minutes with our AI-powered analysis tools.",
      iconBg: "bg-blue-50 dark:bg-blue-900/30",
      gradient: "from-blue-500/10 to-indigo-500/10",
      linkColor: "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
    },
    {
      icon: <Star className="h-7 w-7 text-purple-600 dark:text-purple-400" />,
      title: "ATS Optimization",
      description: "Ensure your resume passes through Applicant Tracking Systems with our keyword optimization tools.",
      iconBg: "bg-purple-50 dark:bg-purple-900/30", 
      gradient: "from-purple-500/10 to-pink-500/10",
      linkColor: "text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
    },
    {
      icon: <Shield className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />,
      title: "Skills Matching",
      description: "Identify missing skills and qualifications for your target roles with our comprehensive gap analysis.",
      iconBg: "bg-emerald-50 dark:bg-emerald-900/30",
      gradient: "from-emerald-500/10 to-teal-500/10", 
      linkColor: "text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Decorative background elements matching homepage exactly */}
      <div className="absolute inset-0 bg-grid-gray-900/[0.02] dark:bg-grid-white/[0.02] mix-blend-overlay"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-subtle"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-subtle"></div>
      <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-indigo-500/10 rounded-full animate-float"></div>
      <div className="absolute bottom-1/3 left-1/4 w-16 h-16 bg-emerald-500/10 rounded-full animate-float-slow"></div>
      
      {/* Animated floating particles matching homepage */}
      <AnimatedParticles />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Header section for Advanced Features */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-200/50 dark:border-blue-800/50 mb-6 animate-pulse-subtle">
              <Star className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2 fill-current" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Premium Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-premium-display bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Advanced Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-luxury">
              Unlock the full potential of your resume with our advanced AI-powered features designed for professionals who demand excellence
            </p>
          </div>

          {/* Features grid using simplified card style matching homepage exactly */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto mb-16">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex flex-col items-center text-center card-premium rounded-2xl p-8 relative overflow-hidden group transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                {/* Background gradient accent */}
                <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${feature.gradient} rounded-full blur-2xl group-hover:opacity-80 transition-opacity`}></div>
                
                <div className="relative z-10 flex flex-col items-center text-center w-full">
                  <div className={`${feature.iconBg} h-20 w-20 rounded-full flex items-center justify-center text-2xl font-premium-display mb-6 shadow-luxury-lg group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-luxury text-gray-900 dark:text-neutral-100 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700/50 w-full">
                    <Link to="/upload" className={`inline-flex items-center ${feature.linkColor} font-medium`}>
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action matching homepage style exactly */}
          <div className="mt-16 text-center">
            <div className="inline-block">
              <div className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500"></div>
                <Link to="/pricing" className="relative inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 text-lg font-luxury shadow-luxury-lg hover:shadow-luxury-xl transition-all transform group-hover:-translate-y-1 rounded-xl">
                  Upgrade to Premium
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                <CheckCircle className="h-4 w-4 inline mr-1 text-green-500" />
                30-day money-back guarantee • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvancedFeaturesSection;

// Successfully implemented animated particles matching homepage theme
