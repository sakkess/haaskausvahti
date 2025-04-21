import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="text-center max-w-2xl mx-auto py-12">
      <h1 className="text-h1 text-brand-800 mb-4">Kansalaissäästöaloite.fi</h1>

      {/* Mission statement, inspired by “Start with Why” */}
      <p className="text-lg text-neutral-700 mb-6">
        Me uskomme, että parempaa yhteistä tulevaisuutta rakennetaan yhteisillä teoilla.
        Siksi tarjoamme alustan, jossa jokainen voi nostaa esiin älykkäitä säästöaloitteita
        ja vaikuttaa siihen, miten julkisia varoja käytetään.
      </p>

      <Link
        to="/ilmoita"
        className="btn-primary mx-auto block w-fit"
      >
        Tee säästöaloite
      </Link>
    </div>
  )
}
