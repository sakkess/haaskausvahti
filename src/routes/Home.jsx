import { Link } from 'react-router-dom'
import Button from '../components/Button'

export default function Home() {
  return (
    <section className="bg-brand-600 text-white py-24">
      <div className="max-w-3xl mx-auto text-center space-y-8 px-4 md:px-8">
        <h1 className="text-h1">Kansalaissäästöaloite</h1>

        <p className="text-xl leading-relaxed">
          Me uskomme, että parempaa yhteistä tulevaisuutta rakennetaan
          yhteisillä teoilla. Siksi tarjoamme alustan, jossa jokainen voi
          nostaa esiin älykkäitä säästöaloitteita ja vaikuttaa siihen, miten
          julkisia varoja käytetään.
        </p>

        <Button as={Link} to="/ilmoita" variant="secondary">
          Tee säästöaloite
        </Button>
      </div>
    </section>
  )
}
