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
import AuthOnly  from './components/AuthOnly'
import Home      from './routes/Home'
import Ilmoita   from './routes/Ilmoita'
import Reports   from './routes/Reports'
import Admin     from './routes/Admin'
import Login     from './routes/Login'
import NotFound  from './routes/NotFound'

export default function App() {
  const [session, setSession]       = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showTop, setShowTop]       = useState(false)
  const [dark, setDark]             = useState(false)
  const navigate                    = useNavigate()

  // Auth subscription
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  // Back-to-top visibility
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Dark mode: read from localStorage or system, apply class on <html>
  useEffect(() => {
    const stored = localStorage.getItem('dark-mode')
    const prefers = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = stored ? JSON.parse(stored) : prefers
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  const toggleDark = () => {
    setDark(d => {
      localStorage.setItem('dark-mode', JSON.stringify(!d))
      document.documentElement.classList.toggle('dark', !d)
      return !d
    })
  }

  const handleLogout = async () => {
    setMobileOpen(false)
    await supabase.auth.signOut()
    navigate('/')
  }

  const navClass = ({ isActive }) =>
    `text-base font-medium hover:underline ${
      isActive
        ? 'text-brand-500 dark:text-brand-300'
        : 'text-neutral-700 dark:text-neutral-300'
    }`

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 font-sans antialiased transition-colors">
      {/* Sticky navbar */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow transition-colors">
        <Container className="flex items-center justify-between px-6 py-4">
          {/* Logo + desktop links */}
          <div className="flex items-center">
            <NavLink to="/" className={navClass}>
              Missio
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

          {/* Desktop logout + theme toggle + mobile hamburger */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              className="p-2 rounded focus:outline-none hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {dark ? (
                // Sun icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 5a1 1 0 011 1v1a1 1 0 11-2 0V6a1 1 0 011-1zm-4.22 1.22a1 1 0 011.415 1.415l-.707.707a1 1 0 11-1.415-1.414l.707-.708zM4 10a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm6 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm4.22-1.22a1 1 0 00-1.415 1.415l.707.707a1 1 0 101.415-1.414l-.707-.708zM15 9a1 1 0 100 2h1a1 1 0 100-2h-1zm-4.22-3.78a1 1 0 10-1.415-1.414l-.707.707a1 1 0 101.414 1.415l.708-.708z" />
                  <circle cx="10" cy="10" r="3" />
                </svg>
              ) : (
                // Moon icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-800 dark:text-gray-200"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293a8 8 0 11-10.586-10.586 8.002 8.002 0 0010.586 10.586z" />
                </svg>
              )}
            </button>

            {session && (
              <button
                onClick={handleLogout}
                className="hidden sm:block text-base font-medium text-neutral-700 dark:text-neutral-300 hover:underline"
              >
                Kirjaudu ulos
              </button>
            )}

            <button
              onClick={() => setMobileOpen(o => !o)}
              className="sm:hidden p-2 focus:outline-none rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
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
                        d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              )}
            </button>
          </div>
        </Container>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="sm:hidden bg-white dark:bg-gray-800 border-t dark:border-neutral-700 px-6 py-4 space-y-4 transition-colors">
            <Link to="/ilmoita" onClick={() => setMobileOpen(false)} className="block text-base font-medium text-neutral-700 dark:text-neutral-300 hover:underline">
              Tee säästöaloite
            </Link>
            <Link to="/reports" onClick={() => setMobileOpen(false)} className="block text-base font-medium text-neutral-700 dark:text-neutral-300 hover:underline">
              Säästöaloitteet
            </Link>
            {session ? (
              <>
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="block text-base font-medium text-neutral-700 dark:text-neutral-300 hover:underline">
                  Tarkastus
                </Link>
                <button onClick={handleLogout} className="block w-full text-left text-base font-medium text-neutral-700 dark:text-neutral-300 hover:underline">
                  Kirjaudu ulos
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)} className="block text-base font-medium text-neutral-700 dark:text-neutral-300 hover:underline">
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

      {/* Back-to-top button */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-full shadow-md focus:outline-none transition-colors"
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-700 dark:text-neutral-200" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  )
}
