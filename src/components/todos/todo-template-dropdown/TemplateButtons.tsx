import { Dropdown } from "react-bootstrap";
import { ButtonGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import { GroupedSubmenu } from "./GroupSubmenu";
import { TemplateItem } from "./TemplateItem";
import { groupTemplatesByGroupName } from "./helpers";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useReduxActionsWithContext } from "../../../context/context";
import {
  selectCustomTemplates,
  selectDefaultTemplate,
} from "../../../features/templates/selectors";
import { AddIconButton } from "../../icon-buttons/AddIconButton";

import { ID } from "../../../shared/id.type";
import { HoverDropdown } from "../../HoverDropdown";
import { Template } from "../../../shared/template";
import { addNewTemplate } from "../../../features/templates/templateSlice";

export function TemplateButtons() {
  const dispatch = useAppDispatch();
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

  useEffect(() => {
    if (!defaultTemplate) {
      const newTemplate = new Template();
      newTemplate.templateTitle = "Default";
      newTemplate.name = "To Do";
      dispatch(addNewTemplate(newTemplate));
    }
  });

  return (
    <div>
      <ButtonGroup>
        <AddIconButton
          onClick={() => addFromTemlate(defaultTemplate?.id || "")}
        />
        {groupedTemplates && (
          <HoverDropdown
            toggleText="From template"
            show={showDropdown}
            setShow={setShowDropdown}
          >
            {groupedTemplates[""].map((template) => (
              <TemplateItem
                key={template.id}
                template={template}
                addFromTemlate={addFromTemlate}
              />
            ))}
            {groupedTemplateKeys.map((groupName) => (
              <Dropdown.Item key={groupName} eventKey="1">
                <GroupedSubmenu
                  groupName={groupName}
                  templates={groupedTemplates[groupName]}
                />
              </Dropdown.Item>
            ))}
            {groupedTemplateKeys.length === 0 && (
              <Dropdown.Item disabled>No custom templates found</Dropdown.Item>
            )}
          </HoverDropdown>
        )}
      </ButtonGroup>
    </div>
  );
}
