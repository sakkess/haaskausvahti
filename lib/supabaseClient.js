// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Read the same env‑var name you added in Vercel:
// • Vercel will inject VITE_SUPABASE_URL into process.env
// • Locally, Vite will load .env.local and expose it under import.meta.env.VITE_SUPABASE_URL
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;  // server‑side only

export const supabase = createClient(supabaseUrl, supabaseKey);
