import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define types
type AlertStatus = 'active' | 'resolved' | 'cancelled';

interface EmergencyAlert {
  id: string;
  user_id: string;
  status: AlertStatus;
  created_at: string;
  resolved_at?: string | null;
  // Add other fields as needed
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {

  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Alert ID is required' },
        { status: 400 }
      );
    }

    // Update the alert status to resolved
    const { data: alert, error: updateError } = await supabase
      .from('emergency_alerts')
      .update({
        status: 'resolved',
        resolved_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating alert:', updateError);
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to update alert',
          details: updateError.message 
        },
        { status: 500 }
      );
    }

    // TODO: Notify emergency contacts that the alert has been resolved
    // This could be an optional feature to implement later

    return NextResponse.json({ 
      success: true,
      alert,
      message: 'Emergency alert has been resolved'
    });

  } catch (error) {
    console.error('Error resolving alert:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to resolve alert',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
