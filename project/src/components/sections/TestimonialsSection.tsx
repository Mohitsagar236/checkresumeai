import { Star, Users, CheckCircle, Award, Briefcase, TrendingUp, Quote } from "lucide-react";

interface TestimonialCardProps {
  text: string;
  initials: string;
  name: string;
  role: string;
  company?: string;
  result?: string;
  imageSrc?: string;
  highlight?: string;
}

const TestimonialCard = ({ 
  text, 
  initials, 
  name, 
  role, 
  company, 
  result, 
  imageSrc,
  highlight 
}: TestimonialCardProps) => {
  return (
    <div className="relative bg-white dark:bg-slate-800/90 rounded-xl shadow-xl dark:testimonial-card-shadow p-6 transition-all duration-300 hover:shadow-2xl border border-gray-100 dark:border-gray-700/50 group backdrop-blur-sm overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full blur-2xl"></div>
      <div className="absolute right-0 top-20 opacity-10 dark:opacity-5">
        <Quote className="h-24 w-24 text-blue-600 dark:text-blue-400" />
      </div>
      
      {/* Result badge with icon */}
      {result && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-400 dark:to-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg dark:shadow-emerald-900/30 flex items-center">
          <TrendingUp className="h-3 w-3 mr-1" />
          {result}
        </div>
      )}
      
      {/* 5-star rating with subtle background */}
      <div className="inline-flex mb-4 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-amber-400" fill="currentColor" />
        ))}
      </div>
      
      {/* Highlight or key achievement */}
      {highlight && (
        <div className="mb-3 flex items-center">
          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
          <span className="text-sm font-medium text-green-700 dark:text-green-400">{highlight}</span>
        </div>
      )}
      
      {/* Testimonial text */}
      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
        "{text}"
      </p>
      
      {/* Author info with enhanced design */}
      <div className="flex items-center">
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={name} 
            className="h-14 w-14 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-md mr-4"
          />
        ) : (
          <div className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 text-white flex items-center justify-center mr-4 shadow-lg dark:shadow-blue-900/20 border-2 border-white dark:border-slate-700">
            <span className="font-bold text-sm">{initials}</span>
          </div>
        )}        <div className="flex-1">
          <div className="flex items-center">
            <p className="font-semibold text-gray-900 dark:text-white">{name}</p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
            <Briefcase className="h-3 w-3 mr-1 text-gray-500 dark:text-gray-400" />
            {role}
          </p>
          {company && (
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors flex items-center">
              <Award className="h-3 w-3 mr-1" />
              @ {company}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export function TestimonialsSection() {
  const testimonials = [
    {      text: "I was struggling with my job search for 6 months with zero responses. After using ResumeAI's optimization suggestions, I received 8 interview calls in just 3 weeks! The skill gap analysis revealed missing keywords I never knew were important. Now I'm working at my dream tech company with a 40% salary increase.",
      initials: "RS",
      name: "Rahul S.",
      role: "Senior Software Engineer",
      company: "Google",
      result: "40% salary increase",
      highlight: "From 0 to 8 interview calls in 3 weeks"
    },
    {      text: "My resume was getting lost in the ATS black hole until I discovered ResumeAI. The detailed feedback showed exactly why my applications weren't making it through. After implementing the suggestions, my interview rate jumped from 0% to 85%. I landed my dream role at a Fortune 500 company!",
      initials: "PK",
      name: "Priya K.",
      role: "Senior Marketing Manager",
      company: "Microsoft",
      result: "85% interview rate",
      highlight: "From 0% to 85% interview success rate"
    },
    {      text: "As a career changer, I had no idea how to position my transferable skills. ResumeAI highlighted exactly which skills to focus on and how to quantify my achievements. Within 2 weeks, I had multiple interviews and 3 job offers!",
      initials: "JT",
      name: "James T.",
      role: "Product Manager",
      company: "Amazon",
      result: "3 job offers",
      highlight: "Career transition in just 2 weeks"
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-gray-900/[0.02] dark:bg-grid-white/[0.02] mix-blend-overlay -z-10"></div>
      <div className="absolute top-20 -left-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 md:px-6">
        {/* Enhanced section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4 shadow-sm dark:shadow-blue-900/10">
            <Users className="h-4 w-4 mr-2" />
            Customer Success Stories
          </div>
          <h2 className="text-3xl md:text-4xl xl:text-5xl font-premium-display bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-luxury">
            Thousands of job seekers have improved their resumes with our tool
          </p>        </div>
        
        {/* Enhanced testimonials grid with featured testimonial */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Featured testimonial - larger card */}
          <div className="lg:col-span-1">
            <TestimonialCard {...testimonials[0]} />
          </div>
          
          {/* Regular testimonials */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.slice(1).map((testimonial, index) => (
              <TestimonialCard key={index + 1} {...testimonial} />
            ))}
          </div>
        </div>
          {/* Enhanced trust indicators */}
        <div className="mt-16 flex flex-col items-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 text-purple-600 dark:text-purple-300 shadow-md dark:shadow-purple-900/20 mb-4">
            <Star className="h-4 w-4 mr-2" fill="currentColor" />
            <span className="font-semibold mr-2">4.9/5 average rating</span>
            <span>from our verified users</span>
          </div>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full text-xs text-green-700 dark:text-green-300 flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified Reviews
            </div>
            <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full text-xs text-blue-700 dark:text-blue-300 flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              Real Results
            </div>
            <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full text-xs text-purple-700 dark:text-purple-300 flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              Fortune 500 Clients
            </div>          </div>
        </div>
      </div>
    </section>
  );
}