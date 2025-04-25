import { Link } from 'react-router-dom'
import Container from '../components/layout/Container'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <Container className="text-center py-12">
      <h1 className="mb-4 text-4xl font-bold text-brand-800">404</h1>
      <p className="mb-6 text-neutral-700">Sivua ei löytynyt.</p>
      <Button as={Link} to="/" variant="primary">
        Takaisin etusivulle
      </Button>
    </Container>
  )
}
