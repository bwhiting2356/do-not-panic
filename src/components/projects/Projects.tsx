import React from 'react';
import { Table } from 'react-bootstrap';
import { useAppSelector } from '../../app/hooks';
import { selectProjects } from '../../features/projects/selectors';
import { KeyboardShortcutsModal } from '../modals/KeyboardShortcutsModal';
import { ProjectAnalyticsModal } from '../modals/project-analytics/ProjectAnalyticsModal';
import { ProjectRow } from './ProjectRow';
import { useProjectsKeyboardShortcuts } from './useProjectsKeyboardShortcuts';

function Projects() {
  const projects = useAppSelector(selectProjects);

  useProjectsKeyboardShortcuts();

  return (
    <div>
      <Table size="sm">
        <thead>
          <tr>
            <th className="title">Title</th>
            <th className="description">Description</th>
            <th className="actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          { projects.map((project) => <ProjectRow project={project}/> )} 
        </tbody>
      </Table>
      <KeyboardShortcutsModal />
      <ProjectAnalyticsModal />
    </div>
  );
}

export default Projects;

