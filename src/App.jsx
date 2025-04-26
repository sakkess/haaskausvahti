// src/App.jsx
import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import Container from './components/layout/Container'
import AuthOnly  from './components/AuthOnly'
import Home      from './routes/Home'
import Ilmoita   from './routes/Ilmoita'
import Reports   from './routes/Reports'
import Admin     from './routes/Admin'
import Login     from './routes/Login'
import NotFound  from './routes/NotFound'

export default function App() {
  const [session, setSession]     = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate                  = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    setMobileOpen(false)
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 font-sans antialiased">
      <nav className="bg-white shadow">
        <Container className="flex items-center justify-between px-6 py-4">
          {/* Logo + desktop links */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-base font-medium text-brand-800 hover:underline"
            >
              Missio
            </Link>
            <div className="hidden sm:flex ml-8 space-x-8">
              <Link
                to="/ilmoita"
                className="text-base font-medium text-neutral-700 hover:underline"
              >
                Tee säästöaloite
              </Link>
              <Link
                to="/reports"
                className="text-base font-medium text-neutral-700 hover:underline"
              >
                Säästöaloitteet
              </Link>
              {session ? (
                <Link
                  to="/admin"
                  className="text-base font-medium text-neutral-700 hover:underline"
                >
                  Tarkastus
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="text-base font-medium text-neutral-700 hover:underline"
                >
                  Kirjaudu
                </Link>
              )}
            </div>
          </div>

          {/* desktop logout + mobile hamburger */}
          <div className="flex items-center">
            {/* desktop logout */}
            {session && (
              <button
                onClick={handleLogout}
                className="hidden sm:block text-base font-medium text-neutral-700 hover:underline"
              >
                Kirjaudu ulos
              </button>
            )}

            {/* mobile menu button */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="sm:hidden p-2 focus:outline-none"
              aria-label={mobileOpen ? 'Sulje valikko' : 'Avaa valikko'}
            >
              {mobileOpen ? (
                // X icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger icon
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              )}
            </button>
          </div>
        </Container>

        {/* mobile dropdown */}
        {mobileOpen && (
          <div className="sm:hidden bg-white border-t px-6 py-4 space-y-4">
            <Link
              to="/ilmoita"
              onClick={() => setMobileOpen(false)}
              className="block text-base font-medium text-neutral-700 hover:underline"
            >
              Tee säästöaloite
            </Link>
            <Link
              to="/reports"
              onClick={() => setMobileOpen(false)}
              className="block text-base font-medium text-neutral-700 hover:underline"
            >
              Säästöaloitteet
            </Link>
            {session ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="block text-base font-medium text-neutral-700 hover:underline"
                >
                  Tarkastus
                </Link>
                <button
                  onClick={handleLogout}
                  className="block text-base font-medium text-neutral-700 hover:underline text-left w-full"
                >
                  Kirjaudu ulos
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-base font-medium text-neutral-700 hover:underline"
              >
                Kirjaudu
              </Link>
            )}
          </div>
        )}
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
