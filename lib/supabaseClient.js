// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Set these in .env.* and in the Vercel dashboard:
//   VITE_SUPABASE_URL
//   VITE_SUPABASE_ANON_KEY
const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error('Missing Supabase env vars:', { supabaseUrl, supabaseAnonKey })
}

// `persistSession` + `autoRefreshToken` keep you logged in and silently
// refresh the JWT, which is what fixes “login → flash → kicked back”.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
