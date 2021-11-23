import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Archive, Pencil } from "react-bootstrap-icons";
import { Project } from "../../shared/project";

type Props = {
  project: Project;
  isEditing: boolean;
  onArchiveProject: () => void;
  onToggleEditing: () => void;
};

export function ProjectActionsDropdown({
  project,
  isEditing,
  onArchiveProject,
  onToggleEditing,
}: Props) {
  const [show, setShow] = useState(false);
  return (
    <Dropdown
      show={show}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <Dropdown.Toggle
        variant="outline-primary"
        id="dropdown-basic"
        size="sm"
      ></Dropdown.Toggle>

      <Dropdown.Menu>
        {project.archivedDate ? (
          <Dropdown.Item eventKey="1" onClick={onArchiveProject}>
            <span style={{ marginRight: "10px" }}>
              <Archive />
            </span>
            Archive
          </Dropdown.Item>
        ) : (
          <Dropdown.Item eventKey="1" onClick={onArchiveProject}>
            <span style={{ marginRight: "10px" }}>
              <Archive />
            </span>
            Remove from Archive
          </Dropdown.Item>
        )}
        <Dropdown.Item
          eventKey="1"
          onClick={() => {
            onToggleEditing();
            setShow(false);
          }}
        >
          <span style={{ marginRight: "10px" }}>
            <Pencil />
          </span>
          {isEditing ? "Stop editing" : "Edit"}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
