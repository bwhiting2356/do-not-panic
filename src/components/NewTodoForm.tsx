import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button, ButtonGroup, Form, Table } from "react-bootstrap";
import {
  addTodo,
  addTodoFromTemplate,
  editNewTodo,
} from "../features/todos/todoSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { AddIconButton } from "./icon-buttons/AddIconButton";
import { DeleteIconButton } from "./icon-buttons/DeleteIconButton";
import { Due } from "../shared/due.type";
import { selectNewTodo } from "../features/todos/selectors";
import { TodayIconButton } from "./icon-buttons/TodayIconButton";
import { CalendarIconButton } from "./icon-buttons/CalendarIconButton";

const generateNewLink = () => ({ id: uuidv4(), url: "" });

export function NewTodoForm() {
  const dispatch = useAppDispatch();
  const newTodo = useAppSelector(selectNewTodo);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [autoFocusedLinkId, setAutoFocusedLinkId] = useState<string>("");

  const focusNameInput = () => {
    if (nameInputRef) {
      nameInputRef?.current?.focus();
    }
  };

  const onSubmit = (due: Due) => {
    dispatch(addTodo());
    focusNameInput();
  };

  useEffect(() => {
    const listenForKeyboardShortcuts = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === "Enter") {
        focusNameInput();
      }
    };
    window.addEventListener("keydown", listenForKeyboardShortcuts);
    return () =>
      window.removeEventListener("keydown", listenForKeyboardShortcuts);
  });

  const listenForSubmit = (e: any) => {
    if (e.key === "Enter") {
      onSubmit(Due.Today);
    }
  };

  const editLink = (index: number, newUrl: string) => {
    dispatch(
      editNewTodo({
        ...newTodo,
        links: newTodo.links.map((link, i) => {
          if (index === i) return { ...link, url: newUrl };
          return link;
        }),
      })
    );
  };

  const deleteLink = (index: number) => {
    const linksCopy = newTodo.links.slice();
    linksCopy.splice(index, 1);
    dispatch(
      editNewTodo({
        ...newTodo,
        links: linksCopy,
      })
    );
  };

  const setName = (newName: string) => {
    dispatch(
      editNewTodo({
        ...newTodo,
        name: newName,
      })
    );
  };

  const setPoms = (newPoms: string) => {
    dispatch(
      editNewTodo({
        ...newTodo,
        poms: newPoms,
      })
    );
  };

  const addLink = () => {
    const newLink = generateNewLink();
    dispatch(
      editNewTodo({
        ...newTodo,
        links: [...newTodo.links, newLink],
      })
    );

    setAutoFocusedLinkId(newLink.id);
  };

  const addFromTemplate = (template: string) => {
    dispatch(addTodoFromTemplate(template));
    setTimeout(() => {
      focusNameInput();
    }, 100);
  };

  const onLinkKeyDown = (e: any) => {
    if (e.key === "Tab") {
      e.preventDefault();
      addLink();
    }
    if (e.key === "Enter") {
      onSubmit(Due.Today);
    }
  };

  return (
    <div>
      <Table striped bordered hover className="table">
        <thead>
          <tr>
            <th className="done" style={{ visibility: "hidden" }}>
              Done
            </th>
            <th className="name">Name</th>
            <th className="poms">Poms</th>
            <th className="links">Links</th>
            <th className="actions" style={{ visibility: "hidden" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td>
              <Form.Control
                ref={nameInputRef}
                autoFocus
                type="text"
                value={newTodo.name}
                onKeyDown={listenForSubmit}
                onChange={(e) => setName(e.target.value)}
              />
            </td>
            <td>
              <Form.Control
                type="text"
                value={newTodo.poms}
                onKeyDown={listenForSubmit}
                onChange={(e) => setPoms(e.target.value)}
              />
            </td>
            <td
              className="links"
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <div>
                {newTodo.links.map((link, i) => (
                  <div key={link.id} className="editable-item">
                    <Form.Control
                      autoFocus={autoFocusedLinkId === link.id}
                      type="text"
                      value={link.url}
                      onKeyDown={onLinkKeyDown}
                      onChange={(e) => editLink(i, e.target.value)}
                    />
                    <DeleteIconButton onClick={() => deleteLink(i)} />
                  </div>
                ))}
              </div>
              <div style={{ alignSelf: "flex-end" }}>
                <AddIconButton onClick={addLink} />
              </div>
            </td>
            <td style={{ textAlign: "center" }}>
              <ButtonGroup>
                <TodayIconButton onClick={() => onSubmit(Due.Today)} />
                <CalendarIconButton onClick={() => onSubmit(Due.Later)} />
              </ButtonGroup>
            </td>
          </tr>
        </tbody>
      </Table>
      <ButtonGroup>
        <Button onClick={() => addFromTemplate("start-day")}>
          Start Day (⌘⇧1)
        </Button>
        <Button
          variant="secondary"
          onClick={() => addFromTemplate("start-week")}
        >
          Start Week (⌘⇧2)
        </Button>
      </ButtonGroup>
    </div>
  );
}
