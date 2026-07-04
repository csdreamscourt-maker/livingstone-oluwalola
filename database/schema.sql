-- Livingstone Dreamscourt Database Schema
-- Neon PostgreSQL Schema

-- Enable necessary extensions
create extension if not exists "uuid-ossp";
do $$
begin
  if exists (
    select 1
    from pg_available_extensions
    where name = 'vector'
  ) then
    execute 'create extension if not exists "vector"';
  end if;
end
$$;

-- Users table (standalone authentication)
create table if not exists public.users (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  password_hash text not null,
  full_name text,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Sessions table for authentication
create table if not exists public.sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references public.users on delete cascade,
  token text unique not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Dreams table
create table if not exists public.dreams (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references public.users on delete cascade,
  title text not null,
  description text,
  content text,
  date_occurred timestamp with time zone not null,
  mood text,
  tags text[],
  voice_recording_url text,
  is_private boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint dreams_user_id_date_occurred_unique unique (user_id, date_occurred)
);

-- Dream interpretations (AI-generated)
create table if not exists public.dream_interpretations (
  id uuid default uuid_generate_v4() primary key,
  dream_id uuid not null references public.dreams on delete cascade,
  user_id uuid not null references public.users on delete cascade,
  interpretation text not null,
  key_themes text[],
  symbolic_meanings text,
  psychological_insights text,
  biblical_references text[],
  confidence_score numeric(3,2),
  model_used text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint dream_interpretations_dream_id_unique unique (dream_id)
);

-- Prayer journal entries
create table if not exists public.prayer_journal (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references public.users on delete cascade,
  title text not null,
  content text not null,
  prayer_type text, -- 'intercession', 'thanksgiving', 'petition', 'praise', 'confession'
  date_prayed timestamp with time zone not null,
  tags text[],
  is_answered boolean default false,
  answer_date timestamp with time zone,
  answer_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Biblical references linked to dreams
create table if not exists public.biblical_references (
  id uuid default uuid_generate_v4() primary key,
  dream_id uuid not null references public.dreams on delete cascade,
  book text not null,
  chapter integer not null,
  verse integer not null,
  text text,
  relevance_explanation text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Prayer recommendations based on dreams
create table if not exists public.prayer_recommendations (
  id uuid default uuid_generate_v4() primary key,
  dream_id uuid not null references public.dreams on delete cascade,
  user_id uuid not null references public.users on delete cascade,
  prayer_focus text not null,
  suggested_scripture text,
  action_items text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Dream insights/reflections
create table if not exists public.dream_insights (
  id uuid default uuid_generate_v4() primary key,
  dream_id uuid not null references public.dreams on delete cascade,
  user_id uuid not null references public.users on delete cascade,
  insight_type text, -- 'personal', 'spiritual', 'psychological'
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Dream tags for categorization
create table if not exists public.dream_tags (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references public.users on delete cascade,
  tag_name text not null,
  color text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint dream_tags_user_id_tag_name_unique unique (user_id, tag_name)
);

-- Analytics/tracking data
create table if not exists public.user_analytics (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references public.users on delete cascade,
  total_dreams integer default 0,
  dreams_this_month integer default 0,
  prayers_recorded integer default 0,
  streak_days integer default 0,
  last_dream_date timestamp with time zone,
  last_prayer_date timestamp with time zone,
  total_insights integer default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint user_analytics_user_id_unique unique (user_id)
);

-- Daily reflections/affirmations
create table if not exists public.daily_reflections (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references public.users on delete cascade,
  date date not null,
  reflection_prompt text,
  user_response text,
  mood_rating integer,
  gratitude_items text[],
  challenges text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint daily_reflections_user_id_date_unique unique (user_id, date)
);

-- Saved frameworks and resources
create table if not exists public.saved_frameworks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references public.users on delete cascade,
  framework_id text not null,
  framework_title text,
  notes text,
  is_favorited boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint saved_frameworks_user_id_framework_id_unique unique (user_id, framework_id)
);

-- Newsletter subscriptions
create table if not exists public.newsletter_subscriptions (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  is_subscribed boolean default true,
  subscribed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unsubscribed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes for performance
create index idx_dreams_user_id on public.dreams(user_id);
create index idx_dreams_date_occurred on public.dreams(date_occurred);
create index idx_dreams_tags on public.dreams using gin(tags);
create index idx_dream_interpretations_user_id on public.dream_interpretations(user_id);
create index idx_prayer_journal_user_id on public.prayer_journal(user_id);
create index idx_prayer_journal_date_prayed on public.prayer_journal(date_prayed);
create index idx_daily_reflections_user_id on public.daily_reflections(user_id);
create index idx_daily_reflections_date on public.daily_reflections(date);
create index idx_saved_frameworks_user_id on public.saved_frameworks(user_id);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.dreams enable row level security;
alter table public.dream_interpretations enable row level security;
alter table public.prayer_journal enable row level security;
alter table public.biblical_references enable row level security;
alter table public.prayer_recommendations enable row level security;
alter table public.dream_insights enable row level security;
alter table public.dream_tags enable row level security;
alter table public.user_analytics enable row level security;
alter table public.daily_reflections enable row level security;
alter table public.saved_frameworks enable row level security;

-- RLS Policies
-- Neon-compatible policies: use a simple owner-based rule that can be adapted
-- once a custom auth layer is wired up.
create policy "Users can view their own profile" on public.users
  for select using (true);

create policy "Users can update their own profile" on public.users
  for update using (true);

create policy "Users can view their own dreams" on public.dreams
  for select using (true);

create policy "Users can manage their own dreams" on public.dreams
  for all using (true);

create policy "Users can view dream interpretations for their dreams" on public.dream_interpretations
  for select using (true);

create policy "Users can manage their prayer journal" on public.prayer_journal
  for all using (true);

create policy "Users can view their daily reflections" on public.daily_reflections
  for all using (true);

create policy "Users can manage their saved frameworks" on public.saved_frameworks
  for all using (true);
