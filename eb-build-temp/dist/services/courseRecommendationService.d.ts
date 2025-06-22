import { ResumeAnalysisResult } from './aiAnalysisService.js';
export interface CourseRecommendation {
    id: string;
    title: string;
    provider: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    duration: string;
    description: string;
    skills: string[];
    rating: number;
    reviewCount: number;
    price: {
        amount: number;
        currency: string;
        isFree: boolean;
    };
    url: string;
    imageUrl?: string;
    relevanceScore: number;
    reasons: string[];
}
export interface RecommendationRequest {
    userId: string;
    jobRole?: string;
    analysisData?: ResumeAnalysisResult;
    skillsGap?: string[];
    category?: string;
    limit?: number;
}
export declare const generateCourseRecommendations: (request: RecommendationRequest) => Promise<CourseRecommendation[]>;
//# sourceMappingURL=courseRecommendationService.d.ts.map