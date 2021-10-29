import React from "react";
import { Dropdown } from "react-bootstrap";
import { Project } from "../shared/project.enum";

interface Props {
  project?: Project | string;
  onChangeProject: (newProject: Project) => void;
}

export function ProjectDropdown({
  project = "No Project",
  onChangeProject,
}: Props) {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
        {project}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {Object.keys(Project).map((projectKey) => (
          <Dropdown.Item
            key={projectKey}
            onClick={() => onChangeProject(projectKey as Project)}
          >
            {projectKey}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
