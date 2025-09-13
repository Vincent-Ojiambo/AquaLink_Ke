import { Database } from './database-extensions';

type Tables = Database['public']['Tables'];

export type EmergencyAlert = Tables['emergency_alerts']['Row'] & {
  contacts_notified: number;
  // Alias for contacts_notified for backward compatibility
  contactsNotified?: number;
};

export type EmergencyAlertInsert = Omit<Tables['emergency_alerts']['Insert'], 'id' | 'created_at' | 'updated_at'> & {
  contacts_notified?: number;
  created_at?: string;
  updated_at?: string;
};

export interface EmergencyContact extends Omit<Tables['emergency_contacts']['Row'], 'phone_number'> {
  phone_number: string;
  phone: string; // Alias for phone_number for backward compatibility
}
export type EmergencySettings = Tables['emergency_settings']['Row'];

// Define the notification log type to match the database schema
export interface NotificationLog {
  id?: string;
  alert_id: string;
  user_id: string;
  status: 'pending' | 'delivered' | 'failed';
  channel: string;
  message: string;
  error?: string | null;
  metadata?: any;
  created_at?: string;
  updated_at?: string;
}

export type Profile = Tables['profiles']['Row'] & {
  phone?: string | null;
  name?: string | null;
};

export type AlertStatus = 'active' | 'resolved' | 'test';

export interface EmergencyAlertRequest {
  userId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  isTest?: boolean;
}
