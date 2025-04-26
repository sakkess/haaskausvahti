// src/components/AuthOnly.jsx
import React, { useState, useEffect } from 'react'
import { supabase }       from '../lib/supabaseClient'
import { Navigate, useLocation } from 'react-router-dom'

export default function AuthOnly({ children }) {
  // undefined = “loading”, null = “not logged in”, object = session
  const [session, setSession] = useState(undefined)
  const location = useLocation()

  useEffect(() => {
    // initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    // subscribe to changes (sign out, token refresh, etc.)
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_ev, session) => {
        setSession(session)
      })
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    return <p className="text-center py-8">Ladataan…</p>
  }

  if (!session) {
    // redirect to /login, remember where we came from
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  // logged in
  return children
}
