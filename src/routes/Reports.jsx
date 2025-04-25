// src/routes/Reports.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Container from '../components/layout/Container'

const BUCKET     = 'liitteet' // change if your bucket name differs
const URL_EXPIRY = 60 * 60       // signed URL valid for 1 h

export default function Reports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true

    async function load() {
      /* 1️⃣ fetch accepted rows ------------------------------------------ */
      const { data, error } = await supabase
        .from('reports')
        .select(
          `id,
           otsikko,
           kuvaus,
           liitteet,                       -- JSON or comma-separated list
           kokonaisvertailuhinta,
           kokonaishinta_muutoksen_jalkeen,
           created_at`
        )
        .eq('status', 'accepted')
        .order('created_at', { ascending: false })

      if (!alive) return
      if (error) {
        console.error('Failed to load reports:', error)
        setReports([])
        setLoading(false)
        return
      }

      /* 2️⃣ build signed URLs for every attachment ----------------------- */
      const withImages = await Promise.all(
        (data || []).map(async (r) => {
          // liitteet can be null, JSON array, or "file1,file2"
          let files = []
          if (r.liitteet) {
            try {
              files = JSON.parse(r.liitteet)            // if stored as JSON
            } catch {
              files = r.liitteet.split(',').map(s => s.trim()) // fallback
            }
          }

          const signed = await Promise.all(
            files.map(async (file) => {
              const { data, error } = await supabase
                .storage
                .from(BUCKET)
                .createSignedUrl(file, URL_EXPIRY)
              return error ? null : { file, url: data.signedUrl }
            })
          )
          r.images = signed.filter(Boolean)
          return r
        })
      )

      setReports(withImages)
      setLoading(false)
    }

    load()
    return () => { alive = false }
  }, [])

  /* ---------- UI ---------- */
  if (loading)         return <p className="p-6">Ladataan…</p>
  if (!reports.length) return <p className="p-6">Ei hyväksyttyjä aloitteita.</p>

  return (
    <Container className="space-y-6 py-6">
      {reports.map(r => (
        <article key={r.id} className="rounded-lg border p-4 shadow">
          <h2 className="mb-3 text-lg font-semibold">{r.otsikko}</h2>

          {r.images?.length > 0 && (
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              {r.images.map(img => (
                <img
                  key={img.file}
                  src={img.url}
                  alt=""
                  className="w-full rounded-md object-cover"
                />
              ))}
            </div>
          )}

          <p className="whitespace-pre-line">{r.kuvaus}</p>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {r.kokonaisvertailuhinta && (
              <span className="rounded bg-green-50 px-2 py-1 text-green-700">
                Nykykulut: {r.kokonaisvertailuhinta} €
              </span>
            )}
            {r.kokonaishinta_muutoksen_jalkeen && (
              <span className="rounded bg-blue-50 px-2 py-1 text-blue-700">
                Uudet kulut: {r.kokonaishinta_muutoksen_jalkeen} €
              </span>
            )}
          </div>

          <time className="mt-3 block text-xs text-neutral-500">
            {new Date(r.created_at).toLocaleDateString('fi-FI')}
          </time>
        </article>
      ))}
    </Container>
  )
}
