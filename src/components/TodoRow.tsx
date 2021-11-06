import React from "react";
import cn from "classnames";
import { Form } from "react-bootstrap";
import { ID } from "../shared/id.type";
import { Todo } from "../shared/todo.interface";
import { Link } from "./Link";
import { TextField } from "./TextField";
import { Due } from "../shared/due.type";
import { ProjectDropdown } from "./ProjectDropdown";
import { ActionsDropdown } from "./ActionsDropdown";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectEditingTodoID } from "../features/todos/selectors";
import {
  deleteTodo,
  editTodo,
  setEditingTodoId,
} from "../features/todos/todoSlice";

type Props = {
  todo: Todo;
};

export function TodoRow({ todo }: Props) {
  const dispatch = useAppDispatch();
  const editingTodoId = useAppSelector(selectEditingTodoID);
  const { id, done, name, poms, links, project, archivedDate, due } = todo;

  const onEditDone = (done: boolean) => {
    dispatch(editTodo({ id, newTodo: { ...todo, done } }));
  };

  const onEditDue = (due: Due) => {
    dispatch(
      editTodo({
        id,
        newTodo: { ...todo, due },
      })
    );
  };

  const onEditLink = (linkId: ID, newUrl: string) => {
    dispatch(
      editTodo({
        id,
        newTodo: {
          ...todo,
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

  const onEditName = (newName: string) => {
    dispatch(
      editTodo({
        id,
        newTodo: {
          ...todo,
          name: newName,
        },
      })
    );
  };

  const onEditPoms = (newPoms: string) => {
    dispatch(
      editTodo({
        id,
        newTodo: {
          ...todo,
          poms: newPoms,
        },
      })
    );
  };

  const onEditProject = (newProject: string) => {
    dispatch(
      editTodo({
        id,
        newTodo: {
          ...todo,
          project: newProject,
        },
      })
    );
  };

  const onDeleteTodo = () => dispatch(deleteTodo({ id }));
  const onArchiveTodo = () => {
    dispatch(
      editTodo({
        id,
        newTodo: {
          ...todo,
          due: Due.Archived,
          archivedDate: new Date(),
        },
      })
    );
  };

  const isEditing = editingTodoId === id;

  const onToggleEditingTodoId = () => {
    if (isEditing) {
      dispatch(setEditingTodoId(""));
    } else {
      dispatch(setEditingTodoId(todo.id));
    }
  };

  const onRowClick = (e: any) => {
    const { tagName } = e.target;
    if (["BUTTON", "A"].includes(tagName)) return;
    onEditDone(!todo.done);
  };

  return (
    <tr
      key={id}
      className={cn({ complete: done, editing: isEditing })}
      onClick={onRowClick}
    >
      <td className="done vertical-align">
        {due === Due.Archived ? (
          <div>{new Date(archivedDate || "")?.toLocaleDateString("en-US")}</div>
        ) : (
          <Form.Check
            type="switch"
            checked={done}
            onChange={(e: any) => onEditDone(e.target.checked)}
          />
        )}
      </td>
      <td className="name vertical-align">
        <TextField
          editing={isEditing}
          text={name}
          onEditText={onEditName}
          onSubmit={onToggleEditingTodoId}
        />
      </td>
      <td className="poms vertical-align">
        <TextField
          editing={isEditing}
          text={poms}
          onEditText={onEditPoms}
          onSubmit={onToggleEditingTodoId}
        />
      </td>
      <td className="links vertical-align">
        <div>
          {links.map(({ id, url }) => (
            <Link
              key={id}
              url={url}
              editing={isEditing}
              onEditLink={(newUrl) => onEditLink(id, newUrl)}
              onSubmit={onToggleEditingTodoId}
            />
          ))}
        </div>
      </td>
      <td className="project vertical-align">
        <div>
          <ProjectDropdown
            isEditing={isEditing}
            project={project}
            onChangeProject={onEditProject}
          />
        </div>
      </td>
      <td className="actions vertical-align">
        <ActionsDropdown
          isEditing={isEditing}
          todo={todo}
          onEditTodoDue={onEditDue}
          onDeleteTodo={onDeleteTodo}
          onArchiveTodo={onArchiveTodo}
          onToggleEditing={onToggleEditingTodoId}
        />
      </td>
    </tr>
  );
}
