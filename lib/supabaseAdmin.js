// lib/supabaseAdmin.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('Missing Supabase admin env vars:', { supabaseUrl, serviceKey })
}

export const supabaseAdmin = createClient(supabaseUrl, serviceKey)