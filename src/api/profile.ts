import { supabase } from '../utils/supabaseClient';
import { handleSupabaseError } from '../utils/errorHandling';

export interface AnalysisHistory {
  id: string;
  resume_id: string;
  analysis_type: string;
  analysis_result: any;
  created_at: string;
  updated_at: string;
}

export interface Resume {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  created_at: string;
  updated_at: string;
}

export const profileApi = {
  // Get user's analysis history
  getAnalysisHistory: async (): Promise<AnalysisHistory[]> => {
    try {
      const { data, error } = await supabase
        .from('analysis_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  // Get user's saved resumes
  getSavedResumes: async (): Promise<Resume[]> => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  // Delete a resume
  deleteResume: async (resumeId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resumeId);

      if (error) throw error;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  // Delete analysis history entry
  deleteAnalysisHistory: async (historyId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('analysis_history')
        .delete()
        .eq('id', historyId);

      if (error) throw error;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  },

  // Update user profile
  updateProfile: async (updates: { name?: string; email?: string }): Promise<void> => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: updates
      });

      if (error) throw error;
    } catch (error) {
      throw new Error(handleSupabaseError(error));
    }
  }
}; 