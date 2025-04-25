// src/components/auth/RequireAuth.jsx
import { useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
// 🔥 path fixed: go three levels up to reach the root-level lib folder
import { supabase } from '../../../lib/supabaseClient'

export default function RequireAuth({ children }) {
  const [ready, setReady] = useState(false)
  const [user, setUser]   = useState(null)
  const location          = useLocation()

  useEffect(() => {
    let alive = true
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (alive) {
        setUser(user)
        setReady(true)
      }
    })
    return () => { alive = false }
  }, [])

  if (!ready) return null
  if (!user)  return (
    <Navigate to="/login" replace state={{ from: location }} />
  )
  return children
}
