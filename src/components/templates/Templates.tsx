import React from "react";
import { ButtonGroup } from "react-bootstrap";
import { useAppSelector } from "../../app/hooks";
import { useReduxActionsWithContext } from "../../context/context";
import { selectTemplates } from "../../features/templates/selectors";
import { AddIconButton } from "../icon-buttons/AddIconButton";
import { TemplateTable } from "./TemplateTable";
import { useTemplatesKeyboardShortcuts } from "./useTemplatesKeyboardShortcuts";

function Templates() {
  const templates = useAppSelector(selectTemplates);
  const { addNewTemplateAndStartEditing } = useReduxActionsWithContext();

  useTemplatesKeyboardShortcuts();

  return (
    <div>
      <div style={{ display: "flex" }}>
        <h3 style={{ marginRight: "10px" }}>Templates</h3>
        <ButtonGroup>
          <AddIconButton onClick={addNewTemplateAndStartEditing} />
        </ButtonGroup>
      </div>
      <TemplateTable templates={templates} />
    </div>
  );
}

export default Templates;
