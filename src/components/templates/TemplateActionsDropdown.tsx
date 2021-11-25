import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Pencil, Trash } from "react-bootstrap-icons";
import { Template } from "../../shared/template";
import { DisabledDropdownItemWithTooltip } from "../projects/DisableWithTooltip";

type Props = {
  template: Template;
  isEditing: boolean;
  onDeleteTemplate: () => void;
  onToggleEditing: () => void;
};

export function TemplateActionsDropdown({
  template,
  isEditing,
  onDeleteTemplate,
  onToggleEditing,
}: Props) {
  const [show, setShow] = useState(false);
  const isDefaultTemplate = template.templateTitle.toLowerCase() === "default";

  if (isDefaultTemplate) {
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
          <DisabledDropdownItemWithTooltip tooltipText="Cannot delete 'Default' project">
            {() => (
              <div>
                <span style={{ marginRight: "10px" }}>
                  <Trash />
                </span>
                Delete
              </div>
            )}
          </DisabledDropdownItemWithTooltip>
        </Dropdown.Menu>
      </Dropdown>
    );
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
        <Dropdown.Item eventKey="1" onClick={onDeleteTemplate}>
          <span style={{ marginRight: "10px" }}>
            <Trash />
          </span>
          Delete
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
