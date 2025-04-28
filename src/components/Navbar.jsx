import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

function NavMenu() {
  return (
    <Navbar expand="lg" bg="transparent" variant="light">
      <Container>
        <Navbar.Brand className="fw-bold brand-text">
          <Link to="/" style={{ color: "#2A2E81", textDecoration: "none" }}>
            MyDishDB
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Link to="/" className="nav-link fw-semibold">
              Home
            </Link>
            <Link to="/login" className="nav-link fw-semibold">
              Login/Signup
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavMenu;
