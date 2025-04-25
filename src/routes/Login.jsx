import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
// ⬇️ path fixed: go up two levels
import { supabase } from '../../lib/supabaseClient'

import Container from '../components/layout/Container'
import Button    from '../components/ui/Button'

export default function Login() {
  const [email, setEmail]     = useState('')
  const [password, setPwd]    = useState('')
  const [error, setError]     = useState(null)
  const [loading, setLoading] = useState(false)

  const nav      = useNavigate()
  const location = useLocation()
  const from     = location.state?.from?.pathname || '/admin'

  async function handle(e) {
    e.preventDefault()
    setLoading(true); setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (error) setError(error.message)
    else       nav(from, { replace: true })
  }

  return (
    <Container className="max-w-sm py-12">
      <h1 className="mb-6 text-center text-2xl font-bold">Kirjaudu sisään</h1>

      <form onSubmit={handle} className="space-y-6">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Sähköposti"
          className="input"
          required
        />
        <input
          type="password"
          value={password}
          onChange={e => setPwd(e.target.value)}
          placeholder="Salasana"
          className="input"
          required
        />

        {error && <p className="text-red-700">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Kirjaudutaan…' : 'Kirjaudu'}
        </Button>
      </form>
    </Container>
  )
}
