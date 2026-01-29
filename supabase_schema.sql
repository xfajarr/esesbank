-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES (Users)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text not null,
  avatar_url text,
  role text default 'Frontend',
  created_at timestamptz default now()
);

-- IDEAS
create table ideas (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  tags text[] default '{}',
  status text default 'Draft',
  level int default 1,
  progress int default 0,
  hackathon_id uuid, -- nullable, FK added later if needed or just loose coupling
  sections jsonb default '{"problem": "", "solution": "", "targetUsers": "", "valueProp": ""}'::jsonb,
  owner_id uuid references profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- TASKS
create table tasks (
  id uuid default uuid_generate_v4() primary key,
  idea_id uuid references ideas(id) on delete cascade not null,
  text text not null,
  completed boolean default false,
  created_at timestamptz default now()
);

-- COMMENTS
create table comments (
  id uuid default uuid_generate_v4() primary key,
  idea_id uuid references ideas(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  text text not null,
  created_at timestamptz default now()
);

-- PRDS
create table prds (
  idea_id uuid references ideas(id) on delete cascade primary key,
  overview text default '',
  goals text default '',
  non_goals text default '',
  user_stories text[] default '{}',
  mvp_scope text[] default '{}',
  success_metrics text[] default '{}',
  risks text[] default '{}',
  open_questions text[] default '{}'
);

-- TECH STACKS
create table tech_stacks (
  idea_id uuid references ideas(id) on delete cascade primary key,
  frontend text[] default '{}',
  backend text[] default '{}',
  infra text[] default '{}',
  apis text[] default '{}',
  notes text default ''
);

-- HACKATHONS
create table hackathons (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  deadline timestamptz not null,
  theme text default '',
  prizes text default '',
  status text default 'Planned'
);

-- ACTIVITIES
create table activities (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade,
  user_name text, -- Cached for performance
  action text not null,
  target text not null,
  timestamp timestamptz default now()
);

-- RLS POLICIES (Simple: Public for now to avoid Auth issues during dev, tighten later)
alter table profiles enable row level security;
create policy "Public profiles" on profiles for all using (true);

alter table ideas enable row level security;
create policy "Public ideas" on ideas for all using (true);

alter table tasks enable row level security;
create policy "Public tasks" on tasks for all using (true);

alter table comments enable row level security;
create policy "Public comments" on comments for all using (true);

alter table prds enable row level security;
create policy "Public prds" on prds for all using (true);

alter table tech_stacks enable row level security;
create policy "Public tech_stacks" on tech_stacks for all using (true);

alter table hackathons enable row level security;
create policy "Public hackathons" on hackathons for all using (true);

alter table activities enable row level security;
create policy "Public activities" on activities for all using (true);
