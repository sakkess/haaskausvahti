import { supabase } from '../lib/supabaseAdmin'   // ← service-role client

async function getUser(req) {
  const tok = (req.headers.authorization || '').split(' ')[1]
  if (!tok) return null
  const { data, error } = await supabase.auth.getUser(tok)
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

export default async function handler(req, res) {
  const { method, query } = req

  if (method === 'GET') {
    if (query.status !== 'accepted') {
      const ok = await requireAdmin(req, res)
      if (!ok) return
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

  if (method === 'POST') {
    const { data, error } = await supabase.from('reports').insert([req.body]).select()
    return error
      ? res.status(500).json({ error: error.message })
      : res.status(200).json({ report: data[0] })
  }

  if (method === 'PATCH') {
    const ok = await requireAdmin(req, res)
    if (!ok) return

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
