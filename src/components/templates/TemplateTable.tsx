import React from "react";
import { Table } from "react-bootstrap";
import { Template } from "../../shared/template";
import { TemplateRow } from "./TemplateRow";

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
        {templates.map((template) => (
          <TemplateRow template={template} />
        ))}
      </tbody>
    </Table>
  );
}
