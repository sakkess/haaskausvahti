// src/App.jsx
import { Routes, Route, Link } from 'react-router-dom'
import Home from './routes/Home'
import Ilmoita from './routes/Ilmoita'
import Reports from './routes/Reports'

function App() {
  return (
    <div className="min-h-screen bg-background text-text">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-secondary">
        <div className="max-w-xl mx-auto p-4 flex space-x-6">
          <Link
            to="/"
            className="text-secondary hover:text-primary-600 font-semibold"
          >
            Missio
          </Link>
          <Link
            to="/ilmoita"
            className="text-secondary hover:text-primary-600 font-semibold"
          >
            Tee säästöaloite
          </Link>
          <Link
            to="/reports"
            className="text-secondary hover:text-primary-600 font-semibold"
          >
            Säästöaloitteet
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-8 max-w-xl mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ilmoita" element={<Ilmoita />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
