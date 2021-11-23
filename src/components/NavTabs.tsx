import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export function NavTabs() {
  const { pathname } = useLocation();
  return (
    <Nav variant="tabs" defaultActiveKey="/todos" activeKey={pathname}>
      <Nav.Item>
        <Nav.Link eventKey="/todos" as={Link} to="/todos">
          Todos
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="/projects" as={Link} to="/projects">
          Projects
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}
