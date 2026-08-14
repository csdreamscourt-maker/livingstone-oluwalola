-- AI usage observability. Deliberately does not store prompt/response content or any
-- dream text — only call metadata (task, provider, model, timing, outcome) — so this
-- table stays safe to keep and to show in the admin dashboard.

create table if not exists public.ai_usage_logs (
  id uuid default uuid_generate_v4() primary key,
  task_key text not null,
  provider text not null,
  model text not null,
  success boolean not null,
  used_fallback boolean not null default false,
  latency_ms integer not null,
  error_message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists ai_usage_logs_created_at_idx on public.ai_usage_logs(created_at desc);
create index if not exists ai_usage_logs_task_key_idx on public.ai_usage_logs(task_key);
