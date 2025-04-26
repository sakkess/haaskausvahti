// src/App.jsx
import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import Container from './components/layout/Container'
import AuthOnly from './components/AuthOnly'
import Home from './routes/Home'
import Ilmoita from './routes/Ilmoita'
import Reports from './routes/Reports'
import Admin from './routes/Admin'
import Login from './routes/Login'
import NotFound from './routes/NotFound'

export default function App() {
  const [session, setSession] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 font-sans antialiased">
      <nav className="bg-white shadow">
        <Container className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
          {/* Left side nav links */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-lg font-bold text-brand-800 hover:underline">
              Missio
            </Link>
            <Link to="/ilmoita" className="hover:underline">
              Tee säästöaloite
            </Link>
            <Link to="/reports" className="hover:underline">
              Säästöaloitteet
            </Link>
            {session ? (
              <Link to="/admin" className="hover:underline">
                Admin
              </Link>
            ) : (
              <Link to="/login" className="hover:underline">
                Login
              </Link>
            )}
          </div>

          {/* Right side: only logout when logged in */}
          <div className="flex items-center space-x-4">
            {session && (
              <button onClick={handleLogout} className="hover:underline">
                Logout
              </button>
            )}
          </div>
        </Container>
      </nav>

      <main className="py-8">
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
      </main>
    </div>
  )
}
