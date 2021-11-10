import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Pen } from "react-bootstrap-icons";
import { useAppSelector } from "../app/hooks";
import { selectProjects } from "../features/todos/selectors";
import { EditProjectsModal } from "./EditProjectsModal";

type Props = {
  project?: string;
  isEditing: boolean;
  onChangeProject: (newProject: string) => void;
  onEscape?: () => void;
};

export function ProjectDropdown({
  project = "No Project",
  isEditing,
  onChangeProject,
  onEscape,
}: Props) {
  const projectOptions = useAppSelector(selectProjects);
  const [showEditProjects, setShowEditProjects] = useState(false);

  if (!isEditing) {
    return (
      <div className="editable-item">
        <div className="content">{project}</div>
      </div>
    );
  }

  const handleEscape = (e: any) => {
    if (e.key === "Escape") {
      onEscape && onEscape();
    }
  };

  const onItemKeyDown = (e: any, projectOption: string) => {
    if (e.code === 'Tab' || e.code === 'Enter') {
      onChangeProject(projectOption);
      onEscape && onEscape();
      e.stopPropagation();
    } 
  }
  return (
    <Dropdown onKeyDown={handleEscape}>
      <Dropdown.Toggle size="sm" variant="outline-primary" id="dropdown-basic">
        {project}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {projectOptions.map((projectOption) => (
          <Dropdown.Item
            tabIndex={-1}
            key={projectOption}
            onKeyDown={e => onItemKeyDown(e, projectOption)}
            onClick={() => onChangeProject(projectOption)}
          >
            {projectOption}
          </Dropdown.Item>
        ))}
        <Dropdown.Divider />
        <Dropdown.Item
          tabIndex={-1}
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
