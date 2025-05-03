import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";

function NavMenu() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

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
            <Link to="/home" className="nav-link fw-semibold">
              Home
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="nav-link fw-semibold">
                  My Profile
                </Link>
                <span
                  className="nav-link fw-semibold"
                  style={{ cursor: "pointer" }}
                  onClick={handleLogout}
                >
                  Logout
                </span>
              </>
            ) : (
              <Link to="/login" className="nav-link fw-semibold">
                Login/Signup
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavMenu;
