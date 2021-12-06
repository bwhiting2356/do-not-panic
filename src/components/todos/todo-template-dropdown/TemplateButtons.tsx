import { Dropdown } from "react-bootstrap";
import { ButtonGroup } from "react-bootstrap";
import { useState } from "react";
import { GroupedSubmenu } from "./GroupSubmenu";
import { TemplateItem } from "./TemplateItem";
import { groupTemplatesByGroupName } from "./helpers";
import { useAppSelector } from "../../../app/hooks";
import { useReduxActionsWithContext } from "../../../context/context";
import {
  selectCustomTemplates,
  selectDefaultTemplate,
} from "../../../features/templates/selectors";
import { AddIconButton } from "../../icon-buttons/AddIconButton";

import { ID } from "../../../shared/id.type";
import { HoverDropdown } from "../../HoverDropdown";

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
          </HoverDropdown>
        )}
      </ButtonGroup>
    </div>
  );
}
