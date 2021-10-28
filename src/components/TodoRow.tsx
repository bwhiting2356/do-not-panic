import React, { useState } from "react";
import { ButtonGroup, Form } from "react-bootstrap";
import { ID } from "../shared/id.type";
import { Todo } from "../shared/todo.interface";
import { Link } from "./Link";
import { TextField } from "./TextField";
import { DeleteIconButton } from "./icon-buttons/DeleteIconButton";
import { MoveDownIconButton } from "./icon-buttons/MoveDownIconButton";
import { MoveUpIconButton } from "./icon-buttons/MoveUpIconButton";
import { WarningModal } from "./WarningModal";

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
  const [showModal, setShowModal] = useState(false);
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
          {oppositeDue === "later" ? (
            <MoveDownIconButton onClick={() => onMoveTodoDue(todo)} />
          ) : (
            <MoveUpIconButton onClick={() => onMoveTodoDue(todo)} />
          )}

          <DeleteIconButton onClick={() => setShowModal(true)} />
        </ButtonGroup>
        <WarningModal
          show={showModal}
          heading="Delete Todo"
          body="Are you sure you want to delete this todo?"
          handleClose={() => setShowModal(false)}
          handleConfirm={() => onDeleteTodo(todo.id)}
        />
      </td>
    </tr>
  );
}
