// src/types/supabase.ts
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      chat_history: {
        Row: {
          id: string
          user_id: string
          waifu_name: string
          message: string
          reply: string
          created_at: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          favorite_waifu: string
          theme: string
          updated_at: string
        }
      }
    }
  }
}