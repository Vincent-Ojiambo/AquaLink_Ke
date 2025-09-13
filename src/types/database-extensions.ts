import { Database as BaseDatabase } from './supabase';

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Define our custom table types
export interface NotificationLog {
  id: string;
  alert_id: string;
  user_id: string;
  status: 'pending' | 'delivered' | 'failed';
  channel: string;
  message: string;
  error?: string | null;
  metadata?: Json;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  status: 'success' | 'partial_success' | 'failed';
  details: Json | null;
  ip_address?: string | null;
  created_at: string;
  updated_at: string;
}

// Export the extended database type
export type Database = BaseDatabase & {
  public: {
    Tables: {
      emergency_alerts: BaseDatabase['public']['Tables']['emergency_alerts'] & {
        Row: {
          contacts_notified?: number;
        };
      };
      notification_logs: {
        Row: NotificationLog;
        Insert: Omit<NotificationLog, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<NotificationLog, 'id' | 'created_at' | 'updated_at'>> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      audit_logs: {
        Row: AuditLog;
        Insert: Omit<AuditLog, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<AuditLog, 'id' | 'created_at' | 'updated_at'>> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    } & Omit<BaseDatabase['public']['Tables'], 'notification_logs' | 'audit_logs' | 'emergency_alerts'>;
  };
};
