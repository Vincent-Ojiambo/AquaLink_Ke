import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://ajadkcbvnfcskeekipkz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqYWRrY2J2bmZjc2tlZWtpcGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3OTgzOTQsImV4cCI6MjA3MjM3NDM5NH0.Jm5i7W2-JwwvDdfLhfdoBRF_2oOWhjR-Ridc5OD4Nyg";

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);