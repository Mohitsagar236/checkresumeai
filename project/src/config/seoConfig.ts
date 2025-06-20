// SEO Configuration for CheckResumeAI
export const seoConfig = {
  // Base configuration
  siteName: 'CheckResumeAI',
  siteUrl: 'https://checkresumeai.com',
  defaultTitle: 'CheckResumeAI - Free AI Resume Analyzer & ATS Checker Tool 2025',
  defaultDescription: 'Free AI-powered resume analyzer with ATS compatibility checker. Get instant feedback, skills gap analysis, and interview probability scores. Optimize your resume for job applications in 2025.',
  
  // Keywords for different pages
  keywords: {
    home: [
      'resume analyzer', 'ATS checker', 'resume scanner', 'CV analyzer', 
      'job application tool', 'resume optimization', 'ATS compatibility',
      'skills gap analysis', 'interview preparation', 'career tools',
      'resume feedback', 'AI resume checker', 'free resume analysis',
      'resume score', 'job search tools', 'resume builder', 'career advice',
      'job hunting', 'resume tips', 'interview tips', 'career development'
    ],
    analyzer: [
      'AI resume analysis', 'resume score', 'resume grading', 'resume evaluation',
      'resume assessment', 'resume review', 'resume critique', 'resume feedback',
      'professional resume analysis', 'resume optimization tips'
    ],
    atsChecker: [
      'ATS scanner', 'ATS compatibility test', 'ATS optimization',
      'applicant tracking system', 'ATS friendly resume', 'ATS score',
      'resume parsing', 'ATS keywords', 'ATS formatting', 'beat ATS'
    ],
    skillsAnalysis: [
      'skills gap analysis', 'skill assessment', 'skills evaluation',
      'career skills', 'professional skills', 'technical skills',
      'skill matching', 'skills for jobs', 'skill development'
    ]
  },
  
  // Open Graph images
  images: {
    default: '/images/og-image.jpg',
    homepage: '/images/homepage-hero.jpg',
    analyzer: '/images/analyzer-tool.jpg',
    atsChecker: '/images/ats-checker.jpg',
    skillsAnalysis: '/images/skills-analysis.jpg'
  },
  
  // Social media
  social: {
    twitter: '@CheckResumeAI',
    facebook: 'CheckResumeAI',
    linkedin: 'company/checkresumeai'
  },
  
  // Schema.org structured data
  organization: {
    name: 'CheckResumeAI',
    url: 'https://checkresumeai.com',
    logo: 'https://checkresumeai.com/images/logo.png',
    description: 'AI-powered resume analysis and career optimization platform',
    foundingDate: '2025',
    contactPoint: {
      telephone: '+1-555-RESUME',
      contactType: 'customer service',
      email: 'checkresmueai@gmail.com'
    },
    sameAs: [
      'https://twitter.com/CheckResumeAI',
      'https://facebook.com/CheckResumeAI',
      'https://linkedin.com/company/checkresumeai'
    ]
  },
  
  // Page-specific SEO data
  pages: {
    home: {
      title: 'CheckResumeAI - Free AI Resume Analyzer & ATS Checker Tool 2025',
      description: 'Free AI-powered resume analyzer with ATS compatibility checker. Get instant feedback, skills gap analysis, and interview probability scores. Optimize your resume for job applications in 2025.',
      canonical: '/'
    },
    analyzer: {
      title: 'AI Resume Analyzer - Free Resume Analysis Tool | CheckResumeAI',
      description: 'Analyze your resume with AI technology. Get detailed feedback on content, formatting, ATS compatibility, and improvement recommendations. Free resume analysis tool.',
      canonical: '/analyzer'
    },
    atsChecker: {
      title: 'Free ATS Checker - Test Resume ATS Compatibility | CheckResumeAI',
      description: 'Check if your resume is ATS-friendly. Our free ATS checker analyzes formatting, keywords, and structure to ensure your resume passes applicant tracking systems.',
      canonical: '/ats-checker'
    },
    skillsAnalysis: {
      title: 'Skills Gap Analysis - Identify Missing Skills | CheckResumeAI',
      description: 'Discover skill gaps in your resume with AI-powered analysis. Get personalized recommendations for skills to add and courses to take for your target job.',
      canonical: '/skills-analysis'
    },
    pricing: {
      title: 'Pricing - Premium Resume Analysis Plans | CheckResumeAI',
      description: 'Choose the best plan for your career needs. Free basic analysis or premium features with industry insights, interview coaching, and priority support.',
      canonical: '/pricing'
    },
    about: {
      title: 'About CheckResumeAI - AI-Powered Career Optimization Platform',
      description: 'Learn about CheckResumeAI\'s mission to help job seekers optimize their resumes using artificial intelligence and data-driven insights for better career outcomes.',
      canonical: '/about'
    }
  },
  
  // FAQ Schema for rich snippets
  faqData: [
    {
      question: "How does the AI resume analyzer work?",
      answer: "Our AI resume analyzer uses advanced natural language processing to evaluate your resume content, structure, and ATS compatibility. It provides detailed feedback on formatting, keywords, skills, and suggestions for improvement."
    },
    {
      question: "Is the resume analysis really free?",
      answer: "Yes! We offer a comprehensive free analysis that includes ATS compatibility checking, basic skills analysis, and improvement recommendations. Premium features provide deeper insights and industry-specific guidance."
    },
    {
      question: "What file formats do you support?",
      answer: "We support PDF and Word document formats (.pdf, .doc, .docx). PDF format is recommended for the most accurate analysis as it preserves formatting."
    },
    {
      question: "How accurate is the ATS compatibility score?",
      answer: "Our ATS compatibility analysis is based on real ATS systems and industry best practices. We test against common parsing algorithms used by major applicant tracking systems to provide accurate compatibility scores."
    },
    {
      question: "Do you store my resume data?",
      answer: "We take privacy seriously. Resume content is processed temporarily for analysis and not permanently stored. You can delete your data at any time from your account settings."
    }
  ]
};

// Generate page-specific SEO metadata
export const generateSEOMetadata = (page: string, customData?: any) => {
  const pageConfig = seoConfig.pages[page] || seoConfig.pages.home;
  const keywords = seoConfig.keywords[page] || seoConfig.keywords.home;
  
  return {
    title: customData?.title || pageConfig.title,
    description: customData?.description || pageConfig.description,
    keywords: keywords.join(', '),
    canonical: `${seoConfig.siteUrl}${pageConfig.canonical}`,
    ogImage: customData?.image || seoConfig.images.default,
    ...customData
  };
};

export default seoConfig;
