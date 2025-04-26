// src/routes/Admin.jsx
import React, { useEffect, useState } from 'react'
import Container from '../components/layout/Container'
import Card      from '../components/ui/Card'
import {
  formatCOFOG,
  formatTiliryhma,
  formatCurrency,
  unwrap
} from '../utils/format'
import { supabase } from '../lib/supabaseClient'

export default function Admin() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
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
        console.error('Error fetching pending reports:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    })
  }, [])

  async function updateStatus(id, newStatus) {
    try {
      const res = await fetch('/api/reports', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, status: newStatus })
      })
      if (!res.ok) throw new Error(await res.text())
      setReports(prev => prev.filter(r => r.id !== id))
    } catch (err) {
      console.error(`Error updating report ${id}:`, err)
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <p className="text-center mt-8 text-neutral-600">
        Ladataan odottavia säästöaloitteita…
      </p>
    )
  }
  if (error) {
    return (
      <p className="text-center mt-8 text-red-600">
        Virhe: {error}
      </p>
    )
  }
  if (!reports.length) {
    return (
      <p className="text-center mt-8 text-neutral-600">
        Ei odottavia säästöaloitteita.
      </p>
    )
  }

  return (
    <Container className="space-y-6 px-4 sm:px-6">
      <h2 className="text-2xl font-bold text-brand-800">
        Odottavat säästöaloitteet
      </h2>

      {reports.map(raw => {
        const r = {
          ...raw,
          otsikko: unwrap(raw.otsikko),
          kuvaus1: unwrap(raw.kuvaus1),
          kuvaus2: unwrap(raw.kuvaus2),
          kuvaus3: unwrap(raw.kuvaus3),
          lahteet: unwrap(raw.lahteet),
          yhteystiedot: unwrap(raw.yhteystiedot),
          cofog1: unwrap(raw.cofog1),
          cofog2: unwrap(raw.cofog2),
          cofog3: unwrap(raw.cofog3),
          tiliryhmat: unwrap(raw.tiliryhmat),
          vertailu_maara: raw.vertailu_maara,
          maara_muutoksen_jalkeen: raw.maara_muutoksen_jalkeen,
          vertailuhinta: raw.vertailuhinta,
          hinta_muutoksen_jalkeen: raw.hinta_muutoksen_jalkeen,
          kokonaisvertailuhinta: raw.kokonaisvertailuhinta,
          kokonaishinta_muutoksen_jalkeen:
            raw.kokonaishinta_muutoksen_jalkeen,
          liitteet: raw.liitteet
        }

        // attachments & labels same logic as Reports.jsx…

        // (you can copy-paste the parsing, cofogLabels, attachments code
        //  from Reports.jsx, or refactor into a shared helper)

        return (
          <Card key={r.id} className="space-y-4 text-left">
            <h3 className="text-xl font-semibold text-brand-800">
              {r.otsikko || '-'}
            </h3>

            <div className="space-y-2">
              <h4 className="font-medium">Nykytilan kuvaus:</h4>
              <p className="text-neutral-700">{r.kuvaus1 || '-'}</p>

              <h4 className="font-medium">Säästöaloitteen kuvaus:</h4>
              <p className="text-neutral-700">{r.kuvaus2 || '-'}</p>

              <h4 className="font-medium">Muutoksen kuvaus:</h4>
              <p className="text-neutral-700">{r.kuvaus3 || '-'}</p>
            </div>

            {/* …the rest of your Card body copied verbatim from Reports.jsx… */}

            <div className="flex space-x-4 pt-4">
              <button
                onClick={() => updateStatus(r.id, 'accepted')}
                className="px-4 py-2 bg-green-600 text-white rounded-md shadow"
              >
                Hyväksy
              </button>
              <button
                onClick={() => updateStatus(r.id, 'rejected')}
                className="px-4 py-2 bg-red-600 text-white rounded-md shadow"
              >
                Hylkää
              </button>
            </div>
          </Card>
        )
      })}
    </Container>
  )
}
