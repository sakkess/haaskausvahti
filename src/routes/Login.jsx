// src/routes/Login.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient.js'
import Container from '../components/layout/Container'
import FormField from '../components/form/FormField'
import Button from '../components/ui/Button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // If already logged in, redirect to admin
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/admin')
    })
  }, [navigate])

  // Email + password sign-in
  const handlePasswordSignIn = async (e) => {
    e.preventDefault()
    setError('')
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (authError) {
      setError(authError.message)
    } else {
      navigate('/admin')
    }
  }

  return (
    <Container className="max-w-md mx-auto py-12">
      <h2 className="text-2xl font-bold text-brand-800 mb-6">Admin Login</h2>
      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
      <form onSubmit={handlePasswordSignIn} className="space-y-4">
        <FormField
          label="Email"
          type="email"
          required
          value={email}
          onChange={setEmail}
        />
        <FormField
          label="Password"
          type="password"
          required
          value={password}
          onChange={setPassword}
        />
        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
    </Container>
  )
}
