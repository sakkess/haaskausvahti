import { supabase } from '../lib/supabaseClient.js'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data: reports, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return res.status(200).json({ reports })
    } catch (err) {
      console.error('Error fetching reports:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  if (req.method === 'POST') {
    try {
      const body = req.body

      // Optionally validate body here
      const { data, error } = await supabase.from('reports').insert([body]).select()

      if (error) throw error

      return res.status(200).json({ success: true, report: data[0] })
    } catch (err) {
      console.error('Error inserting report:', err)
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' })
}
