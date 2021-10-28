import React from "react";
import { ButtonGroup, Form } from "react-bootstrap";
import { ID } from "../shared/id.type";
import { Todo } from "../shared/todo.interface";
import { Link } from "./Link";
import { TextField } from "./TextField";
import { DeleteIconButton } from "./icon-buttons/DeleteIconButton";
import { AddIconButton } from "./icon-buttons/AddIconButton";
import { MoveDownIconButton } from "./icon-buttons/MoveDownIconButton";
import { MoveUpIconButton } from "./icon-buttons/MoveUpIconButton";

interface Props {
  todo: Todo;
  onSetTodoDone: (todo: Todo, done: boolean) => void;
  onEditName: (todo: Todo, newName: string) => void;
  onEditPoms: (todo: Todo, newPoms: string) => void;
  onMoveTodoDue: (todo: Todo) => void;
  onDeleteTodo: (id: ID) => void;
  onEditLink: (todo: Todo, linkId: ID, newUrl: string) => void;
  onDeleteLink: (todo: Todo, linkId: ID) => void;
  oppositeDue: string;
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
  oppositeDue,
}: Props) {
  const { id, done, name, poms, links } = todo;
  return (
    <tr key={id}>
      <td className="done">
        <Form.Check
          type="checkbox"
          checked={done}
          onChange={(e: any) => onSetTodoDone(todo, e.target.checked)}
        />
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
      <td
        className="links"
        style={{ display: "flex", flexDirection: "column", width: "100%" }}
      >
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
          {oppositeDue === "later" ? (
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
