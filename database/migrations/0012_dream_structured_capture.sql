-- Grounds the personal dream journal in "The Dreamer's Sacred Space Journal"'s own two real
-- structural ideas: (1) a 9-category taxonomy for classifying a whole dream so it can be
-- "fetched" later ("Destiny Based", "Warning", "Instructive", etc — see Table 0 of the
-- journal), and (2) an optional structured capture for the journal's 12-point recording
-- guide (Events and Symbols already map to dreams.content and dreams.tags; the remaining
-- 10 points get their own optional fields here so a quick freeform entry never gets forced
-- through this level of detail).

alter table public.dreams add column if not exists dream_type text;

create table if not exists public.dream_capture_details (
  id uuid default uuid_generate_v4() primary key,
  dream_id uuid not null references public.dreams(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  people text,
  places text,
  attire text,
  emotions text,
  timing text,
  numbers text,
  colors text,
  sounds text,
  repeated_patterns text,
  ending text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint dream_capture_details_dream_id_unique unique (dream_id)
);

create index if not exists dream_capture_details_dream_id_idx on public.dream_capture_details(dream_id);
