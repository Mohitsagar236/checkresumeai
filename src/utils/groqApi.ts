import { AnalysisResult, SkillsGap } from '../types';
import { generateMockAnalysis } from '../data/mockData';
import { apiCache, createCacheKey } from './cache';

// API endpoints and constants
const GROQ_API_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
// const GROQ_MODELS_ENDPOINT = 'https://api.groq.com/openai/v1/models';
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

// Type definitions for API responses
interface GroqModel {
  id: string;
  // Add other model properties as needed
}

interface GroqApiResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  data?: Array<GroqModel>;
}

// Model configuration
const MODEL_CONFIG = {
  primaryId: 'llama-3.3-70b-versatile',
  fallbackId: 'llama3-70b-8192' // Fallback model if primary is unavailable
};

// Cache options
const CACHE_OPTIONS = {
  RESUME_ANALYSIS: { ttl: 24 * 60 * 60 * 1000 }, // 24 hours
  ATS_SCORE: { ttl: 24 * 60 * 60 * 1000 },       // 24 hours
  SKILLS_ANALYSIS: { ttl: 24 * 60 * 60 * 1000 }  // 24 hours
};

// Max retries
const MAX_RETRIES = 3;

// Token limits configuration
const TOKEN_LIMITS = {
  MAX_TOKENS_PER_REQUEST: 6000,  // Increased back to more reasonable limit with better estimation
  MAX_RESPONSE_TOKENS: 2000,     // Reserve tokens for the response
  SYSTEM_MESSAGE_TOKENS: 100,    // Approximate tokens for system message
  CONTEXT_TOKENS: 200,           // Tokens for additional context/formatting
  MAX_REQUEST_SIZE: 32768,       // 32KB max request size to prevent 431 errors
};

// Rate limiting configuration
const RATE_LIMITS = {
  TOKENS_PER_MINUTE: 12000,      // 12k TPM limit from Groq
  REQUESTS_PER_MINUTE: 50,       // 50 RPM limit from Groq
  MIN_BACKOFF: 2000,             // 2 seconds initial backoff
  MAX_BACKOFF: 300000,           // 5 minutes maximum backoff
  JITTER_MAX: 2000,              // Maximum random delay to add
  COOLDOWN_PERIOD: 60000         // 1 minute cooldown period
};

// Rate limiting state
interface RateLimitState {
  tokens: number;
  requests: number;
  resetTime: number;
  lastRequestTime: number;
  consecutiveFailures: number;
}

// Global rate limit state
const rateLimitState: RateLimitState = {
  tokens: 0,
  requests: 0,
  resetTime: Date.now(),
  lastRequestTime: 0,
  consecutiveFailures: 0
};

// Utility function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Utility function to delay execution with jitter
const delayWithJitter = async (baseDelay: number) => {
  const jitter = Math.random() * RATE_LIMITS.JITTER_MAX;
  await delay(baseDelay + jitter);
};

// Calculate exponential backoff time with jitter
const getBackoffTime = (consecutiveFailures: number): number => {
  const backoff = Math.min(
    RATE_LIMITS.MAX_BACKOFF,
    RATE_LIMITS.MIN_BACKOFF * Math.pow(2, consecutiveFailures)
  );
  return backoff + (Math.random() * RATE_LIMITS.JITTER_MAX);
};

/**
 * Check and handle rate limits with exponential backoff
 */
const checkRateLimit = async (tokenCount: number): Promise<void> => {
  const now = Date.now();
  
  // Reset counters if cooldown period has passed
  if (now - rateLimitState.resetTime >= RATE_LIMITS.COOLDOWN_PERIOD) {
    rateLimitState.tokens = 0;
    rateLimitState.requests = 0;
    rateLimitState.resetTime = now;
    rateLimitState.consecutiveFailures = 0;
  }

  // Enforce minimum delay between requests based on consecutive failures
  const timeSinceLastRequest = now - rateLimitState.lastRequestTime;
  const minDelay = rateLimitState.consecutiveFailures > 0 
    ? getBackoffTime(rateLimitState.consecutiveFailures)
    : 0;
    
  if (timeSinceLastRequest < minDelay) {
    const waitTime = minDelay - timeSinceLastRequest;
    console.log(`Applying backoff delay of ${waitTime}ms (failures: ${rateLimitState.consecutiveFailures})`);
    await delayWithJitter(waitTime);
  }

  // Check rate limits
  if (rateLimitState.tokens + tokenCount > RATE_LIMITS.TOKENS_PER_MINUTE ||
      rateLimitState.requests + 1 > RATE_LIMITS.REQUESTS_PER_MINUTE) {
    const waitTime = RATE_LIMITS.COOLDOWN_PERIOD - (now - rateLimitState.resetTime);
    console.log(`Rate limit approaching, waiting ${waitTime}ms`);
    await delayWithJitter(waitTime);
    
    // Reset counters after waiting
    rateLimitState.tokens = tokenCount;
    rateLimitState.requests = 1;
    rateLimitState.resetTime = Date.now();
  } else {
    rateLimitState.tokens += tokenCount;
    rateLimitState.requests += 1;
  }
  
  rateLimitState.lastRequestTime = Date.now();
};

/**
 * More accurate token count estimation (more reasonable estimation)
 */
const estimateTokenCount = (text: string): number => {
  if (!text) return 0;
  // More reasonable estimation: ~0.75 tokens per word (typical for English text)
  // This accounts for the fact that GPT tokens are often subwords
  const words = text.trim().split(/\s+/).length;
  const baseTokens = Math.ceil(words * 0.75);
  // Add 20% overhead for JSON formatting and system messages
  return Math.ceil(baseTokens * 1.2);
};

/**
 * Estimate request size in bytes
 */
const estimateRequestSize = (content: string): number => {
  // Estimate the full request size including headers and JSON structure
  const baseRequestSize = 500; // Approximate size of headers and JSON structure
  return baseRequestSize + new TextEncoder().encode(content).length;
};

/**
 * Aggressively truncate content to fit within token limits
 */
const truncateContentToTokenLimit = (content: string, maxTokens: number): string => {
  if (!content) return content;
  
  let truncated = content;
  const currentTokens = estimateTokenCount(truncated);
  
  // If content is already within limits, return as-is
  if (currentTokens <= maxTokens) {
    return truncated;
  }
  
  console.log(`Content too large: ${currentTokens} tokens (max: ${maxTokens}), truncating...`);
  
  // First, try to truncate at paragraph boundaries
  const paragraphs = truncated.split(/\n\s*\n/);
  while (paragraphs.length > 1 && estimateTokenCount(paragraphs.join('\n\n')) > maxTokens) {
    paragraphs.pop();
  }
  truncated = paragraphs.join('\n\n');
  
  // If still too large, try sentence boundaries
  if (estimateTokenCount(truncated) > maxTokens) {
    const sentences = truncated.split(/[.!?]+\s+/);
    while (sentences.length > 1 && estimateTokenCount(sentences.join('. ')) > maxTokens) {
      sentences.pop();
    }
    truncated = sentences.join('. ') + '.';
  }
  
  // Final fallback: character-based truncation
  while (estimateTokenCount(truncated) > maxTokens && truncated.length > 100) {
    truncated = truncated.substring(0, Math.floor(truncated.length * 0.9));
  }
  
  const finalTokens = estimateTokenCount(truncated);
  console.log(`Truncated from ${currentTokens} to ${finalTokens} tokens`);
  
  return truncated;
};

/**
 * Truncate content to fit within byte size limits (for request size)
 */
const truncateContentToSize = (content: string, maxSize: number): string => {
  if (!content) return content;
  
  let truncated = content;
  
  // If content is too large, truncate it intelligently
  while (estimateRequestSize(truncated) > maxSize && truncated.length > 100) {
    // Try to truncate at sentence boundaries first
    const sentences = truncated.split(/[.!?]+/);
    if (sentences.length > 1) {
      sentences.pop(); // Remove last sentence
      truncated = sentences.join('.') + '.';
    } else {
      // If no sentence boundaries, truncate by percentage
      truncated = truncated.substring(0, Math.floor(truncated.length * 0.8));
    }
  }
  
  return truncated;
};

/**
 * Split text into chunks that fit within token limits
 */
const splitTextIntoChunks = (text: string, maxTokens: number): string[] => {
  if (!text) return [];
  
  const chunks: string[] = [];
  const words = text.split(/\s+/);
  let currentChunk: string[] = [];
  let currentTokens = 0;

  for (const word of words) {
    const wordTokens = estimateTokenCount(word);
    
    if (currentTokens + wordTokens > maxTokens) {
      chunks.push(currentChunk.join(' '));
      currentChunk = [word];
      currentTokens = wordTokens;
    } else {
      currentChunk.push(word);
      currentTokens += wordTokens;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '));
  }

  return chunks;
};

/**
 * Ensure the response is valid JSON or extract JSON from text
 */
const ensureValidJson = (response: string): string => {
  try {
    // Check if it's already valid JSON
    JSON.parse(response);
    return response;
  } catch {
    // Try to extract JSON from the response
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const extracted = jsonMatch[0];
        // Validate extracted content
        JSON.parse(extracted);
        return extracted;
      }
      
      // If response has a score but not in JSON format
      if (response.match(/\d+/)) {
        const score = parseInt(response.match(/\d+/)?.[0] || '65');
        return JSON.stringify({ score: isNaN(score) ? 65 : score });
      }
    } catch (innerError) {
      console.error('Failed to extract JSON from response:', innerError);
    }
    
    // Create fallback JSON if extraction failed
    return JSON.stringify({ error: "Invalid JSON response", originalResponse: response });
  }
};

/**
 * Validate Groq model availability (currently unused but kept for future use)
 */
// const validateModel = async (modelId: string): Promise<boolean> => {
//   try {
//     const response = await fetch(GROQ_MODELS_ENDPOINT, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${GROQ_API_KEY}`
//       }
//     });

//     if (!response.ok) {
//       console.warn('Failed to fetch Groq models:', await response.text());
//       return true; // Assume model is valid if we can't check
//     }

//     const data = await response.json();
//     return data.data?.some((model: { id: string }) => model.id === modelId) ?? true;
//   } catch (error) {
//     console.warn('Error validating Groq model:', error);
//     return true; // Assume model is valid if we can't check
//   }
// };

/**
 * Process a single chunk of text
 */
const processChunk = async (chunk: string, modelId: string, cacheOptions: typeof CACHE_OPTIONS.RESUME_ANALYSIS): Promise<string> => {
  const cacheKey = createCacheKey('groq', `${modelId}:${chunk}`);
  
  return apiCache.get<string>(cacheKey, async () => {
    let lastError: Error | null = null;
    
    // Validate request size before processing
    const validation = REQUEST_MONITORING.validateRequestSize(chunk);
    if (!validation.isValid) {
      throw new Error(validation.message || 'Request too large');
    }
      // Ensure chunk doesn't exceed size limits
    const processedChunk = truncateContentToSize(chunk, TOKEN_LIMITS.MAX_REQUEST_SIZE);
    if (processedChunk !== chunk) {
      console.log(`Truncated chunk from ${chunk.length} to ${processedChunk.length} characters to prevent 431 error`);
    }
    
    // Log request details
    const tokenCount = estimateTokenCount(processedChunk);
    REQUEST_MONITORING.logRequest(validation.size, tokenCount, 'Processing chunk');
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`Groq API attempt ${attempt}/${MAX_RETRIES} using model ${modelId}`);
        
        // Add exponential backoff between retries
        if (attempt > 1) {
          const backoffTime = getBackoffTime(rateLimitState.consecutiveFailures);
          await delay(backoffTime);
        }
        
        // Prepare request body
        const requestBody = JSON.stringify({
          model: modelId,
          messages: [
            {
              role: "system",
              content: "You are an AI assistant specialized in resume analysis and ATS optimization. You must respond in JSON format."
            },
            {
              role: "user",
              content: processedChunk + "\n\nRespond with valid JSON format."
            }
          ],
          temperature: 0.1,
          max_tokens: TOKEN_LIMITS.MAX_RESPONSE_TOKENS,
          response_format: { type: "json_object" }
        });

        // Final check on request body size
        const requestSize = estimateRequestSize(requestBody);
        if (requestSize > TOKEN_LIMITS.MAX_REQUEST_SIZE) {
          throw new Error(`Request body too large: ${requestSize} bytes. Consider using shorter content.`);
        }
        
        // Make the request with rate limiting
        const response = await fetch(GROQ_API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'User-Agent': 'ResumeAnalyzer/1.0',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          },
          body: requestBody
        });

        // Handle rate limiting responses
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('retry-after') || '60', 10);
          rateLimitState.consecutiveFailures++;
          const errorText = await response.text();
          throw new Error(`429 Too Many Requests: ${errorText}. Retry after ${retryAfter}s`);
        }

        // Handle 431 error specifically
        if (response.status === 431) {
          const errorText = await response.text();
          console.error(`[431 Error] Request size: ${requestSize} bytes, Chunk size: ${processedChunk.length} chars`);
          throw new Error(`431 Request Header Fields Too Large: ${errorText}. Request size: ${requestSize} bytes`);
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Groq API returned ${response.status}: ${errorText}`);
        }

        const data = await response.json() as GroqApiResponse;
        
        if (!data.choices?.[0]?.message?.content) {
          throw new Error('Invalid response format from Groq API');
        }

        // Reset failure counter on success
        rateLimitState.consecutiveFailures = 0;
        return data.choices[0].message.content;

      } catch (error) {
        lastError = error as Error;
        console.error(`Groq API attempt ${attempt} failed:`, error);
        
        // For rate limit errors, apply exponential backoff
        if (error instanceof Error && error.message.includes('429')) {
          const backoffTime = getBackoffTime(rateLimitState.consecutiveFailures);
          console.log(`Rate limit hit, backing off for ${backoffTime / 1000} seconds`);
          await delay(backoffTime);
          continue;
        }
        
        // For 431 errors, try to reduce content size further
        if (error instanceof Error && error.message.includes('431')) {
          console.error('Request headers too large, content may need to be reduced further');
          rateLimitState.consecutiveFailures++;
          // Don't retry for 431 errors as the content is fundamentally too large
          throw lastError;
        }
        
        // For other errors, if we have retries left, continue
        if (attempt < MAX_RETRIES) {
          await delay(RATE_LIMITS.MIN_BACKOFF * attempt);
          continue;
        }
        
        throw lastError;
      }
    }
    
    throw lastError || new Error('All Groq API attempts failed');
  }, cacheOptions);
};

/**
 * Merge results from multiple chunks
 */
const mergeResults = (results: string[]): string => {
  try {
    // Parse each result as JSON
    const parsedResults = results.map(result => {
      try {
        return JSON.parse(ensureValidJson(result));
      } catch (e) {
        console.error("Failed to parse chunk result:", e);
        return {};
      }
    });
    
    // Combine the results based on the type of data
    if (parsedResults[0].score !== undefined) {
      // For ATS scores, average them
      const totalScore = parsedResults.reduce((sum, result) => sum + (result.score || 0), 0);
      return JSON.stringify({ score: Math.round(totalScore / parsedResults.length) });
    } else if (parsedResults[0].matchedSkills !== undefined) {
      // For skills analysis, combine unique skills and average scores
      const combined = {
        score: Math.round(parsedResults.reduce((sum, result) => sum + (result.score || 0), 0) / parsedResults.length),
        matchedSkills: Array.from(new Set(parsedResults.flatMap(result => result.matchedSkills || []))),
        missingSkills: Array.from(new Set(parsedResults.flatMap(result => result.missingSkills || []))),
        feedback: parsedResults.map(result => result.feedback || "").filter(Boolean).join(' ')
      };
      return JSON.stringify(combined);
    } else {
      // For full analysis, combine all parts
      const combined = {
        atsScore: Math.round(parsedResults.reduce((sum, result) => sum + (result.atsScore || 0), 0) / parsedResults.length),
        formatAnalysis: parsedResults[0].formatAnalysis || { score: 70, feedback: "Format analysis not available" },
        contentAnalysis: {
          score: Math.round(parsedResults.reduce((sum, result) => 
            sum + (result.contentAnalysis?.score || 0), 0) / parsedResults.length),
          feedback: parsedResults.map(result => result.contentAnalysis?.feedback || "").filter(Boolean).join(' ')
        },
        suggestions: parsedResults.flatMap(result => result.suggestions || [])
      };
      return JSON.stringify(combined);
    }
  } catch (error) {
    console.error('Error merging results:', error);
    throw new Error('Failed to merge chunked results');
  }
};

/**
 * Make a request to the Groq API with chunking, rate limiting, caching, and retries
 */
const callGroqApi = async (prompt: string, cacheOptions = CACHE_OPTIONS.RESUME_ANALYSIS): Promise<string> => {
  if (!GROQ_API_KEY) {
    console.error('Groq API key not found');
    throw new Error('Groq API key not configured');
  }
  // Pre-process the prompt to prevent 431 errors
  let processedPrompt = prompt;
  
  // Check if the prompt is too large for any single request  
  const promptSize = estimateRequestSize(processedPrompt);
  if (promptSize > TOKEN_LIMITS.MAX_REQUEST_SIZE) {
    console.log(`Prompt too large (${promptSize} bytes), truncating to prevent 431 error`);
    processedPrompt = truncateContentToSize(processedPrompt, Math.floor(TOKEN_LIMITS.MAX_REQUEST_SIZE * 0.8));
  }

  // Calculate available tokens for the prompt
  const maxPromptTokens = TOKEN_LIMITS.MAX_TOKENS_PER_REQUEST - 
    TOKEN_LIMITS.MAX_RESPONSE_TOKENS - 
    TOKEN_LIMITS.SYSTEM_MESSAGE_TOKENS - 
    TOKEN_LIMITS.CONTEXT_TOKENS;

  // Split prompt if it's too large
  const promptTokens = estimateTokenCount(processedPrompt);
  if (promptTokens > maxPromptTokens) {
    console.log(`Splitting large prompt (${promptTokens} tokens) into chunks`);
    const chunks = splitTextIntoChunks(processedPrompt, maxPromptTokens);
    const results: string[] = [];    for (const chunk of chunks) {
      // Double-check each chunk size before processing      
      const chunkSize = estimateRequestSize(chunk);
      if (chunkSize > TOKEN_LIMITS.MAX_REQUEST_SIZE) {
        const truncatedChunk = truncateContentToSize(chunk, Math.floor(TOKEN_LIMITS.MAX_REQUEST_SIZE * 0.8));
        console.log(`Chunk too large, truncated from ${chunkSize} to ${estimateRequestSize(truncatedChunk)} bytes`);
      }
      
      const chunkTokens = estimateTokenCount(chunk);
      await checkRateLimit(chunkTokens + TOKEN_LIMITS.SYSTEM_MESSAGE_TOKENS);
      
      try {
        const chunkResult = await processChunk(chunk, MODEL_CONFIG.primaryId, cacheOptions);
        results.push(chunkResult);
      } catch (error) {
        console.error('Error processing chunk:', error);
        // Try with fallback model if primary fails
        try {
          const fallbackResult = await processChunk(chunk, MODEL_CONFIG.fallbackId, cacheOptions);
          results.push(fallbackResult);
        } catch (fallbackError) {
          console.error('Fallback model failed:', fallbackError);
          // If this is a 431 error, don't continue with other chunks
          if (fallbackError instanceof Error && fallbackError.message.includes('431')) {
            throw new Error('Content too large for API processing. Please try with shorter content.');
          }
        }
      }
    }

    if (results.length === 0) {
      throw new Error('All chunks failed to process');
    }
    
    return mergeResults(results);
  }

  // For small prompts, process directly
  await checkRateLimit(promptTokens + TOKEN_LIMITS.SYSTEM_MESSAGE_TOKENS);
  try {
    return await processChunk(processedPrompt, MODEL_CONFIG.primaryId, cacheOptions);
  } catch (error) {
    console.error('Primary model failed:', error);
    // Try with fallback model
    return processChunk(processedPrompt, MODEL_CONFIG.fallbackId, cacheOptions);
  }
};

/**
 * Analyze a resume using Groq API
 */
export const analyzeResumeWithGroq = async (file: File, jobRoleId: string): Promise<AnalysisResult> => {
  try {
    const content = await file.text();
      // Preprocess content to prevent 431 errors
    const maxContentLength = 15000; // More reasonable limit for resume content
    let processedContent = content;
    if (content.length > maxContentLength) {
      console.log(`Resume content too long (${content.length} chars), truncating to ${maxContentLength} chars`);
      processedContent = truncateContentToTokenLimit(content, Math.floor(maxContentLength / 4)); // Rough char to token conversion
    }
    
    const prompt = `Analyze this resume for the job role ${jobRoleId}:\n\n${processedContent}\n\nProvide detailed analysis including ATS compatibility, formatting, and content quality. Format the response as JSON with fields: atsScore, formatAnalysis (with score and feedback), contentAnalysis (with score and feedback), and suggestions array. Your response must be in valid JSON format.`;
    
    const response = await callGroqApi(prompt, CACHE_OPTIONS.RESUME_ANALYSIS);
    const validJson = ensureValidJson(response);
    
    try {
      return JSON.parse(validJson) as AnalysisResult;
    } catch (parseError) {
      console.error('Failed to parse resume analysis result:', parseError);
      return generateMockAnalysis(jobRoleId);
    }
  } catch (error) {
    console.error('Error in Groq resume analysis:', error);
    // If it's a 431 error, provide a more specific error message
    if (error instanceof Error && error.message.includes('431')) {
      console.error('Resume content too large for analysis. Using mock data.');
    }
    return generateMockAnalysis(jobRoleId);
  }
};

/**
 * Get ATS score using Groq API
 */
export const getAtsScoreWithGroq = async (resumeText: string): Promise<{ score: number }> => {
  try {    // Preprocess content to prevent 431 errors
    const maxContentLength = 12000; // More reasonable limit for ATS scoring
    let processedContent = resumeText;
    if (resumeText.length > maxContentLength) {
      console.log(`Resume text too long (${resumeText.length} chars), truncating to ${maxContentLength} chars for ATS scoring`);
      processedContent = truncateContentToTokenLimit(resumeText, Math.floor(maxContentLength / 4)); // Rough char to token conversion
    }
    
    const prompt = `Calculate the ATS compatibility score for this resume:\n\n${processedContent}\n\nProvide only a number between 0-100 representing the ATS score. Return your answer in JSON format with a 'score' field, like {"score": 85}.`;
    
    const response = await callGroqApi(prompt, CACHE_OPTIONS.ATS_SCORE);
    const validJson = ensureValidJson(response);
    
    try {
      const parsed = JSON.parse(validJson);
      return { score: typeof parsed.score === 'number' ? parsed.score : 65 };
    } catch (parseError) {
      console.error('Failed to parse ATS score result:', parseError);
      // Attempt to extract a number from the response
      const score = parseInt(response.match(/\d+/)?.[0] || '65');
      return { score: isNaN(score) ? 65 : Math.min(100, Math.max(0, score)) };
    }
  } catch (error) {
    console.error('Error in Groq ATS scoring:', error);
    if (error instanceof Error && error.message.includes('431')) {
      console.error('Resume content too large for ATS scoring.');
    }
    return { score: 65 };
  }
};

/**
 * Analyze skills using Groq API
 */
export const analyzeSkillsWithGroq = async (resumeText: string, jobRoleId: string): Promise<SkillsGap> => {
  try {    // Preprocess content to prevent 431 errors
    const maxContentLength = 12000; // More reasonable limit for skills analysis
    let processedContent = resumeText;
    if (resumeText.length > maxContentLength) {
      console.log(`Resume text too long (${resumeText.length} chars), truncating to ${maxContentLength} chars for skills analysis`);
      processedContent = truncateContentToTokenLimit(resumeText, Math.floor(maxContentLength / 4)); // Rough char to token conversion
    }
    
    const prompt = `Analyze the skills in this resume for the job role ${jobRoleId}:\n\n${processedContent}\n\nProvide a JSON response with fields: score (number), matchedSkills (array of strings), missingSkills (array of strings), and feedback (string with recommendations). Your response must be valid JSON format.`;
    
    const response = await callGroqApi(prompt, CACHE_OPTIONS.SKILLS_ANALYSIS);
    const validJson = ensureValidJson(response);
    
    try {
      return JSON.parse(validJson) as SkillsGap;
    } catch (parseError) {
      console.error('Failed to parse skills analysis result:', parseError);
      return generateMockAnalysis(jobRoleId).skillsGap;
    }
  } catch (error) {
    console.error('Error in Groq skills analysis:', error);
    if (error instanceof Error && error.message.includes('431')) {
      console.error('Resume content too large for skills analysis.');
    }
    return generateMockAnalysis(jobRoleId).skillsGap;
  }
};

// Request monitoring and validation utilities
const REQUEST_MONITORING = {
  logRequest: (size: number, tokenCount: number, action: string) => {
    console.log(`[Groq API] ${action} - Size: ${size} bytes, Tokens: ${tokenCount}`);
    if (size > TOKEN_LIMITS.MAX_REQUEST_SIZE * 0.8) {
      console.warn(`[Groq API] Large request detected: ${size} bytes (warning threshold: ${TOKEN_LIMITS.MAX_REQUEST_SIZE * 0.8})`);
    }
  },
  
  validateRequestSize: (content: string): { isValid: boolean; size: number; message?: string } => {
    const size = estimateRequestSize(content);
    if (size > TOKEN_LIMITS.MAX_REQUEST_SIZE) {
      return {
        isValid: false,
        size,
        message: `Request too large: ${size} bytes exceeds limit of ${TOKEN_LIMITS.MAX_REQUEST_SIZE} bytes`
      };
    }
    return { isValid: true, size };
  }
};
