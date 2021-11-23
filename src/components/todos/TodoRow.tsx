import React, { useRef } from "react";
import cn from "classnames";
import { Form } from "react-bootstrap";
import { ID } from "../../shared/id.type";
import { Todo } from "../../shared/todo";
import { LinkWithRef } from "../Link";
import { TextField } from "../TextField";
import { Due } from "../../shared/due.type";
import { ProjectDropdown } from "../ProjectDropdown";
import { TodoActionsDropdown } from "./TodoActionsDropdown";
import { useAppDispatch } from "../../app/hooks";
import { editTodo } from "../../features/todos/todoSlice";
import { useReduxActionsWithContext, useAppContext } from "../../context/context";

type Props = {
  todo: Todo;
};

export function TodoRow({ todo }: Props) {
  const linkRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const { editingTodoId, setEditingTodoId, selectedTodoId, setSelectedTodoId } =
    useAppContext();
  const { deleteTodoWithToast, archiveTodoWithToast, moveTodoWithToast } =
    useReduxActionsWithContext();
  const { id, done, name, poms, links, projectId, archivedDate, due } = todo;
  console.log("todo", todo);
  const isSelected = id === selectedTodoId;

  const onEditDone = (done: boolean) => {
    dispatch(editTodo({ id, newTodo: { ...todo, done } }));
  };

  const onEditDue = (due: Due) => moveTodoWithToast(todo, due);

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

  const focusLink = () => linkRef?.current?.focus();

  const onEditProject = (newProjectId: ID) => {
    console.log("newProjectId", newProjectId);
    if (newProjectId !== todo.projectId) {
      dispatch(
        editTodo({
          id,
          newTodo: {
            ...todo,
            projectId: newProjectId,
          },
        })
      );
      focusLink();
    }
  };

  const onDeleteTodo = () => deleteTodoWithToast(todo);
  const onArchiveTodo = () => archiveTodoWithToast(todo);

  const isEditing = editingTodoId === id;

  const onToggleEditingTodoId = () => {
    if (isEditing) {
      setEditingTodoId("");
    } else {
      setEditingTodoId(todo.id);
    }
  };

  const onRowClick = (e: any) => {
    const { tagName } = e.target;
    if (["BUTTON", "A"].includes(tagName) || isEditing) return;
    if (due === Due.Archived) return;
    setSelectedTodoId(todo.id);
    if (editingTodoId !== todo.id) {
      setEditingTodoId("");
    }
  };

  const onProjectDropdownSubmit = () => {
    if (isEditing) {
      setEditingTodoId("");
    }
  };

  return (
    <tr
      key={id}
      className={cn({ complete: done, "table-secondary": isSelected })}
      onClick={onRowClick}
    >
      <td className="done vertical-align">
        {due === Due.Archived ? (
          <div>{new Date(archivedDate || "")?.toLocaleDateString("en-US")}</div>
        ) : (
          <Form.Check
            className="toggle"
            type="switch"
            checked={!done}
            onChange={(e: any) => onEditDone(!e.target.checked)}
          />
        )}
      </td>
      <td className="name vertical-align">
        <TextField
          autoFocus={true}
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
              onSubmit={onToggleEditingTodoId}
            />
          ))}
        </div>
      </td>
      <td className="actions vertical-align">
        <TodoActionsDropdown
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
