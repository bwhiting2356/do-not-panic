import React, { useState, useRef } from "react";
import { ButtonGroup } from "react-bootstrap";
import { useAppSelector } from "../../app/hooks";
import { useReduxActionsWithContext } from "../../context/context";
import {
  selectCustomTemplates,
  selectDefaultTemplate,
} from "../../features/templates/selectors";
import { AddIconButton } from "../icon-buttons/AddIconButton";

import { Dropdown } from "react-bootstrap";
import { ID } from "../../shared/id.type";

export function TemplateButtons() {
  const dropdownRef = useRef<HTMLButtonElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const defaultTemplate = useAppSelector(selectDefaultTemplate);
  const customTemplates = useAppSelector(selectCustomTemplates);
  const { addTodoFromTemplateWithToast } = useReduxActionsWithContext();

  const addFromTemlate = (id: ID) => {
    addTodoFromTemplateWithToast(id || "");
    setShowDropdown(false);
  };

  const addFromTemplate = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    templateId: ID
  ) => {
    e.stopPropagation();
    e.preventDefault();
    setTimeout(() => {
      addFromTemlate(templateId || "");
    }, 1);
  };

  return (
    <div>
      <ButtonGroup>
        <AddIconButton
          onClick={() => addFromTemlate(defaultTemplate?.id || "")}
        />
        {customTemplates && (
          <Dropdown
            as={ButtonGroup}
            show={showDropdown}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <Dropdown.Toggle
              variant="outline-primary"
              id="dropdown-basic"
              ref={dropdownRef}
            >
              From template
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {customTemplates.map((template) => (
                <Dropdown.Item
                  eventKey="1"
                  onClick={(e) => addFromTemplate(e, template.id)}
                >
                  {template.templateTitle}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}
      </ButtonGroup>
    </div>
  );
}
