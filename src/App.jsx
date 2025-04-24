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
  const [session, setSession] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (!session) navigate('/login')
    })
    // subscribe to changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        if (!session) {
          navigate('/login')
        }
      }
    )
    return () => listener.subscription.unsubscribe()
  }, [navigate])

  if (!session) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  const [session, setSession] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // track session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 font-sans antialiased">
      {/* Navigation */}
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
              <button
                onClick={handleLogout}
                className="hover:underline"
              >
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

      {/* Main content */}
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
