import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Container from '../components/layout/Container'
import Button    from '../components/ui/Button'

export default function Login() {
  const [email, setEmail]     = useState('')
  const [password, setPwd]    = useState('')
  const [error, setError]     = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const from     = location.state?.from?.pathname || '/admin'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      navigate(from, { replace: true })
    }
  }

  return (
    <Container className="max-w-md mx-auto py-12">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Admin Login
        </h1>

        {error && (
          <p className="text-red-600 mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1" htmlFor="email">
              Sähköposti
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block mb-1" htmlFor="password">
              Salasana
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPwd(e.target.value)}
              required
              className="w-full border rounded p-2"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-4"
          >
            {loading ? 'Kirjaudutaan…' : 'Kirjaudu'}
          </Button>
        </form>
      </div>
    </Container>
  )
}
