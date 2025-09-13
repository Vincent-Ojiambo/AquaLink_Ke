import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';
import { createClient } from '@supabase/supabase-js';

// Use Vite's environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface EmergencyContact {
  id: string;
  name: string;
  phone_number: string;
  email?: string;
  relationship?: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export function useEmergencyContacts() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('is_primary', { ascending: false });

      if (fetchError) throw fetchError;
      setContacts(data || []);
    } catch (err) {
      console.error('Error fetching emergency contacts:', err);
      setError('Failed to load emergency contacts');
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contact: Omit<EmergencyContact, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: insertError } = await supabase
        .from('emergency_contacts')
        .insert([{ ...contact, user_id: user.id }])
        .select()
        .single();

      if (insertError) throw insertError;
      
      await fetchContacts();
      return data;
    } catch (err) {
      console.error('Error adding emergency contact:', err);
      setError('Failed to add emergency contact');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateContact = async (id: string, updates: Partial<EmergencyContact>) => {
    if (!user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: updateError } = await supabase
        .from('emergency_contacts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      await fetchContacts();
      return data;
    } catch (err) {
      console.error('Error updating emergency contact:', err);
      setError('Failed to update emergency contact');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id: string) => {
    if (!user) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const { error: deleteError } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      await fetchContacts();
      return true;
    } catch (err) {
      console.error('Error deleting emergency contact:', err);
      setError('Failed to delete emergency contact');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch contacts on mount and when user changes
  useEffect(() => {
    fetchContacts();
  }, [user]);

  return {
    contacts,
    loading,
    error,
    addContact,
    updateContact,
    deleteContact,
    refresh: fetchContacts
  };
}
