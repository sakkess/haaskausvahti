// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// These must be set in your .env (and in Vercel) for the front end:
//  • VITE_SUPABASE_URL      → your Supabase project URL
//  • VITE_SUPABASE_ANON_KEY → your Supabase anon (public) key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase env vars:', { supabaseUrl, supabaseAnonKey })
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)