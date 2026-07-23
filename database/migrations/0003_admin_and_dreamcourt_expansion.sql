-- Adds role-based access (for the super admin backend) and the schema
-- needed for Dream Court's other four branches (Community, Academy,
-- Dream Lab, Library) plus folders/voice on the existing Journal.

alter table public.users
  add column if not exists role text not null default 'user' check (role in ('user', 'admin'));

create table if not exists public.dream_folders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references public.users on delete cascade,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.dreams
  add column if not exists folder_id uuid references public.dream_folders(id) on delete set null;

create table if not exists public.courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  description text,
  price_display text,
  selar_url text,
  thumbnail_url text,
  is_published boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.dream_symbols (
  id uuid default uuid_generate_v4() primary key,
  term text not null,
  meaning text not null,
  category text,
  scripture_reference text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.dream_articles (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  body text,
  category text,
  is_published boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.store_products (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  price_display text,
  selar_url text,
  cover_image_url text,
  is_published boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.dream_lab_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid not null references public.users on delete cascade,
  dream_id uuid references public.dreams on delete set null,
  prompt text not null,
  interpretation text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.site_settings (
  key text primary key,
  value text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

insert into public.site_settings (key, value)
values ('whatsapp_community_link', 'http://bit.ly/DREAMCOURT')
on conflict (key) do nothing;

create index if not exists idx_dream_folders_user_id on public.dream_folders(user_id);
create index if not exists idx_dreams_folder_id on public.dreams(folder_id);
create index if not exists idx_dream_lab_sessions_user_id on public.dream_lab_sessions(user_id);
create index if not exists idx_courses_is_published on public.courses(is_published);
create index if not exists idx_dream_articles_is_published on public.dream_articles(is_published);
create index if not exists idx_store_products_is_published on public.store_products(is_published);
