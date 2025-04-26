import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const from     = location.state?.from?.pathname || '/admin'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    setLoading(false)
    if (error) setError(error.message)
    else navigate(from, { replace: true })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
      <h1 className="text-2xl mb-4">Admin Login</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="input"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="input"
      />
      <button disabled={loading} className="btn mt-4">
        {loading ? 'Logging in…' : 'Login'}
      </button>
    </form>
  )
}
