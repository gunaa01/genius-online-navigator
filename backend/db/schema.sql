-- Supabase Schema for Genius SaaS Platform

-- Users (handled by Supabase Auth, but can extend with profile info)
create table if not exists users (
    id uuid primary key references auth.users(id) on delete cascade,
    email text unique not null,
    name text,
    created_at timestamp with time zone default now()
);

-- Subscriptions
create table if not exists subscriptions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    plan text not null,
    trial_status text,
    renewal_date date,
    created_at timestamp with time zone default now()
);

-- Posts (for scheduling, social, AI content)
create table if not exists posts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    content text not null,
    generated_by_ai boolean default false,
    scheduled_time timestamp with time zone,
    status text default 'pending',
    created_at timestamp with time zone default now()
);

-- AI Reports
create table if not exists ai_reports (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    title text,
    input_data jsonb,
    ai_summary text,
    created_at timestamp with time zone default now()
);

-- Email Campaigns
create table if not exists email_campaigns (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    subject text,
    body text,
    performance jsonb,
    created_at timestamp with time zone default now()
);

-- A/B Tests
create table if not exists ab_tests (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    input_text text,
    variant_a text,
    variant_b text,
    winner text,
    created_at timestamp with time zone default now()
);
