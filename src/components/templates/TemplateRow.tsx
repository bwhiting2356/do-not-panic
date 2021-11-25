import React, { useRef } from "react";
import cn from "classnames";
import { useAppDispatch } from "../../app/hooks";
import {
  useAppContext,
  useReduxActionsWithContext,
} from "../../context/context";
import { TextField } from "../TextField";
import { Template } from "../../shared/template";
import { editTemplate } from "../../features/templates/templateSlice";
import { ProjectDropdown } from "../ProjectDropdown";
import { ID } from "../../shared/id.type";
import { LinkWithRef } from "../Link";
import { TemplateActionsDropdown } from "./TemplateActionsDropdown";
import { Form } from "react-bootstrap";

type Props = {
  template: Template;
};

export function TemplateRow({ template }: Props) {
  const linkRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const { editingItemId, setEditingItemId, selectedItemId, setSelectedItemId } =
    useAppContext();
  const { deleteTemplateWithToast } = useReduxActionsWithContext();
  const { id, templateTitle, autofocus, name, poms, projectId, links } = template;
  const isSelected = id === selectedItemId;
  const isEditing = id === editingItemId;
  const isDefaultTemplate = template.templateTitle.toLowerCase() === "default";

  const onEditTemplateTitle = (newTitle: string) => {
    dispatch(
      editTemplate({
        id,
        newTemplate: {
          ...template,
          templateTitle: newTitle,
        },
      })
    );
  };

  const onEditAutofocus = (newFocus: boolean) => {
    dispatch(
        editTemplate({
          id,
          newTemplate: {
            ...template,
            autofocus: newFocus,
          },
        })
      );

  }

  const onEditName = (newName: string) => {
    dispatch(
      editTemplate({
        id,
        newTemplate: {
          ...template,
          name: newName,
        },
      })
    );
  };

  const onEditPoms = (newPoms: string) => {
    dispatch(
      editTemplate({
        id,
        newTemplate: {
          ...template,
          poms: newPoms,
        },
      })
    );
  };

  const onEditProject = (newProjectId: ID) => {
    dispatch(
      editTemplate({
        id,
        newTemplate: {
          ...template,
          projectId: newProjectId,
        },
      })
    );
  };

  const onEditLink = (linkId: ID, newUrl: string) => {
    dispatch(
      editTemplate({
        id,
        newTemplate: {
          ...template,
          links: links.map((link) => {
            if (link.id === linkId) {
              return { ...link, url: newUrl };
            }
            return link;
          }),
        },
      })
    );
  };

  const onToggleEditingTemplateId = () => {
    if (isEditing) {
      setEditingItemId("");
    } else {
      setEditingItemId(template.id);
    }
  };

  const onRowClick = (e: any) => {
    const { tagName } = e.target;
    if (["BUTTON", "A"].includes(tagName) || isEditing) return;
    setSelectedItemId(template.id);
    if (editingItemId !== template.id) {
      setEditingItemId("");
    }
  };

  const onProjectDropdownSubmit = () => {
    if (isEditing) {
      setEditingItemId("");
    }
  };

  return (
    <tr
      key={id}
      className={cn({ "table-secondary": isSelected })}
      onClick={onRowClick}
    >
      <td className="template-title vertical-align">
        <TextField
          autoFocus={true}
          editing={isDefaultTemplate ? false : isEditing}
          text={templateTitle}
          onEditText={onEditTemplateTitle}
          onSubmit={onToggleEditingTemplateId}
        />
      </td>
      <td className="autofocus vertical-align">
      <Form.Check
            className="toggle"
            type="checkbox"
            checked={autofocus}
            onChange={(e: any) => onEditAutofocus(e.target.checked)}
          />
      </td>
      <td className="name vertical-align">
        <TextField
          editing={isEditing}
          text={name}
          onEditText={onEditName}
          onSubmit={onToggleEditingTemplateId}
        />
      </td>
      <td className="poms vertical-align">
        <TextField
          editing={isEditing}
          text={poms}
          onEditText={onEditPoms}
          onSubmit={onToggleEditingTemplateId}
        />
      </td>
      <td className="project vertical-align">
        <div>
          <ProjectDropdown
            isEditing={isEditing}
            projectId={projectId}
            onChangeProject={onEditProject}
            onSubmit={onProjectDropdownSubmit}
          />
        </div>
      </td>
      <td className="links vertical-align">
        <div>
          {links.map(({ id, url }) => (
            <LinkWithRef
              ref={linkRef}
              key={id}
              url={url}
              editing={isEditing}
              onEditLink={(newUrl) => onEditLink(id, newUrl)}
              onSubmit={onToggleEditingTemplateId}
            />
          ))}
        </div>
      </td>
      <td className="actions vertical-align">
        <TemplateActionsDropdown
          onDeleteTemplate={() => deleteTemplateWithToast(template)}
          isEditing={isEditing}
          template={template}
          onToggleEditing={onToggleEditingTemplateId}
        />
      </td>
    </tr>
  );
}
