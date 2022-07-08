import React from "react";
import cn from "classnames";
import { useNavigate } from "react-router";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { TodoRow } from "./TodoRow";
import { Due } from "../../shared/due.type";
import { Todo } from "../../shared/todo";
import { SmallEditIconButton } from "../icon-buttons/SmallEditIconButton";
import { SmallPieChartIconButton } from "../icon-buttons/SmallPieChartIconButton";

type Props = {
  todos: Todo[];
  due: Due;
};

export function TodoTable({ todos, due }: Props) {
  const navigate = useNavigate();
  const navigateToProjects = () => navigate("/projects");
  return (
    <div
      className={cn({ "main-todos": due !== Due.Archived })}
      style={{ textAlign: "left" }}
    >
      <Table className="table" size="sm">
        <thead>
          <tr>
            <th className="done">{due === Due.Archived ? "Date" : "Do"}</th>
            <th className="name">Name</th>
            <th className="poms">Exp.</th>
            <th className="poms">Cpl.</th>
            <th className="project">
              <span style={{ marginRight: "10px" }}>Project</span>
              {due === Due.Archived ? (
                <Link to="/analytics">
                  <SmallPieChartIconButton />
                </Link>
              ) : (
                <SmallEditIconButton onClick={navigateToProjects} />
              )}
            </th>
            <th className="links">Link</th>
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
