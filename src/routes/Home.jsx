import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Haaskausvahti</h1>
      <p className="text-lg text-gray-700">
        Paljasta julkisen rahan hukka. Kerro epäkohdista. Tue tutkivaa journalismia.
      </p>
      <Link
        to="/ilmoita"
        className="inline-block bg-blue-700 text-white px-6 py-3 rounded-lg mt-6 hover:bg-blue-800 transition"
      >
        Ilmoita hukasta
      </Link>
    </div>
  )
}
