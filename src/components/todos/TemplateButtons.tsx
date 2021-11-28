/* eslint-disable no-empty-function */
import { Dropdown } from "react-bootstrap";
import { ButtonGroup } from "react-bootstrap";
import React, { useRef, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { useReduxActionsWithContext } from "../../context/context";
import {
  selectCustomTemplates,
  selectDefaultTemplate,
} from "../../features/templates/selectors";
import { AddIconButton } from "../icon-buttons/AddIconButton";

import { ID } from "../../shared/id.type";
import { groupTemplatesByGroupName } from "../../shared/util";

export function TemplateButtons() {
  const dropdownRef = useRef<HTMLButtonElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const defaultTemplate = useAppSelector(selectDefaultTemplate);
  const customTemplates = useAppSelector(selectCustomTemplates);
  const groupedTemplates = groupTemplatesByGroupName(customTemplates);
  const groupedTemplateKeys = Object.keys(groupedTemplates).filter(
    (key) => key !== ""
  );
  // eslint-disable-next-line no-console
  console.log(groupedTemplates);
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
        {groupedTemplates && (
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
              {groupedTemplates[""].map((template) => (
                <Dropdown.Item
                  key={template.id}
                  eventKey="1"
                  onClick={(e) => addFromTemplate(e, template.id)}
                >
                  {template.templateTitle}
                </Dropdown.Item>
              ))}
              {groupedTemplateKeys.map((groupName) => (
                <Dropdown.Item key={groupName} eventKey="1" onClick={() => {}}>
                  {groupName}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}
      </ButtonGroup>
    </div>
  );
}