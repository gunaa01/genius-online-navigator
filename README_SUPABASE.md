# Supabase Setup for Genius Online Navigator

## 1. Create Supabase Project
- Go to https://app.supabase.com and create a new project.
- Note your Project URL and Anon Key.

## 2. Configure Environment Variables
Create `.env.local` in your frontend root:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_KEY=your-anon-key
```

## 3. Database Schema Migration
Run these SQL commands in Supabase SQL editor:
```sql
create table if not exists context_chain (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  model_type text not null,
  context jsonb not null,
  session_id uuid not null default uuid_generate_v4(),
  timestamp timestamptz not null default now()
);

create table if not exists ai_suggestions (
  id uuid primary key default uuid_generate_v4(),
  content_hash text not null,
  suggestions jsonb not null,
  created_at timestamptz not null default now()
);

alter table context_chain enable row level security;
alter table ai_suggestions enable row level security;
```

## 4. Enable Row Level Security (RLS)
- In Supabase dashboard, go to each table > RLS > Enable.
- Add policies to allow access only for authenticated users.

## 5. Install Dependencies
```
npm install @supabase/supabase-js
```

## 6. Test Connection
- Run your app and ensure Supabase client connects without errors.

---

# Usage in Code
- Use the `useMCP` hook for context chain management.
- Use Supabase client for real-time AI suggestion updates.

---

# Security
- Never expose service role keys in frontend code.
- Always validate user input and enforce RLS.

---

# References
- [Supabase Docs](https://supabase.com/docs)
- [@supabase/supabase-js](https://github.com/supabase/supabase-js)
