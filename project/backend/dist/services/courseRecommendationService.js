import { logger } from '../utils/logger.js';
const COURSE_DATABASE = [
    {
        id: 'js-fundamentals',
        title: 'JavaScript Fundamentals for Beginners',
        provider: 'Coursera',
        category: 'technical',
        difficulty: 'beginner',
        duration: '6 weeks',
        description: 'Learn the basics of JavaScript programming language',
        skills: ['JavaScript', 'Programming', 'Web Development'],
        rating: 4.8,
        reviewCount: 12543,
        price: { amount: 49, currency: 'USD', isFree: false },
        url: 'https://coursera.org/learn/javascript-fundamentals',
        imageUrl: 'https://via.placeholder.com/300x200?text=JavaScript'
    },
    {
        id: 'react-development',
        title: 'React.js Complete Course',
        provider: 'Udemy',
        category: 'technical',
        difficulty: 'intermediate',
        duration: '12 weeks',
        description: 'Master React.js for modern web development',
        skills: ['React', 'JavaScript', 'Frontend Development'],
        rating: 4.7,
        reviewCount: 8945,
        price: { amount: 89, currency: 'USD', isFree: false },
        url: 'https://udemy.com/course/react-complete',
        imageUrl: 'https://via.placeholder.com/300x200?text=React'
    },
    {
        id: 'python-data-science',
        title: 'Python for Data Science and Machine Learning',
        provider: 'edX',
        category: 'data',
        difficulty: 'intermediate',
        duration: '10 weeks',
        description: 'Learn Python programming for data science applications',
        skills: ['Python', 'Data Science', 'Machine Learning', 'Pandas', 'NumPy'],
        rating: 4.6,
        reviewCount: 15230,
        price: { amount: 99, currency: 'USD', isFree: false },
        url: 'https://edx.org/course/python-data-science',
        imageUrl: 'https://via.placeholder.com/300x200?text=Python+DS'
    },
    {
        id: 'project-management',
        title: 'Project Management Professional (PMP) Certification',
        provider: 'PMI',
        category: 'business',
        difficulty: 'advanced',
        duration: '16 weeks',
        description: 'Complete PMP certification preparation course',
        skills: ['Project Management', 'Leadership', 'Risk Management', 'Agile'],
        rating: 4.9,
        reviewCount: 5678,
        price: { amount: 299, currency: 'USD', isFree: false },
        url: 'https://pmi.org/certifications/project-management-pmp',
        imageUrl: 'https://via.placeholder.com/300x200?text=PMP'
    },
    {
        id: 'agile-scrum',
        title: 'Agile and Scrum Fundamentals',
        provider: 'Scrum Alliance',
        category: 'business',
        difficulty: 'beginner',
        duration: '4 weeks',
        description: 'Learn Agile methodologies and Scrum framework',
        skills: ['Agile', 'Scrum', 'Project Management', 'Team Leadership'],
        rating: 4.5,
        reviewCount: 3421,
        price: { amount: 0, currency: 'USD', isFree: true },
        url: 'https://scrumalliance.org/learn-about-scrum',
        imageUrl: 'https://via.placeholder.com/300x200?text=Agile+Scrum'
    },
    {
        id: 'ui-ux-design',
        title: 'UI/UX Design Complete Course',
        provider: 'Figma Academy',
        category: 'design',
        difficulty: 'intermediate',
        duration: '8 weeks',
        description: 'Master UI/UX design principles and tools',
        skills: ['UI Design', 'UX Design', 'Figma', 'Prototyping', 'User Research'],
        rating: 4.8,
        reviewCount: 7892,
        price: { amount: 79, currency: 'USD', isFree: false },
        url: 'https://figma.com/academy/ui-ux-design',
        imageUrl: 'https://via.placeholder.com/300x200?text=UI+UX'
    },
    {
        id: 'graphic-design',
        title: 'Graphic Design Masterclass',
        provider: 'Adobe',
        category: 'design',
        difficulty: 'beginner',
        duration: '6 weeks',
        description: 'Learn graphic design using Adobe Creative Suite',
        skills: ['Graphic Design', 'Adobe Photoshop', 'Adobe Illustrator', 'Typography'],
        rating: 4.7,
        reviewCount: 9876,
        price: { amount: 69, currency: 'USD', isFree: false },
        url: 'https://adobe.com/learn/graphic-design',
        imageUrl: 'https://via.placeholder.com/300x200?text=Graphic+Design'
    },
    {
        id: 'digital-marketing',
        title: 'Digital Marketing Complete Course',
        provider: 'Google',
        category: 'marketing',
        difficulty: 'beginner',
        duration: '12 weeks',
        description: 'Learn digital marketing strategies and tools',
        skills: ['Digital Marketing', 'SEO', 'Google Ads', 'Social Media Marketing', 'Analytics'],
        rating: 4.6,
        reviewCount: 23456,
        price: { amount: 0, currency: 'USD', isFree: true },
        url: 'https://learndigital.withgoogle.com/digitalmarketing',
        imageUrl: 'https://via.placeholder.com/300x200?text=Digital+Marketing'
    },
    {
        id: 'content-marketing',
        title: 'Content Marketing Strategy',
        provider: 'HubSpot',
        category: 'marketing',
        difficulty: 'intermediate',
        duration: '5 weeks',
        description: 'Master content marketing and strategy',
        skills: ['Content Marketing', 'Content Strategy', 'Copywriting', 'SEO'],
        rating: 4.5,
        reviewCount: 4567,
        price: { amount: 0, currency: 'USD', isFree: true },
        url: 'https://academy.hubspot.com/courses/content-marketing',
        imageUrl: 'https://via.placeholder.com/300x200?text=Content+Marketing'
    },
    {
        id: 'communication-skills',
        title: 'Effective Communication Skills',
        provider: 'LinkedIn Learning',
        category: 'personal',
        difficulty: 'beginner',
        duration: '3 weeks',
        description: 'Improve your communication and interpersonal skills',
        skills: ['Communication', 'Public Speaking', 'Interpersonal Skills', 'Presentation'],
        rating: 4.4,
        reviewCount: 8765,
        price: { amount: 29, currency: 'USD', isFree: false },
        url: 'https://linkedin.com/learning/communication-skills',
        imageUrl: 'https://via.placeholder.com/300x200?text=Communication'
    },
    {
        id: 'leadership-fundamentals',
        title: 'Leadership Fundamentals',
        provider: 'MasterClass',
        category: 'personal',
        difficulty: 'intermediate',
        duration: '4 weeks',
        description: 'Develop essential leadership skills',
        skills: ['Leadership', 'Team Management', 'Decision Making', 'Emotional Intelligence'],
        rating: 4.7,
        reviewCount: 3456,
        price: { amount: 180, currency: 'USD', isFree: false },
        url: 'https://masterclass.com/classes/leadership-fundamentals',
        imageUrl: 'https://via.placeholder.com/300x200?text=Leadership'
    }
];
const JOB_ROLE_SKILLS = {
    'frontend-developer': ['JavaScript', 'React', 'Vue', 'Angular', 'HTML', 'CSS', 'TypeScript', 'UI Design'],
    'backend-developer': ['Node.js', 'Python', 'Java', 'C#', 'Database', 'API Development', 'Cloud Computing'],
    'full-stack-developer': ['JavaScript', 'React', 'Node.js', 'Database', 'API Development', 'DevOps'],
    'data-scientist': ['Python', 'R', 'Machine Learning', 'Statistics', 'SQL', 'Data Visualization'],
    'product-manager': ['Product Management', 'Agile', 'User Research', 'Analytics', 'Leadership'],
    'ui-ux-designer': ['UI Design', 'UX Design', 'Figma', 'User Research', 'Prototyping', 'Usability Testing'],
    'digital-marketer': ['Digital Marketing', 'SEO', 'Google Ads', 'Social Media Marketing', 'Analytics'],
    'project-manager': ['Project Management', 'Agile', 'Scrum', 'Leadership', 'Risk Management'],
    'business-analyst': ['Business Analysis', 'SQL', 'Excel', 'Data Analysis', 'Process Improvement'],
    'general': ['Communication', 'Leadership', 'Problem Solving', 'Time Management', 'Teamwork']
};
export const generateCourseRecommendations = async (request) => {
    logger.info(`Generating course recommendations for user: ${request.userId}`);
    const { jobRole = 'general', analysisData, skillsGap, category, limit = 10 } = request;
    let targetSkills = [];
    if (skillsGap && skillsGap.length > 0) {
        targetSkills = skillsGap;
    }
    else if (analysisData) {
        targetSkills = analysisData.skillsAnalysis.missingSkills;
    }
    else if (JOB_ROLE_SKILLS[jobRole]) {
        targetSkills = JOB_ROLE_SKILLS[jobRole];
    }
    else {
        targetSkills = JOB_ROLE_SKILLS.general || [];
    }
    let filteredCourses = category
        ? COURSE_DATABASE.filter(course => course.category === category)
        : COURSE_DATABASE;
    const recommendations = filteredCourses.map(course => {
        const relevanceScore = calculateRelevanceScore(course, targetSkills, analysisData);
        const reasons = generateReasons(course, targetSkills, analysisData);
        return {
            ...course,
            relevanceScore,
            reasons
        };
    });
    const sortedRecommendations = recommendations
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit);
    logger.info(`Generated ${sortedRecommendations.length} course recommendations`);
    return sortedRecommendations;
};
const calculateRelevanceScore = (course, targetSkills, analysisData) => {
    let score = 0;
    const skillMatches = course.skills.filter(skill => targetSkills.some(targetSkill => skill.toLowerCase().includes(targetSkill.toLowerCase()) ||
        targetSkill.toLowerCase().includes(skill.toLowerCase()))).length;
    score += (skillMatches / course.skills.length) * 40;
    score += (course.rating / 5) * 20;
    const reviewScore = Math.min(course.reviewCount / 10000, 1) * 10;
    score += reviewScore;
    if (course.price.isFree) {
        score += 5;
    }
    if (analysisData) {
        const userLevel = analysisData.overallScore;
        let difficultyScore = 0;
        if (userLevel < 60 && course.difficulty === 'beginner')
            difficultyScore = 15;
        else if (userLevel >= 60 && userLevel < 80 && course.difficulty === 'intermediate')
            difficultyScore = 15;
        else if (userLevel >= 80 && course.difficulty === 'advanced')
            difficultyScore = 15;
        else
            difficultyScore = 5;
        score += difficultyScore;
    }
    else {
        score += 10;
    }
    const reputableProviders = ['Google', 'Microsoft', 'Amazon', 'Coursera', 'edX', 'LinkedIn Learning'];
    if (reputableProviders.includes(course.provider)) {
        score += 10;
    }
    return Math.min(Math.round(score), 100);
};
const generateReasons = (course, targetSkills, analysisData) => {
    const reasons = [];
    const matchingSkills = course.skills.filter(skill => targetSkills.some(targetSkill => skill.toLowerCase().includes(targetSkill.toLowerCase()) ||
        targetSkill.toLowerCase().includes(skill.toLowerCase())));
    if (matchingSkills.length > 0) {
        reasons.push(`Covers ${matchingSkills.length} skill${matchingSkills.length > 1 ? 's' : ''} you need: ${matchingSkills.slice(0, 3).join(', ')}`);
    }
    if (course.rating >= 4.5) {
        reasons.push(`Highly rated (${course.rating}/5) with ${course.reviewCount.toLocaleString()} reviews`);
    }
    if (course.price.isFree) {
        reasons.push('Free course - great for getting started');
    }
    else if (course.price.amount < 50) {
        reasons.push('Affordable price point');
    }
    if (analysisData) {
        const userLevel = analysisData.overallScore;
        if (userLevel < 60 && course.difficulty === 'beginner') {
            reasons.push('Perfect for building foundational skills');
        }
        else if (userLevel >= 60 && userLevel < 80 && course.difficulty === 'intermediate') {
            reasons.push('Ideal for your current skill level');
        }
        else if (userLevel >= 80 && course.difficulty === 'advanced') {
            reasons.push('Advanced course to further develop your expertise');
        }
    }
    const reputableProviders = ['Google', 'Microsoft', 'Amazon', 'Coursera', 'edX'];
    if (reputableProviders.includes(course.provider)) {
        reasons.push(`Offered by reputable provider: ${course.provider}`);
    }
    const durationWeeks = course.duration ? parseInt(course.duration.split(' ')[0] || '0') : 0;
    if (durationWeeks <= 4 && durationWeeks > 0) {
        reasons.push('Quick to complete - fits busy schedules');
    }
    else if (durationWeeks >= 12) {
        reasons.push('Comprehensive course with in-depth coverage');
    }
    return reasons.slice(0, 3);
};
