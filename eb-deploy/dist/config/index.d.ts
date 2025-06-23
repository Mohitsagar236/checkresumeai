export declare const config: {
    server: {
        port: number;
        host: string;
        environment: string;
        apiVersion: string;
    };
    database: {
        supabaseUrl: string;
        supabaseAnonKey: string;
        supabaseServiceKey: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
        refreshExpiresIn: string;
    };
    ai: {
        openai: {
            apiKey: string;
            model: string;
            maxTokens: number;
        };
        groq: {
            apiKey: string;
            model: string;
            maxTokens: number;
        };
        together: {
            apiKey: string;
            model: string;
            maxTokens: number;
        };
    };
    payment: {
        razorpay: {
            keyId: string;
            keySecret: string;
        };
    };
    email: {
        smtp: {
            host: string;
            port: number;
            user: string;
            pass: string;
        };
        from: {
            email: string;
            name: string;
        };
    };
    redis: {
        url: string;
        password: string | undefined;
    };
    upload: {
        maxFileSize: number;
        allowedTypes: string[];
        uploadPath: string;
    };
    rateLimit: {
        windowMs: number;
        maxRequests: number;
    };
    logging: {
        level: string;
        enableRequestLogging: boolean;
    };
    features: {
        premiumFeatures: boolean;
        realTimeAnalysis: boolean;
        courseRecommendations: boolean;
        advancedAnalytics: boolean;
    };
    external: {
        pinecone: {
            apiKey: string;
            environment: string;
        };
    };
    cors: {
        origins: string[];
    };
};
export default config;
//# sourceMappingURL=index.d.ts.map