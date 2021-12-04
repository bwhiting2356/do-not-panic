import { Form } from "react-bootstrap";
import cn from "classnames";
import React, { ChangeEventHandler, MouseEventHandler, useRef } from "react";
import { TodoActionsDropdown } from "./TodoActionsDropdown";
import { ID } from "../../shared/id.type";
import { Todo } from "../../shared/todo";
import { LinkWithRef } from "../Link";
import { TextField } from "../TextField";
import { Due } from "../../shared/due.type";
import { ProjectDropdown } from "../ProjectDropdown";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { changeActiveTodoId, editTodo } from "../../features/todos/todoSlice";
import {
  useAppContext,
  useReduxActionsWithContext,
} from "../../context/context";
import { AddIconButton } from "../icon-buttons/AddIconButton";
import { StartIconButton } from "../icon-buttons/StartIconButton";
import { selectActiveTodoId } from "../../features/todos/selectors";

type Props = {
  todo: Todo;
};

export function TodoRow({ todo }: Props) {
  const linkRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const {
    editingItemId,
    setEditingItemId,
    selectedItemId,
    setSelectedItemId,
    setShowActiveTodo,
  } = useAppContext();
  const activeTodoId = useAppSelector(selectActiveTodoId);

  const { deleteTodoWithToast, archiveTodoWithToast, moveTodoWithToast } =
    useReduxActionsWithContext();

  const {
    id,
    done,
    name,
    poms,
    completedPoms,
    links,
    projectId,
    archivedDate,
    due,
  } = todo;
  const isSelected = id === selectedItemId;
  const isActive = id === activeTodoId;

  const onEditDone = (newDone: boolean) => {
    dispatch(editTodo({ id, newTodo: { ...todo, done: newDone } }));
  };

  const onEditDue = (newDue: Due) => moveTodoWithToast(todo, newDue);

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

  const onEditCompletedPoms = (newPoms: string) => {
    dispatch(
      editTodo({
        id,
        newTodo: {
          ...todo,
          completedPoms: newPoms,
        },
      })
    );
  };

  const focusLink = () => linkRef?.current?.focus();

  const onEditProject = (newProjectId: ID) => {
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

  const isEditing = editingItemId === id;

  const onToggleEditingTodoId = () => {
    if (isEditing) {
      setEditingItemId("");
    } else {
      setEditingItemId(todo.id);
    }
  };

  const onSetActiveTodo = () => {
    dispatch(changeActiveTodoId(todo.id));
    setShowActiveTodo(true);
  };

  const onRowClick: MouseEventHandler<HTMLTableRowElement> = (e) => {
    const { tagName } = e.target as HTMLElement;
    if (["BUTTON", "A"].includes(tagName) || isEditing) return;
    if (due === Due.Archived) return;
    setSelectedItemId(todo.id);
    if (editingItemId !== todo.id) {
      setEditingItemId("");
    }
  };

  const onProjectDropdownSubmit = () => {
    if (isEditing) {
      setEditingItemId("");
    }
  };

  const onToggleSwitch: ChangeEventHandler<HTMLInputElement> = (e) => {
    onEditDone(!e.target.checked);
  };

  return (
    <tr
      key={id}
      className={cn({ complete: done, "table-secondary": isSelected })}
      onClick={onRowClick}
    >
      <td className="done vertical-align">
        <div style={{ display: "flex" }}>
          {due === Due.Archived ? (
            <div>
              {new Date(archivedDate || "")?.toLocaleDateString("en-US")}
            </div>
          ) : (
            <Form.Check
              className="toggle"
              type="switch"
              checked={!done}
              onChange={onToggleSwitch}
            />
          )}
          <StartIconButton
            onClick={onSetActiveTodo}
            className={cn({ "pomodoro-badge": isActive })}
          />
        </div>
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
      <td className="poms vertical-align">
        <TextField
          editing={isEditing}
          text={completedPoms || ""}
          onEditText={onEditCompletedPoms}
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
          {links.map((link) => (
            <LinkWithRef
              ref={linkRef}
              key={link.id}
              url={link.url}
              editing={isEditing}
              onEditLink={(newUrl) => onEditLink(link.id, newUrl)}
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
