import { ParsedResumeData, JobMatch } from '../../types/jobs';

// Mock job data since we don't have actual API keys for job boards
const MOCK_JOBS: JobMatch[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA (Remote)',
    description: 'We are looking for a skilled Frontend Developer with experience in React, TypeScript and modern CSS frameworks. The ideal candidate will have 4+ years of experience building responsive web applications.',
    applyUrl: 'https://example.com/jobs/frontend-developer',
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Redux', 'Jest'],
    matchPercentage: 95,
    salary: '$120,000 - $150,000',
    datePosted: '2025-06-01',
    jobType: 'Full-time'
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'InnovateTech',
    location: 'New York, NY (Hybrid)',
    description: 'Join our dynamic team building cutting-edge web applications. You will work on both frontend and backend development using Node.js, React, and MongoDB.',
    applyUrl: 'https://example.com/jobs/full-stack-developer',
    skills: ['JavaScript', 'Node.js', 'React', 'MongoDB', 'Express', 'AWS'],
    matchPercentage: 88,
    salary: '$110,000 - $140,000',
    datePosted: '2025-05-28',
    jobType: 'Full-time'
  },
  {
    id: '3',
    title: 'Backend Engineer',
    company: 'DataSystems Inc.',
    location: 'Remote',
    description: 'We are seeking an experienced Backend Engineer to design and implement scalable APIs and services. Experience with distributed systems and cloud platforms is required.',
    applyUrl: 'https://example.com/jobs/backend-engineer',
    skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS', 'Microservices'],
    matchPercentage: 82,
    datePosted: '2025-06-03',
    jobType: 'Full-time'
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'CloudScale Solutions',
    location: 'Austin, TX (On-site)',
    description: 'Looking for a DevOps engineer to help automate and optimize our deployment processes. Experience with CI/CD pipelines, Kubernetes, and major cloud platforms is essential.',
    applyUrl: 'https://example.com/jobs/devops-engineer',
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Terraform', 'Linux'],
    matchPercentage: 75,
    salary: '$130,000 - $160,000',
    datePosted: '2025-05-25',
    jobType: 'Full-time'
  },
  {
    id: '5',
    title: 'UX/UI Designer',
    company: 'CreativeMinds Agency',
    location: 'Remote',
    description: 'Join our design team to create beautiful and intuitive user interfaces. You will work closely with product managers and developers to deliver exceptional user experiences.',
    applyUrl: 'https://example.com/jobs/ux-ui-designer',
    skills: ['Figma', 'Adobe XD', 'User Research', 'Wireframing', 'Prototyping', 'UI Design'],
    matchPercentage: 70,
    salary: '$100,000 - $130,000',
    datePosted: '2025-06-05',
    jobType: 'Full-time'
  }
];

/**
 * In a real application, this function would connect to actual job board APIs
 * For example:
 * - Indeed API
 * - LinkedIn API
 * - ZipRecruiter API
 * - Remote.co API
 */
export async function fetchJobMatches(resumeData: ParsedResumeData): Promise<JobMatch[]> {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  try {
    // In a real implementation, we would:
    // 1. Format the resume data for the API request
    // 2. Call the appropriate job board API
    // 3. Process and normalize the results
    
    // For this demo, we'll use the mock data and filter based on skills match
    const { skills, jobTitles } = resumeData;
    
    if (!skills.length) {
      return [];
    }
    
    // Filter and rank jobs based on skills and job titles match
    const matchedJobs = MOCK_JOBS.map(job => {
      // Calculate match percentage based on skills overlap
      const matchingSkills = job.skills.filter(skill => 
        skills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
      );
      
      const skillMatchScore = matchingSkills.length / job.skills.length * 100;
      
      // Boost score if job title matches user's experience
      const titleMatchBoost = jobTitles.some(title => 
        job.title.toLowerCase().includes(title.toLowerCase())
      ) ? 15 : 0;
      
      // Calculate final match percentage (never exceed 100%)
      const matchPercentage = Math.min(Math.round(skillMatchScore + titleMatchBoost), 100);
      
      return {
        ...job,
        matchPercentage
      };
    });
    
    // Sort by match percentage (descending)
    return matchedJobs
      .filter(job => job.matchPercentage > 0)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  } catch (error) {
    console.error('Error fetching job matches:', error);
    throw new Error('Failed to fetch job matches');
  }
}
