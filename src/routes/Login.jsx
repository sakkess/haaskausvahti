// src/routes/Login.jsx
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient.js'
import Container from '../components/layout/Container'
import Button from '../components/ui/Button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]   = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate  = useNavigate()
  const location  = useLocation()
  const redirectTo = location.state?.from?.pathname || '/admin'

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
    } else {
      // success → go where the user originally wanted (usually /admin)
      navigate(redirectTo, { replace: true })
    }
    setLoading(false)
  }

  return (
    <Container className="max-w-sm py-12">
      <h1 className="mb-6 text-center text-2xl font-bold text-brand-800">
        Kirjaudu sisään
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Sähköposti
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Salasana
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 shadow-sm focus:border-brand-500 focus:ring-brand-500"
          />
        </div>

        {error && (
          <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="w-full disabled:opacity-60"
        >
          {loading ? 'Kirjaudutaan…' : 'Kirjaudu'}
        </Button>
      </form>
    </Container>
  )
}
