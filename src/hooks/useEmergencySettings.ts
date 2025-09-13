import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';
import { createClient } from '@supabase/supabase-js';
import { EmergencySettingsState } from '@/types/emergency';

// Use Vite's environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface EmergencySettings extends EmergencySettingsState {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const defaultEmergencySettings: Omit<EmergencySettings, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  autoSendLocation: true,
  sendSMS: true,
  makeEmergencyCall: false,
  shareLiveLocation: true,
  sosCountdown: 5,
};

export function useEmergencySettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<EmergencySettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('emergency_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;
      
      // If no settings exist, create default ones
      if (!data) {
        return await updateSettings(defaultEmergencySettings);
      }
      
      // Convert from snake_case to camelCase for the frontend
      const settingsData = {
        ...data,
        autoSendLocation: data.auto_send_location,
        sendSMS: data.send_sms,
        makeEmergencyCall: data.make_emergency_call,
        shareLiveLocation: data.share_live_location,
        sosCountdown: data.sos_countdown_seconds
      };
      
      setSettings(settingsData);
      return settingsData;
    } catch (err) {
      console.error('Error fetching emergency settings:', err);
      setError('Failed to load emergency settings');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateSettings = async (updates: Partial<EmergencySettingsState>) => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      // Convert from camelCase to snake_case for the database
      const dbUpdates = {
        user_id: user.id,
        auto_send_location: updates.autoSendLocation,
        send_sms: updates.sendSMS,
        make_emergency_call: updates.makeEmergencyCall,
        share_live_location: updates.shareLiveLocation,
        sos_countdown_seconds: updates.sosCountdown,
      };
      
      const { data, error: updateError } = await supabase
        .from('emergency_settings')
        .upsert(dbUpdates, { onConflict: 'user_id' })
        .select()
        .single();

      if (updateError) throw updateError;
      
      // Convert back to camelCase for the frontend
      const settingsData = data ? {
        ...data,
        autoSendLocation: data.auto_send_location,
        sendSMS: data.send_sms,
        makeEmergencyCall: data.make_emergency_call,
        shareLiveLocation: data.share_live_location,
        sosCountdown: data.sos_countdown_seconds
      } : null;
      
      setSettings(settingsData);
      return settingsData;
    } catch (err) {
      console.error('Error updating emergency settings:', err);
      setError('Failed to update emergency settings');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fetch settings on mount and when user changes
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings: settings || { ...defaultEmergencySettings, id: '', user_id: user?.id || '', created_at: '', updated_at: '' },
    loading,
    error,
    updateSettings,
    refresh: fetchSettings,
  };
}
