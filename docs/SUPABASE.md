# Supabase Integration Guide

This document provides comprehensive information about Supabase integration in the Genius Online Navigator platform.

## Overview

Genius Online Navigator uses [Supabase](https://supabase.com/) as its backend service, providing:

- Authentication and user management
- Database for storing application data
- Real-time updates for collaborative features
- Storage for user files and assets
- Edge functions for serverless operations

## Setup Instructions

### 1. Create Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com) and sign in
2. Click "New Project"
3. Fill in the details:
   - Organization: Your organization
   - Name: genius-online-navigator (or your preferred name)
   - Database Password: (generate a strong password)
   - Region: (choose closest to your users)
4. Click "Create new project" and wait for deployment
5. Note your Project URL and Anon Key from the API settings

### 2. Configure Environment Variables

Create a `.env.local` file in your frontend root with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_KEY=your-anon-key
```

For production deployment, set these variables in your hosting platform's environment settings.

### 3. Database Schema Migration

Run these SQL commands in the Supabase SQL editor to set up the initial schema:

```sql
-- Core authentication tables are created automatically

-- Context chain for AI content generation
create table if not exists context_chain (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  model_type text not null,
  context jsonb not null,
  session_id uuid not null default uuid_generate_v4(),
  timestamp timestamptz not null default now()
);

-- AI suggestions storage
create table if not exists ai_suggestions (
  id uuid primary key default uuid_generate_v4(),
  content_hash text not null,
  suggestions jsonb not null,
  created_at timestamptz not null default now()
);

-- Set up organization and teams
create table if not exists organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists organization_members (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  unique(organization_id, user_id)
);

-- Enable Row Level Security
alter table context_chain enable row level security;
alter table ai_suggestions enable row level security;
alter table organizations enable row level security;
alter table organization_members enable row level security;
```

### 4. Set Up Row Level Security (RLS)

For each table, set up appropriate RLS policies:

#### Context Chain RLS

```sql
-- Allow users to read/write only their own context chains
create policy "Users can read their own context chains"
  on context_chain for select
  using (auth.uid() = user_id);

create policy "Users can insert their own context chains"
  on context_chain for insert
  with check (auth.uid() = user_id);
```

#### AI Suggestions RLS

```sql
-- Everyone can read AI suggestions
create policy "Anyone can read AI suggestions"
  on ai_suggestions for select
  to authenticated
  using (true);

-- Only admins can insert new AI suggestions
create policy "Only admins can insert AI suggestions"
  on ai_suggestions for insert
  to authenticated
  using (
    auth.uid() in (
      select user_id from organization_members
      where role in ('admin', 'owner')
    )
  );
```

#### Organizations RLS

```sql
-- Users can read organizations they're members of
create policy "Users can read their organizations"
  on organizations for select
  using (
    auth.uid() in (
      select user_id from organization_members
      where organization_id = organizations.id
    )
  );

-- Only owners can update their organizations
create policy "Owners can update their organizations"
  on organizations for update
  using (
    auth.uid() in (
      select user_id from organization_members
      where organization_id = organizations.id
      and role = 'owner'
    )
  );
```

### 5. Install Required Dependencies

```bash
npm install @supabase/supabase-js
```

## Implementation Details

### Initializing Supabase Client

Create a client utility file (`src/lib/supabase.ts`):

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
```

### Authentication Implementation

Example authentication hook (`src/hooks/useAuth.ts`):

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const { data: { session } } = supabase.auth.getSession();
    setUser(session?.user || null);
    setLoading(false);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
```

### Context Persistence Hook

The `useMCP` (Model Context Persistence) hook for storing AI context:

```typescript
import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';

export function useMCP() {
  const { user } = useAuth();

  const saveContext = useCallback(async (modelType: string, context: object) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('context_chain')
      .insert({
        user_id: user.id,
        model_type: modelType,
        context,
      })
      .select();

    if (error) {
      console.error('Error saving context:', error);
      return null;
    }

    return data[0];
  }, [user]);

  const getContextHistory = useCallback(async (modelType: string) => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('context_chain')
      .select('*')
      .eq('user_id', user.id)
      .eq('model_type', modelType)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching context history:', error);
      return [];
    }

    return data;
  }, [user]);

  return { saveContext, getContextHistory };
}
```

### Real-time Subscriptions

Example of using real-time subscriptions for AI suggestions:

```typescript
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

function AISuggestionComponent({ contentHash }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Initial fetch
    const fetchSuggestions = async () => {
      const { data, error } = await supabase
        .from('ai_suggestions')
        .select('*')
        .eq('content_hash', contentHash);
      
      if (error) {
        console.error('Error fetching suggestions:', error);
        return;
      }
      
      setSuggestions(data || []);
    };
    
    fetchSuggestions();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('ai_suggestions_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'ai_suggestions', filter: `content_hash=eq.${contentHash}` },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setSuggestions((prev) => 
              prev.map((s) => (s.id === payload.new.id ? payload.new : s))
            );
          }
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [contentHash]);

  return (
    <div>
      {/* Render suggestions */}
    </div>
  );
}
```

## Security Best Practices

1. **Never expose service role keys** in frontend code
2. **Always use Row Level Security** (RLS) to restrict access to data
3. **Validate user input** before inserting into the database
4. **Use prepared statements** to prevent SQL injection
5. **Implement proper error handling** to avoid leaking sensitive information
6. **Set up automated backups** for your database
7. **Monitor your Supabase logs** for suspicious activity

## Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check that your environment variables are correctly set
   - Ensure your Supabase project has email authentication enabled

2. **RLS blocking legitimate requests**
   - Review your RLS policies to ensure they're correctly implemented
   - Check the Supabase logs for RLS policy violations

3. **Real-time subscriptions not working**
   - Verify you're using the correct channel name and filter
   - Ensure that your subscription is properly cleaned up on component unmount

## Advanced Features

### Storage Integration

Upload files to Supabase Storage:

```typescript
async function uploadFile(file, bucket) {
  const filename = `${Math.random().toString(36).substring(2)}-${file.name}`;
  
  const { data, error } = await supabase
    .storage
    .from(bucket)
    .upload(filename, file);
    
  if (error) {
    console.error('Error uploading file:', error);
    return null;
  }
  
  return data;
}
```

### Edge Functions

Implement serverless functions for complex operations:

1. Create an edge function in Supabase:
   ```bash
   npx supabase functions new process-image
   ```

2. Implement the function:
   ```typescript
   // supabase/functions/process-image/index.ts
   import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

   serve(async (req) => {
     const { image } = await req.json();
     
     // Process image logic here
     
     return new Response(JSON.stringify({ 
       success: true,
       result: 'processed-image-url'
     }), {
       headers: { 'Content-Type': 'application/json' },
     });
   });
   ```

3. Deploy the function:
   ```bash
   npx supabase functions deploy process-image
   ```

4. Call the function from your frontend:
   ```typescript
   const { data, error } = await supabase.functions.invoke('process-image', {
     body: { image: imageUrl },
   });
   ```

## References

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://github.com/supabase/supabase-js)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers) 