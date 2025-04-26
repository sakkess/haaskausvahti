import React, { useState, useEffect } from 'react'
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom'
import supabase from './supabaseClient'
import Home from './Home'
import Ilmoita from './Ilmoita'
import Reports from './Reports'
import Admin from './Admin'
import Login from './Login'
import NotFound from './NotFound'

function AuthOnly({ children }) {
  // undefined = “we don’t know yet”; null = “definitely not logged in”
  const [session, setSession] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // watch for future auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <p className="text-center py-8">Ladataan…</p>
  }

  if (!session) {
    return (
      <Navigate to="/login" replace state={{ from: location }} />
    )
  }

  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ilmoita" element={<Ilmoita />} />
      <Route path="/reports" element={<Reports />} />

      {/* Public login page */}
      <Route path="/login" element={<Login />} />

      {/* Protected admin page */}
      <Route
        path="/admin"
        element={
          <AuthOnly>
            <Admin />
          </AuthOnly>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}