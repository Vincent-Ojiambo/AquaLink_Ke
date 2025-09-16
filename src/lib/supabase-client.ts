import { createClient, SupabaseClient as SupabaseClientBase } from '@supabase/supabase-js';

// Define types manually since they're not properly generated
type Profile = {
  id: string;
  user_id: string;
  user_type: 'fisher' | 'buyer';
  name?: string;
  phone?: string;
  email?: string;
  avatar_url?: string;
  region?: string;
  license_number?: string;
  years_of_experience?: number;
  created_at: string;
  updated_at: string;
};

type ProfileInsert = Omit<Profile, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

type ProfileUpdate = Partial<Omit<Profile, 'id' | 'user_id' | 'created_at'>> & {
  updated_at?: string;
};

interface SupabaseResponse<T> {
  data: T | null;
  error: any;
}

// Create a type-safe wrapper around the Supabase client
class SupabaseClient {
  private client: ReturnType<typeof createClient>;

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.client = createClient(supabaseUrl, supabaseKey);
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
    const updateData: ProfileUpdate = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await (this.client as any)
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    return { data, error } as SupabaseResponse<Profile>;
  }

  // Type-safe insert
  async insertProfile(profile: Omit<ProfileInsert, 'created_at' | 'updated_at'>): Promise<SupabaseResponse<Profile>> {
    const insertData: ProfileInsert = {
      ...profile,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await (this.client as any)
      .from('profiles')
      .insert([insertData])
      .select()
      .single();

    return { data, error } as SupabaseResponse<Profile>;
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

// Create a single supabase client for interacting with your database
const supabase = new SupabaseClient(supabaseUrl, supabaseAnonKey);

export default supabase;
