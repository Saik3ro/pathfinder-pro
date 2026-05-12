import { createClient } from "@supabase/supabase-js";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      learning_decks: {
        Row: {
          id: number;
          user_id: string;
          title: string;
          description: string | null;
          ai_response_json: any;
          progress_percentage: number;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          title: string;
          description?: string | null;
          ai_response_json?: any;
          progress_percentage?: number;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          title?: string;
          description?: string | null;
          ai_response_json?: any;
          progress_percentage?: number;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      flashcard_decks: {
        Row: {
          id: number;
          learning_deck_id: number;
          milestone_title: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          learning_deck_id: number;
          milestone_title: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          learning_deck_id?: number;
          milestone_title?: string;
          user_id?: string;
          created_at?: string;
        };
      };

      flashcards: {
        Row: {
          id: number;
          flashcard_deck_id: number;
          question: string;
          answer: string;
          difficulty: "easy" | "medium" | "hard";
          created_at: string;
        };
        Insert: {
          id?: number;
          flashcard_deck_id: number;
          question: string;
          answer: string;
          difficulty: "easy" | "medium" | "hard";
          created_at?: string;
        };
        Update: {
          id?: number;
          flashcard_deck_id?: number;
          question?: string;
          answer?: string;
          difficulty?: "easy" | "medium" | "hard";
          created_at?: string;
        };
      };

      milestone_progress: {
        Row: {
          id: number;
          user_id: string;
          learning_deck_id: number;
          milestone_index: number;
          is_completed: boolean;
          completed_at: string | null;
        };
        Insert: {
          id?: number;
          user_id: string;
          learning_deck_id: number;
          milestone_index: number;
          is_completed?: boolean;
          completed_at?: string | null;
        };
        Update: {
          id?: number;
          user_id?: string;
          learning_deck_id?: number;
          milestone_index?: number;
          is_completed?: boolean;
          completed_at?: string | null;
        };
      };
    };
  };
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) as
  | string
  | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase env vars. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env.local.",
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

