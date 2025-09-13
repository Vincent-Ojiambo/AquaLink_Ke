-- Create or replace the update_profile function
CREATE OR REPLACE FUNCTION public.update_profile(
  p_id uuid,
  p_updates jsonb
) 
RETURNS SETOF profiles
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  UPDATE profiles
  SET 
    name = COALESCE(p_updates->>'name', name),
    phone = COALESCE(p_updates->>'phone', phone),
    email = COALESCE(p_updates->>'email', email),
    avatar_url = COALESCE(p_updates->>'avatar_url', avatar_url),
    region = COALESCE(p_updates->>'region', region),
    license_number = COALESCE(p_updates->>'license_number', license_number),
    years_of_experience = COALESCE((p_updates->>'years_of_experience')::integer, years_of_experience),
    user_type = COALESCE(p_updates->>'user_type', user_type, 'fisher'),
    updated_at = NOW()
  WHERE id = p_id
  RETURNING *;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.update_profile(uuid, jsonb) TO authenticated;
