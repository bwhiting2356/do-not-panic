import React, { useState } from "react";
import { Modal, Table } from "react-bootstrap";
import { Due } from "../shared/due.type";
import { Todo } from "../shared/todo.interface";
import { PieChartIconButton } from "./icon-buttons/PieChartIconButton";
import { ProjectAnalytics } from "./ProjectAnalytics";
import { TodoRow } from "./TodoRow";

type Props = {
  todos: Todo[];
  due: Due;
};

export function TodoTable({ todos, due }: Props) {
  const [showProjectAnalytics, setShowProjectAnalytics] = useState(false);
  const toggleProjectAnalytics = () => setShowProjectAnalytics((show) => !show);
  const projectAnalyticsModal = (
    <Modal
      show={showProjectAnalytics}
      onHide={toggleProjectAnalytics}
      style={{ textAlign: "center" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Archived Todo Total Poms by Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ProjectAnalytics />
      </Modal.Body>
    </Modal>
  );
  return (
    <div
      className={due !== Due.Archived ? "main-todos" : ""}
      style={{ textAlign: "left" }}
    >
      <Table striped bordered hover className="table" size="sm">
        <thead>
          <tr>
            <th className="done">{due === Due.Archived ? "Date" : "Do"}</th>
            <th className="name">Name</th>
            <th className="poms">Poms</th>
            <th className="links">Links</th>
            <th className="project">
              <span style={{ marginRight: "10px" }}>Project</span>
              {due === Due.Archived ? (
                <PieChartIconButton
                  onClick={() => setShowProjectAnalytics(true)}
                />
              ) : null}
              {projectAnalyticsModal}
            </th>
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
