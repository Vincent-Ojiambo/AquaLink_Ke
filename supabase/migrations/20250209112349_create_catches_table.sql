-- Create a table to store fish catches
create table if not exists public.catches (
  id uuid default gen_random_uuid() primary key,
  fisher_id uuid references auth.users(id) not null,
  fish_type text not null,
  quantity_kg decimal(10, 2) not null,
  catch_date date not null default now(),
  price_per_kg decimal(10, 2) not null,
  status text not null default 'available' check (status in ('available', 'sold', 'discarded')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.catches enable row level security;

-- Create policies for catches
create policy "Users can view their own catches"
  on public.catches for select
  using ( auth.uid() = fisher_id );

create policy "Users can insert their own catches"
  on public.catches for insert
  with check ( auth.uid() = fisher_id );

create policy "Users can update their own catches"
  on public.catches for update
  using ( auth.uid() = fisher_id );

-- Create a function to update the updated_at column
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Create a trigger to update the updated_at column
create trigger on_catches_updated
  before update on public.catches
  for each row execute procedure public.handle_updated_at();
