import React from "react";
import { ButtonGroup, Form } from "react-bootstrap";
import { ID } from "../shared/id.type";
import { Todo } from "../shared/todo.interface";
import { Link } from "./Link";
import { TextField } from "./TextField";
import { DeleteIconButton } from "./icon-buttons/DeleteIconButton";
import { MoveDownIconButton } from "./icon-buttons/MoveDownIconButton";
import { MoveUpIconButton } from "./icon-buttons/MoveUpIconButton";
import { Due } from "../shared/due.type";

interface Props {
  todo: Todo;
  onSetTodoDone: (todo: Todo, done: boolean) => void;
  onEditName: (todo: Todo, newName: string) => void;
  onEditPoms: (todo: Todo, newPoms: string) => void;
  onMoveTodoDue: (todo: Todo) => void;
  onDeleteTodo: (id: ID) => void;
  onEditLink: (todo: Todo, linkId: ID, newUrl: string) => void;
  onDeleteLink: (todo: Todo, linkId: ID) => void;
  due: Due;
}

export function TodoRow({
  todo,
  onSetTodoDone,
  onEditName,
  onEditPoms,
  onMoveTodoDue,
  onDeleteTodo,
  onEditLink,
  onDeleteLink,
  due,
}: Props) {
  const { id, done, name, poms, links, archivedDate } = todo;
  return (
    <tr key={id}>
      <td className="done">
        {due === Due.Archived ? (
          <div>{new Date(archivedDate || "")?.toLocaleDateString("en-US")}</div>
        ) : (
          <Form.Check
            type="checkbox"
            checked={done}
            onChange={(e: any) => onSetTodoDone(todo, e.target.checked)}
          />
        )}
      </td>
      <td className="name">
        <TextField
          text={name}
          onEditText={(newName) => onEditName(todo, newName)}
        />
      </td>
      <td className="poms">
        <TextField
          text={poms}
          onEditText={(newPoms) => onEditPoms(todo, newPoms)}
        />
      </td>
      <td className="links">
        <div>
          {links.map(({ id, url }, i) => (
            <Link
              key={id}
              url={url}
              onEditLink={(newUrl) => onEditLink(todo, id, newUrl)}
              onDeleteLink={() => onDeleteLink(todo, id)}
            />
          ))}
        </div>
      </td>
      <td className="actions">
        <ButtonGroup>
          {due === Due.Today ? (
            <MoveDownIconButton onClick={() => onMoveTodoDue(todo)} />
          ) : (
            <MoveUpIconButton onClick={() => onMoveTodoDue(todo)} />
          )}

          <DeleteIconButton onClick={() => onDeleteTodo(todo.id)} />
        </ButtonGroup>
      </td>
    </tr>
  );
}
