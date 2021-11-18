import React from "react";
import { Table } from "react-bootstrap";
import { useAppContext } from "../context/context";
import { Due } from "../shared/due.type";
import { Todo } from "../shared/todo";
import { SmallEditIconButton } from "./icon-buttons/SmallEditIconButton";
import { SmallPieChartIconButton } from "./icon-buttons/SmallPieChartIconButton";
import { TodoRow } from "./TodoRow";

type Props = {
  todos: Todo[];
  due: Due;
};

export function TodoTable({ todos, due }: Props) {
  const { setShowProjectAnalytics, setShowEditProjects } = useAppContext();
  return (
    <div
      className={due !== Due.Archived ? "main-todos" : ""}
      style={{ textAlign: "left" }}
    >
      <Table className="table" size="sm">
        <thead>
          <tr>
            <th className="done">{due === Due.Archived ? "Date" : "Do"}</th>
            <th className="name">Name</th>
            <th className="poms">Poms</th>
            <th className="project">
              <span style={{ marginRight: "10px" }}>Project</span>
              {due === Due.Archived ? (
                <SmallPieChartIconButton
                  onClick={() => setShowProjectAnalytics(true)}
                />
              ) : (
                <SmallEditIconButton onClick={() => setShowEditProjects(true)} />
              )}
            </th>
            <th className="links">Links</th>
            <th className="actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <TodoRow key={todo.id} todo={todo} />
          ))}
        </tbody>
      </Table>
    </div>
  );
}
