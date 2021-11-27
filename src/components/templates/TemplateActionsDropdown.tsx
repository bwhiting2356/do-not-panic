import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { ChevronDown, ChevronUp, Pencil, Trash } from "react-bootstrap-icons";
import { DisabledDropdownItemWithTooltip } from "../projects/DisableWithTooltip";
import { Template } from "../../shared/template";

type Props = {
  template: Template;
  isEditing: boolean;
  onDeleteTemplate: () => void;
  onToggleEditing: () => void;
  canMoveUp: boolean;
  onMoveUp: () => void;
  canMoveDown: boolean;
  onMoveDown: () => void;
};

export function TemplateActionsDropdown({
  template,
  isEditing,
  onDeleteTemplate,
  onToggleEditing,
  canMoveUp,
  onMoveUp,
  canMoveDown,
  onMoveDown,
}: Props) {
  const [show, setShow] = useState(false);
  const isDefaultTemplate = template.templateTitle.toLowerCase() === "default";

  const commonItems = (
    <>
      <Dropdown.Item
        disabled={!canMoveUp}
        eventKey="1"
        onClick={() => {
          onMoveUp();
          setShow(false);
        }}
      >
        <span style={{ marginRight: "10px" }}>
          <ChevronUp />
        </span>
        Move up
      </Dropdown.Item>
      <Dropdown.Item
        disabled={!canMoveDown}
        eventKey="1"
        onClick={() => {
          onMoveDown();
          setShow(false);
        }}
      >
        <span style={{ marginRight: "10px" }}>
          <ChevronDown />
        </span>
        Move down
      </Dropdown.Item>
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
    </>
  );

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
          {commonItems}
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
        {commonItems}
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
