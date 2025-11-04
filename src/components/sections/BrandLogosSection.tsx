import { cn } from '../../utils/cn';

// Company logo data with name and image URL
interface CompanyLogo {
  name: string;
  logoUrl: string;
  height: string;
}

// Array of real company logos
const companyLogos: CompanyLogo[] = [
  {
    name: "Microsoft",
    logoUrl: "/images/logos/microsoft.png",
    height: "h-8 md:h-10"
  },
  {
    name: "Google",
    logoUrl: "/images/logos/google.png",
    height: "h-8 md:h-9"
  },
  {
    name: "Amazon",
    logoUrl: "/images/logos/amazon.png",
    height: "h-7 md:h-9"
  },
  {
    name: "IBM",
    logoUrl: "/images/logos/ibm.png",
    height: "h-7 md:h-8"
  },
  {
    name: "Deloitte",
    logoUrl: "/images/logos/deloitte.png",
    height: "h-6 md:h-8"
  },
  {
    name: "Apple",
    logoUrl: "/images/logos/apple.png",
    height: "h-9 md:h-10"
  }
];

export function BrandLogosSection() {
  return (
    <div className="w-full py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-slate-900/50 dark:to-slate-900/80 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-gray-900/[0.02] dark:bg-grid-white/[0.02] mix-blend-overlay"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 mb-3">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Global Recognition</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Trusted</span> By Top Companies Worldwide
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join over 500+ leading companies that trust our resume analyzer to find the best talent
          </p>
        </div>
        
        {/* Partners counter */}        <div className="flex justify-center gap-8 md:gap-20 mb-12">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">500+</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Partner Companies</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">25+</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Industries</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">92%</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Hiring Success</p>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 max-w-5xl mx-auto">
          {/* Real company logos */}
          {companyLogos.map((company) => (
            <div 
              key={company.name} 
              className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300 transform hover:scale-110"
            >
              <img
                src={company.logoUrl}
                alt={`${company.name} logo`}
                className={cn("object-contain", company.height)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
