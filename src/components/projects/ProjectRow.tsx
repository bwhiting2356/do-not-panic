import React from "react";
import { ProjectActionsDropdown } from "./ProjectActionsDropdown";
import { Project } from "../../shared/project";

type Props = {
  project: Project;
};

export function ProjectRow({ project }: Props) {
  const { id, title, description } = project;

  return (
    <tr key={id}>
      <td>{title}</td>
      <td>{description}</td>
      <td className="actions vertical-align">
        <ProjectActionsDropdown
          isEditing={true}
          project={project}
          onArchiveProject={() => {}}
          onToggleEditing={() => {}}
        />
      </td>
    </tr>
  );
}
