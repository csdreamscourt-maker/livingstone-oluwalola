-- Lets the super admin configure third-party credentials (OpenAI, Resend,
-- Cloudflare R2) from the UI instead of editing .env files. Values are
-- encrypted at rest by the application (see lib/secrets.ts) — this table
-- never stores plaintext.
create table if not exists public.app_secrets (
  key text primary key,
  value_encrypted text not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
