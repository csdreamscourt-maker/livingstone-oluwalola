-- Contact form submissions were previously discarded (the API route returned
-- success without persisting anything). This table gives them a real home.
create table if not exists public.contact_messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_contact_messages_created_at on public.contact_messages(created_at);
