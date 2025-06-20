import{b as T}from"./api-auth-dsn4brwG.js";import{t as _,E as I}from"./heavy-pages-C8trrwvk.js";const l={OPENAI_API_BASE_URL:"https://api.openai.com/v1",GROQ_API_BASE_URL:"https://api.groq.com/openai/v1",TOGETHER_API_BASE_URL:"https://api.together.xyz/v1",OPENAI_RESUME_ANALYSIS_MODEL:"gpt-4-turbo",RESUME_ANALYSIS_MODEL:"mixtral-8x7b-32768",TOGETHER_RESUME_ANALYSIS_MODEL:"meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",OPENAI_API_KEY:"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",GROQ_API_KEY:"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",TOGETHER_API_KEY:"f6b93dd221b9b1cfabb27ac0a54c5de0fe3d4a9342d9892c462760e8a0555946",PRIMARY_API_PROVIDER:"openai",API_TIMEOUT:6e4,SKILLS_ANALYSIS_TIMEOUT:45e3,MAX_RETRIES:3,RETRY_DELAY:2e3},O=`
You are an expert resume analyst and career advisor. Your task is to analyze the provided resume text and extract key information, 
matching it against the specified job role. Provide detailed feedback on how well the resume matches the job requirements, 
identify potential improvements, and give an overall score. 

You MUST format your response as a valid JSON object with the following structure:

{
  "atsCompatibilityScore": number (0-100),
  "keywordMatches": {
    "matched": string[],
    "missing": string[],
    "totalScore": number (0-100)
  },
  "contentStructure": {
    "hasSummary": boolean,
    "hasSkills": boolean,
    "hasExperience": boolean,
    "hasEducation": boolean,
    "formattingScore": number (0-100),
    "suggestions": string[]
  },
  "skillsAnalysis": {
    "relevantSkills": string[],
    "missingSkills": string[],
    "skillsScore": number (0-100)
  },
  "experienceRelevance": {
    "relevanceScore": number (0-100),
    "feedback": string[]
  },
  "improvementRecommendations": string[],
  "writingStyleAnalysis": {
    "clarity": number (0-100),
    "actionVerbs": boolean,
    "quantification": boolean,
    "suggestions": string[]
  },
  "courseSuggestions": [
    {
      "title": string,
      "platform": string,
      "link": string,
      "level": "Beginner" | "Intermediate" | "Advanced",
      "price": "Free" | "Paid" | "Freemium"
    }
  ],
  "overallScore": number (0-100)
}

For courseSuggestions, recommend 3-6 relevant courses from platforms like:
- YouTube (free tutorials)
- Coursera (university courses, certificates)
- Udemy (practical skills courses)
- edX (university courses)
- LinkedIn Learning (professional skills)
- Pluralsight (technical skills)
- Codecademy (programming)
- Khan Academy (fundamentals)

Base the course suggestions on the missing skills identified in skillsAnalysis.missingSkills and areas needing improvement.
Prioritize a mix of free and paid resources across different platforms.

Remember to provide actionable and specific feedback, focusing on realistic improvements the candidate can make.
`,F=(t,i)=>{var E,A,b,v;const n=_.find(L=>L.title.toLowerCase()===i.toLowerCase())||_[0],r=!!((E=t.sections.education)!=null&&E.length),e=!!((A=t.sections.skills)!=null&&A.length),u=!!((b=t.sections.experience)!=null&&b.length),c=!!((v=t.sections.summary)!=null&&v.length),o=Math.floor(Math.random()*30)+70,s=Math.floor(Math.random()*40)+60,a=Math.floor(Math.random()*30)+70,h=Math.floor(Math.random()*25)+75,M=Math.floor(Math.random()*20)+80,g=Math.floor(o*.2+s*.3+a*.3+h*.2),p=[...n.keywords,...n.requiredSkills],m=Math.floor(s/100*p.length),f=[...p].sort(()=>.5-Math.random()),R=f.slice(0,m),w=f.slice(m,m+5),S=[...n.requiredSkills],d=Math.floor(a/100*S.length),y=[...S].sort(()=>.5-Math.random()),P=y.slice(0,d),k=y.slice(d,d+4),x=I(k,6);return{atsCompatibilityScore:g,keywordMatches:{matched:R,missing:w,totalScore:s},contentStructure:{hasSummary:c,hasSkills:e,hasExperience:u,hasEducation:r,formattingScore:o,suggestions:U(c,e,u,r)},skillsAnalysis:{relevantSkills:P,missingSkills:k,skillsScore:a},experienceRelevance:{relevanceScore:h,feedback:["Your experience appears relevant to the job role.","Consider highlighting more specific achievements with metrics.","Focus more on recent work that directly relates to the target position."]},improvementRecommendations:["Add more industry-specific keywords throughout your resume.","Quantify your achievements with specific metrics and results.","Tailor your summary to highlight experience most relevant to the target role.","Include a skills section with both technical and soft skills.","Ensure consistent formatting throughout your document."],writingStyleAnalysis:{clarity:M,actionVerbs:Math.random()>.3,quantification:Math.random()>.5,suggestions:["Use more powerful action verbs to start bullet points.","Include specific metrics and numbers to quantify achievements.","Keep bullet points concise and focused on results."]},courseSuggestions:x,overallScore:g}};function U(t,i,n,r){const e=[];return t||e.push("Add a professional summary at the top of your resume to highlight your key qualifications."),i||e.push("Include a dedicated skills section to showcase technical and soft skills relevant to the position."),n||e.push("Expand your work experience section with detailed descriptions of your responsibilities and achievements."),r||e.push("Add an education section with your degrees, certifications, and relevant coursework."),e.length===0&&e.push("Your resume has all the essential sections, but consider enhancing each section with more targeted content."),e}const N=async(t,i)=>{var n;try{console.log("Analyzing resume for job role:",i);const r=`
      Job Role: ${i}
      
      Resume Text:
      ${t.text}
      
      Sections:      ${Object.entries(t.sections).filter(([,s])=>s).map(([s,a])=>`${s.toUpperCase()}: ${a}`).join(`

`)}
    `,c=(await T.post(`${l.GROQ_API_BASE_URL}/chat/completions`,{model:l.RESUME_ANALYSIS_MODEL,messages:[{role:"system",content:O},{role:"user",content:r}],temperature:.1,max_tokens:2048},{headers:{Authorization:`Bearer ${l.GROQ_API_KEY}`,"Content-Type":"application/json"},timeout:l.API_TIMEOUT})).data.choices[0].message.content;let o;try{o=JSON.parse(c)}catch(s){throw console.error("Failed to parse API response as JSON:",s),new Error("Failed to parse analysis results")}if(!o.courseSuggestions||o.courseSuggestions.length===0){console.log("Enhancing course suggestions using comprehensive course service");const s=((n=o.skillsAnalysis)==null?void 0:n.missingSkills)||[];o.courseSuggestions=I(s,6)}return o}catch(r){throw console.error("Error analyzing resume:",r),new Error("Failed to analyze resume. Please try again later.")}};export{l as A,O as S,N as a,F as g};
