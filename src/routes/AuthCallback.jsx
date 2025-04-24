// src/routes/AuthCallback.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient.js'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Grab the session from the magic-link URL and store it
    supabase.auth
      .getSessionFromUrl({ storeSession: true })
      .then(({ error }) => {
        if (error) throw error
        // On success, send them to the admin page
        navigate('/admin', { replace: true })
      })
      .catch(() => {
        // If anything goes wrong, back to login
        navigate('/login', { replace: true })
      })
  }, [navigate])

  return (
    <p className="text-center mt-8 text-neutral-600">
      Finalizing login…
    </p>
  )
}
