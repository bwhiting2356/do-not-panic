import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Archive, Calendar, Sun, Trash } from "react-bootstrap-icons";
import { Due } from "../shared/due.type";
import { ID } from "../shared/id.type";
import { Todo } from "../shared/todo.interface";

type Props = {
  todo: Todo;
  onEditTodoDue: (todo: Todo, due: Due) => void;
  onDeleteTodo: (id: ID) => void;
};

export function ActionsDropdown({ todo, onEditTodoDue, onDeleteTodo }: Props) {
  const [show, setShow] = useState(false);
  return (
    <Dropdown
      show={show}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <Dropdown.Toggle
        variant="outline-primary"
        id="dropdown-basic"
        size="sm"
      ></Dropdown.Toggle>

      <Dropdown.Menu>
        {todo.due !== Due.Today && (
          <Dropdown.Item
            eventKey="1"
            onClick={() => onEditTodoDue(todo, Due.Today)}
          >
            <span style={{ marginRight: "10px" }}>
              <Sun />
            </span>
            Move to today
          </Dropdown.Item>
        )}
        {todo.due !== Due.Later && (
          <Dropdown.Item
            eventKey="1"
            onClick={() => onEditTodoDue(todo, Due.Later)}
          >
            <span style={{ marginRight: "10px" }}>
              <Calendar />
            </span>
            Move to later
          </Dropdown.Item>
        )}
        {todo.due !== Due.Archived && (
          <Dropdown.Item
            eventKey="1"
            onClick={() => onEditTodoDue(todo, Due.Archived)}
          >
            <span style={{ marginRight: "10px" }}>
              <Archive />
            </span>
            Archive
          </Dropdown.Item>
        )}
        <Dropdown.Item eventKey="1" onClick={() => onDeleteTodo(todo.id)}>
          <span style={{ marginRight: "10px" }}>
            <Trash />
          </span>
          Delete
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
