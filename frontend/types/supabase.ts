export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          role: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          role?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Composites: {
      [_ in never]: never;
    };
  };
};
