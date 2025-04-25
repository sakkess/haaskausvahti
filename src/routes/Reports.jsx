// src/routes/Reports.jsx  – original layout, path fixed
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Container from '../components/layout/Container'

export default function Reports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      const { data, error } = await supabase
        .from('reports')
        .select(
          `id,
           otsikko,
           kuvaus,
           kuva_url,
           vuosisaasto,
           kertasuorite,
           luokitus,
           created_at`
        )
        .eq('status', 'accepted')
        .order('created_at', { ascending: false })

      if (!mounted) return
      if (error) console.error(error)
      setReports(data || [])
      setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [])

  if (loading)         return <p className="p-6">Ladataan…</p>
  if (!reports.length) return <p className="p-6">Ei hyväksyttyjä aloitteita.</p>

  return (
    <Container className="space-y-6 py-6">
      {reports.map(r => (
        <article key={r.id} className="rounded-lg border p-4 shadow">
          <h2 className="mb-2 text-lg font-semibold">{r.otsikko}</h2>

          {r.kuva_url && (
            <img
              src={r.kuva_url}
              alt=""
              className="mb-3 w-full rounded-md object-cover"
            />
          )}

          <p className="whitespace-pre-line">{r.kuvaus}</p>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {r.vuosisaasto && (
              <span className="rounded bg-green-50 px-2 py-1 text-green-700">
                Vuosittainen säästö: {r.vuosisaasto} €
              </span>
            )}
            {r.kertasuorite && (
              <span className="rounded bg-blue-50 px-2 py-1 text-blue-700">
                Kertasuorite: {r.kertasuorite} €
              </span>
            )}
            {r.luokitus && (
              <span className="rounded bg-yellow-50 px-2 py-1 text-yellow-800">
                {r.luokitus}
              </span>
            )}
          </div>

          <time className="mt-2 block text-xs text-neutral-500">
            {new Date(r.created_at).toLocaleDateString('fi-FI')}
          </time>
        </article>
      ))}
    </Container>
  )
}
