export declare const supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
export declare const supabaseAdmin: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
export declare const DB_TABLES: {
    readonly users: "users";
    readonly profiles: "profiles";
    readonly subscriptions: "subscriptions";
    readonly resume_analyses: "resume_analyses";
    readonly user_analytics: "user_analytics";
    readonly analytics_trends: "analytics_trends";
    readonly course_recommendations: "course_recommendations";
    readonly payment_orders: "payment_orders";
    readonly upload_sessions: "upload_sessions";
    readonly feedback: "feedback";
    readonly audit_logs: "audit_logs";
};
export interface DatabaseError {
    message: string;
    details?: string;
    hint?: string;
    code?: string;
}
export interface DatabaseResult<T> {
    data: T | null;
    error: DatabaseError | null;
    count?: number;
}
export declare const handleSupabaseResponse: <T>(response: any) => DatabaseResult<T>;
export default supabase;
//# sourceMappingURL=database.d.ts.map