import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export function NavTabs() {
  const { pathname } = useLocation();
  const key = pathname !== '/' ? pathname : '/todos';

  return (
    <Nav variant="tabs" defaultActiveKey="/todos" activeKey={key}>
      <Nav.Item>
        <Nav.Link eventKey="/todos" as={Link} to="/todos">
          <h5>Todos</h5>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="/projects" as={Link} to="/projects">
          <h5>Projects</h5>
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="/templates" as={Link} to="/templates">
          <h5>Templates</h5>
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}
