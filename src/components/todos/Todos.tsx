import { ArchiveFill, Filter } from "react-bootstrap-icons";
import { ButtonGroup } from "react-bootstrap";
import React, { useEffect, useRef } from "react";
import { TodoTable } from "./TodoTable";
import { useTodosKeyboardShortcuts } from "./useTodosKeyboardShortcuts";
import { TemplateButtons } from "./todo-template-dropdown/TemplateButtons";
import { useAppSelector } from "../../app/hooks";
import {
  selectArchivedTodos,
  selectTodosDueLater,
  selectTodosDueToday,
} from "../../features/todos/selectors";
import { Due } from "../../shared/due.type";
import {
  useAppContext,
  useReduxActionsWithContext,
} from "../../context/context";
import { Todo } from "../../shared/todo";
import { IconButton } from "../icon-buttons/IconButton";
import { ArchiveToggleButton } from "../ArchiveToggleButton";

function Todos() {
  const todayTodos = useAppSelector(selectTodosDueToday);
  const laterTodos = useAppSelector(selectTodosDueLater);
  const archivedTodos = useAppSelector(selectArchivedTodos);
  const { showArchive, setShowAnimation } = useAppContext();
  const { sortTodosWithToast, onArchiveAllCompletedTodosWithToast } =
    useReduxActionsWithContext();

  useTodosKeyboardShortcuts();

  const prevTodosRef = useRef<Todo[]>(todayTodos);
  useEffect(() => {
    const doneTodos = todayTodos.reduce((acc, curr) => {
      if (curr.done) return acc + 1;
      return acc;
    }, 0);

    const prevDoneTodos = prevTodosRef.current.reduce((acc, curr) => {
      if (curr.done) return acc + 1;
      return acc;
    }, 0);

    if (doneTodos > prevDoneTodos) {
      setShowAnimation(true);
    }
    prevTodosRef.current = todayTodos;
  }, [todayTodos, setShowAnimation]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <div style={{ display: "flex" }}>
          <h3 style={{ marginRight: "10px" }}>Today</h3>
          <TemplateButtons />
        </div>
        <ButtonGroup>
          <IconButton
            text="Sort Todos"
            Icon={Filter}
            variant="outline-secondary"
            onClick={sortTodosWithToast}
          />
          <IconButton
            text="Archive all completed todos"
            Icon={ArchiveFill}
            variant="outline-primary"
            onClick={onArchiveAllCompletedTodosWithToast}
          />
        </ButtonGroup>
      </div>
      <TodoTable todos={todayTodos} due={Due.Today} />
      <h3>Later</h3>
      <TodoTable todos={laterTodos} due={Due.Later} />
      <ArchiveToggleButton />
      {showArchive ? (
        <TodoTable todos={archivedTodos} due={Due.Archived} />
      ) : null}
    </div>
  );
}

export default Todos;
