-- Align catches.status to use moderation states: pending/approved/rejected
-- and allow public read of approved listings for marketplace visibility.

-- Relax old constraint and move existing data
alter table public.catches drop constraint if exists catches_status_check;

-- Map legacy statuses to new ones where possible
update public.catches set status = 'approved' where status = 'available';

-- Add new constraint
alter table public.catches
  add constraint catches_status_check
  check (status in ('pending','approved','rejected'));

-- Set default to approved so new inserts surface to buyers immediately
alter table public.catches alter column status set default 'approved';

-- Ensure RLS allows buyers to read approved catches
-- Enable RLS (no-op if already enabled)
alter table public.catches enable row level security;

-- Drop conflicting select policy if exists
drop policy if exists "Users can view their own catches" on public.catches;

-- Replace with two policies: public can read approved; owners can read their own
create policy "public can read approved catches"
  on public.catches for select
  using (status = 'approved');

create policy "owners can read their catches"
  on public.catches for select
  using (auth.uid() = fisher_id);


