import React from "react";
import { ListGroup, Modal, Table } from "react-bootstrap";
import { useAppSelector } from "../../app/hooks";
import { useAppContext } from "../../context/context";
import { selectProjects } from "../../features/projects/selectors";
import { selectActiveTodo } from "../../features/todos/selectors";
import { Project } from "../../shared/project";
import { truncateUrl } from "../../shared/util";
import { PomodoroTimer } from "../header/pomodoro-timer/PomodoroTimer";

export function ActiveTodoModal() {
  const activeTodo = useAppSelector(selectActiveTodo);
  const projects = useAppSelector(selectProjects);
  const { setActiveModal } = useAppContext();

  if (!activeTodo) return null;
  const {
    id,
    done,
    name,
    poms,
    completedPoms,
    links,
    projectId,
    archivedDate,
    due,
  } = activeTodo;
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
      <Modal.Body>
        <PomodoroTimer showMinuteOptions={false} />
        <ListGroup>
          <ListGroup.Item>Work on {name}</ListGroup.Item>
          <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
          <ListGroup.Item>Morbi leo risus</ListGroup.Item>
          <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
          <ListGroup.Item>
            <a className="url" target="_blank" rel="noreferrer" href={link.url}>
              {truncateUrl(link.url)}
            </a>
          </ListGroup.Item>
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
}
