import React from "react";
import { Card, Modal } from "react-bootstrap";
import { useAppSelector } from "../../app/hooks";
import { useAppContext } from "../../context/context";
import { selectProjects } from "../../features/projects/selectors";
import { selectActiveTodo } from "../../features/todos/selectors";
import { truncateUrl } from "../../shared/util";
import { PomodoroDisplay } from "../PomodoroDisplay";

export function ActiveTodoModal() {
  const activeTodo = useAppSelector(selectActiveTodo);
  const projects = useAppSelector(selectProjects);
  const { setActiveModal } = useAppContext();

  if (!activeTodo) return null;
  const { name, poms, completedPoms, links, projectId } = activeTodo;
  const [link] = links;

  const projectName =
    projects.find((project) => project.id === projectId)?.title || "";

  return (
    <Modal
      show={true}
      onHide={() => setActiveModal("")}
      style={{ textAlign: "center" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Active Todo</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <PomodoroDisplay />
        <Card style={{ width: "18rem", marginTop: "15px" }}>
          <Card.Body>
            <Card.Title>{name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {projectName}
            </Card.Subtitle>
            <Card.Text>
              {completedPoms || 0}/{poms || 0} poms complete
            </Card.Text>
            <Card.Link href={link.url}>{truncateUrl(link.url)}</Card.Link>
          </Card.Body>
        </Card>
      </Modal.Body>
    </Modal>
  );
}
