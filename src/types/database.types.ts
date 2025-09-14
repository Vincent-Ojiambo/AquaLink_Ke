export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string
          catch_id: string
          fisher_id: string
          amount: number
          status: 'pending' | 'completed' | 'failed'
          payment_method: string
          payment_reference: string
          phone_number: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          catch_id: string
          fisher_id: string
          amount: number
          status?: 'pending' | 'completed' | 'failed'
          payment_method: string
          payment_reference: string
          phone_number: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          catch_id?: string
          fisher_id?: string
          amount?: number
          status?: 'pending' | 'completed' | 'failed'
          payment_method?: string
          payment_reference?: string
          phone_number?: string
          created_at?: string
          updated_at?: string
        }
      },
      catches: {
        Row: {
          id: string
          fisher_id: string
          fish_type: string
          quantity_kg: number
          price_per_kg: number
          catch_date: string
          image_url: string | null
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          fisher_id: string
          fish_type: string
          quantity_kg: number
          price_per_kg: number
          catch_date: string
          image_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          fisher_id?: string
          fish_type?: string
          quantity_kg?: number
          price_per_kg?: number
          catch_date?: string
          image_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          phone: string
          region: string
          created_at: string
          updated_at: string
          user_type: 'fisher' | 'buyer' | 'admin'
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          phone: string
          region: string
          created_at?: string
          updated_at?: string
          user_type?: 'fisher' | 'buyer' | 'admin'
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          phone?: string
          region?: string
          created_at?: string
          updated_at?: string
          user_type?: 'fisher' | 'buyer' | 'admin'
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
