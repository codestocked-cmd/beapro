-- Be A Pro — Initial Schema
-- Supabase Auth handles user authentication (auth.users table)
-- This schema extends with profile and app data

-- User profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  name text,
  belt text check (belt in ('white','blue','purple','brown','black')) default 'white',
  weight_class text,
  competition_level text check (competition_level in ('recreational','amateur','competitor','pro')) default 'recreational',
  photo_url text,
  plan text check (plan in ('starter','pro','elite')) default 'starter',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security
alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, belt, competition_level)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    coalesce(new.raw_user_meta_data->>'belt', 'white'),
    coalesce(new.raw_user_meta_data->>'competition_level', 'recreational')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage buckets for videos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('scout-videos', 'scout-videos', false, 2147483648, array['video/mp4','video/quicktime','video/avi','video/x-msvideo']),
  ('training-videos', 'training-videos', false, 2147483648, array['video/mp4','video/quicktime','video/avi','video/x-msvideo'])
on conflict (id) do nothing;

-- Storage RLS
create policy "Authenticated users can upload scout videos"
  on storage.objects for insert
  with check (bucket_id = 'scout-videos' and auth.role() = 'authenticated');

create policy "Authenticated users can read their own scout videos"
  on storage.objects for select
  using (bucket_id = 'scout-videos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Authenticated users can upload training videos"
  on storage.objects for insert
  with check (bucket_id = 'training-videos' and auth.role() = 'authenticated');

create policy "Authenticated users can read their own training videos"
  on storage.objects for select
  using (bucket_id = 'training-videos' and auth.uid()::text = (storage.foldername(name))[1]);
