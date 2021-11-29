import cn from "classnames";
import React, { useRef } from "react";
import { Form } from "react-bootstrap";
import { TemplateActionsDropdown } from "./TemplateActionsDropdown";
import { useAppDispatch } from "../../app/hooks";
import {
  useAppContext,
  useReduxActionsWithContext,
} from "../../context/context";
import { TextField } from "../TextField";
import { Template } from "../../shared/template";
import {
  editTemplate,
  moveTemplateDown,
  moveTemplateUp,
} from "../../features/templates/templateSlice";
import { ProjectDropdown } from "../ProjectDropdown";
import { ID } from "../../shared/id.type";
import { LinkWithRef } from "../Link";

type Props = {
  template: Template;
  arrayIdx: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
};

export function TemplateRow({
  template,
  arrayIdx,
  canMoveDown,
  canMoveUp,
}: Props) {
  const linkRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const { editingItemId, setEditingItemId, selectedItemId, setSelectedItemId } =
    useAppContext();
  const { deleteTemplateWithToast } = useReduxActionsWithContext();
  const { id, templateTitle, autofocus, name, poms, projectId, group, links } =
    template;
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
  };

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

  const onEditGroup = (newGroup: string) => {
    dispatch(
      editTemplate({
        id,
        newTemplate: {
          ...template,
          group: newGroup,
        },
      })
    );
  };

  const onMoveTemplateUp = () => dispatch(moveTemplateUp({ index: arrayIdx }));

  const onMoveTemplateDown = () =>
    dispatch(moveTemplateDown({ index: arrayIdx }));

  const onToggleEditingTemplateId = () => {
    if (isEditing) {
      setEditingItemId("");
    } else {
      setEditingItemId(template.id);
    }
  };

  const onRowClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const { tagName } = e.target as HTMLElement;
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onEditAutofocus(e.target.checked)
          }
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
          {links.map((link) => (
            <LinkWithRef
              ref={linkRef}
              key={link.id}
              url={link.url}
              editing={isEditing}
              onEditLink={(newUrl) => onEditLink(link.id, newUrl)}
              onSubmit={onToggleEditingTemplateId}
            />
          ))}
        </div>
      </td>
      <td className="group vertical-align">
        <TextField
          editing={isEditing}
          text={group}
          onEditText={onEditGroup}
          onSubmit={onToggleEditingTemplateId}
        />
      </td>
      <td className="actions vertical-align">
        <TemplateActionsDropdown
          onDeleteTemplate={() => deleteTemplateWithToast(template)}
          isEditing={isEditing}
          template={template}
          onToggleEditing={onToggleEditingTemplateId}
          onMoveUp={onMoveTemplateUp}
          onMoveDown={onMoveTemplateDown}
          canMoveDown={canMoveDown}
          canMoveUp={canMoveUp}
        />
      </td>
    </tr>
  );
}
