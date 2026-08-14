-- Founder Knowledge Engine: stores the founder's books, journals, articles, and future
-- content as searchable, source-attributed knowledge that grounds Dreamscourt's AI
-- interpretation instead of relying on the model's generic training knowledge.
--
-- knowledge_sources: one row per book/journal/article/video/etc, with the full extracted
-- text and processing status. knowledge_chunks: the semantic chunks of a source's text,
-- each with an embedding for retrieval and enough metadata (page, chapter) to cite back
-- to the source precisely.

create extension if not exists vector;

create table if not exists public.knowledge_sources (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  author text,
  source_type text not null check (source_type in ('book', 'journal', 'article', 'sermon', 'video_transcript', 'audio_transcript', 'social_post', 'document')),
  tier integer not null default 1,
  publication_date date,
  url text,
  description text,
  full_text text,
  topics text[],
  tags text[],
  scripture_references text[],
  framework_categories text[],
  processing_status text not null default 'pending' check (processing_status in ('pending', 'processing', 'indexed', 'published', 'failed', 'needs_review')),
  processing_error text,
  version integer not null default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.knowledge_chunks (
  id uuid default uuid_generate_v4() primary key,
  source_id uuid not null references public.knowledge_sources(id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  page integer,
  chapter text,
  embedding vector(1536),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists knowledge_chunks_source_id_idx on public.knowledge_chunks(source_id);
create index if not exists knowledge_chunks_embedding_idx on public.knowledge_chunks using hnsw (embedding vector_cosine_ops);
