import { Dropdown } from "react-bootstrap";
import { ID } from "../../../shared/id.type";
import { Template } from "../../../shared/template";

interface Props {
  template: Template;
  addFromTemlate: (id: ID) => void;
}
export function TemplateItem({ template, addFromTemlate }: Props) {
  const onTemplateItemClick = (
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
    <Dropdown.Item
      key={template.id}
      eventKey="1"
      onClick={(e) => onTemplateItemClick(e, template.id)}
    >
      {template.templateTitle}
    </Dropdown.Item>
  );
}
