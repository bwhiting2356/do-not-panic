import React from "react";
import { ButtonGroup } from "react-bootstrap";
import { BrightnessAltHigh } from "react-bootstrap-icons";
import { useAppSelector } from "../../app/hooks";
import { useReduxActionsWithContext } from "../../context/context";
import {
  selectCustomTemplates,
  selectDefaultTemplate,
} from "../../features/templates/selectors";
import { AddIconButton } from "../icon-buttons/AddIconButton";
import { IconButton } from "../icon-buttons/IconButton";

export function TemplateButtons() {
  const defaultTemplate = useAppSelector(selectDefaultTemplate);
  const customTemplates = useAppSelector(selectCustomTemplates);
  const { addTodoFromTemplateWithToast } = useReduxActionsWithContext();

  return (
    <ButtonGroup>
      <AddIconButton
        onClick={() => addTodoFromTemplateWithToast(defaultTemplate?.id || "")}
      />
      {customTemplates.map((template) => (
        <IconButton
          key={template.id}
          text={template.templateTitle}
          Icon={BrightnessAltHigh}
          variant="outline-primary"
          onClick={() => addTodoFromTemplateWithToast(template.id || "")}
        />
      ))}
    </ButtonGroup>
  );
}
