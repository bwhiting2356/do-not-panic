import React from 'react';
import { Table } from 'react-bootstrap';
import { useAppSelector } from '../../app/hooks';
import { selectProjects } from '../../features/projects/selectors';
import { ProjectRow } from './ProjectRow';

function Projects() {
  const projects = useAppSelector(selectProjects);
  return (
    <div>
      <Table size="sm">
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

