import React from "react";
import { Table } from "react-bootstrap";
import { ProjectRow } from "./ProjectRow";
import { Project } from "../../shared/project";

interface Props {
  projects: Project[];
}
export function ProjectTable({ projects }: Props) {
  return (
    <Table size="sm">
      <thead>
        <tr>
          <th className="title">Title</th>
          <th className="description">Description</th>
          <th className="actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project) => (
          <ProjectRow project={project} />
        ))}
      </tbody>
    </Table>
  );
}
