// src/routes/Home.jsx
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="text-center py-12">
      {/* Site title */}
      <h1 className="text-4xl font-bold text-text mb-4">
        Kansalaissäästöaloite.fi
      </h1>

      {/* Mission statement */}
      <p className="text-lg text-secondary mb-6 px-4">
        Me uskomme, että parempaa yhteistä tulevaisuutta rakennetaan yhteisillä teoilla.
        Siksi tarjoamme alustan, jossa jokainen voi nostaa esiin älykkäitä säästöaloitteita
        ja vaikuttaa siihen, miten julkisia varoja käytetään.
      </p>

      {/* Call to action */}
      <Link
        to="/ilmoita"
        className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
      >
        Tee säästöaloite
      </Link>
    </div>
  )
}
