// api/reports.js
import { supabaseAdmin as supabase } from '../lib/supabaseAdmin.js'

// Extract and validate the admin user from the Bearer token.
// Returns the user object if OK, otherwise sends a 401/403 response and returns null.
async function requireAdmin(req, res) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.split(' ')[1]  // expecting "Bearer <token>"
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' })
    return null
  }

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser(token)

  if (authError || !user || user.user_metadata?.is_admin !== true) {
    res.status(403).json({ error: 'Forbidden' })
    return null
  }

  return user
}

export default async function handler(req, res) {
  const { method, query } = req

  // --- GET /api/reports?status=pending or default accepted ---
  if (method === 'GET') {
    try {
      let builder = supabase.from('reports').select('*')

      // If asking for pending, enforce admin:
      if (query.status === 'pending') {
        if (!(await requireAdmin(req, res))) return
        builder = builder.eq('status', 'pending')
      } else {
        // Public: only show accepted reports
        builder = builder.eq('status', 'accepted')
      }

      const { data: reports, error } = await builder.order('created_at', {
        ascending: false
      })

      if (error) throw error
      return res.status(200).json({ reports })
    } catch (err) {
      console.error('Error fetching reports:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  // --- POST /api/reports (public) ---
  if (method === 'POST') {
    try {
      const body = req.body
      // Database default for "status" is "pending"
      const { data, error } = await supabase
        .from('reports')
        .insert([body])
        .select()

      if (error) throw error
      return res.status(200).json({ success: true, report: data[0] })
    } catch (err) {
      console.error('Error inserting report:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  // --- PATCH /api/reports (admin only) ---
  if (method === 'PATCH') {
    // must be admin
    if (!(await requireAdmin(req, res))) return

    try {
      const { id, status } = req.body
      if (!id || !status) {
        return res
          .status(400)
          .json({ error: 'Both id and status are required' })
      }

      const { data, error } = await supabase
        .from('reports')
        .update({ status })
        .eq('id', id)
        .select()

      if (error) throw error
      if (!data || data.length === 0) {
        return res.status(404).json({ error: 'Report not found' })
      }

      return res.status(200).json({ success: true, report: data[0] })
    } catch (err) {
      console.error('Error updating report status:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  // Method not allowed
  res.setHeader('Allow', ['GET', 'POST', 'PATCH'])
  return res.status(405).json({ error: 'Method Not Allowed' })
}
