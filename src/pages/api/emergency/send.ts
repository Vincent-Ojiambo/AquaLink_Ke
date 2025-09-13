import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';
import { Database } from '@/types/database-extensions';
import type {
  EmergencyAlert,
  EmergencyAlertInsert,
  EmergencyContact,
  EmergencySettings,
  NotificationLog as NotificationLogType,
  Profile,
  AlertStatus
} from '@/types/emergency-alert';
import twilio from 'twilio';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Type for the request body
type EmergencyAlertRequestBody = {
  userId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  isTest?: boolean;
};

// Extended alert type with required fields
type AlertWithId = EmergencyAlert & { id: string };

type UserProfile = {
  name: string | null;
  phone: string | null;
};

// Initialize Supabase client with extended types
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Initialize rate limiter (5 requests per 10 minutes per user)
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '10 m'),
  analytics: true,
});

// Define types for notification logs
type NotificationLog = {
  user_id: string;
  contact_id: string;
  type: string;
  status: 'pending' | 'delivered' | 'failed';
  channel: string;
  message: string;
  error?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
};

// Define types for audit logs
type AuditLog = {
  user_id: string;
  action: string;
  status: 'success' | 'partial_success' | 'failed';
  details: Record<string, unknown> | null;
  ip_address?: string | null;
};

// Input validation schema
const validateRequest = (data: any) => {
  if (!data.userId || typeof data.userId !== 'string') {
    throw new Error('Invalid user ID');
  }
  if (typeof data.latitude !== 'number' || data.latitude < -90 || data.latitude > 90) {
    throw new Error('Invalid latitude');
  }
  if (typeof data.longitude !== 'number' || data.longitude < -180 || data.longitude > 180) {
    throw new Error('Invalid longitude');
  }
  if (data.accuracy && (typeof data.accuracy !== 'number' || data.accuracy < 0)) {
    throw new Error('Invalid accuracy value');
  }
  if (data.isTest && typeof data.isTest !== 'boolean') {
    throw new Error('Invalid test flag');
  }
};

// Initialize Twilio client if credentials are available
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = accountSid && authToken ? twilio(accountSid, authToken) : null;

interface EmergencyAlertRequest {
  userId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  isTest?: boolean;
}

async function sendSMS(phoneNumber: string, message: string) {
  if (!twilioClient || !process.env.TWILIO_PHONE_NUMBER) {
    console.warn('Twilio not configured, SMS will not be sent');
    return null;
  }

  try {
    return await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return null;
  }
}

interface AlertData {
  user_id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  status: AlertStatus;
  is_test: boolean;
  contacts_notified: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed',
      code: 'method_not_allowed'
    });
  }

  try {
    // Validate request body
    const { userId, latitude, longitude, accuracy = 0, isTest = false } = req.body as EmergencyAlertRequest;
    
    try {
      validateRequest(req.body);
    } catch (validationError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: validationError instanceof Error ? validationError.message : 'Unknown validation error',
        code: 'validation_error'
      });
    }

    // Apply rate limiting
    const rateLimitResult = await ratelimit.limit(userId);
    if (!rateLimitResult.success) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000),
        code: 'rate_limit_exceeded'
      });
    }

    // Get user's emergency settings and contacts in parallel
    const [
      { data: userSettings },
      { data: userContacts, error: contactsError }
    ] = await Promise.all([
      supabase
        .from('emergency_settings')
        .select('*')
        .eq('user_id', userId)
        .single<EmergencySettings>(),
      supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', userId)
        .returns<EmergencyContact[]>()
    ]);

    if (contactsError) throw contactsError;

    // Filter active contacts
    const activeContacts: EmergencyContact[] = userContacts || [];
    const alertStatus = isTest ? 'test' : 'active' as const;
    
    // Create alert data with proper typing
    const alertData: EmergencyAlertInsert = {
      user_id: userId,
      latitude,
      longitude,
      accuracy,
      status: alertStatus,
      is_test: isTest,
      contacts_notified: 0, // Will be updated after sending notifications
    };

    // Insert the alert and get the result
    const alertInsertData = {
      user_id: userId,
      latitude,
      longitude,
      accuracy,
      status: alertStatus,
      is_test: isTest,
      contacts_notified: isTest ? 0 : activeContacts.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: alert, error: alertError } = await supabase
      .from('emergency_alerts')
      .insert(alertInsertData as any)
      .select()
      .single<EmergencyAlert>();
    
    if (alertError) {
      console.error('Error creating alert:', alertError);
      throw new Error('Failed to create alert');
    }
    
    if (!alert) {
      throw new Error('No alert data returned after creation');
    }
    
    // Type assertion for the alert
    const typedAlert = alert as AlertWithId;

    // Log the notification
    const notificationLog: Omit<NotificationLogType, 'id'> = {
      alert_id: typedAlert.id,
      user_id: userId,
      status: 'pending',
      channel: 'sms',
      message: 'Emergency alert sent',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error: notificationError } = await supabase
      .from('notification_logs')
      .insert(notificationLog as any);
    
    if (notificationError) {
      console.error('Error logging notification:', notificationError);
    }

    // Get user's profile for notification
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('name, phone')
      .eq('id', userId)
      .single<{ name: string | null; phone: string | null }>();

    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      throw new Error('Failed to fetch user profile');
    }

    if (!userProfile) {
      throw new Error('User profile not found');
    }

    const userName = userProfile.name || 'A user';
    const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const timestamp = new Date().toLocaleString();
    const testPrefix = isTest ? '[TEST] ' : '';

    // Prepare notification data
    const notificationData = {
      alert_id: alert.id,
      userId,
      userName,
      location: { latitude, longitude, accuracy },
      timestamp,
      mapUrl,
      isTest,
    };

    // Send notifications if not in test mode
    let notificationsSent = 0;
    const errors: { contactId: string; error: string }[] = [];

    if (!isTest && userSettings?.send_sms !== false && activeContacts.length > 0) {
      const smsPromises = activeContacts.map(async (contact) => {
        try {
          const message = `${testPrefix}EMERGENCY ALERT from ${userName} (${userProfile.phone || 'unknown number'})!\n\n` +
            `Location: ${mapUrl}\n` +
            `Time: ${timestamp}\n` +
            `Accuracy: ${accuracy ? `${accuracy}m` : 'Unknown'}\n\n` +
            `This is ${isTest ? 'a TEST ' : 'an '}emergency alert sent through AquaLink.`;

          if (process.env.NODE_ENV === 'production' || isTest) {
            await twilioClient?.messages.create({
              body: message,
              from: process.env.TWILIO_PHONE_NUMBER!,
              to: contact.phone_number
            });
          } else {
            console.log('SMS not sent in development mode. Message would be:', { 
              to: contact.phone_number, 
              message 
            });
          }

          return { success: true, contactId: contact.id };
        } catch (error) {
          console.error(`Error sending SMS to ${contact.phone_number}:`, error);
          return { 
            success: false, 
            contactId: contact.id, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          };
        }
      });

      const results = await Promise.all(smsPromises);
      notificationsSent = results.filter((result) => result.success).length;
      
      // Collect errors
      results.filter((result) => !result.success).forEach((result) => {
        if (result.contactId) {
          errors.push({
            contactId: result.contactId,
            error: result.error || 'Unknown error occurred'
          });
        }
      });
    }

    // Update alert with actual notifications sent and status
    const updateData: Partial<Database['public']['Tables']['emergency_alerts']['Update']> = {
      status: (isTest ? 'test' : 'active') as AlertStatus,
      updated_at: new Date().toISOString(),
      ...(notificationsSent > 0 ? { contacts_notified: notificationsSent } : {})
    };

    const { error: updateError } = await supabase
      .from('emergency_alerts')
      .update(updateData as never)
      .eq('id', alert.id);

    if (updateError) {
      console.error('Failed to update alert status:', updateError);
    }

    // Prepare response
    const response = {
      success: true,
      alertId: alert.id,
      isTest,
      contactsNotified: notificationsSent,
      totalContacts: activeContacts.length,
      errors: errors.length > 0 ? errors : undefined,
      message: isTest 
        ? 'Test alert processed successfully' 
        : `Emergency alert sent to ${notificationsSent} of ${activeContacts.length} contact(s)`,
      timestamp: new Date().toISOString()
    };

    // Send the response
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error in emergency alert handler:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to process emergency alert',
      details: error instanceof Error ? error.message : 'Unknown error',
      code: 'internal_server_error'
    });
  }
}
