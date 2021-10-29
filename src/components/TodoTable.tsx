import React from "react";
import { Table } from "react-bootstrap";

import { useAppDispatch } from "../app/hooks";
import { editTodo, deleteTodo } from "../features/todos/todoSlice";
import { Due } from "../shared/due.type";
import { ID } from "../shared/id.type";
import { Todo } from "../shared/todo.interface";
import { TodoRow } from "./TodoRow";

interface Props {
  todos: Todo[];
  due: Due;
}

export function TodoTable({ todos, due }: Props) {
  const dispatch = useAppDispatch();
  const oppositeDue = due === Due.Today ? Due.Later : Due.Today;

  const onSetTodoDone = (todo: Todo, done: boolean) => {
    dispatch(editTodo({ id: todo.id, newTodo: { ...todo, done } }));
  };

  const onMoveTodoDue = (todo: Todo) => {
    dispatch(
      editTodo({
        id: todo.id,
        newTodo: { ...todo, due: oppositeDue },
      })
    );
  };

  const onEditLink = (todo: Todo, linkId: ID, newUrl: string) => {
    dispatch(
      editTodo({
        id: todo.id,
        newTodo: {
          ...todo,
          links: todo.links.map((link) => {
            if (link.id === linkId) {
              return { ...link, url: newUrl };
            }
            return link;
          }),
        },
      })
    );
  };

  const onDeleteLink = (todo: Todo, linkId: ID) => {
    dispatch(
      editTodo({
        id: todo.id,
        newTodo: {
          ...todo,
          links: todo.links.filter((link) => link.id !== linkId),
        },
      })
    );
  };

  const onEditName = (todo: Todo, newName: string) => {
    dispatch(
      editTodo({
        id: todo.id,
        newTodo: {
          ...todo,
          name: newName,
        },
      })
    );
  };

  const onEditPoms = (todo: Todo, newPoms: string) => {
    dispatch(
      editTodo({
        id: todo.id,
        newTodo: {
          ...todo,
          poms: newPoms,
        },
      })
    );
  };

  const onDeleteTodo = (id: ID) => dispatch(deleteTodo({ id }));
  const onArchiveTodo = (todo: Todo) => {
    dispatch(
      editTodo({
        id: todo.id,
        newTodo: {
          ...todo,
          due: Due.Archived,
          archivedDate: new Date(),
        },
      })
    );
  };
  return (
    <div style={{ textAlign: "left" }}>
      <Table striped bordered hover className="table">
        <thead>
          <tr>
            <th className="done">{due === Due.Archived ? "Date" : "Done"}</th>
            <th className="name">Name</th>
            <th className="poms">Poms</th>
            <th className="links">Links</th>
            <th className="actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => {
            return (
              <TodoRow
                key={todo.id}
                todo={todo}
                onSetTodoDone={onSetTodoDone}
                onMoveTodoDue={onMoveTodoDue}
                onDeleteTodo={onDeleteTodo}
                onEditLink={onEditLink}
                onDeleteLink={onDeleteLink}
                onEditName={onEditName}
                onEditPoms={onEditPoms}
                onArchiveTodo={onArchiveTodo}
                due={due}
              />
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
