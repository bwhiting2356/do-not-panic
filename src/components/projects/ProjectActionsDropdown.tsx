import React, { useState } from "react";
import { Dropdown, OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";
import { Archive, Pencil, Trash } from "react-bootstrap-icons";
import { Project } from "../../shared/project";
import { DisabledDropdownItemWithTooltip } from "./DisableWithTooltip";

type Props = {
  project: Project;
  isEditing: boolean;
  onArchiveProject: () => void;
  onRemoveProjectFromArchive: () => void;
  onToggleEditing: () => void;
  canDelete: boolean;
  onDelete: () => void;
};

export function ProjectActionsDropdown({
  project,
  isEditing,
  onArchiveProject,
  onRemoveProjectFromArchive,
  onToggleEditing,
  canDelete,
  onDelete
}: Props) {
  
  const [show, setShow] = useState(false);
  const isNoneProject = project.title.toLowerCase() === 'none';
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
        {!Boolean(project.archivedDate) ? (
          <Dropdown.Item eventKey="1" onClick={onArchiveProject}>
            <span style={{ marginRight: "10px" }}>
              <Archive />
            </span>
            Archive
          </Dropdown.Item>
        ) : (
          <Dropdown.Item eventKey="1" onClick={onRemoveProjectFromArchive}>
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
          { isNoneProject && (
            <DisabledDropdownItemWithTooltip tooltipText="Cannot delete 'None' project">
            <div>
                <span style={{ marginRight: "10px" }}>
                  <Trash />
                </span>
                Delete
              </div>
          </DisabledDropdownItemWithTooltip>
          )}
          { !canDelete && !isNoneProject && (
            <DisabledDropdownItemWithTooltip tooltipText="Linked todos must be deleted first">
              <div>
                  <span style={{ marginRight: "10px" }}>
                    <Trash />
                  </span>
                  Delete
                </div>
            </DisabledDropdownItemWithTooltip>
            )
          }
          { canDelete && !isNoneProject && (
            <Dropdown.Item eventKey="1" onClick={onDelete}>
                <span style={{ marginRight: "10px" }}>
                  <Trash />
                </span>
                Delete
            </Dropdown.Item>
            )
          }
          
      </Dropdown.Menu>
    </Dropdown>
  );
}
