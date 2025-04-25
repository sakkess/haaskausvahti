// src/lib/supabaseAdmin.js
import { createClient } from '@supabase/supabase-js'

// Vercel and other serverless runtimes see only non-VITE variables
const supabaseUrl  = process.env.SUPABASE_URL
const serviceRole  = process.env.SUPABASE_SERVICE_ROLE_KEY // full access

export const supabase = createClient(supabaseUrl, serviceRole, {
  auth: { persistSession: false, autoRefreshToken: false },
})
