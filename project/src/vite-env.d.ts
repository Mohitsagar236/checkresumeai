/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_RESUME_ANALYSIS_ENDPOINT: string;
  readonly VITE_ATS_SCORING_ENDPOINT: string;
  readonly VITE_SKILLS_ANALYSIS_ENDPOINT: string;
  readonly VITE_OPENAI_API_KEY: string;
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_PINECONE_API_KEY: string;
  readonly VITE_PINECONE_ENVIRONMENT: string;
  readonly VITE_USE_MOCK_API: string;
  readonly VITE_USE_GEMINI_API: string;
  readonly VITE_API_KEY: string;
  readonly VITE_API_SECRET: string;
  readonly VITE_ENABLE_REAL_TIME_ANALYSIS: string;
  readonly VITE_ENABLE_PREMIUM_FEATURES: string;
  readonly VITE_MAX_FILE_SIZE: string;
  readonly VITE_RATE_LIMIT_REQUESTS: string;
  readonly VITE_RATE_LIMIT_WINDOW: string;
  readonly VITE_MIN_CONFIDENCE_SCORE: string;
  readonly VITE_MAX_TOKENS: string;
  readonly VITE_DEFAULT_LANGUAGE: string;
  readonly VITE_CACHE_DURATION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
