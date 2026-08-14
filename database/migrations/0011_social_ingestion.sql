-- Social ingestion: lets the Founder Knowledge Engine pull in the founder's own public
-- content instead of only the books. Substack and YouTube both publish stable, public feeds
-- (RSS 2.0 and YouTube's Atom video feed) that can be synced automatically. TikTok and
-- Instagram have no such public feed/API, so their content is added manually through the
-- same knowledge_sources table with platform = 'tiktok' | 'instagram' and no connection.
--
-- Each sync connection tracks its own status so the admin UI can show "Sync Now / Last
-- Synced / New Content Found / Failed Content" per platform, per the master implementation
-- prompt's observability requirement for this feature.

create table if not exists public.knowledge_sync_connections (
  id uuid default uuid_generate_v4() primary key,
  platform text not null check (platform in ('substack', 'youtube', 'tiktok', 'instagram')),
  label text not null,
  feed_url text,
  auto_sync boolean not null default false,
  last_synced_at timestamp with time zone,
  last_sync_status text not null default 'idle' check (last_sync_status in ('idle', 'syncing', 'ok', 'failed')),
  last_sync_message text,
  new_content_count integer not null default 0,
  failed_content_count integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.knowledge_sources
  add column if not exists sync_connection_id uuid references public.knowledge_sync_connections(id) on delete set null,
  add column if not exists external_id text,
  add column if not exists platform text;

-- Prevents the same synced post/video from being re-ingested as a duplicate source on every sync.
create unique index if not exists knowledge_sources_connection_external_id_idx
  on public.knowledge_sources(sync_connection_id, external_id)
  where sync_connection_id is not null and external_id is not null;
