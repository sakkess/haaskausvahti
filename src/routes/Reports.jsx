// src/routes/Reports.jsx
import React, { useState, useEffect } from 'react'
import Container from '../components/layout/Container'
import Card      from '../components/ui/Card'
import { formatCOFOG, formatTiliryhma, formatCurrency, unwrap } from '../utils/format'

export default function Reports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    fetch('/api/reports?status=accepted')
      .then(res => {
        if (!res.ok) throw new Error(res.statusText)
        return res.json()
      })
      .then(({ reports }) => setReports(reports || []))
      .catch(err => {
        console.error('Error fetching reports:', err)
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-center mt-8 text-neutral-600">Ladataan säästöaloitteita…</p>
  }
  if (error) {
    return <p className="text-center mt-8 text-red-600">Virhe ladattaessa: {error}</p>
  }

  return (
    <Container className="space-y-6 px-4 sm:px-6">
      <h2 className="text-2xl font-bold text-brand-800">Lähetetyt säästöaloitteet</h2>

      {reports.length === 0 ? (
        <p className="text-neutral-600">Säästöaloitteita ei vielä ole.</p>
      ) : (
        reports.map(raw => {
          const r = {
            ...raw,
            otsikko: unwrap(raw.otsikko),
            nimimerkki: unwrap(raw.nimimerkki),
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
            kokonaishinta_muutoksen_jalkeen: raw.kokonaishinta_muutoksen_jalkeen,
            liitteet: raw.liitteet
          }

          // parse attachments
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

          const cofogLabels = formatCOFOG({
            cofog1: r.cofog1,
            cofog2: r.cofog2,
            cofog3: r.cofog3
          })
          const tiliryhmaLabel = r.tiliryhmat
            ? formatTiliryhma(r.tiliryhmat)
            : null

          return (
            <Card key={r.id} className="space-y-4 text-left">
              <h3 className="text-xl font-semibold text-brand-800">
                {r.otsikko || '-'}
              </h3>
              <p className="text-sm text-neutral-600">
                <strong>Nimimerkki:</strong> {r.nimimerkki || '-'}
              </p>

              {/* Descriptions */}
              <div className="space-y-2">
                <h4 className="font-medium">Nykytilan kuvaus:</h4>
                <p className="text-neutral-700">{r.kuvaus1 || '-'}</p>

                <h4 className="font-medium">Säästöaloitteen kuvaus:</h4>
                <p className="text-neutral-700">{r.kuvaus2 || '-'}</p>

                <h4 className="font-medium">Muutoksen kuvaus:</h4>
                <p className="text-neutral-700">{r.kuvaus3 || '-'}</p>
              </div>

              {/* COFOG & tiliryhmä */}
              {(cofogLabels.length > 0 || tiliryhmaLabel) && (
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
                    <strong>Tiliryhmä:</strong> {tiliryhmaLabel || '-'}
                  </div>
                </div>
              )}

              {/* Attachments */}
              {attachments.length > 0 && (
                <div className="space-y-2">
                  <strong className="text-sm text-neutral-700">Liitteet:</strong>
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

              {/* Financials */}
              <div>
                <strong className="text-sm text-neutral-700">Taloudelliset tiedot:</strong>
                <table className="w-full text-sm mt-2 border-collapse">
                  <thead className="text-neutral-500 text-left">
                    <tr>
                      <th className="border-b py-1"></th>
                      <th className="border-b py-1">Ennen</th>
                      <th className="border-b py-1">Muutoksen jälkeen</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-1">Määrä</td>
                      <td>{r.vertailu_maara ?? '-'}</td>
                      <td>{r.maara_muutoksen_jalkeen ?? '-'}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Hinta (€)</td>
                      <td>{formatCurrency(r.vertailuhinta) || '-'}</td>
                      <td>{formatCurrency(r.hinta_muutoksen_jalkeen) || '-'}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Kokonaiskustannus (€)</td>
                      <td>{formatCurrency(r.kokonaisvertailuhinta) || '-'}</td>
                      <td>{formatCurrency(r.kokonaishinta_muutoksen_jalkeen) || '-'}</td>
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
            </Card>
          )
        })
      )}
    </Container>
  )
}
