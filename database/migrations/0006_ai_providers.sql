-- Multi-provider AI control center: providers (OpenAI/Anthropic/Google/NVIDIA/custom),
-- their models, and per-task routing with an ordered fallback chain. Provider API keys
-- are encrypted at rest using the same AES-256-GCM scheme as app_secrets (see lib/secrets.ts).

create table if not exists public.ai_providers (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  name text not null,
  kind text not null check (kind in ('openai', 'anthropic', 'google', 'nvidia', 'custom')),
  base_url text,
  api_key_encrypted text,
  enabled boolean not null default true,
  last_tested_at timestamp with time zone,
  last_test_ok boolean,
  last_test_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.ai_models (
  id uuid default uuid_generate_v4() primary key,
  provider_id uuid not null references public.ai_providers(id) on delete cascade,
  model_id text not null,
  display_name text not null,
  supports_text boolean not null default true,
  supports_vision boolean not null default false,
  supports_image_generation boolean not null default false,
  supports_embeddings boolean not null default false,
  context_window integer,
  cost_tier text,
  enabled boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists ai_models_provider_id_idx on public.ai_models(provider_id);

create table if not exists public.ai_task_assignments (
  task_key text primary key,
  primary_model_id uuid references public.ai_models(id) on delete set null,
  fallback_model_ids uuid[] not null default '{}',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
