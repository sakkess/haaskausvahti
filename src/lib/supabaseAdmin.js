// src/lib/supabaseAdmin.js
import { createClient } from '@supabase/supabase-js'

const url        = process.env.VITE_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!serviceKey) console.error('Missing SUPABASE_SERVICE_ROLE_KEY!')

export const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false }
})
