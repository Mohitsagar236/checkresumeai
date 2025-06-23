import { ResumeAnalysisResult } from './aiAnalysisService.js';
export interface AnalysisData {
    resumeText: string;
    jobRole: string;
    analysisType: string;
    result: ResumeAnalysisResult;
    fileName: string;
    fileSize: number;
}
export interface SavedAnalysis {
    id: string;
    userId: string;
    jobRole: string;
    analysisType: string;
    fileName: string;
    fileSize: number;
    atsScore: number;
    overallScore: number;
    result: ResumeAnalysisResult;
    createdAt: string;
    updatedAt: string;
}
export declare const saveAnalysisToDatabase: (userId: string, analysisData: AnalysisData) => Promise<SavedAnalysis>;
export declare const updateUserAnalytics: (userId: string, analysisResult: ResumeAnalysisResult) => Promise<void>;
export declare const addAnalyticsTrend: (userId: string, analysisResult: ResumeAnalysisResult) => Promise<void>;
export declare const getUserAnalytics: (userId: string) => Promise<{
    analytics: any;
    trends: any[];
    recentAnalyses: {
        id: any;
        job_role: any;
        analysis_type: any;
        file_name: any;
        ats_score: any;
        created_at: any;
    }[];
}>;
export declare const generateAnalyticsInsights: (userId: string) => Promise<{
    type: string;
    category: string;
    message: string;
    impact: string;
}[]>;
//# sourceMappingURL=analyticsService.d.ts.map