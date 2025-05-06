// Polyfill for TextEncoder/TextDecoder which is missing in Jest's JSDOM environment
if (typeof TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
  global.TextDecoder = require('util').TextDecoder;
}

// Mock the performance API if needed
if (typeof performance === 'undefined') {
  global.performance = {
    now: () => Date.now()
  };
}

// Set up environment variables for testing
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://wdnjgidekqinzqnimkaj.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkbmpnaWRla3Fpbnpxbmlta2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MjgyMTksImV4cCI6MjA2MDQwNDIxOX0.g5rbsGwRI8GmJHbf9Fm_ajgUR_ZGaksTEKOFboRWTME';
