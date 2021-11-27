import React from "react";
import { Table } from "react-bootstrap";
import { TemplateRow } from "./TemplateRow";
import { Template } from "../../shared/template";

interface Props {
  templates: Template[];
}
export function TemplateTable({ templates }: Props) {
  return (
    <Table size="sm">
      <thead>
        <tr>
          <th className="template-title">Template Title</th>
          <th className="autofocus">Focus</th>
          <th className="name">Todo Name</th>
          <th className="poms">Poms</th>
          <th className="project">Project</th>
          <th className="links">Link</th>
          <th className="actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        {templates.map((template, i) => (
          <TemplateRow
            key={template.id}
            template={template}
            arrayIdx={i}
            canMoveDown={i !== templates.length - 1}
            canMoveUp={i !== 0}
          />
        ))}
      </tbody>
    </Table>
  );
}
