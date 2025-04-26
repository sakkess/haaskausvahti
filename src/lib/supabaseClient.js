// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

// sanity check: these must be defined
console.log('Supabase URL:', url)
console.log('Supabase anon key (first 4 chars):', anon?.slice(0,4))

export const supabase = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true }
})
