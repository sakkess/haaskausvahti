// api/reports.js
import { supabase } from '../src/lib/supabaseAdmin.js'

export default async function handler(req, res) {
  const { method, query } = req

  // GET /api/reports?status=pending|accepted|rejected
  if (method === 'GET') {
    try {
      // Fetch all columns, optionally filtering by status
      let builder = supabase
        .from('reports')
        .select('*')

      if (query.status) {
        builder = builder.eq('status', query.status)
      }

      const { data: reports, error } = await builder
        .order('created_at', { ascending: false })

      if (error) throw error

      return res.status(200).json({ reports })
    } catch (err) {
      console.error('Error fetching reports:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  // POST /api/reports
  if (method === 'POST') {
    try {
      const body = req.body
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

  // PATCH /api/reports
  if (method === 'PATCH') {
    try {
      const { id, status } = req.body
      if (!id || !status) {
        return res.status(400).json({
          error: 'Both id and status are required'
        })
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

      return res.status(200).json({
        success: true,
        report: data[0]
      })
    } catch (err) {
      console.error('Error updating report status:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  // Method not allowed
  res.setHeader('Allow', ['GET', 'POST', 'PATCH'])
  return res.status(405).json({ error: 'Method Not Allowed' })
}
