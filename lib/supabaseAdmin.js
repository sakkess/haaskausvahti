// lib/supabaseAdmin.js
import { createClient } from '@supabase/supabase-js'

/* ────────────────────────────────────────────────────────────
   Environment variables
   ──────────────────────────────────────────────────────────── */

function pick(...keys) {
  for (const k of keys) {
    if (typeof process.env[k] === 'string' && process.env[k].trim() !== '') {
      return process.env[k]
    }
  }
  return undefined
}

const supabaseUrl = pick('SUPABASE_URL', 'VITE_SUPABASE_URL')
const serviceKey  = pick(
  'SUPABASE_SERVICE_ROLE_KEY',
  'VITE_SUPABASE_SERVICE_ROLE_KEY', // if you ever add one
  'VITE_SUPABASE_ANON_KEY',         // graceful fallback
)

if (!supabaseUrl || !serviceKey) {
  // eslint-disable-next-line no-console
  console.warn(
    '⚠️  Supabase env vars missing. URL:',
    supabaseUrl,
    'key:',
    serviceKey ? 'present' : 'missing'
  )
}

/* ──────────────────────────────────────────────────────────── */

export const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})
