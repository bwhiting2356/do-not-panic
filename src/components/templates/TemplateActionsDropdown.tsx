import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Pencil, Trash } from "react-bootstrap-icons";
import { Template } from "../../shared/template";

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
