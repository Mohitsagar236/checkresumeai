// Test script to validate token estimation and truncation functions
// Run with: node test-token-estimation.js

// Sample resume content for testing
const sampleResumeContent = `
John Doe
Software Engineer

Contact Information:
Email: john.doe@email.com
Phone: (555) 123-4567
Location: San Francisco, CA

Summary:
Experienced software engineer with 5+ years of experience in full-stack development. 
Proficient in JavaScript, TypeScript, React, Node.js, and cloud technologies. 
Strong background in building scalable web applications and microservices architecture.

Technical Skills:
- Programming Languages: JavaScript, TypeScript, Python, Java
- Frontend: React, Vue.js, HTML5, CSS3, Tailwind CSS
- Backend: Node.js, Express.js, NestJS, Django
- Databases: PostgreSQL, MongoDB, Redis
- Cloud: AWS, Google Cloud Platform, Docker, Kubernetes
- Tools: Git, VS Code, Jira, Slack

Professional Experience:

Senior Software Engineer | TechCorp Inc. | 2021 - Present
• Lead development of customer-facing web applications serving 100k+ users
• Architected and implemented microservices using Node.js and Docker
• Improved application performance by 40% through code optimization
• Mentored junior developers and conducted code reviews
• Collaborated with product team to define technical requirements

Software Engineer | StartupXYZ | 2019 - 2021
• Developed responsive web applications using React and Redux
• Built RESTful APIs using Express.js and PostgreSQL
• Implemented automated testing with Jest and Cypress
• Participated in agile development process and sprint planning
• Reduced deployment time by 60% through CI/CD pipeline automation

Education:
Bachelor of Science in Computer Science
University of California, Berkeley | 2015 - 2019
GPA: 3.8/4.0

Projects:
E-commerce Platform | Personal Project
• Built full-stack e-commerce application with React and Node.js
• Implemented secure payment processing with Stripe API
• Used AWS S3 for image storage and CloudFront for CDN

Task Management App | Team Project
• Developed collaborative task management application
• Used WebSocket for real-time updates and notifications
• Implemented user authentication and authorization

Certifications:
- AWS Certified Solutions Architect Associate (2022)
- Google Cloud Platform Professional Developer (2023)

Languages:
- English (Native)
- Spanish (Conversational)
- Mandarin (Basic)
`;

// Simulate the token estimation function
function estimateTokenCount(text) {
  if (!text) return 0;
  const words = text.trim().split(/\s+/).length;
  const baseTokens = Math.ceil(words * 0.75);
  return Math.ceil(baseTokens * 1.2);
}

// Test the estimation
const tokenCount = estimateTokenCount(sampleResumeContent);
const characterCount = sampleResumeContent.length;
const wordCount = sampleResumeContent.trim().split(/\s+/).length;

console.log('=== Token Estimation Test ===');
console.log(`Character count: ${characterCount}`);
console.log(`Word count: ${wordCount}`);
console.log(`Estimated tokens: ${tokenCount}`);
console.log(`Tokens per word: ${(tokenCount / wordCount).toFixed(2)}`);
console.log(`Characters per token: ${(characterCount / tokenCount).toFixed(2)}`);

// Test different content sizes
const testSizes = [1000, 5000, 10000, 15000, 20000];
testSizes.forEach(size => {
  const truncatedContent = sampleResumeContent.substring(0, size);
  const tokens = estimateTokenCount(truncatedContent);
  const words = truncatedContent.trim().split(/\s+/).length;
  
  console.log(`\\n--- Content size: ${size} chars ---`);
  console.log(`Words: ${words}`);
  console.log(`Estimated tokens: ${tokens}`);
  console.log(`Chars/token ratio: ${(size / tokens).toFixed(2)}`);
});

console.log('\\n=== Test Complete ===');
console.log('If token estimates seem reasonable (400-600 tokens for this sample), the fix is working correctly.');
