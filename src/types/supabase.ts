export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
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
        Insert: {
          id?: string
          user_id: string
          waifu_name: string
          message: string
          reply: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['chat_history']['Insert']>
        Relationships: []
      }
      user_profiles: {
        Row: {
          id: string
          favorite_waifu: string | null
          theme: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          favorite_waifu?: string | null
          theme?: string | null
          updated_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
