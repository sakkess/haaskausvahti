// src/routes/Admin.jsx

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient.js'
import Container from '../components/layout/Container'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import {
  formatCOFOG,
  formatTiliryhma,
  formatCurrency,
  unwrap
} from '../utils/format'

export default function Admin() {
  // undefined = “still checking”, null = unauthenticated, object = session
  const [session, setSession] = useState(undefined)
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // 1) Load initial session and subscribe to changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // 2) Once we know there's no session, send them to login
  useEffect(() => {
    if (session === null) {
      navigate('/login', { replace: true })
    }
  }, [session, navigate])

  // 3) Fetch pending reports only once we have a session
  useEffect(() => {
    if (!session) return
    setLoading(true)

    fetch('/api/reports?status=pending', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error(res.statusText)
        return res.json()
      })
      .then(({ reports }) => setReports(reports || []))
      .catch(err => {
        console.error('Error fetching pending reports:', err)
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [session])

  // 4) Handle approve/reject
  const handleAction = async (id, status) => {
    try {
      const res = await fetch('/api/reports', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) throw new Error((await res.json()).error || res.statusText)
      setReports(r => r.filter(r => r.id !== id))
    } catch (err) {
      console.error(`Error updating report ${id}:`, err)
      alert(`Päivitys epäonnistui: ${err.message}`)
    }
  }

  // 5) While we’re still checking session, don’t render anything
  if (session === undefined) {
    return null  // or <p>Loading…</p> if you prefer a spinner
  }

  // 6) Once we know they’re in, show loading/error states or the dashboard
  if (loading) {
    return <p className="text-center mt-8 text-neutral-600">
      Ladataan hallinnoitavia ilmoituksia…
    </p>
  }
  if (error) {
    return <p className="text-center mt-8 text-red-600">
      Virhe ladattaessa: {error}
    </p>
  }

  return (
    <Container className="space-y-6 px-4 sm:px-6">
      <h2 className="text-2xl font-bold text-brand-800">
        Admin: Pending Reports
      </h2>

      {reports.length === 0
        ? <p className="text-neutral-600">Ei odottavia raportteja.</p>
        : reports.map(raw => {
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
            }

            const cofogLabels = formatCOFOG({
              cofog1: r.cofog1,
              cofog2: r.cofog2,
              cofog3: r.cofog3,
            })
            const tiliryhmaLabel = r.tiliryhmat
              ? formatTiliryhma(r.tiliryhmat)
              : null

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
                          {cofogLabels.map((label, i) =>
                            <li key={i}>{label}</li>
                          )}
                        </ul>
                      </div>
                    )}
                    <div>
                      <strong>Tiliryhmä:</strong> {tiliryhmaLabel || '-'}
                    </div>
                  </div>
                )}
                <div className="flex gap-4 mt-4">
                  <Button onClick={() => handleAction(r.id, 'accepted')} variant="primary">
                    Hyväksy
                  </Button>
                  <Button onClick={() => handleAction(r.id, 'rejected')} variant="secondary">
                    Hylkää
                  </Button>
                </div>
              </Card>
            )
          })
      }
    </Container>
  )
}
