export interface Profile {
  id: string;
  email: string;
  name: string;
  created_at: string;
  is_premium: boolean;
  subscription_start_date?: string;
  subscription_end_date?: string;
  // New fields for resume usage tracking
  resume_usage?: {
    total_count: number;        // Total resumes analyzed throughout subscription
    monthly_count: number;      // Resumes analyzed in current month
    last_reset_date?: string;   // Date when monthly count was last reset
  };
  subscription_plan_period?: 'monthly' | 'yearly'; // Type of premium subscription
}
