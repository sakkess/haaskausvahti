import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <section className="bg-gradient-to-r from-brand-500 to-brand-700 text-white py-20">
      <div className="max-w-3xl mx-auto text-center space-y-6 px-4 md:px-8">
        <h1 className="text-5xl font-extrabold">Kansalaissäästöaloite</h1>

        <p className="text-xl">
          Me uskomme, että parempaa yhteistä tulevaisuutta rakennetaan
          yhteisillä teoilla. Siksi tarjoamme alustan, jossa jokainen voi
          nostaa esiin älykkäitä säästöaloitteita ja vaikuttaa siihen, miten
          julkisia varoja käytetään.
        </p>

        <Link
          to="/ilmoita"
          className="inline-block bg-white text-brand-500 font-semibold px-8 py-3 rounded-full
                     hover:shadow-lg transition"
        >
          Tee säästöaloite
        </Link>
      </div>
    </section>
  )
}
