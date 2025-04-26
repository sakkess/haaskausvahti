// src/App.jsx

import React, { useState, useEffect } from 'react'
import {
  Routes,
  Route,
  NavLink,
  Link,
  useNavigate
} from 'react-router-dom'
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
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const navigate = useNavigate()

  // subscribe to auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  // back-to-top visibility
  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > 300)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    setMobileOpen(false)
    await supabase.auth.signOut()
    navigate('/')
  }

  // helper to build nav link classes
  const navClass = ({ isActive }) =>
    `text-base font-medium hover:underline ${
      isActive ? 'text-brand-800' : 'text-neutral-700'
    }`

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 font-sans antialiased">
      {/* Sticky navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow">
        <Container className="flex items-center justify-between px-6 py-4">
          {/* Logo + desktop links */}
          <div className="flex items-center">
            <NavLink
              to="/"
              className={({ isActive }) => `flex items-center ${navClass({ isActive })}`}
            >
              <img src="/favicon.png" alt="Etusivu" className="h-6 w-6 mr-2" />
              Etusivu
            </NavLink>

            <div className="hidden sm:flex ml-8 space-x-8">
              <NavLink to="/ilmoita" className={navClass}>
                Tee säästöaloite
              </NavLink>
              <NavLink to="/reports" className={navClass}>
                Säästöaloitteet
              </NavLink>
              {session ? (
                <NavLink to="/admin" className={navClass}>
                  Tarkastus
                </NavLink>
              ) : (
                <NavLink to="/login" className={navClass}>
                  Kirjaudu
                </NavLink>
              )}
            </div>
          </div>

          {/* Desktop logout + mobile hamburger */}
          <div className="flex items-center">
            {session && (
              <button
                onClick={handleLogout}
                className="hidden sm:block text-base font-medium text-neutral-700 hover:underline"
              >
                Kirjaudu ulos
              </button>
            )}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="sm:hidden p-2 focus:outline-none"
              aria-label={mobileOpen ? 'Sulje valikko' : 'Avaa valikko'}
            >
              {mobileOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </Container>

        {/* Mobile dropdown */}
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
                  className="block w-full text-left text-base font-medium text-neutral-700 hover:underline"
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
          <Route
            path="/login"
            element={<Login />}
          />
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

      {/* Back-to-top button */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-4 right-4 bg-white p-3 rounded-full shadow-md focus:outline-none"
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg"
               className="h-6 w-6 text-neutral-700"
               fill="none"
               viewBox="0 0 24 24"
               stroke="currentColor">
            <path strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  )
}
