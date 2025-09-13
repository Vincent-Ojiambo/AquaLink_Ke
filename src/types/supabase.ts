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
      emergency_alerts: {
        Row: {
          id: string
          user_id: string
          latitude: number
          longitude: number
          accuracy: number | null
          status: 'active' | 'resolved' | 'test'
          created_at: string
          updated_at: string
          resolved_at: string | null
          is_test: boolean
        }
        Insert: {
          id?: string
          user_id: string
          latitude: number
          longitude: number
          accuracy?: number | null
          status?: 'active' | 'resolved' | 'test'
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
          is_test?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          latitude?: number
          longitude?: number
          accuracy?: number | null
          status?: 'active' | 'resolved' | 'test'
          created_at?: string
          updated_at?: string
          resolved_at?: string | null
          is_test?: boolean
        }
      }
      emergency_contacts: {
        Row: {
          id: string
          user_id: string
          name: string
          phone: string
          email: string | null
          relationship: string | null
          is_primary: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          phone: string
          email?: string | null
          relationship?: string | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          phone?: string
          email?: string | null
          relationship?: string | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      emergency_settings: {
        Row: {
          id: string
          user_id: string
          auto_send_location: boolean
          send_sms: boolean
          make_emergency_call: boolean
          share_live_location: boolean
          sos_countdown_seconds: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          auto_send_location?: boolean
          send_sms?: boolean
          make_emergency_call?: boolean
          share_live_location?: boolean
          sos_countdown_seconds?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          auto_send_location?: boolean
          send_sms?: boolean
          make_emergency_call?: boolean
          share_live_location?: boolean
          sos_countdown_seconds?: number
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          phone: string | null
          email: string | null
          avatar_url: string | null
          region: string | null
          license_number: string | null
          years_of_experience: number | null
          created_at: string
          updated_at: string
          user_type: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          phone?: string | null
          email?: string | null
          avatar_url?: string | null
          region?: string | null
          license_number?: string | null
          years_of_experience?: number | null
          created_at?: string
          updated_at?: string
          user_type?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          phone?: string | null
          email?: string | null
          avatar_url?: string | null
          region?: string | null
          license_number?: string | null
          years_of_experience?: number | null
          created_at?: string
          updated_at?: string
          user_type?: string
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
