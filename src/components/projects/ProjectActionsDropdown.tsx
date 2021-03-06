import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Archive, Pencil, Trash } from "react-bootstrap-icons";
import { DisabledDropdownItemWithTooltip } from "./DisableWithTooltip";
import { Project } from "../../shared/project";
import { HoverDropdown } from "../HoverDropdown";

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
  onDelete,
}: Props) {
  const [show, setShow] = useState(false);
  const isNoneProject = project.title.toLowerCase() === "none";

  if (isNoneProject) {
    return (
      <HoverDropdown toggleText="" size="sm" show={show} setShow={setShow}>
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
        <DisabledDropdownItemWithTooltip tooltipText="Cannot archive 'None' project">
          <div>
            <span style={{ marginRight: "10px" }}>
              <Archive />
            </span>
            Archive
          </div>
        </DisabledDropdownItemWithTooltip>
        <DisabledDropdownItemWithTooltip tooltipText="Cannot delete 'None' project">
          <div>
            <span style={{ marginRight: "10px" }}>
              <Trash />
            </span>
            Delete
          </div>
        </DisabledDropdownItemWithTooltip>
      </HoverDropdown>
    );
  }

  return (
    <HoverDropdown show={show} toggleText="" size="sm" setShow={setShow}>
      {project.archivedDate ? (
        <Dropdown.Item eventKey="1" onClick={onRemoveProjectFromArchive}>
          <span style={{ marginRight: "10px" }}>
            <Archive />
          </span>
          Remove from Archive
        </Dropdown.Item>
      ) : (
        <Dropdown.Item eventKey="1" onClick={onArchiveProject}>
          <span style={{ marginRight: "10px" }}>
            <Archive />
          </span>
          Archive
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
      {!canDelete && (
        <DisabledDropdownItemWithTooltip tooltipText="Delete linked todos & templates first">
          <div>
            <span style={{ marginRight: "10px" }}>
              <Trash />
            </span>
            Delete
          </div>
        </DisabledDropdownItemWithTooltip>
      )}
      {canDelete && (
        <Dropdown.Item eventKey="1" onClick={onDelete}>
          <span style={{ marginRight: "10px" }}>
            <Trash />
          </span>
          Delete
        </Dropdown.Item>
      )}
    </HoverDropdown>
  );
}
