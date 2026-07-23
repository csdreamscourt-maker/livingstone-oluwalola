-- Moves the marketing site's Frameworks, Companies, and Articles/Ideas
-- content from hardcoded lib/constants.ts + inline detail records into
-- the database, so they become admin-editable instead of code-only.

create table if not exists public.frameworks (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  title text not null,
  description text,
  category text,
  overview text,
  applications text[],
  is_published boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.companies (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  name text not null,
  description text,
  category text,
  tagline text,
  summary text,
  highlights text[],
  logo_url text,
  is_published boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.ideas_articles (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  title text not null,
  excerpt text,
  category text,
  read_time text,
  published_date date,
  body text[],
  is_published boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_frameworks_is_published on public.frameworks(is_published);
create index if not exists idx_companies_is_published on public.companies(is_published);
create index if not exists idx_ideas_articles_is_published on public.ideas_articles(is_published);

-- Seed with the current static content so the site keeps working identically
-- once pages switch to reading from these tables.

insert into public.frameworks (slug, title, description, category, overview, applications) values
('mind-engineering', 'Mind Engineering', 'A model for deliberately shaping thought patterns, convictions, and mental infrastructure for high-level execution.', 'Growth',
  'Mind Engineering is a discipline for deliberately shaping thought patterns, convictions, and mental infrastructure — treating the mind as a system that can be designed for high-level execution rather than left to drift.',
  array['Auditing inherited beliefs before they drive decisions', 'Designing daily disciplines that reinforce chosen convictions', 'Building mental models that hold up under pressure']),
('outlier-potential', 'Outlier Potential', 'A framework for identifying and breaking free from conventional thinking to access uncommon results.', 'Strategy',
  'A framework for identifying where conventional thinking is quietly capping your results, and deliberately choosing a less-traveled — but more honest — path.',
  array['Stress-testing "best practice" against first principles', 'Distinguishing genuine risk from mere unfamiliarity', 'Building strategy around uncommon, defensible advantages']),
('redemptive-sagacity', 'Redemptive Sagacity', 'Grounding strategic wisdom in eternal principles — sourcing models for growth from biblical truth.', 'Faith',
  'Grounding strategic wisdom in eternal principle rather than personal preference — sourcing models for growth from biblical truth so they hold up over time.',
  array['Evaluating strategy against enduring principle, not just market trend', 'Integrating spiritual conviction into business decision-making', 'Building institutions designed to serve people, not just outcomes']),
('building-convictions', 'Building Convictions', 'A discipline for forming the character and clarity of purpose that outlast circumstance.', 'Leadership',
  'A discipline for forming the character and clarity of purpose that outlast circumstance — because charisma without conviction does not survive pressure.',
  array['Clarifying non-negotiables before a crisis forces the question', 'Developing leaders whose character matches their competence', 'Creating cultures where integrity is structural, not incidental']),
('nation-building', 'Nation Building', 'Institutional design principles for leaders working at the scale of communities and nations.', 'Strategy',
  'Institutional design principles for leaders working at the scale of communities and nations — building for posterity rather than a single administration or cycle.',
  array['Designing institutions that outlive their founders', 'Sequencing reform for durability over speed', 'Aligning social impact work with long-term capacity building']),
('systems-thinking', 'Faith-Driven Systems Thinking', 'Integrating spiritual principles with strategic planning to design for purposeful endurance.', 'Faith',
  'Faith-Driven Systems Thinking integrates spiritual principle with strategic planning, designing for purposeful endurance rather than short-term wins.',
  array['Mapping how spiritual conviction shapes organizational strategy', 'Designing feedback loops that reinforce mission over metrics alone', 'Building plans that account for both the seen and the unseen'])
on conflict (slug) do nothing;

insert into public.companies (slug, name, description, category, tagline, summary, highlights, logo_url) values
('dreamscourt', 'Dreamscourt', 'A private spiritual intelligence platform for dream capture, prayer journaling, and reflective pattern recognition.', 'Companies & Startups',
  'AI-powered dream journal and spiritual insights platform',
  'Dreamscourt helps people capture, reflect on, and interpret dreams through a thoughtful blend of technology and spiritual care.',
  array['Daily dream journaling with guided reflection prompts', 'AI-powered interpretations rooted in personal insight and spiritual context', 'A calm, modern experience for growth and self-discovery'],
  '/brand/dreamscourt-logo-color.png'),
('house-of-uphaz', 'House of Uphaz', 'Institutional development and leadership training for organizations building lasting capacity.', 'Companies & Startups',
  'Institutional development and leadership training',
  'House of Uphaz supports organizations and leaders through leadership development, systems thinking, and institutional strengthening.',
  array['Leadership formation for mission-driven institutions', 'Systems and strategy support for long-term growth', 'Practical guidance for building durable organizations'],
  null),
('adjunct-corporation', 'Adjunct Corporation', 'Strategic advisory and business systems design for founders and executive teams.', 'Companies & Startups',
  'Strategic advisory and business systems',
  'Adjunct Corporation helps businesses design smarter systems, sharpen strategy, and execute with clarity.',
  array['Strategic advisory for founders and teams', 'Operational systems that support sustainable growth', 'A disciplined approach to decision-making and execution'],
  null),
('eternity-windows', 'Eternity Windows Publication', 'A publishing house for thought leadership at the intersection of theology, strategy, and culture.', 'Companies & Startups',
  'Publishing thought leadership and theological insights',
  'Eternity Windows publishes thoughtful writing that connects faith, leadership, and cultural renewal.',
  array['Deep reflections on faith and leadership', 'Thoughtful publications for modern audiences', 'A platform for shaping meaningful conversations'],
  null),
('agenda58', 'Agenda58 Foundation', 'Social impact initiatives focused on community transformation and nation building.', 'Social Impact',
  'Social impact and community transformation',
  'Agenda58 Foundation focuses on community transformation, social impact, and strategic service initiatives.',
  array['Community-centered transformation efforts', 'Programs designed for lasting social change', 'A commitment to practical impact and stewardship'],
  null),
('young-ministers', 'Young Ministers Training School', 'Formation and leadership development for a rising generation of faith-centered ministers.', 'Faith-Based',
  'Leadership development for emerging ministers',
  'Young Ministers Training School equips emerging leaders with practical skills, spiritual grounding, and institutional awareness.',
  array['Training for new and emerging ministers', 'Leadership development rooted in service and excellence', 'Mentorship for sustainable impact'],
  null)
on conflict (slug) do nothing;

insert into public.ideas_articles (slug, title, excerpt, category, read_time, published_date, body) values
('outlier-edge', 'The Outlier Edge: Why the Conventional Path Rarely Leads to Uncommon Results',
  'Those who change the world don''t think like the masses. On breaking free from the less profitable conventional flow of life.',
  'Strategy', '6 min read', '2026-06-02',
  array['Most institutions are optimized for the average outcome. They reward conformity, standardize risk, and quietly discourage the very thinking that produces breakthroughs. If your ambition is an uncommon result, an average process will not get you there.',
        'Outlierness is not contrarianism for its own sake. It is the discipline of testing every inherited assumption against first principles before accepting it as true. Some conventions survive that test. Most do not.',
        'The leaders and builders I work with are rarely reckless. They are simply unwilling to let convenience substitute for conviction. That distinction — between comfort and clarity — is where outlier potential actually lives.']),
('building-what-lasts', 'Building First, What Lasts',
  'A case for purposeful endurance over short-term wins, and why the strongest institutions are built for the long run.',
  'Institutional Development', '7 min read', '2026-05-14',
  array['Every institution eventually faces the same test: does it depend on the person who built it, or can it outlive them? Most do not survive that transition, because they were never designed to.',
        'Building for posterity means making unglamorous choices early — documenting judgment instead of just exercising it, distributing conviction instead of concentrating it, and measuring success in decades rather than quarters.',
        'This is slower than chasing the next win. It is also the only strategy that compounds.']),
('faith-and-strategy', 'Faith and Strategy Are Not Opposites',
  'Every durable framework for growth is sourced from principle, not preference. On grounding strategic thinking in eternal truth.',
  'Faith', '5 min read', '2026-04-22',
  array['It is tempting to treat faith as a private matter and strategy as a technical one — as if the two occupy separate rooms in the same building. In practice, the strongest strategic thinking I have encountered is never value-neutral. It is anchored to something.',
        'For the LO brand, that anchor is a redemptive thought process grounded in honour for God and love for humanity. Every model and framework for growth is sourced from principles that guarantee building for posterity, not just for the current cycle.',
        'This is not a constraint on ambition. It is what makes ambition sustainable.'])
on conflict (slug) do nothing;
