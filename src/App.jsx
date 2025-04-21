import { Routes, Route, Link } from 'react-router-dom'
import Home from './routes/Home'
import Ilmoita from './routes/Ilmoita'
import Reports from './routes/Reports'
import Container from './components/layout/Container'

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 font-sans antialiased">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <Container className="flex gap-4 py-4">
          <Link to="/" className="text-brand-700 font-bold hover:underline">
            Kansalaissäästöaloite.fi
          </Link>
          <Link to="/ilmoita" className="text-brand-700 font-bold hover:underline">
            Tee säästöaloite
          </Link>
          <Link to="/reports" className="text-brand-700 font-bold hover:underline">
            Säästöaloitteet
          </Link>
        </Container>
      </nav>

      {/* Main content */}
      <main className="py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ilmoita" element={<Ilmoita />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  )
}
