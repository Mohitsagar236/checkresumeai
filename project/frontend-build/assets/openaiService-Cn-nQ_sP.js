import{b as S}from"./api-auth-dsn4brwG.js";import{S as I,A}from"./groqService-BCUWlnQf.js";import{E as r}from"./heavy-pages-C8trrwvk.js";import"./vendor-x74MHN4I.js";import"./utilities-CaqBGVfY.js";import"./react-vendor-GyENwBWe.js";import"./pdfjs-Cev1TANf.js";import"./ui-components-C10pzA45.js";const f=async(n,c)=>{var o;console.log("[OpenAI Service] Analyzing resume with OpenAI API...");try{const i=n.text,u=n.sections,g=Object.entries(u).filter(([,s])=>s!==void 0&&s!=="").map(([s,e])=>`${s}: ${e}`).join(`

`),p=`Resume Content:
    ${i}

    Extracted Sections:
    ${g}

    Job Role: ${c}

    Please analyze this resume against the job role and provide a comprehensive analysis.
    
    IMPORTANT: Identify specific missing skills (at least 3-5) that would make this candidate more competitive for the job role.
    For each missing skill, suggest a relevant course - PRIORITIZE FREE YOUTUBE VIDEOS and online resources whenever possible.
    
    Make sure to include the "courseSuggestions" section in your response, with detailed course recommendations 
    including title, platform, link (use placeholder links if needed), level, and price information.
    
    The courseSuggestions must be provided in the following format:
    "courseSuggestions": [
      {
        "title": "Course Title",
        "platform": "Platform Name", 
        "link": "https://example.com/course",
        "level": "Beginner/Intermediate/Advanced",
        "price": "Free/Paid/$XX",
        "duration": "X hours/X weeks",
        "sourceType": "YouTube/OnlineCourse/Tutorial/Certification", 
        "skillMatch": "Name of the skill this addresses"
      },
      ...
    ]
    
    CRITICAL REQUIREMENTS FOR YOUR RECOMMENDATIONS:
    1. PRIORITIZE YouTube videos and free online resources when suggesting courses.
    2. At least 60% of your recommendations MUST be from YouTube specifically (not just any video platform).
    3. For each identified missing skill, first try to find a FREE YouTube video that teaches this skill.
    4. Use actual YouTube links rather than placeholders when possible.
    5. Include actual video duration when known (e.g., "45 minutes", "2 hours", etc.)
    6. For YouTube recommendations, ensure they are current (from the last 2-3 years if possible).
    7. For each recommendation, make sure to correctly identify which specific missing skill it addresses in the "skillMatch" field.
    
    COURSE SUGGESTIONS ARE REQUIRED IN YOUR RESPONSE. Even if you can't find specific courses, provide general course recommendations related to the job role and missing skills.
    `,m=await S.post("https://api.openai.com/v1/chat/completions",{model:"gpt-4-turbo",messages:[{role:"system",content:I},{role:"user",content:p}],temperature:.2,max_tokens:2048},{headers:{"Content-Type":"application/json",Authorization:`Bearer ${A.OPENAI_API_KEY}`},timeout:6e4});console.log("[OpenAI Service] Analysis completed successfully");const l=m.data;console.log("[OpenAI Service] Response tokens used:",((o=l.usage)==null?void 0:o.total_tokens)||"N/A");try{const s=l.choices[0].message.content,e=JSON.parse(s);e.courseSuggestions||(e.courseSuggestions=[]);const t=e.skillsAnalysis.missingSkills||[];console.log("[OpenAI Service] Generating course suggestions for missing skills:",t);try{if(!e.courseSuggestions||e.courseSuggestions.length===0)console.log("[OpenAI Service] No course suggestions from OpenAI, generating locally"),e.courseSuggestions=r(t,6);else if(console.log("[OpenAI Service] Using OpenAI provided course suggestions:",e.courseSuggestions.length),e.courseSuggestions.length<3){console.log("[OpenAI Service] Not enough OpenAI course suggestions, adding more locally");const a=r(t.filter(d=>!e.courseSuggestions.some(h=>h.title.toLowerCase().includes(d.toLowerCase()))),6-e.courseSuggestions.length);e.courseSuggestions=[...e.courseSuggestions,...a]}(!e.courseSuggestions||e.courseSuggestions.length===0)&&(console.log("[OpenAI Service] Still no course suggestions, using default recommendations"),e.courseSuggestions=r([],6))}catch(a){console.error("[OpenAI Service] Error generating course suggestions:",a),e.courseSuggestions=r(t.length>0?t:[],6)}return e}catch(s){throw console.error("[OpenAI Service] Failed to parse API response:",s),console.log("[OpenAI Service] Raw API response:",l.choices[0].message.content),new Error("Failed to parse OpenAI API response")}}catch(i){throw console.error("[OpenAI Service] Error analyzing resume with OpenAI:",i),i}},b=async(n,c)=>{try{return(await f(n,c)).atsCompatibilityScore}catch(o){return console.error("[OpenAI Service] Error getting ATS score:",o),65}};export{f as analyzeResumeWithOpenAI,b as getAtsScoreWithOpenAI};
