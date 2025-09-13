import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ajadkcbvnfcskeekipkz.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqYWRrY2J2bmZjc2tlZWtpcGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3OTgzOTQsImV4cCI6MjA3MjM3NDM5NH0.Jm5i7W2-JwwvDdfLhfdoBRF_2oOWhjR-Ridc5OD4Nyg";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);