import React, { useState, useEffect } from 'react'
import {
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Container from './components/layout/Container'
import Home from './routes/Home'
import Ilmoita from './routes/Ilmoita'
import Reports from './routes/Reports'
import Admin from './routes/Admin'
import Login from './routes/Login'
import NotFound from './routes/NotFound'

function AuthOnly({ children }) {
  // undefined = “not checked yet”; null = “checked, not logged in”
  const [session, setSession] = useState(undefined)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // subscribe to changes
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <p className="text-center py-8">Ladataan…</p>
  }
  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return children
}

export default function App() {
  const [session, setSession] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) =>
      setSession(session)
    )
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_e, session) => setSession(session))
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 font-sans antialiased">
      <nav className="bg-white shadow">
        <Container className="flex flex-wrap items-center justify-center gap-4 px-4 py-4 text-sm font-medium text-brand-800">
          <Link to="/" className="hover:underline">Kansalaissäästöaloite.fi</Link>
          <Link to="/ilmoita" className="hover:underline">Tee säästöaloite</Link>
          <Link to="/reports" className="hover:underline">Säästöaloitteet</Link>
          {session ? (
            <>
              <Link to="/admin" className="hover:underline">Admin</Link>
              <button onClick={handleLogout} className="hover:underline">Logout</button>
            </>
          ) : (
            <Link to="/login" className="hover:underline">Login</Link>
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
              <AuthOnly>
                <Admin />
              </AuthOnly>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}
