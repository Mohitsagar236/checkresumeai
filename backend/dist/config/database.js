import { createClient } from '@supabase/supabase-js';
import { config } from './index.js';
export const supabase = createClient(config.database.supabaseUrl, config.database.supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
    }
});
export const supabaseAdmin = createClient(config.database.supabaseUrl, config.database.supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
export const DB_TABLES = {
    users: 'users',
    profiles: 'profiles',
    subscriptions: 'subscriptions',
    resume_analyses: 'resume_analyses',
    user_analytics: 'user_analytics',
    analytics_trends: 'analytics_trends',
    course_recommendations: 'course_recommendations',
    payment_orders: 'payment_orders',
    upload_sessions: 'upload_sessions',
    feedback: 'feedback',
    audit_logs: 'audit_logs',
};
export const handleSupabaseResponse = (response) => {
    if (response.error) {
        return {
            data: null,
            error: {
                message: response.error.message,
                details: response.error.details,
                hint: response.error.hint,
                code: response.error.code,
            },
        };
    }
    return {
        data: response.data,
        error: null,
        count: response.count,
    };
};
export default supabase;
