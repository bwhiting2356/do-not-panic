import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Pen } from "react-bootstrap-icons";
import { useAppSelector } from "../app/hooks";
import { selectProjects } from "../features/todos/selectors";
import { EditProjectsModal } from "./EditProjectsModal";

interface Props {
  project?: string;
  onChangeProject: (newProject: string) => void;
}

export function ProjectDropdown({
  project = "No Project",
  onChangeProject,
}: Props) {
  const projectOptions = useAppSelector(selectProjects);
  const [showEditProjects, setShowEditProjects] = useState(false);
  return (
    <Dropdown>
      <Dropdown.Toggle size="sm"  variant="outline-primary" id="dropdown-basic">
        {project}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {projectOptions.map((projectOption) => (
          <Dropdown.Item
            key={projectOption}
            onClick={() => onChangeProject(projectOption)}
          >
            {projectOption}
          </Dropdown.Item>
        ))}
        <Dropdown.Divider />
        <Dropdown.Item
          style={{ display: "flex", alignItems: "center" }}
          onClick={() => setShowEditProjects(true)}
        >
          <Pen style={{ marginRight: "10px" }} />
          Edit Projects
        </Dropdown.Item>
      </Dropdown.Menu>
      <EditProjectsModal
        show={showEditProjects}
        toggleEditProjects={() => setShowEditProjects(!showEditProjects)}
      />
    </Dropdown>
  );
}
