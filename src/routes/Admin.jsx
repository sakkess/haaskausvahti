import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import Container from '../components/layout/Container'

export default function Admin() {
  const [session, setSession] = useState(undefined)  // ⬅ start as undefined
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  // 1️⃣ Get session and watch for login/logout
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // 2️⃣ Once logged in, fetch pending reports
  useEffect(() => {
    if (!session) return

    const fetchReports = async () => {
      const token = session.access_token
      const res = await fetch('/api/reports?status=pending', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const json = await res.json()
      setReports(json.reports || [])
      setLoading(false)
    }

    fetchReports()
  }, [session])

  if (session === undefined) return null           // still checking session
  if (!session) return <Navigate to="/login" />    // redirect if not logged in

  if (loading) return <p className="p-6">Ladataan…</p>

  return (
    <Container className="space-y-6 py-6">
      {reports.map((r) => (
        <article key={r.id} className="rounded-lg border p-4 shadow">
          <h2 className="mb-2 text-lg font-semibold">{r.otsikko}</h2>
          <p className="text-sm text-neutral-700 whitespace-pre-line">{r.kuvaus}</p>
          <time className="mt-2 block text-xs text-neutral-500">
            {new Date(r.created_at).toLocaleDateString('fi-FI')}
          </time>
        </article>
      ))}
    </Container>
  )
}
