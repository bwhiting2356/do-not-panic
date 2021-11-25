import React, { useState } from "react";
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export function NavTabs() {
  const [expanded, setExpanded] = useState(false);
  const { pathname } = useLocation();
  const key = pathname !== "/" ? pathname : "/todos";

  const keyHeaderMap: Record<string, string> = {
    "/todos": "Todos",
    "/projects": "Projects",
    "/templates": "Templates",
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
              {Object.keys(keyHeaderMap).map((key) => (
                <Nav.Link
                  key={key}
                  as={Link}
                  to={key}
                  onClick={() => setExpanded(false)}
                >
                  {keyHeaderMap[key]}
                </Nav.Link>
              ))}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
    // <Nav variant="tabs" defaultActiveKey="/todos" activeKey={key}>
    //   <Nav.Item>
    //     <Nav.Link eventKey="/todos" as={Link} to="/todos">
    //       <h5>Todos</h5>
    //     </Nav.Link>
    //   </Nav.Item>
    //   <Nav.Item>
    //     <Nav.Link eventKey="/projects" as={Link} to="/projects">
    //       <h5>Projects</h5>
    //     </Nav.Link>
    //   </Nav.Item>
    //   <Nav.Item>
    //     <Nav.Link eventKey="/templates" as={Link} to="/templates">
    //       <h5>Templates</h5>
    //     </Nav.Link>
    //   </Nav.Item>
    // </Nav>
  );
}
