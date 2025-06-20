// Course Suggestion Service
// Provides course recommendations based on missing skills from resume analysis

export interface CourseRecommendation {
  title: string;
  platform: string;
  link: string;
  duration?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  price?: 'Free' | 'Paid' | 'Freemium' | 'Subscription' | 'Free with trial' | 'Free audit' | string;
  // Add source type to categorize recommendations
  sourceType?: 'YouTube' | 'OnlineCourse' | 'Certification' | 'Tutorial';
  skillMatch?: string; // Which skill this course addresses
}

/**
 * Comprehensive course mapping for various skills across multiple platforms
 */
const COMPREHENSIVE_COURSE_MAP: { [key: string]: CourseRecommendation[] } = {
  // Technical Skills
  'JavaScript': [
    { title: 'JavaScript - The Complete Guide 2024', platform: 'Udemy', link: 'https://www.udemy.com/course/javascript-the-complete-guide-2020-beginner-advanced/', level: 'Beginner', price: 'Paid' },
    { title: 'JavaScript Full Course for Beginners', platform: 'YouTube', link: 'https://www.youtube.com/watch?v=PkZNo7MFNFg', duration: '3.5 hours', price: 'Free' },
    { title: 'Introduction to JavaScript', platform: 'Codecademy', link: 'https://www.codecademy.com/learn/introduction-to-javascript', level: 'Beginner', price: 'Freemium' }
  ],
  'Python': [
    { title: 'Python for Everybody Specialization', platform: 'Coursera', link: 'https://www.coursera.org/specializations/python', level: 'Beginner', price: 'Freemium' },
    { title: 'Complete Python Bootcamp From Zero to Hero', platform: 'Udemy', link: 'https://www.udemy.com/course/complete-python-bootcamp/', level: 'Beginner', price: 'Paid' },
    { title: 'Python Tutorial - Python Full Course for Beginners', platform: 'YouTube', link: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc', duration: '6 hours', price: 'Free' }
  ],
  'React': [
    { title: 'React - The Complete Guide 2024', platform: 'Udemy', link: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/', level: 'Intermediate', price: 'Paid' },
    { title: 'React Course - Beginner\'s Tutorial for React JavaScript', platform: 'YouTube', link: 'https://www.youtube.com/watch?v=bMknfKXIFA8', duration: '5 hours', price: 'Free' },
    { title: 'Meta React Developer Professional Certificate', platform: 'Coursera', link: 'https://www.coursera.org/professional-certificates/meta-react-developer', level: 'Intermediate', price: 'Paid' }
  ],
  'Node.js': [
    { title: 'The Complete Node.js Developer Course', platform: 'Udemy', link: 'https://www.udemy.com/course/the-complete-nodejs-developer-course-2/', level: 'Intermediate', price: 'Paid' },
    { title: 'Node.js Tutorial for Beginners: Learn Node in 1 Hour', platform: 'YouTube', link: 'https://www.youtube.com/watch?v=TlB_eWDSMt4', duration: '1 hour', price: 'Free' },
    { title: 'Server-side Development with NodeJS, Express and MongoDB', platform: 'Coursera', link: 'https://www.coursera.org/learn/server-side-nodejs', level: 'Intermediate', price: 'Freemium' }
  ],
  'SQL': [
    { title: 'The Complete SQL Bootcamp', platform: 'Udemy', link: 'https://www.udemy.com/course/the-complete-sql-bootcamp/', level: 'Beginner', price: 'Paid' },
    { title: 'SQL Tutorial - Full Database Course for Beginners', platform: 'YouTube', link: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', duration: '4 hours', price: 'Free' },
    { title: 'Introduction to Structured Query Language (SQL)', platform: 'Coursera', link: 'https://www.coursera.org/learn/intro-sql', level: 'Beginner', price: 'Freemium' }
  ],
  'AWS': [
    { title: 'AWS Certified Solutions Architect - Associate', platform: 'Udemy', link: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate/', level: 'Intermediate', price: 'Paid' },
    { title: 'AWS Tutorial for Beginners', platform: 'YouTube', link: 'https://www.youtube.com/watch?v=k1RI5locZE4', duration: '4 hours', price: 'Free' },
    { title: 'AWS Cloud Practitioner Essentials', platform: 'AWS Training', link: 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/', level: 'Beginner', price: 'Free' }
  ],
  'Docker': [
    { title: 'Docker Mastery: with Kubernetes +Swarm from a Docker Captain', platform: 'Udemy', link: 'https://www.udemy.com/course/docker-mastery/', level: 'Intermediate', price: 'Paid' },
    { title: 'Docker Tutorial for Beginners', platform: 'YouTube', link: 'https://www.youtube.com/watch?v=fqMOX6JJhGo', duration: '3 hours', price: 'Free' },
    { title: 'Introduction to Containers w/ Docker, Kubernetes & OpenShift', platform: 'Coursera', link: 'https://www.coursera.org/learn/ibm-containers-docker-kubernetes-openshift', level: 'Intermediate', price: 'Freemium' }
  ],

  // Data Science & Analytics
  'Data Analysis': [
    { title: 'Google Data Analytics Professional Certificate', platform: 'Coursera', link: 'https://www.coursera.org/professional-certificates/google-data-analytics', level: 'Beginner', price: 'Paid' },
    { title: 'Data Analysis with Python - Full Course for Beginners', platform: 'YouTube', link: 'https://www.youtube.com/watch?v=r-uOLxNrNk8', duration: '12 hours', price: 'Free' },
    { title: 'Python for Data Science and Machine Learning Bootcamp', platform: 'Udemy', link: 'https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/', level: 'Intermediate', price: 'Paid' }
  ],
  'Machine Learning': [
    { title: 'Machine Learning Course by Stanford University', platform: 'Coursera', link: 'https://www.coursera.org/learn/machine-learning', level: 'Intermediate', price: 'Freemium' },
    { title: 'Machine Learning Full Course - Learn Machine Learning', platform: 'YouTube', link: 'https://www.youtube.com/watch?v=GwIo3gDZCVQ', duration: '10 hours', price: 'Free' },
    { title: 'Machine Learning A-Z: Python & R in Data Science', platform: 'Udemy', link: 'https://www.udemy.com/course/machinelearning/', level: 'Intermediate', price: 'Paid' }
  ],
  'Tableau': [
    { title: 'Tableau 2024 A-Z: Hands-On Tableau Training', platform: 'Udemy', link: 'https://www.udemy.com/course/tableau10/', level: 'Beginner', price: 'Paid' },
    { title: 'Tableau Full Course - Learn Tableau in 6 Hours', platform: 'YouTube', link: 'https://www.youtube.com/watch?v=aHaOIvR00So', duration: '6 hours', price: 'Free' },
    { title: 'Data Visualization with Tableau Specialization', platform: 'Coursera', link: 'https://www.coursera.org/specializations/data-visualization', level: 'Intermediate', price: 'Freemium' }
  ],
  'Power BI': [
    { title: 'Microsoft Power BI - Up & Running With Power BI Desktop', platform: 'Udemy', link: 'https://www.udemy.com/course/powerbi-complete-introduction/', level: 'Beginner', price: 'Paid' },
    { title: 'Power BI Full Course - Learn Power BI in 4 Hours', platform: 'YouTube', link: 'https://www.youtube.com/watch?v=AGrl-H87pRU', duration: '4 hours', price: 'Free' },
    { title: 'Analyzing and Visualizing Data with Power BI', platform: 'Microsoft Learn', link: 'https://docs.microsoft.com/en-us/learn/paths/data-analytics-microsoft/', level: 'Intermediate', price: 'Free' }
  ],

  // Business & Management Skills
  'Project Management': [
    { title: 'Google Project Management Professional Certificate', platform: 'Coursera', link: 'https://www.coursera.org/professional-certificates/google-project-management', level: 'Beginner', price: 'Paid' },
    { title: 'Project Management Fundamentals', platform: 'Udemy', link: 'https://www.udemy.com/course/project-management-fundamentals-for-beginners/', level: 'Beginner', price: 'Paid' },
    { title: 'Project Management Full Course', platform: 'YouTube', link: 'https://www.youtube.com/watch?v=z41qXzzUh1w', duration: '7 hours', price: 'Free' }
  ],
  'Leadership': [
    { title: 'Leadership and Influence', platform: 'Coursera', link: 'https://www.coursera.org/learn/leadership-influence', level: 'Intermediate', price: 'Freemium' },
    { title: 'Leadership: Practical Leadership Skills', platform: 'Udemy', link: 'https://www.udemy.com/course/leadership-practical-leadership-skills/', level: 'Intermediate', price: 'Paid' },
    { title: 'Leadership Training - How to be an EXCEPTIONAL Leader', platform: 'YouTube', link: 'https://www.youtube.com/watch?v=B0qgqUmz9G0', duration: '2 hours', price: 'Free' }
  ],
  'Agile': [
    { title: 'Agile Fundamentals: Including Scrum and Kanban', platform: 'Udemy', link: 'https://www.udemy.com/course/agile-fundamentals-scrum-kanban-scrumban/', level: 'Beginner', price: 'Paid' },
    { title: 'Agile Project Management', platform: 'Coursera', link: 'https://www.coursera.org/learn/agile-project-management', level: 'Intermediate', price: 'Freemium' },
    { title: 'Agile Methodology Tutorial', platform: 'YouTube', link: 'https://www.youtube.com/watch?v=Z9QbYZh1YXY', duration: '1 hour', price: 'Free' }
  ],
  'Scrum': [
    { title: 'Scrum Master Certification Prep Course', platform: 'Udemy', link: 'https://www.udemy.com/course/scrum-certification/', level: 'Intermediate', price: 'Paid' },
    { title: 'Scrum Tutorial', platform: 'YouTube', link: 'https://www.youtube.com/watch?v=gy1c4_YixCo', duration: '30 minutes', price: 'Free' },
    { title: 'Scrum Master Certificate Course', platform: 'Coursera', link: 'https://www.coursera.org/learn/scrum-master-certification', level: 'Intermediate', price: 'Freemium' }
  ],

  // Communication & Soft Skills
  'Communication': [
    { title: 'Effective Communication Skills', platform: 'Coursera', link: 'https://www.coursera.org/specializations/effective-communication', level: 'Beginner', price: 'Freemium' },
    { title: 'Communication Skills: Become a Master Communicator', platform: 'Udemy', link: 'https://www.udemy.com/course/communication-skills-become-a-master-communicator/', level: 'Beginner', price: 'Paid' },
    { title: 'How to Improve Communication Skills', platform: 'YouTube', link: 'https://www.youtube.com/watch?v=m2144u2j2gU', duration: '15 minutes', price: 'Free' }
  ],
  'Public Speaking': [
    { title: 'The Complete Presentation and Public Speaking Course', platform: 'Udemy', link: 'https://www.udemy.com/course/the-complete-presentation-course/', level: 'Beginner', price: 'Paid' },
    { title: 'Public Speaking Fundamentals', platform: 'Coursera', link: 'https://www.coursera.org/learn/public-speaking', level: 'Beginner', price: 'Freemium' },
    { title: 'How to Give a Great Presentation', platform: 'YouTube', link: 'https://www.youtube.com/watch?v=34LYmDDZtc0', duration: '18 minutes', price: 'Free' }
  ],
  'Negotiation': [
    { title: 'Successful Negotiation: Essential Strategies and Skills', platform: 'Coursera', link: 'https://www.coursera.org/learn/negotiation-skills', level: 'Intermediate', price: 'Freemium' },
    { title: 'Negotiation Skills: Negotiate Anything with Anyone', platform: 'Udemy', link: 'https://www.udemy.com/course/negotiation-skills/', level: 'Intermediate', price: 'Paid' },
    { title: 'How to Negotiate Effectively', platform: 'YouTube', link: 'https://www.youtube.com/watch?v=guNXL2Tc7r0', duration: '12 minutes', price: 'Free' }
  ],

  // Marketing & Digital Skills
  'Digital Marketing': [
    { title: 'Google Digital Marketing & E-commerce Professional Certificate', platform: 'Coursera', link: 'https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce', level: 'Beginner', price: 'Paid' },
    { title: 'Digital Marketing Course', platform: 'YouTube', link: 'https://www.youtube.com/watch?v=bixR-KIJKYM', duration: '12 hours', price: 'Free' },
    { title: 'The Complete Digital Marketing Course', platform: 'Udemy', link: 'https://www.udemy.com/course/learn-digital-marketing-course/', level: 'Beginner', price: 'Paid' }
  ],
  'SEO': [
    { title: 'SEO Training Course by Moz', platform: 'Moz Academy', link: 'https://academy.moz.com/seo-essentials-certification', level: 'Beginner', price: 'Free' },
    { title: 'Complete SEO Course for Beginners', platform: 'YouTube', link: 'https://www.youtube.com/watch?v=xsVTqzratPs', duration: '7 hours', price: 'Free' },
    { title: 'SEO Specialization', platform: 'Coursera', link: 'https://www.coursera.org/specializations/seo', level: 'Intermediate', price: 'Freemium' }
  ],
  'Social Media Marketing': [
    { title: 'Meta Social Media Marketing Professional Certificate', platform: 'Coursera', link: 'https://www.coursera.org/professional-certificates/facebook-social-media-marketing', level: 'Beginner', price: 'Paid' },
    { title: 'Social Media Marketing Course', platform: 'YouTube', link: 'https://www.youtube.com/watch?v=1sD8jbHy9Zs', duration: '3 hours', price: 'Free' },
    { title: 'Complete Social Media Marketing Course', platform: 'Udemy', link: 'https://www.udemy.com/course/social-media-marketing-course/', level: 'Beginner', price: 'Paid' }
  ],

  // Design & Creative Skills
  'Graphic Design': [
    { title: 'Graphic Design Masterclass - Learn GREAT Design', platform: 'Udemy', link: 'https://www.udemy.com/course/graphic-design-masterclass-everything-you-need-to-know/', level: 'Beginner', price: 'Paid' },
    { title: 'Graphic Design Tutorial for Beginners', platform: 'YouTube', link: 'https://www.youtube.com/watch?v=YqQx75OPRa0', duration: '1 hour', price: 'Free' },
    { title: 'Introduction to Graphic Design', platform: 'Coursera', link: 'https://www.coursera.org/learn/graphic-design', level: 'Beginner', price: 'Freemium' }
  ],
  'UI/UX Design': [
    { title: 'Google UX Design Professional Certificate', platform: 'Coursera', link: 'https://www.coursera.org/professional-certificates/google-ux-design', level: 'Beginner', price: 'Paid' },
    { title: 'UI/UX Design Tutorial - From Zero to Hero', platform: 'YouTube', link: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU', duration: '3 hours', price: 'Free' },
    { title: 'User Experience Design Fundamentals', platform: 'Udemy', link: 'https://www.udemy.com/course/user-experience-design-fundamentals/', level: 'Beginner', price: 'Paid' }
  ],
  'Adobe Photoshop': [
    { title: 'Adobe Photoshop CC – Essentials Training', platform: 'Udemy', link: 'https://www.udemy.com/course/adobe-photoshop-cc-essentials-training/', level: 'Beginner', price: 'Paid' },
    { title: 'Photoshop Tutorial for Beginners', platform: 'YouTube', link: 'https://www.youtube.com/watch?v=IyR_uYsRdPs', duration: '30 minutes', price: 'Free' },
    { title: 'Adobe Photoshop Tutorials', platform: 'Adobe', link: 'https://helpx.adobe.com/photoshop/tutorials.html', level: 'Beginner', price: 'Free' }
  ]
};

/**
 * Generate course suggestions based on missing skills
 */
export function generateCourseSuggestions(
  missingSkills: string[], 
  maxSuggestions: number = 6
): CourseRecommendation[] {
  console.log(`[CourseSuggestionService] Generating course suggestions for ${missingSkills.length} missing skills:`, missingSkills);
  
  // Safeguard against empty or invalid input
  if (!missingSkills || !Array.isArray(missingSkills) || missingSkills.length === 0) {
    console.warn('[CourseSuggestionService] No missing skills provided, using default recommendations');
    return getDefaultCourseRecommendations();
  }
    // First, get YouTube-specific courses (at least 50% of our recommendations)
  const youtubeMax = Math.max(2, Math.ceil(maxSuggestions * 0.6)); // Increase to 60% to ensure priority
  const youtubeCourses = findYouTubeCourses(missingSkills, youtubeMax);
  
  // Start our suggestions with YouTube courses
  const suggestions: CourseRecommendation[] = [...youtubeCourses];
  const usedCourses = new Set<string>(youtubeCourses.map(c => `${c.title}-${c.platform}`));
    // No need to calculate remaining slots since we'll process all missing skills anyway
  
  // Then add other course recommendations
  // First, try to match exact skills
  missingSkills.forEach(skill => {
    // Skip if we've reached the max
    if (suggestions.length >= maxSuggestions) return;
    
    // Normalize the skill for better matching
    const normalizedSkill = skill.trim();
    const exactMatch = COMPREHENSIVE_COURSE_MAP[normalizedSkill];
    
    if (exactMatch) {
      console.log(`[CourseSuggestionService] Found exact match for skill: "${normalizedSkill}"`);
      // Add 1-2 courses per skill, prioritizing different platforms
      const coursesToAdd = exactMatch
        // Prioritize free resources
        .sort((a, b) => {
          // Free courses first
          if (a.price === 'Free' && b.price !== 'Free') return -1;
          if (a.price !== 'Free' && b.price === 'Free') return 1;
          // Then freemium courses
          if (a.price === 'Freemium' && b.price !== 'Freemium') return -1;
          if (a.price !== 'Freemium' && b.price === 'Freemium') return 1;
          return 0;
        })
        .slice(0, 2);
        
      coursesToAdd.forEach(course => {
        const courseKey = `${course.title}-${course.platform}`;
        if (!usedCourses.has(courseKey) && suggestions.length < maxSuggestions) {
          // Add skill match information
          suggestions.push({
            ...course,
            skillMatch: normalizedSkill,
            sourceType: course.platform === 'YouTube' ? 'YouTube' : 
                        course.platform === 'Udemy' || course.platform === 'Coursera' ? 'OnlineCourse' : 'Tutorial'
          });
          usedCourses.add(courseKey);
          console.log(`[CourseSuggestionService] Added course: "${course.title}" (${course.platform})`);
        }
      });
    } else {
      console.log(`[CourseSuggestionService] No exact match found for skill: "${normalizedSkill}"`);
    }
  });
  // If we need more suggestions, try partial matching
  if (suggestions.length < maxSuggestions) {
    console.log(`[CourseSuggestionService] Not enough matches, trying partial matching. Current count: ${suggestions.length}`);
    
    // Create a map to track match quality for each skill
    const partialMatches = new Map();
    
    missingSkills.forEach(skill => {
      const normalizedSkill = skill.trim().toLowerCase();
      
      Object.keys(COMPREHENSIVE_COURSE_MAP).forEach(courseSkill => {
        const normalizedCourseSkill = courseSkill.toLowerCase();
        
        // Check for partial matches
        if (normalizedSkill.includes(normalizedCourseSkill) || 
            normalizedCourseSkill.includes(normalizedSkill)) {
          
          // Calculate match quality (higher is better)
          // Either percentage of course skill contained in user skill or vice versa
          const matchQuality = Math.max(
            normalizedCourseSkill.length / normalizedSkill.length,
            normalizedSkill.length / normalizedCourseSkill.length
          );
          
          if (!partialMatches.has(courseSkill) || matchQuality > partialMatches.get(courseSkill).quality) {
            partialMatches.set(courseSkill, { 
              quality: matchQuality, 
              userSkill: skill,
              courses: COMPREHENSIVE_COURSE_MAP[courseSkill] 
            });
          }
        }
      });
    });
    
    // Sort partial matches by quality and add courses
    Array.from(partialMatches.entries())
      .sort((a, b) => b[1].quality - a[1].quality) // Sort by match quality (descending)
      .forEach(([courseSkill, { quality, userSkill, courses }]) => {
        console.log(`[CourseSuggestionService] Partial match: "${userSkill}" -> "${courseSkill}" (quality: ${quality.toFixed(2)})`);
        
        // Take only the first course from each skill to ensure diversity
        const course = courses[0];
        const courseKey = `${course.title}-${course.platform}`;
        
        if (!usedCourses.has(courseKey) && suggestions.length < maxSuggestions) {
          suggestions.push(course);
          usedCourses.add(courseKey);
          console.log(`[CourseSuggestionService] Added course via partial match: "${course.title}" (${course.platform})`);
        }
      });
  }
  // If still need more suggestions, add some general career development courses
  if (suggestions.length < 3) {
    console.log(`[CourseSuggestionService] Still not enough suggestions (${suggestions.length}), adding general career courses`);
    const generalCourses: CourseRecommendation[] = [
      { title: 'Improve Your Resume with AI', platform: 'YouTube', link: 'https://www.youtube.com/watch?v=P7L1FyI0iSA', duration: '20 minutes', price: 'Free' },
      { title: 'Career Hacking: Resume, LinkedIn, Interviewing', platform: 'Udemy', link: 'https://www.udemy.com/course/the-complete-career-hacking-guide-resume-linkedin-interviewing/', level: 'Beginner', price: 'Paid' },
      { title: 'Professional Skills for the Workplace', platform: 'Coursera', link: 'https://www.coursera.org/specializations/professional-skills-workplace', level: 'Beginner', price: 'Freemium' },
      { title: 'Mastering Common Interview Questions', platform: 'LinkedIn Learning', link: 'https://www.linkedin.com/learning/mastering-common-interview-questions', level: 'Beginner', price: 'Paid' },
      { title: 'Job Search Strategies', platform: 'Udemy', link: 'https://www.udemy.com/course/job-search-strategies/', level: 'Beginner', price: 'Paid' }
    ];

    generalCourses.forEach(course => {
      const courseKey = `${course.title}-${course.platform}`;
      if (!usedCourses.has(courseKey) && suggestions.length < maxSuggestions) {
        suggestions.push(course);
        usedCourses.add(courseKey);
      }
    });
  }

  return suggestions;
}

/**
 * Provides default course recommendations when no specific skills are available
 */
function getDefaultCourseRecommendations(): CourseRecommendation[] {
  console.log('[CourseSuggestionService] Returning default course recommendations');
  return [
    {
      title: 'Professional Resume Writing Masterclass',
      platform: 'Udemy',
      link: 'https://www.udemy.com/course/resume-writing/',
      level: 'All Levels',
      price: '$19.99',
      duration: '3 hours'
    },
    {
      title: 'Job Search Success: Getting Hired Fast',
      platform: 'Coursera',
      link: 'https://www.coursera.org/specializations/job-search-success',
      level: 'Beginner',
      price: 'Free with trial',
      duration: '4 weeks'
    },
    {
      title: 'Interview Preparation: Mastering Common Questions',
      platform: 'LinkedIn Learning',
      link: 'https://www.linkedin.com/learning/interview-master-class',
      level: 'Intermediate',
      price: 'Subscription',
      duration: '2 hours'
    },
    {
      title: 'Career Development: Building Your Professional Brand',
      platform: 'edX',
      link: 'https://www.edx.org/course/career-development-building-your-professional-brand',
      level: 'All Levels',
      price: 'Free audit',
      duration: '6 weeks'
    },
    {
      title: 'Technical Interview Preparation',
      platform: 'Pluralsight',
      link: 'https://www.pluralsight.com/courses/technical-interview-preparation',
      level: 'Intermediate',
      price: 'Subscription',
      duration: '4 hours'
    },
    {
      title: 'Networking Strategies for Career Success',
      platform: 'Skillshare',
      link: 'https://www.skillshare.com/classes/networking-strategies-for-career-success',
      level: 'Beginner',
      price: 'Subscription',
      duration: '1.5 hours'
    }
  ];
}

/**
 * Get available skills that have course suggestions
 */
export function getAvailableSkills(): string[] {
  return Object.keys(COMPREHENSIVE_COURSE_MAP).sort();
}

/**
 * Search for courses by skill name (case insensitive)
 */
export function searchCoursesBySkill(skillQuery: string): CourseRecommendation[] {
  const query = skillQuery.toLowerCase();
  const matchingSkills = Object.keys(COMPREHENSIVE_COURSE_MAP).filter(skill =>
    skill.toLowerCase().includes(query)
  );

  const allCourses: CourseRecommendation[] = [];
  matchingSkills.forEach(skill => {
    allCourses.push(...COMPREHENSIVE_COURSE_MAP[skill]);
  });

  return allCourses;
}

/**
 * Find YouTube courses for specific skills
 * Prioritizes free video content for each skill
 */
export function findYouTubeCourses(missingSkills: string[], count: number = 2): CourseRecommendation[] {
  console.log(`[CourseSuggestionService] Finding YouTube courses for skills:`, missingSkills);
  
  if (!missingSkills || missingSkills.length === 0) {
    return [];
  }
  
  const youtubeCourses: CourseRecommendation[] = [];
  const usedSkills = new Set<string>();
  
  // First pass - find direct YouTube matches with exact skill matches
  for (const missingSkill of missingSkills) {
    if (youtubeCourses.length >= count) {
      break;
    }
    
    const normalizedMissingSkill = missingSkill.toLowerCase().trim();
    
    // Try for exact matches first
    Object.entries(COMPREHENSIVE_COURSE_MAP).forEach(([skill, courses]) => {
      if (youtubeCourses.length >= count) {
        return;
      }
      
      const normalizedSkill = skill.toLowerCase();
      
      // Check for exact or close match
      if ((normalizedMissingSkill === normalizedSkill || 
           normalizedMissingSkill.includes(normalizedSkill) || 
           normalizedSkill.includes(normalizedMissingSkill)) && 
          !usedSkills.has(missingSkill)) {
        
        // Find YouTube courses for this skill
        const youtubeCoursesForSkill = courses.filter(course => 
          course.platform === 'YouTube' && course.price === 'Free'
        );
        
        if (youtubeCoursesForSkill.length > 0) {
          // Take the first YouTube course
          const course = youtubeCoursesForSkill[0];
          youtubeCourses.push({
            ...course,
            sourceType: 'YouTube',
            skillMatch: missingSkill
          });
          usedSkills.add(missingSkill);
        }
      }
    });
  }
  
  // Second pass - find partial matches for remaining skills
  for (const missingSkill of missingSkills) {
    if (youtubeCourses.length >= count) {
      break;
    }
    
    if (!usedSkills.has(missingSkill)) {
      const normalizedMissingSkill = missingSkill.toLowerCase().trim();
        // Add general related courses based on keyword matching
      let bestMatchFound = false;
      
      // Try to find any course with keywords related to the skill
      Object.entries(COMPREHENSIVE_COURSE_MAP).forEach(([skill, courses]) => {
        if (bestMatchFound || youtubeCourses.length >= count) return;
        
        const keywords = normalizedMissingSkill.split(/\s+/);
        const normalizedMapSkill = skill.toLowerCase();
        
        // Check if any keyword matches
        for (const keyword of keywords) {
          if (keyword.length > 3 && normalizedMapSkill.includes(keyword)) {
            // Find YouTube courses for this skill
            const youtubeCoursesForSkill = courses.filter(course => 
              course.platform === 'YouTube' && course.price === 'Free'
            );
            
            if (youtubeCoursesForSkill.length > 0) {
              // Take the first YouTube course
              const course = youtubeCoursesForSkill[0];
              youtubeCourses.push({
                ...course,
                sourceType: 'YouTube',
                skillMatch: missingSkill
              });
              usedSkills.add(missingSkill);
              bestMatchFound = true;
              break;
            }
          }
        }
      });
    }
  }
  
  // If we still didn't find enough YouTube courses, add general ones
  if (youtubeCourses.length < count) {
    const generalYouTubeCourses = [
      {
        title: 'How to Learn Any Skill Fast - 5 Proven Steps',
        platform: 'YouTube',
        link: 'https://www.youtube.com/watch?v=ZVO8Wt_PCgE',
        duration: '11 minutes',
        price: 'Free',
        sourceType: 'YouTube' as 'YouTube',
        skillMatch: 'Learning Strategies'
      },
      {
        title: 'How to Learn Anything... Fast - Josh Kaufman',
        platform: 'YouTube',
        link: 'https://www.youtube.com/watch?v=EtJy69cEOtQ',
        duration: '23 minutes',
        price: 'Free',
        sourceType: 'YouTube' as 'YouTube',
        skillMatch: 'Skill Development'
      },
      {
        title: 'How to Get a Job With No Experience',
        platform: 'YouTube',
        link: 'https://www.youtube.com/watch?v=F7CFI9loa5U',
        duration: '11 minutes',
        price: 'Free',
        sourceType: 'YouTube' as 'YouTube',
        skillMatch: 'Job Search Strategies'
      },
      {
        title: 'Top 10 Skills Employers Look For in 2025',
        platform: 'YouTube',
        link: 'https://www.youtube.com/watch?v=u8JKgX6Qf8w',
        duration: '15 minutes',
        price: 'Free',
        sourceType: 'YouTube' as 'YouTube',
        skillMatch: 'Career Development'
      }
    ];
    
    // Add enough general courses to reach desired count
    const remainingCount = count - youtubeCourses.length;
    youtubeCourses.push(...generalYouTubeCourses.slice(0, remainingCount));
  }
  
  return youtubeCourses;
}
