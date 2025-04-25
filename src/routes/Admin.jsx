import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'  // ← fixed path
import Container from '../components/layout/Container'

export default function Admin() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const res = await fetch('/api/reports?status=pending', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()

      if (alive) {
        setReports(json.reports || [])
        setLoading(false)
      }
    }
    load()
    return () => { alive = false }
  }, [])

  if (loading)        return <p className="p-4">Loading…</p>
  if (!reports.length) return <p className="p-4">No pending reports.</p>

  return (
    <Container className="space-y-4 p-4">
      {reports.map(r => (
        <article key={r.id} className="rounded-lg border p-4 shadow">
          <h2 className="font-semibold">{r.otsikko}</h2>
          <p className="text-sm text-neutral-700">{r.kuvaus}</p>
        </article>
      ))}
    </Container>
  )
}
