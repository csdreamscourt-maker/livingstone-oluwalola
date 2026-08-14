-- Versioned, admin-editable AI system prompts. A "slot" is a named prompt purpose
-- (e.g. the dream interpretation methodology prompt); each edit creates a new
-- immutable version, and a slot points at whichever version is currently published.
-- Rolling back is just re-publishing an older version — history is never destroyed.

create table if not exists public.ai_prompt_slots (
  key text primary key,
  label text not null,
  description text,
  published_version_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.ai_prompt_versions (
  id uuid default uuid_generate_v4() primary key,
  slot_key text not null references public.ai_prompt_slots(key) on delete cascade,
  content text not null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  author text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists ai_prompt_versions_slot_key_idx on public.ai_prompt_versions(slot_key);

alter table public.ai_prompt_slots
  add constraint ai_prompt_slots_published_version_fk
  foreign key (published_version_id) references public.ai_prompt_versions(id) on delete set null;
