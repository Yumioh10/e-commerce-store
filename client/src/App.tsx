// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { sampleProducts } from './data'
import { Navbar, Container, Nav, Row, Col} from 'react-bootstrap'

function App() {
  return (
      <div className='d-flex flex-column h-full'>
        <header>
          <Navbar bg="dark" variant='dark' expand='lg'>
            <Container className='mt-3'>
              <Navbar.Brand>Maparasante</Navbar.Brand>
            </Container>
            <Nav>
              <a href="/cart" className="nav-link">
              Cart
              </a>
              <a href="/signin" className="nav-link">
              Sign In
              </a>
            </Nav>
          </Navbar>
          </header>
        <main>
          <Container className='mt-3'>
            <Row>
            {sampleProducts.map((product) => (
              <Col key={product.slug} sm={6} md={4} lg={3}>
                <img 
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <h2>{product.name}</h2>
                <p>{product.price} Dh</p>
              </Col>
            ))}
          </Row>
          </Container>
          
        </main>
        <footer>
          <div className='text-center'>© 2025 Maparasante. All rights reserved.</div>
        </footer>
      </div>
  )
}

export default App
