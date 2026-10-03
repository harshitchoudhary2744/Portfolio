-- ==============================================================================
-- Migration: 001_projects.sql
-- Description: Create projects table with RLS, indexes, and automatic timestamp trigger
-- Database: Supabase PostgreSQL
-- ==============================================================================

-- 1. Create table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  long_description text,
  category text,
  tech_stack text[] not null default '{}',
  github_url text,
  live_url text,
  image_url text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Indexes for performance
create index if not exists projects_slug_idx on public.projects (slug);
create index if not exists projects_sort_order_idx on public.projects (sort_order asc, created_at desc);
create index if not exists projects_category_idx on public.projects (category);
create index if not exists projects_featured_idx on public.projects (featured);

-- 3. Automatic updated_at timestamp trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row
execute function public.handle_updated_at();

-- 4. Enable Row Level Security (RLS)
alter table public.projects enable row level security;

-- 5. Policies
-- Public Read: Anyone can view portfolio projects
drop policy if exists "Public projects are viewable by everyone" on public.projects;
create policy "Public projects are viewable by everyone"
on public.projects
for select
using (true);

-- Authenticated / Admin / Public Write (controlled via API or Supabase Anon for demo portfolio):
drop policy if exists "Enable insert for all users" on public.projects;
create policy "Enable insert for all users"
on public.projects
for insert
with check (true);

drop policy if exists "Enable update for all users" on public.projects;
create policy "Enable update for all users"
on public.projects
for update
using (true)
with check (true);

drop policy if exists "Enable delete for all users" on public.projects;
create policy "Enable delete for all users"
on public.projects
for delete
using (true);

-- 6. Insert initial seed project if table is empty
insert into public.projects (title, slug, description, long_description, category, tech_stack, github_url, live_url, image_url, featured, sort_order)
values
(
  'AI Code Translator & Optimizer',
  'ai-code-translator',
  'Neural transpiler translating legacy codebases between C++, Python, and Rust with syntax verification and latency analysis.',
  'An advanced transformer-based code translation and AST refactoring engine. It processes complex logic syntax across programming languages while preserving semantics, checking safety constraints, and benchmark performance optimizations.',
  'AI / Machine Learning',
  array['Python', 'PyTorch', 'Transformers', 'FastAPI', 'Tree-sitter'],
  'https://github.com',
  'https://demo.example.com',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  true,
  1
)
on conflict (slug) do nothing;

