interface ApiConfig {
  openai: {
    apiKey: string;
  };
  gemini: {
    apiKey: string;
  };
  pinecone: {
    apiKey: string;
    environment: string;
  };
  analysis: {
    resumeEndpoint: string;
    atsEndpoint: string;
    skillsEndpoint: string;
    baseUrl: string;
  };
  features: {
    enableRealTimeAnalysis: boolean;
    enablePremiumFeatures: boolean;
  };
  limits: {
    maxFileSize: number;
    rateLimit: {
      requests: number;
      window: number;
    };
  };
  analysis_config: {
    minConfidenceScore: number;
    maxTokens: number;
    defaultLanguage: string;
  };
  cache: {
    duration: number;
  };
}

// Default API endpoints - Using a real production API
const DEFAULT_API_BASE_URL = 'https://resume-analyzer-api.example.com/api';

// For development, you can use a feature flag to choose between real API and mocks
// This flag is exported to be used in other files
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true' || false;

const config: ApiConfig = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'sk-mock-key-for-development',
  },
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCggVFJHGMu1_WK57J2gUuRZsX6qVfO4DM',
  },
  pinecone: {
    apiKey: import.meta.env.VITE_PINECONE_API_KEY || 'pinecone-mock-key',
    environment: import.meta.env.VITE_PINECONE_ENVIRONMENT || 'gcp-starter',
  },
  analysis: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
    resumeEndpoint: import.meta.env.VITE_RESUME_ANALYSIS_ENDPOINT || `${DEFAULT_API_BASE_URL}/analyze`,
    atsEndpoint: import.meta.env.VITE_ATS_SCORING_ENDPOINT || `${DEFAULT_API_BASE_URL}/ats-score`,
    skillsEndpoint: import.meta.env.VITE_SKILLS_ANALYSIS_ENDPOINT || `${DEFAULT_API_BASE_URL}/skills-analysis`,
  },
  features: {
    enableRealTimeAnalysis: import.meta.env.VITE_ENABLE_REAL_TIME_ANALYSIS === 'true',
    enablePremiumFeatures: import.meta.env.VITE_ENABLE_PREMIUM_FEATURES === 'true',
  },
  limits: {
    maxFileSize: Number(import.meta.env.VITE_MAX_FILE_SIZE) || 5242880, // 5MB default
    rateLimit: {
      requests: Number(import.meta.env.VITE_RATE_LIMIT_REQUESTS) || 100,
      window: Number(import.meta.env.VITE_RATE_LIMIT_WINDOW) || 3600,
    },
  },
  analysis_config: {
    minConfidenceScore: Number(import.meta.env.VITE_MIN_CONFIDENCE_SCORE) || 0.7,
    maxTokens: Number(import.meta.env.VITE_MAX_TOKENS) || 4000,
    defaultLanguage: import.meta.env.VITE_DEFAULT_LANGUAGE || 'en',
  },
  cache: {
    duration: Number(import.meta.env.VITE_CACHE_DURATION) || 3600,
  },
};

export const validateConfig = (): { isValid: boolean; missingKeys: string[] } => {
  const requiredKeys = [
    'openai.apiKey',
    'pinecone.apiKey',
    'pinecone.environment',
    'analysis.baseUrl',
  ];
  
  const missingKeys: string[] = [];
    // Check each key manually to avoid TypeScript issues
  for (const key of requiredKeys) {
    const [section, field] = key.split('.');
    // @ts-expect-error - We know the structure of our config object
    if (!config[section] || !config[section][field]) {
      missingKeys.push(key);
    }
  }
  
  // For debug purposes
  if (missingKeys.length > 0) {
    console.warn('Config validation: Some keys are missing but using defaults or mocks:', missingKeys);
  } else {
    console.log('Config validation: All required keys present');
  }

  if (missingKeys.length > 0) {
    console.error('Missing required configuration keys:', missingKeys.join(', '));
    return { isValid: false, missingKeys };
  }

  return { isValid: true, missingKeys: [] };
};

// Validate config on load
const { isValid, missingKeys } = validateConfig();
if (!isValid) {
  console.error('API configuration is invalid. Missing required keys:', missingKeys);
}

export default config;
