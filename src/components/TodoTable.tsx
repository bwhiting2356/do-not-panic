import React, { useState } from "react";
import { Modal, Table } from "react-bootstrap";
import { Pencil } from "react-bootstrap-icons";
import { useAppContext } from "../context/context";
import { Due } from "../shared/due.type";
import { Todo } from "../shared/todo";
import { EditProjectsModal } from "./EditProjectsModal";
import { EditIconButton } from "./icon-buttons/SmallEditIconButton";
import { PieChartIconButton } from "./icon-buttons/SmallPieChartIconButton";
import { ProjectAnalytics } from "./ProjectAnalytics";
import { TodoRow } from "./TodoRow";

type Props = {
  todos: Todo[];
  due: Due;
};

export function TodoTable({ todos, due }: Props) {
  const {
    showProjectAnalytics,
    setShowProjectAnalytics,
    showEditProjects,
    setShowEditProjects
  } = useAppContext();
  const toggleProjectAnalytics = () => setShowProjectAnalytics(!showProjectAnalytics);
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

  const editProjectsModal = (
    <EditProjectsModal
        show={showEditProjects}
        toggleEditProjects={() => setShowEditProjects(!showEditProjects)}
      />
  )
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
                  <PieChartIconButton
                    onClick={() => setShowProjectAnalytics(true)}
                  />
                ) : (
                  <EditIconButton onClick={ () => setShowEditProjects(true)}/>
                )}

              {projectAnalyticsModal}
              {editProjectsModal}
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
