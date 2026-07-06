-- Adds dashboard fields to dreams that the original schema didn't cover:
-- favoriting, archiving, and a 1-5 clarity rating.
alter table public.dreams
  add column if not exists favorite boolean not null default false,
  add column if not exists is_archived boolean not null default false,
  add column if not exists clarity smallint;
