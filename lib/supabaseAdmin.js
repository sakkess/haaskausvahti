// lib/supabaseAdmin.js
import { createClient } from '@supabase/supabase-js'

/**
 * Vercel functions DON’T receive VITE_* env vars.
 * • SUPABASE_URL                → Settings › Environment Variables
 * • SUPABASE_SERVICE_ROLE_KEY   → ”   ”      (keep this secret)
 *
 * During local dev you can keep them in a .env file:
 * SUPABASE_URL=...
 * SUPABASE_SERVICE_ROLE_KEY=...
 */
const supabaseUrl =
  process.env.SUPABASE_URL ||          // production / CI
  import.meta?.env?.VITE_SUPABASE_URL   // local dev fallback

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||  // production / CI
  import.meta?.env?.VITE_SUPABASE_ANON_KEY   // dev fallback so you can run
                                             // functions without exposing SRK

if (!supabaseUrl || !serviceRoleKey) {
  // eslint-disable-next-line no-console
  console.error('❌ Missing Supabase env vars', { supabaseUrl, serviceRoleKey })
}

/**
 * Export name **supabase** (not supabaseAdmin) because
 * api/reports.js imports `{ supabase }`.
 */
export const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})
