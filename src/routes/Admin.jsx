import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import Container from '../components/layout/Container'

export default function Admin() {
  const [session, setSession] = useState(undefined)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  // Always call hooks at top level
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, sess) => setSession(sess))
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return
    const fetchReports = async () => {
      try {
        const res = await fetch('/api/reports?status=pending', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        })
        if (!res.ok) {
          throw new Error(await res.text())
        }
        const { reports } = await res.json()
        setReports(reports ?? [])
      } catch (err) {
        console.error('Error loading reports:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [session])

  // Render states
  if (session === undefined) return <p className="p-6">Ladataan…</p>
  if (!session) return <Navigate to="/login" replace />
  if (loading) return <p className="p-6">Ladataan…</p>

  return (
    <Container className="space-y-6 py-6">
      {reports.map(r => (
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