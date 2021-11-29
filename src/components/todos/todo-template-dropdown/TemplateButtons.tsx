/* eslint-disable no-empty-function */
import { Dropdown } from "react-bootstrap";
import { ButtonGroup } from "react-bootstrap";
import React, { useState } from "react";
import { GroupedSubmenu } from "./GroupSubmenu";
import { TemplateItem } from "./TemplateItem";
import { useAppSelector } from "../../../app/hooks";
import { useReduxActionsWithContext } from "../../../context/context";
import {
  selectCustomTemplates,
  selectDefaultTemplate,
} from "../../../features/templates/selectors";
import { AddIconButton } from "../../icon-buttons/AddIconButton";

import { ID } from "../../../shared/id.type";
import { groupTemplatesByGroupName } from "../../../shared/util";

export function TemplateButtons() {
  const [showDropdown, setShowDropdown] = useState(false);
  const defaultTemplate = useAppSelector(selectDefaultTemplate);
  const customTemplates = useAppSelector(selectCustomTemplates);
  const groupedTemplates = groupTemplatesByGroupName(customTemplates);
  const groupedTemplateKeys = Object.keys(groupedTemplates).filter(
    (key) => key !== ""
  );
  const { addTodoFromTemplateWithToast } = useReduxActionsWithContext();

  const addFromTemlate = (id: ID) => {
    addTodoFromTemplateWithToast(id || "");
    setShowDropdown(false);
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
            <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
              From template
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {groupedTemplates[""].map((template) => (
                <TemplateItem
                  template={template}
                  addFromTemlate={addFromTemlate}
                />
              ))}
              {groupedTemplateKeys.map((groupName) => (
                <Dropdown.Item key={groupName} eventKey="1" onClick={() => {}}>
                  <GroupedSubmenu
                    groupName={groupName}
                    templates={groupedTemplates[groupName]}
                  />
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}
      </ButtonGroup>
    </div>
  );
}
