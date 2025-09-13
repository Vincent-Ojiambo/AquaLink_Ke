import { createClient } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { Database } from '@/types/supabase';

type AlertStatus = 'active' | 'resolved' | 'cancelled';
interface EmergencyAlert {
  id: string;
  user_id: string;
  status: AlertStatus;
  created_at: string;
  resolved_at?: string | null;
  // Add other fields as needed
}

interface ApiResponse {
  success: boolean;
  alert: EmergencyAlert | null;
  error?: string;
  details?: string;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  try {
    const userId = searchParams.get('userId');
    
    if (!userId) {
      const response: ApiResponse = {
        success: false,
        alert: null,
        error: 'User ID is required'
      };
      return NextResponse.json(response, { status: 400 });
    }

    // Get the most recent active alert for the user
    const { data: alerts, error: fetchError } = await supabase
      .from('emergency_alerts')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1);

    if (fetchError) throw fetchError;

    const response: ApiResponse = {
      success: true,
      alert: alerts && alerts.length > 0 ? alerts[0] as EmergencyAlert : null
    };
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching active alert:', error);
    const errorResponse: ApiResponse = {
      success: false,
      alert: null,
      error: 'Failed to fetch active alert',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
