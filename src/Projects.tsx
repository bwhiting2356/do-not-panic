import React from 'react';
import './App.css';
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAppSelector } from './app/hooks';
import { selectProjects } from './features/projects/selectors';
import { ProjectActionsDropdown } from './components/ProjectActionsDropdown';
import { ProjectRow } from './components/ProjectRow';

function Projects() {
  const projects = useAppSelector(selectProjects);
  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th className="actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          { projects.map((project) => <ProjectRow project={project}/> )} 
        </tbody>
      </Table>
    </div>
  );
}

export default Projects;

