// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// These must exactly match what you set in Vercel:
//  • VITE_SUPABASE_URL  → your Supabase project URL
//  • SUPABASE_SERVICE_ROLE_KEY → your service‑role key
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars:', { supabaseUrl, supabaseKey });
}

export const supabase = createClient(supabaseUrl, supabaseKey);
