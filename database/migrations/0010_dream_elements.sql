-- Personal Dream Memory: durable per-dream extracted elements (people, places, numbers,
-- colors, symbols, emotions) so recurring patterns can be surfaced across a user's own
-- dream archive during future interpretations. Extraction happens as part of the normal
-- AI interpretation call (the model returns them alongside the interpretation) rather than
-- a separate analysis pass. Per the founder's own teaching against overreading, recurrence
-- is surfaced as an observation for the dreamer to weigh -- never asserted as significance.

create table if not exists public.dream_elements (
  id uuid default uuid_generate_v4() primary key,
  dream_id uuid not null references public.dreams(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  element_type text not null check (element_type in ('person', 'place', 'number', 'color', 'symbol', 'emotion')),
  value text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists dream_elements_dream_id_idx on public.dream_elements(dream_id);
create index if not exists dream_elements_lookup_idx on public.dream_elements(user_id, element_type, lower(value));
