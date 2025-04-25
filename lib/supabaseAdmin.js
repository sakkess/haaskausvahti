// lib/supabaseAdmin.js
import { createClient } from '@supabase/supabase-js'

// These must be set in Vercel (no VITE_ prefix):
const supabaseUrl = process.env.SUPABASE_URL
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})
