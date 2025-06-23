export interface ResumeAnalysisResult {
    atsScore: number;
    overallScore: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: Array<{
        category: string;
        priority: 'high' | 'medium' | 'low';
        description: string;
        impact: number;
    }>;
    skillsAnalysis: {
        presentSkills: string[];
        missingSkills: string[];
        skillsMatch: number;
        industryRelevance: number;
    };
    sectionAnalysis: {
        contactInfo: {
            score: number;
            feedback: string;
        };
        summary: {
            score: number;
            feedback: string;
        };
        experience: {
            score: number;
            feedback: string;
        };
        education: {
            score: number;
            feedback: string;
        };
        skills: {
            score: number;
            feedback: string;
        };
    };
    keywordAnalysis: {
        density: number;
        relevantKeywords: string[];
        missingKeywords: string[];
    };
    formatting: {
        score: number;
        issues: string[];
        suggestions: string[];
    };
    industryBenchmark: {
        industry: string;
        averageScore: number;
        percentile: number;
    };
    estimatedReading: {
        timeSeconds: number;
        difficulty: 'easy' | 'medium' | 'hard';
    };
}
export declare const analyzeResumeWithAI: (resumeText: string, jobRole: string, analysisType?: string) => Promise<ResumeAnalysisResult>;
//# sourceMappingURL=aiAnalysisService.d.ts.map