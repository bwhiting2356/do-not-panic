import cn from "classnames";
import React, { useEffect, useState } from "react";
import { ColorResult } from "react-color";
import { ProjectActionsDropdown } from "./ProjectActionsDropdown";
import { ColorPicker } from "./ColorPicker";
import { Project } from "../../shared/project";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  useAppContext,
  useReduxActionsWithContext,
} from "../../context/context";
import { TextField } from "../TextField";
import { editProject } from "../../features/projects/projectSlice";
import { selectTodos } from "../../features/todos/selectors";
import { canDeleteProject } from "../../shared/util";
import { selectTemplates } from "../../features/templates/selectors";

type Props = {
  project: Project;
};

export function ProjectRow({ project }: Props) {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectTodos);
  const templates = useAppSelector(selectTemplates);
  const { editingItemId, setEditingItemId, selectedItemId, setSelectedItemId } =
    useAppContext();
  const {
    deleteProjectWithToast,
    archiveProjectWithToast,
    removeProjectFromArchiveWithToast,
  } = useReduxActionsWithContext();
  const { id, title, description } = project;
  const isSelected = id === selectedItemId;
  const isEditing = id === editingItemId;
  const [canDelete, setCanDelete] = useState(() =>
    canDeleteProject(project, todos, templates)
  );
  const isNoneProject = project.title.toLowerCase() === "none";
  useEffect(() => {
    setCanDelete(canDeleteProject(project, todos, templates));
  }, [setCanDelete, project, todos, templates]);

  const onEditTitle = (newTitle: string) => {
    dispatch(
      editProject({
        id,
        newProject: {
          ...project,
          title: newTitle,
        },
      })
    );
  };

  const onEditDescription = (newDescription: string) => {
    dispatch(
      editProject({
        id,
        newProject: {
          ...project,
          description: newDescription,
        },
      })
    );
  };

  const onEditColor = (newColor: ColorResult) => {
    dispatch(
      editProject({
        id,
        newProject: {
          ...project,
          color: newColor.hex,
        },
      })
    );
  };

  const onRowClick: React.MouseEventHandler<HTMLTableRowElement> = (e) => {
    const { tagName } = e.target as HTMLElement;
    if (["BUTTON", "A"].includes(tagName) || isEditing) return;
    setSelectedItemId(project.id);
    if (editingItemId !== project.id) {
      setEditingItemId("");
    }
  };

  const onToggleEditingId = () => {
    if (isEditing) {
      setEditingItemId("");
    } else {
      setEditingItemId(project.id);
    }
  };

  return (
    <tr
      key={id}
      className={cn({ "table-secondary": isSelected })}
      onClick={onRowClick}
    >
      <td className="title vertical-align">
        <TextField
          autoFocus={true}
          editing={isNoneProject ? false : isEditing}
          text={title}
          onEditText={onEditTitle}
          onSubmit={onToggleEditingId}
        />
      </td>
      <td className="description vertical-align">
        <TextField
          type="textarea"
          editing={isEditing}
          text={description}
          onEditText={onEditDescription}
          onSubmit={onToggleEditingId}
        />
      </td>
      <td className="color vertical-align">
        <ColorPicker color={project.color} onEditColor={onEditColor} />
      </td>
      <td className="actions vertical-align">
        <ProjectActionsDropdown
          onDelete={() => deleteProjectWithToast(project)}
          canDelete={canDelete}
          isEditing={isEditing}
          project={project}
          onArchiveProject={() => archiveProjectWithToast(project)}
          onRemoveProjectFromArchive={() =>
            removeProjectFromArchiveWithToast(project)
          }
          onToggleEditing={onToggleEditingId}
        />
      </td>
    </tr>
  );
}
