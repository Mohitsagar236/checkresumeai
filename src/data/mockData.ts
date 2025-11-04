import { 
  JobRole, 
  Industry, 
  PricingPlan, 
  FAQ, 
  AnalysisResult 
} from '../types';

export const mockJobRoles: JobRole[] = [
  {
    id: '1',
    title: 'Software Engineer',
    requiredSkills: [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 
      'Git', 'Cloud Services', 'API Design', 'Problem Solving',
      'System Design', 'Data Structures', 'Algorithms', 'CI/CD',
      'Docker', 'Kubernetes', 'AWS/Azure/GCP', 'Testing',
      'Performance Optimization', 'Security Best Practices'
    ],
    keyResponsibilities: [
      'Design and implement scalable software solutions',
      'Write clean, maintainable, and efficient code',
      'Conduct code reviews and provide constructive feedback',
      'Debug complex technical issues across the stack',
      'Collaborate with cross-functional teams on architecture decisions',
      'Optimize application performance and reliability',
      'Implement security best practices and data protection measures',
      'Mentor junior developers and share technical knowledge',
      'Participate in agile ceremonies and sprint planning',
      'Document technical specifications and system architecture'
    ],
    keywords: [
      'full-stack development', 'microservices', 'distributed systems',
      'cloud architecture', 'agile methodologies', 'DevOps',
      'test-driven development', 'continuous integration',
      'RESTful APIs', 'GraphQL', 'containerization', 'version control',
      'code optimization', 'technical leadership', 'system design'
    ]
  },
  {
    id: '2',
    title: 'Data Scientist',
    requiredSkills: [
      'Python', 'R', 'SQL', 'Machine Learning', 'Deep Learning',
      'TensorFlow', 'PyTorch', 'Statistical Analysis', 'Data Visualization',
      'Big Data Technologies', 'Feature Engineering', 'A/B Testing',
      'Natural Language Processing', 'Computer Vision', 'Time Series Analysis',
      'Data Preprocessing', 'Model Deployment', 'Cloud Computing',
      'Spark', 'Hadoop'
    ],
    keyResponsibilities: [
      'Develop and implement advanced machine learning models',
      'Design and conduct complex statistical experiments',
      'Create data pipelines for model training and deployment',
      'Analyze large datasets to extract actionable insights',
      'Collaborate with stakeholders to define business metrics',
      'Build and maintain production ML systems',
      'Optimize model performance and accuracy',
      'Present findings to technical and non-technical audiences',
      'Implement data quality and validation processes',
      'Research and apply cutting-edge ML techniques'
    ],
    keywords: [
      'artificial intelligence', 'predictive modeling', 'neural networks',
      'data mining', 'statistical analysis', 'machine learning ops',
      'feature extraction', 'model optimization', 'data engineering',
      'experiment design', 'hypothesis testing', 'clustering',
      'regression analysis', 'classification algorithms', 'data science'
    ]
  },
  {
    id: '3',
    title: 'Product Manager',
    requiredSkills: [
      'Product Strategy', 'User Research', 'Market Analysis',
      'Agile/Scrum', 'Data Analytics', 'Wireframing',
      'Stakeholder Management', 'Competitive Analysis',
      'Product Metrics', 'A/B Testing', 'User Stories',
      'Product Roadmapping', 'Feature Prioritization',
      'Business Case Development', 'Technical Communication',
      'Project Management', 'Customer Journey Mapping',
      'Product Marketing', 'Revenue Modeling', 'UX Design'
    ],
    keyResponsibilities: [
      'Define and execute product vision and strategy',
      'Lead cross-functional teams to deliver product solutions',
      'Conduct market research and competitive analysis',
      'Create and maintain product roadmaps',
      'Prioritize features based on business impact and user needs',
      'Define and track key performance indicators (KPIs)',
      'Gather and analyze user feedback and usage data',
      'Write detailed product requirements documents',
      'Present product updates to executive stakeholders',
      'Collaborate with design and engineering teams'
    ],
    keywords: [
      'product development', 'market research', 'user experience',
      'agile methodology', 'stakeholder management', 'MVP',
      'product lifecycle', 'go-to-market strategy', 'user stories',
      'product analytics', 'customer development', 'product-market fit',
      'value proposition', 'competitive analysis', 'product strategy'
    ]
  },
  {
    id: '4',
    title: 'UX/UI Designer',
    requiredSkills: [
      'Figma', 'Adobe XD', 'Sketch', 'User Research',
      'Wireframing', 'Prototyping', 'Visual Design',
      'Interaction Design', 'Information Architecture',
      'Typography', 'Color Theory', 'Design Systems',
      'Usability Testing', 'Accessibility Standards',
      'HTML/CSS', 'Design Thinking', 'User Journey Mapping',
      'Motion Design', 'Design Documentation', 'Component Libraries'
    ],
    keyResponsibilities: [
      'Create user-centered designs for digital products',
      'Conduct user research and usability testing',
      'Develop wireframes and interactive prototypes',
      'Design and maintain design systems',
      'Collaborate with developers on implementation',
      'Ensure accessibility compliance',
      'Create and maintain design documentation',
      'Participate in design reviews and iterations',
      'Advocate for user needs in product decisions',
      'Stay current with design trends and best practices'
    ],
    keywords: [
      'user experience', 'user interface', 'interaction design',
      'visual design', 'responsive design', 'mobile-first',
      'design thinking', 'user research', 'prototyping',
      'wireframing', 'usability', 'accessibility',
      'design systems', 'user flows', 'information architecture'
    ]
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    requiredSkills: [
      'Linux/Unix', 'Docker', 'Kubernetes', 'AWS/Azure/GCP',
      'CI/CD', 'Infrastructure as Code', 'Shell Scripting',
      'Python', 'Ansible', 'Terraform', 'Jenkins',
      'Monitoring Tools', 'Log Management', 'Security Practices',
      'Network Protocols', 'Git', 'Configuration Management',
      'Cloud Architecture', 'Performance Tuning', 'Automation'
    ],
    keyResponsibilities: [
      'Design and implement CI/CD pipelines',
      'Manage cloud infrastructure and services',
      'Automate deployment processes',
      'Monitor system performance and reliability',
      'Implement security best practices',
      'Troubleshoot production issues',
      'Optimize system performance',
      'Manage configuration and deployment tools',
      'Collaborate with development teams',
      'Document infrastructure and processes'
    ],
    keywords: [
      'continuous integration', 'continuous deployment', 'infrastructure',
      'automation', 'cloud computing', 'containerization',
      'monitoring', 'logging', 'security', 'scalability',
      'reliability', 'performance', 'configuration management',
      'cloud native', 'microservices'
    ]
  },
  {
    id: '6',
    title: 'Marketing Manager',
    requiredSkills: [
      'Digital Marketing', 'Content Strategy', 'SEO/SEM',
      'Social Media Marketing', 'Email Marketing',
      'Analytics Tools', 'Campaign Management',
      'Brand Development', 'Market Research',
      'CRM Systems', 'Budget Management',
      'Project Management', 'Copywriting',
      'Marketing Automation', 'Lead Generation',
      'A/B Testing', 'Performance Marketing',
      'Marketing Analytics', 'Presentation Skills',
      'Team Leadership'
    ],
    keyResponsibilities: [
      'Develop and execute marketing strategies',
      'Manage digital marketing campaigns',
      'Create and optimize content for various channels',
      'Track and analyze marketing metrics',
      'Manage marketing budget and ROI',
      'Lead and mentor marketing team members',
      'Collaborate with sales and product teams',
      'Develop and maintain brand guidelines',
      'Present marketing results to stakeholders',
      'Stay current with marketing trends'
    ],
    keywords: [
      'digital marketing', 'content marketing', 'social media',
      'brand management', 'marketing strategy', 'lead generation',
      'marketing automation', 'customer acquisition', 'analytics',
      'campaign management', 'market research', 'SEO',
      'email marketing', 'performance marketing', 'growth marketing'
    ]
  },
  {
    id: '7',
    title: 'Financial Analyst',
    requiredSkills: [
      'Financial Modeling', 'Excel/Google Sheets',
      'Data Analysis', 'Financial Reporting',
      'Budgeting', 'Forecasting', 'SQL',
      'Business Intelligence Tools', 'Risk Analysis',
      'Statistical Analysis', 'Financial Planning',
      'Investment Analysis', 'Accounting Principles',
      'Valuation Methods', 'Python/R',
      'Bloomberg Terminal', 'Power BI/Tableau',
      'Financial Statements', 'Industry Research',
      'Presentation Skills'
    ],
    keyResponsibilities: [
      'Develop financial models and forecasts',
      'Analyze financial data and trends',
      'Prepare financial reports and presentations',
      'Conduct market and competitor analysis',
      'Support budget planning process',
      'Evaluate investment opportunities',
      'Monitor financial performance metrics',
      'Provide insights for decision making',
      'Collaborate with cross-functional teams',
      'Maintain financial databases and tools'
    ],
    keywords: [
      'financial analysis', 'financial modeling', 'forecasting',
      'budgeting', 'valuation', 'risk assessment',
      'data analysis', 'reporting', 'investment analysis',
      'financial planning', 'business intelligence',
      'market analysis', 'financial statements',
      'performance metrics', 'strategic planning'
    ]
  },
  {
    id: '8',
    title: 'Sales Manager',
    requiredSkills: [
      'Sales Strategy', 'Team Leadership',
      'CRM Systems', 'Pipeline Management',
      'Negotiation', 'Account Management',
      'Sales Analytics', 'Forecasting',
      'Presentation Skills', 'Customer Relations',
      'Business Development', 'Sales Training',
      'Performance Management', 'Market Analysis',
      'Sales Tools', 'Revenue Planning',
      'Communication Skills', 'Problem Solving',
      'Time Management', 'Coaching'
    ],
    keyResponsibilities: [
      'Develop and execute sales strategies',
      'Lead and motivate sales team',
      'Manage sales pipeline and forecasts',
      'Set and track sales targets',
      'Coach and develop team members',
      'Build and maintain client relationships',
      'Analyze sales performance data',
      'Implement sales processes and tools',
      'Collaborate with marketing team',
      'Report on sales metrics and KPIs'
    ],
    keywords: [
      'sales management', 'team leadership', 'pipeline management',
      'revenue growth', 'business development', 'account management',
      'sales strategy', 'performance management', 'coaching',
      'customer relations', 'sales operations', 'forecasting',
      'sales analytics', 'territory management', 'client acquisition'
    ]
  },
  {
    id: '9',
    title: 'HR Manager',
    requiredSkills: [
      'HR Policies', 'Recruitment', 'Employee Relations',
      'Performance Management', 'Training & Development',
      'Compensation & Benefits', 'Labor Laws',
      'HRIS Systems', 'Conflict Resolution',
      'Organizational Development', 'Change Management',
      'Talent Management', 'Employee Engagement',
      'Succession Planning', 'HR Analytics',
      'Diversity & Inclusion', 'Leadership Development',
      'Policy Development', 'Budget Management',
      'Communication Skills'
    ],
    keyResponsibilities: [
      'Develop and implement HR strategies',
      'Manage recruitment and onboarding processes',
      'Oversee performance management programs',
      'Ensure compliance with labor laws',
      'Develop and maintain HR policies',
      'Manage employee relations and engagement',
      'Coordinate training and development programs',
      'Administer compensation and benefits',
      'Lead organizational development initiatives',
      'Report on HR metrics and analytics'
    ],
    keywords: [
      'human resources', 'talent management', 'employee relations',
      'recruitment', 'performance management', 'training',
      'compensation', 'benefits', 'compliance',
      'organizational development', 'employee engagement',
      'HR analytics', 'succession planning',
      'policy development', 'change management'
    ]
  },
  {
    id: '10',
    title: 'Business Analyst',
    requiredSkills: [
      'Requirements Analysis', 'Process Modeling',
      'Data Analysis', 'SQL', 'Excel',
      'Business Process Mapping', 'Agile Methodologies',
      'Project Management', 'Documentation',
      'Stakeholder Management', 'Problem Solving',
      'Statistical Analysis', 'Power BI/Tableau',
      'JIRA/Confluence', 'UML',
      'Risk Analysis', 'Cost-Benefit Analysis',
      'Business Case Development', 'Communication Skills',
      'Critical Thinking'
    ],
    keyResponsibilities: [
      'Gather and analyze business requirements',
      'Document processes and workflows',
      'Conduct stakeholder interviews',
      'Create process models and documentation',
      'Analyze data and generate insights',
      'Present findings and recommendations',
      'Support project implementation',
      'Monitor and report on project progress',
      'Identify process improvements',
      'Facilitate workshops and meetings'
    ],
    keywords: [
      'business analysis', 'requirements gathering', 'process improvement',
      'data analysis', 'stakeholder management', 'documentation',
      'project management', 'process modeling', 'problem solving',
      'risk analysis', 'business intelligence', 'agile',
      'workflow optimization', 'change management', 'strategic planning'
    ]
  }
];

export const mockIndustries: Industry[] = [
  { 
    id: '1', 
    name: 'Technology',
    subIndustries: [
      'Software Development',
      'Cloud Computing',
      'Artificial Intelligence',
      'Cybersecurity',
      'Internet of Things'
    ]
  },
  { 
    id: '2', 
    name: 'Healthcare',
    subIndustries: [
      'Digital Health',
      'Biotechnology',
      'Medical Devices',
      'Healthcare IT',
      'Pharmaceuticals'
    ]
  },
  { 
    id: '3', 
    name: 'Finance',
    subIndustries: [
      'FinTech',
      'Investment Banking',
      'Insurance',
      'Wealth Management',
      'Cryptocurrency'
    ]
  },
  {
    id: '4',
    name: 'Manufacturing',
    subIndustries: [
      'Automotive',
      'Electronics',
      'Industrial Equipment',
      'Consumer Goods',
      'Aerospace'
    ]
  },
  {
    id: '5',
    name: 'Retail',
    subIndustries: [
      'E-commerce',
      'Fashion',
      'Consumer Electronics',
      'Grocery',
      'Luxury Goods'
    ]
  }
];

export const mockPricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    billingCycle: 'monthly',
    features: [
      'Basic ATS compatibility score',
      'Limited format analysis',
      'Basic keyword matching',
      'Up to 2 resume scans per month',
      'Email support'
    ],
    limitations: [
      'No detailed content analysis',
      'No skills gap analysis',
      'No downloadable reports',
      'Basic improvement suggestions only'
    ]
  },
  {
    id: 'freemium',
    name: 'Freemium',
    price: 0,
    billingCycle: 'monthly',
    features: [
      'Advanced ATS compatibility score',
      'Detailed format analysis',
      'Enhanced keyword matching',
      'Up to 5 resume scans per month',
      'Detailed content analysis',
      'Skills gap analysis',
      'Downloadable basic reports',
      'Smart improvement suggestions',
      'Email support'
    ],
    limitations: [
      'No real-time analysis',
      'No template library access',
      'No priority support',
      'Limited LinkedIn optimization',
      'No cover letter analysis'
    ]
  },
  {
    id: 'premium-monthly',
    name: 'Premium',
    price: 99, // ₹99/month
    billingCycle: 'monthly',
    features: [
      'Advanced ATS compatibility analysis',
      'Comprehensive format optimization',
      'In-depth content analysis',
      'Full skills gap assessment',
      'Unlimited resume scans',
      'AI-powered improvement suggestions',
      'Downloadable detailed reports',
      'Priority email support',
      'Resume templates library',
      'Interview preparation tips'
    ],
    bonusFeatures: [
      'LinkedIn profile optimization',
      'Cover letter analyzer',
      'Job application tracker',
      'Industry-specific insights'
    ],
    realTimeFeatures: [
      'Real-time resume analysis',
      'Instant feedback on changes',
      'Live ATS compatibility scoring',
      'Interactive content suggestions'
    ]
  },
  {
    id: 'premium-yearly',
    name: 'Premium',
    price: 499, // ₹499/year
    billingCycle: 'yearly',
    features: [
      'All Premium monthly features',
      'Advanced interview preparation',
      'Personal branding guide',
      'Career progression roadmap',
      'Priority video support',
      'Custom resume templates',
      '58% savings compared to monthly',
      'Early access to new features'
    ],
    bonusFeatures: [
      'Resume writing workshop',
      'Quarterly career coaching session',
      'Networking strategies guide',
      'Salary negotiation tips'
    ],
    realTimeFeatures: [
      'Real-time resume analysis',
      'Instant feedback on changes',
      'Live ATS compatibility scoring',
      'Interactive content suggestions',
      'Advanced AI-powered real-time insights'
    ]
  }
];

export const mockFAQs: FAQ[] = [
  {
    question: 'What is an ATS and why is it important?',
    answer: 'An Applicant Tracking System (ATS) is software used by employers to manage job applications. It scans resumes for specific keywords and formats before a human ever sees them. If your resume is not ATS-friendly, it might be rejected automatically, even if you are qualified for the role.',
    category: 'General',
    relatedQuestions: [
      'How does ATS scanning work?',
      'What format should my resume be in?'
    ],
    helpfulVotes: 24,
    unhelpfulVotes: 2
  },
  {
    question: 'How accurate is your ATS scoring?',
    answer: 'Our ATS scoring algorithm is based on industry standards and real-world data from leading ATS systems. While we can\'t guarantee 100% accuracy for every ATS (each company may configure their system differently), our tool provides a strong indication of how well your resume will perform across most ATS platforms.',
    category: 'Technical',
    relatedQuestions: [
      'What factors affect the ATS score?',
      'How can I improve my ATS score?'
    ],
    helpfulVotes: 18,
    unhelpfulVotes: 3
  },
  {
    question: 'What file formats do you support?',
    answer: 'We currently support PDF and DOCX formats for resume uploads. These are the most common formats used for job applications and are generally well-handled by ATS systems.',
    category: 'Technical',
    relatedQuestions: [
      'Which format is better for ATS?',
      'Can I upload other file types?'
    ],
    helpfulVotes: 32,
    unhelpfulVotes: 1
  },
  {
    question: 'How does the job role targeting work?',
    answer: 'When you select a specific job role, our system analyzes your resume against the typical requirements, keywords, and skills for that role. This helps identify gaps and provides tailored recommendations to optimize your resume for positions you\'re targeting.',
    category: 'Features',
    relatedQuestions: [
      'Can I target multiple roles?',
      'How often are job requirements updated?'
    ]
  },
  {
    question: 'Is my resume data secure?',
    answer: 'Yes, we take data security seriously. Your resume is encrypted during transmission and storage. We don\'t share your personal information with third parties, and you can request deletion of your data at any time from your account settings.',
    category: 'Security',
    relatedQuestions: [
      'How long do you store my data?',
      'What is your privacy policy?'
    ]
  },
  {
    question: 'What\'s the difference between free and premium plans?',
    answer: 'The free plan offers basic ATS compatibility analysis with limited suggestions. Premium plans provide comprehensive analysis, detailed improvement recommendations, unlimited scans, downloadable reports, and additional features like skills gap analysis and industry-specific insights.',
    category: 'Pricing',
    relatedQuestions: [
      'Can I upgrade anytime?',
      'Do you offer refunds?'
    ]
  }
];

export const generateMockAnalysis = (jobRoleId: string): AnalysisResult => {
  const jobRole = mockJobRoles.find(role => role.id === jobRoleId) || mockJobRoles[0];
  
  // Generate weighted random scores based on complexity
  const formatScore = Math.floor(Math.random() * 40) + 60;
  const keywordsScore = Math.floor(Math.random() * 50) + 50;
  const actionVerbsScore = Math.floor(Math.random() * 40) + 60;
  const experienceScore = Math.floor(Math.random() * 30) + 70;
  const skillsScore = Math.floor(Math.random() * 60) + 40;
  
  // Calculate content score with weighted components
  const contentScore = Math.floor(
    (keywordsScore * 0.4) + 
    (actionVerbsScore * 0.3) + 
    (experienceScore * 0.3)
  );
  
  // Calculate overall ATS score with industry-standard weights
  const atsScore = Math.floor(
    (formatScore * 0.25) + 
    (contentScore * 0.45) + 
    (skillsScore * 0.30)
  );
  
  // Generate matched/missing skills with intelligent distribution
  const allSkills = [...jobRole.requiredSkills];
  const matchedSkillsCount = Math.floor((skillsScore / 100) * allSkills.length);
  const matchedSkills = allSkills
    .slice(0, matchedSkillsCount)
    .sort(() => Math.random() - 0.5);
  const missingSkills = allSkills
    .slice(matchedSkillsCount)
    .sort(() => Math.random() - 0.5);
  
  // Generate matched/missing keywords with relevance scoring
  const allKeywords = [...jobRole.keywords];
  const matchedKeywordsCount = Math.floor((keywordsScore / 100) * allKeywords.length);
  const matchedKeywords = allKeywords
    .slice(0, matchedKeywordsCount)
    .sort(() => Math.random() - 0.5);
  const missingKeywords = allKeywords
    .slice(matchedKeywordsCount)
    .sort(() => Math.random() - 0.5);

  return {
    id: crypto.randomUUID(),
    resumeId: crypto.randomUUID(),
    atsScore,
    formatAnalysis: {
      score: formatScore,
      layout: {
        score: Math.floor(Math.random() * 40) + 60,
        feedback: formatScore > 70 
          ? 'Your resume has a professional, ATS-friendly layout with clear section hierarchy.'
          : 'Consider restructuring your resume with standard section headings and a single-column layout for better ATS compatibility.'
      },
      readability: {
        score: Math.floor(Math.random() * 40) + 60,
        feedback: formatScore > 70
          ? 'Excellent use of consistent fonts, spacing, and formatting throughout the document.'
          : 'Improve readability by using consistent font sizes, proper spacing, and standard formatting across all sections.'
      },
      organization: {
        score: Math.floor(Math.random() * 40) + 60,
        feedback: formatScore > 70
          ? 'Well-organized content with clear section headings and logical information flow.'
          : 'Enhance organization by using standard section headers and maintaining consistent formatting within sections.'
      }
    },
    contentAnalysis: {
      score: contentScore,
      keywords: {
        score: keywordsScore,
        matched: matchedKeywords,
        missing: missingKeywords,
        feedback: keywordsScore > 70
          ? 'Strong keyword optimization for the target role. You\'ve included most essential industry terms.'
          : 'Your resume needs more relevant keywords. Consider incorporating missing terms naturally throughout your experience.'
      },
      actionVerbs: {
        score: actionVerbsScore,
        strong: [
          'Architected', 'Spearheaded', 'Implemented', 'Orchestrated',
          'Revolutionized', 'Streamlined', 'Transformed', 'Pioneered',
          'Established', 'Cultivated'
        ],
        weak: [
          'Helped with', 'Worked on', 'Responsible for', 'Assisted in',
          'Participated in', 'Involved in', 'Supported', 'Dealt with'
        ],
        feedback: actionVerbsScore > 70
          ? 'Excellent use of strong action verbs that demonstrate leadership and impact.'
          : 'Replace passive phrases with powerful action verbs to better showcase your achievements.'
      },
      experience: {
        score: experienceScore,
        feedback: experienceScore > 70
          ? 'Your experience section effectively demonstrates relevant achievements with quantifiable results.'
          : 'Focus on quantifying your achievements and highlighting specific contributions rather than listing job duties.'
      }
    },
    skillsGap: {
      score: skillsScore,
      requiredSkills: jobRole.requiredSkills,
      matchedSkills,
      missingSkills,
      feedback: skillsScore > 70
        ? 'Your skills profile aligns well with the requirements for this role.'
        : 'There are several critical skills gaps that could impact your application success.'
    },
    suggestions: [
      {
        section: 'Format',
        priority: formatScore < 70 ? 'high' : 'low',
        current: 'Complex multi-column layout with creative design elements',
        suggested: 'Clean single-column layout with consistent formatting and clear section headings',
        reason: 'ATS systems perform better with simple, well-structured layouts'
      },
      {
        section: 'Skills',
        priority: missingSkills.length > 5 ? 'high' : 'medium',
        current: 'Generic skills list without context',
        suggested: `Add these critical skills: ${missingSkills.slice(0, 3).join(', ')}`,
        reason: 'Missing key technical skills required for the role'
      },
      {
        section: 'Experience',
        priority: experienceScore < 70 ? 'high' : 'medium',
        current: 'Job descriptions focus on responsibilities',
        suggested: 'Quantify achievements and highlight specific project outcomes',
        reason: 'Measurable achievements provide stronger evidence of capabilities'
      },
      {
        section: 'Keywords',
        priority: keywordsScore < 60 ? 'high' : 'low',
        current: 'Limited use of industry-specific terminology',
        suggested: `Incorporate key terms: ${missingKeywords.slice(0, 3).join(', ')}`,
        reason: 'Missing important keywords that ATS systems scan for'
      }
    ],
    createdAt: new Date()
  };
};