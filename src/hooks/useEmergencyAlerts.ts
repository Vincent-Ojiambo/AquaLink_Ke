import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './use-auth';
import { User } from '@supabase/supabase-js';

export interface EmergencyAlert {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  status: 'active' | 'resolved' | 'test';
  isTest: boolean;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export function useEmergencyAlerts() {
  const { user } = useAuth() as { user: User & { id: string } };
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeAlert, setActiveAlert] = useState<EmergencyAlert | null>(null);

  const sendEmergencyAlert = useCallback(async (position: { lat: number; lng: number; accuracy?: number }, isTest = false) => {
    if (!user) {
      throw new Error('User must be logged in to send an emergency alert');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/emergency_alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          user_id: user.id,
          latitude: position.lat,
          longitude: position.lng,
          accuracy: position.accuracy,
          status: isTest ? 'test' : 'active',
          is_test: isTest,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send emergency alert');
      }

      if (data.alert) {
        // Convert snake_case to camelCase
        const alertData = {
          ...data.alert,
          userId: data.alert.user_id,
          createdAt: data.alert.created_at,
          updatedAt: data.alert.updated_at,
          resolvedAt: data.alert.resolved_at
        };
        setActiveAlert(alertData);
        return alertData;
      }

      return data;
    } catch (err) {
      console.error('Error sending emergency alert:', err);
      setError(err instanceof Error ? err.message : 'Failed to send emergency alert');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const resolveAlert = useCallback(async (alertId: string) => {
    if (!user) {
      throw new Error('User must be logged in to resolve an alert');
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/emergency_alerts?id=eq.${alertId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Prefer': 'return=representation',
          },
          body: JSON.stringify({
            status: 'resolved',
            resolved_at: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to resolve alert');
      }

      const [data] = await response.json();
      
      if (activeAlert?.id === alertId) {
        setActiveAlert(null);
      }

      return data;
    } catch (err) {
      console.error('Error resolving alert:', err);
      setError(err instanceof Error ? err.message : 'Failed to resolve alert');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [user, activeAlert]);

  const fetchEmergencyAlerts = useCallback(async () => {
    if (!user) return null;

    setIsLoading(true);
    setError(null);

    try {
      // First check for active alerts
      const activeResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/emergency_alerts?user_id=eq.${user.id}&status=eq.active&limit=1`,
        {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (!activeResponse.ok) {
        throw new Error('Failed to fetch active alert');
      }

      const [activeAlert] = await activeResponse.json();
      
      if (activeAlert) {
        const formattedAlert = {
          id: activeAlert.id,
          userId: activeAlert.user_id,
          latitude: activeAlert.latitude,
          longitude: activeAlert.longitude,
          accuracy: activeAlert.accuracy,
          status: activeAlert.status,
          isTest: activeAlert.is_test,
          createdAt: activeAlert.created_at,
          updatedAt: activeAlert.updated_at,
          resolvedAt: activeAlert.resolved_at
        };
        
        setActiveAlert(formattedAlert);
        return formattedAlert;
      }
      
      // If no active alert, get the most recent one
      const recentResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/emergency_alerts?user_id=eq.${user.id}&order=created_at.desc&limit=1`,
        {
          headers: {
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        }
      );

      if (!recentResponse.ok) {
        throw new Error('Failed to fetch recent alerts');
      }

      const [recentAlert] = await recentResponse.json();
      
      if (recentAlert) {
        const formattedAlert = {
          id: recentAlert.id,
          userId: recentAlert.user_id,
          latitude: recentAlert.latitude,
          longitude: recentAlert.longitude,
          accuracy: recentAlert.accuracy,
          status: recentAlert.status,
          isTest: recentAlert.is_test,
          createdAt: recentAlert.created_at,
          updatedAt: recentAlert.updated_at,
          resolvedAt: recentAlert.resolved_at
        };
        
        setActiveAlert(formattedAlert);
        return formattedAlert;
      }
      
      setActiveAlert(null);
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch emergency alerts');
      console.error('Error fetching emergency alerts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // getActiveAlert is now handled by fetchEmergencyAlerts which gets the most recent active alert

  // Fetch active alert on mount
  useEffect(() => {
    if (user) {
      fetchEmergencyAlerts();
    }
  }, [user, fetchEmergencyAlerts]);

  // Define getActiveAlert to use fetchEmergencyAlerts
  const getActiveAlert = useCallback(async (): Promise<EmergencyAlert | null> => {
    return await fetchEmergencyAlerts();
  }, [fetchEmergencyAlerts]);

  return {
    sendEmergencyAlert,
    resolveAlert,
    getActiveAlert,
    activeAlert,
    isLoading,
    error,
  };
}
