import { useState } from "react";
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export function NavTabs() {
  const [expanded, setExpanded] = useState(false);
  const { pathname } = useLocation();
  const key = pathname === "/" ? "/todos" : pathname;

  const keyHeaderMap: Record<string, string> = {
    "/todos": "Todos",
    "/projects": "Projects",
    "/templates": "Templates",
    "/settings": "Settings",
    "/archive": "Archive",
  };

  return (
    <Navbar bg="light" expand={false} expanded={expanded}>
      <Container fluid>
        <Navbar.Toggle
          aria-controls="offcanvasNavbar"
          style={{ marginRight: "10px" }}
          onClick={() => setExpanded(!expanded)}
        />
        <Navbar.Brand href="#">{keyHeaderMap[key]}</Navbar.Brand>

        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="start"
        >
          <Offcanvas.Header closeButton onClick={() => setExpanded(false)}>
            <Offcanvas.Title id="offcanvasNavbarLabel">Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              {Object.keys(keyHeaderMap).map((pathKey) => (
                <Nav.Link
                  key={pathKey}
                  as={Link}
                  to={pathKey}
                  onClick={() => setExpanded(false)}
                >
                  {keyHeaderMap[pathKey]}
                </Nav.Link>
              ))}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}
