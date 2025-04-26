// src/routes/Reports.jsx

import React, { useState, useEffect, useMemo } from 'react'
import Fuse from 'fuse.js'
import Container from '../components/layout/Container'
import Card from '../components/ui/Card'
import { formatCOFOG, formatTiliryhma, formatCurrency, unwrap } from '../utils/format'
import dropdowns from '../data/dropdowns.json'

export default function Reports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters state
  const [filters, setFilters] = useState({
    cofog1: '',
    cofog2: '',
    cofog3: '',
    tiliryhma: '',
    startDate: '',
    endDate: '',
    search: '',
  })

  // Fetch accepted reports
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

  // Prepare data for searching
  const mappedReports = useMemo(() => {
    return reports.map(raw => {
      const r = {
        ...raw,
        otsikko: unwrap(raw.otsikko),
        nimimerkki: unwrap(raw.nimimerkki),
        kuvaus1: unwrap(raw.kuvaus1),
        kuvaus2: unwrap(raw.kuvaus2),
        kuvaus3: unwrap(raw.kuvaus3),
        lahteet: unwrap(raw.lahteet),
        cofog1: unwrap(raw.cofog1),
        cofog2: unwrap(raw.cofog2),
        cofog3: unwrap(raw.cofog3),
        tiliryhmat: unwrap(raw.tiliryhmat),
      }
      return r
    })
  }, [reports])

  // Initialize Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(mappedReports, {
      keys: ['otsikko', 'nimimerkki', 'kuvaus1', 'kuvaus2', 'kuvaus3', 'lahteet'],
      threshold: 0.4,
    })
  }, [mappedReports])

  // Apply filters and fuzzy search
  const filteredReports = useMemo(() => {
    let fr = mappedReports
    const { cofog1, cofog2, cofog3, tiliryhma, startDate, endDate, search } = filters

    if (cofog1) fr = fr.filter(r => r.cofog1 === cofog1)
    if (cofog2) fr = fr.filter(r => r.cofog2 === cofog2)
    if (cofog3) fr = fr.filter(r => r.cofog3 === cofog3)
    if (tiliryhma) fr = fr.filter(r => r.tiliryhmat === tiliryhma)
    if (startDate) fr = fr.filter(r => new Date(r.created_at) >= new Date(startDate))
    if (endDate) fr = fr.filter(r => new Date(r.created_at) <= new Date(endDate))
    if (search) fr = fuse.search(search).map(res => res.item)

    return fr
  }, [mappedReports, filters, fuse])

  // Extract dropdown options
  const cofog1Options = dropdowns.find(d => d.dropdown === 1)?.options || []
  const cofog2Options = dropdowns.find(d => d.dropdown === 2)?.options || []
  const cofog3Options = dropdowns.find(d => d.dropdown === 3)?.options || []
  const tiliryhmaOptions = dropdowns.find(d => d.dropdown === 4)?.options || []

  if (loading) return <p className="text-center mt-8 text-neutral-600">Ladataan säästöaloitteita…</p>
  if (error) return <p className="text-center mt-8 text-red-600">Virhe ladattaessa: {error}</p>

  return (
    <Container className="space-y-6 px-4 sm:px-6">
      <h2 className="text-2xl font-bold text-brand-800">Lähetetyt säästöaloitteet</h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-neutral-700">Haku</label>
          <input
            id="search"
            type="text"
            placeholder="Haku..."
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="cofog1" className="block text-sm font-medium text-neutral-700">COFOG 1</label>
          <select
            id="cofog1"
            value={filters.cofog1}
            onChange={e => setFilters({ ...filters, cofog1: e.target.value })}
            className="mt-1 block w-full p-2 border rounded"
          >
            <option value="">Kaikki</option>
            {cofog1Options.map(opt => (
              <option key={opt.code} value={opt.code}>{`${opt.code} – ${opt.label}`}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cofog2" className="block text-sm font-medium text-neutral-700">COFOG 2</label>
          <select
            id="cofog2"
            value={filters.cofog2}
            onChange={e => setFilters({ ...filters, cofog2: e.target.value })}
            className="mt-1 block w-full p-2 border rounded"
          >
            <option value="">Kaikki</option>
            {cofog2Options.map(opt => (
              <option key={opt.code} value={opt.code}>{`${opt.code} – ${opt.label}`}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cofog3" className="block text-sm font-medium text-neutral-700">COFOG 3</label>
          <select
            id="cofog3"
            value={filters.cofog3}
            onChange={e => setFilters({ ...filters, cofog3: e.target.value })}
            className="mt-1 block w-full p-2 border rounded"
          >
            <option value="">Kaikki</option>
            {cofog3Options.map(opt => (
              <option key={opt.code} value={opt.code}>{`${opt.code} – ${opt.label}`}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="tiliryhma" className="block text-sm font-medium text-neutral-700">Tiliryhmä</label>
          <select
            id="tiliryhma"
            value={filters.tiliryhma}
            onChange={e => setFilters({ ...filters, tiliryhma: e.target.value })}
            className="mt-1 block w-full p-2 border rounded"
          >
            <option value="">Kaikki</option>
            {tiliryhmaOptions.map(opt => (
              <option key={opt.code} value={opt.code}>{`${opt.code} – ${opt.label}`}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-neutral-700">Alku</label>
          <input
            id="startDate"
            type="date"
            value={filters.startDate}
            onChange={e => setFilters({ ...filters, startDate: e.target.value })}
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-neutral-700">Loppu</label>
          <input
            id="endDate"
            type="date"
            value={filters.endDate}
            onChange={e => setFilters({ ...filters, endDate: e.target.value })}
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <p className="text-neutral-600">Hakuehdolle ei löytynyt tuloksia.</p>
      ) : (
        filteredReports.map(raw => {
          const r = raw // already unwrapped
          const attachments = []
          try {
            if (Array.isArray(r.liitteet)) attachments.push(...r.liitteet)
            else if (typeof r.liitteet === 'string' && r.liitteet.trim().startsWith('[')) {
              attachments.push(...JSON.parse(r.liitteet))
            }
          } catch {}
          const cofogLabels = formatCOFOG({ cofog1: r.cofog1, cofog2: r.cofog2, cofog3: r.cofog3 })
          const tiliryhmaLabel = r.tiliryhmat ? formatTiliryhma(r.tiliryhmat) : null

          return (
            <Card key={r.id} className="space-y-4 text-left">
              <h3 className="text-xl font-semibold text-brand-800">{r.otsikko || '-'}</h3>
              <p className="text-sm text-neutral-600"><strong>Nimimerkki:</strong> {r.nimimerkki || '-'}</p>

              {/* Descriptions */}
              <div className="space-y-2">
                <h4 className="font-medium">Nykytilan kuvaus:</h4>
                <p className="text-neutral-700">{r.kuvaus1 || '-'}</p>
                <h4 className="font-medium">Säästöaloitteen kuvaus:</h4>
                <p className="text-neutral-700">{r.kuvaus2 || '-'}</p>
                <h4 className="font-medium">Muutoksen kuvaus:</h4>
                <p className="text-neutral-700">{r.kuvaus3 || '-'}</p>
              </div>

              {/* COFOG */}
              {cofogLabels.length > 0 && (
                <div className="text-sm text-neutral-700">
                  <strong>COFOG:</strong>
                  <div className="pl-0 mt-1">
                    {cofogLabels.map((lbl, i) => (<div key={i}>{lbl}</div>))}
                  </div>
                </div>
              )}

              {/* Tiliryhmä */}
              {tiliryhmaLabel && (
                <div className="text-sm text-neutral-700 mt-2">
                  <strong>Tiliryhmä:</strong>
                  <div className="pl-0 mt-1">{tiliryhmaLabel}</div>
                </div>
              )}

              {/* Attachments */}
              {attachments.length > 0 && (
                <div className="space-y-2">
                  <strong className="text-sm text-neutral-700">Liitteet:</strong>
                  <div className="flex flex-wrap gap-4">
                    {attachments.map((url, i) =>
                      /\.(jpe?g|png|gif)$/i.test(url) ? (
                        <img key={i} src={url} alt="Liite" className="w-32 h-32 object-cover rounded-md border" />
                      ) : /\.pdf$/i.test(url) ? (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-sm">
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

              <p className="text-sm text-neutral-600"><strong>Lähteet:</strong> {r.lahteet || '-'}</p>
            </Card>
          )
        })
      )}
    </Container>
  )
}
