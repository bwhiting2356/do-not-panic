import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import {
  Archive,
  Calendar,
  Pencil,
  Sun,
  Trash,
  Clipboard,
} from "react-bootstrap-icons";
import { Todo } from "../../shared/todo";
import { Due } from "../../shared/due.type";
import { HoverDropdown } from "../HoverDropdown";

type Props = {
  todo: Todo;
  isEditing: boolean;
  onEditTodoDue: (due: Due) => void;
  onArchiveTodo: () => void;
  onDeleteTodo: () => void;
  onDuplicateTodo: () => void;
  onToggleEditing: () => void;
};

export function TodoActionsDropdown({
  todo,
  isEditing,
  onEditTodoDue,
  onArchiveTodo,
  onDeleteTodo,
  onDuplicateTodo,
  onToggleEditing,
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <HoverDropdown toggleText="" size="sm" show={show} setShow={setShow}>
      {todo.due !== Due.Today && (
        <Dropdown.Item eventKey="1" onClick={() => onEditTodoDue(Due.Today)}>
          <span style={{ marginRight: "10px" }}>
            <Sun />
          </span>
          Move to today
        </Dropdown.Item>
      )}
      {todo.due !== Due.Later && (
        <Dropdown.Item eventKey="1" onClick={() => onEditTodoDue(Due.Later)}>
          <span style={{ marginRight: "10px" }}>
            <Calendar />
          </span>
          Move to later
        </Dropdown.Item>
      )}
      {todo.due !== Due.Archived && (
        <Dropdown.Item eventKey="1" onClick={onArchiveTodo}>
          <span style={{ marginRight: "10px" }}>
            <Archive />
          </span>
          Archive
        </Dropdown.Item>
      )}
      <Dropdown.Item
        eventKey="1"
        onClick={() => {
          onToggleEditing();
          setShow(false);
        }}
      >
        <span style={{ marginRight: "10px" }}>
          <Pencil />
        </span>
        {isEditing ? "Stop editing" : "Edit"}
      </Dropdown.Item>
      <Dropdown.Item
        eventKey="1"
        onClick={() => {
          onDuplicateTodo();
          setShow(false);
        }}
      >
        <span style={{ marginRight: "10px" }}>
          <Clipboard />
        </span>
        Duplicate
      </Dropdown.Item>
      <Dropdown.Item eventKey="1" onClick={onDeleteTodo}>
        <span style={{ marginRight: "10px" }}>
          <Trash />
        </span>
        Delete
      </Dropdown.Item>
    </HoverDropdown>
  );
}
