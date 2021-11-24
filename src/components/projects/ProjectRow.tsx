import React from "react";
import cn from "classnames";
import { ProjectActionsDropdown } from "./ProjectActionsDropdown";
import { Project } from "../../shared/project";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useAppContext, useReduxActionsWithContext } from "../../context/context";
import { TextField } from "../TextField";
import { editProject } from "../../features/projects/projectSlice";
import { selectTodos } from "../../features/todos/selectors";

type Props = {
  project: Project;
};

export function ProjectRow({ project }: Props) {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectTodos)
  const { editingItemId, setEditingItemId, selectedItemId, setSelectedItemId } =
    useAppContext();
  const { deleteProjectWithToast, archiveProjectWithToast, removeProjectFromArchiveWithToast } = useReduxActionsWithContext();
  const { id, title, description } = project;
  const isSelected = id === selectedItemId;
  const isEditing = id === editingItemId;
  const canDelete = !todos.some(({ projectId }) => projectId === id);

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

  const onToggleEditingTodoId = () => {
    if (isEditing) {
      setEditingItemId("");
    } else {
      setEditingItemId(project.id);
    }
  };

  const onRowClick = (e: any) => {
    const { tagName } = e.target;
    if (["BUTTON", "A"].includes(tagName) || isEditing) return;
    setSelectedItemId(project.id);
    if (editingItemId !== project.id) {
      setEditingItemId("");
    }
  };

  const onToggleEditingProjectId = () => {
    if (isEditing) {
      setEditingItemId("");
    } else {
      setEditingItemId(project.id);
    }
  };

  return (
    <tr key={id} className={cn({ "table-secondary": isSelected })} onClick={onRowClick}>
      <td className="title vertical-align">
        <TextField
            autoFocus={true}
            editing={isEditing}
            text={title}
            onEditText={onEditTitle}
            onSubmit={onToggleEditingTodoId}
          />
        </td>
      <td className="description vertical-align">
        <TextField
          type="textarea"
            editing={isEditing}
            text={description}
            onEditText={onEditDescription}
            onSubmit={onToggleEditingTodoId}
          />
        </td>
      <td className="actions vertical-align">
        <ProjectActionsDropdown
          onDelete={() => deleteProjectWithToast(project)}
          canDelete={canDelete}
          isEditing={isEditing}
          project={project}
          onArchiveProject={() => archiveProjectWithToast(project)}
          onRemoveProjectFromArchive={() => removeProjectFromArchiveWithToast(project)}
          onToggleEditing={onToggleEditingProjectId}
        />
      </td>
    </tr>
  );
}

