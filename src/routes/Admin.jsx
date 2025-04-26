import React, { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Admin() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    // grab the access_token from Supabase
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      try {
        const res = await fetch('/api/reports?status=pending', {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        })
        if (!res.ok) throw new Error(await res.text())
        const { reports } = await res.json()
        setReports(reports || [])
      } catch (err) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })
  }, [])

  if (loading) return <p className="p-6">Ladataan…</p>
  if (error)   return <p className="p-6 text-red-600">Virhe: {error}</p>

  return (
    <div className="space-y-4 p-6">
      <h1 className="text-2xl">Pending Reports</h1>
      {reports.map(r => (
        <div key={r.id} className="border p-4 rounded">
          <h2 className="font-semibold">{r.otsikko}</h2>
          <p>{r.kuvaus}</p>
        </div>
      ))}
      {reports.length === 0 && <p>No pending reports.</p>}
    </div>
  )
}
