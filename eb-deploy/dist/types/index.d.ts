export interface User {
    id: string;
    email: string;
    created_at: string;
    updated_at: string;
}
export interface Profile {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: 'user' | 'admin';
    subscription_plan: 'free' | 'basic' | 'premium' | 'professional';
    subscription_status: 'active' | 'inactive' | 'cancelled' | 'expired';
    subscription_expires_at?: string;
    avatar_url?: string;
    bio?: string;
    location?: string;
    website?: string;
    linkedin_url?: string;
    github_url?: string;
    phone?: string;
    industry?: string;
    experience_level?: 'entry' | 'mid' | 'senior' | 'executive';
    created_at: string;
    updated_at: string;
}
export interface ResumeAnalysis {
    id: string;
    user_id: string;
    job_role: string;
    analysis_type: 'quick' | 'comprehensive' | 'detailed';
    file_name: string;
    file_size: number;
    resume_text: string;
    ats_score: number;
    overall_score: number;
    result: any;
    created_at: string;
    updated_at: string;
}
export interface UserAnalytics {
    id: string;
    user_id: string;
    ats_score: number;
    previous_ats_score: number;
    overall_score: number;
    skills_matched: number;
    total_skills: number;
    readability_score: number;
    keyword_density: number;
    total_analyses: number;
    last_analysis_date: string;
    created_at: string;
    updated_at: string;
}
export interface AnalyticsTrend {
    id: string;
    user_id: string;
    ats_score: number;
    overall_score: number;
    readability_score: number;
    keyword_density: number;
    skills_match: number;
    timestamp: string;
}
export interface PaymentOrder {
    id: string;
    user_id: string;
    plan_id: string;
    amount: number;
    currency: string;
    status: 'created' | 'completed' | 'failed' | 'cancelled';
    razorpay_order_id: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    receipt: string;
    error_message?: string;
    created_at: string;
    completed_at?: string;
}
export interface CourseRecommendationRecord {
    id: string;
    user_id: string;
    course_id: string;
    title: string;
    provider: string;
    url: string;
    category: string;
    description?: string;
    is_saved: boolean;
    is_completed: boolean;
    completed_at?: string;
    rating?: number;
    review?: string;
    created_at: string;
    updated_at: string;
}
export interface UploadSession {
    id: string;
    user_id?: string;
    purpose: string;
    metadata: any;
    status: 'created' | 'uploading' | 'completed' | 'failed';
    files?: UploadedFile[];
    expires_at: string;
    created_at: string;
    updated_at: string;
}
export interface UploadedFile {
    id: string;
    session_id: string;
    original_name: string;
    file_name: string;
    file_path: string;
    mime_type: string;
    file_size: number;
    upload_status: 'uploading' | 'completed' | 'failed';
    created_at: string;
}
export interface ApiResponse<T = any> {
    message: string;
    data?: T;
    error?: string;
    timestamp?: string;
}
export interface PaginatedResponse<T> {
    message: string;
    data: {
        items: T[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
    timestamp?: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
export interface AuthResponse {
    message: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
        subscriptionPlan: string;
        subscriptionStatus?: string;
        subscriptionExpiresAt?: string;
    };
    token: string;
}
export interface AnalysisRequest {
    resumeText?: string;
    jobRole?: string;
    analysisType?: 'quick' | 'comprehensive' | 'detailed';
}
export interface CreateOrderRequest {
    planId: string;
    currency?: string;
}
export interface VerifyPaymentRequest {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}
export interface CourseRecommendationRequest {
    analysisId?: string;
    jobRole?: string;
    skillsGap?: string[];
    category?: string;
    limit?: number;
}
export interface ErrorResponse {
    error: string;
    message?: string;
    code?: string;
    details?: any;
    timestamp: string;
    path: string;
    method: string;
}
export type SubscriptionPlan = 'free' | 'basic' | 'premium' | 'professional';
export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'expired';
export type UserRole = 'user' | 'admin';
export type AnalysisType = 'quick' | 'comprehensive' | 'detailed';
export type PaymentStatus = 'created' | 'completed' | 'failed' | 'cancelled';
export type CourseCategory = 'technical' | 'business' | 'design' | 'marketing' | 'data' | 'personal';
export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'executive';
//# sourceMappingURL=index.d.ts.map