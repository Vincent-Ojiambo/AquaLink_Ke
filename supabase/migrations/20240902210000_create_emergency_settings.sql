-- Create emergency_settings table
CREATE TABLE IF NOT EXISTS public.emergency_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  auto_send_location BOOLEAN DEFAULT true,
  send_sms BOOLEAN DEFAULT true,
  make_emergency_call BOOLEAN DEFAULT false,
  share_live_location BOOLEAN DEFAULT true,
  sos_countdown_seconds INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.emergency_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own emergency settings"
  ON public.emergency_settings
  FOR ALL
  USING (auth.uid() = user_id);

-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_emergency_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_emergency_settings_updated_at
BEFORE UPDATE ON public.emergency_settings
FOR EACH ROW
EXECUTE FUNCTION update_emergency_settings_updated_at();

-- Create default settings for existing users
INSERT INTO public.emergency_settings (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;
