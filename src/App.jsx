// src/App.jsx
import React, { useState, useEffect } from 'react'
import {
  Routes,
  Route,
  Link,
  useNavigate
} from 'react-router-dom'
import { supabase } from './lib/supabaseClient'

import AuthOnly   from './components/AuthOnly'
import Home       from './routes/Home'
import Ilmoita    from './routes/Ilmoita'
import Reports    from './routes/Reports'
import Admin      from './routes/Admin'
import Login      from './routes/Login'
import NotFound   from './routes/NotFound'

export default function App() {
  const [session, setSession] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) =>
      setSession(session)
    )
    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_e, s) =>
        setSession(s)
      )
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <>
      <nav> 
        {/* your nav links */}
        {session
          ? (
            <>
              <Link to="/admin">Admin</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          )
          : <Link to="/login">Login</Link>
        }
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ilmoita" element={<Ilmoita />} />
          <Route path="/reports" element={<Reports />} />

          {/* public login */}
          <Route path="/login" element={<Login />} />

          {/* protected admin */}
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
    </>
  )
}
