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

  // Fetch pending reports on mount
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

  // Update status (accepted or rejected) and remove from list
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
      // remove the report locally
      setReports((prev) => prev.filter((r) => r.id !== id))
    } catch (err) {
      console.error(`Error updating report ${id} to ${newStatus}:`, err)
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
  if (reports.length === 0) {
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

      {reports.map((raw) => {
        // same unwrapping logic as in Reports.jsx :contentReference[oaicite:1]{index=1}
        const r = {
          ...raw,
          otsikko: unwrap(raw.otsikko),
          kuvaus: unwrap(raw.kuvaus),
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
          kokonaishinta_muutoksen_jalkeen: raw.kokonaishinta_muutoksen_jalkeen,
          liitteet: raw.liitteet
        }

        // format COFOG / tiliryhmä
        const cofogLabels = formatCOFOG({
          cofog1: r.cofog1,
          cofog2: r.cofog2,
          cofog3: r.cofog3
        })
        const tiliryhmaLabel = r.tiliryhmat
          ? formatTiliryhma(r.tiliryhmat)
          : null

        // parse attachments exactly like Reports.jsx
        let attachments = []
        try {
          if (Array.isArray(r.liitteet)) attachments = r.liitteet
          else if (
            typeof r.liitteet === 'string' &&
            r.liitteet.trim().startsWith('[')
          ) {
            attachments = JSON.parse(r.liitteet)
          }
        } catch {
          attachments = []
        }

        return (
          <Card key={r.id} className="space-y-4 text-left">
            <h3 className="text-xl font-semibold text-brand-800">
              {r.otsikko || '-'}
            </h3>
            <p className="text-neutral-700">{r.kuvaus || '-'}</p>

            {(cofogLabels.length || tiliryhmaLabel) && (
              <div className="space-y-1 text-sm text-neutral-700">
                {cofogLabels.length > 0 && (
                  <div>
                    <strong>COFOG:</strong>
                    <ul className="list-disc pl-5">
                      {cofogLabels.map((lbl, i) => (
                        <li key={i}>{lbl}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <strong>Tiliryhmä:</strong>{' '}
                  {tiliryhmaLabel || '-'}
                </div>
              </div>
            )}

            {attachments.length > 0 && (
              <div className="space-y-2">
                <strong className="text-sm text-neutral-700">
                  Liitteet:
                </strong>
                <div className="flex flex-wrap gap-4">
                  {attachments.map((url, i) =>
                    url.match(/\.(jpe?g|png|gif)$/i) ? (
                      <img
                        key={i}
                        src={url}
                        alt="Liite"
                        className="w-32 h-32 object-cover rounded-md border"
                      />
                    ) : url.match(/\.pdf$/i) ? (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                      >
                        {`PDF-liite ${i + 1}`}
                      </a>
                    ) : null
                  )}
                </div>
              </div>
            )}

            <div>
              <strong className="text-sm text-neutral-700">
                Taloudelliset tiedot:
              </strong>
              <table className="w-full text-sm mt-2 border-collapse">
                <thead className="text-neutral-500 text-left">
                  <tr>
                    <th className="border-b py-1"></th>
                    <th className="border-b py-1">Ennen</th>
                    <th className="border-b py-1">
                      Muutoksen jälkeen
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1">Määrä</td>
                    <td>{r.vertailu_maara ?? '-'}</td>
                    <td>
                      {r.maara_muutoksen_jalkeen ?? '-'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1">Hinta (€)</td>
                    <td>
                      {formatCurrency(r.vertailuhinta) || '-'}
                    </td>
                    <td>
                      {formatCurrency(r.hinta_muutoksen_jalkeen) ||
                        '-'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-1">Kokonaiskustannus (€)</td>
                    <td>
                      {formatCurrency(
                        r.kokonaisvertailuhinta
                      ) || '-'}
                    </td>
                    <td>
                      {formatCurrency(
                        r.kokonaishinta_muutoksen_jalkeen
                      ) || '-'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-sm text-neutral-600">
              <strong>Lähteet:</strong> {r.lahteet || '-'}
            </p>
            <p className="text-sm text-neutral-500">
              <strong>Yhteystiedot:</strong> {r.yhteystiedot || '-'}
            </p>

            {/* Action buttons */}
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
