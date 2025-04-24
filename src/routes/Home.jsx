import { Link } from 'react-router-dom'
import Container from '../components/layout/Container'
import Button from '../components/ui/Button'

export default function Home() {
  return (
    <Container className="text-center py-12">
      <h1 className="text-3xl font-bold text-brand-800 mb-4">
        Kansalaissäästöaloite.fii
      </h1>

      <p className="text-lg text-neutral-700 mb-6">
        Me uskomme, että parempaa yhteistä tulevaisuutta rakennetaan
        yhteisillä teoilla. Siksi tarjoamme alustan, jossa jokainen voi
        nostaa esiin älykkäitä säästöaloitteita ja vaikuttaa siihen, miten
        julkisia varoja käytetään.
      </p>

      <Button as={Link} to="/ilmoita" variant="primary" className="mx-auto w-fit">
        Tee säästöaloite
      </Button>
    </Container>
  )
}