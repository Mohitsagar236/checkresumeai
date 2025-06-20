import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT || '5000'),
    host: process.env.HOST || 'localhost',
    environment: process.env.NODE_ENV || 'development',
    apiVersion: process.env.API_VERSION || 'v1',
  },

  // Database Configuration
  database: {
    supabaseUrl: process.env.SUPABASE_URL!,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY!,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },

  // AI API Configuration
  ai: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY!,
      model: 'gpt-4-turbo-preview',
      maxTokens: 4000,
    },
    groq: {
      apiKey: process.env.GROQ_API_KEY!,
      model: 'mixtral-8x7b-32768',
      maxTokens: 32768,
    },
    together: {
      apiKey: process.env.TOGETHER_API_KEY!,
      model: 'meta-llama/Llama-3.2-70B-Vision-Instruct-Turbo',
      maxTokens: 4000,
    },
  },

  // Payment Configuration
  payment: {
    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID!,
      keySecret: process.env.RAZORPAY_KEY_SECRET!,
    },
  },

  // Email Configuration
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
    from: {
      email: process.env.FROM_EMAIL || 'noreply@checkresumeai.com',
      name: process.env.FROM_NAME || 'CheckResumeAI',
    },
  },

  // Redis Configuration
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    password: process.env.REDIS_PASSWORD,
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'pdf,doc,docx').split(','),
    uploadPath: process.env.UPLOAD_PATH || 'uploads',
  },

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING === 'true',
  },

  // Feature Flags
  features: {
    premiumFeatures: process.env.ENABLE_PREMIUM_FEATURES === 'true',
    realTimeAnalysis: process.env.ENABLE_REAL_TIME_ANALYSIS === 'true',
    courseRecommendations: process.env.ENABLE_COURSE_RECOMMENDATIONS === 'true',
    advancedAnalytics: process.env.ENABLE_ADVANCED_ANALYTICS === 'true',
  },

  // External Services
  external: {
    pinecone: {
      apiKey: process.env.PINECONE_API_KEY!,
      environment: process.env.PINECONE_ENVIRONMENT || 'gcp-starter',
    },
  },

  // CORS Configuration
  cors: {
    origins: process.env.NODE_ENV === 'production'
      ? ['https://checkresumeai.vercel.app', 'https://checkresumeai.com']
      : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173'],
  },
};

// Validate required environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'JWT_SECRET',
  'OPENAI_API_KEY',
  'GROQ_API_KEY',
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

export default config;
