import React from "react";
import cn from "classnames";
import { ProjectActionsDropdown } from "./ProjectActionsDropdown";
import { Project } from "../../shared/project";
import { useAppDispatch } from "../../app/hooks";
import { useAppContext } from "../../context/context";
import { TextField } from "../TextField";
import { editProject } from "../../features/projects/projectSlice";

type Props = {
  project: Project;
};

export function ProjectRow({ project }: Props) {
  const dispatch = useAppDispatch();
  const { editingItemId, setEditingItemId, selectedItemId, setSelectedItemId } =
    useAppContext();
  const { id, title, description } = project;
  const isSelected = id === selectedItemId;
  const isEditing = id === editingItemId;

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
      <td className="title">
        <TextField
            autoFocus={true}
            editing={isEditing}
            text={title}
            onEditText={onEditTitle}
            onSubmit={onToggleEditingTodoId}
          />
        </td>
      <td className="description">
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
          isEditing={isEditing}
          project={project}
          onArchiveProject={() => {}}
          onToggleEditing={onToggleEditingProjectId}
        />
      </td>
    </tr>
  );
}

