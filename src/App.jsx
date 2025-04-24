// src/App.jsx

import { useState, useEffect } from 'react'
import {
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom'
import { supabase } from '../lib/supabaseClient.js'
import Home from './routes/Home'
import Ilmoita from './routes/Ilmoita'
import Reports from './routes/Reports'
import Admin from './routes/Admin'
import Login from './routes/Login'
import Container from './components/layout/Container'

function RequireAuth({ children }) {
  // undefined = “still checking”, null = unauthenticated, object = session
  const [session, setSession] = useState(undefined)
  const navigate = useNavigate()

  // 1) Load initial session & subscribe to changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  // 2) Once we know there’s no session, kick them to login
  useEffect(() => {
    if (session === null) {
      navigate('/login', { replace: true })
    }
  }, [session, navigate])

  // 3) While we’re still checking, render nothing (or a spinner)
  if (session === undefined) {
    return null
  }

  // 4) If we reach here, session !== null, so render the protected UI
  return children
}

export default function App() {
  const [session, setSession] = useState(null)
  const navigate = useNavigate()

  // Track session state for nav links
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 font-sans antialiased">
      <nav className="bg-white shadow">
        <Container className="flex flex-wrap items-center justify-center gap-4 px-4 py-4 text-sm font-medium text-brand-800">
          <Link to="/" className="hover:underline">
            Kansalaissäästöaloite.fi
          </Link>
          <Link to="/ilmoita" className="hover:underline">
            Tee säästöaloite
          </Link>
          <Link to="/reports" className="hover:underline">
            Säästöaloitteet
          </Link>
          {session ? (
            <>
              <Link to="/admin" className="hover:underline">
                Admin
              </Link>
              <button onClick={handleLogout} className="hover:underline">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:underline">
              Login
            </Link>
          )}
        </Container>
      </nav>

      <main className="py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ilmoita" element={<Ilmoita />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <Admin />
              </RequireAuth>
            }
          />
        </Routes>
      </main>
    </div>
  )
}
