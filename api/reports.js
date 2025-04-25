// api/reports.js
import { supabase } from '../lib/supabaseAdmin'   // ← now matches the export

/* ---------- helpers ---------- */
async function getUser(req) {
  const token = (req.headers.authorization || '').split(' ')[1]
  if (!token) return null
  const { data, error } = await supabase.auth.getUser(token)
  return error ? null : data.user
}

async function requireAdmin(req, res) {
  const user = await getUser(req)
  if (!user?.app_metadata?.is_admin) {
    res.status(403).json({ error: 'Forbidden' })
    return null
  }
  return user
}

/* ---------- handler ---------- */
export default async function handler(req, res) {
  const { method, query } = req

  /* GET ------------------------------------------------------- */
  if (method === 'GET') {
    if (query.status !== 'accepted') {
      if (!(await requireAdmin(req, res))) return
    }

    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('status', query.status || 'pending')
      .order('created_at', { ascending: false })

    return error
      ? res.status(500).json({ error: error.message })
      : res.status(200).json({ reports: data })
  }

  /* POST ------------------------------------------------------ */
  if (method === 'POST') {
    const { data, error } = await supabase
      .from('reports')
      .insert([req.body])
      .select()

    return error
      ? res.status(500).json({ error: error.message })
      : res.status(200).json({ report: data[0] })
  }

  /* PATCH ----------------------------------------------------- */
  if (method === 'PATCH') {
    if (!(await requireAdmin(req, res))) return

    const { id, status } = req.body
    const { data, error } = await supabase
      .from('reports')
      .update({ status })
      .eq('id', id)
      .select()

    return error
      ? res.status(500).json({ error: error.message })
      : res.status(200).json({ report: data[0] })
  }

  res.setHeader('Allow', ['GET', 'POST', 'PATCH'])
  res.status(405).end()
}
