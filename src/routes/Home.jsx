import { Link } from 'react-router-dom'

export default function Home() {
  return (
    /* ➊ full‑viewport width (remove outer max‑w) */
    <section className="bg-emerald-600 text-white py-24">
      {/* ➋ inner container limited for readability */}
      <div className="max-w-3xl mx-auto text-center space-y-8 px-4 md:px-8">
        <h1 className="text-5xl md:text-6xl font-extrabold">
          Kansalaissäästöaloite.fi
        </h1>

        <p className="text-xl leading-relaxed">
          Me uskomme, että parempaa yhteistä tulevaisuutta rakennetaan
          yhteisillä teoilla. Siksi tarjoamme alustan, jossa jokainen voi
          nostaa esiin älykkäitä säästöaloitteita ja vaikuttaa siihen, miten
          julkisia varoja käytetään.
        </p>

        <Link
          to="/ilmoita"
          className="inline-block bg-white text-emerald-600 font-semibold px-10 py-4 rounded-full
                     hover:shadow-xl hover:bg-emerald-50 transition"
        >
          Tee säästöaloite
        </Link>
      </div>
    </section>
  )
}
