import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Admin() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const res = await fetch('/api/reports?status=pending', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (mounted) {
        setReports(json.reports || [])
        setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  if (loading) return <p className="p-4">Loading…</p>
  if (!reports.length) return <p className="p-4">No pending reports.</p>

  return (
    <ul className="p-4 space-y-2">
      {reports.map(r => (
        <li key={r.id} className="rounded-lg border p-3 shadow">
          {r.title}
        </li>
      ))}
    </ul>
  )
}
