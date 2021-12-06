import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { TemplateItem } from "./TemplateItem";
import { useReduxActionsWithContext } from "../../../context/context";
import { ID } from "../../../shared/id.type";
import { Template } from "../../../shared/template";

interface Props {
  groupName: string;
  templates: Template[];
}

export function GroupedSubmenu({ groupName, templates }: Props) {
  const { addTodoFromTemplateWithToast } = useReduxActionsWithContext();
  const [showDropdown, setShowDropdown] = useState(false);

  const addFromTemlate = (id: ID) => {
    addTodoFromTemplateWithToast(id || "");
    setShowDropdown(false);
  };

  return (
    <Dropdown
      drop="end"
      show={showDropdown}
      onMouseEnter={() => setShowDropdown(true)}
      onMouseLeave={() => setShowDropdown(false)}
    >
      <Dropdown.Toggle
        variant=""
        id="dropdown-basic"
        className="dropdown-submenu"
      >
        {groupName}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {templates.map((template) => (
          <TemplateItem
            key={template.id}
            template={template}
            addFromTemlate={addFromTemlate}
          />
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
