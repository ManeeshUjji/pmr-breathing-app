export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          quiz_completed: boolean;
          quiz_results: Json | null;
          preferred_duration: number;
          experience_level: 'beginner' | 'intermediate' | 'advanced';
          goals: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          quiz_completed?: boolean;
          quiz_results?: Json | null;
          preferred_duration?: number;
          experience_level?: 'beginner' | 'intermediate' | 'advanced';
          goals?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          quiz_completed?: boolean;
          quiz_results?: Json | null;
          preferred_duration?: number;
          experience_level?: 'beginner' | 'intermediate' | 'advanced';
          goals?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      programs: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: 'pmr' | 'breathing' | 'meditation' | 'mixed';
          difficulty: 'beginner' | 'intermediate' | 'advanced';
          duration_days: number;
          image_url: string | null;
          is_premium: boolean;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          category: 'pmr' | 'breathing' | 'meditation' | 'mixed';
          difficulty?: 'beginner' | 'intermediate' | 'advanced';
          duration_days: number;
          image_url?: string | null;
          is_premium?: boolean;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          category?: 'pmr' | 'breathing' | 'meditation' | 'mixed';
          difficulty?: 'beginner' | 'intermediate' | 'advanced';
          duration_days?: number;
          image_url?: string | null;
          is_premium?: boolean;
          order_index?: number;
          created_at?: string;
        };
      };
      exercises: {
        Row: {
          id: string;
          program_id: string | null;
          title: string;
          description: string;
          type: 'pmr' | 'breathing' | 'meditation';
          duration_seconds: number;
          day_number: number | null;
          order_index: number;
          content: Json;
          audio_script: string | null;
          muscle_groups: string[] | null;
          breathing_pattern: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          program_id?: string | null;
          title: string;
          description: string;
          type: 'pmr' | 'breathing' | 'meditation';
          duration_seconds: number;
          day_number?: number | null;
          order_index?: number;
          content: Json;
          audio_script?: string | null;
          muscle_groups?: string[] | null;
          breathing_pattern?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          program_id?: string | null;
          title?: string;
          description?: string;
          type?: 'pmr' | 'breathing' | 'meditation';
          duration_seconds?: number;
          day_number?: number | null;
          order_index?: number;
          content?: Json;
          audio_script?: string | null;
          muscle_groups?: string[] | null;
          breathing_pattern?: Json | null;
          created_at?: string;
        };
      };
      user_programs: {
        Row: {
          id: string;
          user_id: string;
          program_id: string;
          current_day: number;
          started_at: string;
          completed_at: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          program_id: string;
          current_day?: number;
          started_at?: string;
          completed_at?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          program_id?: string;
          current_day?: number;
          started_at?: string;
          completed_at?: string | null;
          is_active?: boolean;
        };
      };
      sessions: {
        Row: {
          id: string;
          user_id: string;
          exercise_id: string;
          user_program_id: string | null;
          completed_at: string;
          duration_seconds: number;
          feedback_rating: number | null;
          notes: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          exercise_id: string;
          user_program_id?: string | null;
          completed_at?: string;
          duration_seconds: number;
          feedback_rating?: number | null;
          notes?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          exercise_id?: string;
          user_program_id?: string | null;
          completed_at?: string;
          duration_seconds?: number;
          feedback_rating?: number | null;
          notes?: string | null;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_customer_id: string;
          stripe_subscription_id: string | null;
          status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
          plan_type: 'monthly' | 'yearly';
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_customer_id: string;
          stripe_subscription_id?: string | null;
          status?: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
          plan_type?: 'monthly' | 'yearly';
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_customer_id?: string;
          stripe_subscription_id?: string | null;
          status?: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
          plan_type?: 'monthly' | 'yearly';
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

// Convenience types
export type Profile = Tables<'profiles'>;
export type Program = Tables<'programs'>;
export type Exercise = Tables<'exercises'>;
export type UserProgram = Tables<'user_programs'>;
export type Session = Tables<'sessions'>;
export type Subscription = Tables<'subscriptions'>;

