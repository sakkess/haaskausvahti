import { Routes, Route, Link } from 'react-router-dom'
import Home from './routes/Home'
import Ilmoita from './routes/Ilmoita'
import Reports from './routes/Reports'
import Admin from './routes/Admin'
import Container from './components/layout/Container'

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 font-sans antialiased">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <Container className="flex flex-wrap items-center justify-center gap-4 px-4 py-4 text-sm font-medium text-brand-800">
          <Link to="/" className="hover:underline">
            Kansalaissäästöaloite.fi
          </Link>
          <Link to="/ilmoita" className="hover:underline">
            Tee säästöaloite
          </Link>
          <Link to="/reports" className="hover:underline">
            Säästöaloitteet
          </Link>
          <Link to="/admin" className="hover:underline">
            Admin
          </Link>
        </Container>
      </nav>

      {/* Main content */}
      <main className="py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ilmoita" element={<Ilmoita />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  )
}