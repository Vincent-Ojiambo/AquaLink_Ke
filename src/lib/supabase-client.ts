import { createClient, SupabaseClient as SupabaseClientBase } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

interface SupabaseResponse<T> {
  data: T | null;
  error: any;
}

// Create a type-safe wrapper around the Supabase client
class SupabaseClient {
  private client: SupabaseClientBase<Database>;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.client = createClient<Database>(supabaseUrl, supabaseKey);
  }

  // Get the raw client
  getClient() {
    return this.client;
  }

  // Type-safe update
  async updateProfile(
    id: string, 
    updates: Omit<ProfileUpdate, 'id' | 'user_id' | 'created_at'>
  ): Promise<SupabaseResponse<Profile>> {
    const { data, error } = await this.client
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      } as ProfileUpdate)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  }

  // Type-safe insert
  async insertProfile(profile: Omit<ProfileInsert, 'created_at' | 'updated_at'>): Promise<SupabaseResponse<Profile>> {
    const { data, error } = await this.client
      .from('profiles')
      .insert({
        ...profile,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as any)
      .select()
      .single();

    return { data, error };
  }

  // Type-safe upsert
  async upsertProfile(profile: Omit<ProfileInsert, 'created_at' | 'updated_at'> & { id: string }): Promise<SupabaseResponse<Profile>> {
    try {
      // First try to update
      const updateResult = await this.updateProfile(profile.id, {
        name: profile.name,
        phone: profile.phone || null,
        email: profile.email || null,
        avatar_url: profile.avatar_url || null,
        region: profile.region || null,
        license_number: profile.license_number || null,
        years_of_experience: profile.years_of_experience || null,
        user_type: profile.user_type || 'fisher'
      });

      // If update was successful or error is not "not found", return the result
      if (updateResult.error?.code !== 'PGRST116') {
        return updateResult;
      }

      // If update failed with "not found", try to insert
      return this.insertProfile(profile);
    } catch (error) {
      console.error('Error in upsertProfile:', error);
      return { data: null, error };
    }
  }
}

// Get environment variables with fallback values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ajadkcbvnfcskeekipkz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqYWRrY2J2bmZjc2tlZWtpcGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3OTgzOTQsImV4cCI6MjA3MjM3NDM5NH0.Jm5i7W2-JwwvDdfLhfdoBRF_2oOWhjR-Ridc5OD4Nyg';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
  console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY);
}

// Export a singleton instance
export const supabase = new SupabaseClient(supabaseUrl, supabaseAnonKey);

export type { Database };
