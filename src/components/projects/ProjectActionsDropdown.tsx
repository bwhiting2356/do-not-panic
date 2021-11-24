import React, { useState } from "react";
import { Dropdown, OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";
import { Archive, Pencil, Trash } from "react-bootstrap-icons";
import { Project } from "../../shared/project";

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

  const renderTooltip = (props: TooltipProps) => (
    <Tooltip id="button-tooltip" {...props}>
      Linked todos must be deleted first
    </Tooltip>
  );
  
  const [show, setShow] = useState(false);

  const doNothingOnClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  }
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
        {canDelete ? (
          <Dropdown.Item eventKey="1" onClick={onDelete}>
            <span style={{ marginRight: "10px" }}>
              <Trash />
            </span>
            Delete
          </Dropdown.Item>

        ) : (
          <Dropdown.Item eventKey="1" onClick={doNothingOnClick} disabled>
            <OverlayTrigger
                placement="left"
                delay={{ show: 0, hide: 400 }}
                overlay={renderTooltip}
              >
              <div>
                <span style={{ marginRight: "10px" }}>
                  <Trash />
                </span>
                Delete
              </div>
            </OverlayTrigger>
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}
