import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="text-center max-w-2xl mx-auto py-12">
      <h1 className="text-3xl font-bold text-brand-800 mb-4">
        Kansalaissäästöaloite.fi
      </h1>

      <p className="text-lg text-neutral-700 mb-6">
        Me uskomme, että parempaa yhteistä tulevaisuutta rakennetaan
        yhteisillä teoilla. Siksi tarjoamme alustan, jossa jokainen voi
        nostaa esiin älykkäitä säästöaloitteita ja vaikuttaa siihen, miten
        julkisia varoja käytetään.
      </p>

      <Link
        to="/ilmoita"
        className="inline-flex items-center justify-center font-semibold px-6 py-3 rounded-xl transition bg-brand-600 text-white hover:bg-brand-700 w-fit mx-auto"
      >
        Tee säästöaloite
      </Link>
    </div>
  )
}
