/**
 * Mock data generator for Enhanced Analytics Dashboard
 * Provides realistic sample data for testing advanced analytics features
 */

export const generateMockAdvancedAnalyticsData = () => {
  return {
    atsScore: 85,
    previousAtsScore: 72,
    skillsMatched: 18,
    totalSkills: 25,
    readabilityScore: 78,
    keywordDensity: 3.2,
    
    predictiveInsights: {
      jobSuccessScore: 82,
      confidenceLevel: 87,
      interviewProbability: 74,
      salaryPrediction: {
        min: 85000,
        max: 110000,
        median: 95000,
        currency: 'USD',
        confidenceLevel: 85
      },
      careerAdvancement: {
        nextRole: 'Senior Full Stack Developer',
        timeframe: '6-12 months',
        requiredSkills: ['React', 'Node.js', 'AWS', 'GraphQL', 'TypeScript'],
        probability: 78,
        actionPlan: [
          'Complete advanced React certification',
          'Build 2 more full-stack projects',
          'Contribute to open source projects',
          'Attend 3 tech meetups/conferences'
        ]
      },
      marketDemand: {
        skillDemand: 92,
        industryGrowth: 15,
        competitionLevel: 'medium' as const,
        trendingSkills: ['Next.js', 'Tailwind CSS', 'Prisma', 'tRPC'],
        emergingOpportunities: ['AI/ML Integration', 'Web3 Development', 'Edge Computing']
      },
      performanceMetrics: {
        applicationSuccessRate: 23,
        interviewToOfferRatio: 45,
        profileViewsGrowth: 34,
        networkingEffectiveness: 67
      }
    },

    skillAnalysis: [
      {
        name: 'React',
        category: 'Frontend',
        currentLevel: 85,
        marketDemand: 95,
        improvementPotential: 15,
        salaryImpact: 12,
        learningTime: '2-3 weeks',
        resources: [
          'React Advanced Patterns Course',
          'React Performance Optimization',
          'React Testing Library Masterclass'
        ],
        learningResources: [
          {
            type: 'course' as const,
            title: 'Advanced React Patterns',
            provider: 'Frontend Masters',
            duration: '6 hours',
            difficulty: 'advanced' as const,
            url: 'https://frontendmasters.com/courses/advanced-react-patterns/'
          }
        ]
      },
      {
        name: 'Node.js',
        category: 'Backend',
        currentLevel: 78,
        marketDemand: 88,
        improvementPotential: 22,
        salaryImpact: 8,
        learningTime: '3-4 weeks',
        resources: [
          'Node.js Design Patterns',
          'Microservices with Node.js',
          'Node.js Performance Tuning'
        ],
        learningResources: [
          {
            type: 'course' as const,
            title: 'Node.js Complete Guide',
            provider: 'Udemy',
            duration: '40 hours',
            difficulty: 'intermediate' as const,
            url: 'https://www.udemy.com/course/nodejs-the-complete-guide/'
          }
        ]
      },
      {
        name: 'AWS',
        category: 'Cloud',
        currentLevel: 65,
        marketDemand: 96,
        improvementPotential: 35,
        salaryImpact: 18,
        learningTime: '6-8 weeks',
        resources: [
          'AWS Solutions Architect Certification',
          'AWS DevOps Engineer Certification',
          'Hands-on AWS Projects'
        ],
        learningResources: [
          {
            type: 'certification' as const,
            title: 'AWS Solutions Architect Associate',
            provider: 'Amazon Web Services',
            duration: '3 months',
            difficulty: 'intermediate' as const,
            url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/'
          }
        ]
      }
    ],

    competitiveAnalysis: {
      industryRanking: 245,
      percentile: 78,
      strongerThan: 1834,
      competitiveAdvantages: [
        'Strong full-stack development skills',
        'Experience with modern React ecosystem',
        'Good understanding of cloud architecture',
        'Active in open source community'
      ],
      improvementAreas: [
        'Advanced system design knowledge',
        'Machine learning fundamentals',
        'DevOps and CI/CD expertise',
        'Leadership and team management skills'
      ],
      marketPositioning: 'mid-level' as const
    },

    industryBenchmarks: {
      industry: 'Software Development',
      averageATS: 68,
      topPercentile: 92,
      yourRanking: 245,
      totalProfiles: 2350,
      salaryBenchmarks: {
        entry: 65000,
        mid: 95000,
        senior: 140000,
        executive: 200000
      }
    },

    performanceTrends: [
      {
        timestamp: '2024-01-01',
        atsScore: 65,
        readability: 72,
        keywords: 45,
        profileViews: 23,
        applicationSuccess: 12
      },
      {
        timestamp: '2024-02-01',
        atsScore: 68,
        readability: 74,
        keywords: 52,
        profileViews: 28,
        applicationSuccess: 15
      },
      {
        timestamp: '2024-03-01',
        atsScore: 72,
        readability: 76,
        keywords: 58,
        profileViews: 34,
        applicationSuccess: 18
      },
      {
        timestamp: '2024-04-01',
        atsScore: 75,
        readability: 77,
        keywords: 61,
        profileViews: 38,
        applicationSuccess: 20
      },
      {
        timestamp: '2024-05-01',
        atsScore: 79,
        readability: 78,
        keywords: 65,
        profileViews: 45,
        applicationSuccess: 22
      },
      {
        timestamp: '2024-06-01',
        atsScore: 85,
        readability: 78,
        keywords: 68,
        profileViews: 52,
        applicationSuccess: 23
      }
    ],

    aiRecommendations: [
      {
        id: 'rec-1',
        category: 'skills' as const,
        priority: 'high' as const,
        title: 'Add Cloud Architecture Skills',
        description: 'Adding AWS or Azure certifications could increase your salary potential by 15-20%',
        expectedImpact: 85,
        impact: 85,
        effort: 'challenging' as const,
        timeToImplement: '2-3 months',
        estimatedTime: '2-3 months',
        actionSteps: [
          'Complete AWS Solutions Architect Associate certification',
          'Build 3 cloud-based projects',
          'Join AWS community groups',
          'Update resume with cloud experience'
        ],
        relatedSkills: ['AWS', 'Docker', 'Kubernetes', 'Terraform']
      },
      {
        id: 'rec-2',
        category: 'content' as const,
        priority: 'critical' as const,
        title: 'Optimize Keywords for ATS',
        description: 'Your resume lacks key industry keywords that 87% of job postings require',
        expectedImpact: 65,
        impact: 65,
        effort: 'easy' as const,
        timeToImplement: '1-2 days',
        estimatedTime: '1-2 days',
        actionSteps: [
          'Add "Agile/Scrum" methodology keywords',
          'Include more specific technology versions',
          'Use action verbs like "architected", "optimized", "scaled"',
          'Add quantifiable achievements'
        ],
        relatedSkills: ['ATS Optimization', 'Technical Writing']
      }
    ],

    careerGoals: {
      targetRole: 'Senior Full Stack Developer',
      targetSalary: 120000,
      timeframe: '8-12 months',
      progress: 68,
      milestones: [
        {
          title: 'Complete React Advanced Certification',
          completed: true,
          dueDate: '2024-07-15',
          priority: 'high' as const
        },
        {
          title: 'Build Portfolio Project with AWS',
          completed: false,
          dueDate: '2024-08-30',
          priority: 'high' as const
        },
        {
          title: 'Attend 2 Tech Conferences',
          completed: false,
          dueDate: '2024-10-15',
          priority: 'medium' as const
        },
        {
          title: 'Contribute to 3 Open Source Projects',
          completed: false,
          dueDate: '2024-11-30',
          priority: 'medium' as const
        }
      ]
    },

    progressTimeline: [
      {
        date: '2024-01-15',
        atsScore: 65,
        skillsAdded: 2,
        improvements: ['Added React certification', 'Updated work experience'],
        milestone: 'Started career development plan'
      },
      {
        date: '2024-03-20',
        atsScore: 72,
        skillsAdded: 3,
        improvements: ['Added Node.js projects', 'Improved technical skills section', 'Added GitHub portfolio'],
        milestone: 'Completed first quarter goals'
      },
      {
        date: '2024-06-18',
        atsScore: 85,
        skillsAdded: 4,
        improvements: ['Added AWS experience', 'Updated achievements with metrics', 'Improved resume formatting', 'Added leadership experience'],
        milestone: 'Achieved 85+ ATS score target'
      }
    ],

    resumeSectionHeatMap: [
      {
        section: 'Technical Skills',
        attention: 95,
        optimization: 88,
        priority: 'high' as const
      },
      {
        section: 'Work Experience',
        attention: 87,
        optimization: 92,
        priority: 'high' as const
      },
      {
        section: 'Projects',
        attention: 76,
        optimization: 68,
        priority: 'medium' as const
      },
      {
        section: 'Education',
        attention: 45,
        optimization: 85,
        priority: 'low' as const
      },
      {
        section: 'Certifications',
        attention: 82,
        optimization: 78,
        priority: 'high' as const
      }
    ],

    performanceMetrics: {
      applicationsSubmitted: 45,
      interviewsReceived: 12,
      responseRate: 27,
      avgResponseTime: 5.2,
      topPerformingKeywords: ['React', 'JavaScript', 'Full Stack', 'AWS', 'Node.js'],
      improvementVelocity: 12.5
    }
  };
};

export type AdvancedAnalyticsData = ReturnType<typeof generateMockAdvancedAnalyticsData>;
