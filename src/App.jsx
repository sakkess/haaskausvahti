import { Routes, Route, Link } from 'react-router-dom'
import Home from './routes/Home'
import Ilmoita from './routes/Ilmoita'
import Reports from './routes/Reports'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow">
        <div className="max-w-xl mx-auto p-4 flex space-x-4">
          <Link to="/" className="text-blue-700 font-bold hover:underline">
            Kansalaissäästöaloite.fi
          </Link>
          <Link to="/ilmoita" className="text-blue-700 font-bold hover:underline">
            Tee säästöaloite
          </Link>
          <Link to="/reports" className="text-blue-700 font-bold hover:underline">
            Säästöaloitteet
          </Link>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        {/* ➊ Home gets rendered without extra padding / max‑width */}
        <Route path="/" element={<Home />} />

        {/* ➋ Other pages wrapped in a centred container */}
        <Route
          path="/ilmoita"
          element={
            <main className="p-8 max-w-xl mx-auto">
              <Ilmoita />
            </main>
          }
        />
        <Route
          path="/reports"
          element={
            <main className="p-8 max-w-xl mx-auto">
              <Reports />
            </main>
          }
        />
      </Routes>
    </div>
  )
}

export default App
