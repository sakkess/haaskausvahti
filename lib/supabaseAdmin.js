// lib/supabaseAdmin.js
import { createClient } from '@supabase/supabase-js'

/*─────────────────────────────────────────────────────────────
  Grab connection details from whatever env names exist.
  ─────────────────────────────────────────────────────────────*/
function pick(...keys) {
  for (const k of keys) {
    if (process.env[k] && String(process.env[k]).trim() !== '') return process.env[k]
  }
  return undefined
}

const supabaseUrl = pick('SUPABASE_URL', 'VITE_SUPABASE_URL')
const serviceKey  = pick(
  'SUPABASE_SERVICE_ROLE_KEY',      // preferred (bypasses RLS)
  'VITE_SUPABASE_SERVICE_ROLE_KEY', // if you ever add one
  'VITE_SUPABASE_ANON_KEY',         // graceful fallback
)

if (!supabaseUrl || !serviceKey) {
  // eslint-disable-next-line no-console
  console.warn('⚠️  Supabase env vars missing', { supabaseUrl, serviceKeyPresent: !!serviceKey })
}

/*─────────────────────────────────────────────────────────────*/

export const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})
