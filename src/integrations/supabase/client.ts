// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wdnjgidekqinzqnimkaj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkbmpnaWRla3Fpbnpxbmlta2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MjgyMTksImV4cCI6MjA2MDQwNDIxOX0.g5rbsGwRI8GmJHbf9Fm_ajgUR_ZGaksTEKOFboRWTME";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);