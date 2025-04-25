// api/reports.js
import { supabase } from '../lib/supabaseClient.js'

/* ───────────────────────── helpers ────────────────────────── */

async function getUserFromRequest(req) {
  const header = req.headers.authorization || ''
  const token  = header.startsWith('Bearer ') ? header.split(' ')[1] : null
  if (!token) return null

  const { data, error } = await supabase.auth.getUser(token)
  return error ? null : data.user
}

async function requireAdmin(req, res) {
  const user = await getUserFromRequest(req)
  if (!user?.app_metadata?.is_admin) {
    res.status(403).json({ error: 'Forbidden' })
    return null
  }
  return user
}

/* ───────────────────────── route handler ──────────────────── */

export default async function handler(req, res) {
  const { method, query } = req

  /* ─── GET /api/reports ───────────────────────────────────── */
  if (method === 'GET') {
    // anyone may read accepted reports; other statuses require admin
    if (query.status !== 'accepted') {
      const admin = await requireAdmin(req, res)
      if (!admin) return
    }

    try {
      let builder = supabase.from('reports').select('*')
      if (query.status) builder = builder.eq('status', query.status)
      const { data: reports, error } = await builder.order('created_at', { ascending: false })
      if (error) throw error
      return res.status(200).json({ reports })
    } catch (err) {
      console.error('Error fetching reports:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  /* ─── POST /api/reports ──────────────────────────────────── */
  if (method === 'POST') {
    // public – anyone can submit a new report
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert([req.body])
        .select()
      if (error) throw error
      return res.status(200).json({ success: true, report: data[0] })
    } catch (err) {
      console.error('Error inserting report:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  /* ─── PATCH /api/reports ─────────────────────────────────── */
  if (method === 'PATCH') {
    // only admins may change status
    const admin = await requireAdmin(req, res)
    if (!admin) return

    try {
      const { id, status } = req.body
      if (!id || !status) {
        return res.status(400).json({ error: 'Both id and status are required' })
      }

      const { data, error } = await supabase
        .from('reports')
        .update({ status })
        .eq('id', id)
        .select()
      if (error) throw error
      if (!data?.length) return res.status(404).json({ error: 'Report not found' })

      return res.status(200).json({ success: true, report: data[0] })
    } catch (err) {
      console.error('Error updating report status:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  /* ─── Method not allowed ─────────────────────────────────── */
  res.setHeader('Allow', ['GET', 'POST', 'PATCH'])
  return res.status(405).json({ error: 'Method Not Allowed' })
}
