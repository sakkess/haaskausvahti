import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home   from './routes/Home'
import Report from './routes/Report'
import Admin  from './routes/Admin'
import Login  from './routes/Login'
import NotFound from './routes/NotFound'
import RequireAuth from './components/auth/RequireAuth'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/report"  element={<Report />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/admin"
          element={
            <RequireAuth>
              <Admin />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}
