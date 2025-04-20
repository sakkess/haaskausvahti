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